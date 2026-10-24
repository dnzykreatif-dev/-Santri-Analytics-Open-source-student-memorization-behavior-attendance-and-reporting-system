const SHEET_ACADEMIC_TEACHER_ASSIGNMENTS = "AcademicTeacherAssignments";
const SHEET_EXAM_ELIGIBILITY_OVERRIDES = "ExamEligibilityOverrides";
const SHEET_CURRICULUM_EXAM_ITEMS = "CurriculumExamItems";
const SHEET_CURRICULUM_EXAM_SCORES = "CurriculumExamScores";

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

const CURRICULUM_EXAM_ITEM_HEADERS = [
  "ItemID",
  "PeriodID",
  "SourceScheduleID",
  "Category",
  "Name",
  "ClassOrGroupName",
  "TeacherID",
  "TeacherSourceID",
  "AssessmentType",
  "MaxScore",
  "KKM",
  "Weight",
  "Rubric",
  "IncludeInReport",
  "IsActive",
  "CreatedBy",
  "CreatedAt",
  "UpdatedAt",
];

const CURRICULUM_EXAM_SCORE_HEADERS = [
  "ScoreID",
  "PeriodID",
  "ItemID",
  "StudentID",
  "Score",
  "Status",
  "Notes",
  "TeacherID",
  "UpdatedAt",
];

const REPORT_DEFAULT_ATTENDANCE_THRESHOLD = 75;
const REPORT_DEFAULT_ELIGIBILITY_CATEGORIES = ["KBM", "Pondok", "Kegiatan"];
const REPORT_CURRICULUM_DEFAULT_RUBRICS = {
  kbm: "Nilai Ujian Semester",
  pondok: "Pemahaman, praktik, adab",
  kegiatan: "Partisipasi, praktik, adab",
  hafalan: "Hafalan, tajwid, kelancaran, adab",
  doa: "Hafal, lancar, makna, adab",
};

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
    curriculumItems: setupSheetWithHeaders_(
      SHEET_CURRICULUM_EXAM_ITEMS,
      CURRICULUM_EXAM_ITEM_HEADERS,
    ),
    curriculumScores: setupSheetWithHeaders_(
      SHEET_CURRICULUM_EXAM_SCORES,
      CURRICULUM_EXAM_SCORE_HEADERS,
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

function REPORT_userIdentityKeys_(user) {
  const values = [
    user && user.Username,
    user && user.Name,
    user && user.UserID,
    user && user.TeacherID,
  ];
  const seen = {};
  return values
    .map(REPORT_key_)
    .filter(Boolean)
    .filter((value) => {
      if (seen[value]) return false;
      seen[value] = true;
      return true;
    });
}

function REPORT_isTeacherRelatedToStudent_(user, student, periodId) {
  const sourceId = REPORT_teacherSourceId_(user);
  const userKeys = REPORT_userIdentityKeys_(user);
  const studentClass = REPORT_key_(
    student && (student["Class/Level"] || student.Class || student.Kelas),
  );
  if (!studentClass) return false;
  if (REPORT_key_(user && user.Class) === studentClass) return true;

  const assignmentMatch = REPORT_getRows_(
    SHEET_ACADEMIC_TEACHER_ASSIGNMENTS,
  ).some((assignment) => {
    if (!AC_bool_(assignment.IsActive)) return false;
    if (periodId && REPORT_text_(assignment.PeriodID) !== REPORT_text_(periodId)) {
      return false;
    }
    const teacherMatches = sourceId
      ? REPORT_text_(assignment.TeacherSourceID) === sourceId
      : userKeys.includes(REPORT_key_(assignment.TeacherID));
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
      : userKeys.includes(REPORT_key_(schedule.TeacherID));
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

function REPORT_curriculumAssessmentType_(category, name) {
  const key = REPORT_key_(category + " " + name);
  if (key.indexOf("hafalan") !== -1 || key.indexOf("quran") !== -1 || key.indexOf("qur an") !== -1) {
    return "Hafalan";
  }
  if (key.indexOf("doa") !== -1 || key.indexOf("do a") !== -1) {
    return "Doa";
  }
  if (REPORT_key_(category) === "kbm") return "Angka";
  return "Praktik";
}

function REPORT_curriculumRubric_(category, name) {
  const type = REPORT_key_(REPORT_curriculumAssessmentType_(category, name));
  return (
    REPORT_CURRICULUM_DEFAULT_RUBRICS[type] ||
    REPORT_CURRICULUM_DEFAULT_RUBRICS[REPORT_key_(category)] ||
    "Nilai, praktik, catatan"
  );
}

function REPORT_scheduleToCurriculumItem_(schedule, periodId, actor) {
  const category = REPORT_text_(schedule.Type || schedule.Category) || "Kegiatan";
  const name = REPORT_text_(schedule.SubjectOrActivityName || schedule.ActivityName);
  const assessmentType = REPORT_curriculumAssessmentType_(category, name);
  return {
    ItemID: "CUR-" + Utilities.getUuid().slice(0, 8).toUpperCase(),
    PeriodID: periodId,
    SourceScheduleID: REPORT_text_(schedule.ScheduleID),
    Category: category,
    Name: name,
    ClassOrGroupName: REPORT_text_(schedule.ClassOrGroupName),
    TeacherID: REPORT_text_(schedule.TeacherID),
    TeacherSourceID: REPORT_text_(schedule.TeacherSourceID),
    AssessmentType: assessmentType,
    MaxScore: 100,
    KKM: assessmentType === "Praktik" ? 70 : 75,
    Weight: 1,
    Rubric: REPORT_curriculumRubric_(category, name),
    IncludeInReport: true,
    IsActive: true,
    CreatedBy: REPORT_text_(actor && actor.Username),
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  };
}

function REPORT_teacherCanHandleCurriculumItem_(user, item) {
  if (["Mudir", "Admin"].includes(REPORT_text_(user && user.Role))) return true;
  if (REPORT_text_(user && user.Role) !== "Ustadz") return false;
  const sourceId = REPORT_teacherSourceId_(user);
  const userKeys = REPORT_userIdentityKeys_(user);
  if (sourceId && REPORT_text_(item.TeacherSourceID) === sourceId) return true;
  if (userKeys.includes(REPORT_key_(item.TeacherID))) return true;
  return REPORT_key_(user && user.Class) === REPORT_key_(item.ClassOrGroupName);
}

function REPORT_getCurriculumItemsForUser_(periodId, user) {
  const rows = REPORT_getRows_(SHEET_CURRICULUM_EXAM_ITEMS)
    .filter((item) => !periodId || REPORT_text_(item.PeriodID) === REPORT_text_(periodId))
    .sort(
      (a, b) =>
        REPORT_text_(a.Category).localeCompare(REPORT_text_(b.Category), "id") ||
        REPORT_text_(a.ClassOrGroupName).localeCompare(REPORT_text_(b.ClassOrGroupName), "id") ||
        REPORT_text_(a.Name).localeCompare(REPORT_text_(b.Name), "id"),
    );
  if (["Mudir", "Admin"].includes(REPORT_text_(user && user.Role))) return rows;
  return rows.filter((item) => REPORT_teacherCanHandleCurriculumItem_(user, item));
}

function REPORT_getCurriculumClassesForUser_(user) {
  const classes = {};
  REPORT_getRows_(SHEET_CURRICULUM_EXAM_ITEMS).forEach((item) => {
    if (REPORT_teacherCanHandleCurriculumItem_(user, item)) {
      const value = REPORT_text_(item.ClassOrGroupName);
      if (value) classes[value] = true;
    }
  });
  REPORT_getRows_("Schedules").forEach((schedule) => {
    if (String(schedule.IsActive).toLowerCase() === "false") return;
    const value = REPORT_text_(schedule.ClassOrGroupName);
    if (!value) return;
    if (["Mudir", "Admin"].includes(REPORT_text_(user && user.Role))) {
      classes[value] = true;
      return;
    }
    if (REPORT_teacherCanHandleCurriculumItem_(user, schedule)) {
      classes[value] = true;
    }
  });
  if (typeof AC_getStudents_ === "function") {
    AC_getStudents_().forEach((student) => {
      const value = REPORT_text_(student["Class/Level"] || student.Class || student.Kelas);
      if (value && ["Mudir", "Admin"].includes(REPORT_text_(user && user.Role))) {
        classes[value] = true;
      }
    });
  }
  const ownClass = REPORT_text_(user && user.Class);
  if (ownClass) classes[ownClass] = true;
  return Object.keys(classes).sort((a, b) => a.localeCompare(b, "id"));
}

function REPORT_defaultAcademicYear_(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return month >= 7 ? year + "/" + (year + 1) : (year - 1) + "/" + year;
}

function REPORT_defaultSemester_(date) {
  const month = date.getMonth() + 1;
  return month >= 7 && month <= 12 ? "Ganjil" : "Genap";
}

function REPORT_ensureDefaultAcademicPeriod_(user) {
  if (typeof AC_getPeriods_ !== "function" || typeof AC_ensureSheets_ !== "function") {
    return [];
  }
  AC_ensureSheets_();
  let periods = AC_getPeriods_();
  if (periods.length > 0) return periods;
  if (!["Mudir", "Admin"].includes(REPORT_text_(user && user.Role))) return periods;

  const now = new Date();
  const year = REPORT_defaultAcademicYear_(now);
  const semester = REPORT_defaultSemester_(now);
  const startYear = semester === "Ganjil" ? now.getFullYear() : now.getFullYear() - 1;
  const startDate = semester === "Ganjil" ? startYear + "-07-01" : now.getFullYear() + "-01-01";
  const endDate = semester === "Ganjil" ? startYear + "-12-31" : now.getFullYear() + "-06-30";
  const row = {
    PeriodID: "PER-" + Utilities.getUuid().slice(0, 8).toUpperCase(),
    AcademicYear: year,
    Semester: semester,
    Title: "Raport Semester " + semester + " " + year,
    StartDate: startDate,
    EndDate: endDate,
    GradeMode: "SemesterExamOnly",
    AttendanceThreshold: REPORT_DEFAULT_ATTENDANCE_THRESHOLD,
    EligibilityCategories: REPORT_DEFAULT_ELIGIBILITY_CATEGORIES.join(","),
    Status: "Draft",
    IsLocked: false,
    PublishedAt: "",
    CreatedAt: now.toISOString(),
    UpdatedAt: now.toISOString(),
  };
  const sheet = getSheet_(SHEET_ACADEMIC_PERIODS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(headers.map((header) => row[header] === undefined ? "" : row[header]));
  AUTH_appendAuditLog_("CREATE", "AcademicPeriod", row.PeriodID, user, {
    source: "auto-default-curriculum-exam",
  });
  return AC_getPeriods_();
}

function getCurriculumExamSetup(periodId, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, {
      roles: ["Mudir", "Admin", "Ustadz"],
    });
    requireProductModuleEnabled_("academic", sessionUser);
    if (!isReportV2EnabledFor_(sessionUser)) {
      return { ok: false, message: "Raport versi baru belum diaktifkan." };
    }
    setupReportV2Sheets_();
    const periods = REPORT_ensureDefaultAcademicPeriod_(sessionUser);
    return {
      ok: true,
      data: {
        items: REPORT_getCurriculumItemsForUser_(periodId, sessionUser),
        periods,
        classes: REPORT_getCurriculumClassesForUser_(sessionUser),
      },
    };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

function syncCurriculumExamItemsFromSchedules(periodId, apply, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, {
      roles: ["Mudir", "Admin"],
    });
    requireProductModuleEnabled_("academic", sessionUser);
    if (!isReportV2EnabledFor_(sessionUser)) {
      return { ok: false, message: "Raport versi baru belum diaktifkan." };
    }
    setupReportV2Sheets_();
    const period = typeof AC_getPeriod_ === "function" ? AC_getPeriod_(periodId) : null;
    if (!period) return { ok: false, message: "Periode tidak ditemukan." };

    const existing = REPORT_getRows_(SHEET_CURRICULUM_EXAM_ITEMS);
    const existingKeys = {};
    existing.forEach((item) => {
      existingKeys[
        [
          REPORT_text_(item.PeriodID),
          REPORT_text_(item.SourceScheduleID),
          REPORT_key_(item.Name),
          REPORT_key_(item.ClassOrGroupName),
        ].join("|")
      ] = true;
    });

    const candidates = REPORT_getRows_("Schedules")
      .filter((schedule) => String(schedule.IsActive).toLowerCase() !== "false")
      .filter((schedule) => REPORT_text_(schedule.SubjectOrActivityName))
      .filter((schedule) => REPORT_text_(schedule.ClassOrGroupName))
      .map((schedule) => {
        const item = REPORT_scheduleToCurriculumItem_(
          schedule,
          REPORT_text_(periodId),
          sessionUser,
        );
        const key = [
          REPORT_text_(item.PeriodID),
          REPORT_text_(item.SourceScheduleID),
          REPORT_key_(item.Name),
          REPORT_key_(item.ClassOrGroupName),
        ].join("|");
        item.alreadyExists = !!existingKeys[key];
        existingKeys[key] = true;
        return item;
      });

    const pending = candidates.filter((item) => !item.alreadyExists);
    if (apply && pending.length > 0) {
      const sheet = getSheet_(SHEET_CURRICULUM_EXAM_ITEMS);
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const rows = pending.map((item) =>
        headers.map((header) => {
          if (header === "IncludeInReport" || header === "IsActive") return true;
          return item[header] === undefined ? "" : item[header];
        }),
      );
      sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, headers.length).setValues(rows);
      AUTH_appendAuditLog_("SYNC", "CurriculumExamItems", periodId, sessionUser, {
        created: pending.length,
      });
    }

    return {
      ok: true,
      data: {
        candidates,
        created: apply ? pending.length : 0,
        pending: pending.length,
      },
      message: apply
        ? pending.length + " item ujian kurikulum ditambahkan."
        : "Pratinjau item ujian kurikulum siap.",
    };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

function saveCurriculumExamItem(item, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, {
      roles: ["Mudir", "Admin"],
    });
    requireProductModuleEnabled_("academic", sessionUser);
    setupReportV2Sheets_();
    const input = item || {};
    const periodId = REPORT_text_(input.PeriodID);
    const name = REPORT_text_(input.Name);
    const className = REPORT_text_(input.ClassOrGroupName);
    if (!periodId || !name || !className) {
      return { ok: false, message: "Periode, nama ujian, dan kelas wajib diisi." };
    }
    const sheet = getSheet_(SHEET_CURRICULUM_EXAM_ITEMS);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const itemId = REPORT_text_(input.ItemID);
    const existing = itemId
      ? REPORT_getRows_(SHEET_CURRICULUM_EXAM_ITEMS).find(
          (row) => REPORT_text_(row.ItemID) === itemId,
        )
      : null;
    const now = new Date().toISOString();
    const row = {
      ItemID: itemId || "CUR-" + Utilities.getUuid().slice(0, 8).toUpperCase(),
      PeriodID: periodId,
      SourceScheduleID: REPORT_text_(input.SourceScheduleID),
      Category: REPORT_text_(input.Category) || "Kegiatan",
      Name: name,
      ClassOrGroupName: className,
      TeacherID: REPORT_text_(input.TeacherID),
      TeacherSourceID: REPORT_text_(input.TeacherSourceID),
      AssessmentType:
        REPORT_text_(input.AssessmentType) ||
        REPORT_curriculumAssessmentType_(input.Category, name),
      MaxScore: Number(input.MaxScore || 100),
      KKM: Number(input.KKM || 75),
      Weight: Number(input.Weight || 1),
      Rubric:
        REPORT_text_(input.Rubric) ||
        REPORT_curriculumRubric_(input.Category, name),
      IncludeInReport: input.IncludeInReport === false ? false : true,
      IsActive: input.IsActive === false ? false : true,
      CreatedBy: existing ? existing.CreatedBy : sessionUser.Username,
      CreatedAt: existing ? existing.CreatedAt : now,
      UpdatedAt: now,
    };
    const values = headers.map((header) =>
      row[header] === undefined ? "" : row[header],
    );
    if (existing) sheet.getRange(existing._rowNumber, 1, 1, headers.length).setValues([values]);
    else sheet.appendRow(values);
    AUTH_appendAuditLog_("UPSERT", "CurriculumExamItem", row.ItemID, sessionUser, {
      PeriodID: row.PeriodID,
      Name: row.Name,
      ClassOrGroupName: row.ClassOrGroupName,
    });
    return { ok: true, data: row, message: "Item ujian kurikulum tersimpan." };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

function getCurriculumScoreMatrix(filters, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, {
      roles: ["Mudir", "Admin", "Ustadz"],
    });
    requireProductModuleEnabled_("academic", sessionUser);
    setupReportV2Sheets_();
    const itemId = REPORT_text_(filters && filters.ItemID);
    const item = REPORT_getRows_(SHEET_CURRICULUM_EXAM_ITEMS).find(
      (row) => REPORT_text_(row.ItemID) === itemId,
    );
    if (!item) return { ok: false, message: "Item ujian tidak ditemukan." };
    if (!REPORT_teacherCanHandleCurriculumItem_(sessionUser, item)) {
      return { ok: false, message: "Akses item ujian ditolak." };
    }
    const period = typeof AC_getPeriod_ === "function" ? AC_getPeriod_(item.PeriodID) : null;
    if (period && AC_bool_(period.IsLocked)) {
      return { ok: false, message: "Periode terkunci. Buka Draft untuk mengubah nilai." };
    }
    const className = REPORT_key_(item.ClassOrGroupName);
    const students = (typeof AC_getStudents_ === "function" ? AC_getStudents_() : REPORT_getRows_("Students"))
      .filter((student) => REPORT_key_(student["Class/Level"] || student.Class || student.Kelas) === className)
      .filter((student) => REPORT_text_(student.Status).toLowerCase() !== "inactive");
    const scores = REPORT_getRows_(SHEET_CURRICULUM_EXAM_SCORES).filter(
      (score) => REPORT_text_(score.ItemID) === itemId,
    );
    return {
      ok: true,
      data: {
        item,
        period,
        rows: students.map((student) => {
          const score = scores.find(
            (row) => REPORT_text_(row.StudentID) === REPORT_text_(student.StudentID),
          );
          return {
            student,
            score: score || {
              ItemID: itemId,
              StudentID: student.StudentID,
              Score: "",
              Status: "",
              Notes: "",
            },
          };
        }),
      },
    };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

function saveCurriculumExamScores(payload, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, {
      roles: ["Mudir", "Admin", "Ustadz"],
    });
    setupReportV2Sheets_();
    const itemId = REPORT_text_(payload && payload.ItemID);
    const item = REPORT_getRows_(SHEET_CURRICULUM_EXAM_ITEMS).find(
      (row) => REPORT_text_(row.ItemID) === itemId,
    );
    if (!item) return { ok: false, message: "Item ujian tidak ditemukan." };
    if (!REPORT_teacherCanHandleCurriculumItem_(sessionUser, item)) {
      return { ok: false, message: "Akses input nilai ditolak." };
    }
    const period = typeof AC_getPeriod_ === "function" ? AC_getPeriod_(item.PeriodID) : null;
    if (period && AC_bool_(period.IsLocked)) {
      return { ok: false, message: "Periode terkunci. Buka Draft untuk mengubah nilai." };
    }
    const sheet = getSheet_(SHEET_CURRICULUM_EXAM_SCORES);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const existing = REPORT_getRows_(SHEET_CURRICULUM_EXAM_SCORES);
    const now = new Date().toISOString();
    let saved = 0;
    (payload.scores || []).forEach((input) => {
      const studentId = REPORT_text_(input.StudentID);
      if (!studentId) return;
      const scoreText = REPORT_text_(input.Score);
      const status = REPORT_text_(input.Status);
      if (!scoreText && !status && !REPORT_text_(input.Notes)) return;
      const scoreNumber = scoreText === "" ? "" : Number(scoreText);
      if (scoreText !== "" && (isNaN(scoreNumber) || scoreNumber < 0 || scoreNumber > Number(item.MaxScore || 100))) {
        return;
      }
      const found = existing.find(
        (row) =>
          REPORT_text_(row.ItemID) === itemId &&
          REPORT_text_(row.StudentID) === studentId,
      );
      const row = {
        ScoreID: found ? found.ScoreID : "CRS-" + Utilities.getUuid().slice(0, 8).toUpperCase(),
        PeriodID: item.PeriodID,
        ItemID: itemId,
        StudentID: studentId,
        Score: scoreNumber,
        Status: status,
        Notes: REPORT_text_(input.Notes),
        TeacherID: REPORT_text_(sessionUser.Username),
        UpdatedAt: now,
      };
      const values = headers.map((header) =>
        row[header] === undefined ? "" : row[header],
      );
      if (found) sheet.getRange(found._rowNumber, 1, 1, headers.length).setValues([values]);
      else sheet.appendRow(values);
      saved++;
    });
    AUTH_appendAuditLog_("SAVE", "CurriculumExamScores", itemId, sessionUser, {
      saved,
    });
    return { ok: true, data: { saved }, message: saved + " nilai kurikulum tersimpan." };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

function REPORT_curriculumPredikat_(score, kkm) {
  if (score === null || score === "" || score === undefined) return "-";
  const n = Number(score);
  if (isNaN(n)) return "-";
  if (n >= 90) return "Istimewa";
  if (n >= 80) return "Sangat Baik";
  if (n >= Number(kkm || 75)) return "Baik";
  return "Perlu Bimbingan";
}

function REPORT_buildCurriculumReport_(studentId, period, student) {
  if (!period) {
    return { items: [], groups: [], summary: { average: null, complete: false, totalItems: 0, incompleteItems: 0 } };
  }
  const studentClass = REPORT_key_(student && (student["Class/Level"] || student.Class || student.Kelas));
  const scores = REPORT_getRows_(SHEET_CURRICULUM_EXAM_SCORES).filter(
    (score) =>
      REPORT_text_(score.PeriodID) === REPORT_text_(period.PeriodID) &&
      REPORT_text_(score.StudentID) === REPORT_text_(studentId),
  );
  const items = REPORT_getRows_(SHEET_CURRICULUM_EXAM_ITEMS)
    .filter((item) => REPORT_text_(item.PeriodID) === REPORT_text_(period.PeriodID))
    .filter((item) => AC_bool_(item.IsActive))
    .filter((item) => item.IncludeInReport === true || String(item.IncludeInReport).toLowerCase() === "true" || item.IncludeInReport === "")
    .filter((item) => REPORT_key_(item.ClassOrGroupName) === studentClass)
    .map((item) => {
      const score = scores.find((row) => REPORT_text_(row.ItemID) === REPORT_text_(item.ItemID));
      const scoreValue = score && REPORT_text_(score.Score) !== "" ? Number(score.Score) : null;
      const complete = !!score && (scoreValue !== null || !!REPORT_text_(score.Status));
      return {
        ItemID: item.ItemID,
        Category: item.Category || "Kegiatan",
        Name: item.Name || "-",
        ClassOrGroupName: item.ClassOrGroupName || "",
        AssessmentType: item.AssessmentType || "Angka",
        KKM: Number(item.KKM || 75),
        MaxScore: Number(item.MaxScore || 100),
        Weight: Number(item.Weight || 1),
        Rubric: item.Rubric || "",
        Score: scoreValue,
        Status: score ? score.Status || "" : "",
        Notes: score ? score.Notes || "" : "",
        complete,
        predikat: scoreValue === null ? (score && score.Status ? score.Status : "-") : REPORT_curriculumPredikat_(scoreValue, item.KKM),
      };
    })
    .sort(
      (a, b) =>
        REPORT_text_(a.Category).localeCompare(REPORT_text_(b.Category), "id") ||
        REPORT_text_(a.Name).localeCompare(REPORT_text_(b.Name), "id"),
    );
  const numeric = items.filter((item) => item.Score !== null);
  const average =
    numeric.length > 0
      ? Math.round((numeric.reduce((sum, item) => sum + item.Score, 0) / numeric.length) * 100) / 100
      : null;
  const groupMap = {};
  items.forEach((item) => {
    const key = item.Category || "Kegiatan";
    if (!groupMap[key]) groupMap[key] = [];
    groupMap[key].push(item);
  });
  const groups = Object.keys(groupMap).map((name) => ({
    name,
    items: groupMap[name],
  }));
  return {
    items,
    groups,
    summary: {
      average,
      complete: items.length > 0 && items.every((item) => item.complete),
      totalItems: items.length,
      incompleteItems: items.filter((item) => !item.complete).length,
    },
  };
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
    requireProductModuleEnabled_("academic", sessionUser);
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
    requireProductModuleEnabled_("academic", sessionUser);
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
  REPORT_requireStudentAccess_(sessionUser, student, periodId);

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
        curriculum: REPORT_buildCurriculumReport_(studentId, null, student),
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
  const curriculum = REPORT_buildCurriculumReport_(studentId, period, student);
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
      curriculum,
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
        curriculumScores: curriculum.items,
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
