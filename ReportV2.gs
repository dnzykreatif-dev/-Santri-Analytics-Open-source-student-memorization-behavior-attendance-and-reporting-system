const SHEET_ACADEMIC_TEACHER_ASSIGNMENTS = "AcademicTeacherAssignments";
const SHEET_EXAM_ELIGIBILITY_OVERRIDES = "ExamEligibilityOverrides";

const ACADEMIC_TEACHER_ASSIGNMENT_HEADERS = [
  "AssignmentID",
  "PeriodID",
  "SubjectID",
  "ClassOrGroupName",
  "TeacherSourceID",
  "TeacherID",
  "IsActive",
  "CreatedBy",
  "CreatedAt",
  "UpdatedAt",
];

const EXAM_ELIGIBILITY_OVERRIDE_HEADERS = [
  "OverrideID",
  "PeriodID",
  "StudentID",
  "Decision",
  "Reason",
  "ApprovedBy",
  "ApprovedAt",
  "RevokedBy",
  "RevokedAt",
  "UpdatedAt",
];

const REPORT_DEFAULT_ATTENDANCE_THRESHOLD = 75;
const REPORT_DEFAULT_ELIGIBILITY_CATEGORIES = ["KBM", "Pondok", "Kegiatan"];

function setupReportV2Sheets_() {
  return {
    assignments: setupSheetWithHeaders_(
      SHEET_ACADEMIC_TEACHER_ASSIGNMENTS,
      ACADEMIC_TEACHER_ASSIGNMENT_HEADERS,
    ),
    overrides: setupSheetWithHeaders_(
      SHEET_EXAM_ELIGIBILITY_OVERRIDES,
      EXAM_ELIGIBILITY_OVERRIDE_HEADERS,
    ),
  };
}

function REPORT_getRows_(sheetName) {
  const sheet = getSheet_(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map((header) => String(header || "").trim());
  return values
    .slice(1)
    .filter((row) => row.some((cell) => cell !== "" && cell !== null))
    .map((row, index) => {
      const item = serializeRow(row, headers);
      item._rowNumber = index + 2;
      return item;
    });
}

function REPORT_getStudent_(studentId) {
  const student = REPORT_getRows_("Students").find(
    (item) => String(item.StudentID || "") === String(studentId || ""),
  );
  return student && !String(student.DeletedAt || "").trim() ? student : null;
}

function REPORT_text_(value) {
  return String(value === null || value === undefined ? "" : value).trim();
}

function REPORT_key_(value) {
  return REPORT_text_(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function REPORT_dateKey_(value) {
  if (!value) return "";
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  const text = REPORT_text_(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  const parsed = new Date(text);
  return isNaN(parsed.getTime())
    ? ""
    : Utilities.formatDate(parsed, Session.getScriptTimeZone(), "yyyy-MM-dd");
}

function REPORT_inPeriod_(value, period) {
  const date = REPORT_dateKey_(value);
  if (!date) return false;
  const start = REPORT_dateKey_(period && period.StartDate);
  const end = REPORT_dateKey_(period && period.EndDate);
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
}

function REPORT_isWaliLinked_(user, student) {
  const username = normalizePhoneNumber((user && user.Username) || "");
  const phone = normalizePhoneNumber((user && user.Phone) || "");
  const wali = normalizePhoneNumber((student && student.WaliUsername) || "");
  const parent = normalizePhoneNumber((student && student.ParentContact) || "");
  return (
    (!!wali && (wali === username || wali === phone)) ||
    (!!parent && (parent === username || parent === phone)) ||
    (REPORT_text_(user && user.StudentID) !== "" &&
      REPORT_text_(user.StudentID) === REPORT_text_(student && student.StudentID))
  );
}

function REPORT_teacherSourceId_(user) {
  if (typeof ATT_userTeacherSourceId_ === "function") {
    return REPORT_text_(ATT_userTeacherSourceId_(user));
  }
  return REPORT_text_(user && user.TeacherSourceID);
}

function REPORT_isTeacherRelatedToStudent_(user, student, periodId) {
  const sourceId = REPORT_teacherSourceId_(user);
  const username = REPORT_key_(user && user.Username);
  const studentClass = REPORT_key_(
    student && (student["Class/Level"] || student.Class || student.Kelas),
  );
  if (!studentClass) return false;

  const assignmentMatch = REPORT_getRows_(
    SHEET_ACADEMIC_TEACHER_ASSIGNMENTS,
  ).some((assignment) => {
    if (!AC_bool_(assignment.IsActive)) return false;
    if (periodId && REPORT_text_(assignment.PeriodID) !== REPORT_text_(periodId)) {
      return false;
    }
    const teacherMatches = sourceId
      ? REPORT_text_(assignment.TeacherSourceID) === sourceId
      : REPORT_key_(assignment.TeacherID) === username;
    return (
      teacherMatches &&
      REPORT_key_(assignment.ClassOrGroupName) === studentClass
    );
  });
  if (assignmentMatch) return true;

  return REPORT_getRows_("Schedules").some((schedule) => {
    if (String(schedule.IsActive).toLowerCase() === "false") return false;
    if (REPORT_key_(schedule.ClassOrGroupName) !== studentClass) return false;
    if (typeof ATT_isTeacherAssigned_ === "function") {
      return ATT_isTeacherAssigned_(schedule, user);
    }
    return sourceId
      ? REPORT_text_(schedule.TeacherSourceID) === sourceId
      : REPORT_key_(schedule.TeacherID) === username;
  });
}

function REPORT_canViewStudent_(user, student, periodId) {
  const role = REPORT_text_(user && user.Role);
  if (["Mudir", "Admin"].includes(role)) return true;
  if (role === "Wali") return REPORT_isWaliLinked_(user, student);
  if (role === "Ustadz") {
    return REPORT_isTeacherRelatedToStudent_(user, student, periodId);
  }
  return false;
}

function REPORT_requireStudentAccess_(user, student, periodId) {
  if (!REPORT_canViewStudent_(user, student, periodId)) {
    throw new Error("Akses raport santri ditolak.");
  }
}

function REPORT_getTeacherAssignmentsForUser_(user) {
  const assignments = REPORT_getRows_(SHEET_ACADEMIC_TEACHER_ASSIGNMENTS);
  if (["Mudir", "Admin"].includes(REPORT_text_(user && user.Role))) {
    return assignments;
  }
  const sourceId = REPORT_teacherSourceId_(user);
  const username = REPORT_key_(user && user.Username);
  return assignments.filter((assignment) =>
    sourceId
      ? REPORT_text_(assignment.TeacherSourceID) === sourceId
      : REPORT_key_(assignment.TeacherID) === username,
  );
}

function REPORT_getTeacherOptions_() {
  const seen = {};
  return REPORT_getRows_("Schedules")
    .map((schedule) => ({
      TeacherSourceID: REPORT_text_(schedule.TeacherSourceID),
      TeacherID: REPORT_text_(schedule.TeacherID),
    }))
    .filter((teacher) => teacher.TeacherSourceID || teacher.TeacherID)
    .filter((teacher) => {
      const key = teacher.TeacherSourceID || REPORT_key_(teacher.TeacherID);
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    })
    .sort((a, b) => a.TeacherID.localeCompare(b.TeacherID, "id"));
}

function REPORT_teacherHasAcademicAssignment_(user, periodId, subjectId, className) {
  if (["Mudir", "Admin"].includes(REPORT_text_(user && user.Role))) return true;
  if (REPORT_text_(user && user.Role) !== "Ustadz") return false;
  const sourceId = REPORT_teacherSourceId_(user);
  const username = REPORT_key_(user && user.Username);
  return REPORT_getRows_(SHEET_ACADEMIC_TEACHER_ASSIGNMENTS).some(
    (assignment) =>
      AC_bool_(assignment.IsActive) &&
      REPORT_text_(assignment.PeriodID) === REPORT_text_(periodId) &&
      REPORT_text_(assignment.SubjectID) === REPORT_text_(subjectId) &&
      REPORT_key_(assignment.ClassOrGroupName) === REPORT_key_(className) &&
      (sourceId
        ? REPORT_text_(assignment.TeacherSourceID) === sourceId
        : REPORT_key_(assignment.TeacherID) === username),
  );
}

function REPORT_filterAcademicStudents_(students, periodId, subjectId, user) {
  if (["Mudir", "Admin"].includes(REPORT_text_(user && user.Role))) {
    return students;
  }
  return (students || []).filter((student) =>
    REPORT_teacherHasAcademicAssignment_(
      user,
      periodId,
      subjectId,
      AC_getStudentClass_(student),
    ),
  );
}

function REPORT_validateAcademicScoreAccess_(items, periodId, subjectId, user) {
  if (["Mudir", "Admin"].includes(REPORT_text_(user && user.Role))) {
    return { ok: true };
  }
  const studentMap = {};
  AC_getStudents_().forEach((student) => {
    studentMap[REPORT_text_(student.StudentID)] = student;
  });
  const denied = (items || []).filter((item) => {
    const student = studentMap[REPORT_text_(item.StudentID)];
    return (
      !student ||
      !REPORT_teacherHasAcademicAssignment_(
        user,
        periodId,
        subjectId,
        AC_getStudentClass_(student),
      )
    );
  });
  return denied.length
    ? { ok: false, message: "Akses nilai ditolak untuk kelas yang tidak ditugaskan." }
    : { ok: true };
}

function saveAcademicTeacherAssignment(assignment, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupReportV2Sheets_();
  const input = assignment || {};
  const periodId = REPORT_text_(input.PeriodID);
  const subjectId = REPORT_text_(input.SubjectID);
  const className = REPORT_text_(input.ClassOrGroupName);
  const teacherSourceId = REPORT_text_(input.TeacherSourceID);
  const teacherId = REPORT_text_(input.TeacherID);
  if (!periodId || !subjectId || !className || (!teacherSourceId && !teacherId)) {
    return { ok: false, message: "Periode, mapel, kelas, dan guru wajib diisi." };
  }
  if (!AC_getPeriod_(periodId) || !AC_getSubject_(subjectId)) {
    return { ok: false, message: "Periode atau mapel tidak ditemukan." };
  }

  const sheet = getSheet_(SHEET_ACADEMIC_TEACHER_ASSIGNMENTS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const now = new Date().toISOString();
  const assignmentId = REPORT_text_(input.AssignmentID);
  const existing = assignmentId
    ? REPORT_getRows_(SHEET_ACADEMIC_TEACHER_ASSIGNMENTS).find(
        (item) => REPORT_text_(item.AssignmentID) === assignmentId,
      )
    : null;
  const duplicate = REPORT_getRows_(SHEET_ACADEMIC_TEACHER_ASSIGNMENTS).find(
    (item) =>
      REPORT_text_(item.AssignmentID) !== assignmentId &&
      REPORT_text_(item.PeriodID) === periodId &&
      REPORT_text_(item.SubjectID) === subjectId &&
      REPORT_key_(item.ClassOrGroupName) === REPORT_key_(className) &&
      (REPORT_text_(item.TeacherSourceID) || REPORT_key_(item.TeacherID)) ===
        (teacherSourceId || REPORT_key_(teacherId)),
  );
  if (duplicate) {
    return { ok: false, message: "Penugasan yang sama sudah tersedia." };
  }
  const row = {
    AssignmentID: assignmentId || "ASN-" + Utilities.getUuid().slice(0, 8).toUpperCase(),
    PeriodID: periodId,
    SubjectID: subjectId,
    ClassOrGroupName: className,
    TeacherSourceID: teacherSourceId,
    TeacherID: teacherId,
    IsActive: input.IsActive === false ? false : true,
    CreatedBy: existing ? existing.CreatedBy : sessionUser.Username,
    CreatedAt: existing ? existing.CreatedAt : now,
    UpdatedAt: now,
  };
  const values = headers.map((header) =>
    row[header] === undefined ? "" : row[header],
  );
  if (existing) {
    sheet.getRange(existing._rowNumber, 1, 1, headers.length).setValues([values]);
  } else {
    sheet.appendRow(values);
  }
  AUTH_appendAuditLog_("UPSERT", "AcademicTeacherAssignment", row.AssignmentID, sessionUser, {
    PeriodID: periodId,
    SubjectID: subjectId,
    ClassOrGroupName: className,
    TeacherSourceID: teacherSourceId,
  });
  return { ok: true, data: row, message: "Penugasan guru tersimpan." };
}

function setAcademicTeacherAssignmentStatus(assignmentId, isActive, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupReportV2Sheets_();
  const assignment = REPORT_getRows_(SHEET_ACADEMIC_TEACHER_ASSIGNMENTS).find(
    (item) => REPORT_text_(item.AssignmentID) === REPORT_text_(assignmentId),
  );
  if (!assignment) return { ok: false, message: "Penugasan tidak ditemukan." };
  const sheet = getSheet_(SHEET_ACADEMIC_TEACHER_ASSIGNMENTS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  assignment.IsActive = !!isActive;
  assignment.UpdatedAt = new Date().toISOString();
  sheet
    .getRange(assignment._rowNumber, 1, 1, headers.length)
    .setValues([
      headers.map((header) =>
        assignment[header] === undefined ? "" : assignment[header],
      ),
    ]);
  AUTH_appendAuditLog_("STATUS", "AcademicTeacherAssignment", assignmentId, sessionUser, {
    IsActive: !!isActive,
  });
  return { ok: true, message: "Status penugasan diperbarui." };
}

function syncAcademicTeacherAssignmentsFromSchedules(periodId, apply, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupReportV2Sheets_();
  if (!AC_getPeriod_(periodId)) {
    return { ok: false, message: "Periode tidak ditemukan." };
  }
  const subjects = AC_getSubjects_().filter((subject) => AC_bool_(subject.IsActive));
  const existing = REPORT_getRows_(SHEET_ACADEMIC_TEACHER_ASSIGNMENTS);
  const matches = [];
  const unmatched = [];
  const assignmentKeys = {};
  existing.forEach((item) => {
    assignmentKeys[
      [
        REPORT_text_(item.PeriodID),
        REPORT_text_(item.SubjectID),
        REPORT_key_(item.ClassOrGroupName),
        REPORT_text_(item.TeacherSourceID) || REPORT_key_(item.TeacherID),
      ].join("|")
    ] = true;
  });
  REPORT_getRows_("Schedules")
    .filter((schedule) => REPORT_key_(schedule.Type) === "kbm")
    .filter((schedule) => String(schedule.IsActive).toLowerCase() !== "false")
    .forEach((schedule) => {
      const subject = subjects.find(
        (item) => REPORT_key_(item.Name) === REPORT_key_(schedule.SubjectOrActivityName),
      );
      if (!subject || !REPORT_text_(schedule.ClassOrGroupName)) {
        unmatched.push({
          scheduleId: schedule.ScheduleID || "",
          subject: schedule.SubjectOrActivityName || "",
          className: schedule.ClassOrGroupName || "",
          teacher: schedule.TeacherID || "",
        });
        return;
      }
      const candidate = {
        PeriodID: periodId,
        SubjectID: subject.SubjectID,
        ClassOrGroupName: schedule.ClassOrGroupName,
        TeacherSourceID: schedule.TeacherSourceID || "",
        TeacherID: schedule.TeacherID || "",
        IsActive: true,
      };
      const assignmentKey = [
        REPORT_text_(periodId),
        REPORT_text_(subject.SubjectID),
        REPORT_key_(schedule.ClassOrGroupName),
        REPORT_text_(schedule.TeacherSourceID) || REPORT_key_(schedule.TeacherID),
      ].join("|");
      const duplicate = !!assignmentKeys[assignmentKey];
      assignmentKeys[assignmentKey] = true;
      matches.push(Object.assign({ alreadyExists: duplicate }, candidate));
    });
  if (apply) {
    const pending = matches.filter((item) => !item.alreadyExists);
    if (pending.length > 0) {
      const sheet = getSheet_(SHEET_ACADEMIC_TEACHER_ASSIGNMENTS);
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const now = new Date().toISOString();
      const rows = pending.map((item) => {
        const row = Object.assign({}, item, {
          AssignmentID: "ASN-" + Utilities.getUuid().slice(0, 8).toUpperCase(),
          CreatedBy: sessionUser.Username,
          CreatedAt: now,
          UpdatedAt: now,
        });
        return headers.map((header) =>
          row[header] === undefined ? "" : row[header],
        );
      });
      sheet
        .getRange(sheet.getLastRow() + 1, 1, rows.length, headers.length)
        .setValues(rows);
    }
    AUTH_appendAuditLog_("SYNC", "AcademicTeacherAssignment", periodId, sessionUser, {
      created: pending.length,
      unmatched: unmatched.length,
    });
  }
  return {
    ok: true,
    data: {
      matches,
      unmatched,
      created: apply ? matches.filter((item) => !item.alreadyExists).length : 0,
    },
    message: apply ? "Penugasan guru disinkronkan." : "Pratinjau sinkronisasi siap.",
  };
}

function REPORT_parseEligibilityCategories_(period) {
  const values = REPORT_text_(period && period.EligibilityCategories)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return values.length ? values : REPORT_DEFAULT_ELIGIBILITY_CATEGORIES.slice();
}

function REPORT_dedupeAttendance_(records) {
  const byKey = {};
  (records || []).forEach((record, index) => {
    const key = REPORT_text_(record.SessionID)
      ? "session:" + REPORT_text_(record.SessionID) + ":" + REPORT_text_(record.StudentID)
      : REPORT_text_(record.AttendanceID)
        ? "attendance:" + REPORT_text_(record.AttendanceID)
        : [
            REPORT_dateKey_(record.AttendanceDate || record.DateLogged),
            REPORT_key_(record.Category),
            REPORT_key_(record.ActivityName),
            REPORT_key_(record.TeacherSourceID || record.TeacherID),
          ].join("|");
    const stamp = new Date(record.UpdatedAt || record.DateLogged || 0).getTime() || index;
    if (!byKey[key] || stamp >= byKey[key].stamp) {
      byKey[key] = { stamp, record };
    }
  });
  return Object.keys(byKey).map((key) => byKey[key].record);
}

function REPORT_calculateAttendanceSummary_(records) {
  const summary = {
    total: 0,
    hadir: 0,
    izin: 0,
    sakit: 0,
    alpa: 0,
    telat: 0,
    attended: 0,
    rawPercentage: null,
    percentage: 0,
  };
  (records || []).forEach((record) => {
    const status = String(record.Status || record.status || "").trim().toLowerCase();
    if (!["hadir", "izin", "sakit", "alpa", "alpha", "telat", "terlambat"].includes(status)) {
      return;
    }
    summary.total++;
    if (status === "hadir") summary.hadir++;
    if (status === "izin") summary.izin++;
    if (status === "sakit") summary.sakit++;
    if (status === "alpa" || status === "alpha") summary.alpa++;
    if (status === "telat" || status === "terlambat") summary.telat++;
  });
  summary.attended = summary.hadir + summary.telat;
  if (summary.total > 0) {
    summary.rawPercentage = (summary.attended / summary.total) * 100;
    summary.percentage = Math.round(summary.rawPercentage * 10) / 10;
  }
  return summary;
}

function REPORT_groupAttendance_(records, keyName) {
  const groups = {};
  (records || []).forEach((record) => {
    const key = REPORT_text_(record[keyName]) || "Tanpa Data";
    if (!groups[key]) groups[key] = [];
    groups[key].push(record);
  });
  return Object.keys(groups)
    .map((key) =>
      Object.assign(REPORT_calculateAttendanceSummary_(groups[key]), {
        name: key,
      }),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "id"));
}

function REPORT_getAttendanceForPeriod_(studentId, period) {
  const categories = REPORT_parseEligibilityCategories_(period);
  const categoryKeys = categories.map(REPORT_key_);
  const records = REPORT_dedupeAttendance_(
    ATT_getAttendanceObjects_()
      .map(ATT_normalizeAttendanceRecord_)
      .filter((record) => REPORT_text_(record.StudentID) === REPORT_text_(studentId))
      .filter((record) => REPORT_inPeriod_(record.AttendanceDate || record.DateLogged, period))
      .filter((record) => categoryKeys.includes(REPORT_key_(record.Category))),
  ).sort(
    (a, b) =>
      REPORT_dateKey_(a.AttendanceDate).localeCompare(REPORT_dateKey_(b.AttendanceDate)) ||
      REPORT_text_(a.ActivityName).localeCompare(REPORT_text_(b.ActivityName), "id"),
  );
  const summary = REPORT_calculateAttendanceSummary_(records);
  summary.categories = categories;
  summary.byCategory = REPORT_groupAttendance_(records, "Category");
  summary.byActivity = REPORT_groupAttendance_(records, "ActivityName");
  summary.records = records;
  return summary;
}

function REPORT_getLatestOverride_(periodId, studentId) {
  return REPORT_getRows_(SHEET_EXAM_ELIGIBILITY_OVERRIDES)
    .filter(
      (item) =>
        REPORT_text_(item.PeriodID) === REPORT_text_(periodId) &&
        REPORT_text_(item.StudentID) === REPORT_text_(studentId),
    )
    .sort(
      (a, b) =>
        new Date(b.UpdatedAt || b.ApprovedAt || b.RevokedAt || 0) -
        new Date(a.UpdatedAt || a.ApprovedAt || a.RevokedAt || 0),
    )[0] || null;
}

function REPORT_resolveEligibilityStatus_(summary, threshold, override) {
  const activeOverride =
    override && REPORT_text_(override.Decision).toLowerCase() === "approved";
  if (summary && summary.total && summary.rawPercentage >= threshold) return "Layak";
  if (activeOverride) return "Disetujui dengan pengecualian";
  if (!summary || !summary.total) return "Data belum cukup";
  return "Tidak layak";
}

function REPORT_buildEligibility_(studentId, period) {
  const attendance = REPORT_getAttendanceForPeriod_(studentId, period);
  const thresholdValue = Number(period && period.AttendanceThreshold);
  const threshold = isNaN(thresholdValue)
    ? REPORT_DEFAULT_ATTENDANCE_THRESHOLD
    : thresholdValue;
  const override = REPORT_getLatestOverride_(period.PeriodID, studentId);
  return {
    periodId: period.PeriodID,
    threshold,
    categories: attendance.categories,
    percentage: attendance.percentage,
    rawPercentage: attendance.rawPercentage,
    total: attendance.total,
    attended: attendance.attended,
    status: REPORT_resolveEligibilityStatus_(attendance, threshold, override),
    override: override
      ? {
          decision: override.Decision,
          reason: override.Reason,
          approvedBy: override.ApprovedBy,
          approvedAt: override.ApprovedAt,
          revokedBy: override.RevokedBy,
          revokedAt: override.RevokedAt,
        }
      : null,
    attendance,
  };
}

function getExamEligibility(periodId, studentId, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, { allowAnonymous: false });
    if (!isReportV2EnabledFor_(sessionUser)) {
      return { ok: false, message: "Fitur kelayakan ujian belum diaktifkan." };
    }
    setupReportV2Sheets_();
    const student = REPORT_getStudent_(studentId);
    const period = AC_getPeriod_(periodId);
    if (!student || !period) {
      return { ok: false, message: "Santri atau periode tidak ditemukan." };
    }
    REPORT_requireStudentAccess_(sessionUser, student, periodId);
    if (sessionUser.Role === "Wali" && REPORT_text_(period.Status) !== "Published") {
      return { ok: false, message: "Raport periode ini belum dipublikasikan." };
    }
    return { ok: true, data: REPORT_buildEligibility_(studentId, period) };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

function saveExamEligibilityOverride(payload, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, {
      roles: ["Mudir", "Admin"],
    });
    if (!isReportV2EnabledFor_(sessionUser)) {
      return { ok: false, message: "Fitur kelayakan ujian belum diaktifkan." };
    }
    setupReportV2Sheets_();
    const input = payload || {};
    const periodId = REPORT_text_(input.PeriodID);
    const studentId = REPORT_text_(input.StudentID);
    const decision = REPORT_text_(input.Decision).toLowerCase();
    const reason = REPORT_text_(input.Reason);
    if (!periodId || !studentId || !["approved", "revoked"].includes(decision)) {
      return { ok: false, message: "Periode, santri, dan keputusan wajib diisi." };
    }
    if (!reason) {
      return { ok: false, message: "Alasan persetujuan atau pencabutan wajib diisi." };
    }
    if (!AC_getPeriod_(periodId) || !REPORT_getStudent_(studentId)) {
      return { ok: false, message: "Santri atau periode tidak ditemukan." };
    }
    const currentEligibility = REPORT_buildEligibility_(
      studentId,
      AC_getPeriod_(periodId),
    );
    if (decision === "approved" && currentEligibility.status === "Layak") {
      return { ok: false, message: "Santri sudah memenuhi ambang kehadiran." };
    }
    if (
      decision === "revoked" &&
      (!currentEligibility.override ||
        REPORT_text_(currentEligibility.override.decision).toLowerCase() !== "approved")
    ) {
      return { ok: false, message: "Tidak ada pengecualian aktif untuk dicabut." };
    }
    const now = new Date().toISOString();
    const row = {
      OverrideID: "OVR-" + Utilities.getUuid().slice(0, 8).toUpperCase(),
      PeriodID: periodId,
      StudentID: studentId,
      Decision: decision === "approved" ? "Approved" : "Revoked",
      Reason: reason,
      ApprovedBy: decision === "approved" ? sessionUser.Username : "",
      ApprovedAt: decision === "approved" ? now : "",
      RevokedBy: decision === "revoked" ? sessionUser.Username : "",
      RevokedAt: decision === "revoked" ? now : "",
      UpdatedAt: now,
    };
    const sheet = getSheet_(SHEET_EXAM_ELIGIBILITY_OVERRIDES);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    sheet.appendRow(headers.map((header) => row[header] || ""));
    AUTH_appendAuditLog_(
      decision === "approved" ? "APPROVE" : "REVOKE",
      "ExamEligibility",
      periodId + ":" + studentId,
      sessionUser,
      { reason },
    );
    return {
      ok: true,
      data: REPORT_buildEligibility_(studentId, AC_getPeriod_(periodId)),
      message:
        decision === "approved"
          ? "Pengecualian ujian disetujui."
          : "Pengecualian ujian dicabut.",
    };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

function REPORT_buildStudentReportData_(studentId, periodId, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, { allowAnonymous: false });
  if (!isReportV2EnabledFor_(sessionUser)) {
    return { ok: false, message: "Raport versi baru belum diaktifkan." };
  }
  setupReportV2Sheets_();
  const student = REPORT_getStudent_(studentId);
  if (!student) return { ok: false, message: "Santri tidak ditemukan." };

  const academic = getAcademicReportForStudent_(student, periodId, sessionUser);
  const period = academic && academic.period;
  REPORT_requireStudentAccess_(sessionUser, student, period && period.PeriodID);
  if (!period) {
    return {
      ok: true,
      data: {
        profile: student,
        period: "Belum ada periode",
        academic,
        hafalan: { total: 0, details: {}, newCount: 0, reviewCount: 0, lastMemo: null },
        behavior: { score: 100, violations: 0, achievements: 0, predikat: "Cukup" },
        attendance: REPORT_calculateAttendanceSummary_([]),
        eligibility: null,
        details: { memorization: [], incidents: [], attendance: [] },
        reportMeta: { version: 2, isDraft: true, downloadable: false },
      },
    };
  }

  const memos = REPORT_getRows_("MemorizationLogs")
    .filter((item) => REPORT_text_(item.StudentID) === REPORT_text_(studentId))
    .filter((item) => REPORT_inPeriod_(item.DateLogged, period))
    .sort((a, b) => REPORT_dateKey_(b.DateLogged).localeCompare(REPORT_dateKey_(a.DateLogged)));
  const incidents = REPORT_getRows_("Incidents")
    .filter((item) => REPORT_text_(item.StudentID) === REPORT_text_(studentId))
    .filter((item) => REPORT_inPeriod_(item.DateOfIncident, period))
    .sort((a, b) => REPORT_dateKey_(b.DateOfIncident).localeCompare(REPORT_dateKey_(a.DateOfIncident)));
  const attendance = REPORT_getAttendanceForPeriod_(studentId, period);
  const eligibility = REPORT_buildEligibility_(studentId, period);
  const violationCount = incidents.filter(
    (item) => REPORT_text_(item.IncidentType) === "Violation",
  ).length;
  const achievementCount = incidents.filter(
    (item) => REPORT_text_(item.IncidentType) === "Improvement",
  ).length;
  const behaviorScore = calculateBehaviorScore_(incidents);
  let behaviorLabel = "Cukup";
  if (behaviorScore >= 100 && violationCount === 0) behaviorLabel = "Istimewa";
  else if (behaviorScore >= 70) behaviorLabel = "Sangat Baik";
  else if (behaviorScore >= 40) behaviorLabel = "Baik";
  else behaviorLabel = "Perlu Bimbingan";

  const memorizationDetails = {
    "Setoran Baru": memos.filter((item) => item.Category === "Setoran Baru").length,
    "Muroja'ah": memos.filter((item) => item.Category === "Muroja'ah").length,
    Lainnya: memos.filter(
      (item) => !["Setoran Baru", "Muroja'ah"].includes(item.Category),
    ).length,
  };

  return {
    ok: true,
    data: {
      profile: student,
      period: period.Title,
      academic,
      hafalan: {
        total: memos.length,
        details: memorizationDetails,
        newCount: memorizationDetails["Setoran Baru"],
        reviewCount: memorizationDetails["Muroja'ah"],
        lastMemo: memos[0] || null,
      },
      behavior: {
        score: behaviorScore,
        violations: violationCount,
        achievements: achievementCount,
        predikat: behaviorLabel,
      },
      attendance,
      eligibility,
      details: {
        memorization: memos,
        incidents,
        attendance: attendance.records,
      },
      reportMeta: {
        version: 2,
        isDraft: REPORT_text_(period.Status) !== "Published",
        downloadable: REPORT_text_(period.Status) === "Published",
        generatedAt: new Date().toISOString(),
        startDate: REPORT_dateKey_(period.StartDate),
        endDate: REPORT_dateKey_(period.EndDate),
      },
    },
  };
}
