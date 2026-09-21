const ATTENDANCE_BACKUP_SHEET = "AttendanceMigrationBackup";

function auditAttendanceIntegrity(currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, {
      roles: ["Mudir", "Admin"],
    });
    return { ok: true, data: ATT_auditIntegrity_(sessionUser) };
  } catch (e) {
    return { ok: false, message: "Audit absensi gagal: " + e.message };
  }
}

function repairAttendanceIntegrity(options, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, {
      roles: ["Mudir", "Admin"],
    });
    options = options || {};
    const dryRun = options.dryRun !== false;
    const before = ATT_auditIntegrity_(sessionUser);
    const actions = {
      usersMapped: before.summary.usersMissingTeacherSourceId,
      schedulesRegenerated:
        typeof MASTER_ATTENDANCE_SCHEDULES !== "undefined"
          ? MASTER_ATTENDANCE_SCHEDULES.length
          : 0,
      draftSessionsBackedUp: before.cleanupCandidates.length,
      draftSessionsRemoved: before.cleanupCandidates.length,
    };

    if (dryRun) {
      return {
        ok: true,
        message: "Pratinjau perbaikan selesai. Belum ada data yang diubah.",
        data: { dryRun: true, before, actions },
      };
    }

    setupCoreSheets();
    const teachers = seedMissingTeachersFromMasterSchedule_(sessionUser);
    const schedules = seedMasterAttendanceSchedules_();
    const cleanup = ATT_backupAndRemoveDraftSessions_(
      before.cleanupCandidates,
      sessionUser,
    );
    PropertiesService.getScriptProperties().setProperty(
      "ATT_MASTER_DATA_VERSION",
      typeof ATTENDANCE_MASTER_DATA_VERSION !== "undefined"
        ? ATTENDANCE_MASTER_DATA_VERSION
        : "2026-09-15.1",
    );
    CacheService.getScriptCache().removeAll([
      ATTENDANCE_STORAGE_CACHE_KEY,
      ATTENDANCE_SCHEDULE_STATUS_CACHE_KEY,
    ]);
    AUTH_appendAuditLog_("REPAIR", "AttendanceIntegrity", "MASTER", sessionUser, {
      teachers,
      schedules,
      cleanup,
    });

    const after = ATT_auditIntegrity_(sessionUser);
    return {
      ok: true,
      message: "Perbaikan integritas absensi selesai.",
      data: {
        dryRun: false,
        before,
        after,
        actions: { teachers, schedules, cleanup },
      },
    };
  } catch (e) {
    return { ok: false, message: "Perbaikan absensi gagal: " + e.message };
  }
}

function ATT_auditIntegrity_(sessionUser) {
  setupSheetWithHeaders_(SHEET_USERS, USER_HEADERS);
  setupAttendanceSheets_();
  setupSheetWithHeaders_(SHEET_SCHEDULES, CORE_SHEET_SCHEMAS.Schedules);
  setupSheetWithHeaders_("Students", CORE_SHEET_SCHEMAS.Students);

  const users = AUTH_getUsersByUsername_();
  const schedules = ATT_sheetToObjects_(getSheet_(SHEET_SCHEDULES)).map(
    ATT_normalizeSchedule_,
  );
  const students = ATT_sheetToObjects_(getSheet_("Students"));
  const sessions = ATT_getSessionObjects_();
  const attendance = ATT_getAttendanceObjects_();
  const issues = [];

  const usersByUsername = ATT_groupBy_(users, (user) =>
    normalizeUsername_(user.Username),
  );
  const usersById = ATT_indexBy_(users, "UserID");
  const schedulesById = ATT_groupBy_(schedules, (schedule) => schedule.ScheduleID);
  const studentsById = ATT_indexBy_(students, "StudentID");
  const sessionsById = ATT_groupBy_(sessions, (session) => session.SessionID);
  const activeSchedules = schedules.filter((schedule) => schedule.IsActive);
  const activeStudents = students.filter((student) => {
    const status = String(student.Status || "Active").trim().toLowerCase();
    return status !== "inactive" && status !== "nonaktif" && !student.DeletedAt;
  });
  const scheduleClasses = {};
  activeSchedules.forEach((schedule) => {
    if (schedule.ClassOrGroupName) scheduleClasses[ATT_normalizeClassKey_(schedule.ClassOrGroupName)] = true;
  });

  Object.keys(usersByUsername).forEach((username) => {
    const group = usersByUsername[username];
    if (username && group.length > 1) {
      issues.push(ATT_issue_("warning", "duplicate_username", username, {
        count: group.length,
        userIds: group.map((user) => user.UserID),
      }));
    }
  });

  const masterTeachers =
    typeof MASTER_SCHEDULE_TEACHERS !== "undefined" ? MASTER_SCHEDULE_TEACHERS : [];
  masterTeachers.forEach((teacher) => {
    const matches = usersByUsername[normalizeUsername_(teacher.Username)] || [];
    if (!matches.length) {
      issues.push(ATT_issue_("critical", "teacher_account_missing", teacher.TeacherSourceID, {
        username: teacher.Username,
      }));
      return;
    }
    matches.forEach((user) => {
      if (String(user.TeacherSourceID || "") !== String(teacher.TeacherSourceID)) {
        issues.push(ATT_issue_("warning", "user_teacher_source_missing", user.UserID, {
          username: user.Username,
          expected: teacher.TeacherSourceID,
        }));
      }
      if (["inactive", "nonaktif"].includes(String(user.Status || "").toLowerCase())) {
        issues.push(ATT_issue_("warning", "teacher_account_inactive", user.UserID, {
          username: user.Username,
        }));
      }
    });
  });

  Object.keys(schedulesById).forEach((scheduleId) => {
    if (scheduleId && schedulesById[scheduleId].length > 1) {
      issues.push(ATT_issue_("critical", "duplicate_schedule_id", scheduleId, {
        count: schedulesById[scheduleId].length,
      }));
    }
  });

  const exactScheduleGroups = ATT_groupBy_(schedules, (schedule) => [
    schedule.Type,
    ATT_teacherKey_(schedule),
    schedule.SubjectOrActivityName,
    schedule.ClassOrGroupName,
    schedule.DayOfWeek,
    schedule.StartTime,
    schedule.EndTime,
  ].join("|"));
  Object.keys(exactScheduleGroups).forEach((key) => {
    if (exactScheduleGroups[key].length > 1) {
      issues.push(ATT_issue_("warning", "duplicate_schedule", key, {
        scheduleIds: exactScheduleGroups[key].map((schedule) => schedule.ScheduleID),
      }));
    }
  });

  schedules.forEach((schedule) => {
    const teacherUsers = usersByUsername[normalizeUsername_(schedule.TeacherID)] || [];
    if (!teacherUsers.length) {
      issues.push(ATT_issue_("critical", "schedule_teacher_missing", schedule.ScheduleID, {
        teacherId: schedule.TeacherID,
      }));
    }
    const expectedSourceId = ATT_sourceIdForUsername_(schedule.TeacherID);
    if (expectedSourceId && schedule.TeacherSourceID !== expectedSourceId) {
      issues.push(ATT_issue_("warning", "schedule_teacher_source_mismatch", schedule.ScheduleID, {
        expected: expectedSourceId,
        actual: schedule.TeacherSourceID,
      }));
    }
    if (!ATTENDANCE_TYPES.includes(schedule.Type) || !schedule.DayOfWeek) {
      issues.push(ATT_issue_("critical", "schedule_invalid", schedule.ScheduleID, {}));
    }
  });

  activeStudents.forEach((student) => {
    const className = ATT_studentClass_(student);
    if (!className) {
      issues.push(ATT_issue_("critical", "student_class_missing", student.StudentID, {
        name: student.Name,
      }));
    } else if (!scheduleClasses[ATT_normalizeClassKey_(className)]) {
      issues.push(ATT_issue_("warning", "student_class_without_schedule", student.StudentID, {
        name: student.Name,
        className,
      }));
    }
    if (!ATT_normalizeGenderGroup_(student.Gender)) {
      issues.push(ATT_issue_("warning", "student_gender_missing", student.StudentID, {
        name: student.Name,
        className,
      }));
    }
  });

  const sessionGroups = ATT_groupBy_(sessions, ATT_sessionLookupKey_);
  const cleanupCandidates = [];
  Object.keys(sessionGroups).forEach((key) => {
    const group = sessionGroups[key].sort(ATT_compareSessionPriority_);
    group.forEach((session, index) => {
      const emptyDraft =
        String(session.Status || "").toLowerCase() !== "submitted" &&
        Number(session.TotalStudents || 0) === 0;
      if (index > 0) {
        issues.push(ATT_issue_("warning", "duplicate_session", session.SessionID, { key }));
        if (emptyDraft) cleanupCandidates.push(ATT_cleanupCandidate_(session, "duplicate-empty-draft"));
      }
    });
  });

  sessions.forEach((session) => {
    const scheduleId = String(session.ScheduleID || "").trim();
    if (scheduleId && !schedulesById[scheduleId]) {
      issues.push(ATT_issue_("warning", "session_schedule_missing", session.SessionID, {
        scheduleId,
      }));
      if (
        String(session.Status || "").toLowerCase() !== "submitted" &&
        Number(session.TotalStudents || 0) === 0
      ) {
        cleanupCandidates.push(ATT_cleanupCandidate_(session, "orphan-empty-draft"));
      }
    }
  });

  attendance.forEach((record) => {
    if (record.StudentID && !studentsById[String(record.StudentID)]) {
      issues.push(ATT_issue_("warning", "attendance_student_missing", record.AttendanceID, {
        studentId: record.StudentID,
      }));
    }
    if (record.SessionID && !sessionsById[String(record.SessionID)]) {
      issues.push(ATT_issue_("warning", "attendance_session_missing", record.AttendanceID, {
        sessionId: record.SessionID,
      }));
    }
  });

  const uniqueCleanup = ATT_uniqueBy_(
    cleanupCandidates,
    (item) => item.SessionID + "|" + item.SourceRow,
  );
  const matrix = ATT_scheduleMatrix_(activeSchedules, masterTeachers);
  const critical = issues.filter((issue) => issue.severity === "critical").length;
  const warning = issues.length - critical;
  return {
    auditedAt: new Date().toISOString(),
    viewerContext: ATT_viewerContext_(sessionUser),
    summary: {
      users: users.length,
      masterTeachers: masterTeachers.length,
      schedules: schedules.length,
      activeSchedules: activeSchedules.length,
      students: activeStudents.length,
      sessions: sessions.length,
      attendanceRecords: attendance.length,
      critical,
      warning,
      usersMissingTeacherSourceId: issues.filter(
        (issue) => issue.code === "user_teacher_source_missing",
      ).length,
      schedulesMissingTeacherSourceId: issues.filter(
        (issue) => issue.code === "schedule_teacher_source_mismatch",
      ).length,
    },
    matrix,
    issues,
    cleanupCandidates: uniqueCleanup,
  };
}

function ATT_backupAndRemoveDraftSessions_(candidates, sessionUser) {
  const uniqueCandidates = ATT_uniqueBy_(
    candidates || [],
    (item) => item.SessionID + "|" + item.SourceRow,
  );
  if (!uniqueCandidates.length) return { backedUp: 0, removed: 0 };

  setupSheetWithHeaders_(
    ATTENDANCE_BACKUP_SHEET,
    CORE_SHEET_SCHEMAS.AttendanceMigrationBackup,
  );
  const backupSheet = getSheet_(ATTENDANCE_BACKUP_SHEET);
  const backupHeaders = ATT_headers_(backupSheet);
  const sessionSheet = getSheet_(SHEET_ATTENDANCE_SESSIONS);
  const sessions = ATT_sheetToObjects_(sessionSheet);
  const targetByRow = ATT_indexBy_(uniqueCandidates, "SourceRow");
  const existingBackups = ATT_sheetToObjects_(backupSheet);
  const backedUpKeys = {};
  existingBackups.forEach((item) => {
    if (item.SourceSheet === SHEET_ATTENDANCE_SESSIONS && item.RecordID) {
      backedUpKeys[String(item.RecordID) + "|" + String(item.SourceRow || "")] = true;
    }
  });
  const now = new Date().toISOString();
  const backupRows = [];
  const rowsToDelete = [];
  sessions.forEach((session) => {
    const candidate = targetByRow[String(session._rowNumber || "")];
    if (!candidate) return;
    const backupKey = String(session.SessionID) + "|" + String(session._rowNumber || "");
    if (!backedUpKeys[backupKey]) {
      const data = {
        BackupID: "BAK" + Utilities.getUuid().slice(0, 12).toUpperCase(),
        SourceSheet: SHEET_ATTENDANCE_SESSIONS,
        SourceRow: session._rowNumber,
        RecordID: session.SessionID,
        Reason: candidate.Reason,
        PayloadJson: JSON.stringify(session),
        BackedUpAt: now,
        BackedUpBy: sessionUser.Username,
      };
      backupRows.push(backupHeaders.map((header) => data[header] !== undefined ? data[header] : ""));
      backedUpKeys[backupKey] = true;
    }
    rowsToDelete.push(session._rowNumber);
  });

  if (backupRows.length) {
    backupSheet
      .getRange(backupSheet.getLastRow() + 1, 1, backupRows.length, backupHeaders.length)
      .setValues(backupRows);
  }
  rowsToDelete.sort((a, b) => b - a).forEach((rowNumber) => sessionSheet.deleteRow(rowNumber));
  return { backedUp: backupRows.length, removed: rowsToDelete.length };
}

function ATT_scheduleMatrix_(schedules, teachers) {
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Ahad"];
  const result = [];
  (teachers || []).forEach((teacher) => {
    days.forEach((day) => {
      ATTENDANCE_TYPES.forEach((type) => {
        const matches = schedules.filter((schedule) =>
          schedule.DayOfWeek === day &&
          schedule.Type === type &&
          ATT_teacherKey_(schedule) === "source:" + teacher.TeacherSourceID,
        );
        result.push({
          TeacherSourceID: teacher.TeacherSourceID,
          Username: teacher.Username,
          DayOfWeek: day,
          Type: type,
          ScheduleCount: matches.length,
          MergedCardCount: ATT_mergeContiguousSchedules_(matches).length,
        });
      });
    });
  });
  return result;
}

function ATT_issue_(severity, code, entityId, details) {
  return { severity, code, entityId: String(entityId || ""), details: details || {} };
}

function ATT_cleanupCandidate_(session, reason) {
  return {
    SessionID: String(session.SessionID || ""),
    SourceRow: session._rowNumber,
    Reason: reason,
  };
}

function ATT_groupBy_(items, keyFactory) {
  const groups = {};
  (items || []).forEach((item) => {
    const key = String(keyFactory(item) || "");
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}

function ATT_indexBy_(items, keyName) {
  const result = {};
  (items || []).forEach((item) => {
    const key = String(item && item[keyName] || "");
    if (key) result[key] = item;
  });
  return result;
}

function ATT_uniqueBy_(items, keyFactory) {
  const seen = {};
  return (items || []).filter((item) => {
    const key = String(keyFactory(item) || "");
    if (!key || seen[key]) return false;
    seen[key] = true;
    return true;
  });
}
