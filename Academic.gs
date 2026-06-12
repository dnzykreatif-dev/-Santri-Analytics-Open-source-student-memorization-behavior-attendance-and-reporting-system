const SHEET_ACADEMIC_PERIODS = "AcademicPeriods";
const SHEET_ACADEMIC_SUBJECTS = "AcademicSubjects";
const SHEET_ASSESSMENT_COMPONENTS = "AssessmentComponents";
const SHEET_ACADEMIC_SCORES = "AcademicScores";
const SHEET_ACADEMIC_SCORE_IMPORT = "AcademicScoreImport";

const ACADEMIC_PERIOD_HEADERS = [
  "PeriodID",
  "AcademicYear",
  "Semester",
  "Title",
  "StartDate",
  "EndDate",
  "Status",
  "IsLocked",
  "PublishedAt",
  "CreatedAt",
  "UpdatedAt",
];

const ACADEMIC_SUBJECT_HEADERS = [
  "SubjectID",
  "Name",
  "Category",
  "Level",
  "Gender",
  "Classes",
  "DefaultKKM",
  "SortOrder",
  "IsActive",
];

const ASSESSMENT_COMPONENT_HEADERS = [
  "ComponentID",
  "PeriodID",
  "SubjectID",
  "Name",
  "Weight",
  "MaxScore",
  "SortOrder",
  "IsActive",
];

const ACADEMIC_SCORE_HEADERS = [
  "ScoreID",
  "PeriodID",
  "StudentID",
  "SubjectID",
  "ComponentID",
  "Score",
  "Notes",
  "TeacherID",
  "UpdatedAt",
];

const ACADEMIC_SCORE_IMPORT_HEADERS = [
  "StudentID",
  "StudentName",
  "SubjectID",
  "SubjectName",
  "ComponentID",
  "ComponentName",
  "Score",
  "Notes",
  "TeacherID",
];

const ACADEMIC_DEFAULT_COMPONENTS = [
  { Name: "Harian", Weight: 40, MaxScore: 100, SortOrder: 1 },
  { Name: "Tugas", Weight: 20, MaxScore: 100, SortOrder: 2 },
  { Name: "PTS", Weight: 20, MaxScore: 100, SortOrder: 3 },
  { Name: "PAS/PAT", Weight: 20, MaxScore: 100, SortOrder: 4 },
];

function setupAcademicSheets() {
  const schemas = getAcademicSheetSchemas_();
  const results = [];
  Object.keys(schemas).forEach((sheetName) => {
    results.push({
      sheet: sheetName,
      result: setupSheetWithHeaders_(sheetName, schemas[sheetName]),
    });
  });
  return { ok: true, data: { results }, message: "Sheet akademik siap." };
}

function getAcademicSheetSchemas_() {
  const schemas = {};
  schemas[SHEET_ACADEMIC_PERIODS] = ACADEMIC_PERIOD_HEADERS;
  schemas[SHEET_ACADEMIC_SUBJECTS] = ACADEMIC_SUBJECT_HEADERS;
  schemas[SHEET_ASSESSMENT_COMPONENTS] = ASSESSMENT_COMPONENT_HEADERS;
  schemas[SHEET_ACADEMIC_SCORES] = ACADEMIC_SCORE_HEADERS;
  schemas[SHEET_ACADEMIC_SCORE_IMPORT] = ACADEMIC_SCORE_IMPORT_HEADERS;
  return schemas;
}

function getAcademicSetup(currentUser) {
  if (!AC_canManage_(currentUser)) {
    return AC_error_("Akses ditolak. Hanya staf yang dapat membuka akademik.");
  }

  try {
    AC_ensureSheets_();
    return AC_success_(
      {
        periods: AC_getPeriods_(),
        subjects: AC_getSubjects_(),
        components: AC_getComponents_(),
        importHeaders: ACADEMIC_SCORE_IMPORT_HEADERS,
        defaultComponents: ACADEMIC_DEFAULT_COMPONENTS,
      },
      "Data akademik berhasil dimuat.",
    );
  } catch (e) {
    return AC_error_("Gagal memuat akademik: " + e.message);
  }
}

function saveAcademicPeriod(period, currentUser) {
  if (!AC_canAdmin_(currentUser)) {
    return AC_error_("Akses ditolak. Hanya Mudir/Admin yang dapat mengelola periode.");
  }

  try {
    AC_ensureSheets_();
    const sheet = getSheet_(SHEET_ACADEMIC_PERIODS);
    const headers = AC_getHeaders_(sheet);
    const now = new Date().toISOString();
    const periodId = AC_text_(period && period.PeriodID);
    const existing = periodId ? AC_findById_(sheet, periodId, "PeriodID") : null;

    if (existing && AC_bool_(existing.item.IsLocked) && !AC_canAdmin_(currentUser)) {
      return AC_error_("Periode terkunci. Hanya Mudir/Admin yang dapat mengubahnya.");
    }

    const normalized = {
      PeriodID: periodId || AC_generateId_("PER"),
      AcademicYear: AC_text_(period && period.AcademicYear),
      Semester: AC_text_(period && period.Semester),
      Title: AC_text_(period && period.Title),
      StartDate: AC_text_(period && period.StartDate),
      EndDate: AC_text_(period && period.EndDate),
      Status: AC_normalizeStatus_(period && period.Status),
      IsLocked: existing ? existing.item.IsLocked : false,
      PublishedAt: existing ? existing.item.PublishedAt : "",
      CreatedAt: existing ? existing.item.CreatedAt || now : now,
      UpdatedAt: now,
    };

    if (!normalized.AcademicYear || !normalized.Semester || !normalized.Title) {
      return AC_error_("Tahun ajaran, semester, dan judul periode wajib diisi.");
    }

    if (existing) {
      AC_writeRow_(sheet, existing.rowNumber, normalized, headers);
    } else {
      sheet.appendRow(AC_objectToRow_(normalized, headers));
    }

    AC_ensureDefaultComponentsForPeriod_(normalized.PeriodID);

    return AC_success_({ period: normalized }, "Periode akademik tersimpan.");
  } catch (e) {
    return AC_error_("Gagal menyimpan periode: " + e.message);
  }
}

function setAcademicPeriodStatus(periodId, status, currentUser) {
  if (!AC_canAdmin_(currentUser)) {
    return AC_error_("Akses ditolak. Hanya Mudir/Admin yang dapat publish atau membuka periode.");
  }

  try {
    AC_ensureSheets_();
    const sheet = getSheet_(SHEET_ACADEMIC_PERIODS);
    const headers = AC_getHeaders_(sheet);
    const existing = AC_findById_(sheet, periodId, "PeriodID");
    if (!existing) return AC_error_("Periode tidak ditemukan.");

    const targetStatus = AC_normalizeStatus_(status);
    const period = existing.item;

    if (targetStatus === "Published") {
      const validation = AC_validatePeriodForPublish_(periodId);
      if (!validation.ok) {
        return AC_error_(
          "Periode belum bisa dipublish: " + validation.message,
          { validation },
        );
      }
      period.Status = "Published";
      period.IsLocked = true;
      period.PublishedAt = new Date().toISOString();
    } else {
      period.Status = targetStatus;
      period.IsLocked = false;
      if (targetStatus !== "Published") period.PublishedAt = "";
    }

    period.UpdatedAt = new Date().toISOString();
    AC_writeRow_(sheet, existing.rowNumber, period, headers);
    return AC_success_({ period }, "Status periode diperbarui.");
  } catch (e) {
    return AC_error_("Gagal mengubah status periode: " + e.message);
  }
}

function saveAcademicSubject(subject, currentUser) {
  if (!AC_canAdmin_(currentUser)) {
    return AC_error_("Akses ditolak. Hanya Mudir/Admin yang dapat mengelola mapel.");
  }

  try {
    AC_ensureSheets_();
    const sheet = getSheet_(SHEET_ACADEMIC_SUBJECTS);
    const headers = AC_getHeaders_(sheet);
    const subjectId = AC_text_(subject && subject.SubjectID);
    const existing = subjectId ? AC_findById_(sheet, subjectId, "SubjectID") : null;
    const normalized = {
      SubjectID: subjectId || AC_generateId_("SUB"),
      Name: AC_text_(subject && subject.Name),
      Category: AC_text_(subject && subject.Category) || "Umum",
      Level: AC_text_(subject && subject.Level) || "Semua",
      Gender: AC_text_(subject && subject.Gender) || "Semua",
      Classes: AC_text_(subject && subject.Classes),
      DefaultKKM: AC_num_(subject && subject.DefaultKKM, 75),
      SortOrder: AC_num_(subject && subject.SortOrder, 999),
      IsActive: subject && subject.IsActive !== undefined ? AC_bool_(subject.IsActive) : true,
    };

    if (!normalized.Name) {
      return AC_error_("Nama mata pelajaran wajib diisi.");
    }

    if (existing) {
      AC_writeRow_(sheet, existing.rowNumber, normalized, headers);
    } else {
      sheet.appendRow(AC_objectToRow_(normalized, headers));
    }

    AC_ensureDefaultComponentsForSubject_(normalized.SubjectID);

    return AC_success_({ subject: normalized }, "Mata pelajaran tersimpan.");
  } catch (e) {
    return AC_error_("Gagal menyimpan mapel: " + e.message);
  }
}

function saveAssessmentComponent(component, currentUser) {
  if (!AC_canAdmin_(currentUser)) {
    return AC_error_("Akses ditolak. Hanya Mudir/Admin yang dapat mengelola bobot nilai.");
  }

  try {
    AC_ensureSheets_();
    const period = AC_getPeriod_(component && component.PeriodID);
    if (!period) return AC_error_("Periode tidak ditemukan.");
    if (AC_bool_(period.IsLocked)) return AC_error_("Periode terkunci. Buka draft dulu sebelum mengubah komponen.");

    const sheet = getSheet_(SHEET_ASSESSMENT_COMPONENTS);
    const headers = AC_getHeaders_(sheet);
    const componentId = AC_text_(component && component.ComponentID);
    const existing = componentId
      ? AC_findById_(sheet, componentId, "ComponentID")
      : null;

    const normalized = {
      ComponentID: componentId || AC_generateId_("CMP"),
      PeriodID: AC_text_(component && component.PeriodID),
      SubjectID: AC_text_(component && component.SubjectID),
      Name: AC_text_(component && component.Name),
      Weight: AC_num_(component && component.Weight, 0),
      MaxScore: AC_num_(component && component.MaxScore, 100),
      SortOrder: AC_num_(component && component.SortOrder, 999),
      IsActive:
        component && component.IsActive !== undefined
          ? AC_bool_(component.IsActive)
          : true,
    };

    if (!normalized.PeriodID || !normalized.SubjectID || !normalized.Name) {
      return AC_error_("Periode, mapel, dan nama komponen wajib diisi.");
    }
    if (normalized.Weight < 0 || normalized.Weight > 100) {
      return AC_error_("Bobot harus berada di antara 0 dan 100.");
    }
    if (normalized.MaxScore <= 0) {
      return AC_error_("Skor maksimum harus lebih dari 0.");
    }

    if (existing) {
      AC_writeRow_(sheet, existing.rowNumber, normalized, headers);
    } else {
      sheet.appendRow(AC_objectToRow_(normalized, headers));
    }

    return AC_success_({ component: normalized }, "Komponen nilai tersimpan.");
  } catch (e) {
    return AC_error_("Gagal menyimpan komponen: " + e.message);
  }
}

function getAcademicScoreMatrix(filters, currentUser) {
  if (!AC_canManage_(currentUser)) {
    return AC_error_("Akses ditolak.");
  }

  try {
    AC_ensureSheets_();
    const periodId = AC_text_(filters && filters.PeriodID);
    const subjectId = AC_text_(filters && filters.SubjectID);
    const classFilter = AC_text_(filters && filters.Class);
    if (!periodId) return AC_error_("Pilih periode terlebih dahulu.");
    if (!subjectId) return AC_error_("Pilih mapel terlebih dahulu.");

    const period = AC_getPeriod_(periodId);
    const subject = AC_getSubject_(subjectId);
    if (!period) return AC_error_("Periode tidak ditemukan.");
    if (!subject) return AC_error_("Mapel tidak ditemukan.");

    AC_ensureDefaultComponents_(periodId, subjectId);
    const components = AC_getComponents_().filter(
      (component) =>
        AC_text_(component.PeriodID) === periodId &&
        AC_text_(component.SubjectID) === subjectId &&
        AC_bool_(component.IsActive),
    );
    const scores = AC_getScores_().filter(
      (score) =>
        AC_text_(score.PeriodID) === periodId &&
        AC_text_(score.SubjectID) === subjectId,
    );
    const students = AC_getStudents_()
      .filter((student) => !classFilter || AC_getStudentClass_(student) === classFilter)
      .filter((student) => AC_subjectAppliesToStudent_(subject, student));

    const rows = students.map((student) => {
      const componentScores = components.map((component) => {
        const score = scores.find(
          (item) =>
            AC_text_(item.StudentID) === AC_text_(student.StudentID) &&
            AC_text_(item.ComponentID) === AC_text_(component.ComponentID),
        );
        return {
          ComponentID: component.ComponentID,
          ScoreID: score ? score.ScoreID : "",
          Score: score ? score.Score : "",
          Notes: score ? score.Notes : "",
        };
      });
      const academicSubject = AC_calculateSubjectResult_(
        subject,
        components,
        scores.filter((score) => AC_text_(score.StudentID) === AC_text_(student.StudentID)),
      );
      return {
        student,
        scores: componentScores,
        result: academicSubject,
      };
    });

    return AC_success_(
      {
        period,
        subject,
        components,
        rows,
        isLocked: AC_bool_(period.IsLocked),
      },
      "Matrix nilai berhasil dimuat.",
    );
  } catch (e) {
    return AC_error_("Gagal memuat matrix nilai: " + e.message);
  }
}

function saveAcademicScores(payload, currentUser) {
  if (!AC_canManage_(currentUser)) {
    return AC_error_("Akses ditolak.");
  }

  try {
    AC_ensureSheets_();
    const periodId = AC_text_(payload && payload.PeriodID);
    const subjectId = AC_text_(payload && payload.SubjectID);
    const rawItems = (payload && payload.scores) || [];
    const period = AC_getPeriod_(periodId);
    if (!period) return AC_error_("Periode tidak ditemukan.");
    if (AC_bool_(period.IsLocked)) {
      return AC_error_("Periode terkunci. Buka draft dulu sebelum mengubah nilai.");
    }

    const deduped = {};
    rawItems.forEach((item) => {
      const key =
        AC_text_(item.StudentID) +
        "|" +
        AC_text_(item.ComponentID);
      deduped[key] = item;
    });
    const items = Object.keys(deduped).map((key) => deduped[key]);

    const sheet = getSheet_(SHEET_ACADEMIC_SCORES);
    const headers = AC_getHeaders_(sheet);
    const allScores = AC_getScores_();
    const now = new Date().toISOString();
    let saved = 0;

    items.forEach((item) => {
      const studentId = AC_text_(item.StudentID);
      const componentId = AC_text_(item.ComponentID);
      const rawScore = AC_text_(item.Score);
      const notes = AC_text_(item.Notes);
      if (!studentId || !componentId || rawScore === "") return;
      const scoreNumber = Number(rawScore);
      if (isNaN(scoreNumber) || scoreNumber < 0 || scoreNumber > 100) return;

      const existing = allScores.find(
        (score) =>
          AC_text_(score.PeriodID) === periodId &&
          AC_text_(score.StudentID) === studentId &&
          AC_text_(score.SubjectID) === subjectId &&
          AC_text_(score.ComponentID) === componentId,
      );
      const row = {
        ScoreID: existing ? existing.ScoreID : AC_generateId_("SCR"),
        PeriodID: periodId,
        StudentID: studentId,
        SubjectID: subjectId,
        ComponentID: componentId,
        Score: scoreNumber,
        Notes: notes,
        TeacherID: AC_text_(item.TeacherID) || AC_text_(currentUser && currentUser.Username) || "System",
        UpdatedAt: now,
      };

      if (existing && existing._rowNumber) {
        AC_writeRow_(sheet, existing._rowNumber, row, headers);
      } else {
        sheet.appendRow(AC_objectToRow_(row, headers));
      }
      saved++;
    });

    return AC_success_({ saved }, saved + " nilai tersimpan.");
  } catch (e) {
    return AC_error_("Gagal menyimpan nilai: " + e.message);
  }
}

function importAcademicScoresFromStaging(periodId, currentUser) {
  if (!AC_canManage_(currentUser)) {
    return AC_error_("Akses ditolak.");
  }

  try {
    AC_ensureSheets_();
    const cleanPeriodId = AC_text_(periodId);
    const period = AC_getPeriod_(cleanPeriodId);
    if (!period) return AC_error_("Periode tidak ditemukan.");
    if (AC_bool_(period.IsLocked)) {
      return AC_error_("Periode terkunci. Buka draft dulu sebelum import.");
    }

    const staging = AC_getRows_(SHEET_ACADEMIC_SCORE_IMPORT);
    if (staging.length === 0) {
      return AC_error_("Sheet import masih kosong.");
    }

    const students = AC_getStudents_();
    const subjects = AC_getSubjects_();
    const components = AC_getComponents_();
    const scoresPayload = [];
    const errors = [];

    staging.forEach((row, index) => {
      const line = index + 2;
      const student = AC_findStudentFromImport_(students, row);
      const subject = AC_findSubjectFromImport_(subjects, row);
      if (!student) {
        errors.push("Baris " + line + ": santri tidak ditemukan.");
        return;
      }
      if (!subject) {
        errors.push("Baris " + line + ": mapel tidak ditemukan.");
        return;
      }

      AC_ensureDefaultComponents_(cleanPeriodId, subject.SubjectID);
      const currentComponents = AC_getComponents_().filter(
        (component) =>
          AC_text_(component.PeriodID) === cleanPeriodId &&
          AC_text_(component.SubjectID) === AC_text_(subject.SubjectID),
      );
      const component = AC_findComponentFromImport_(currentComponents, row);
      if (!component) {
        errors.push("Baris " + line + ": komponen nilai tidak ditemukan.");
        return;
      }

      const score = Number(row.Score);
      if (row.Score === "" || row.Score === null || isNaN(score) || score < 0 || score > 100) {
        errors.push("Baris " + line + ": nilai harus 0-100.");
        return;
      }

      scoresPayload.push({
        StudentID: student.StudentID,
        SubjectID: subject.SubjectID,
        ComponentID: component.ComponentID,
        Score: score,
        Notes: row.Notes || "",
        TeacherID: row.TeacherID || AC_text_(currentUser && currentUser.Username) || "System",
      });
    });

    if (errors.length > 0) {
      return AC_error_("Import dibatalkan karena ada data tidak valid.", {
        errors,
        validRows: scoresPayload.length,
      });
    }

    const grouped = {};
    scoresPayload.forEach((item) => {
      const key = item.SubjectID;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    let saved = 0;
    Object.keys(grouped).forEach((subjectId) => {
      const result = saveAcademicScores(
        {
          PeriodID: cleanPeriodId,
          SubjectID: subjectId,
          scores: grouped[subjectId],
        },
        currentUser,
      );
      if (result.ok) saved += result.data.saved || 0;
    });

    return AC_success_({ saved }, saved + " nilai berhasil diimport.");
  } catch (e) {
    return AC_error_("Gagal import nilai: " + e.message);
  }
}

function updateStudentAcademicProfile(studentId, profile, currentUser) {
  if (!AC_canAdmin_(currentUser)) {
    return AC_error_("Akses ditolak. Hanya Mudir/Admin yang dapat mengubah profil akademik santri.");
  }

  try {
    setupSheetWithHeaders_("Students", CORE_SHEET_SCHEMAS.Students);
    const sheet = getSheet_("Students");
    const headers = AC_getHeaders_(sheet);
    const data = sheet.getDataRange().getValues();
    const idCol = headers.indexOf("StudentID");
    const levelCol = headers.indexOf("Level");
    const genderCol = headers.indexOf("Gender");
    if (idCol === -1 || levelCol === -1 || genderCol === -1) {
      return AC_error_("Header akademik santri belum lengkap. Jalankan setup.");
    }

    for (let i = 1; i < data.length; i++) {
      if (AC_text_(data[i][idCol]) === AC_text_(studentId)) {
        sheet.getRange(i + 1, levelCol + 1).setValue(AC_text_(profile && profile.Level));
        sheet.getRange(i + 1, genderCol + 1).setValue(AC_text_(profile && profile.Gender));
        return AC_success_(null, "Profil akademik santri diperbarui.");
      }
    }

    return AC_error_("Santri tidak ditemukan.");
  } catch (e) {
    return AC_error_("Gagal memperbarui profil akademik: " + e.message);
  }
}

function getAcademicReportForStudent_(student, periodId, currentUser) {
  AC_ensureSheets_();
  const role = currentUser && currentUser.Role;
  const allPeriods = AC_getPeriods_();
  const visiblePeriods =
    role === "Wali"
      ? allPeriods.filter((period) => AC_text_(period.Status) === "Published")
      : allPeriods;
  const selectedPeriod =
    visiblePeriods.find((period) => AC_text_(period.PeriodID) === AC_text_(periodId)) ||
    visiblePeriods.find((period) => AC_text_(period.Status) === "Published") ||
    visiblePeriods[0] ||
    null;

  if (!selectedPeriod) {
    return {
      availablePeriods: visiblePeriods,
      period: null,
      subjects: [],
      summary: {
        average: null,
        complete: false,
        message:
          role === "Wali"
            ? "Raport akademik belum dipublikasikan."
            : "Belum ada periode akademik.",
      },
    };
  }

  const subjects = AC_getSubjects_()
    .filter((subject) => AC_bool_(subject.IsActive))
    .filter((subject) => AC_subjectAppliesToStudent_(subject, student));
  const allScores = AC_getScores_().filter(
    (score) =>
      AC_text_(score.PeriodID) === AC_text_(selectedPeriod.PeriodID) &&
      AC_text_(score.StudentID) === AC_text_(student.StudentID),
  );
  const allComponents = AC_getComponents_().filter(
    (component) => AC_text_(component.PeriodID) === AC_text_(selectedPeriod.PeriodID),
  );

  const subjectReports = subjects
    .map((subject) => {
      const components = allComponents
        .filter(
          (component) =>
            AC_text_(component.SubjectID) === AC_text_(subject.SubjectID) &&
            AC_bool_(component.IsActive),
        )
        .sort((a, b) => AC_num_(a.SortOrder, 999) - AC_num_(b.SortOrder, 999));
      const scores = allScores.filter(
        (score) => AC_text_(score.SubjectID) === AC_text_(subject.SubjectID),
      );
      return AC_calculateSubjectResult_(subject, components, scores);
    })
    .filter(
      (subject) =>
        subject.components.length > 0 ||
        AC_text_(selectedPeriod.Status) !== "Published",
    );

  const completed = subjectReports.filter((subject) => subject.complete && subject.finalScore !== null);
  const average =
    completed.length > 0
      ? AC_round_(
          completed.reduce((sum, subject) => sum + subject.finalScore, 0) /
            completed.length,
        )
      : null;

  return {
    availablePeriods: visiblePeriods,
    period: selectedPeriod,
    subjects: subjectReports,
    summary: {
      average,
      complete:
        subjectReports.length > 0 &&
        subjectReports.every((subject) => subject.complete),
      totalSubjects: subjectReports.length,
      incompleteSubjects: subjectReports.filter((subject) => !subject.complete).length,
    },
  };
}

function AC_validatePeriodForPublish_(periodId) {
  const period = AC_getPeriod_(periodId);
  if (!period) return { ok: false, message: "Periode tidak ditemukan." };
  AC_ensureDefaultComponentsForPeriod_(periodId);

  const students = AC_getStudents_().filter(
    (student) => AC_text_(student.Status).toLowerCase() !== "inactive",
  );
  const subjects = AC_getSubjects_().filter((subject) => AC_bool_(subject.IsActive));
  const components = AC_getComponents_().filter(
    (component) =>
      AC_text_(component.PeriodID) === AC_text_(periodId) &&
      AC_bool_(component.IsActive),
  );
  const scores = AC_getScores_().filter(
    (score) => AC_text_(score.PeriodID) === AC_text_(periodId),
  );

  if (students.length === 0) {
    return { ok: false, message: "Belum ada santri aktif." };
  }
  if (subjects.length === 0) {
    return { ok: false, message: "Belum ada mapel aktif." };
  }

  const issues = [];
  students.forEach((student) => {
    const appliedSubjects = subjects.filter((subject) =>
      AC_subjectAppliesToStudent_(subject, student),
    );
    appliedSubjects.forEach((subject) => {
      const subjectComponents = components.filter(
        (component) => AC_text_(component.SubjectID) === AC_text_(subject.SubjectID),
      );
      if (subjectComponents.length === 0) {
        issues.push(
          AC_getStudentName_(student) + " / " + subject.Name + ": belum ada komponen.",
        );
        return;
      }
      subjectComponents.forEach((component) => {
        const score = scores.find(
          (item) =>
            AC_text_(item.StudentID) === AC_text_(student.StudentID) &&
            AC_text_(item.SubjectID) === AC_text_(subject.SubjectID) &&
            AC_text_(item.ComponentID) === AC_text_(component.ComponentID),
        );
        if (!AC_isValidScore_(score && score.Score)) {
          issues.push(
            AC_getStudentName_(student) +
              " / " +
              subject.Name +
              " / " +
              component.Name +
              ": nilai kosong/invalid.",
          );
        }
      });
    });
  });

  if (issues.length > 0) {
    return {
      ok: false,
      message: issues.slice(0, 5).join("; ") + (issues.length > 5 ? " ..." : ""),
      issues,
    };
  }

  return { ok: true, message: "Siap publish.", issues: [] };
}

function AC_calculateSubjectResult_(subject, components, scores) {
  let weightedScore = 0;
  let totalWeight = 0;
  const componentResults = (components || []).map((component) => {
    const score = (scores || []).find(
      (item) => AC_text_(item.ComponentID) === AC_text_(component.ComponentID),
    );
    const maxScore = AC_num_(component.MaxScore, 100);
    const weight = AC_num_(component.Weight, 0);
    const valid = AC_isValidScore_(score && score.Score);
    const scoreNumber = valid ? Number(score.Score) : null;
    if (valid) {
      weightedScore += (scoreNumber / maxScore) * weight;
      totalWeight += weight;
    }
    return {
      ComponentID: component.ComponentID,
      Name: component.Name,
      Weight: weight,
      MaxScore: maxScore,
      Score: scoreNumber,
      Notes: score ? score.Notes || "" : "",
      complete: valid,
    };
  });

  const expectedWeight = (components || []).reduce(
    (sum, component) => sum + AC_num_(component.Weight, 0),
    0,
  );
  const complete =
    (components || []).length > 0 &&
    componentResults.every((component) => component.complete) &&
    expectedWeight > 0;
  const finalScore = complete ? AC_round_((weightedScore / expectedWeight) * 100) : null;
  const kkm = AC_num_(subject.DefaultKKM, 75);

  return {
    SubjectID: subject.SubjectID,
    Name: subject.Name,
    Category: subject.Category || "Umum",
    Level: subject.Level || "Semua",
    Gender: subject.Gender || "Semua",
    KKM: kkm,
    components: componentResults,
    finalScore,
    predikat: finalScore === null ? "-" : AC_predikat_(finalScore),
    passed: finalScore !== null ? finalScore >= kkm : false,
    complete,
    weightTotal: expectedWeight,
  };
}

function AC_ensureDefaultComponents_(periodId, subjectId) {
  const existing = AC_getComponents_().filter(
    (component) =>
      AC_text_(component.PeriodID) === AC_text_(periodId) &&
      AC_text_(component.SubjectID) === AC_text_(subjectId),
  );
  if (existing.length > 0) return;

  const sheet = getSheet_(SHEET_ASSESSMENT_COMPONENTS);
  const headers = AC_getHeaders_(sheet);
  ACADEMIC_DEFAULT_COMPONENTS.forEach((component) => {
    sheet.appendRow(
      AC_objectToRow_(
        {
          ComponentID: AC_generateId_("CMP"),
          PeriodID: periodId,
          SubjectID: subjectId,
          Name: component.Name,
          Weight: component.Weight,
          MaxScore: component.MaxScore,
          SortOrder: component.SortOrder,
          IsActive: true,
        },
        headers,
      ),
    );
  });
}

function AC_ensureDefaultComponentsForPeriod_(periodId) {
  AC_getSubjects_()
    .filter((subject) => AC_bool_(subject.IsActive))
    .forEach((subject) => {
      AC_ensureDefaultComponents_(periodId, subject.SubjectID);
    });
}

function AC_ensureDefaultComponentsForSubject_(subjectId) {
  AC_getPeriods_()
    .filter((period) => !AC_bool_(period.IsLocked) && AC_text_(period.Status) !== "Published")
    .forEach((period) => {
      AC_ensureDefaultComponents_(period.PeriodID, subjectId);
    });
}

function AC_subjectAppliesToStudent_(subject, student) {
  if (!AC_bool_(subject.IsActive)) return false;

  const studentClass = AC_getStudentClass_(student);
  const studentLevel = AC_getStudentLevel_(student);
  const studentGender = AC_text_(student.Gender);
  const subjectLevel = AC_text_(subject.Level) || "Semua";
  const subjectGender = AC_text_(subject.Gender) || "Semua";
  const subjectClasses = AC_text_(subject.Classes);

  if (
    subjectLevel &&
    subjectLevel !== "Semua" &&
    studentLevel &&
    subjectLevel.toLowerCase() !== studentLevel.toLowerCase()
  ) {
    return false;
  }
  if (subjectLevel && subjectLevel !== "Semua" && !studentLevel) {
    return false;
  }

  if (subjectGender && subjectGender !== "Semua") {
    if (!studentGender) return false;
    if (subjectGender.toLowerCase() !== studentGender.toLowerCase()) return false;
  }

  if (subjectClasses) {
    const allowed = subjectClasses
      .split(",")
      .map((item) => AC_text_(item).toLowerCase())
      .filter(Boolean);
    if (allowed.length > 0 && !allowed.includes(studentClass.toLowerCase())) {
      return false;
    }
  }

  return true;
}

function AC_getStudents_() {
  setupSheetWithHeaders_("Students", CORE_SHEET_SCHEMAS.Students);
  return AC_getRows_("Students");
}

function AC_getPeriods_() {
  return AC_getRows_(SHEET_ACADEMIC_PERIODS).sort(
    (a, b) => new Date(b.UpdatedAt || b.CreatedAt || 0) - new Date(a.UpdatedAt || a.CreatedAt || 0),
  );
}

function AC_getSubjects_() {
  return AC_getRows_(SHEET_ACADEMIC_SUBJECTS).sort(
    (a, b) => AC_num_(a.SortOrder, 999) - AC_num_(b.SortOrder, 999),
  );
}

function AC_getComponents_() {
  return AC_getRows_(SHEET_ASSESSMENT_COMPONENTS).sort(
    (a, b) => AC_num_(a.SortOrder, 999) - AC_num_(b.SortOrder, 999),
  );
}

function AC_getScores_() {
  return AC_getRows_(SHEET_ACADEMIC_SCORES);
}

function AC_getPeriod_(periodId) {
  return AC_getPeriods_().find((period) => AC_text_(period.PeriodID) === AC_text_(periodId));
}

function AC_getSubject_(subjectId) {
  return AC_getSubjects_().find((subject) => AC_text_(subject.SubjectID) === AC_text_(subjectId));
}

function AC_getRows_(sheetName) {
  const sheet = getSheet_(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map((header) => AC_text_(header));
  return values
    .slice(1)
    .filter((row) => row.some((cell) => cell !== "" && cell !== null))
    .map((row, index) => {
      const obj = serializeRow(row, headers);
      obj._rowNumber = index + 2;
      return obj;
    });
}

function AC_findById_(sheet, id, idHeader) {
  if (!id) return null;
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return null;
  const headers = data[0].map((header) => AC_text_(header));
  const idCol = headers.indexOf(idHeader);
  if (idCol === -1) return null;
  for (let i = 1; i < data.length; i++) {
    if (AC_text_(data[i][idCol]) === AC_text_(id)) {
      return {
        rowNumber: i + 1,
        item: serializeRow(data[i], headers),
      };
    }
  }
  return null;
}

function AC_getHeaders_(sheet) {
  return sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map((header) => AC_text_(header));
}

function AC_writeRow_(sheet, rowNumber, obj, headers) {
  sheet.getRange(rowNumber, 1, 1, headers.length).setValues([
    AC_objectToRow_(obj, headers),
  ]);
}

function AC_objectToRow_(obj, headers) {
  return headers.map((header) => (obj[header] !== undefined ? obj[header] : ""));
}

function AC_ensureSheets_() {
  setupAcademicSheets();
}

function AC_canManage_(user) {
  return user && ["Mudir", "Admin", "Ustadz"].includes(user.Role);
}

function AC_canAdmin_(user) {
  return user && ["Mudir", "Admin"].includes(user.Role);
}

function AC_text_(value) {
  return String(value === null || value === undefined ? "" : value).trim();
}

function AC_num_(value, fallback) {
  const n = Number(value);
  return isNaN(n) ? fallback || 0 : n;
}

function AC_bool_(value) {
  if (value === true) return true;
  if (value === false) return false;
  const text = AC_text_(value).toLowerCase();
  return ["true", "yes", "ya", "1", "active", "aktif"].includes(text);
}

function AC_generateId_(prefix) {
  return prefix + "-" + Utilities.getUuid().slice(0, 8).toUpperCase();
}

function AC_normalizeStatus_(status) {
  const text = AC_text_(status);
  if (["Published", "Draft", "Archived"].includes(text)) return text;
  return "Draft";
}

function AC_isValidScore_(value) {
  if (value === "" || value === null || value === undefined) return false;
  const n = Number(value);
  return !isNaN(n) && n >= 0 && n <= 100;
}

function AC_round_(value) {
  return Math.round(Number(value) * 100) / 100;
}

function AC_predikat_(score) {
  if (score >= 90) return "Istimewa";
  if (score >= 80) return "Sangat Baik";
  if (score >= 70) return "Baik";
  return "Perlu Bimbingan";
}

function AC_getStudentName_(student) {
  return student.Name || student.StudentName || student.Nama || "Santri";
}

function AC_getStudentClass_(student) {
  return AC_text_(student["Class/Level"] || student.Class || student.Kelas);
}

function AC_getStudentLevel_(student) {
  const explicitLevel = AC_text_(student.Level);
  if (explicitLevel) return explicitLevel;
  const className = AC_getStudentClass_(student).toUpperCase();
  if (className.indexOf("SMA") !== -1) return "SMA";
  if (className.indexOf("SMK") !== -1) return "SMA";
  if (className.indexOf("ALIYAH") !== -1) return "SMA";
  if (className.indexOf("SMP") !== -1) return "SMP";
  if (className.indexOf("MTS") !== -1) return "SMP";
  if (/\b(10|11|12|X|XI|XII)\b/.test(className)) return "SMA";
  if (/\b(7|8|9|VII|VIII|IX)\b/.test(className)) return "SMP";
  return "";
}

function AC_findStudentFromImport_(students, row) {
  const studentId = AC_text_(row.StudentID);
  const studentName = AC_text_(row.StudentName).toLowerCase();
  return students.find(
    (student) =>
      (studentId && AC_text_(student.StudentID) === studentId) ||
      (studentName && AC_getStudentName_(student).toLowerCase() === studentName),
  );
}

function AC_findSubjectFromImport_(subjects, row) {
  const subjectId = AC_text_(row.SubjectID);
  const subjectName = AC_text_(row.SubjectName).toLowerCase();
  return subjects.find(
    (subject) =>
      (subjectId && AC_text_(subject.SubjectID) === subjectId) ||
      (subjectName && AC_text_(subject.Name).toLowerCase() === subjectName),
  );
}

function AC_findComponentFromImport_(components, row) {
  const componentId = AC_text_(row.ComponentID);
  const componentName = AC_text_(row.ComponentName).toLowerCase();
  return components.find(
    (component) =>
      (componentId && AC_text_(component.ComponentID) === componentId) ||
      (componentName && AC_text_(component.Name).toLowerCase() === componentName),
  );
}

function AC_success_(data, message) {
  return { ok: true, success: true, data, message: message || "" };
}

function AC_error_(message, data) {
  return { ok: false, success: false, message: message || "Terjadi kesalahan.", data };
}
