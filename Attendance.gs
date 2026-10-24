const SHEET_ATTENDANCE = "Attendance";
const SHEET_ATTENDANCE_SESSIONS = "AttendanceSessions";

const ATTENDANCE_TYPES = ["Pondok", "KBM", "Kegiatan"];
const ATTENDANCE_STATUSES = ["Hadir", "Izin", "Sakit", "Alpa", "Telat"];
const ATTENDANCE_STORAGE_CACHE_KEY = "ATT_STORAGE_READY_V5";
const ATTENDANCE_SCHEDULE_STATUS_CACHE_KEY = "ATT_SCHEDULE_STATUS_V3";
const ATTENDANCE_MASTER_DATA_VERSION = "2026-09-24.2";

function getMyScheduleToday(currentUser) {
  return getAttendanceHome(currentUser, {});
}

function getAttendanceHome(currentUser, options) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin", "Ustadz"],
  });
  requireProductModuleEnabled_("attendance", sessionUser);

  try {
    ATT_prepareStorage_();
    ATT_ensureMasterDataVersion_(sessionUser);
    const scheduleDataStatus = ATT_getMasterScheduleStatusCached_();
    options = options || {};
    const attendanceDate = ATT_formatDate_(options.date || options.AttendanceDate || new Date());
    const dayName = ATT_dayName_(attendanceDate);
    const schedules = ATT_mergeContiguousSchedules_(
      ATT_getSchedulesForUser_(sessionUser, dayName, options),
    );
    const sessions = ATT_compactSessions_(ATT_getSessionObjects_()).filter(
      (session) => ATT_formatDate_(session.AttendanceDate) === attendanceDate,
    );

    const decoratedSchedules = schedules.map((schedule) => {
      const normalized = ATT_normalizeSchedule_(schedule);
      const existing = ATT_findSessionForSchedule_(sessions, normalized, attendanceDate);
      const meaningfulSession = existing && ATT_isMeaningfulSession_(existing) ? existing : null;
      return Object.assign({}, normalized, {
        AttendanceDate: attendanceDate,
        TeacherName: ATT_teacherDisplayName_(normalized),
        IsCurrentTime: ATT_isScheduleCurrent_(normalized, attendanceDate),
        SessionID: meaningfulSession ? meaningfulSession.SessionID : "",
        SessionStatus: meaningfulSession ? meaningfulSession.Status || "Submitted" : "Belum Absen",
        TotalStudents: meaningfulSession ? Number(meaningfulSession.TotalStudents || 0) : 0,
        HadirCount: meaningfulSession ? Number(meaningfulSession.HadirCount || 0) : 0,
        IzinCount: meaningfulSession ? Number(meaningfulSession.IzinCount || 0) : 0,
        SakitCount: meaningfulSession ? Number(meaningfulSession.SakitCount || 0) : 0,
        AlpaCount: meaningfulSession ? Number(meaningfulSession.AlpaCount || 0) : 0,
        TelatCount: meaningfulSession ? Number(meaningfulSession.TelatCount || 0) : 0,
      });
    });

    return {
      ok: true,
      data: {
        schedules: decoratedSchedules,
        dayName,
        attendanceDate,
        students: [],
        classes: ATT_uniqueScheduleClasses_(decoratedSchedules),
        types: ATTENDANCE_TYPES,
        statuses: ATTENDANCE_STATUSES,
        teacherAliases: ATT_teacherAliases_(sessionUser),
        isShowingAllSchedules: !!options.showAll,
        scheduleDataStatus,
        viewerContext: ATT_viewerContext_(sessionUser),
        dataVersion: ATTENDANCE_MASTER_DATA_VERSION,
      },
    };
  } catch (e) {
    return { ok: false, message: "Gagal memuat beranda absensi: " + e.message };
  }
}

function getAttendanceSession(payload, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin", "Ustadz"],
  });
  requireProductModuleEnabled_("attendance", sessionUser);

  try {
    ATT_prepareStorage_();
    payload = payload || {};
    const schedule = ATT_scheduleFromPayload_(payload, sessionUser);
    ATT_assertCanManageScheduleAttendance_(sessionUser, schedule);

    const attendanceDate = ATT_formatDate_(payload.AttendanceDate || payload.date || new Date());
    const existingSession = ATT_findSessionForSchedule_(
      ATT_compactSessions_(ATT_getSessionObjects_()),
      schedule,
      attendanceDate,
    );
    const session = existingSession || ATT_buildSessionData_(schedule, attendanceDate, "Draft");
    const allStudents = ATT_getStudentsForAttendance_(sessionUser);
    const students = ATT_getStudentsForClass_(
      schedule.ClassOrGroupName,
      sessionUser,
      allStudents,
    );
    const existingRecords = existingSession
      ? ATT_getAttendanceObjects_().filter(
          (record) => String(record.SessionID || "") === String(existingSession.SessionID),
        )
      : [];
    const existingByStudent = {};
    existingRecords.forEach((record) => {
      existingByStudent[String(record.StudentID)] = record;
    });

    const records = students.map((student) => {
      const existing = existingByStudent[String(student.StudentID)] || {};
      return {
        StudentID: String(student.StudentID || ""),
        NIS: String(student.NIS || ""),
        Name: String(student.Name || ""),
        ClassOrGroupName: String(ATT_studentClass_(student) || ""),
        Gender: String(student.Gender || ""),
        Status: ATT_normalizeStatus_(existing.Status || "Hadir"),
        Notes: String(existing.Notes || ""),
        AttendanceID: String(existing.AttendanceID || ""),
      };
    });

    const decoratedSession = ATT_decorateSessionCounts_(session, records);

    return {
      ok: true,
      data: {
        session: ATT_clientSessionDetail_(decoratedSession),
        records,
        statuses: ATTENDANCE_STATUSES.slice(),
        diagnostics: {
          totalActiveStudents: allStudents.length,
          matchedStudents: students.length,
          requestedClass: String(schedule.ClassOrGroupName || ""),
          availableClasses: ATT_uniqueClasses_(allStudents)
            .slice(0, 30)
            .map((className) => String(className || "")),
        },
      },
    };
  } catch (e) {
    return { ok: false, message: "Gagal membuka sesi absensi: " + e.message };
  }
}

function saveAttendanceSession(payload, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin", "Ustadz"],
  });
  requireProductModuleEnabled_("attendance", sessionUser);
  let saveLock = null;
  let saveLockAcquired = false;

  try {
    ATT_prepareStorage_();
    payload = payload || {};
    const schedule = ATT_scheduleFromPayload_(payload.session || payload, sessionUser);
    ATT_assertCanManageScheduleAttendance_(sessionUser, schedule);

    const attendanceDate = ATT_formatDate_(
      payload.AttendanceDate ||
        (payload.session && payload.session.AttendanceDate) ||
        new Date(),
    );
    saveLock = LockService.getScriptLock();
    saveLock.waitLock(20000);
    saveLockAcquired = true;
    const session = ATT_findOrCreateSession_(
      schedule,
      attendanceDate,
      sessionUser,
      "Draft",
      true,
    );
    const students = ATT_getStudentsForClass_(schedule.ClassOrGroupName, sessionUser);
    const validStudentIds = {};
    students.forEach((student) => {
      validStudentIds[String(student.StudentID)] = true;
    });

    const incomingRecords = (payload.records || []).filter((record) =>
      validStudentIds[String(record.StudentID)],
    );
    if (incomingRecords.length === 0) {
      return { ok: false, message: "Tidak ada santri valid untuk disimpan." };
    }

    const sheet = getSheet_(SHEET_ATTENDANCE);
    const headers = ATT_headers_(sheet);
    const existingRecords = ATT_sheetToObjects_(sheet).filter(
      (record) => String(record.SessionID || "") === String(session.SessionID),
    );
    const existingByStudent = {};
    existingRecords.forEach((record) => {
      existingByStudent[String(record.StudentID)] = record;
    });

    const now = new Date().toISOString();
    const savedRows = [];
    const rowsToAppend = [];
    incomingRecords.forEach((record) => {
      const existing = existingByStudent[String(record.StudentID)];
      const rowData = {
        AttendanceID: existing ? existing.AttendanceID : ATT_generateId_("ATT"),
        SessionID: session.SessionID,
        ScheduleID: schedule.ScheduleID,
        StudentID: record.StudentID,
        AttendanceDate: attendanceDate,
        DateLogged: attendanceDate + "T00:00:00.000Z",
        ClassOrGroupName: schedule.ClassOrGroupName,
        Category: schedule.Type,
        ActivityName: schedule.SubjectOrActivityName,
        Status: ATT_normalizeStatus_(record.Status || record.status || "Hadir"),
        Notes: record.Notes || record.notes || "",
        TeacherID: schedule.TeacherID,
        TeacherSourceID: schedule.TeacherSourceID,
        CreatedAt: existing ? existing.CreatedAt || now : now,
        UpdatedAt: now,
      };
      const rowArray = headers.map((header) =>
        rowData[header] !== undefined ? rowData[header] : "",
      );
      if (existing && existing._rowNumber) {
        sheet.getRange(existing._rowNumber, 1, 1, headers.length).setValues([rowArray]);
      } else {
        rowsToAppend.push(rowArray);
      }
      savedRows.push(rowData);
    });
    if (rowsToAppend.length > 0) {
      sheet
        .getRange(sheet.getLastRow() + 1, 1, rowsToAppend.length, headers.length)
        .setValues(rowsToAppend);
    }

    const updatedSession = ATT_updateSessionSummary_(session.SessionID, savedRows, {
      status: "Submitted",
      submittedBy: sessionUser.Username || "",
      submittedAt: now,
    });

    return {
      ok: true,
      message: "Absensi berhasil disimpan untuk " + incomingRecords.length + " santri.",
      data: {
        session: ATT_clientSessionSummary_(updatedSession),
        savedCount: incomingRecords.length,
      },
    };
  } catch (e) {
    return { ok: false, message: "Gagal menyimpan sesi absensi: " + e.message };
  } finally {
    if (saveLockAcquired && saveLock) {
      try {
        saveLock.releaseLock();
      } catch (releaseError) {
        // Penyimpanan sudah selesai; kegagalan melepas lock tidak boleh
        // mengubah respons sukses menjadi kegagalan di browser.
      }
    }
  }
}

function saveBatchAttendance(payload, currentUser) {
  payload = payload || {};
  const sessionPayload = {
    Type: payload.Category || payload.Type || "KBM",
    SubjectOrActivityName: payload.ActivityName || "Umum",
    ClassOrGroupName: payload.ClassOrGroupName || "",
    ScheduleID: payload.ScheduleID || "",
    TeacherID: currentUser && currentUser.Username,
    TeacherSourceID: currentUser && currentUser.TeacherSourceID,
    AttendanceDate: payload.AttendanceDate || payload.DateLogged || new Date(),
    records: payload.records || [],
  };
  return saveAttendanceSession(sessionPayload, currentUser);
}

function logAttendance(data) {
  try {
    setupAttendanceSheets_();
    data = data || {};
    if (!data.StudentID) return { ok: false, message: "Santri wajib dipilih." };
    const sheet = getSheet_(SHEET_ATTENDANCE);
    const headers = ATT_headers_(sheet);
    const now = new Date().toISOString();
    const attendanceDate = ATT_formatDate_(data.AttendanceDate || data.DateLogged || new Date());
    const rowData = {
      AttendanceID: ATT_generateId_("ATT"),
      SessionID: data.SessionID || "",
      ScheduleID: data.ScheduleID || "",
      StudentID: data.StudentID,
      AttendanceDate: attendanceDate,
      DateLogged: data.DateLogged || attendanceDate + "T00:00:00.000Z",
      ClassOrGroupName: data.ClassOrGroupName || "",
      Category: data.Category || "Pondok",
      ActivityName: data.ActivityName || "Keterangan Santri",
      Status: ATT_normalizeStatus_(data.Status || data.Type || "Hadir"),
      Notes: data.Notes || "",
      TeacherID: data.TeacherID || "",
      TeacherSourceID: data.TeacherSourceID || "",
      CreatedAt: data.CreatedAt || now,
      UpdatedAt: now,
    };
    sheet.appendRow(headers.map((header) => (rowData[header] !== undefined ? rowData[header] : "")));
    return { ok: true, message: "Keterangan berhasil disimpan.", data: rowData };
  } catch (e) {
    return { ok: false, message: "Gagal menyimpan keterangan: " + e.message };
  }
}

function getAttendanceRecap(filters, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin", "Ustadz"],
  });
  requireProductModuleEnabled_("attendance", sessionUser);

  try {
    setupAttendanceSheets_();
    filters = filters || {};
    const month = String(filters.month || filters.Month || "").trim();
    const type = String(filters.type || filters.Type || "").trim();
    const className = String(filters.className || filters.ClassOrGroupName || "").trim();
    const teacherId = String(filters.teacherId || filters.TeacherID || "").trim();
    const activityName = String(filters.activityName || filters.ActivityName || "").trim();
    const studentId = String(filters.studentId || filters.StudentID || "").trim();
    const fromDate = ATT_formatDate_(filters.fromDate || filters.FromDate || "");
    const toDate = ATT_formatDate_(filters.toDate || filters.ToDate || "");

    let records = ATT_getAttendanceObjects_().map(ATT_normalizeAttendanceRecord_);
    records = records.filter((record) => {
      if (month && String(record.AttendanceDate || "").slice(0, 7) !== month) return false;
      if (fromDate && String(record.AttendanceDate || "") < fromDate) return false;
      if (toDate && String(record.AttendanceDate || "") > toDate) return false;
      if (type && record.Category !== type) return false;
      if (className && record.ClassOrGroupName !== className) return false;
      if (teacherId && record.TeacherID !== teacherId && record.TeacherSourceID !== teacherId) return false;
      if (activityName && record.ActivityName !== activityName) return false;
      if (studentId && String(record.StudentID) !== studentId) return false;
      if (sessionUser.Role === "Ustadz" && !ATT_isTeacherAssigned_(record, sessionUser)) return false;
      return true;
    });

    const students = ATT_getStudentsForAttendance_(sessionUser);
    const studentMap = {};
    students.forEach((student) => {
      studentMap[String(student.StudentID)] = student;
    });

    const summary = ATT_buildStatusSummary_(records);
    const byStudent = ATT_groupAttendance_(records, "StudentID", (key, group) => {
      const student = studentMap[String(key)] || {};
      return Object.assign(ATT_buildStatusSummary_(group), {
        StudentID: key,
        Name: student.Name || key,
        ClassOrGroupName: ATT_studentClass_(student) || group[0].ClassOrGroupName || "",
      });
    });
    const byClass = ATT_groupAttendance_(records, "ClassOrGroupName", (key, group) =>
      Object.assign(ATT_buildStatusSummary_(group), { ClassOrGroupName: key }),
    );
    const byActivity = ATT_groupAttendance_(records, "ActivityName", (key, group) =>
      Object.assign(ATT_buildStatusSummary_(group), {
        ActivityName: key,
        Category: group[0] ? group[0].Category : "",
      }),
    );
    const byTeacher = ATT_groupAttendance_(records, "TeacherID", (key, group) =>
      Object.assign(ATT_buildStatusSummary_(group), { TeacherID: key }),
    );

    return {
      ok: true,
      data: {
        filters: { month, type, className, teacherId, activityName, studentId, fromDate, toDate },
        summary,
        byStudent,
        byClass,
        byActivity,
        byTeacher,
        recentRecords: records
          .slice()
          .sort((a, b) => new Date(b.DateLogged || b.AttendanceDate) - new Date(a.DateLogged || a.AttendanceDate))
          .slice(0, 50),
      },
    };
  } catch (e) {
    return { ok: false, message: "Gagal memuat rekap absensi: " + e.message };
  }
}

function getGuardianAttendanceSummary(studentId, month, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    allowAnonymous: false,
  });
  requireProductModuleEnabled_("attendance", sessionUser);

  try {
    const student = ATT_getStudentById_(studentId);
    if (!student) return { ok: false, message: "Santri tidak ditemukan." };
    if (!ATT_canViewStudentAttendance_(sessionUser, student)) {
      return { ok: false, message: "Akses ringkasan absensi ditolak." };
    }

    const selectedMonth = String(month || "").trim() || ATT_formatDate_(new Date()).slice(0, 7);
    const records = ATT_getAttendanceObjects_()
      .map(ATT_normalizeAttendanceRecord_)
      .filter(
        (record) =>
          String(record.StudentID) === String(studentId) &&
          String(record.AttendanceDate || "").slice(0, 7) === selectedMonth,
      );
    const summary = ATT_buildStatusSummary_(records);
    return {
      ok: true,
      data: Object.assign(summary, {
        StudentID: student.StudentID,
        Name: student.Name || "",
        Month: selectedMonth,
        byActivity: ATT_groupAttendance_(records, "ActivityName", (key, group) =>
          Object.assign(ATT_buildStatusSummary_(group), {
            ActivityName: key,
            Category: group[0] ? group[0].Category : "",
          }),
        ),
      }),
    };
  } catch (e) {
    return { ok: false, message: "Gagal memuat ringkasan absensi wali: " + e.message };
  }
}

function updateStudentGenderBatch(studentIds, gender, currentUser) {
  requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });

  try {
    const normalizedGender = ATT_normalizeGenderGroup_(gender);
    if (!normalizedGender) {
      return { ok: false, message: "Pilih klasifikasi Ikhwan atau Akhwat." };
    }

    const ids = {};
    (studentIds || []).forEach((id) => {
      const text = String(id || "").trim();
      if (text) ids[text] = true;
    });
    const targetIds = Object.keys(ids);
    if (targetIds.length === 0) {
      return { ok: false, message: "Tidak ada santri yang dipilih." };
    }

    setupSheetWithHeaders_("Students", CORE_SHEET_SCHEMAS.Students);
    const sheet = getSheet_("Students");
    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) {
      return { ok: false, message: "Data santri masih kosong." };
    }

    const headers = values[0].map((header) => String(header || "").trim());
    const idIndex = headers.indexOf("StudentID");
    const genderIndex = headers.indexOf("Gender");
    const updatedAtIndex = headers.indexOf("UpdatedAt");
    if (idIndex === -1 || genderIndex === -1) {
      return { ok: false, message: "Kolom StudentID atau Gender belum tersedia." };
    }

    const now = new Date().toISOString();
    const genderUpdates = [];
    const updatedAtUpdates = [];
    let updated = 0;

    for (let rowIndex = 1; rowIndex < values.length; rowIndex++) {
      const studentId = String(values[rowIndex][idIndex] || "").trim();
      if (!ids[studentId]) continue;
      values[rowIndex][genderIndex] = normalizedGender;
      if (updatedAtIndex !== -1) values[rowIndex][updatedAtIndex] = now;
      updated++;
    }

    if (updated === 0) {
      return { ok: false, message: "Santri yang dipilih tidak ditemukan." };
    }

    for (let rowIndex = 1; rowIndex < values.length; rowIndex++) {
      genderUpdates.push([values[rowIndex][genderIndex]]);
      if (updatedAtIndex !== -1) updatedAtUpdates.push([values[rowIndex][updatedAtIndex]]);
    }
    sheet.getRange(2, genderIndex + 1, genderUpdates.length, 1).setValues(genderUpdates);
    if (updatedAtIndex !== -1) {
      sheet.getRange(2, updatedAtIndex + 1, updatedAtUpdates.length, 1).setValues(updatedAtUpdates);
    }

    return {
      ok: true,
      message: updated + " santri ditandai sebagai " + normalizedGender + ".",
      data: { updated, gender: normalizedGender },
    };
  } catch (e) {
    return { ok: false, message: "Gagal memperbarui klasifikasi santri: " + e.message };
  }
}

function getStudentAttendance(studentId) {
  try {
    const sheet = getSheet_(SHEET_ATTENDANCE);
    if (!sheet) return { ok: true, data: { attendance: [] } };

    const logs = ATT_getAttendanceObjects_()
      .map(ATT_normalizeAttendanceRecord_)
      .filter((record) => String(record.StudentID) === String(studentId))
      .sort(
        (a, b) =>
          new Date(b.DateLogged || b.AttendanceDate) -
          new Date(a.DateLogged || a.AttendanceDate),
      );

    return { ok: true, data: { attendance: logs } };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

function setupAttendanceSheets_() {
  setupSheetWithHeaders_(SHEET_ATTENDANCE, CORE_SHEET_SCHEMAS.Attendance);
  setupSheetWithHeaders_(SHEET_ATTENDANCE_SESSIONS, CORE_SHEET_SCHEMAS.AttendanceSessions);
}

function ATT_prepareStorage_() {
  const cache = CacheService.getScriptCache();
  if (cache.get(ATTENDANCE_STORAGE_CACHE_KEY)) return;
  setupAttendanceSheets_();
  setupSheetWithHeaders_("Schedules", CORE_SHEET_SCHEMAS.Schedules);
  cache.put(ATTENDANCE_STORAGE_CACHE_KEY, "1", 21600);
}

function ATT_ensureMasterDataVersion_(sessionUser) {
  if (isTenantInstallation_()) {
    // Do not import the developer's embedded schedule into a customer pondok.
    // The sheets are still prepared by ATT_prepareStorage_() and remain empty
    // until the Admin creates or imports the pondok's own schedules.
    return;
  }
  if (typeof MASTER_ATTENDANCE_SCHEDULES === "undefined") return;
  const properties = PropertiesService.getScriptProperties();
  const key = "ATT_MASTER_DATA_VERSION";
  if (properties.getProperty(key) === ATTENDANCE_MASTER_DATA_VERSION) return;

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    if (properties.getProperty(key) === ATTENDANCE_MASTER_DATA_VERSION) return;
    if (typeof seedMissingTeachersFromMasterSchedule_ === "function") {
      seedMissingTeachersFromMasterSchedule_(sessionUser);
    }
    if (typeof deactivateLegacyDemoSchedules_ === "function") {
      deactivateLegacyDemoSchedules_();
    }
    if (typeof seedMasterAttendanceSchedules_ === "function") {
      seedMasterAttendanceSchedules_(true);
    }
    properties.setProperty(key, ATTENDANCE_MASTER_DATA_VERSION);
    CacheService.getScriptCache().remove(ATTENDANCE_SCHEDULE_STATUS_CACHE_KEY);
  } finally {
    lock.releaseLock();
  }
}

function ATT_getMasterScheduleStatusCached_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(ATTENDANCE_SCHEDULE_STATUS_CACHE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }
  const status = ATT_ensureMasterScheduleData_();
  cache.put(ATTENDANCE_SCHEDULE_STATUS_CACHE_KEY, JSON.stringify(status), 21600);
  return status;
}

function ATT_ensureMasterScheduleData_() {
  setupSheetWithHeaders_("Schedules", CORE_SHEET_SCHEMAS.Schedules);
  const sheet = getSheet_("Schedules");
  const schedules = sheet ? ATT_sheetToObjects_(sheet) : [];
  if (isTenantInstallation_()) {
    const activeScheduleCount = schedules.filter((item) =>
      item.IsActive !== false && String(item.IsActive).toLowerCase() !== "false",
    ).length;
    return {
      ready: activeScheduleCount > 0,
      autoImported: false,
      source: "tenant",
      activeScheduleCount,
      masterCount: 0,
      expectedCount: 0,
      needsSetup: activeScheduleCount === 0,
    };
  }
  const masterIds = {};
  let masterRowCount = 0;
  schedules.forEach((schedule) => {
    const id = String(schedule.ScheduleID || "").trim();
    if (!/^MASTER-(?:KBM|NKBM)-/.test(id)) return;
    masterRowCount++;
    masterIds[id] = true;
  });
  const masterCount = Object.keys(masterIds).length;
  const expectedCount =
    typeof MASTER_ATTENDANCE_SCHEDULES !== "undefined"
      ? MASTER_ATTENDANCE_SCHEDULES.length
      : 0;

  if (
    expectedCount > 0 &&
    (masterCount < expectedCount || masterRowCount !== masterCount) &&
    typeof seedMasterAttendanceSchedules_ === "function"
  ) {
    const result = seedMasterAttendanceSchedules_();
    return {
      ready: true,
      autoImported: true,
      masterCount: result.total,
      expectedCount: result.total,
      created: result.created,
      updated: result.updated,
    };
  }

  return {
    ready: expectedCount === 0 ? masterCount > 0 : masterCount >= expectedCount,
    autoImported: false,
    masterCount,
    expectedCount,
  };
}

function ATT_getSchedulesForUser_(currentUser, dayName, options) {
  const sheet = getSheet_("Schedules");
  if (!sheet) return [];
  options = options || {};
  const schedules = ATT_uniqueSchedules_(
    ATT_sheetToObjects_(sheet).map(ATT_normalizeSchedule_),
  );
  const activeToday = schedules
    .filter((schedule) => {
      if (schedule.DayOfWeek !== dayName) return false;
      if (schedule.IsActive === false || String(schedule.IsActive).toLowerCase() === "false") return false;
      if (ATT_isLegacyDemoSchedule_(schedule)) return false;
      if (options && options.type && schedule.Type !== options.type) return false;
      if (options && options.ClassOrGroupName && schedule.ClassOrGroupName !== options.ClassOrGroupName) return false;
      if (
        currentUser.Role === "Ustadz" &&
        !ATT_isTeacherAssigned_(schedule, currentUser)
      ) {
        return false;
      }
      return true;
    });
  const ownSchedules = activeToday.filter((schedule) =>
    ATT_isTeacherAssigned_(schedule, currentUser),
  );
  const visibleSchedules = options.showAll ? activeToday : ownSchedules;
  const sortedSchedules = visibleSchedules.sort(ATT_compareScheduleByTime_);
  ATT_cacheSchedules_(sortedSchedules);
  return sortedSchedules;
}

function ATT_mergeContiguousSchedules_(schedules) {
  const merged = [];
  (schedules || []).forEach((source) => {
    const schedule = ATT_normalizeSchedule_(source);
    let previous = null;
    for (let index = merged.length - 1; index >= 0; index--) {
      const candidate = merged[index];
      const sameLesson =
        candidate.Type === schedule.Type &&
        ATT_teacherKey_(candidate) === ATT_teacherKey_(schedule) &&
        ATT_normalizeKeyPart_(candidate.SubjectOrActivityName) ===
          ATT_normalizeKeyPart_(schedule.SubjectOrActivityName) &&
        ATT_normalizeKeyPart_(candidate.ClassOrGroupName) ===
          ATT_normalizeKeyPart_(schedule.ClassOrGroupName) &&
        candidate.DayOfWeek === schedule.DayOfWeek &&
        ATT_normalizeTime_(candidate.EndTime) === ATT_normalizeTime_(schedule.StartTime) &&
        /^\d{2}:\d{2}$/.test(ATT_normalizeTime_(schedule.StartTime));
      if (sameLesson) {
        previous = candidate;
        break;
      }
    }

    if (previous) {
      previous.EndTime = schedule.EndTime;
      previous.SourceScheduleIDs = previous.SourceScheduleIDs.concat(
        schedule.SourceScheduleIDs.length
          ? schedule.SourceScheduleIDs
          : [schedule.ScheduleID],
      );
      return;
    }

    schedule.SourceScheduleIDs = schedule.SourceScheduleIDs.length
      ? schedule.SourceScheduleIDs.slice()
      : [schedule.ScheduleID];
    merged.push(schedule);
  });
  return merged;
}

function ATT_findSessionForSchedule_(sessions, schedule, attendanceDate) {
  const normalized = ATT_normalizeSchedule_(schedule);
  const scheduleIds = [normalized.ScheduleID]
    .concat(normalized.SourceScheduleIDs || [])
    .map((id) => String(id || "").trim())
    .filter(Boolean);
  const candidates = (sessions || []).filter((session) => {
    if (ATT_formatDate_(session.AttendanceDate) !== ATT_formatDate_(attendanceDate)) return false;
    const sessionScheduleId = String(session.ScheduleID || "").trim();
    if (scheduleIds.length && scheduleIds.indexOf(sessionScheduleId) !== -1) return true;
    return (
      !sessionScheduleId &&
      ATT_normalizeType_(session.AttendanceType || session.Type) === normalized.Type &&
      ATT_normalizeKeyPart_(session.ClassOrGroupName) ===
        ATT_normalizeKeyPart_(normalized.ClassOrGroupName) &&
      ATT_normalizeKeyPart_(session.ActivityName) ===
        ATT_normalizeKeyPart_(normalized.SubjectOrActivityName) &&
      ATT_teacherKey_(session) === ATT_teacherKey_(normalized)
    );
  });
  return candidates.sort(ATT_compareSessionPriority_)[0] || null;
}

function ATT_compactSessions_(sessions) {
  const byKey = {};
  (sessions || []).forEach((session) => {
    const key = String(session.SessionID || "").trim() || ATT_sessionLookupKey_(session);
    const current = byKey[key];
    if (!current || ATT_compareSessionPriority_(session, current) < 0) {
      byKey[key] = session;
    }
  });
  return Object.keys(byKey).map((key) => byKey[key]);
}

function ATT_compareSessionPriority_(a, b) {
  const statusA = String(a && a.Status || "").toLowerCase() === "submitted" ? 1 : 0;
  const statusB = String(b && b.Status || "").toLowerCase() === "submitted" ? 1 : 0;
  if (statusA !== statusB) return statusB - statusA;
  const countA = Number(a && a.TotalStudents || 0);
  const countB = Number(b && b.TotalStudents || 0);
  if (countA !== countB) return countB - countA;
  return String(b && b.UpdatedAt || "").localeCompare(String(a && a.UpdatedAt || ""));
}

function ATT_isMeaningfulSession_(session) {
  return (
    String(session && session.Status || "").toLowerCase() === "submitted" ||
    Number(session && session.TotalStudents || 0) > 0
  );
}

function ATT_normalizeKeyPart_(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function ATT_scheduleFromPayload_(payload, currentUser) {
  payload = payload || {};
  const scheduleId = String(payload.ScheduleID || "").trim();
  if (scheduleId) {
    const trustedSchedule = ATT_getScheduleById_(scheduleId);
    if (!trustedSchedule) throw new Error("Jadwal tidak ditemukan atau sudah tidak aktif.");
    return ATT_normalizeSchedule_(trustedSchedule);
  }
  const schedule = Object.assign({}, payload);
  if (currentUser && currentUser.Role === "Ustadz") {
    schedule.TeacherID = currentUser.Username;
    schedule.TeacherSourceID = ATT_userTeacherSourceId_(currentUser);
  } else if (!schedule.TeacherSourceID) {
    schedule.TeacherSourceID = ATT_sourceIdForUsername_(schedule.TeacherID);
  }
  return ATT_normalizeSchedule_(schedule);
}

function ATT_getScheduleById_(scheduleId) {
  const cache = CacheService.getScriptCache();
  const cacheKey = ATT_scheduleCacheKey_(scheduleId);
  const cached = cache.get(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }
  const sheet = getSheet_("Schedules");
  if (!sheet || sheet.getLastRow() <= 1) return null;
  const schedule = ATT_mergeContiguousSchedules_(
    ATT_sheetToObjects_(sheet).map(ATT_normalizeSchedule_),
  ).find((item) =>
    String(item.ScheduleID || "") === String(scheduleId) ||
    (item.SourceScheduleIDs || []).map(String).includes(String(scheduleId)),
  );
  if (schedule) cache.put(cacheKey, JSON.stringify(schedule), 600);
  return schedule;
}

function ATT_cacheSchedules_(schedules) {
  const values = {};
  (schedules || []).slice(0, 80).forEach((schedule) => {
    if (!schedule || !schedule.ScheduleID) return;
    values[ATT_scheduleCacheKey_(schedule.ScheduleID)] = JSON.stringify(schedule);
  });
  if (Object.keys(values).length) CacheService.getScriptCache().putAll(values, 600);
}

function ATT_scheduleCacheKey_(scheduleId) {
  return "ATT_SCHED_" + String(scheduleId || "").replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 180);
}

function ATT_clearScheduleCache_(scheduleId) {
  if (!scheduleId) return;
  CacheService.getScriptCache().remove(ATT_scheduleCacheKey_(scheduleId));
}

function ATT_normalizeSchedule_(schedule) {
  schedule = schedule || {};
  const sourceScheduleIds = Array.isArray(schedule.SourceScheduleIDs)
    ? schedule.SourceScheduleIDs
    : String(schedule.SourceScheduleIDs || "").split(",");
  return {
    ScheduleID: String(schedule.ScheduleID || "").trim(),
    Type: ATT_normalizeType_(schedule.Type || schedule.AttendanceType || schedule.Category || "KBM"),
    TeacherID: String(schedule.TeacherID || "").trim(),
    TeacherSourceID: String(
      schedule.TeacherSourceID || ATT_sourceIdForUsername_(schedule.TeacherID) || "",
    ).trim(),
    SubjectOrActivityName: String(schedule.SubjectOrActivityName || schedule.ActivityName || "Umum").trim(),
    ClassOrGroupName: String(schedule.ClassOrGroupName || "").trim(),
    DayOfWeek: String(schedule.DayOfWeek || "").trim(),
    StartTime: ATT_normalizeTime_(schedule.StartTime || ""),
    EndTime: ATT_normalizeTime_(schedule.EndTime || ""),
    SourceScheduleIDs: sourceScheduleIds
      .map((id) => String(id || "").trim())
      .filter(Boolean),
    IsActive: schedule.IsActive !== false && String(schedule.IsActive).toLowerCase() !== "false",
  };
}

function ATT_isLegacyDemoSchedule_(schedule) {
  return (
    /^SCH\d+$/.test(String(schedule && schedule.ScheduleID || "").trim()) &&
    String(schedule && schedule.Type || "").trim() === "KBM" &&
    !String(schedule && schedule.StartTime || "").trim() &&
    !String(schedule && schedule.EndTime || "").trim()
  );
}

function ATT_findOrCreateSession_(schedule, attendanceDate, currentUser, status, lockAlreadyHeld) {
  if (!schedule.ClassOrGroupName) throw new Error("Kelas/asrama absensi wajib dipilih.");
  if (!schedule.SubjectOrActivityName) throw new Error("Mapel/kegiatan wajib diisi.");
  if (!schedule.TeacherID) throw new Error("Pengajar/musyrif wajib diisi.");

  if (lockAlreadyHeld) {
    return ATT_findOrCreateSessionUnlocked_(schedule, attendanceDate, status);
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    return ATT_findOrCreateSessionUnlocked_(schedule, attendanceDate, status);
  } finally {
    lock.releaseLock();
  }
}

function ATT_findOrCreateSessionUnlocked_(schedule, attendanceDate, status) {
  const sheet = getSheet_(SHEET_ATTENDANCE_SESSIONS);
  const sessions = ATT_compactSessions_(ATT_sheetToObjects_(sheet));
  const existing = ATT_findSessionForSchedule_(sessions, schedule, attendanceDate);
  if (existing) return existing;

  const rowData = ATT_buildSessionData_(schedule, attendanceDate, status);
  const headers = ATT_headers_(sheet);
  sheet.appendRow(
    headers.map((header) => (rowData[header] !== undefined ? rowData[header] : "")),
  );
  return rowData;
}

function ATT_buildSessionData_(schedule, attendanceDate, status) {
  const now = new Date().toISOString();
  return {
    SessionID: ATT_generateSessionId_(schedule, attendanceDate),
    ScheduleID: schedule.ScheduleID,
    AttendanceDate: attendanceDate,
    AttendanceType: schedule.Type,
    DayOfWeek: schedule.DayOfWeek || ATT_dayName_(attendanceDate),
    ClassOrGroupName: schedule.ClassOrGroupName,
    ActivityName: schedule.SubjectOrActivityName,
    TeacherID: schedule.TeacherID,
    TeacherSourceID: schedule.TeacherSourceID,
    StartTime: schedule.StartTime,
    EndTime: schedule.EndTime,
    SubmittedBy: "",
    SubmittedAt: "",
    UpdatedAt: now,
    TotalStudents: 0,
    HadirCount: 0,
    IzinCount: 0,
    SakitCount: 0,
    AlpaCount: 0,
    TelatCount: 0,
    Status: status || "Draft",
  };
}

function ATT_updateSessionSummary_(sessionId, records, options) {
  const sheet = getSheet_(SHEET_ATTENDANCE_SESSIONS);
  const headers = ATT_headers_(sheet);
  const sessions = ATT_sheetToObjects_(sheet);
  const target = sessions.find((session) => String(session.SessionID) === String(sessionId));
  if (!target) return null;

  const summary = ATT_buildStatusSummary_(records);
  const now = new Date().toISOString();
  target.SubmittedBy = (options && options.submittedBy) || target.SubmittedBy || "";
  target.SubmittedAt = (options && options.submittedAt) || target.SubmittedAt || now;
  target.UpdatedAt = now;
  target.TotalStudents = summary.total;
  target.HadirCount = summary.hadir;
  target.IzinCount = summary.izin;
  target.SakitCount = summary.sakit;
  target.AlpaCount = summary.alpa;
  target.TelatCount = summary.telat;
  target.Status = (options && options.status) || target.Status || "Submitted";
  sheet
    .getRange(target._rowNumber, 1, 1, headers.length)
    .setValues([headers.map((header) => (target[header] !== undefined ? target[header] : ""))]);
  return target;
}

function ATT_clientSessionSummary_(session) {
  if (!session) return null;
  return {
    SessionID: String(session.SessionID || ""),
    ScheduleID: String(session.ScheduleID || ""),
    AttendanceDate: ATT_formatDate_(session.AttendanceDate || ""),
    Status: String(session.Status || "Submitted"),
    TotalStudents: Number(session.TotalStudents || 0),
    HadirCount: Number(session.HadirCount || 0),
    IzinCount: Number(session.IzinCount || 0),
    SakitCount: Number(session.SakitCount || 0),
    AlpaCount: Number(session.AlpaCount || 0),
    TelatCount: Number(session.TelatCount || 0),
    UpdatedAt: session.UpdatedAt instanceof Date
      ? session.UpdatedAt.toISOString()
      : String(session.UpdatedAt || ""),
  };
}

function ATT_clientSessionDetail_(session) {
  if (!session) return null;
  const summary = ATT_clientSessionSummary_(session) || {};
  return Object.assign(summary, {
    AttendanceType: String(session.AttendanceType || session.Type || "KBM"),
    DayOfWeek: String(session.DayOfWeek || ""),
    ClassOrGroupName: String(session.ClassOrGroupName || ""),
    ActivityName: String(session.ActivityName || session.SubjectOrActivityName || ""),
    TeacherID: String(session.TeacherID || ""),
    TeacherSourceID: String(session.TeacherSourceID || ""),
    StartTime: String(session.StartTime || ""),
    EndTime: String(session.EndTime || ""),
    SubmittedBy: String(session.SubmittedBy || ""),
    SubmittedAt: session.SubmittedAt instanceof Date
      ? session.SubmittedAt.toISOString()
      : String(session.SubmittedAt || ""),
    total: Number(session.total || session.TotalStudents || 0),
    hadir: Number(session.hadir || session.HadirCount || 0),
    izin: Number(session.izin || session.IzinCount || 0),
    sakit: Number(session.sakit || session.SakitCount || 0),
    alpa: Number(session.alpa || session.AlpaCount || 0),
    telat: Number(session.telat || session.TelatCount || 0),
    percentage: Number(session.percentage || 0),
  });
}

function ATT_decorateSessionCounts_(session, records) {
  return Object.assign({}, session, ATT_buildStatusSummary_(records || []));
}

function ATT_getStudentsForAttendance_(currentUser) {
  const sheet = getSheet_("Students");
  if (!sheet || sheet.getLastRow() <= 1) return [];

  const values = sheet.getDataRange().getValues();
  const headers = values[0].map((header) => String(header || "").trim());
  const index = {};
  headers.forEach((header, column) => {
    index[header] = column;
    index[header.toLowerCase()] = column;
  });
  const read = (row, header) => {
    const key = String(header || "").trim();
    const column = index[key] !== undefined ? index[key] : index[key.toLowerCase()];
    return column === undefined ? "" : row[column];
  };
  const readFirst = (row, names) => ATT_readFirst_(row, names, read);

  return values
    .slice(1)
    .filter((row) => row.some((cell) => cell !== "" && cell !== null))
    .filter((row) => !String(read(row, "DeletedAt") || "").trim())
    .filter((row) => {
      const status = String(readFirst(row, ["Status", "Status Santri", "StatusSantri"]) || "Active").trim().toLowerCase();
      return !status || status === "active" || status === "aktif";
    })
    .map((row, rowIndex) => {
      const level = String(readFirst(row, ["Level", "Tingkat", "Kelas Angkatan", "Angkatan"]) || "").trim();
      const gender = String(readFirst(row, ["Gender", "Jenis Kelamin", "JenisKelamin", "JK"]) || "").trim();
      const classLevel = String(
        readFirst(row, [
          "Class/Level",
          "ClassLevel",
          "Class",
          "Kelas",
          "Rombel",
          "Kelas/Rombel",
          "Kelas Rombel",
          "ClassOrGroupName",
        ]) || "",
      ).trim();
      const derivedClass = ATT_deriveClassFromLevelGender_(level, gender);

      return {
        StudentID: String(readFirst(row, ["StudentID", "Student ID", "ID Santri", "SantriID", "NIS", "No. Induk Santri"]) || ("ROW" + (rowIndex + 2))),
        NIS: String(readFirst(row, ["NIS", "No. Induk Santri", "NISN", "NIUP"]) || ""),
        Name: String(readFirst(row, ["Name", "Nama", "Nama Lengkap", "StudentName", "Nama Santri"]) || ""),
        "Class/Level": classLevel || derivedClass,
        Class: String(readFirst(row, ["Class", "Kelas", "Rombel"]) || ""),
        Level: level,
        Gender: gender,
        Status: String(readFirst(row, ["Status", "Status Santri", "StatusSantri"]) || "Active"),
        _classCandidates: ATT_classCandidates_(classLevel, level, gender),
      };
    })
    .filter((student) => String(student.Name || "").trim());
}

function ATT_getStudentsForClass_(className, currentUser, providedStudents) {
  const targetClass = ATT_normalizeClassKey_(className);
  if (!targetClass) return [];
  const isGroupOnly = targetClass === "ikhwan" || targetClass === "akhwat";
  const targetLevel = ATT_normalizeLevelToken_(className);
  const targetGroup = ATT_normalizeGenderGroup_(className);
  const students = providedStudents || ATT_getStudentsForAttendance_(currentUser);
  return students.filter((student) => {
    const candidates = ATT_classCandidates_(
      ATT_studentClass_(student),
      student.Level,
      student.Gender,
    ).concat(student._classCandidates || []);
    return candidates.some((candidate) => {
      const studentClass = ATT_normalizeClassKey_(candidate);
      if (!studentClass) return false;
      if (studentClass === targetClass) return true;
      if (isGroupOnly && studentClass.split(/\s+/).indexOf(targetClass) !== -1) return true;
      const studentLevel = ATT_normalizeLevelToken_(studentClass);
      const studentGroup = ATT_normalizeGenderGroup_(studentClass) || ATT_normalizeGenderGroup_(student.Gender);
      return (
        targetLevel &&
        studentLevel === targetLevel &&
        (!targetGroup || !studentGroup || studentGroup === targetGroup)
      );
    });
  });
}

function ATT_getStudentById_(studentId) {
  const sheet = getSheet_("Students");
  if (!sheet) return null;
  return (
    normalizeSheetData(sheet.getDataRange().getValues()).find(
      (student) => String(student.StudentID) === String(studentId),
    ) || null
  );
}

function ATT_canViewStudentAttendance_(currentUser, student) {
  if (!currentUser || !student) return false;
  if (["Mudir", "Admin", "Ustadz"].includes(currentUser.Role)) return true;
  if (String(currentUser.Role).trim().toLowerCase() !== "wali") return false;
  const sessionPhone = normalizePhoneNumber(currentUser.Phone || "");
  const sessionUsername = normalizePhoneNumber(currentUser.Username || "");
  const wali = normalizePhoneNumber(student.WaliUsername || "");
  const parent = normalizePhoneNumber(student.ParentContact || "");
  return (
    (wali && (wali === sessionUsername || wali === sessionPhone)) ||
    (parent && (parent === sessionUsername || parent === sessionPhone)) ||
    String(currentUser.StudentID || "").trim() === String(student.StudentID)
  );
}

function ATT_assertCanManageScheduleAttendance_(currentUser, schedule) {
  if (!["Mudir", "Admin", "Ustadz"].includes(currentUser.Role)) {
    throw new Error("Akses absensi ditolak.");
  }
  if (
    currentUser.Role === "Ustadz" &&
    !ATT_isTeacherAssigned_(schedule, currentUser)
  ) {
    throw new Error("Ustadz hanya dapat mengelola absensi jadwalnya sendiri.");
  }
}

function ATT_getAttendanceObjects_() {
  const sheet = getSheet_(SHEET_ATTENDANCE);
  if (!sheet) return [];
  return ATT_sheetToObjects_(sheet);
}

function ATT_getSessionObjects_() {
  const sheet = getSheet_(SHEET_ATTENDANCE_SESSIONS);
  if (!sheet) return [];
  return ATT_sheetToObjects_(sheet);
}

function ATT_sheetToObjects_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map((header) => String(header || "").trim());
  return values
    .slice(1)
    .filter((row) => row.some((cell) => cell !== "" && cell !== null))
    .map((row, index) => {
      const obj = {};
      headers.forEach((header, col) => {
        obj[header] = row[col];
      });
      obj._rowNumber = index + 2;
      return obj;
    });
}

function ATT_headers_(sheet) {
  return sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map((header) => String(header || "").trim());
}

function ATT_normalizeAttendanceRecord_(record) {
  record = Object.assign({}, record || {});
  record.AttendanceDate = ATT_formatDate_(record.AttendanceDate || record.DateLogged || "");
  record.Category = ATT_normalizeType_(record.Category || record.Type || "KBM");
  record.ActivityName = String(record.ActivityName || record.SubjectOrActivityName || "Umum").trim();
  record.ClassOrGroupName = String(record.ClassOrGroupName || "").trim();
  record.Status = ATT_normalizeStatus_(record.Status || record.Type || "Hadir");
  return record;
}

function ATT_buildStatusSummary_(records) {
  const summary = {
    total: records.length,
    hadir: 0,
    izin: 0,
    sakit: 0,
    alpa: 0,
    telat: 0,
    percentage: 0,
  };
  records.forEach((record) => {
    const status = ATT_normalizeStatus_(record.Status || record.status);
    if (status === "Hadir") summary.hadir++;
    if (status === "Izin") summary.izin++;
    if (status === "Sakit") summary.sakit++;
    if (status === "Alpa") summary.alpa++;
    if (status === "Telat") summary.telat++;
  });
  summary.percentage =
    summary.total > 0 ? Math.round((summary.hadir / summary.total) * 100) : 0;
  return summary;
}

function ATT_groupAttendance_(records, keyName, factory) {
  const groups = {};
  records.forEach((record) => {
    const key = String(record[keyName] || "Tanpa Data");
    if (!groups[key]) groups[key] = [];
    groups[key].push(record);
  });
  return Object.keys(groups)
    .map((key) => factory(key, groups[key]))
    .sort((a, b) => String(a.Name || a.ActivityName || a.ClassOrGroupName || a.TeacherID || "").localeCompare(
      String(b.Name || b.ActivityName || b.ClassOrGroupName || b.TeacherID || ""),
    ));
}

function ATT_sessionLookupKey_(session) {
  return [
    session.ScheduleID || "manual",
    ATT_formatDate_(session.AttendanceDate),
    ATT_normalizeType_(session.AttendanceType || session.Type || session.Category),
    String(session.ClassOrGroupName || "").trim(),
    String(session.ActivityName || session.SubjectOrActivityName || "").trim(),
    String(session.TeacherID || "").trim(),
    String(session.TeacherSourceID || "").trim(),
  ].join("|");
}

function ATT_generateSessionId_(schedule, attendanceDate) {
  const base = [
    schedule.ScheduleID || "MANUAL",
    attendanceDate,
    schedule.Type,
    schedule.ClassOrGroupName,
    schedule.SubjectOrActivityName,
    schedule.TeacherID,
    schedule.TeacherSourceID,
  ].join("|");
  return "ATS" + Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, base)
    .map((byte) => ("0" + (byte & 0xff).toString(16)).slice(-2))
    .join("")
    .slice(0, 16)
    .toUpperCase();
}

function ATT_generateId_(prefix) {
  return prefix + Date.now() + Math.floor(Math.random() * 10000);
}

function ATT_formatDate_(value) {
  if (!value) return "";
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value || "").slice(0, 10);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
}

function ATT_dayName_(value) {
  const date = value instanceof Date ? value : new Date(value + "T00:00:00");
  const days = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return days[date.getDay()];
}

function ATT_normalizeType_(value) {
  const text = String(value || "").trim();
  if (text.toLowerCase() === "pondok") return "Pondok";
  if (text.toLowerCase() === "kegiatan") return "Kegiatan";
  return "KBM";
}

function ATT_normalizeStatus_(value) {
  const text = String(value || "").trim().toLowerCase();
  if (text === "izin") return "Izin";
  if (text === "sakit") return "Sakit";
  if (text === "alpa" || text === "alpha" || text === "alpa/alpha") return "Alpa";
  if (text === "telat" || text === "terlambat") return "Telat";
  return "Hadir";
}

function ATT_normalizeTime_(value) {
  return typeof normalizeScheduleTime_ === "function"
    ? normalizeScheduleTime_(value)
    : String(value || "").trim();
}

function ATT_uniqueSchedules_(schedules) {
  const seen = {};
  return (schedules || []).filter((schedule) => {
    const id = String(schedule && schedule.ScheduleID || "").trim();
    const key = id || [
      schedule.Type,
      schedule.TeacherID,
      schedule.SubjectOrActivityName,
      schedule.ClassOrGroupName,
      schedule.DayOfWeek,
      schedule.StartTime,
      schedule.EndTime,
    ].join("|");
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function ATT_readFirst_(row, names, read) {
  for (let i = 0; i < names.length; i++) {
    const value = read(row, names[i]);
    if (value !== "" && value !== null && value !== undefined) return value;
  }
  return "";
}

function ATT_studentClass_(student) {
  return String(
    (student &&
      (student["Class/Level"] ||
        student.Class ||
        student.Kelas ||
        student.Rombel ||
        student.ClassLevel ||
        ATT_deriveClassFromLevelGender_(student.Level, student.Gender))) ||
      "",
  ).trim();
}

function ATT_uniqueClasses_(students) {
  const seen = {};
  students.forEach((student) => {
    const className = ATT_studentClass_(student);
    if (className) seen[className] = true;
  });
  return Object.keys(seen).sort();
}

function ATT_uniqueScheduleClasses_(schedules) {
  const seen = {};
  (schedules || []).forEach((schedule) => {
    const className = String(schedule && schedule.ClassOrGroupName || "").trim();
    if (className) seen[className] = true;
  });
  return Object.keys(seen).sort();
}

function ATT_normalizeClassKey_(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\b(kelas|class|level|tingkat)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function ATT_normalizeGenderGroup_(gender) {
  const text = String(gender || "").toLowerCase();
  if (/(ikhwan|laki|putra|pa\b|lk|male)/.test(text)) return "Ikhwan";
  if (/(akhwat|perempuan|putri|pi\b|pr|female)/.test(text)) return "Akhwat";
  return "";
}

function ATT_normalizeLevelToken_(level) {
  const match = String(level || "").match(/\d+/);
  return match ? match[0] : "";
}

function ATT_deriveClassFromLevelGender_(level, gender) {
  const levelToken = ATT_normalizeLevelToken_(level);
  const group = ATT_normalizeGenderGroup_(gender);
  return levelToken && group ? levelToken + " " + group : "";
}

function ATT_classCandidates_(className, level, gender) {
  const candidates = {};
  const add = (value) => {
    const text = String(value || "").trim();
    if (text) candidates[text] = true;
  };
  const classText = String(className || "").trim();
  const levelFromClass = ATT_normalizeLevelToken_(classText);
  const groupFromClass = ATT_normalizeGenderGroup_(classText);
  add(classText);

  // Class/Level adalah sumber utama. Level + Gender hanya melengkapi kelas
  // yang kosong atau belum menyebut kelompok, bukan membuat kelas tandingan.
  if (levelFromClass && groupFromClass) {
    add(levelFromClass + " " + groupFromClass);
  } else if (levelFromClass) {
    add(ATT_deriveClassFromLevelGender_(levelFromClass, gender));
  } else if (!classText) {
    add(ATT_deriveClassFromLevelGender_(level, gender));
  }

  const group = groupFromClass || (!classText ? ATT_normalizeGenderGroup_(gender) : "");
  add(group);
  return Object.keys(candidates);
}

function ATT_teacherAliases_(currentUser) {
  const values = [];
  const add = (value) => {
    const normalized = ATT_normalizeTeacherToken_(value);
    if (normalized && values.indexOf(normalized) === -1) values.push(normalized);
  };
  add(currentUser && currentUser.Username);
  add(currentUser && currentUser.Name);
  const teacher = ATT_findCanonicalTeacherForUser_(currentUser);
  if (teacher) {
    add(teacher.Username);
    add(teacher.Name);
    add(teacher.ShortName);
    (teacher.Aliases || []).forEach(add);
  }
  return values;
}

function ATT_normalizeTeacherToken_(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/ustadzah|ustadz|ustzh|usth|ustz|ust\.|ust/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function ATT_isTeacherAssigned_(schedule, currentUser) {
  schedule = typeof schedule === "object" ? schedule || {} : { TeacherID: schedule };
  const scheduleSourceId = String(
    schedule.TeacherSourceID || ATT_sourceIdForUsername_(schedule.TeacherID) || "",
  ).trim();
  const userSourceId = ATT_userTeacherSourceId_(currentUser);
  if (scheduleSourceId && userSourceId) return scheduleSourceId === userSourceId;
  return (
    ATT_normalizeTeacherToken_(schedule.TeacherID) !== "" &&
    ATT_normalizeTeacherToken_(schedule.TeacherID) ===
      ATT_normalizeTeacherToken_(currentUser && currentUser.Username)
  );
}

function ATT_sourceIdForUsername_(username) {
  if (typeof MASTER_SCHEDULE_TEACHERS === "undefined") return "";
  const normalized = ATT_normalizeTeacherToken_(username);
  const teacher = MASTER_SCHEDULE_TEACHERS.find(
    (item) => {
      const aliases = [item.Username].concat(item.Aliases || []);
      return aliases.some((alias) => ATT_normalizeTeacherToken_(alias) === normalized);
    },
  );
  return teacher ? String(teacher.TeacherSourceID || "").trim() : "";
}

function ATT_teacherDisplayName_(schedule) {
  schedule = schedule || {};
  const sourceId = String(schedule.TeacherSourceID || "").trim();
  const username = ATT_normalizeTeacherToken_(schedule.TeacherID);
  if (typeof MASTER_SCHEDULE_TEACHERS !== "undefined") {
    const teacher = MASTER_SCHEDULE_TEACHERS.find((item) => {
      const itemSourceId = String(item.TeacherSourceID || "").trim();
      const aliases = [item.Username, item.Name, item.ShortName].concat(item.Aliases || []);
      return (
        (sourceId && itemSourceId === sourceId) ||
        (username && aliases.some((alias) => ATT_normalizeTeacherToken_(alias) === username))
      );
    });
    if (teacher) return String(teacher.Name || teacher.ShortName || teacher.Username || "");
  }
  return String(schedule.TeacherID || "").trim();
}

function ATT_findCanonicalTeacherForUser_(currentUser) {
  if (!currentUser || typeof MASTER_SCHEDULE_TEACHERS === "undefined") return null;
  const username = ATT_normalizeTeacherToken_(currentUser.Username);
  const name = ATT_normalizeTeacherToken_(currentUser.Name);
  const directMatch = MASTER_SCHEDULE_TEACHERS.find((teacher) => {
    const usernameTokens = [teacher.Username].concat(teacher.UsernameAliases || []);
    const nameTokens = [teacher.Name, teacher.ShortName].concat(teacher.Aliases || []);
    return (
      (username && usernameTokens.some(
        (value) => ATT_normalizeTeacherToken_(value) === username,
      )) ||
      (name && nameTokens.some(
        (value) => ATT_normalizeTeacherToken_(value) === name,
      ))
    );
  });
  if (directMatch) return directMatch;

  const storedSourceId = String(currentUser.TeacherSourceID || "").trim();
  return storedSourceId
    ? MASTER_SCHEDULE_TEACHERS.find(
        (teacher) => String(teacher.TeacherSourceID || "").trim() === storedSourceId,
      ) || null
    : null;
}

function ATT_userTeacherSourceId_(currentUser) {
  const teacher = ATT_findCanonicalTeacherForUser_(currentUser);
  return String(
    (teacher && teacher.TeacherSourceID) ||
      (currentUser && currentUser.TeacherSourceID) ||
      "",
  ).trim();
}

function ATT_teacherKey_(value) {
  const sourceId = String(value && value.TeacherSourceID || "").trim();
  return sourceId
    ? "source:" + sourceId
    : "username:" + ATT_normalizeTeacherToken_(value && value.TeacherID);
}

function ATT_viewerContext_(currentUser) {
  return {
    UserID: String(currentUser && currentUser.UserID || ""),
    Username: String(currentUser && currentUser.Username || ""),
    Role: String(currentUser && currentUser.Role || ""),
    TeacherSourceID: ATT_userTeacherSourceId_(currentUser),
  };
}

function ATT_compareScheduleByTime_(a, b) {
  const aCurrent = ATT_isScheduleCurrent_(a) ? 0 : 1;
  const bCurrent = ATT_isScheduleCurrent_(b) ? 0 : 1;
  if (aCurrent !== bCurrent) return aCurrent - bCurrent;
  return (a.StartTime || "").localeCompare(b.StartTime || "");
}

function ATT_isScheduleCurrent_(schedule, attendanceDate) {
  if (!schedule || !schedule.StartTime || !schedule.EndTime) return false;
  if (
    attendanceDate &&
    ATT_formatDate_(attendanceDate) !== ATT_formatDate_(new Date())
  ) return false;
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const start = ATT_timeToMinutes_(schedule.StartTime);
  const end = ATT_timeToMinutes_(schedule.EndTime);
  if (start === null || end === null) return false;
  return minutes >= start && minutes <= end;
}

function ATT_timeToMinutes_(value) {
  const match = String(value || "").replace(".", ":").match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}
