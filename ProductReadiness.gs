const SHEET_TENANT_PROFILE = "TenantProfile";
const SHEET_APP_SETTINGS = "AppSettings";
const SHEET_MODULE_LICENSES = "ModuleLicenses";
const SHEET_SETUP_CHECKLIST = "SetupChecklist";
const SHEET_DEMO_ACCOUNTS = "DemoAccounts";
const SHEET_SETUP_IMPORT_STUDENTS = "SetupImportStudents";
const SHEET_SETUP_IMPORT_USERS = "SetupImportUsers";
const SHEET_SETUP_IMPORT_SCHEDULES = "SetupImportSchedules";

const PRODUCT_MODULES = [
  { ModuleCode: "students", ModuleName: "Data Santri", DefaultActive: true },
  { ModuleCode: "attendance", ModuleName: "Absensi", DefaultActive: true },
  { ModuleCode: "memorization", ModuleName: "Hafalan", DefaultActive: true },
  { ModuleCode: "behavior", ModuleName: "Catatan Perilaku", DefaultActive: true },
  { ModuleCode: "academic", ModuleName: "Akademik dan Raport", DefaultActive: true },
  { ModuleCode: "pesantren_info", ModuleName: "Sistem Informasi", DefaultActive: true },
  { ModuleCode: "pulang_bulanan", ModuleName: "Pulang Bulanan", DefaultActive: true },
  { ModuleCode: "demo", ModuleName: "Akun Demo", DefaultActive: false },
];

const PRODUCT_NAV_MODULES = {
  santri: "students",
  absensi: "attendance",
  hafalan: "memorization",
  link_live: "memorization",
  pelanggaran: "behavior",
  list_perilaku: "behavior",
  akademik: "academic",
  informasi_pesantren: "pesantren_info",
  pulang_bulanan: "pulang_bulanan",
};

const PRODUCT_ACTION_MODULES = {
  getStudents: "students",
  addStudent: "students",
  updateStudentNote: "students",
  getStudentDetailData: "students",
  getStudentAnalytics: "students",
  getStudentLinks: "students",
  getStudentStatistics: "students",
  exportStudentsCsv: "students",
  issueStudentQr: "students",
  resolveStudentQr: "students",
  logMemorization: "memorization",
  updateMemorization: "memorization",
  deleteMemorization: "memorization",
  addHafalanLink: "memorization",
  updateHafalanLink: "memorization",
  deleteHafalanLink: "memorization",
  logIncident: "behavior",
  updateIncident: "behavior",
  deleteIncident: "behavior",
  logAttendance: "attendance",
  getAttendanceHome: "attendance",
  getAttendanceSession: "attendance",
  saveAttendanceSession: "attendance",
  getAttendanceRecap: "attendance",
  getGuardianAttendanceSummary: "attendance",
  getAcademicSetup: "academic",
  saveAcademicPeriod: "academic",
  setAcademicPeriodStatus: "academic",
  saveAcademicSubject: "academic",
  saveAssessmentComponent: "academic",
  getAcademicScoreMatrix: "academic",
  saveAcademicScores: "academic",
  importAcademicScoresFromStaging: "academic",
  updateStudentAcademicProfile: "academic",
  saveAcademicTeacherAssignment: "academic",
  setAcademicTeacherAssignmentStatus: "academic",
  syncAcademicTeacherAssignmentsFromSchedules: "academic",
  getCurriculumExamSetup: "academic",
  syncCurriculumExamItemsFromSchedules: "academic",
  saveCurriculumExamItem: "academic",
  getCurriculumScoreMatrix: "academic",
  saveCurriculumExamScores: "academic",
  getExamEligibility: "academic",
  saveExamEligibilityOverride: "academic",
  getStudentReportData: "academic",
  downloadStudentReportPdf: "academic",
  generateStudentReportPdf: "academic",
  getFullStudentReport: "academic",
  getStudentFullReport: "academic",
  sendReportToEmail: "academic",
  getPesantrenInfo: "pesantren_info",
  getPublicPesantrenInfo: "pesantren_info",
  savePesantrenInfo: "pesantren_info",
  setPesantrenInfoStatus: "pesantren_info",
  deletePesantrenInfo: "pesantren_info",
  getPulangBulananLogs: "pulang_bulanan",
  getPulangBulananSummary: "pulang_bulanan",
  savePulangBulanan: "pulang_bulanan",
  updatePulangBulanan: "pulang_bulanan",
  deletePulangBulanan: "pulang_bulanan",
};

function getProductReadinessSchemas_() {
  return {
    [SHEET_TENANT_PROFILE]: [
      "ProfileKey",
      "ProfileValue",
      "UpdatedAt",
      "UpdatedBy",
    ],
    [SHEET_APP_SETTINGS]: [
      "SettingKey",
      "SettingValue",
      "Description",
      "UpdatedAt",
      "UpdatedBy",
    ],
    [SHEET_MODULE_LICENSES]: [
      "ModuleCode",
      "ModuleName",
      "PackageName",
      "IsActive",
      "MaxStudents",
      "StartDate",
      "EndDate",
      "Notes",
      "UpdatedAt",
      "UpdatedBy",
    ],
    [SHEET_SETUP_CHECKLIST]: [
      "ChecklistID",
      "Category",
      "TaskName",
      "Status",
      "Notes",
      "UpdatedAt",
      "UpdatedBy",
    ],
    [SHEET_DEMO_ACCOUNTS]: [
      "DemoID",
      "Role",
      "Username",
      "PasswordHint",
      "StudentID",
      "IsActive",
      "IsReadOnly",
      "Notes",
      "UpdatedAt",
      "UpdatedBy",
    ],
    [SHEET_SETUP_IMPORT_STUDENTS]: [
      "Name",
      "NIS",
      "ClassLevel",
      "Level",
      "Gender",
      "ParentContact",
      "WaliUsername",
      "BirthPlace",
      "BirthDate",
      "SchoolUnit",
      "CohortYear",
      "ResidencyStatus",
      "Room",
    ],
    [SHEET_SETUP_IMPORT_USERS]: [
      "UserID",
      "Name",
      "Username",
      "Password",
      "Salt",
      "PasswordHash",
      "Role",
      "Email",
      "Phone",
      "StudentID",
      "Class",
      "TeacherSourceID",
      "Status",
      "CreatedAt",
      "UpdatedAt",
      "LastLogin",
    ],
    [SHEET_SETUP_IMPORT_SCHEDULES]: [
      "Type",
      "TeacherID",
      "TeacherSourceID",
      "SubjectOrActivityName",
      "ClassOrGroupName",
      "DayOfWeek",
      "StartTime",
      "EndTime",
      "IsActive",
    ],
  };
}

function setupProductReadinessSheets() {
  const schemas = getProductReadinessSchemas_();
  const results = Object.keys(schemas).map((sheetName) => ({
    sheet: sheetName,
    result: setupSheetWithHeaders_(sheetName, schemas[sheetName]),
  }));
  PRODUCT_hideTechnicalImportColumns_();
  seedProductReadinessDefaults_("system");
  return {
    ok: true,
    data: { results },
    message: "Pondasi produk siap.",
  };
}

/**
 * Kolom keamanan tetap dipertahankan untuk kompatibilitas export/import lama,
 * tetapi disembunyikan dari admin pondok. Admin cukup mengisi Password biasa;
 * addUser() yang membuat Salt dan PasswordHash.
 */
function PRODUCT_hideTechnicalImportColumns_() {
  const sheet = getSheet_(SHEET_SETUP_IMPORT_USERS);
  if (!sheet) return;
  const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0]
    .map((header) => String(header || "").trim());
  ["Salt", "PasswordHash", "CreatedAt", "UpdatedAt", "LastLogin"].forEach((header) => {
    const index = headers.indexOf(header);
    if (index >= 0) sheet.hideColumns(index + 1);
  });
}

function seedProductReadinessDefaults_(updatedBy) {
  PRODUCT_seedSettings_(updatedBy);
  PRODUCT_seedTenantProfile_(updatedBy);
  PRODUCT_seedModules_(updatedBy);
  PRODUCT_seedChecklist_(updatedBy);
}

function PRODUCT_seedSettings_(updatedBy) {
  const defaults = [
    {
      SettingKey: "PRODUCT_MODULE_GATING",
      SettingValue: "off",
      Description: "off/canary/on. Off berarti semua modul lama tetap aktif.",
    },
    {
      SettingKey: "PRODUCT_PACKAGE_NAME",
      SettingValue: "Internal",
      Description: "Nama paket aktif untuk pondok ini.",
    },
    {
      SettingKey: "PRODUCT_MAX_STUDENTS",
      SettingValue: "",
      Description: "Batas jumlah santri bila paket memakai batas.",
    },
    {
      SettingKey: "DEMO_MODE",
      SettingValue: "off",
      Description: "off/on. Demo harus memakai data contoh, bukan data produksi.",
    },
  ];
  PRODUCT_upsertRows_(SHEET_APP_SETTINGS, "SettingKey", defaults, updatedBy);
}

function PRODUCT_seedTenantProfile_(updatedBy) {
  const defaults = [
    { ProfileKey: "PondokName", ProfileValue: "Raudhatul Ulum" },
    { ProfileKey: "ShortName", ProfileValue: "Monitor Santri" },
    { ProfileKey: "LogoUrl", ProfileValue: "" },
    { ProfileKey: "Address", ProfileValue: "" },
    { ProfileKey: "ContactPhone", ProfileValue: "" },
    { ProfileKey: "ContactEmail", ProfileValue: "" },
    { ProfileKey: "AcademicYear", ProfileValue: "" },
    { ProfileKey: "Semester", ProfileValue: "" },
  ];
  PRODUCT_upsertRows_(SHEET_TENANT_PROFILE, "ProfileKey", defaults, updatedBy);
}

function PRODUCT_seedModules_(updatedBy) {
  const defaults = PRODUCT_MODULES.map((module) => ({
    ModuleCode: module.ModuleCode,
    ModuleName: module.ModuleName,
    PackageName: "Internal",
    IsActive: module.DefaultActive,
    MaxStudents: "",
    StartDate: "",
    EndDate: "",
    Notes: "",
  }));
  PRODUCT_upsertRows_(SHEET_MODULE_LICENSES, "ModuleCode", defaults, updatedBy);
}

function PRODUCT_seedChecklist_(updatedBy) {
  const defaults = [
    ["CHK-PROFILE", "Identitas", "Isi profil pondok dan logo"],
    ["CHK-STUDENTS", "Data", "Import data santri"],
    ["CHK-USERS", "Data", "Buat akun guru, admin, dan wali"],
    ["CHK-SCHEDULES", "Operasional", "Siapkan jadwal KBM, pondok, dan kegiatan"],
    ["CHK-PERIOD", "Raport", "Buat periode akademik"],
    ["CHK-CURRICULUM", "Raport", "Siapkan item ujian dari jadwal"],
    ["CHK-DEMO", "Demo", "Siapkan akun dan data demo"],
    ["CHK-SMOKE", "Uji", "Uji login, absensi, nilai, raport, dan PDF"],
  ].map((row) => ({
    ChecklistID: row[0],
    Category: row[1],
    TaskName: row[2],
    Status: "Belum",
    Notes: "",
  }));
  PRODUCT_upsertRows_(SHEET_SETUP_CHECKLIST, "ChecklistID", defaults, updatedBy);
}

function PRODUCT_upsertRows_(sheetName, keyHeader, rows, updatedBy) {
  const sheet = getSheet_(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0].map((header) => String(header || "").trim());
  const keyIndex = headers.indexOf(keyHeader);
  const now = new Date().toISOString();
  const existing = {};
  data.slice(1).forEach((row, index) => {
    const key = String(row[keyIndex] || "").trim();
    if (key) existing[key] = index + 2;
  });

  rows.forEach((row) => {
    const key = String(row[keyHeader] || "").trim();
    if (!key || existing[key]) return;
    const output = headers.map((header) => {
      if (header === "UpdatedAt") return now;
      if (header === "UpdatedBy") return updatedBy || "system";
      return row[header] === undefined ? "" : row[header];
    });
    sheet.appendRow(output);
  });
}

function getAppEntitlements(currentUser) {
  requireSessionUser_(currentUser, { allowAnonymous: false });
  if (!PRODUCT_hasReadinessSheets_()) {
    return {
      ok: true,
      data: PRODUCT_defaultEntitlements_(),
    };
  }
  const settings = PRODUCT_readSettings_();
  const modules = PRODUCT_readModules_();
  const gatingMode = PRODUCT_normalizeMode_(settings.PRODUCT_MODULE_GATING);
  const activeModules = {};
  PRODUCT_MODULES.forEach((module) => {
    const row = modules.find((item) => item.ModuleCode === module.ModuleCode);
    activeModules[module.ModuleCode] =
      gatingMode === "off" ? true : PRODUCT_toBool_(row ? row.IsActive : module.DefaultActive);
  });
  return {
    ok: true,
    data: {
      gatingMode,
      packageName: settings.PRODUCT_PACKAGE_NAME || "Internal",
      maxStudents: settings.PRODUCT_MAX_STUDENTS || "",
      demoMode: settings.DEMO_MODE || "off",
      modules: activeModules,
      navModules: PRODUCT_NAV_MODULES,
    },
  };
}

function getProductReadiness(currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupProductReadinessSheets();
  const profile = PRODUCT_readKeyValueSheet_(SHEET_TENANT_PROFILE, "ProfileKey", "ProfileValue");
  const settings = PRODUCT_readSettings_();
  const modules = PRODUCT_readModules_();
  const checklist = PRODUCT_readRows_(SHEET_SETUP_CHECKLIST);
  const demoAccounts = PRODUCT_readRows_(SHEET_DEMO_ACCOUNTS);
  const checklistDone = checklist.filter((item) => item.Status === "Selesai").length;
  const requiredModules = modules.filter((item) => PRODUCT_toBool_(item.IsActive));
  const wizardStatus = PRODUCT_buildWizardStatus_();

  return {
    ok: true,
    data: {
      profile,
      settings,
      modules,
      checklist,
      demoAccounts,
      installation: PRODUCT_readInstallationManifest_(),
      release: PRODUCT_readReleaseStatus_(),
      summary: {
        checklistTotal: checklist.length,
        checklistDone,
        activeModules: requiredModules.length,
        ready: wizardStatus.ready,
      },
      wizardStatus,
      user: {
        Username: sessionUser.Username,
        Role: sessionUser.Role,
      },
    },
  };
}

function saveTenantProfile(profile, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupProductReadinessSheets();
  const rows = Object.keys(profile || {}).map((key) => ({
    ProfileKey: key,
    ProfileValue: profile[key],
  }));
  PRODUCT_upsertKeyValueRows_(SHEET_TENANT_PROFILE, "ProfileKey", "ProfileValue", rows, sessionUser.Username);
  AUTH_appendAuditLog_("UPDATE", "TenantProfile", "current", sessionUser, {
    keys: rows.map((row) => row.ProfileKey),
  });
  return { ok: true, message: "Profil pondok tersimpan." };
}

function saveProductSettings(settings, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupProductReadinessSheets();
  const allowed = [
    "PRODUCT_MODULE_GATING",
    "PRODUCT_PACKAGE_NAME",
    "PRODUCT_MAX_STUDENTS",
    "DEMO_MODE",
  ];
  const rows = allowed
    .filter((key) => Object.prototype.hasOwnProperty.call(settings || {}, key))
    .map((key) => ({
      SettingKey: key,
      SettingValue: settings[key],
    }));
  PRODUCT_upsertKeyValueRows_(SHEET_APP_SETTINGS, "SettingKey", "SettingValue", rows, sessionUser.Username);
  AUTH_appendAuditLog_("UPDATE", "AppSettings", "product", sessionUser, {
    keys: rows.map((row) => row.SettingKey),
  });
  return { ok: true, message: "Pengaturan produk tersimpan." };
}

function saveModuleLicenses(modules, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupProductReadinessSheets();
  const allowedCodes = PRODUCT_MODULES.map((module) => module.ModuleCode);
  const rows = (modules || [])
    .filter((module) => allowedCodes.includes(String(module.ModuleCode || "")))
    .map((module) => ({
      ModuleCode: module.ModuleCode,
      ModuleName:
        module.ModuleName ||
        (PRODUCT_MODULES.find((item) => item.ModuleCode === module.ModuleCode) || {}).ModuleName ||
        module.ModuleCode,
      PackageName: module.PackageName || "",
      IsActive: PRODUCT_toBool_(module.IsActive),
      MaxStudents: module.MaxStudents || "",
      StartDate: module.StartDate || "",
      EndDate: module.EndDate || "",
      Notes: module.Notes || "",
    }));
  PRODUCT_upsertRowsAndUpdate_(SHEET_MODULE_LICENSES, "ModuleCode", rows, sessionUser.Username);
  AUTH_appendAuditLog_("UPDATE", "ModuleLicenses", "current", sessionUser, {
    modules: rows.map((row) => row.ModuleCode),
  });
  return { ok: true, message: "Paket dan modul tersimpan." };
}

function saveSetupChecklistItem(item, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupProductReadinessSheets();
  const row = {
    ChecklistID: item.ChecklistID || "CHK-" + Utilities.getUuid().slice(0, 8).toUpperCase(),
    Category: item.Category || "Setup",
    TaskName: item.TaskName || "",
    Status: item.Status || "Belum",
    Notes: item.Notes || "",
  };
  if (!row.TaskName) return { ok: false, message: "Nama tugas wajib diisi." };
  PRODUCT_upsertRowsAndUpdate_(SHEET_SETUP_CHECKLIST, "ChecklistID", [row], sessionUser.Username);
  AUTH_appendAuditLog_("UPDATE", "SetupChecklist", row.ChecklistID, sessionUser, row);
  return { ok: true, message: "Checklist tersimpan." };
}

function saveDemoAccount(account, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupProductReadinessSheets();
  const row = {
    DemoID: account.DemoID || "DEMO-" + Utilities.getUuid().slice(0, 8).toUpperCase(),
    Role: account.Role || "Wali",
    Username: account.Username || "",
    PasswordHint: account.PasswordHint || "",
    StudentID: account.StudentID || "",
    IsActive: PRODUCT_toBool_(account.IsActive),
    IsReadOnly: PRODUCT_toBool_(account.IsReadOnly),
    Notes: account.Notes || "",
  };
  if (!row.Username) return { ok: false, message: "Username demo wajib diisi." };
  PRODUCT_upsertRowsAndUpdate_(SHEET_DEMO_ACCOUNTS, "DemoID", [row], sessionUser.Username);
  AUTH_appendAuditLog_("UPSERT", "DemoAccount", row.DemoID, sessionUser, {
    role: row.Role,
    username: row.Username,
  });
  return { ok: true, message: "Akun demo tersimpan." };
}

function syncDemoAccountsToUsers(currentUser) {
  const sessionUser = requireSessionUser_(currentUser, { roles: ["Mudir", "Admin"] });
  setupProductReadinessSheets();
  setupSheetWithHeaders_(SHEET_USERS, USER_HEADERS);
  const demoAccounts = PRODUCT_readRows_(SHEET_DEMO_ACCOUNTS).filter((row) => PRODUCT_toBool_(row.IsActive));
  if (!demoAccounts.length) return { ok: false, message: "Belum ada akun demo aktif." };
  const usersSheet = getSheet_(SHEET_USERS);
  const userValues = usersSheet.getDataRange().getValues();
  const headers = userValues[0].map((header) => String(header || "").trim());
  const usernameIndex = headers.indexOf("Username");
  const results = [];
  const errors = [];
  demoAccounts.forEach((account) => {
    const username = String(account.Username || "").trim();
    const password = String(account.PasswordHint || "").trim();
    if (!username || password.length < 6) {
      errors.push((username || "(tanpa username)") + ": petunjuk password minimal 6 karakter");
      return;
    }
    const normalized = normalizeUsername_(username);
    const rowIndex = userValues.slice(1).findIndex((row) => normalizeUsername_(row[usernameIndex]) === normalized);
    const salt = Utilities.getUuid().substring(0, 8);
    const passwordHash = hashPasswordWithSalt(password, salt);
    if (rowIndex === -1) {
      const created = addUser({
        Name: "Demo " + String(account.Role || "User"), Username: username, Password: password,
        Role: account.Role || "Wali", StudentID: account.StudentID || "", Status: "Active",
      }, currentUser);
      if (!created || !created.ok) errors.push(username + ": " + (created && created.message ? created.message : "gagal dibuat"));
      else { AUTH_clearLoginThrottle_(username); results.push({ username, action: "created" }); }
      return;
    }
    const targetRow = rowIndex + 2;
    const row = userValues[rowIndex + 1].slice(0, headers.length);
    const set = (header, value) => { const index = headers.indexOf(header); if (index !== -1) row[index] = value; };
    set("Salt", salt); set("PasswordHash", passwordHash); set("Role", account.Role || "Wali"); set("Status", "Active"); set("UpdatedAt", new Date().toISOString());
    if (account.StudentID) set("StudentID", account.StudentID);
    usersSheet.getRange(targetRow, 1, 1, headers.length).setValues([row]);
    AUTH_clearLoginThrottle_(username);
    results.push({ username, action: "updated" });
  });
  AUTH_appendAuditLog_("SYNC", "DemoAccounts", "Users", sessionUser, { count: results.length, errors: errors.length });
  return {
    ok: errors.length === 0,
    message: errors.length ? "Sebagian akun demo gagal disinkronkan." : "Akun demo sekarang sudah bisa digunakan untuk login.",
    data: { results, errors },
  };
}

/**
 * Membuat satu paket demo yang benar-benar dapat dipakai login.
 * Password hanya dipakai untuk membuat hash dan tidak pernah disimpan.
 */
function createDemoPackage(payload, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupCoreSheets();
  setupAcademicSheets();
  setupProductReadinessSheets();

  const password = String((payload && payload.Password) || "").trim();
  if (password.length < 6) {
    return { ok: false, message: "Password demo minimal 6 karakter." };
  }

  const demoStudentId = "DEMO-STU-001";
  const demoClass = "KELAS DEMO";
  const accounts = [
    { Role: "Mudir", Username: "demo_mudir", Name: "Mudir Demo" },
    { Role: "Admin", Username: "demo_admin", Name: "Admin Demo" },
    { Role: "Ustadz", Username: "demo_ustadz", Name: "Ustadz Demo", TeacherSourceID: "DEMO-TEACHER-001" },
    { Role: "Wali", Username: "demo_wali", Name: "Wali Demo", StudentID: demoStudentId, Phone: "demo_wali" },
  ];

  const createdAccounts = [];
  accounts.forEach((account) => {
    const existing = AUTH_findUserRecord_(account.Username);
    if (existing) {
      if (!String(existing.Username || "").toLowerCase().startsWith("demo_")) {
        throw new Error("Username demo bertabrakan dengan akun biasa: " + account.Username);
      }
      createdAccounts.push({ Username: account.Username, Role: account.Role, existing: true });
      return;
    }
    const result = addUser(
      {
        Name: account.Name,
        Username: account.Username,
        Password: password,
        Role: account.Role,
        StudentID: account.StudentID || "",
        Phone: account.Phone || "",
        TeacherSourceID: account.TeacherSourceID || "",
        Class: account.Role === "Ustadz" ? demoClass : "",
        Status: "Active",
      },
      currentUser,
    );
    if (!result || !result.ok) throw new Error(result && result.message ? result.message : "Gagal membuat akun demo.");
    createdAccounts.push({ Username: account.Username, Role: account.Role, existing: false });
  });

  DEMO_seedData_(demoStudentId, demoClass, sessionUser.Username);
  const accountRows = accounts.map((account) => ({
    DemoID: "DEMO-ACCOUNT-" + account.Role.toUpperCase(),
    Role: account.Role,
    Username: account.Username,
    PasswordHint: "Password ditentukan admin saat membuat demo",
    StudentID: account.StudentID || "",
    IsActive: true,
    IsReadOnly: true,
    Notes: "Akun demo otomatis. Data hanya untuk presentasi.",
  }));
  PRODUCT_upsertRowsAndUpdate_(SHEET_DEMO_ACCOUNTS, "DemoID", accountRows, sessionUser.Username);
  PRODUCT_upsertKeyValueRows_(SHEET_APP_SETTINGS, "SettingKey", "SettingValue", [
    { SettingKey: "DEMO_MODE", SettingValue: "on" },
  ], sessionUser.Username);
  AUTH_appendAuditLog_("CREATE", "DemoPackage", "DEMO-PACKAGE", sessionUser, {
    accounts: accounts.map((item) => item.Username),
    studentId: demoStudentId,
  });
  return {
    ok: true,
    message: "Paket demo berhasil dibuat. Gunakan akun demo untuk presentasi.",
    data: { accounts: createdAccounts, studentId: demoStudentId },
  };
}

function resetDemoPackage(currentUser) {
  const sessionUser = requireSessionUser_(currentUser, { roles: ["Mudir", "Admin"] });
  setupCoreSheets();
  setupAcademicSheets();
  setupProductReadinessSheets();
  const usernames = PRODUCT_readRows_(SHEET_DEMO_ACCOUNTS)
    .map((row) => String(row.Username || "").trim().toLowerCase())
    .filter(Boolean);
  DEMO_deleteRows_(SHEET_USERS, (row) => usernames.includes(String(row.Username || "").trim().toLowerCase()));
  [
    "Students", "Schedules", "AttendanceSessions", "Attendance", "MemorizationLogs", "Incidents",
    SHEET_ACADEMIC_PERIODS, SHEET_ACADEMIC_SUBJECTS, "AssessmentComponents", SHEET_ACADEMIC_SCORES,
    "AcademicTeacherAssignments", "CurriculumExamItems", "CurriculumExamScores",
  ].forEach((sheetName) => DEMO_deleteRows_(sheetName, (row) =>
    Object.keys(row).some((key) => String(row[key] || "").startsWith("DEMO-")),
  ));
  const demoSheet = getSheet_(SHEET_DEMO_ACCOUNTS);
  if (demoSheet && demoSheet.getLastRow() > 1) demoSheet.deleteRows(2, demoSheet.getLastRow() - 1);
  PRODUCT_upsertKeyValueRows_(SHEET_APP_SETTINGS, "SettingKey", "SettingValue", [
    { SettingKey: "DEMO_MODE", SettingValue: "off" },
  ], sessionUser.Username);
  AUTH_appendAuditLog_("DELETE", "DemoPackage", "DEMO-PACKAGE", sessionUser, {});
  return { ok: true, message: "Data demo berhasil direset. Data pondok asli tetap aman." };
}

function DEMO_seedData_(studentId, className, updatedBy) {
  const now = new Date().toISOString();
  DEMO_upsert_("Students", "StudentID", {
    StudentID: studentId, NIS: "DEMO001", Name: "Ahmad Mujahid Demo", "Class/Level": className,
    Level: "Menengah", Gender: "L", ParentContact: "demo_wali", WaliUsername: "demo_wali",
    SchoolUnit: "Pondok Demo", CohortYear: "2026", ResidencyStatus: "Mukim", Room: "Demo-01",
    Status: "Active", CreatedAt: now, UpdatedAt: now,
  });
  DEMO_upsert_("Schedules", "ScheduleID", {
    ScheduleID: "DEMO-SCH-KBM", Type: "KBM", TeacherID: "demo_ustadz", TeacherSourceID: "DEMO-TEACHER-001",
    SubjectOrActivityName: "Aqidah Akhlak", ClassOrGroupName: className, DayOfWeek: "Senin",
    StartTime: "08:00", EndTime: "09:00", IsActive: true,
  });
  DEMO_upsert_("AttendanceSessions", "SessionID", {
    SessionID: "DEMO-SES-KBM", ScheduleID: "DEMO-SCH-KBM", AttendanceDate: now.slice(0, 10),
    AttendanceType: "KBM", DayOfWeek: "Senin", ClassOrGroupName: className, ActivityName: "Aqidah Akhlak",
    TeacherID: "demo_ustadz", TeacherSourceID: "DEMO-TEACHER-001", StartTime: "08:00", EndTime: "09:00",
    SubmittedBy: "demo_ustadz", SubmittedAt: now, UpdatedAt: now, TotalStudents: 1, HadirCount: 1, Status: "Submitted",
  });
  DEMO_upsert_("Attendance", "AttendanceID", {
    AttendanceID: "DEMO-ATT-001", SessionID: "DEMO-SES-KBM", ScheduleID: "DEMO-SCH-KBM", StudentID: studentId,
    AttendanceDate: now.slice(0, 10), DateLogged: now, ClassOrGroupName: className, Category: "KBM",
    ActivityName: "Aqidah Akhlak", Status: "Hadir", TeacherID: "demo_ustadz", TeacherSourceID: "DEMO-TEACHER-001",
    CreatedAt: now, UpdatedAt: now,
  });
  DEMO_upsert_("MemorizationLogs", "LogID", {
    LogID: "DEMO-HAF-001", StudentID: studentId, DateLogged: now.slice(0, 10), Surah: "Al-Mulk",
    AyahStart: 1, AyahEnd: 5, Juz: 29, Category: "Qur'an", Status: "Lancar", TeacherID: "demo_ustadz", Quality: "Baik",
  });
  DEMO_upsert_("Incidents", "IncidentID", {
    IncidentID: "DEMO-INC-001", StudentID: studentId, DateOfIncident: now.slice(0, 10), IncidentType: "Prestasi",
    Description: "Contoh catatan perkembangan santri.", Severity: "Baik", Points: 0, ReportedBy: "demo_ustadz", Category: "Pembinaan",
  });
  DEMO_seedAcademic_(studentId, className, now);
}

function DEMO_seedAcademic_(studentId, className, now) {
  const period = { PeriodID: "DEMO-PERIOD-2026", AcademicYear: "2026/2027", Semester: "Ganjil", Title: "Raport Demo Semester Ganjil", StartDate: "2026-07-01", EndDate: "2026-12-31", GradeMode: "SemesterExamOnly", AttendanceThreshold: 75, EligibilityCategories: "KBM,Pondok,Kegiatan", Status: "Published", IsLocked: false, CreatedAt: now, UpdatedAt: now };
  DEMO_upsert_(SHEET_ACADEMIC_PERIODS, "PeriodID", period);
  [
    { SubjectID: "DEMO-SUB-AQIDAH", Name: "Aqidah Akhlak", Category: "KBM", Level: className, Classes: className, DefaultKKM: 75, SortOrder: 1, IsActive: true },
    { SubjectID: "DEMO-SUB-QURAN", Name: "Hafalan Qur'an", Category: "Pondok", Level: className, Classes: className, DefaultKKM: 75, SortOrder: 2, IsActive: true },
  ].forEach((subject) => DEMO_upsert_(SHEET_ACADEMIC_SUBJECTS, "SubjectID", subject));
  [
    { ComponentID: "DEMO-CMP-AQIDAH", PeriodID: period.PeriodID, SubjectID: "DEMO-SUB-AQIDAH", Name: "Ujian Semester", Weight: 100, MaxScore: 100, SortOrder: 1, IsActive: true },
    { ComponentID: "DEMO-CMP-QURAN", PeriodID: period.PeriodID, SubjectID: "DEMO-SUB-QURAN", Name: "Ujian Semester", Weight: 100, MaxScore: 100, SortOrder: 1, IsActive: true },
  ].forEach((component) => DEMO_upsert_("AssessmentComponents", "ComponentID", component));
  [
    { ScoreID: "DEMO-SCR-AQIDAH", PeriodID: period.PeriodID, StudentID: studentId, SubjectID: "DEMO-SUB-AQIDAH", ComponentID: "DEMO-CMP-AQIDAH", Score: 88, Notes: "Contoh nilai", TeacherID: "demo_ustadz", UpdatedAt: now },
    { ScoreID: "DEMO-SCR-QURAN", PeriodID: period.PeriodID, StudentID: studentId, SubjectID: "DEMO-SUB-QURAN", ComponentID: "DEMO-CMP-QURAN", Score: 92, Notes: "Contoh nilai", TeacherID: "demo_ustadz", UpdatedAt: now },
  ].forEach((score) => DEMO_upsert_(SHEET_ACADEMIC_SCORES, "ScoreID", score));
}

function DEMO_upsert_(sheetName, keyHeader, object) {
  const schema = (typeof CORE_SHEET_SCHEMAS !== "undefined" && CORE_SHEET_SCHEMAS[sheetName]) ||
    (typeof getAcademicSheetSchemas_ === "function" ? getAcademicSheetSchemas_()[sheetName] : null);
  if (!schema) return;
  setupSheetWithHeaders_(sheetName, schema);
  PRODUCT_upsertRowsAndUpdate_(sheetName, keyHeader, [object], "demo");
}

function DEMO_deleteRows_(sheetName, predicate) {
  const sheet = getSheet_(sheetName);
  if (!sheet || sheet.getLastRow() <= 1) return;
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map((header) => String(header || "").trim());
  for (let row = values.length - 1; row >= 1; row--) {
    const item = serializeRow(values[row], headers);
    if (predicate(item)) sheet.deleteRow(row + 1);
  }
}

function createSetupImportTemplates(currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupProductReadinessSheets();
  AUTH_appendAuditLog_("CREATE", "SetupImportTemplates", "current", sessionUser, {});
  return {
    ok: true,
    data: {
      spreadsheetUrl: getSpreadsheet_().getUrl(),
      sheets: [
        SHEET_SETUP_IMPORT_STUDENTS,
        SHEET_SETUP_IMPORT_USERS,
        SHEET_SETUP_IMPORT_SCHEDULES,
      ],
    },
    message: "Template import sudah siap di Spreadsheet.",
  };
}

function seedSetupDummyData(currentUser) {
  const sessionUser = requireSessionUser_(currentUser, { roles: ["Mudir", "Admin"] });
  setupProductReadinessSheets();
  const examples = {};
  examples[SHEET_SETUP_IMPORT_STUDENTS] = [
    { Name: "Ahmad Contoh", NIS: "DUMMY001", ClassLevel: "KELAS DEMO", Level: "Menengah", Gender: "L", ParentContact: "081234567890", WaliUsername: "wali_contoh", SchoolUnit: "Pondok Contoh", CohortYear: "2026", ResidencyStatus: "Mukim", Room: "A-01" },
    { Name: "Fatimah Contoh", NIS: "DUMMY002", ClassLevel: "KELAS DEMO", Level: "Menengah", Gender: "P", ParentContact: "081234567891", WaliUsername: "wali_fatimah", SchoolUnit: "Pondok Contoh", CohortYear: "2026", ResidencyStatus: "Mukim", Room: "A-02" },
  ];
  examples[SHEET_SETUP_IMPORT_USERS] = [
    { Name: "Mudir Contoh", Username: "mudir_contoh", Password: "Demo123", Role: "Mudir", Status: "Active" },
    { Name: "Admin Contoh", Username: "admin_contoh", Password: "Demo123", Role: "Admin", Status: "Active" },
    { Name: "Ustadz Contoh", Username: "ustadz_contoh", Password: "Demo123", Role: "Ustadz", Class: "KELAS DEMO", TeacherSourceID: "DUMMY-TEACHER-001", Status: "Active" },
    { Name: "Wali Ahmad Contoh", Username: "wali_contoh", Password: "Demo123", Role: "Wali", Phone: "081234567890", Status: "Active" },
  ];
  examples[SHEET_SETUP_IMPORT_SCHEDULES] = [
    { Type: "KBM", TeacherID: "ustadz_contoh", TeacherSourceID: "DUMMY-TEACHER-001", SubjectOrActivityName: "Aqidah Akhlak", ClassOrGroupName: "KELAS DEMO", DayOfWeek: "Senin", StartTime: "08:00", EndTime: "09:00", IsActive: true },
    { Type: "Pondok", TeacherID: "ustadz_contoh", TeacherSourceID: "DUMMY-TEACHER-001", SubjectOrActivityName: "Hafalan Qur'an", ClassOrGroupName: "KELAS DEMO", DayOfWeek: "Selasa", StartTime: "07:30", EndTime: "08:00", IsActive: true },
  ];
  const schemas = getProductReadinessSchemas_();
  Object.keys(examples).forEach((sheetName) => {
    const headers = schemas[sheetName];
    const sheet = getSheet_(sheetName);
    if (!headers || !sheet) return;
    const values = sheet.getDataRange().getValues();
    const isDummyRow = (row) => {
      if (sheetName === SHEET_SETUP_IMPORT_STUDENTS) return String(row[1] || "") === "DUMMY001" || String(row[1] || "") === "DUMMY002";
      if (sheetName === SHEET_SETUP_IMPORT_USERS) return ["mudir_contoh", "admin_contoh", "ustadz_contoh", "wali_contoh"].includes(String(row[1] || "").trim());
      return String(row[2] || "") === "DUMMY-TEACHER-001";
    };
    for (let row = values.length - 1; row >= 1; row--) {
      if (isDummyRow(values[row])) sheet.deleteRow(row + 1);
    }
    examples[sheetName].forEach((item) => sheet.appendRow(headers.map((header) => item[header] === undefined ? "" : item[header])));
  });
  AUTH_appendAuditLog_("CREATE", "SetupDummyData", "DUMMY-IMPORT", sessionUser, { students: 2, users: 4, schedules: 2 });
  return { ok: true, message: "Data contoh sudah diisi ke tiga sheet import.", data: { students: 2, users: 4, schedules: 2 } };
}

function importSetupCsv(payload, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, { roles: ["Mudir", "Admin"] });
  setupProductReadinessSheets();
  payload = payload || {};
  const kind = String(payload.kind || "").trim().toLowerCase();
  const sheetByKind = {
    students: SHEET_SETUP_IMPORT_STUDENTS,
    users: SHEET_SETUP_IMPORT_USERS,
    schedules: SHEET_SETUP_IMPORT_SCHEDULES,
  };
  const sheetName = sheetByKind[kind];
  if (!sheetName) return { ok: false, message: "Jenis file tidak dikenali." };
  const encoded = String(payload.contentBase64 || "");
  if (!encoded) return { ok: false, message: "File CSV kosong." };
  if (encoded.length > 4 * 1024 * 1024) return { ok: false, message: "File terlalu besar. Pecah menjadi beberapa file CSV." };
  let csvText;
  try {
    csvText = Utilities.newBlob(Utilities.base64Decode(encoded)).getDataAsString("UTF-8").replace(/^\uFEFF/, "");
  } catch (error) {
    return { ok: false, message: "File CSV tidak dapat dibaca." };
  }
  const firstLine = String(csvText.split(/\r?\n/)[0] || "");
  const delimiter = (firstLine.split(";").length > firstLine.split(",").length) ? ";" : ",";
  const rows = Utilities.parseCsv(csvText, delimiter);
  if (!rows || rows.length < 2) return { ok: false, message: "CSV harus memiliki baris judul dan minimal satu data." };
  const requiredHeaders = getProductReadinessSchemas_()[sheetName];
  const normalizeHeader = (value) => String(value || "").replace(/^\uFEFF/, "").trim().toLowerCase().replace(/[\s_\-\/().]+/g, "");
  const aliases = {
    students: { nama: "Name", name: "Name", nis: "NIS", nisn: "NIS", kelas: "ClassLevel", kelaslevel: "ClassLevel", classlevel: "ClassLevel", class: "ClassLevel", tingkat: "Level", level: "Level", jeniskelamin: "Gender", gender: "Gender", nomorhporangtua: "ParentContact", nohporangtua: "ParentContact", nohpwali: "ParentContact", parentcontact: "ParentContact", walusername: "WaliUsername", usernamewali: "WaliUsername", waliusername: "WaliUsername", tempatlahir: "BirthPlace", birthplace: "BirthPlace", tanggallahir: "BirthDate", birthdate: "BirthDate", unit: "SchoolUnit", schoolunit: "SchoolUnit", tahunmasuk: "CohortYear", cohortyear: "CohortYear", statusmukim: "ResidencyStatus", residencystatus: "ResidencyStatus", kamar: "Room", room: "Room" },
    users: { userid: "UserID", nama: "Name", namalengkap: "Name", namauser: "Name", name: "Name", username: "Username", namapengguna: "Username", namaakun: "Username", akun: "Username", user: "Username", sandi: "Password", katasandi: "Password", password: "Password", salt: "Salt", passwordhash: "PasswordHash", peran: "Role", jabatan: "Role", hakakses: "Role", jenisuser: "Role", role: "Role", email: "Email", nohp: "Phone", nomerhp: "Phone", nomorhp: "Phone", whatsapp: "Phone", telepon: "Phone", phone: "Phone", studentid: "StudentID", nis: "StudentID", nisn: "StudentID", kelas: "Class", class: "Class", teachersourceid: "TeacherSourceID", idguru: "TeacherSourceID", kodeguru: "TeacherSourceID", status: "Status", createdat: "CreatedAt", updatedat: "UpdatedAt", lastlogin: "LastLogin" },
    schedules: { jenis: "Type", type: "Type", guruid: "TeacherID", usernameguru: "TeacherID", teacherid: "TeacherID", teachersourceid: "TeacherSourceID", idguru: "TeacherSourceID", mapel: "SubjectOrActivityName", kegiatan: "SubjectOrActivityName", subjectoractivityname: "SubjectOrActivityName", kelas: "ClassOrGroupName", grup: "ClassOrGroupName", classorgroupname: "ClassOrGroupName", hari: "DayOfWeek", dayofweek: "DayOfWeek", jammulai: "StartTime", starttime: "StartTime", jamselesai: "EndTime", endtime: "EndTime", aktif: "IsActive", isactive: "IsActive" },
  };
  const aliasMap = aliases[kind] || {};
  const incomingHeaders = rows[0].map((header) => aliasMap[normalizeHeader(header)] || String(header || "").replace(/^\uFEFF/, "").trim());
  const minimumHeaders = {
    students: ["Name", "ClassLevel"],
    users: ["Name", "Username", "Role"],
    schedules: ["SubjectOrActivityName", "ClassOrGroupName", "DayOfWeek"],
  }[kind];
  const missing = minimumHeaders.filter((header) => !incomingHeaders.includes(header));
  if (kind === "users" && !incomingHeaders.includes("Password") && !(incomingHeaders.includes("Salt") && incomingHeaders.includes("PasswordHash"))) missing.push("Password awal");
  if (kind === "schedules" && !incomingHeaders.includes("TeacherID") && !incomingHeaders.includes("TeacherSourceID")) missing.push("TeacherID atau TeacherSourceID");
  if (missing.length) return { ok: false, message: "Kolom wajib belum ada: " + missing.join(", ") };
  const sheet = getSheet_(sheetName);
  if (sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
  rows.slice(1).filter((row) => row.some((cell) => String(cell || "").trim())).forEach((row) => {
    const item = {};
    incomingHeaders.forEach((header, index) => { item[header] = row[index] === undefined ? "" : row[index]; });
    sheet.appendRow(requiredHeaders.map((header) => item[header] === undefined ? "" : item[header]));
  });
  AUTH_appendAuditLog_("IMPORT", "SetupCsv", sheetName, sessionUser, { fileName: String(payload.fileName || ""), rows: rows.length - 1 });
  return { ok: true, message: "File " + kind + " berhasil dimuat. Lanjutkan dengan Preview.", data: { kind, sheetName, rows: rows.length - 1 } };
}

function previewSetupWizardImports(currentUser) {
  requireSessionUser_(currentUser, { roles: ["Mudir", "Admin"] });
  setupProductReadinessSheets();
  const preview = PRODUCT_buildImportPreview_();
  return {
    ok: preview.errors.length === 0,
    data: preview,
    message:
      preview.errors.length === 0
        ? "Data import siap diproses."
        : "Masih ada data import yang perlu diperbaiki.",
  };
}

function applySetupWizardImports(currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupProductReadinessSheets();
  const preview = PRODUCT_buildImportPreview_();
  if (preview.errors.length > 0) {
    return {
      ok: false,
      data: preview,
      message: "Import dibatalkan karena masih ada data yang salah.",
    };
  }

  const stats = { students: 0, users: 0, schedules: 0, skipped: 0, errors: [] };
  preview.students.items.forEach((item) => {
    if (item.action === "skip") {
      stats.skipped++;
      return;
    }
    const result = addStudent(item.payload, sessionUser);
    if (result && result.ok) stats.students++;
    else stats.errors.push(result && result.message ? result.message : "Gagal import santri.");
  });
  preview.users.items.forEach((item) => {
    if (item.action === "skip") {
      stats.skipped++;
      return;
    }
    const result = addUser(item.payload, sessionUser);
    if (result && result.ok) stats.users++;
    else stats.errors.push(result && result.message ? result.message : "Gagal import user.");
  });
  preview.schedules.items.forEach((item) => {
    if (item.action === "skip") {
      stats.skipped++;
      return;
    }
    const result = saveSchedule(item.payload, sessionUser);
    if (result && result.ok) stats.schedules++;
    else stats.errors.push(result && result.message ? result.message : "Gagal import jadwal.");
  });

  AUTH_appendAuditLog_("IMPORT", "SetupWizard", "current", sessionUser, stats);
  if (stats.errors.length === 0) PRODUCT_clearSetupImportStaging_();
  return {
    ok: stats.errors.length === 0,
    data: { stats },
    message:
      stats.errors.length === 0
        ? "Import setup selesai."
        : "Sebagian import gagal. Periksa daftar error.",
  };
}

function PRODUCT_clearSetupImportStaging_() {
  [SHEET_SETUP_IMPORT_STUDENTS, SHEET_SETUP_IMPORT_USERS, SHEET_SETUP_IMPORT_SCHEDULES].forEach((sheetName) => {
    const sheet = getSheet_(sheetName);
    if (sheet && sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
  });
}

function completeSetupWizard(currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupProductReadinessSheets();
  const status = PRODUCT_buildWizardStatus_();
  if (!status.ready) {
    return {
      ok: false,
      data: { status },
      message: "Setup belum siap. Periksa item yang masih kurang.",
    };
  }
  PRODUCT_markChecklistDoneFromWizard_(sessionUser.Username);
  AUTH_appendAuditLog_("COMPLETE", "SetupWizard", "current", sessionUser, status);
  return {
    ok: true,
    data: { status },
    message: "Setup pondok sudah siap dipakai.",
  };
}

function PRODUCT_readRows_(sheetName) {
  const sheet = getSheet_(sheetName);
  if (!sheet || sheet.getLastRow() < 1) return [];
  return normalizeSheetData(sheet.getDataRange().getValues()).filter((row) =>
    Object.keys(row).some((key) => String(row[key] || "").trim()),
  );
}

function PRODUCT_buildWizardStatus_() {
  const profile = PRODUCT_readKeyValueSheet_(SHEET_TENANT_PROFILE, "ProfileKey", "ProfileValue");
  const modules = PRODUCT_readModules_();
  const demoAccounts = PRODUCT_readRows_(SHEET_DEMO_ACCOUNTS);
  const students = PRODUCT_countRows_("Students", (row) => !String(row.DeletedAt || "").trim());
  const users = PRODUCT_readRows_("Users");
  const schedules = PRODUCT_countRows_("Schedules", (row) => PRODUCT_toBool_(row.IsActive));
  const periods = PRODUCT_countRows_("AcademicPeriods", () => true);
  const curriculumItems = PRODUCT_countRows_("CurriculumExamItems", (row) => PRODUCT_toBool_(row.IsActive));
  const activeModules = modules.filter((module) => PRODUCT_toBool_(module.IsActive)).length;
  const roleCounts = users.reduce((result, row) => {
    const role = String(row.Role || "Wali").trim() || "Wali";
    result[role] = (result[role] || 0) + 1;
    return result;
  }, {});
  const checks = [
    {
      id: "profile",
      label: "Profil pondok",
      ok: !!String(profile.PondokName || "").trim() && !!String(profile.AcademicYear || "").trim(),
      detail: "Nama pondok dan tahun ajaran wajib diisi.",
    },
    {
      id: "modules",
      label: "Paket modul",
      ok: activeModules > 0,
      detail: activeModules + " modul aktif.",
    },
    {
      id: "students",
      label: "Data santri",
      ok: students > 0,
      detail: students + " santri terbaca.",
    },
    {
      id: "users",
      label: "Akun pengguna",
      ok: !!(roleCounts.Mudir || roleCounts.Admin) && !!roleCounts.Ustadz && !!roleCounts.Wali,
      detail:
        "Mudir/Admin: " + ((roleCounts.Mudir || 0) + (roleCounts.Admin || 0)) +
        ", Ustadz: " + (roleCounts.Ustadz || 0) +
        ", Wali: " + (roleCounts.Wali || 0),
    },
    {
      id: "schedules",
      label: "Jadwal",
      ok: schedules > 0,
      detail: schedules + " jadwal aktif.",
    },
    {
      id: "periods",
      label: "Periode akademik",
      ok: periods > 0,
      detail: periods + " periode tersedia.",
    },
    {
      id: "curriculum",
      label: "Item ujian",
      ok: curriculumItems > 0,
      detail: curriculumItems + " item ujian tersedia.",
    },
    {
      id: "demo",
      label: "Akun demo",
      ok: demoAccounts.some((account) => PRODUCT_toBool_(account.IsActive)),
      detail: demoAccounts.length + " akun demo dicatat.",
    },
  ];
  return {
    ready: checks.every((check) => check.ok),
    checks,
    counts: {
      students,
      users: users.length,
      schedules,
      periods,
      curriculumItems,
      demoAccounts: demoAccounts.length,
      activeModules,
      roleCounts,
    },
  };
}

function PRODUCT_countRows_(sheetName, predicate) {
  try {
    return PRODUCT_readRows_(sheetName).filter(predicate || (() => true)).length;
  } catch (e) {
    return 0;
  }
}

function PRODUCT_buildImportPreview_() {
  const students = PRODUCT_previewStudents_();
  const users = PRODUCT_previewUsers_();
  const schedules = PRODUCT_previewSchedules_();
  return {
    students,
    users,
    schedules,
    errors: []
      .concat(students.errors)
      .concat(users.errors)
      .concat(schedules.errors),
    totals: {
      students: students.items.filter((item) => item.action === "create").length,
      users: users.items.filter((item) => item.action === "create").length,
      schedules: schedules.items.filter((item) => item.action === "create").length,
      skipped:
        students.items.filter((item) => item.action === "skip").length +
        users.items.filter((item) => item.action === "skip").length +
        schedules.items.filter((item) => item.action === "skip").length,
    },
  };
}

function PRODUCT_previewStudents_() {
  const existing = PRODUCT_readRows_("Students");
  const existingKeys = {};
  existing.forEach((row) => {
    [row.NIS, row.Name].forEach((key) => {
      key = String(key || "").trim().toLowerCase();
      if (key) existingKeys[key] = true;
    });
  });
  return PRODUCT_previewSheetRows_(SHEET_SETUP_IMPORT_STUDENTS, (row, rowNumber) => {
    const name = PRODUCT_text_(row.Name);
    const classLevel = PRODUCT_text_(row.ClassLevel || row["Class/Level"]);
    const nis = PRODUCT_text_(row.NIS);
    const errors = [];
    if (!name) errors.push("Nama santri wajib diisi.");
    if (!classLevel) errors.push("Kelas wajib diisi.");
    const key = String(nis || name).trim().toLowerCase();
    const action = key && existingKeys[key] ? "skip" : "create";
    return {
      rowNumber,
      action,
      errors,
      payload: {
        Name: name,
        NIS: nis,
        ClassLevel: classLevel,
        Level: PRODUCT_text_(row.Level),
        Gender: PRODUCT_text_(row.Gender),
        ParentContact: PRODUCT_text_(row.ParentContact),
        WaliUsername: PRODUCT_text_(row.WaliUsername),
        BirthPlace: PRODUCT_text_(row.BirthPlace),
        BirthDate: PRODUCT_text_(row.BirthDate),
        SchoolUnit: PRODUCT_text_(row.SchoolUnit),
        CohortYear: PRODUCT_text_(row.CohortYear),
        ResidencyStatus: PRODUCT_text_(row.ResidencyStatus),
        Room: PRODUCT_text_(row.Room),
      },
    };
  });
}

function PRODUCT_previewUsers_() {
  const existing = PRODUCT_readRows_("Users");
  const existingUsernames = {};
  existing.forEach((row) => {
    const username = PRODUCT_text_(row.Username).toLowerCase();
    if (username) existingUsernames[username] = true;
  });
  return PRODUCT_previewSheetRows_(SHEET_SETUP_IMPORT_USERS, (row, rowNumber) => {
    const username = PRODUCT_text_(row.Username);
    const rawRole = PRODUCT_text_(row.Role);
    const roleAliases = { guru: "Ustadz", ustaz: "Ustadz", ustadz: "Ustadz", orangtua: "Wali", orangtuaasantri: "Wali", walisantri: "Wali", wali: "Wali", pimpinan: "Mudir", mudir: "Mudir", admin: "Admin" };
    const role = roleAliases[rawRole.toLowerCase().replace(/[\s_-]+/g, "")] || rawRole || "Wali";
    const errors = [];
    if (!PRODUCT_text_(row.Name)) errors.push("Nama user wajib diisi.");
    if (!username) errors.push("Username wajib diisi.");
    if (!["Mudir", "Admin", "Ustadz", "Wali"].includes(role)) errors.push("Role tidak valid.");
    const hasImportedHash = PRODUCT_text_(row.Salt) && PRODUCT_text_(row.PasswordHash);
    if (!hasImportedHash && PRODUCT_text_(row.Password).length < 6) errors.push("Password awal minimal 6 karakter.");
    const action = username && existingUsernames[username.toLowerCase()] ? "skip" : "create";
    return {
      rowNumber,
      action,
      errors,
      payload: {
        UserID: PRODUCT_text_(row.UserID),
        Name: PRODUCT_text_(row.Name),
        Username: username,
        Password: PRODUCT_text_(row.Password),
        Salt: PRODUCT_text_(row.Salt),
        PasswordHash: PRODUCT_text_(row.PasswordHash),
        Role: role,
        Email: PRODUCT_text_(row.Email),
        Phone: PRODUCT_text_(row.Phone),
        StudentID: PRODUCT_text_(row.StudentID),
        Class: PRODUCT_text_(row.Class),
        TeacherSourceID: PRODUCT_text_(row.TeacherSourceID),
        Status: PRODUCT_text_(row.Status) || "Active",
        CreatedAt: PRODUCT_text_(row.CreatedAt),
        UpdatedAt: PRODUCT_text_(row.UpdatedAt),
        LastLogin: PRODUCT_text_(row.LastLogin),
      },
    };
  });
}

function PRODUCT_previewSchedules_() {
  const existing = PRODUCT_readRows_("Schedules");
  const existingKeys = {};
  existing.forEach((row) => {
    const key = [
      row.Type,
      row.TeacherID,
      row.TeacherSourceID,
      row.SubjectOrActivityName,
      row.ClassOrGroupName,
      row.DayOfWeek,
      row.StartTime,
      row.EndTime,
    ].map((value) => PRODUCT_text_(value).toLowerCase()).join("|");
    if (key) existingKeys[key] = true;
  });
  return PRODUCT_previewSheetRows_(SHEET_SETUP_IMPORT_SCHEDULES, (row, rowNumber) => {
    const payload = {
      Type: PRODUCT_text_(row.Type) || "KBM",
      TeacherID: PRODUCT_text_(row.TeacherID),
      TeacherSourceID: PRODUCT_text_(row.TeacherSourceID),
      SubjectOrActivityName: PRODUCT_text_(row.SubjectOrActivityName),
      ClassOrGroupName: PRODUCT_text_(row.ClassOrGroupName),
      DayOfWeek: PRODUCT_text_(row.DayOfWeek),
      StartTime: PRODUCT_text_(row.StartTime),
      EndTime: PRODUCT_text_(row.EndTime),
      IsActive: row.IsActive === "" || row.IsActive === null || row.IsActive === undefined
        ? true
        : PRODUCT_toBool_(row.IsActive),
    };
    const errors = [];
    if (!payload.TeacherID && !payload.TeacherSourceID) errors.push("TeacherID atau TeacherSourceID wajib diisi.");
    if (!payload.SubjectOrActivityName) errors.push("Nama mapel/kegiatan wajib diisi.");
    if (!payload.ClassOrGroupName) errors.push("Kelas/grup wajib diisi.");
    if (!payload.DayOfWeek) errors.push("Hari wajib diisi.");
    const key = [
      payload.Type,
      payload.TeacherID,
      payload.TeacherSourceID,
      payload.SubjectOrActivityName,
      payload.ClassOrGroupName,
      payload.DayOfWeek,
      payload.StartTime,
      payload.EndTime,
    ].map((value) => PRODUCT_text_(value).toLowerCase()).join("|");
    return {
      rowNumber,
      action: key && existingKeys[key] ? "skip" : "create",
      errors,
      payload,
    };
  });
}

function PRODUCT_previewSheetRows_(sheetName, mapper) {
  const rows = PRODUCT_readRows_(sheetName);
  const items = rows.map((row, index) => mapper(row, index + 2));
  const errors = [];
  items.forEach((item) => {
    (item.errors || []).forEach((message) => {
      errors.push(sheetName + " baris " + item.rowNumber + ": " + message);
    });
  });
  return { sheetName, items, errors };
}

function PRODUCT_markChecklistDoneFromWizard_(updatedBy) {
  const rows = PRODUCT_readRows_(SHEET_SETUP_CHECKLIST);
  const byId = {};
  rows.forEach((row) => {
    byId[String(row.ChecklistID || "")] = row;
  });
  const mapping = [
    "CHK-PROFILE",
    "CHK-STUDENTS",
    "CHK-USERS",
    "CHK-SCHEDULES",
    "CHK-PERIOD",
    "CHK-CURRICULUM",
    "CHK-DEMO",
    "CHK-SMOKE",
  ];
  mapping.forEach((id) => {
    const existing = byId[id] || {};
    PRODUCT_upsertRowsAndUpdate_(
      SHEET_SETUP_CHECKLIST,
      "ChecklistID",
      [{
        ChecklistID: id,
        Category: existing.Category || "Setup",
        TaskName: existing.TaskName || id,
        Status: "Selesai",
        Notes: existing.Notes || "",
      }],
      updatedBy || "system",
    );
  });
}

function PRODUCT_text_(value) {
  return String(value === null || value === undefined ? "" : value).trim();
}

function PRODUCT_hasReadinessSheets_() {
  const spreadsheet = getSpreadsheet_();
  const schemas = getProductReadinessSchemas_();
  return Object.keys(schemas).every((sheetName) => !!spreadsheet.getSheetByName(sheetName));
}

function PRODUCT_defaultEntitlements_() {
  const activeModules = {};
  PRODUCT_MODULES.forEach((module) => {
    activeModules[module.ModuleCode] = true;
  });
  return {
    gatingMode: "off",
    packageName: "Internal",
    maxStudents: "",
    demoMode: "off",
    modules: activeModules,
    navModules: PRODUCT_NAV_MODULES,
  };
}

function PRODUCT_readModules_() {
  return PRODUCT_readRows_(SHEET_MODULE_LICENSES).map((row) => ({
    ...row,
    IsActive: PRODUCT_toBool_(row.IsActive),
  }));
}

function PRODUCT_readSettings_() {
  return PRODUCT_readKeyValueSheet_(SHEET_APP_SETTINGS, "SettingKey", "SettingValue");
}

function PRODUCT_readKeyValueSheet_(sheetName, keyHeader, valueHeader) {
  const rows = PRODUCT_readRows_(sheetName);
  return rows.reduce((result, row) => {
    const key = String(row[keyHeader] || "").trim();
    if (key) result[key] = row[valueHeader] || "";
    return result;
  }, {});
}

function PRODUCT_upsertKeyValueRows_(sheetName, keyHeader, valueHeader, rows, updatedBy) {
  const mapped = (rows || []).map((row) => {
    const output = {};
    output[keyHeader] = row[keyHeader];
    output[valueHeader] = row[valueHeader];
    return output;
  });
  PRODUCT_upsertRowsAndUpdate_(sheetName, keyHeader, mapped, updatedBy);
}

function PRODUCT_upsertRowsAndUpdate_(sheetName, keyHeader, rows, updatedBy) {
  const sheet = getSheet_(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0].map((header) => String(header || "").trim());
  const keyIndex = headers.indexOf(keyHeader);
  const now = new Date().toISOString();
  const existing = {};
  data.slice(1).forEach((row, index) => {
    const key = String(row[keyIndex] || "").trim();
    if (key) existing[key] = index + 2;
  });

  (rows || []).forEach((row) => {
    const key = String(row[keyHeader] || "").trim();
    if (!key) return;
    const output = headers.map((header) => {
      if (header === "UpdatedAt") return now;
      if (header === "UpdatedBy") return updatedBy || "system";
      return row[header] === undefined ? "" : row[header];
    });
    if (existing[key]) {
      sheet.getRange(existing[key], 1, 1, output.length).setValues([output]);
    } else {
      sheet.appendRow(output);
    }
  });
}

function PRODUCT_normalizeMode_(value) {
  const mode = String(value || "off").trim().toLowerCase();
  return ["off", "canary", "on"].includes(mode) ? mode : "off";
}

function PRODUCT_toBool_(value) {
  if (value === true) return true;
  const text = String(value || "").trim().toLowerCase();
  return ["true", "yes", "ya", "1", "active", "aktif", "on"].includes(text);
}

function PRODUCT_findUserInArgs_(args) {
  const values = Array.isArray(args) ? args : [];
  for (let i = values.length - 1; i >= 0; i--) {
    const value = values[i];
    if (value && typeof value === "object" && value.Role && value.Username) {
      return value;
    }
  }
  return null;
}

const PRODUCT_DEMO_WRITE_ACTIONS = [
  "addStudent", "updateStudentProfile", "updateStudentNote", "logMemorization", "updateMemorization", "deleteMemorization",
  "logIncident", "updateIncident", "deleteIncident", "logAttendance", "saveAttendanceSession", "saveSchedule", "deleteSchedule",
  "bulkUpdateSchedules", "saveAcademicPeriod", "setAcademicPeriodStatus", "saveAcademicSubject", "saveAssessmentComponent",
  "saveAcademicScores", "importAcademicScoresFromStaging", "updateStudentAcademicProfile", "saveAcademicTeacherAssignment",
  "setAcademicTeacherAssignmentStatus", "syncAcademicTeacherAssignmentsFromSchedules", "saveCurriculumExamItem",
  "saveCurriculumExamScores", "savePesantrenInfo", "setPesantrenInfoStatus", "deletePesantrenInfo", "savePulangBulanan",
  "updatePulangBulanan", "deletePulangBulanan", "addHafalanLink", "updateHafalanLink", "deleteHafalanLink", "changeOwnPassword",
];

function PRODUCT_isDemoReadOnlyAction_(action, args) {
  if (!PRODUCT_DEMO_WRITE_ACTIONS.includes(String(action || ""))) return false;
  const user = PRODUCT_findUserInArgs_(args);
  if (!user || !user.Username) return false;
  const account = PRODUCT_readRows_(SHEET_DEMO_ACCOUNTS).find((row) =>
    String(row.Username || "").trim().toLowerCase() === String(user.Username || "").trim().toLowerCase(),
  );
  return !!(account && PRODUCT_toBool_(account.IsActive) && PRODUCT_toBool_(account.IsReadOnly));
}

function isProductModuleEnabledForAction_(action, args) {
  const moduleCode = PRODUCT_ACTION_MODULES[String(action || "")];
  if (!moduleCode) return true;
  const currentUser = PRODUCT_findUserInArgs_(args);
  return isProductModuleEnabled_(moduleCode, currentUser);
}

function isProductModuleEnabled_(moduleCode, currentUser) {
  try {
    if (!PRODUCT_hasReadinessSheets_()) return true;
    const settings = PRODUCT_readSettings_();
    const mode = PRODUCT_normalizeMode_(settings.PRODUCT_MODULE_GATING);
    if (mode === "off") return true;
    if (mode === "canary" && !["Mudir", "Admin"].includes(String((currentUser && currentUser.Role) || ""))) {
      return true;
    }
    const modules = PRODUCT_readModules_();
    const module = modules.find((row) => row.ModuleCode === moduleCode);
    if (!module) return true;
    return PRODUCT_toBool_(module.IsActive);
  } catch (e) {
    return true;
  }
}

function requireProductModuleEnabled_(moduleCode, currentUser) {
  if (!isProductModuleEnabled_(moduleCode, currentUser)) {
    throw new Error("Modul ini belum aktif pada paket pondok.");
  }
}
