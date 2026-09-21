function getStudents(user, options) {
  return queryStudents(user, options || { page: 1, limit: 5000 });
}

function addStudent(data, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin", "Ustadz"],
  });

  setupSheetWithHeaders_("Students", CORE_SHEET_SCHEMAS.Students);
  const sheet = getSheet_("Students");
  const cleanPhone = String(data.ParentContact || "").trim();
  const now = new Date().toISOString();
  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map((header) => String(header || "").trim());

  if (!String(data.Name || "").trim()) {
    return { ok: false, message: "Nama santri wajib diisi." };
  }
  if (!String(data.ClassLevel || "").trim()) {
    return { ok: false, message: "Kelas/level wajib diisi." };
  }

  const studentId = "STU" + Utilities.getUuid().slice(0, 12).toUpperCase();
  const nis = String(data.NIS || "").trim() || "NIS-" + Date.now();
  const rowData = {
    StudentID: studentId,
    NIS: nis,
    Name: data.Name,
    "Class/Level": data.ClassLevel,
    Level: data.Level || "",
    Gender: data.Gender || "",
    ParentContact: cleanPhone,
    BirthPlace: data.BirthPlace || "",
    BirthDate: data.BirthDate || "",
    SchoolUnit: data.SchoolUnit || "",
    CohortYear: data.CohortYear || "",
    Province: data.Province || "",
    Regency: data.Regency || "",
    ResidencyStatus: data.ResidencyStatus || "",
    DormitoryBlock: data.DormitoryBlock || "",
    Room: data.Room || "",
    CreatedAt: now,
    UpdatedAt: now,
    RecordVersion: 1,
    WaliUsername: data.WaliUsername || normalizePhoneNumber(cleanPhone) || cleanPhone,
    CatatanPembinaan: "",
    Status: "Active",
    DeletedAt: "",
    PhotoFileId: "",
    PhotoUpdatedAt: "",
    QrPublicId: "",
  };

  sheet.appendRow(headers.map((header) => rowData[header] ?? ""));

  if (cleanPhone) {
    registerUser(cleanPhone, "123456", "Wali", {
      phone: cleanPhone,
      studentId: studentId,
      name: data.Name || "",
    });
  }

  bumpStudentDataRevision_();
  AUTH_appendAuditLog_("CREATE", "Student", studentId, sessionUser, rowData);

  return {
    ok: true,
    message: "Santri berhasil ditambahkan dan akun wali telah dibuat.",
    data: { studentId },
  };
}

function updateStudentNote(id, note, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin", "Ustadz"],
  });
  const sheet = getSheet_("Students");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const studentIDCol = headers.indexOf("StudentID");
  const catatanPembinaanCol = headers.indexOf("CatatanPembinaan");
  const updatedAtCol = headers.indexOf("UpdatedAt");
  const versionCol = headers.indexOf("RecordVersion");

  if (studentIDCol === -1 || catatanPembinaanCol === -1) {
    return { ok: false, message: "Kolom tidak ditemukan." };
  }

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][studentIDCol]) === String(id)) {
      sheet.getRange(i + 1, catatanPembinaanCol + 1).setValue(note);
      if (updatedAtCol !== -1) {
        sheet.getRange(i + 1, updatedAtCol + 1).setValue(new Date().toISOString());
      }
      if (versionCol !== -1) {
        const currentVersion = Number(data[i][versionCol] || 0) + 1;
        sheet.getRange(i + 1, versionCol + 1).setValue(currentVersion);
      }
      bumpStudentDataRevision_();
      AUTH_appendAuditLog_("UPDATE", "StudentNote", id, sessionUser, {
        note,
      });
      return { ok: true };
    }
  }
  return { ok: false, message: "Santri tidak ditemukan." };
}

function getStudentDetailData(studentId, currentUser) {
  requireSessionUser_(currentUser, { allowAnonymous: false });
  const memos = normalizeSheetData(
    getSheet_("MemorizationLogs").getDataRange().getValues(),
  )
    .filter((m) => String(m.StudentID) === String(studentId))
    .sort((a, b) => new Date(b.DateLogged) - new Date(a.DateLogged));

  const incidents = normalizeSheetData(
    getSheet_("Incidents").getDataRange().getValues(),
  )
    .filter((i) => String(i.StudentID) === String(studentId))
    .map((incident) => ({
      ...incident,
      Points: getIncidentPoints_(incident),
    }))
    .sort((a, b) => new Date(b.DateOfIncident) - new Date(a.DateOfIncident));

  return { ok: true, data: { memos, incidents } };
}

function getStudentAnalytics(studentId, currentUser) {
  requireSessionUser_(currentUser, { allowAnonymous: false });
  const allMemos = normalizeSheetData(
    getSheet_("MemorizationLogs").getDataRange().getValues(),
  );
  const allIncidents = normalizeSheetData(
    getSheet_("Incidents").getDataRange().getValues(),
  );

  const studentMemos = allMemos.filter((log) => log.StudentID === studentId);
  const studentIncidents = allIncidents.filter(
    (inc) => inc.StudentID === studentId,
  );

  const weeks = 8;
  const labels = [];
  const memoCounts = new Array(weeks).fill(0);
  const incidentPoints = new Array(weeks).fill(0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    weekEnd.setHours(23, 59, 59, 999);

    labels.unshift("W" + (weeks - i));

    studentMemos.forEach((log) => {
      const d = new Date(log.DateLogged);
      if (d >= weekStart && d < weekEnd) memoCounts[weeks - 1 - i]++;
    });

    studentIncidents.forEach((inc) => {
      const d = new Date(inc.DateOfIncident);
      if (d >= weekStart && d < weekEnd) {
        incidentPoints[weeks - 1 - i] += getIncidentPoints_(inc);
      }
    });
  }

  return {
    ok: true,
    data: { labels, memos: memoCounts, points: incidentPoints },
  };
}

function getStudentReportData(studentId, periodId, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    allowAnonymous: false,
  });
  const ss = getSpreadsheet_();
  const studentSheet = getSheet_("Students");
  const studentData = studentSheet.getDataRange().getValues();
  const studentHeaders = studentData[0];
  let studentObj = null;
  for (let i = 1; i < studentData.length; i++) {
    if (String(studentData[i][0]) === String(studentId)) {
      studentObj = serializeRow(studentData[i], studentHeaders);
      break;
    }
  }
  if (!studentObj) return { ok: false, message: "Santri tidak ditemukan" };

  if (
    sessionUser &&
    String(sessionUser.Role).trim().toLowerCase() === "wali" &&
    normalizePhoneNumber(studentObj.WaliUsername || "") !==
      normalizePhoneNumber(sessionUser.Username || "") &&
    normalizePhoneNumber(studentObj.ParentContact || "") !==
      normalizePhoneNumber(sessionUser.Username || "") &&
    String(sessionUser.StudentID || "").trim() !== String(studentId)
  ) {
    return { ok: false, message: "Akses raport santri ditolak." };
  }

  const memos = normalizeSheetData(
    getSheet_("MemorizationLogs").getDataRange().getValues(),
  ).filter((m) => String(m.StudentID) === String(studentId));

  const totalSetoran = memos.length;

  const hafalanKategori = {
    "Setoran Baru": memos.filter((m) => m.Category === "Setoran Baru").length,
    "Muroja'ah": memos.filter((m) => m.Category === "Muroja'ah").length,
    Lainnya: memos.filter(
      (m) => !["Setoran Baru", "Muroja'ah"].includes(m.Category),
    ).length,
  };

  const incidents = normalizeSheetData(
    getSheet_("Incidents").getDataRange().getValues(),
  ).filter((inc) => String(inc.StudentID) === String(studentId));

  const totalSkor = calculateBehaviorScore_(incidents);
  // Debug logging
  Logger.log(
    "getStudentReportData - StudentID: " +
      studentId +
      ", Total Incidents: " +
      incidents.length +
      ", TotalSkor: " +
      totalSkor,
  );
  const pelanggaran = incidents.filter(
    (inc) => inc.IncidentType === "Violation",
  ).length;
  const prestasi = incidents.filter(
    (inc) => inc.IncidentType === "Improvement",
  ).length;

  let statsHadir = { sakit: 0, izin: 0, alpha: 0, alpa: 0, hadir: 0, total: 0, percentage: 0 };
  const currentMonth = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM");
  if (typeof getGuardianAttendanceSummary === "function") {
    const attendanceRes = getGuardianAttendanceSummary(studentId, currentMonth, sessionUser);
    if (attendanceRes && attendanceRes.ok && attendanceRes.data) {
      statsHadir = {
        sakit: attendanceRes.data.sakit || 0,
        izin: attendanceRes.data.izin || 0,
        alpha: attendanceRes.data.alpa || 0,
        alpa: attendanceRes.data.alpa || 0,
        hadir: attendanceRes.data.hadir || 0,
        total: attendanceRes.data.total || 0,
        percentage: attendanceRes.data.percentage || 0,
        month: attendanceRes.data.Month || currentMonth,
        byActivity: attendanceRes.data.byActivity || [],
      };
    }
  }

  let predikat = "Cukup";
  if (totalSkor >= 100 && pelanggaran === 0) predikat = "Istimewa";
  else if (totalSkor >= 70) predikat = "Sangat Baik";
  else if (totalSkor >= 40) predikat = "Baik";
  else if (totalSkor < 40) predikat = "Perlu Bimbingan";

  let academic = null;
  if (typeof getAcademicReportForStudent_ === "function") {
    try {
      academic = getAcademicReportForStudent_(studentObj, periodId, sessionUser);
    } catch (e) {
      academic = {
        availablePeriods: [],
        period: null,
        subjects: [],
        summary: {
          average: null,
          complete: false,
          message: "Data akademik belum siap: " + e.message,
        },
      };
    }
  }

  return {
    ok: true,
    data: {
      profile: studentObj,
      period: academic && academic.period ? academic.period.Title : "Semester Ini",
      hafalan: {
        total: totalSetoran,
        details: hafalanKategori,
        newCount: hafalanKategori["Setoran Baru"] || 0,
        reviewCount: hafalanKategori["Muroja'ah"] || 0,
        lastMemo: memos[0] || null,
      },
      behavior: {
        score: totalSkor,
        violations: pelanggaran,
        achievements: prestasi,
        predikat: predikat,
      },
      attendance: statsHadir,
      academic: academic,
    },
  };
}

function queryStudents(currentUser, options) {
  const sessionUser = requireSessionUser_(currentUser, { allowAnonymous: false });
  const query = options || {};
  const pageSize = Math.max(1, Math.min(5000, Number(query.limit || query.pageSize || 5000)));
  const page = Math.max(1, Number(query.page || 1));
  const search = String(query.search || query.Search || query.query || "").trim().toLowerCase();
  const classFilter = String(query.classFilter || query.Class || "").trim();
  const genderFilter = String(query.gender || query.Gender || "").trim();
  const statusFilter = String(query.status || query.Status || "").trim();
  const residencyFilter = String(query.residencyStatus || query.ResidencyStatus || "").trim();
  const schoolUnitFilter = String(query.schoolUnit || query.SchoolUnit || "").trim();
  const cohortYearFilter = String(query.cohortYear || query.CohortYear || "").trim();
  const revision = getStudentDataRevision_();
  const cacheKey = makeCacheKey_("students", [
    revision,
    sessionUser.Username,
    sessionUser.Role,
    page,
    pageSize,
    search,
    classFilter,
    genderFilter,
    statusFilter,
    residencyFilter,
    schoolUnitFilter,
    cohortYearFilter,
  ]);

  const cache = CacheService.getScriptCache();
  const cached = cache.get(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }

  setupSheetWithHeaders_("Students", CORE_SHEET_SCHEMAS.Students);
  const sheet = getSheet_("Students");
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    const emptyResponse = {
      ok: true,
      data: {
        students: [],
        page,
        pageSize,
        total: 0,
        totalPages: 0,
        revision,
      },
    };
    cache.put(cacheKey, JSON.stringify(emptyResponse), 120);
    return emptyResponse;
  }

  const headers = data[0];
  repairMissingIds_(sheet, headers, "StudentID", "STU", {
    phoneHeader: "ParentContact",
    waliUsernameHeader: "WaliUsername",
    statusHeader: "Status",
    createdAtHeader: "CreatedAt",
  });

  const refreshed = sheet.getDataRange().getValues();
  const refreshedHeaders = refreshed[0];
  const studentRows = refreshed
    .slice(1)
    .filter((row) => row.some((cell) => cell !== "" && cell !== null))
    .map((row) => serializeRow(row, refreshedHeaders))
    .filter((student) => !String(student.DeletedAt || "").trim());

  const userSheet = getSheet_("Users");
  const userData = userSheet ? userSheet.getDataRange().getValues() : [];
  const userHeaders = userData.length > 0 ? userData[0] : [];
  const userStatusMap = {};
  const normalizedSessionUsername = normalizePhoneNumber(
    sessionUser.Username || "",
  );
  userData.slice(1).forEach((row) => {
    const user = serializeRow(row, userHeaders);
    userStatusMap[String(user.Username || "").trim()] = user.Status;
    const normalizedPhone = normalizePhoneNumber(user.Phone);
    if (normalizedPhone) {
      userStatusMap[normalizedPhone] = user.Status;
    }
  });

  const incidentsSheet = getSheet_("Incidents");
  const incidentsData = incidentsSheet
    ? normalizeSheetData(incidentsSheet.getDataRange().getValues())
    : [];

  const scopedStudents = studentRows.filter((student) => {
    if (String(sessionUser.Role).trim().toLowerCase() === "wali") {
      const sessionPhone = normalizePhoneNumber(sessionUser.Phone || "");
      
      const wali = normalizePhoneNumber(student.WaliUsername || "");
      const parentContact = normalizePhoneNumber(student.ParentContact || "");
      
      let matchesUser = false;
      if (wali && (wali === normalizedSessionUsername || wali === sessionPhone)) matchesUser = true;
      if (parentContact && (parentContact === normalizedSessionUsername || parentContact === sessionPhone)) matchesUser = true;
      if (sessionUser.StudentID && String(sessionUser.StudentID).trim() === String(student.StudentID)) matchesUser = true;

      if (!matchesUser) return false;
    }

    if (classFilter && String(student["Class/Level"] || "") !== classFilter) {
      return false;
    }
    if (genderFilter && String(student.Gender || "") !== genderFilter) {
      return false;
    }
    if (statusFilter && String(student.Status || "") !== statusFilter) {
      return false;
    }
    if (
      residencyFilter &&
      String(student.ResidencyStatus || "") !== residencyFilter
    ) {
      return false;
    }
    if (schoolUnitFilter && String(student.SchoolUnit || "") !== schoolUnitFilter) {
      return false;
    }
    if (cohortYearFilter && String(student.CohortYear || "") !== cohortYearFilter) {
      return false;
    }

    if (search) {
      const haystack = [
        student.StudentID,
        student.NIS,
        student.Name,
        student["Class/Level"],
        student.ParentContact,
        student.WaliUsername,
        student.SchoolUnit,
        student.Regency,
        student.Province,
        student.ResidencyStatus,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) {
        return false;
      }
    }

    return true;
  });

  const decoratedStudents = scopedStudents
    .map((student) => {
      const studentIncidents = incidentsData.filter(
        (incident) => String(incident.StudentID) === String(student.StudentID),
      );
      const totalScore = calculateBehaviorScore_(studentIncidents);
      const waliStatus = String(
        userStatusMap[String(student.WaliUsername || "").trim()] || "",
      )
        .toLowerCase()
        .trim();

      let statusLabel = "PEMBINAAN INTENSIF";
      let statusColor = "bg-red-600 text-white animate-pulse";
      if (waliStatus === "inactive") {
        statusLabel = "NON-AKTIF";
        statusColor = "bg-gray-400 text-white";
      } else if (totalScore >= 80) {
        statusLabel = "SANTRI UNGGUL";
        statusColor = "bg-green-500 text-white";
      } else if (totalScore >= 50) {
        statusLabel = "SANTRI NORMAL";
        statusColor = "bg-blue-500 text-white";
      } else if (totalScore >= 30) {
        statusLabel = "PERLU PEMBINAAN";
        statusColor = "bg-yellow-500 text-white";
      }

      return {
        ...student,
        TotalScore: totalScore,
        StatusLabel: statusLabel,
        StatusColor: statusColor,
        PhotoUrl: student.PhotoFileId
          ? "https://drive.google.com/uc?export=view&id=" +
            encodeURIComponent(String(student.PhotoFileId))
          : "",
      };
    })
    .sort((a, b) => String(a.Name || "").localeCompare(String(b.Name || ""), "id"));

  const total = decoratedStudents.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const students = decoratedStudents.slice(startIndex, startIndex + pageSize);

  const response = {
    ok: true,
    data: {
      students,
      page,
      pageSize,
      total,
      totalPages,
      revision,
    },
  };

  const responseText = JSON.stringify(response);
  if (responseText.length < 90000) {
    cache.put(cacheKey, responseText, 180);
  }
  return response;
}

function getStudentStatistics(currentUser, filters) {
  const result = queryStudents(currentUser, Object.assign({ page: 1, limit: 5000 }, filters || {}));
  if (!result.ok) {
    return result;
  }

  const students = result.data.students || [];
  const countsByClass = {};
  const countsByGender = {};
  const countsByStatus = {};
  const countsByResidency = {};
  const countsBySchoolUnit = {};

  students.forEach((student) => {
    const kelas = String(student["Class/Level"] || "Tanpa Kelas");
    const gender = String(student.Gender || "Tidak Diisi");
    const status = String(student.Status || "Active");
    const residency = String(student.ResidencyStatus || "Tidak Diisi");
    const schoolUnit = String(student.SchoolUnit || "Tidak Diisi");

    countsByClass[kelas] = (countsByClass[kelas] || 0) + 1;
    countsByGender[gender] = (countsByGender[gender] || 0) + 1;
    countsByStatus[status] = (countsByStatus[status] || 0) + 1;
    countsByResidency[residency] = (countsByResidency[residency] || 0) + 1;
    countsBySchoolUnit[schoolUnit] = (countsBySchoolUnit[schoolUnit] || 0) + 1;
  });

  return {
    ok: true,
    data: {
      total: students.length,
      countsByClass,
      countsByGender,
      countsByStatus,
      countsByResidency,
      countsBySchoolUnit,
      withQr: students.filter((student) => String(student.QrPublicId || "").trim()).length,
      withPhoto: students.filter((student) => String(student.PhotoFileId || "").trim()).length,
    },
  };
}

function exportStudentsCsv(currentUser, filters) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  const result = queryStudents(currentUser, Object.assign({ page: 1, limit: 5000 }, filters || {}));
  if (!result.ok) {
    return result;
  }

  const rows = result.data.students || [];
  const csvHeaders = [
    "StudentID",
    "NIS",
    "Name",
    "Class/Level",
    "Level",
    "Gender",
    "ParentContact",
    "BirthPlace",
    "BirthDate",
    "SchoolUnit",
    "CohortYear",
    "Province",
    "Regency",
    "ResidencyStatus",
    "DormitoryBlock",
    "Room",
    "Status",
    "WaliUsername",
    "QrPublicId",
    "UpdatedAt",
  ];
  const escapeCsv = (value) => {
    const text = String(value == null ? "" : value);
    if (/[",\n]/.test(text)) {
      return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
  };
  const csv = [
    csvHeaders.join(","),
    ...rows.map((row) =>
      csvHeaders
        .map((header) => escapeCsv(row[header]))
        .join(","),
    ),
  ].join("\n");

  AUTH_appendAuditLog_("EXPORT", "Students", "csv", sessionUser, {
    filters: filters || {},
    total: rows.length,
  });

  return {
    ok: true,
    data: {
      filename: "santri-export-" + new Date().toISOString().slice(0, 10) + ".csv",
      csv,
    },
  };
}

function issueStudentQr(studentId, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin", "Ustadz"],
  });
  const sheet = getSheet_("Students");
  if (!sheet) {
    return { ok: false, message: "Sheet Students tidak ditemukan." };
  }
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return { ok: false, message: "Data santri tidak ditemukan." };
  }

  const headers = data[0];
  const studentIdCol = headers.indexOf("StudentID");
  const qrCol = headers.indexOf("QrPublicId");
  const updatedAtCol = headers.indexOf("UpdatedAt");
  const versionCol = headers.indexOf("RecordVersion");
  if (studentIdCol === -1 || qrCol === -1) {
    return { ok: false, message: "Kolom QR belum siap." };
  }

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][studentIdCol]) !== String(studentId)) {
      continue;
    }

    const publicId = String(data[i][qrCol] || "").trim() ||
      "QRP-" + Utilities.getUuid().slice(0, 12).toUpperCase();
    data[i][qrCol] = publicId;
    if (updatedAtCol !== -1) {
      data[i][updatedAtCol] = new Date().toISOString();
    }
    if (versionCol !== -1) {
      data[i][versionCol] = Number(data[i][versionCol] || 0) + 1;
    }
    sheet.getRange(i + 1, 1, 1, headers.length).setValues([data[i]]);

    const signature = STUDENT_buildQrSignature_(publicId, studentId);
    const qrUrl =
      getAppEntryUrl_() +
      "?page=student-qr&pid=" +
      encodeURIComponent(publicId) +
      "&sig=" +
      encodeURIComponent(signature);
    const qrImageUrl =
      "https://chart.googleapis.com/chart?cht=qr&chs=320x320&chld=M|1&chl=" +
      encodeURIComponent(qrUrl);

    bumpStudentDataRevision_();
    AUTH_appendAuditLog_("ISSUE_QR", "Student", studentId, sessionUser, {
      publicId,
    });

    return {
      ok: true,
      data: {
        studentId,
        qrPublicId: publicId,
        qrSignature: signature,
        qrUrl,
        qrImageUrl,
      },
    };
  }

  return { ok: false, message: "Santri tidak ditemukan." };
}

function resolveStudentQr(payload) {
  const input = payload || {};
  const publicId =
    String(input.pid || input.qrPublicId || input.publicId || "").trim();
  const signature = String(input.sig || input.signature || "").trim();
  if (!publicId || !signature) {
    return { ok: false, message: "QR tidak valid." };
  }

  const sheet = getSheet_("Students");
  if (!sheet) {
    return { ok: false, message: "Sheet Students tidak ditemukan." };
  }
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return { ok: false, message: "Santri tidak ditemukan." };
  }

  const headers = data[0];
  const qrCol = headers.indexOf("QrPublicId");
  if (qrCol === -1) {
    return { ok: false, message: "Kolom QR belum siap." };
  }

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][qrCol] || "").trim() !== publicId) {
      continue;
    }

    const student = serializeRow(data[i], headers);
    if (!STUDENT_validateQrSignature_(publicId, student.StudentID, signature)) {
      return { ok: false, message: "Tanda tangan QR tidak cocok." };
    }

    return {
      ok: true,
      data: {
        studentId: student.StudentID,
        nis: student.NIS || student.StudentID,
        name: student.Name,
        classLevel: student["Class/Level"],
        gender: student.Gender,
        residence: student.ResidencyStatus,
        schoolUnit: student.SchoolUnit,
        photoUrl: student.PhotoFileId
          ? "https://drive.google.com/uc?export=view&id=" +
            encodeURIComponent(String(student.PhotoFileId))
          : "",
        qrPublicId: publicId,
      },
    };
  }

  return { ok: false, message: "QR santri tidak ditemukan." };
}

function STUDENT_getQrSecret_() {
  const properties = PropertiesService.getScriptProperties();
  let secret = properties.getProperty("STUDENT_QR_SECRET");
  if (!secret) {
    secret = Utilities.getUuid() + Utilities.getUuid();
    properties.setProperty("STUDENT_QR_SECRET", secret);
  }
  return secret;
}

function STUDENT_buildQrSignature_(publicId, studentId) {
  const secret = STUDENT_getQrSecret_();
  const raw = Utilities.computeHmacSha256Signature(
    String(publicId) + ":" + String(studentId),
    secret,
  );
  return raw
    .map(function (b) {
      const v = (b < 0 ? b + 256 : b).toString(16);
      return v.length === 1 ? "0" + v : v;
    })
    .join("");
}

function STUDENT_validateQrSignature_(publicId, studentId, signature) {
  return STUDENT_buildQrSignature_(publicId, studentId) === String(signature || "");
}

function bumpStudentDataRevision_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const properties = PropertiesService.getScriptProperties();
    const current = Number(properties.getProperty("STUDENT_DATA_REVISION") || "0");
    properties.setProperty("STUDENT_DATA_REVISION", String(current + 1));
    return current + 1;
  } finally {
    lock.releaseLock();
  }
}

function getStudentDataRevision_() {
  const value = Number(
    PropertiesService.getScriptProperties().getProperty("STUDENT_DATA_REVISION") ||
      "0",
  );
  return isNaN(value) ? 0 : value;
}

function makeCacheKey_(prefix, parts) {
  const payload = JSON.stringify(parts || []);
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    prefix + ":" + payload,
  );
  const encoded = digest
    .map(function (b) {
      const v = (b < 0 ? b + 256 : b).toString(16);
      return v.length === 1 ? "0" + v : v;
    })
    .join("");
  return prefix + ":" + encoded.slice(0, 48);
}
