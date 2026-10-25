function doGet(e) {
  const page = String(
    (e && e.parameter && e.parameter.page) || (e && e.pathInfo) || "",
  ).toLowerCase();
  const isPublicPage =
    page === "public" || page === "website" || page === "student-qr";
  const template = HtmlService.createTemplateFromFile(
    isPublicPage ? "PublicSite" : "Index",
  );
  template.appUrl = getAppEntryUrl_();
  template.publicUrl = getPublicPageUrl_();
  template.scriptUrl = getWebAppUrl_();

  const response = template
    .evaluate()
    .setTitle(isPublicPage ? "Ma'had Raudhatul Ulum" : "Monitor Santri")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");

  response.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return response;
}

function testWaliDashboard_() {
  const fakeUser = {
    Username: "81345217799",
    Role: "Wali",
    SessionToken: "SES_FAKE_TOKEN"
  };
  
  // Create a fake session in the DB temporarily
  const sheet = AUTH_getSessionSheet_();
  sheet.appendRow(["SES_FAKE_TOKEN", "HASH", "USER1", "81345217799", "Wali", new Date().toISOString(), new Date(Date.now() + 100000).toISOString(), new Date().toISOString(), ""]);
  
  try {
    const res = getDashboardSummary(fakeUser, {});
    console.log("Total students returned: " + res.data.totalStudents);
    console.log("Debug info: " + JSON.stringify(res.data.debug));
  } catch(e) {
    console.log("Error: " + e.toString());
  }
}

function doPost(e) {
  try {
    const request = parseExternalRequest_(e);
    const action = String(request.action || "").trim();
    if (!action) {
      return jsonResponse_({
        ok: false,
        message: "Action tidak ditemukan.",
      });
    }

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(action)) {
      return jsonResponse_({
        ok: false,
        message: "Action tidak valid.",
      });
    }

    if (!isExternalActionAllowed_(action)) {
      return jsonResponse_({
        ok: false,
        message: "Action tidak diizinkan.",
      });
    }

    const handler = globalThis[action];
    if (typeof handler !== "function") {
      return jsonResponse_({
        ok: false,
        message: "Action tidak ditemukan: " + action,
      });
    }

    const args = Array.isArray(request.args)
      ? request.args
      : request.payload !== undefined
        ? [request.payload]
        : [];
    if (
      typeof isProductModuleEnabledForAction_ === "function" &&
      !isProductModuleEnabledForAction_(action, args)
    ) {
      return jsonResponse_({
        ok: false,
        message: "Modul ini belum aktif pada paket pondok.",
      });
    }
    const result = handler.apply(null, args);
    return jsonResponse_({
      ok: true,
      data: result === undefined ? null : result,
    });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      message: error && error.message ? error.message : String(error),
    });
  }
}

/**
 * Shared-core bridge used by the centralized client call helper.
 * CORE_LIBRARY_ENABLED stays off until the library version passes staging.
 */
function runAppAction(request) {
  const input = request || {};
  const action = String(input.action || "").trim();
  if (!action || !isExternalActionAllowed_(action)) {
    return { ok: false, message: "Action tidak diizinkan." };
  }
  const args = Array.isArray(input.args) ? input.args : [];
  if (typeof PRODUCT_isDemoReadOnlyAction_ === "function" && PRODUCT_isDemoReadOnlyAction_(action, args)) {
    return { ok: false, message: "Akun demo hanya dapat melihat data dan mencoba laporan." };
  }
  if (
    typeof isProductModuleEnabledForAction_ === "function" &&
    !isProductModuleEnabledForAction_(action, args)
  ) {
    return { ok: false, message: "Modul ini belum aktif pada paket pondok." };
  }

  const sharedCore = PRODUCT_getSharedCore_();
  if (sharedCore && !PRODUCT_isWrapperOnlyAction_(action)) {
    if (typeof sharedCore.runAction !== "function") {
      return {
        ok: false,
        message: "Library inti tidak memiliki fungsi runAction yang sesuai.",
      };
    }
    const result = sharedCore.runAction(action, args, PRODUCT_buildCoreContext_());
    return result && typeof result.ok === "boolean"
      ? result
      : { ok: true, data: result === undefined ? null : result };
  }

  const handler = globalThis[action];
  if (typeof handler !== "function") {
    return { ok: false, message: "Action tidak ditemukan: " + action };
  }
  try {
    const result = handler.apply(null, args);
    return result && typeof result.ok === "boolean"
      ? result
      : { ok: true, data: result === undefined ? null : result };
  } catch (error) {
    return {
      ok: false,
      message: error && error.message ? error.message : String(error),
    };
  }
}

function PRODUCT_isWrapperOnlyAction_(action) {
  return [
    "configureTenantInstallation",
    "getInstallationManifest",
    "getAppReleaseStatus",
    "saveSharedCoreSettings",
  ].includes(String(action || ""));
}

function PRODUCT_buildCoreContext_() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  return {
    spreadsheetId: getConfiguredSpreadsheetId_(),
    reportTemplateId: String(properties.REPORT_TEMPLATE_ID || "").trim(),
    properties: {
      INSTALLATION_MODE: String(properties.INSTALLATION_MODE || "legacy"),
      TENANT_ID: String(properties.TENANT_ID || ""),
      REPORT_V2_ROLLOUT: String(properties.REPORT_V2_ROLLOUT || "off"),
      REPORT_V2_CANARY_USERS: String(properties.REPORT_V2_CANARY_USERS || ""),
      CORE_LIBRARY_ID: String(properties.CORE_LIBRARY_ID || ""),
      CORE_LIBRARY_VERSION: String(properties.CORE_LIBRARY_VERSION || ""),
      CORE_UPDATE_CHANNEL: String(properties.CORE_UPDATE_CHANNEL || "stable"),
      CORE_LIBRARY_ENABLED: String(properties.CORE_LIBRARY_ENABLED || "off"),
    },
  };
}

function PRODUCT_getSharedCore_() {
  const properties = PropertiesService.getScriptProperties();
  const enabled = String(properties.getProperty("CORE_LIBRARY_ENABLED") || "off")
    .trim()
    .toLowerCase();
  if (enabled !== "on") return null;
  const identifier = String(
    properties.getProperty("CORE_LIBRARY_IDENTIFIER") || "SantriCore",
  ).trim();
  const library = globalThis[identifier];
  if (!library) {
    throw new Error(
      "Library inti belum terpasang. Matikan CORE_LIBRARY_ENABLED atau pasang library yang sesuai.",
    );
  }
  return library;
}

function isExternalActionAllowed_(action) {
  const allowed = [
    "login",
    "createAccount",
    "resumeSession",
    "logoutSession",
    "changeOwnPassword",
    "getDashboardSummary",
    "getStudents",
    "addStudent",
    "updateStudentProfile",
    "updateStudentNote",
    "getStudentDetailData",
    "getStudentAnalytics",
    "getStudentLinks",
    "getStudentReportData",
    "getStudentStatistics",
    "exportStudentsCsv",
    "issueStudentQr",
    "resolveStudentQr",
    "logMemorization",
    "updateMemorization",
    "deleteMemorization",
    "logIncident",
    "updateIncident",
    "deleteIncident",
    "logAttendance",
    "addHafalanLink",
    "updateHafalanLink",
    "deleteHafalanLink",
    "getSchedules",
    "getScheduleEditorData",
    "saveSchedule",
    "deleteSchedule",
    "validateSchedules",
    "bulkUpdateSchedules",
    "saveScheduleMaster",
    "deleteScheduleMaster",
    "importMasterScheduleForAttendance",
    "getAttendanceHome",
    "getAttendanceSession",
    "saveAttendanceSession",
    "getAttendanceRecap",
    "getGuardianAttendanceSummary",
    "auditAttendanceIntegrity",
    "repairAttendanceIntegrity",
    "updateStudentGenderBatch",
    "getUsers",
    "addUser",
    "updateUser",
    "deleteUser",
    "getAcademicSetup",
    "saveAcademicPeriod",
    "setAcademicPeriodStatus",
    "saveAcademicSubject",
    "saveAssessmentComponent",
    "getAcademicScoreMatrix",
    "saveAcademicScores",
    "importAcademicScoresFromStaging",
    "updateStudentAcademicProfile",
    "saveAcademicTeacherAssignment",
    "setAcademicTeacherAssignmentStatus",
    "syncAcademicTeacherAssignmentsFromSchedules",
    "getCurriculumExamSetup",
    "syncCurriculumExamItemsFromSchedules",
    "saveCurriculumExamItem",
    "getCurriculumScoreMatrix",
    "saveCurriculumExamScores",
    "getExamEligibility",
    "saveExamEligibilityOverride",
    "downloadStudentReportPdf",
    "generateStudentReportPdf",
    "getGuardianReportSharePreview",
    "getFullStudentReport",
    "getStudentFullReport",
    "sendReportToEmail",
    "getPesantrenInfo",
    "getPublicPesantrenInfo",
    "savePesantrenInfo",
    "setPesantrenInfoStatus",
    "deletePesantrenInfo",
    "getPulangBulananLogs",
    "getPulangBulananSummary",
    "savePulangBulanan",
    "updatePulangBulanan",
    "deletePulangBulanan",
    "runHealthCheck",
    "runCompleteSetup",
    "runParentContactConversion",
    "getAppEntitlements",
    "getProductReadiness",
    "createSetupImportTemplates",
    "seedSetupDummyData",
    "importSetupCsv",
    "previewSetupWizardImports",
    "applySetupWizardImports",
    "completeSetupWizard",
    "getInstallationManifest",
    "configureTenantInstallation",
    "getAppReleaseStatus",
    "saveSharedCoreSettings",
    "saveTenantProfile",
    "uploadTenantLogo",
    "saveProductSettings",
    "saveModuleLicenses",
    "saveSetupChecklistItem",
    "saveDemoAccount",
    "syncDemoAccountsToUsers",
    "createDemoPackage",
    "resetDemoPackage",
  ];
  return allowed.includes(String(action || ""));
}

function parseExternalRequest_(e) {
  const raw = (e && e.postData && e.postData.contents) || "";
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (error) {
      throw new Error("Request body harus JSON valid.");
    }
  }

  return {
    action: (e && e.parameter && e.parameter.action) || "",
    payload: undefined,
    args: [],
  };
}

function jsonResponse_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

// Function to run parent contact conversion from frontend
function runParentContactConversion(currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, {
      roles: ["Mudir", "Admin"],
    });

    return convertParentContactsToUsers_(sessionUser);
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

// Function to setup complete app from frontend
function runCompleteSetup(currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, {
      roles: ["Mudir", "Admin"],
    });

    return setupCompleteApp_(sessionUser);
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

function getFullStudentReport(studentId, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, { allowAnonymous: false });
    const students = getStudentsList_();
    const hafalan = getHafalanLogs_();
    const perilaku = getBehaviorLogs_();

    const student = students.find(
      (s) => String(s.StudentID) === String(studentId),
    );

    if (!student) {
      return {
        success: false,
        message: "Data santri tidak ditemukan",
      };
    }
    if (
      typeof REPORT_requireStudentAccess_ === "function"
    ) {
      REPORT_requireStudentAccess_(sessionUser, student, "");
    }

    // Filter hafalan dan perilaku berdasarkan studentId
    const studentHafalan = hafalan.filter(
      (h) => String(h.StudentID) === String(studentId),
    );
    const studentPerilaku = perilaku.filter(
      (p) => String(p.StudentID) === String(studentId),
    );

    return {
      success: true,
      data: {
        student: student,
        hafalan: studentHafalan,
        perilaku: studentPerilaku,
      },
    };
  } catch (e) {
    return {
      success: false,
      message: "Error: " + e.message,
    };
  }
}

// Helper functions untuk mengambil data dari spreadsheet
function getStudentsList_() {
  try {
    const ss = getSpreadsheet_();
    const sheet = getSheet_("Students");
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const studentsRaw = data.slice(1);

    const result = [];
    for (let i = 0; i < studentsRaw.length; i++) {
      const row = studentsRaw[i];
      const studentObj = serializeRow(row, headers);
      result.push(studentObj);
    }
    return result;
  } catch (e) {
    return [];
  }
}

function getHafalanLogs_() {
  try {
    const sheet = getSheet_("MemorizationLogs");
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];

    const headers = data[0];
    const logs = data.slice(1).map((row) => serializeRow(row, headers));
    return logs;
  } catch (e) {
    return [];
  }
}

function getBehaviorLogs_() {
  try {
    const sheet = getSheet_("Incidents");
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];

    const headers = data[0];
    const incidents = data.slice(1).map((row) => {
      const incident = serializeRow(row, headers);
      return { ...incident, Points: getIncidentPoints_(incident) };
    });
    return incidents;
  } catch (e) {
    return [];
  }
}

// Entry point & include
function include(filename) {
  const template = HtmlService.createTemplateFromFile(filename);
  return template.evaluate().getContent();
}

function getWebAppUrl_() {
  try {
    return ScriptApp.getService().getUrl() || "";
  } catch (e) {
    return "";
  }
}

function getAppEntryUrl_() {
  return getWebAppUrl_() || "?";
}

function getPublicPageUrl_() {
  const appUrl = getWebAppUrl_();
  return appUrl ? appUrl + "?page=public" : "?page=public";
}

// ============================================
// PULANG BULANAN MODULE
// ============================================

const SHEET_PULANG_BULANAN = "PulangBulanan";
const PULANG_BULANAN_HEADERS = [
  "PulangID",
  "StudentID",
  "StudentName",
  "Class",
  "Month",
  "Year",
  "PeriodLabel",
  "StatusPulang",
  "TanggalPulang",
  "JamPulang",
  "TanggalKembali",
  "JamKembali",
  "StatusKembali",
  "KeterlambatanMenit",
  "Penjemput",
  "HubunganPenjemput",
  "Phone",
  "Notes",
  "CreatedBy",
  "CreatedAt",
  "UpdatedAt",
];

// Helper functions untuk Pulang Bulanan
function PB_getSpreadsheet_() {
  return SpreadsheetApp.openById(getConfiguredSpreadsheetId_());
}

function PB_getOrCreateSheet_(sheetName, headers) {
  const ss = PB_getSpreadsheet_();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  const actualLastColumn = sheet.getLastColumn();
  const readColumns = Math.max(actualLastColumn, headers.length);
  const firstRow = sheet.getRange(1, 1, 1, readColumns).getValues()[0];
  const isEmpty = firstRow.every((v) => v === "" || v === null);
  if (isEmpty) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  } else {
    const existingHeaders = firstRow
      .slice(0, actualLastColumn)
      .map((header) => String(header || "").trim());
    const missingHeaders = headers.filter(
      (header) => !existingHeaders.includes(header),
    );
    if (missingHeaders.length > 0) {
      sheet
        .getRange(1, actualLastColumn + 1, 1, missingHeaders.length)
        .setValues([missingHeaders]);
    }
  }
  return sheet;
}

function PB_sheetToObjects_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return [];
  }
  const headers = values[0].map((h) => String(h).trim());
  return values
    .slice(1)
    .filter((row) => row.some((cell) => cell !== "" && cell !== null))
    .map((row, index) => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      obj._rowNumber = index + 2;
      return obj;
    });
}

function PB_objectToRow_(obj, headers) {
  return headers.map((header) =>
    obj[header] !== undefined ? obj[header] : "",
  );
}

function PB_generateId_(prefix) {
  return prefix + "-" + Utilities.getUuid().slice(0, 8).toUpperCase();
}

function PB_now_() {
  return new Date();
}

function PB_text_(value) {
  return String(value || "").trim();
}

function PB_num_(value) {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

function PB_success_(data, message) {
  return {
    ok: true,
    success: true,
    data,
    message: message || "",
  };
}

function PB_error_(message) {
  return {
    ok: false,
    success: false,
    message: message || "Terjadi kesalahan.",
  };
}

function PB_formatDate_(value) {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) return PB_text_(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function PB_getStudentClass_(student) {
  if (!student) return "";
  return (
    student["Class/Level"] ||
    student.Class ||
    student.Kelas ||
    student.ClassLevel ||
    ""
  );
}

// Setup Sheet Pulang Bulanan
function setupPulangBulanan() {
  PB_getOrCreateSheet_(SHEET_PULANG_BULANAN, PULANG_BULANAN_HEADERS);
  return PB_success_(null, "Sheet PulangBulanan berhasil disiapkan.");
}

// Helper validasi role
function PB_canManagePulang_(currentUser) {
  if (!currentUser) {
    return false;
  }
  return currentUser.Role === "Mudir" || currentUser.Role === "Ustadz";
}

function PB_canViewPulang_(currentUser) {
  if (!currentUser) {
    return false;
  }
  return ["Mudir", "Ustadz", "Wali"].includes(currentUser.Role);
}

// Helper ambil data santri
function PB_getStudentById_(studentId) {
  const sheet = getSheet_("Students");
  if (!sheet) return null;
  const students = normalizeSheetData(sheet.getDataRange().getValues());
  return (
    students.find((s) => String(s.StudentID) === String(studentId)) || null
  );
}

// Hitung keterlambatan kembali
function PB_calculateLateMinutes_(tanggalKembali, jamKembali, batasJamKembali) {
  if (!tanggalKembali || !jamKembali) {
    return 0;
  }
  const batas = batasJamKembali || "17:00";
  const kembaliDate = new Date(PB_formatDate_(tanggalKembali) + "T00:00:00");
  const kembaliParts = String(jamKembali).split(":");
  kembaliDate.setHours(Number(kembaliParts[0] || 0));
  kembaliDate.setMinutes(Number(kembaliParts[1] || 0));
  kembaliDate.setSeconds(0);
  const batasDate = new Date(PB_formatDate_(tanggalKembali) + "T00:00:00");
  const batasParts = String(batas).split(":");
  batasDate.setHours(Number(batasParts[0] || 17));
  batasDate.setMinutes(Number(batasParts[1] || 0));
  batasDate.setSeconds(0);
  const diffMs = kembaliDate.getTime() - batasDate.getTime();
  if (diffMs <= 0) {
    return 0;
  }
  return Math.ceil(diffMs / 60000);
}

function PB_getStatusKembali_(tanggalKembali, jamKembali, batasJamKembali) {
  if (!tanggalKembali || !jamKembali) {
    return "Belum Kembali";
  }
  const terlambat = PB_calculateLateMinutes_(
    tanggalKembali,
    jamKembali,
    batasJamKembali,
  );
  return terlambat > 0 ? "Terlambat" : "Tepat Waktu";
}

// Helper nama bulan
function PB_getMonthName_(month) {
  const names = {
    1: "Januari",
    2: "Februari",
    3: "Maret",
    4: "April",
    5: "Mei",
    6: "Juni",
    7: "Juli",
    8: "Agustus",
    9: "September",
    10: "Oktober",
    11: "November",
    12: "Desember",
  };
  return names[String(month)] || String(month || "");
}

// 1. Ambil data Pulang Bulanan
function getPulangBulananLogs(currentUser, filters) {
  try {
    if (!PB_canViewPulang_(currentUser)) {
      throw new Error("Akses ditolak.");
    }
    requireProductModuleEnabled_("pulang_bulanan", currentUser);
    const sheet = PB_getOrCreateSheet_(
      SHEET_PULANG_BULANAN,
      PULANG_BULANAN_HEADERS,
    );
    let logs = PB_sheetToObjects_(sheet);
    filters = filters || {};
    const month = filters.Month ? String(filters.Month) : "";
    const year = filters.Year ? String(filters.Year) : "";
    const studentId = filters.StudentID ? String(filters.StudentID) : "";
    const kelas = filters.Class ? String(filters.Class) : "";
    const statusKembali = filters.StatusKembali
      ? String(filters.StatusKembali)
      : "";
    if (month) {
      logs = logs.filter((l) => String(l.Month) === month);
    }
    if (year) {
      logs = logs.filter((l) => String(l.Year) === year);
    }
    if (studentId) {
      logs = logs.filter((l) => String(l.StudentID) === studentId);
    }
    if (kelas) {
      logs = logs.filter((l) => String(l.Class) === kelas);
    }
    if (statusKembali) {
      logs = logs.filter((l) => String(l.StatusKembali) === statusKembali);
    }

    if (String(currentUser.Role).trim().toLowerCase() === "wali") {
      const sessionPhone = normalizePhoneNumber(currentUser.Phone || "");
      const sessionUsername = normalizePhoneNumber(currentUser.Username || "");
      const sessionStudentId = String(currentUser.StudentID || "").trim();
      const studentsSheet = getSheet_("Students");
      const studentsData = normalizeSheetData(studentsSheet.getDataRange().getValues());
      const allowedIds = studentsData
        .filter((s) => {
          const wali = normalizePhoneNumber(s.WaliUsername || "");
          const pc = normalizePhoneNumber(s.ParentContact || "");
          let match = false;
          if (wali && (wali === sessionUsername || wali === sessionPhone)) match = true;
          if (pc && (pc === sessionUsername || pc === sessionPhone)) match = true;
          if (sessionStudentId && sessionStudentId === String(s.StudentID)) match = true;
          return match;
        })
        .map((s) => String(s.StudentID));
      logs = logs.filter((l) => allowedIds.includes(String(l.StudentID)));
    }
    if (currentUser.Role === "Ustadz" && currentUser.Class) {
      logs = logs.filter((l) => String(l.Class) === String(currentUser.Class));
    }
    logs = logs.map((l) => ({
      PulangID: l.PulangID || "",
      StudentID: l.StudentID || "",
      StudentName: l.StudentName || "",
      Class: l.Class || "",
      Month: l.Month || "",
      Year: l.Year || "",
      PeriodLabel: l.PeriodLabel || "",
      StatusPulang: l.StatusPulang || "",
      TanggalPulang: PB_formatDate_(l.TanggalPulang),
      JamPulang: l.JamPulang || "",
      TanggalKembali: PB_formatDate_(l.TanggalKembali),
      JamKembali: l.JamKembali || "",
      StatusKembali: l.StatusKembali || "",
      KeterlambatanMenit: l.KeterlambatanMenit || 0,
      Penjemput: l.Penjemput || "",
      HubunganPenjemput: l.HubunganPenjemput || "",
      Phone: l.Phone || "",
      Notes: l.Notes || "",
      CreatedBy: l.CreatedBy || "",
      CreatedAt: l.CreatedAt || "",
      UpdatedAt: l.UpdatedAt || "",
    }));
    logs.sort((a, b) => {
      const ay = Number(a.Year || 0);
      const by = Number(b.Year || 0);
      const am = Number(a.Month || 0);
      const bm = Number(b.Month || 0);
      if (by !== ay) return by - ay;
      return bm - am;
    });
    return PB_success_(logs, "Data pulang bulanan berhasil dimuat.");
  } catch (err) {
    return PB_error_(err.message);
  }
}

// 2. Simpan data Pulang Bulanan
function savePulangBulanan(payload, currentUser) {
  try {
    if (!PB_canManagePulang_(currentUser)) {
      throw new Error(
        "Akses ditolak. Hanya Mudir/Ustadz yang dapat mencatat pulang bulanan.",
      );
    }
    requireProductModuleEnabled_("pulang_bulanan", currentUser);
    payload = payload || {};
    if (!payload.StudentID) {
      throw new Error("Santri wajib dipilih.");
    }
    if (!payload.Month) {
      throw new Error("Bulan wajib dipilih.");
    }
    if (!payload.Year) {
      throw new Error("Tahun wajib diisi.");
    }
    if (!payload.StatusPulang) {
      throw new Error("Status pulang wajib dipilih.");
    }
    const student = PB_getStudentById_(payload.StudentID);
    const studentName = student
      ? student.Name || student.StudentName || student.Nama || ""
      : PB_text_(payload.StudentName);
    const studentClass = student
      ? PB_getStudentClass_(student)
      : PB_text_(payload.Class);
    const sheet = PB_getOrCreateSheet_(
      SHEET_PULANG_BULANAN,
      PULANG_BULANAN_HEADERS,
    );
    const logs = PB_sheetToObjects_(sheet);
    const month = PB_text_(payload.Month);
    const year = PB_text_(payload.Year);
    const duplicate = logs.find(
      (l) =>
        String(l.StudentID) === String(payload.StudentID) &&
        String(l.Month) === month &&
        String(l.Year) === year,
    );
    if (duplicate) {
      throw new Error(
        "Data pulang bulanan santri ini untuk bulan dan tahun tersebut sudah ada. Gunakan tombol edit.",
      );
    }
    const statusKembali = PB_getStatusKembali_(
      payload.TanggalKembali,
      payload.JamKembali,
      payload.BatasJamKembali || "17:00",
    );
    const lateMinutes = PB_calculateLateMinutes_(
      payload.TanggalKembali,
      payload.JamKembali,
      payload.BatasJamKembali || "17:00",
    );
    const periodLabel = PB_getMonthName_(month) + " " + year;
    const newLog = {
      PulangID: PB_generateId_("PLG"),
      StudentID: PB_text_(payload.StudentID),
      StudentName: studentName,
      Class: studentClass,
      Month: month,
      Year: year,
      PeriodLabel: periodLabel,
      StatusPulang: PB_text_(payload.StatusPulang),
      TanggalPulang: PB_formatDate_(payload.TanggalPulang),
      JamPulang: PB_text_(payload.JamPulang),
      TanggalKembali: PB_formatDate_(payload.TanggalKembali),
      JamKembali: PB_text_(payload.JamKembali),
      StatusKembali: statusKembali,
      KeterlambatanMenit: lateMinutes,
      Penjemput: PB_text_(payload.Penjemput),
      HubunganPenjemput: PB_text_(payload.HubunganPenjemput),
      Phone: PB_text_(payload.Phone),
      Notes: PB_text_(payload.Notes),
      CreatedBy: currentUser.Name || currentUser.Username || "",
      CreatedAt: PB_now_(),
      UpdatedAt: PB_now_(),
    };
    sheet.appendRow(PB_objectToRow_(newLog, PULANG_BULANAN_HEADERS));
    return PB_success_(newLog, "Data pulang bulanan berhasil disimpan.");
  } catch (err) {
    return PB_error_(err.message);
  }
}

// 3. Update data Pulang Bulanan
function updatePulangBulanan(pulangId, payload, currentUser) {
  try {
    if (!PB_canManagePulang_(currentUser)) {
      throw new Error(
        "Akses ditolak. Hanya Mudir/Ustadz yang dapat mengubah data.",
      );
    }
    requireProductModuleEnabled_("pulang_bulanan", currentUser);
    payload = payload || {};
    const sheet = PB_getOrCreateSheet_(
      SHEET_PULANG_BULANAN,
      PULANG_BULANAN_HEADERS,
    );
    const logs = PB_sheetToObjects_(sheet);
    const target = logs.find((l) => String(l.PulangID) === String(pulangId));
    if (!target) {
      throw new Error("Data pulang bulanan tidak ditemukan.");
    }
    const student = PB_getStudentById_(payload.StudentID || target.StudentID);
    const studentName = student
      ? student.Name || student.StudentName || student.Nama || ""
      : PB_text_(payload.StudentName || target.StudentName);
    const studentClass = student
      ? PB_getStudentClass_(student)
      : PB_text_(payload.Class || target.Class);
    const month = PB_text_(payload.Month || target.Month);
    const year = PB_text_(payload.Year || target.Year);
    const duplicate = logs.find(
      (l) =>
        String(l.PulangID) !== String(pulangId) &&
        String(l.StudentID) === String(payload.StudentID || target.StudentID) &&
        String(l.Month) === month &&
        String(l.Year) === year,
    );
    if (duplicate) {
      throw new Error(
        "Data santri ini pada bulan dan tahun tersebut sudah ada.",
      );
    }
    const statusKembali = PB_getStatusKembali_(
      payload.TanggalKembali,
      payload.JamKembali,
      payload.BatasJamKembali || "17:00",
    );
    const lateMinutes = PB_calculateLateMinutes_(
      payload.TanggalKembali,
      payload.JamKembali,
      payload.BatasJamKembali || "17:00",
    );
    target.StudentID = PB_text_(payload.StudentID || target.StudentID);
    target.StudentName = studentName;
    target.Class = studentClass;
    target.Month = month;
    target.Year = year;
    target.PeriodLabel = PB_getMonthName_(month) + " " + year;
    target.StatusPulang = PB_text_(payload.StatusPulang || target.StatusPulang);
    target.TanggalPulang = PB_formatDate_(payload.TanggalPulang);
    target.JamPulang = PB_text_(payload.JamPulang);
    target.TanggalKembali = PB_formatDate_(payload.TanggalKembali);
    target.JamKembali = PB_text_(payload.JamKembali);
    target.StatusKembali = statusKembali;
    target.KeterlambatanMenit = lateMinutes;
    target.Penjemput = PB_text_(payload.Penjemput);
    target.HubunganPenjemput = PB_text_(payload.HubunganPenjemput);
    target.Phone = PB_text_(payload.Phone);
    target.Notes = PB_text_(payload.Notes);
    target.UpdatedAt = PB_now_();
    sheet
      .getRange(target._rowNumber, 1, 1, PULANG_BULANAN_HEADERS.length)
      .setValues([PB_objectToRow_(target, PULANG_BULANAN_HEADERS)]);
    return PB_success_(target, "Data pulang bulanan berhasil diperbarui.");
  } catch (err) {
    return PB_error_(err.message);
  }
}

// 4. Hapus data Pulang Bulanan
function deletePulangBulanan(pulangId, currentUser) {
  try {
    if (!PB_canManagePulang_(currentUser)) {
      throw new Error(
        "Akses ditolak. Hanya Mudir/Ustadz yang dapat menghapus data.",
      );
    }
    requireProductModuleEnabled_("pulang_bulanan", currentUser);
    const sheet = PB_getOrCreateSheet_(
      SHEET_PULANG_BULANAN,
      PULANG_BULANAN_HEADERS,
    );
    const logs = PB_sheetToObjects_(sheet);
    const target = logs.find((l) => String(l.PulangID) === String(pulangId));
    if (!target) {
      throw new Error("Data pulang bulanan tidak ditemukan.");
    }
    sheet.deleteRow(target._rowNumber);
    return PB_success_(null, "Data pulang bulanan berhasil dihapus.");
  } catch (err) {
    return PB_error_(err.message);
  }
}

// 5. Summary Pulang Bulanan
function getPulangBulananSummary(currentUser, filters) {
  try {
    const res = getPulangBulananLogs(currentUser, filters);
    if (!res.success) {
      return res;
    }
    const logs = res.data || [];
    const total = logs.length;
    const pulang = logs.filter((l) => l.StatusPulang === "Pulang").length;
    const tidakPulang = logs.filter(
      (l) => l.StatusPulang === "Tidak Pulang",
    ).length;
    const izin = logs.filter((l) => l.StatusPulang === "Izin").length;
    const tepatWaktu = logs.filter(
      (l) => l.StatusKembali === "Tepat Waktu",
    ).length;
    const terlambat = logs.filter(
      (l) => l.StatusKembali === "Terlambat",
    ).length;
    const belumKembali = logs.filter(
      (l) => l.StatusKembali === "Belum Kembali",
    ).length;
    return PB_success_(
      {
        total,
        pulang,
        tidakPulang,
        izin,
        tepatWaktu,
        terlambat,
        belumKembali,
      },
      "Ringkasan pulang bulanan berhasil dimuat.",
    );
  } catch (err) {
    return PB_error_(err.message);
  }
}
