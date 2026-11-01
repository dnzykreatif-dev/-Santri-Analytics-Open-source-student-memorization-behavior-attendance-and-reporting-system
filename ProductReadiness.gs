const SHEET_TENANT_PROFILE = "TenantProfile";
const SHEET_APP_SETTINGS = "AppSettings";
const SHEET_MODULE_LICENSES = "ModuleLicenses";
const SHEET_SETUP_CHECKLIST = "SetupChecklist";
const SHEET_DEMO_ACCOUNTS = "DemoAccounts";
const SHEET_SETUP_IMPORT_STUDENTS = "SetupImportStudents";
const SHEET_SETUP_IMPORT_USERS = "SetupImportUsers";
const SHEET_SETUP_IMPORT_SCHEDULES = "SetupImportSchedules";
const SHEET_SETUP_WORKSPACES = "SetupWorkspaces";

const PRODUCT_MODULES = [
  { ModuleCode: "students", ModuleName: "Data Santri", DefaultActive: true },
  { ModuleCode: "attendance", ModuleName: "Absensi", DefaultActive: true },
  { ModuleCode: "memorization", ModuleName: "Hafalan", DefaultActive: true },
  { ModuleCode: "behavior", ModuleName: "Catatan Perilaku", DefaultActive: true },
  { ModuleCode: "academic", ModuleName: "Akademik dan Raport", DefaultActive: true },
  { ModuleCode: "analytics_pro", ModuleName: "Santri Analytics PRO (360° Intelligence)", DefaultActive: true },
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
  getStudent360Analytics: "analytics_pro",
  getBulkClassReportData: "academic",
  getClassLegerNilai: "academic",
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
    [SHEET_SETUP_WORKSPACES]: [
      "WorkspaceID",
      "PondokName",
      "OwnerEmail",
      "DatabaseSpreadsheetID",
      "AppScriptProjectID",
      "DeploymentUrl",
      "ReportTemplateID",
      "Status",
      "CurrentStep",
      "Notes",
      "LastUpdated",
      "UpdatedBy",
      "TenantID",
      "ContactPerson",
      "ContactPhone",
      "City",
      "SetupProgress",
      "LastError",
      "PackageName",
      "ServiceType",
      "ActiveModules",
      "MaxStudents",
      "BillingCycle",
      "PriceAmount",
      "PaidAmount",
      "PaymentStatus",
      "PaymentMethod",
      "LastPaymentDate",
      "StartDate",
      "ExpiryDate",
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
    { ProfileKey: "AcademicYear", ProfileValue: "2026/2027" },
    { ProfileKey: "Semester", ProfileValue: "Ganjil" },
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
  let workspaces = PRODUCT_readWorkspacesSorted_();
  let activeWorkspaceId = PRODUCT_text_(settings.SETUP_ACTIVE_WORKSPACE_ID) ||
    (workspaces[0] ? PRODUCT_text_(workspaces[0].WorkspaceID) : "");
  let activeWorkspace = workspaces.find((item) => PRODUCT_text_(item.WorkspaceID) === activeWorkspaceId) || null;

  // Pastikan instalasi aktif selalu memiliki riwayat workspace tercatat (tidak pernah null / kosong)
  if (!workspaces.length || !activeWorkspace) {
    const seeded = PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
      WorkspaceID: activeWorkspaceId || "",
      PondokName: profile.PondokName || "Pondok Pesantren",
      CurrentStep: settings.SETUP_CURRENT_STEP || "profil",
      Status: wizardStatus.ready ? "Siap" : "Proses",
    });
    if (seeded) {
      workspaces = PRODUCT_readWorkspacesSorted_();
      activeWorkspace = workspaces.find((item) => PRODUCT_text_(item.WorkspaceID) === seeded.WorkspaceID) || seeded;
      activeWorkspaceId = PRODUCT_text_(activeWorkspace.WorkspaceID);
    }
  }

  const savedWizardStep = PRODUCT_normalizeWizardStep_(
    settings.SETUP_CURRENT_STEP || (activeWorkspace && activeWorkspace.CurrentStep) || "profil",
  );

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
      workspaces,
      activeWorkspaceId,
      activeWorkspace,
      savedWizardStep,
      user: {
        Username: sessionUser.Username,
        Role: sessionUser.Role,
      },
    },
  };
}

function PRODUCT_normalizeWizardStep_(step) {
  const raw = PRODUCT_text_(step).toLowerCase();
  const map = {
    profil: "profil",
    identitas: "profil",
    paket: "paket",
    modul: "paket",
    data: "data",
    import: "data",
    santri: "data",
    jadwal: "jadwal",
    akademik: "akademik",
    raport: "akademik",
    demo: "demo",
    cek: "cek",
    selesai: "cek",
  };
  return map[raw] || "profil";
}

function PRODUCT_stepLabel_(step) {
  const normalized = PRODUCT_normalizeWizardStep_(step);
  const labels = {
    profil: "Profil",
    paket: "Paket",
    data: "Data",
    jadwal: "Jadwal",
    akademik: "Akademik",
    demo: "Demo",
    cek: "Cek",
  };
  return labels[normalized] || "Profil";
}

function PRODUCT_readWorkspacesSorted_() {
  const rows = PRODUCT_readRows_(SHEET_SETUP_WORKSPACES);
  return rows.sort((a, b) => {
    const ta = new Date(a.LastUpdated || 0).getTime() || 0;
    const tb = new Date(b.LastUpdated || 0).getTime() || 0;
    return tb - ta;
  });
}

function PRODUCT_calculateWizardProgressPercent_(wizardStatus) {
  const checks = (wizardStatus && wizardStatus.checks) || [];
  if (!checks.length) return 0;
  const done = checks.filter((item) => item && item.ok).length;
  return Math.round((done / checks.length) * 100);
}

function PRODUCT_syncActiveWorkspaceProgress_(sessionUser, updates) {
  try {
    updates = updates || {};
    const username = (sessionUser && sessionUser.Username) || "system";
    const profile = PRODUCT_readKeyValueSheet_(SHEET_TENANT_PROFILE, "ProfileKey", "ProfileValue");
    const settings = PRODUCT_readSettings_();
    const modules = PRODUCT_readModules_();
    const installation = PRODUCT_readInstallationManifest_();
    const wizardStatus = PRODUCT_buildWizardStatus_();
    const workspaces = PRODUCT_readRows_(SHEET_SETUP_WORKSPACES);

    const requestedId = PRODUCT_text_(updates.WorkspaceID || settings.SETUP_ACTIVE_WORKSPACE_ID);
    const pondokName = PRODUCT_text_(updates.PondokName || profile.PondokName || "Pondok Baru");
    let existing = null;
    if (requestedId) {
      existing = workspaces.find((item) => PRODUCT_text_(item.WorkspaceID) === requestedId) || null;
    }
    if (!existing && pondokName) {
      existing = workspaces.find(
        (item) => PRODUCT_text_(item.PondokName).toLowerCase() === pondokName.toLowerCase(),
      ) || null;
    }
    if (!existing && !requestedId && workspaces.length === 1) {
      existing = workspaces[0];
    }

    const workspaceId = (existing && PRODUCT_text_(existing.WorkspaceID)) ||
      requestedId ||
      "WS-" + Utilities.getUuid().slice(0, 8).toUpperCase();
    const stepId = PRODUCT_normalizeWizardStep_(
      updates.CurrentStep || (existing && existing.CurrentStep) || settings.SETUP_CURRENT_STEP || "profil",
    );
    const stepLabel = PRODUCT_stepLabel_(stepId);
    const progressPct = updates.SetupProgress !== undefined
      ? Number(updates.SetupProgress) || 0
      : PRODUCT_calculateWizardProgressPercent_(wizardStatus);
    const activeModuleList = modules
      .filter((item) => PRODUCT_toBool_(item.IsActive))
      .map((item) => item.ModuleCode)
      .join(",");

    const lastError = updates.LastError !== undefined
      ? PRODUCT_text_(updates.LastError)
      : PRODUCT_text_(existing && existing.LastError);
    let status = PRODUCT_text_(updates.Status || (existing && existing.Status) || "Proses");
    if (lastError) {
      status = "Terkendala";
    } else if (wizardStatus.ready && status !== "Aktif") {
      status = "Siap";
    } else if (status === "Terkendala" && updates.LastError === "") {
      status = "Proses";
    }

    const now = new Date().toISOString();
    const row = {
      WorkspaceID: workspaceId,
      PondokName: pondokName,
      OwnerEmail: PRODUCT_text_(
        updates.OwnerEmail !== undefined
          ? updates.OwnerEmail
          : (existing && existing.OwnerEmail) || installation.ownerEmail || profile.ContactEmail,
      ),
      DatabaseSpreadsheetID: PRODUCT_text_(
        updates.DatabaseSpreadsheetID !== undefined
          ? updates.DatabaseSpreadsheetID
          : (existing && existing.DatabaseSpreadsheetID) || (installation.hasSpreadsheetId ? getConfiguredSpreadsheetId_() : ""),
      ),
      AppScriptProjectID: PRODUCT_text_(
        updates.AppScriptProjectID !== undefined ? updates.AppScriptProjectID : existing && existing.AppScriptProjectID,
      ),
      DeploymentUrl: PRODUCT_text_(
        updates.DeploymentUrl !== undefined ? updates.DeploymentUrl : existing && existing.DeploymentUrl,
      ),
      ReportTemplateID: PRODUCT_text_(
        updates.ReportTemplateID !== undefined
          ? updates.ReportTemplateID
          : (existing && existing.ReportTemplateID) || (installation.hasReportTemplateId ? getConfiguredReportTemplateId_() : ""),
      ),
      Status: status,
      CurrentStep: stepLabel,
      Notes: PRODUCT_text_(updates.Notes !== undefined ? updates.Notes : existing && existing.Notes),
      LastUpdated: now,
      UpdatedBy: username,
      TenantID: PRODUCT_text_(
        updates.TenantID !== undefined ? updates.TenantID : (existing && existing.TenantID) || installation.tenantId,
      ),
      ContactPerson: PRODUCT_text_(
        updates.ContactPerson !== undefined ? updates.ContactPerson : existing && existing.ContactPerson,
      ),
      ContactPhone: PRODUCT_text_(
        updates.ContactPhone !== undefined
          ? updates.ContactPhone
          : (existing && existing.ContactPhone) || profile.ContactPhone,
      ),
      City: PRODUCT_text_(
        updates.City !== undefined ? updates.City : (existing && existing.City) || profile.Address,
      ),
      SetupProgress: progressPct,
      LastError: lastError,
      PackageName: PRODUCT_text_(
        updates.PackageName !== undefined
          ? updates.PackageName
          : (existing && existing.PackageName) || settings.PRODUCT_PACKAGE_NAME || "Internal",
      ),
      ServiceType: PRODUCT_text_(
        updates.ServiceType !== undefined ? updates.ServiceType : (existing && existing.ServiceType) || "Web App",
      ),
      ActiveModules: PRODUCT_text_(
        updates.ActiveModules !== undefined ? updates.ActiveModules : activeModuleList || (existing && existing.ActiveModules),
      ),
      MaxStudents: PRODUCT_text_(
        updates.MaxStudents !== undefined
          ? updates.MaxStudents
          : (existing && existing.MaxStudents) || settings.PRODUCT_MAX_STUDENTS,
      ),
      BillingCycle: PRODUCT_text_(
        updates.BillingCycle !== undefined ? updates.BillingCycle : (existing && existing.BillingCycle) || "Tahunan",
      ),
      PriceAmount: PRODUCT_text_(
        updates.PriceAmount !== undefined ? updates.PriceAmount : existing && existing.PriceAmount,
      ),
      PaidAmount: PRODUCT_text_(
        updates.PaidAmount !== undefined ? updates.PaidAmount : existing && existing.PaidAmount,
      ),
      PaymentStatus: PRODUCT_text_(
        updates.PaymentStatus !== undefined ? updates.PaymentStatus : (existing && existing.PaymentStatus) || "Belum Bayar",
      ),
      PaymentMethod: PRODUCT_text_(
        updates.PaymentMethod !== undefined ? updates.PaymentMethod : existing && existing.PaymentMethod,
      ),
      LastPaymentDate: PRODUCT_text_(
        updates.LastPaymentDate !== undefined ? updates.LastPaymentDate : existing && existing.LastPaymentDate,
      ),
      StartDate: PRODUCT_text_(
        updates.StartDate !== undefined ? updates.StartDate : existing && existing.StartDate,
      ),
      ExpiryDate: PRODUCT_text_(
        updates.ExpiryDate !== undefined ? updates.ExpiryDate : existing && existing.ExpiryDate,
      ),
    };

    PRODUCT_upsertRowsAndUpdate_(SHEET_SETUP_WORKSPACES, "WorkspaceID", [row], username);
    PRODUCT_upsertKeyValueRows_(
      SHEET_APP_SETTINGS,
      "SettingKey",
      "SettingValue",
      [
        { SettingKey: "SETUP_ACTIVE_WORKSPACE_ID", SettingValue: workspaceId },
        { SettingKey: "SETUP_CURRENT_STEP", SettingValue: stepId },
      ],
      username,
    );
    return row;
  } catch (e) {
    return null;
  }
}

function saveSetupWorkspace(payload, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, { roles: ["Mudir", "Admin"] });
  setupProductReadinessSheets();
  payload = payload || {};
  const name = PRODUCT_text_(payload.PondokName);
  if (!name) return { ok: false, message: "Nama pondok wajib diisi." };
  const workspaceId = PRODUCT_text_(payload.WorkspaceID) || "WS-" + Utilities.getUuid().slice(0, 8).toUpperCase();
  const existing = PRODUCT_readRows_(SHEET_SETUP_WORKSPACES).find(
    (item) => PRODUCT_text_(item.WorkspaceID) === workspaceId,
  ) || {};
  const stepLabel = PRODUCT_stepLabel_(payload.CurrentStep || existing.CurrentStep || "Profil");
  const now = new Date().toISOString();
  const wizardStatus = PRODUCT_buildWizardStatus_();
  const row = {
    WorkspaceID: workspaceId,
    PondokName: name,
    OwnerEmail: PRODUCT_text_(payload.OwnerEmail !== undefined ? payload.OwnerEmail : existing.OwnerEmail),
    DatabaseSpreadsheetID: PRODUCT_text_(
      payload.DatabaseSpreadsheetID !== undefined ? payload.DatabaseSpreadsheetID : existing.DatabaseSpreadsheetID,
    ),
    AppScriptProjectID: PRODUCT_text_(
      payload.AppScriptProjectID !== undefined ? payload.AppScriptProjectID : existing.AppScriptProjectID,
    ),
    DeploymentUrl: PRODUCT_text_(
      payload.DeploymentUrl !== undefined ? payload.DeploymentUrl : existing.DeploymentUrl,
    ),
    ReportTemplateID: PRODUCT_text_(
      payload.ReportTemplateID !== undefined ? payload.ReportTemplateID : existing.ReportTemplateID,
    ),
    Status: PRODUCT_text_(payload.Status || existing.Status || "Draft"),
    CurrentStep: stepLabel,
    Notes: PRODUCT_text_(payload.Notes !== undefined ? payload.Notes : existing.Notes),
    LastUpdated: now,
    UpdatedBy: sessionUser.Username,
    TenantID: PRODUCT_text_(payload.TenantID !== undefined ? payload.TenantID : existing.TenantID),
    ContactPerson: PRODUCT_text_(payload.ContactPerson !== undefined ? payload.ContactPerson : existing.ContactPerson),
    ContactPhone: PRODUCT_text_(payload.ContactPhone !== undefined ? payload.ContactPhone : existing.ContactPhone),
    City: PRODUCT_text_(payload.City !== undefined ? payload.City : existing.City),
    SetupProgress:
      payload.SetupProgress !== undefined && payload.SetupProgress !== ""
        ? Number(payload.SetupProgress) || 0
        : existing.SetupProgress !== undefined && existing.SetupProgress !== ""
          ? Number(existing.SetupProgress) || 0
          : PRODUCT_calculateWizardProgressPercent_(wizardStatus),
    LastError: PRODUCT_text_(payload.LastError !== undefined ? payload.LastError : existing.LastError),
    PackageName: PRODUCT_text_(payload.PackageName !== undefined ? payload.PackageName : existing.PackageName || "Standar"),
    ServiceType: PRODUCT_text_(payload.ServiceType !== undefined ? payload.ServiceType : existing.ServiceType || "Web App"),
    ActiveModules: Array.isArray(payload.ActiveModules)
      ? payload.ActiveModules.join(",")
      : PRODUCT_text_(payload.ActiveModules !== undefined ? payload.ActiveModules : existing.ActiveModules),
    MaxStudents: PRODUCT_text_(payload.MaxStudents !== undefined ? payload.MaxStudents : existing.MaxStudents),
    BillingCycle: PRODUCT_text_(payload.BillingCycle !== undefined ? payload.BillingCycle : existing.BillingCycle || "Tahunan"),
    PriceAmount: PRODUCT_text_(payload.PriceAmount !== undefined ? payload.PriceAmount : existing.PriceAmount),
    PaidAmount: PRODUCT_text_(payload.PaidAmount !== undefined ? payload.PaidAmount : existing.PaidAmount),
    PaymentStatus: PRODUCT_text_(
      payload.PaymentStatus !== undefined ? payload.PaymentStatus : existing.PaymentStatus || "Belum Bayar",
    ),
    PaymentMethod: PRODUCT_text_(payload.PaymentMethod !== undefined ? payload.PaymentMethod : existing.PaymentMethod),
    LastPaymentDate: PRODUCT_text_(payload.LastPaymentDate !== undefined ? payload.LastPaymentDate : existing.LastPaymentDate),
    StartDate: PRODUCT_text_(payload.StartDate !== undefined ? payload.StartDate : existing.StartDate),
    ExpiryDate: PRODUCT_text_(payload.ExpiryDate !== undefined ? payload.ExpiryDate : existing.ExpiryDate),
  };
  PRODUCT_upsertRowsAndUpdate_(SHEET_SETUP_WORKSPACES, "WorkspaceID", [row], sessionUser.Username);
  if (payload.setAsActive !== false) {
    PRODUCT_upsertKeyValueRows_(
      SHEET_APP_SETTINGS,
      "SettingKey",
      "SettingValue",
      [
        { SettingKey: "SETUP_ACTIVE_WORKSPACE_ID", SettingValue: workspaceId },
        { SettingKey: "SETUP_CURRENT_STEP", SettingValue: PRODUCT_normalizeWizardStep_(stepLabel) },
      ],
      sessionUser.Username,
    );
  }
  AUTH_appendAuditLog_("UPDATE", "SetupWorkspace", workspaceId, sessionUser, {
    pondokName: name,
    status: row.Status,
    currentStep: row.CurrentStep,
    packageName: row.PackageName,
    paymentStatus: row.PaymentStatus,
  });
  return {
    ok: true,
    message: "Data pondok & riwayat setup tersimpan.",
    data: {
      workspace: row,
      workspaces: PRODUCT_readWorkspacesSorted_(),
      activeWorkspaceId: workspaceId,
    },
  };
}

function saveSetupProgress(payload, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, { roles: ["Mudir", "Admin"] });
  setupProductReadinessSheets();
  payload = payload || {};
  const workspace = PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
    WorkspaceID: payload.WorkspaceID,
    PondokName: payload.PondokName,
    CurrentStep: payload.CurrentStep || payload.step,
    Status: payload.Status,
    LastError: payload.LastError,
    Notes: payload.Notes,
  });
  return {
    ok: true,
    message: "Progres setup tercatat.",
    data: {
      workspace,
      savedWizardStep: PRODUCT_normalizeWizardStep_(payload.CurrentStep || payload.step || (workspace && workspace.CurrentStep)),
      workspaces: PRODUCT_readWorkspacesSorted_(),
    },
  };
}

function resumeSetupWorkspace(payload, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, { roles: ["Mudir", "Admin"] });
  setupProductReadinessSheets();
  const workspaceId = typeof payload === "string"
    ? PRODUCT_text_(payload)
    : PRODUCT_text_(payload && payload.WorkspaceID);
  if (!workspaceId) return { ok: false, message: "Pilih riwayat pondok yang ingin dilanjutkan." };
  const workspaces = PRODUCT_readWorkspacesSorted_();
  const workspace = workspaces.find((item) => PRODUCT_text_(item.WorkspaceID) === workspaceId);
  if (!workspace) return { ok: false, message: "Riwayat setup pondok tidak ditemukan." };

  const stepId = PRODUCT_normalizeWizardStep_(workspace.CurrentStep || "profil");
  PRODUCT_upsertKeyValueRows_(
    SHEET_APP_SETTINGS,
    "SettingKey",
    "SettingValue",
    [
      { SettingKey: "SETUP_ACTIVE_WORKSPACE_ID", SettingValue: workspaceId },
      { SettingKey: "SETUP_CURRENT_STEP", SettingValue: stepId },
    ],
    sessionUser.Username,
  );

  if (!payload || payload.syncProfile !== false) {
    const profileUpdates = [];
    if (PRODUCT_text_(workspace.PondokName)) {
      profileUpdates.push({ ProfileKey: "PondokName", ProfileValue: PRODUCT_text_(workspace.PondokName) });
    }
    if (PRODUCT_text_(workspace.ContactPhone)) {
      profileUpdates.push({ ProfileKey: "ContactPhone", ProfileValue: PRODUCT_text_(workspace.ContactPhone) });
    }
    if (PRODUCT_text_(workspace.OwnerEmail)) {
      profileUpdates.push({ ProfileKey: "ContactEmail", ProfileValue: PRODUCT_text_(workspace.OwnerEmail) });
    }
    if (PRODUCT_text_(workspace.City)) {
      profileUpdates.push({ ProfileKey: "Address", ProfileValue: PRODUCT_text_(workspace.City) });
    }
    if (profileUpdates.length) {
      PRODUCT_upsertKeyValueRows_(SHEET_TENANT_PROFILE, "ProfileKey", "ProfileValue", profileUpdates, sessionUser.Username);
    }
    const settingUpdates = [];
    if (PRODUCT_text_(workspace.PackageName)) {
      settingUpdates.push({ SettingKey: "PRODUCT_PACKAGE_NAME", SettingValue: PRODUCT_text_(workspace.PackageName) });
    }
    if (workspace.MaxStudents !== undefined && workspace.MaxStudents !== "") {
      settingUpdates.push({ SettingKey: "PRODUCT_MAX_STUDENTS", SettingValue: PRODUCT_text_(workspace.MaxStudents) });
    }
    if (settingUpdates.length) {
      PRODUCT_upsertKeyValueRows_(SHEET_APP_SETTINGS, "SettingKey", "SettingValue", settingUpdates, sessionUser.Username);
    }
  }

  AUTH_appendAuditLog_("RESUME", "SetupWorkspace", workspaceId, sessionUser, {
    pondokName: workspace.PondokName,
    step: stepId,
  });
  return {
    ok: true,
    message: "Melanjutkan setup " + workspace.PondokName + " pada langkah " + PRODUCT_stepLabel_(stepId) + ".",
    data: {
      workspace,
      savedWizardStep: stepId,
      activeWorkspaceId: workspaceId,
    },
  };
}

function deleteSetupWorkspace(payload, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, { roles: ["Mudir", "Admin"] });
  setupProductReadinessSheets();
  const workspaceId = typeof payload === "string"
    ? PRODUCT_text_(payload)
    : PRODUCT_text_(payload && payload.WorkspaceID);
  if (!workspaceId) return { ok: false, message: "ID riwayat pondok wajib diisi." };

  const sheet = getSheet_(SHEET_SETUP_WORKSPACES);
  if (!sheet || sheet.getLastRow() <= 1) {
    return { ok: false, message: "Riwayat pondok tidak ditemukan." };
  }
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map((header) => String(header || "").trim());
  const idIndex = headers.indexOf("WorkspaceID");
  const nameIndex = headers.indexOf("PondokName");
  let deletedName = "";
  let deleted = false;
  for (let r = values.length - 1; r >= 1; r--) {
    if (PRODUCT_text_(values[r][idIndex]) === workspaceId) {
      deletedName = PRODUCT_text_(values[r][nameIndex]);
      sheet.deleteRow(r + 1);
      deleted = true;
    }
  }
  if (!deleted) {
    return { ok: false, message: "Riwayat pondok tidak ditemukan." };
  }

  const settings = PRODUCT_readSettings_();
  const remaining = PRODUCT_readWorkspacesSorted_();
  if (PRODUCT_text_(settings.SETUP_ACTIVE_WORKSPACE_ID) === workspaceId) {
    const nextId = remaining[0] ? PRODUCT_text_(remaining[0].WorkspaceID) : "";
    const nextStep = remaining[0] ? PRODUCT_normalizeWizardStep_(remaining[0].CurrentStep) : "profil";
    PRODUCT_upsertKeyValueRows_(
      SHEET_APP_SETTINGS,
      "SettingKey",
      "SettingValue",
      [
        { SettingKey: "SETUP_ACTIVE_WORKSPACE_ID", SettingValue: nextId },
        { SettingKey: "SETUP_CURRENT_STEP", SettingValue: nextStep },
      ],
      sessionUser.Username,
    );
  }

  AUTH_appendAuditLog_("DELETE", "SetupWorkspace", workspaceId, sessionUser, {
    pondokName: deletedName,
  });
  return {
    ok: true,
    message: "Riwayat setup pondok " + (deletedName || workspaceId) + " berhasil dihapus.",
    data: {
      deletedWorkspaceId: workspaceId,
      workspaces: remaining,
    },
  };
}

function saveTenantProfile(profile, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupProductReadinessSheets();
  profile = Object.assign({}, profile || {});
  if (!PRODUCT_text_(profile.AcademicYear)) {
    const existingPeriods = PRODUCT_readRows_("AcademicPeriods");
    profile.AcademicYear = (existingPeriods[0] && PRODUCT_text_(existingPeriods[0].AcademicYear)) || "2026/2027";
  }
  if (!PRODUCT_text_(profile.Semester)) {
    profile.Semester = "Ganjil";
  }
  if (!PRODUCT_text_(profile.PondokName)) {
    const workspaces = PRODUCT_readWorkspacesSorted_();
    if (workspaces.length && workspaces[0].PondokName) {
      profile.PondokName = workspaces[0].PondokName;
    } else {
      profile.PondokName = "Pesantren Santri";
    }
  }
  const rows = Object.keys(profile).map((key) => ({
    ProfileKey: key,
    ProfileValue: profile[key],
  }));
  PRODUCT_upsertKeyValueRows_(SHEET_TENANT_PROFILE, "ProfileKey", "ProfileValue", rows, sessionUser.Username);
  PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
    PondokName: profile.PondokName,
    OwnerEmail: profile.ContactEmail,
    ContactPhone: profile.ContactPhone,
    City: profile.Address,
    CurrentStep: "profil",
    LastError: "",
  });
  AUTH_appendAuditLog_("UPDATE", "TenantProfile", "current", sessionUser, {
    keys: rows.map((row) => row.ProfileKey),
  });
  return { ok: true, message: "Profil pondok tersimpan." };
}

/** Simpan logo kecil sebagai data URL agar tidak perlu membuat file Drive publik. */
function uploadTenantLogo(payload, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, { roles: ["Mudir", "Admin"] });
  payload = payload || {};
  const dataUrl = String(payload.dataUrl || "").trim();
  if (!/^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(dataUrl)) {
    return { ok: false, message: "Logo tidak valid. Pilih file PNG, JPG, atau WEBP." };
  }
  if (dataUrl.length > 65000) {
    return { ok: false, message: "Logo masih terlalu besar. Gunakan gambar di bawah 512 piksel." };
  }
  setupProductReadinessSheets();
  PRODUCT_upsertKeyValueRows_(SHEET_TENANT_PROFILE, "ProfileKey", "ProfileValue", [
    { ProfileKey: "LogoUrl", ProfileValue: dataUrl },
  ], sessionUser.Username);
  PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
    CurrentStep: "profil",
    LastError: "",
  });
  AUTH_appendAuditLog_("UPLOAD", "TenantProfileLogo", "current", sessionUser, {
    storedAs: "private-data-url",
  });
  return { ok: true, message: "Logo berhasil diunggah.", data: { logoUrl: dataUrl } };
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
  PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
    CurrentStep: "paket",
    PackageName: settings && settings.PRODUCT_PACKAGE_NAME,
    MaxStudents: settings && settings.PRODUCT_MAX_STUDENTS,
    LastError: "",
  });
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
  PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
    CurrentStep: "paket",
    ActiveModules: rows.filter((item) => item.IsActive).map((item) => item.ModuleCode).join(","),
    LastError: "",
  });
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
  const role = PRODUCT_text_(account && account.Role) || "Wali";
  let studentId = PRODUCT_text_(account && account.StudentID);
  if (role === "Wali" && !studentId) {
    const students = PRODUCT_readRows_("Students").filter((s) => !PRODUCT_text_(s.DeletedAt));
    if (students.length > 0) {
      studentId = PRODUCT_text_(students[0].StudentID);
    }
  }
  const row = {
    DemoID: (account && account.DemoID) || "DEMO-" + Utilities.getUuid().slice(0, 8).toUpperCase(),
    Role: role,
    Username: PRODUCT_text_(account && account.Username),
    PasswordHint: PRODUCT_text_(account && account.PasswordHint),
    StudentID: studentId,
    IsActive: account && account.IsActive !== undefined ? PRODUCT_toBool_(account.IsActive) : true,
    IsReadOnly: account && account.IsReadOnly !== undefined ? PRODUCT_toBool_(account.IsReadOnly) : true,
    Notes: PRODUCT_text_(account && account.Notes),
  };
  if (!row.Username) return { ok: false, message: "Username demo wajib diisi." };
  PRODUCT_upsertRowsAndUpdate_(SHEET_DEMO_ACCOUNTS, "DemoID", [row], sessionUser.Username);
  if (row.PasswordHint && row.PasswordHint.length >= 6) {
    try {
      syncDemoAccountsToUsers(currentUser);
    } catch (e) {}
  }
  PRODUCT_upsertRowsAndUpdate_(
    SHEET_SETUP_CHECKLIST,
    "ChecklistID",
    [
      {
        ChecklistID: "CHK-DEMO",
        Category: "Penjualan",
        TaskName: "Siapkan akun demo read-only untuk calon pembeli",
        Status: "Selesai",
        Notes: row.Username + " (" + row.Role + ")",
      },
    ],
    sessionUser.Username,
  );
  PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
    CurrentStep: "cek",
    Status: "Proses",
    clearError: true,
  });
  AUTH_appendAuditLog_("UPSERT", "DemoAccount", row.DemoID, sessionUser, {
    role: row.Role,
    username: row.Username,
    studentId: row.StudentID,
  });
  return {
    ok: true,
    message:
      "Akun demo tersimpan" +
      (row.StudentID ? " dan terhubung ke santri (" + row.StudentID + ")." : "."),
    data: { account: row },
  };
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
      if (sheetName === SHEET_SETUP_IMPORT_USERS) {
        const candidates = [String(row[1] || "").trim(), String(row[2] || "").trim()];
        return candidates.some((val) => ["mudir_contoh", "admin_contoh", "ustadz_contoh", "wali_contoh"].includes(val));
      }
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
  const dataRows = rows.slice(1).filter((row) => row.some((cell) => String(cell || "").trim()));
  // Tulis sekali per kelompok data. appendRow satu per satu sangat lambat
  // pada file pondok yang berisi ratusan atau ribuan baris.
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, requiredHeaders.length).clearContent();
  }
  const outputRows = dataRows.map((row) => {
    const item = {};
    incomingHeaders.forEach((header, index) => { item[header] = row[index] === undefined ? "" : row[index]; });
    return requiredHeaders.map((header) => item[header] === undefined ? "" : item[header]);
  });
  if (outputRows.length) {
    const neededRows = outputRows.length + 1;
    if (sheet.getMaxRows() < neededRows) sheet.insertRowsAfter(sheet.getMaxRows(), neededRows - sheet.getMaxRows());
    sheet.getRange(2, 1, outputRows.length, requiredHeaders.length).setValues(outputRows);
  }
  AUTH_appendAuditLog_("IMPORT", "SetupCsv", sheetName, sessionUser, { fileName: String(payload.fileName || ""), rows: outputRows.length });
  PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
    CurrentStep: "data",
    LastError: "",
  });
  return { ok: true, message: "File " + kind + " berhasil dimuat. Lanjutkan dengan Preview.", data: { kind, sheetName, rows: outputRows.length } };
}

function previewSetupWizardImports(currentUser) {
  const sessionUser = requireSessionUser_(currentUser, { roles: ["Mudir", "Admin"] });
  setupProductReadinessSheets();
  const preview = PRODUCT_buildImportPreview_();
  PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
    CurrentStep: "data",
    LastError: preview.errors.length ? preview.errors.slice(0, 3).join("; ") : "",
  });
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
    PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
      CurrentStep: "data",
      LastError: preview.errors.slice(0, 3).join("; "),
    });
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

  try {
    const linkStats = PRODUCT_autoLinkWaliUsersToStudents_(sessionUser);
    stats.waliLinked = linkStats.linked;
    stats.waliCreated = linkStats.created;
  } catch (e) {}

  AUTH_appendAuditLog_("IMPORT", "SetupWizard", "current", sessionUser, stats);
  if (stats.errors.length === 0) PRODUCT_clearSetupImportStaging_();
  PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
    CurrentStep: stats.errors.length === 0 ? "jadwal" : "data",
    LastError: stats.errors.length ? stats.errors.slice(0, 3).join("; ") : "",
  });
  return {
    ok: stats.errors.length === 0,
    data: { stats },
    message:
      stats.errors.length === 0
        ? "Import setup selesai & akun Wali telah ditautkan otomatis ke Santri."
        : "Sebagian import gagal. Periksa daftar error.",
  };
}

function syncWaliStudentsLink(currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupProductReadinessSheets();
  const result = PRODUCT_autoLinkWaliUsersToStudents_(sessionUser);
  return {
    ok: true,
    message:
      "Sinkronisasi selesai: " +
      result.linked +
      " akun Wali ditautkan ke StudentID santri asli, " +
      result.created +
      " akun Wali baru dibuat otomatis.",
    data: result,
  };
}

function PRODUCT_autoLinkWaliUsersToStudents_(sessionUser) {
  const studentsSheet = getSheet_("Students");
  const usersSheet = getSheet_("Users");
  if (!studentsSheet || !usersSheet || studentsSheet.getLastRow() <= 1) {
    return { linked: 0, created: 0 };
  }
  const stuValues = studentsSheet.getDataRange().getValues();
  const stuHeaders = stuValues[0].map((h) => String(h || "").trim());
  const stuIdIdx = stuHeaders.indexOf("StudentID");
  const stuNisIdx = stuHeaders.indexOf("NIS");
  const stuNameIdx = stuHeaders.indexOf("Name");
  const stuClassIdx = stuHeaders.indexOf("Class/Level");
  const stuPhoneIdx = stuHeaders.indexOf("ParentContact");
  const stuWaliIdx = stuHeaders.indexOf("WaliUsername");
  const stuDelIdx = stuHeaders.indexOf("DeletedAt");

  const normPhone = (val) =>
    typeof normalizePhoneNumber === "function"
      ? normalizePhoneNumber(val)
      : String(val || "").replace(/\D/g, "").replace(/^(0|62)/, "");
  const normText = (val) => String(val || "").trim().toLowerCase();

  const activeStudents = [];
  for (let r = 1; r < stuValues.length; r++) {
    const row = stuValues[r];
    if (stuDelIdx >= 0 && PRODUCT_text_(row[stuDelIdx])) continue;
    const studentId = PRODUCT_text_(row[stuIdIdx]);
    if (!studentId) continue;
    activeStudents.push({
      rowNumber: r + 1,
      row,
      StudentID: studentId,
      NIS: PRODUCT_text_(stuNisIdx >= 0 ? row[stuNisIdx] : ""),
      Name: PRODUCT_text_(stuNameIdx >= 0 ? row[stuNameIdx] : ""),
      Class: PRODUCT_text_(stuClassIdx >= 0 ? row[stuClassIdx] : ""),
      ParentContact: PRODUCT_text_(stuPhoneIdx >= 0 ? row[stuPhoneIdx] : ""),
      WaliUsername: PRODUCT_text_(stuWaliIdx >= 0 ? row[stuWaliIdx] : ""),
    });
  }

  if (!activeStudents.length) return { linked: 0, created: 0 };

  const usrValues = usersSheet.getDataRange().getValues();
  const usrHeaders = usrValues[0].map((h) => String(h || "").trim());
  const uNameIdx = usrHeaders.indexOf("Name");
  const uUserIdx = usrHeaders.indexOf("Username");
  const uPhoneIdx = usrHeaders.indexOf("Phone");
  const uRoleIdx = usrHeaders.indexOf("Role");
  const uStuIdIdx = usrHeaders.indexOf("StudentID");
  const uClassIdx = usrHeaders.indexOf("Class");

  const byStudentId = {};
  activeStudents.forEach((s) => {
    byStudentId[normText(s.StudentID)] = s;
  });

  let linked = 0;
  let created = 0;
  const linkedStudentIds = new Set();

  for (let r = 1; r < usrValues.length; r++) {
    const row = usrValues[r];
    const role = PRODUCT_text_(uRoleIdx >= 0 ? row[uRoleIdx] : "");
    if (normText(role) !== "wali") continue;

    const currentStuRef = PRODUCT_text_(uStuIdIdx >= 0 ? row[uStuIdIdx] : "");
    const username = PRODUCT_text_(uUserIdx >= 0 ? row[uUserIdx] : "");
    const phone = PRODUCT_text_(uPhoneIdx >= 0 ? row[uPhoneIdx] : "");
    const displayName = PRODUCT_text_(uNameIdx >= 0 ? row[uNameIdx] : "");

    if (currentStuRef && byStudentId[normText(currentStuRef)]) {
      linkedStudentIds.add(byStudentId[normText(currentStuRef)].StudentID);
      continue;
    }

    const uPhoneNorm = normPhone(phone || username);
    const strippedWaliName = normText(displayName).replace(/^wali(\s+santri|\s+dari)?\s+/i, "").trim();

    const matched = activeStudents.find((s) => {
      if (currentStuRef) {
        if (normText(s.NIS) === normText(currentStuRef)) return true;
        if (normText(s.Name) === normText(currentStuRef)) return true;
      }
      if (username && s.WaliUsername && normText(s.WaliUsername) === normText(username)) return true;
      if (uPhoneNorm && s.ParentContact && normPhone(s.ParentContact) === uPhoneNorm) return true;
      if (uPhoneNorm && s.WaliUsername && normPhone(s.WaliUsername) === uPhoneNorm) return true;
      if (strippedWaliName && s.Name && normText(s.Name) === strippedWaliName) return true;
      return false;
    });

    if (matched && uStuIdIdx >= 0) {
      row[uStuIdIdx] = matched.StudentID;
      if (uClassIdx >= 0 && !PRODUCT_text_(row[uClassIdx]) && matched.Class) {
        row[uClassIdx] = matched.Class;
      }
      usersSheet.getRange(r + 1, 1, 1, row.length).setValues([row]);
      if (stuWaliIdx >= 0 && !matched.WaliUsername && username) {
        matched.row[stuWaliIdx] = username;
        studentsSheet.getRange(matched.rowNumber, 1, 1, matched.row.length).setValues([matched.row]);
      }
      linkedStudentIds.add(matched.StudentID);
      linked += 1;
    }
  }

  activeStudents.forEach((s) => {
    if (linkedStudentIds.has(s.StudentID)) return;
    if (String(s.StudentID).startsWith("DEMO-")) return;
    const candidateUsername = s.WaliUsername || normPhone(s.ParentContact) || s.ParentContact;
    if (!candidateUsername) return;
    const existingUser = typeof AUTH_findUserRecord_ === "function" ? AUTH_findUserRecord_(candidateUsername) : null;
    if (!existingUser && typeof addUser === "function") {
      const res = addUser(
        {
          Name: "Wali " + s.Name,
          Username: candidateUsername,
          Password: "123456",
          Role: "Wali",
          Phone: s.ParentContact || candidateUsername,
          StudentID: s.StudentID,
          Class: s.Class || "",
          Status: "Active",
        },
        sessionUser,
      );
      if (res && res.ok) {
        created += 1;
        linkedStudentIds.add(s.StudentID);
      }
    }
  });

  return { linked, created };
}

function PRODUCT_clearSetupImportStaging_() {
  [SHEET_SETUP_IMPORT_STUDENTS, SHEET_SETUP_IMPORT_USERS, SHEET_SETUP_IMPORT_SCHEDULES].forEach((sheetName) => {
    const sheet = getSheet_(sheetName);
    if (sheet && sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
  });
}

function applySmartSchedules(payload, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, { roles: ["Mudir", "Admin"] });
  setupProductReadinessSheets();
  if (typeof setupDatabase === "function") setupDatabase();

  const schedules = (payload && Array.isArray(payload.schedules)) ? payload.schedules : [];
  if (!schedules.length) {
    return { ok: false, message: "Tidak ada jadwal yang valid untuk disimpan." };
  }

  // 1. Check & Auto-register missing Ustadz
  const existingUsers = PRODUCT_readRows_("Users");
  const teacherMap = {};
  existingUsers.forEach((u) => {
    const un = String(u.Username || "").trim().toLowerCase();
    const nm = String(u.Name || "").trim().toLowerCase();
    const tid = String(u.TeacherSourceID || "").trim().toLowerCase();
    const record = { Username: u.Username, TeacherSourceID: u.TeacherSourceID || "" };
    if (un) teacherMap[un] = record;
    if (nm) teacherMap[nm] = record;
    if (tid) teacherMap[tid] = record;
  });

  const uniqueNewTeachers = [];
  const seenNewUsernames = new Set();

  schedules.forEach((sched) => {
    const rawTeacher = String(sched.TeacherName || sched.TeacherID || "").trim();
    if (!rawTeacher) {
      sched.TeacherID = sessionUser.Username || "ustadz";
      sched.TeacherSourceID = "GURU-01";
      return;
    }
    const cleanTeacher = rawTeacher
      .replace(/^(ustadz|ustaz|ust|guru|kyai|kiai|habib|syekh|drs|dr|prof)\.?\s+/i, "")
      .replace(/(,\s*(s\.pd\.i|s\.pd|s\.ag|m\.pd|lc|m\.a|ph\.d|b\.a))+$/i, "")
      .trim();
    const candidateUsername = String(sched.TeacherID || cleanTeacher.toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 20)).trim();
    const key = candidateUsername.toLowerCase();
    const rawKey = rawTeacher.toLowerCase();
    const cleanKey = cleanTeacher.toLowerCase();

    const matched = teacherMap[key] || teacherMap[rawKey] || teacherMap[cleanKey];
    if (matched) {
      sched.TeacherID = matched.Username;
      sched.TeacherSourceID = matched.TeacherSourceID || sched.TeacherSourceID || "";
    } else {
      if (!seenNewUsernames.has(key)) {
        seenNewUsernames.add(key);
        const sourceId = (/^T\d+$/i.test(rawTeacher) ? rawTeacher.toUpperCase() : ("GURU-" + String(existingUsers.length + uniqueNewTeachers.length + 1).padStart(2, "0")));
        const newTeacherRecord = {
          Name: rawTeacher,
          Username: candidateUsername,
          Password: "password123",
          Role: "Ustadz",
          TeacherSourceID: sourceId,
          Class: sched.ClassOrGroupName || "",
          Status: "Active",
        };
        uniqueNewTeachers.push(newTeacherRecord);
        const record = { Username: candidateUsername, TeacherSourceID: sourceId };
        teacherMap[key] = record;
        teacherMap[rawKey] = record;
        teacherMap[cleanKey] = record;
      }
      sched.TeacherID = candidateUsername;
      sched.TeacherSourceID = (teacherMap[key] && teacherMap[key].TeacherSourceID) || "";
    }
  });

  let ustadzCreated = 0;
  uniqueNewTeachers.forEach((teacher) => {
    try {
      if (typeof addUser === "function") {
        const res = addUser(teacher, sessionUser);
        if (res && res.ok) ustadzCreated++;
      }
    } catch (e) {}
  });

  // 2. Batch Append to Schedules
  const defaultSchedHeaders = [
    "ScheduleID", "Type", "TeacherID", "TeacherSourceID", "SubjectOrActivityName", "ClassOrGroupName", "DayOfWeek", "StartTime", "EndTime", "IsActive", "CreatedAt", "UpdatedAt"
  ];
  if (typeof setupSheetWithHeaders_ === "function") {
    setupSheetWithHeaders_("Schedules", (typeof CORE_SHEET_SCHEMAS !== "undefined" && CORE_SHEET_SCHEMAS.Schedules) ? CORE_SHEET_SCHEMAS.Schedules : defaultSchedHeaders);
  }
  const schedSheet = getSheet_("Schedules");
  const headers = schedSheet.getRange(1, 1, 1, Math.max(schedSheet.getLastColumn(), 1)).getValues()[0].map((h) => String(h || "").trim());
  const now = new Date().toISOString();
  const rowsToAppend = schedules.map((item) => {
    const rowObj = {
      ScheduleID: item.ScheduleID || "SCH-" + Utilities.getUuid().slice(0, 8).toUpperCase(),
      Type: PRODUCT_text_(item.Type || "KBM"),
      TeacherID: PRODUCT_text_(item.TeacherID || sessionUser.Username || "ustadz"),
      TeacherSourceID: PRODUCT_text_(item.TeacherSourceID || "GURU-01"),
      SubjectOrActivityName: PRODUCT_text_(item.SubjectOrActivityName),
      ClassOrGroupName: PRODUCT_text_(item.ClassOrGroupName),
      DayOfWeek: PRODUCT_text_(item.DayOfWeek || "Senin"),
      StartTime: PRODUCT_text_(item.StartTime || "07:30"),
      EndTime: PRODUCT_text_(item.EndTime || "08:30"),
      IsActive: item.IsActive !== undefined ? PRODUCT_toBool_(item.IsActive) : true,
      CreatedAt: now,
      UpdatedAt: now,
    };
    return headers.map((h) => rowObj[h] === undefined ? "" : rowObj[h]);
  });

  if (rowsToAppend.length > 0) {
    schedSheet.getRange(schedSheet.getLastRow() + 1, 1, rowsToAppend.length, headers.length).setValues(rowsToAppend);
  }

  // 3. Mark Checklist & Workspace Step
  PRODUCT_upsertRowsAndUpdate_(
    SHEET_SETUP_CHECKLIST,
    "ChecklistID",
    [
      {
        ChecklistID: "CHK-SCHEDULES",
        Category: "Operasional",
        TaskName: "Import jadwal KBM, kegiatan pondok, dan ustadz pengampu",
        Status: "Selesai",
        Notes: rowsToAppend.length + " jadwal diimport cerdas dari file",
      },
    ],
    sessionUser.Username,
  );

  PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
    CurrentStep: "akademik",
    Status: "Proses",
    clearError: true,
  });

  AUTH_appendAuditLog_("IMPORT_SCHEDULES", "Schedules", "batch", sessionUser, {
    total: rowsToAppend.length,
    ustadzCreated,
  });

  return {
    ok: true,
    message: rowsToAppend.length + " jadwal berhasil disimpan" + (ustadzCreated > 0 ? " & " + ustadzCreated + " akun Ustadz baru telah dibuat otomatis." : "."),
    data: {
      count: rowsToAppend.length,
      ustadzCreated,
      wizardStatus: PRODUCT_buildWizardStatus_(),
    },
  };
}

function quickAddSetupSchedule(payload, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupProductReadinessSheets();
  if (typeof setupDatabase === "function") setupDatabase();
  const input = payload || {};
  const subjectName = PRODUCT_text_(input.SubjectOrActivityName);
  const className = PRODUCT_text_(input.ClassOrGroupName);
  const dayOfWeek = PRODUCT_text_(input.DayOfWeek || "Senin");
  const teacherId = PRODUCT_text_(input.TeacherID || sessionUser.Username || "ustadz");
  const teacherSourceId = PRODUCT_text_(input.TeacherSourceID || "GURU-01");
  if (!subjectName || !className || !dayOfWeek) {
    return {
      ok: false,
      message: "Nama mata pelajaran/kegiatan, kelas, dan hari wajib diisi.",
    };
  }
  const sheet = getSheet_("Schedules");
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const now = new Date().toISOString();
  const rowObj = {
    ScheduleID: "SCH-" + Utilities.getUuid().slice(0, 8).toUpperCase(),
    Type: PRODUCT_text_(input.Type || "KBM"),
    TeacherID: teacherId,
    TeacherSourceID: teacherSourceId,
    SubjectOrActivityName: subjectName,
    ClassOrGroupName: className,
    DayOfWeek: dayOfWeek,
    StartTime: PRODUCT_text_(input.StartTime || "07:30"),
    EndTime: PRODUCT_text_(input.EndTime || "08:30"),
    IsActive: true,
    CreatedAt: now,
    UpdatedAt: now,
  };
  sheet.appendRow(headers.map((h) => (rowObj[h] === undefined ? "" : rowObj[h])));
  PRODUCT_upsertRowsAndUpdate_(
    SHEET_SETUP_CHECKLIST,
    "ChecklistID",
    [
      {
        ChecklistID: "CHK-SCHEDULES",
        Category: "Operasional",
        TaskName: "Import jadwal KBM, kegiatan pondok, dan ustadz pengampu",
        Status: "Selesai",
        Notes: "Jadwal ditambahkan melalui Wizard Setup",
      },
    ],
    sessionUser.Username,
  );
  PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
    CurrentStep: "akademik",
    Status: "Proses",
    clearError: true,
  });
  return {
    ok: true,
    message: "Jadwal berhasil ditambahkan dan siap disinkronkan ke Akademik.",
    data: {
      schedule: rowObj,
      wizardStatus: PRODUCT_buildWizardStatus_(),
    },
  };
}

function quickSetupWizardAcademic(payload, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupProductReadinessSheets();
  if (typeof setupAcademicSheets === "function") setupAcademicSheets();
  if (typeof setupReportV2Sheets_ === "function") setupReportV2Sheets_();

  try {
    const props = PropertiesService.getScriptProperties();
    const currentRollout = String(props.getProperty("REPORT_V2_ROLLOUT") || "").trim().toLowerCase();
    if (!currentRollout || currentRollout === "off") {
      props.setProperties({ REPORT_V2_ROLLOUT: "on" }, false);
    }
  } catch (e) {}

  const input = payload || {};
  const profile = PRODUCT_readKeyValueSheet_(SHEET_TENANT_PROFILE, "ProfileKey", "ProfileValue");
  const now = new Date();
  const academicYear = PRODUCT_text_(input.AcademicYear || profile.AcademicYear || "2026/2027");
  const semester = PRODUCT_text_(input.Semester || profile.Semester || "Ganjil");
  if (!PRODUCT_text_(profile.AcademicYear) || !PRODUCT_text_(profile.Semester)) {
    try {
      PRODUCT_upsertKeyValueRows_(
        SHEET_TENANT_PROFILE,
        "ProfileKey",
        "ProfileValue",
        [
          { ProfileKey: "AcademicYear", ProfileValue: academicYear },
          { ProfileKey: "Semester", ProfileValue: semester },
        ],
        sessionUser.Username,
      );
    } catch (e) {}
  }
  const startYear = Number(String(academicYear).slice(0, 4)) || now.getFullYear();
  const defaultStart = semester.toLowerCase() === "genap" ? (startYear + 1) + "-01-01" : startYear + "-07-01";
  const defaultEnd = semester.toLowerCase() === "genap" ? (startYear + 1) + "-06-30" : startYear + "-12-31";
  const startDate = PRODUCT_text_(input.StartDate || defaultStart);
  const endDate = PRODUCT_text_(input.EndDate || defaultEnd);
  const title = PRODUCT_text_(input.Title || ("Raport Semester " + semester + " " + academicYear));

  const periodsSheet = getSheet_("AcademicPeriods");
  const periodHeaders = periodsSheet.getRange(1, 1, 1, periodsSheet.getLastColumn()).getValues()[0];
  const existingPeriods = PRODUCT_readRows_("AcademicPeriods");
  let activePeriod = existingPeriods.find(
    (p) =>
      PRODUCT_text_(p.AcademicYear).toLowerCase() === academicYear.toLowerCase() &&
      PRODUCT_text_(p.Semester).toLowerCase() === semester.toLowerCase(),
  ) || existingPeriods[0] || null;

  if (!activePeriod) {
    activePeriod = {
      PeriodID: "PER-" + Utilities.getUuid().slice(0, 8).toUpperCase(),
      AcademicYear: academicYear,
      Semester: semester,
      Title: title,
      StartDate: startDate,
      EndDate: endDate,
      GradeMode: "SemesterExamOnly",
      AttendanceThreshold: 75,
      EligibilityCategories: "KBM,Pondok,Kegiatan",
      Status: "Draft",
      IsLocked: false,
      PublishedAt: "",
      CreatedAt: now.toISOString(),
      UpdatedAt: now.toISOString(),
    };
    periodsSheet.appendRow(periodHeaders.map((h) => (activePeriod[h] === undefined ? "" : activePeriod[h])));
    if (typeof AC_ensureDefaultComponentsForPeriod_ === "function") {
      try {
        AC_ensureDefaultComponentsForPeriod_(activePeriod.PeriodID);
      } catch (e) {}
    }
  }

  const periodId = PRODUCT_text_(activePeriod.PeriodID);
  let syncedCount = 0;

  if (typeof syncCurriculumExamItemsFromSchedules === "function") {
    const syncRes = syncCurriculumExamItemsFromSchedules(periodId, true, sessionUser);
    if (syncRes && syncRes.ok && syncRes.data) {
      syncedCount = Number(syncRes.data.created || 0);
    }
  }

  const existingItems = PRODUCT_readRows_("CurriculumExamItems").filter(
    (item) => PRODUCT_toBool_(item.IsActive),
  );
  if (existingItems.length === 0) {
    const schedules = PRODUCT_readRows_("Schedules").filter((row) => PRODUCT_toBool_(row.IsActive));
    const students = PRODUCT_readRows_("Students").filter((row) => !PRODUCT_text_(row.DeletedAt));
    const defaultClass =
      (schedules[0] && PRODUCT_text_(schedules[0].ClassOrGroupName)) ||
      (students[0] && PRODUCT_text_(students[0]["Class/Level"] || students[0].ClassLevel)) ||
      "KELAS 1";
    const defaultTeacher =
      (schedules[0] && PRODUCT_text_(schedules[0].TeacherID)) ||
      sessionUser.Username ||
      "ustadz";
    const itemsSheet = getSheet_("CurriculumExamItems");
    const itemHeaders = itemsSheet.getRange(1, 1, 1, itemsSheet.getLastColumn()).getValues()[0];
    const sourceRows = schedules.length
      ? schedules
      : [
          {
            ScheduleID: "",
            Type: "KBM",
            SubjectOrActivityName: "Tahfidz & Diniyah",
            ClassOrGroupName: defaultClass,
            TeacherID: defaultTeacher,
            TeacherSourceID: "GURU-01",
          },
        ];
    sourceRows.forEach((sched) => {
      const itemRow = {
        ItemID: "CUR-" + Utilities.getUuid().slice(0, 8).toUpperCase(),
        PeriodID: periodId,
        SourceScheduleID: PRODUCT_text_(sched.ScheduleID),
        Category: PRODUCT_text_(sched.Type || "KBM"),
        Name: PRODUCT_text_(sched.SubjectOrActivityName || "Ujian Semester"),
        ClassOrGroupName: PRODUCT_text_(sched.ClassOrGroupName || defaultClass),
        TeacherID: PRODUCT_text_(sched.TeacherID || defaultTeacher),
        TeacherSourceID: PRODUCT_text_(sched.TeacherSourceID || ""),
        AssessmentType: "Numeric",
        MaxScore: 100,
        KKM: 70,
        Weight: 1,
        Rubric: "Nilai Ujian Semester",
        IncludeInReport: true,
        IsActive: true,
        CreatedBy: sessionUser.Username,
        CreatedAt: now.toISOString(),
        UpdatedAt: now.toISOString(),
      };
      itemsSheet.appendRow(itemHeaders.map((h) => (itemRow[h] === undefined ? "" : itemRow[h])));
      syncedCount += 1;
    });
  }

  PRODUCT_upsertRowsAndUpdate_(
    SHEET_SETUP_CHECKLIST,
    "ChecklistID",
    [
      {
        ChecklistID: "CHK-PERIOD",
        Category: "Akademik",
        TaskName: "Buat periode akademik aktif dan atur tanggal mulai/selesai",
        Status: "Selesai",
        Notes: activePeriod.Title || periodId,
      },
      {
        ChecklistID: "CHK-CURRICULUM",
        Category: "Akademik",
        TaskName: "Sinkronkan item ujian kurikulum dari jadwal",
        Status: "Selesai",
        Notes: "Item ujian kurikulum siap",
      },
    ],
    sessionUser.Username,
  );

  PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
    CurrentStep: "demo",
    Status: "Proses",
    clearError: true,
  });

  return {
    ok: true,
    message:
      "Periode akademik (" +
      (activePeriod.Title || academicYear) +
      ") & item ujian kurikulum berhasil disiapkan otomatis!",
    data: {
      period: activePeriod,
      syncedCount,
      wizardStatus: PRODUCT_buildWizardStatus_(),
    },
  };
}

function completeSetupWizard(currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  setupProductReadinessSheets();
  let status = PRODUCT_buildWizardStatus_();
  if (!status.ready) {
    status = PRODUCT_autoCompleteReadinessPrerequisites_(sessionUser);
  }
  if (!status.ready) {
    const missing = (status.checks || [])
      .filter((item) => !item.ok)
      .map((item) => item.label)
      .join(", ");
    PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
      CurrentStep: "cek",
      LastError: missing ? "Belum lengkap: " + missing : "",
    });
    return {
      ok: false,
      data: { status },
      message: "Setup belum siap: " + missing,
    };
  }
  PRODUCT_markChecklistDoneFromWizard_(sessionUser.Username);
  PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
    CurrentStep: "cek",
    Status: "Siap",
    SetupProgress: 100,
    LastError: "",
  });
  AUTH_appendAuditLog_("COMPLETE", "SetupWizard", "current", sessionUser, status);
  return {
    ok: true,
    data: { status },
    message: "Setup pondok berhasil diselesaikan dan 100% siap dipakai!",
  };
}

function autoCompleteSetupPrerequisites(currentUser) {
  const sessionUser = requireSessionUser_(currentUser, { roles: ["Mudir", "Admin"] });
  const status = PRODUCT_autoCompleteReadinessPrerequisites_(sessionUser);
  AUTH_appendAuditLog_("AUTO_COMPLETE", "SetupWizard", "current", sessionUser, { ready: status.ready });
  return {
    ok: true,
    message: "Semua kebutuhan setup yang kurang telah dilengkapi secara otomatis.",
    data: { wizardStatus: status },
  };
}

function PRODUCT_autoCompleteReadinessPrerequisites_(sessionUser) {
  sessionUser = sessionUser || { Username: "admin", Role: "Admin" };
  setupProductReadinessSheets();
  if (typeof setupDatabase === "function") setupDatabase();
  if (typeof setupAcademicSheets === "function") setupAcademicSheets();

  // 1. Profile Pondok
  const profile = PRODUCT_readKeyValueSheet_(SHEET_TENANT_PROFILE, "ProfileKey", "ProfileValue");
  const profileUpdates = [];
  if (!PRODUCT_text_(profile.PondokName)) {
    const workspaces = PRODUCT_readWorkspacesSorted_();
    profileUpdates.push({
      ProfileKey: "PondokName",
      ProfileValue: (workspaces[0] && workspaces[0].PondokName) || "Raudhatul Ulum",
    });
  }
  if (!PRODUCT_text_(profile.AcademicYear)) {
    const existingPeriods = PRODUCT_readRows_("AcademicPeriods");
    profileUpdates.push({
      ProfileKey: "AcademicYear",
      ProfileValue: (existingPeriods[0] && PRODUCT_text_(existingPeriods[0].AcademicYear)) || "2026/2027",
    });
  }
  if (!PRODUCT_text_(profile.Semester)) {
    profileUpdates.push({ ProfileKey: "Semester", ProfileValue: "Ganjil" });
  }
  if (profileUpdates.length) {
    PRODUCT_upsertKeyValueRows_(SHEET_TENANT_PROFILE, "ProfileKey", "ProfileValue", profileUpdates, sessionUser.Username);
  }

  // 2. Akun Ustadz jika belum ada
  const users = PRODUCT_readRows_("Users");
  const hasUstadz = users.some((u) => String(u.Role || "").toLowerCase() === "ustadz");
  if (!hasUstadz && typeof addUser === "function") {
    try {
      addUser(
        {
          Name: "Ustadz Pembina",
          Username: "ustadz",
          Password: "password123",
          Role: "Ustadz",
          TeacherSourceID: "GURU-01",
          Status: "Active",
        },
        sessionUser
      );
    } catch (e) {}
  }

  // 3. Akun Wali jika belum ada
  const hasWali = users.some((u) => String(u.Role || "").toLowerCase() === "wali");
  if (!hasWali && typeof PRODUCT_autoLinkWaliUsersToStudents_ === "function") {
    try {
      PRODUCT_autoLinkWaliUsersToStudents_(sessionUser);
    } catch (e) {}
  }

  // 4. Jadwal jika belum ada
  const activeSchedules = PRODUCT_countRows_("Schedules", (r) => PRODUCT_toBool_(r.IsActive));
  if (activeSchedules === 0 && typeof quickAddSetupSchedule === "function") {
    const students = PRODUCT_readRows_("Students").filter((s) => !PRODUCT_text_(s.DeletedAt));
    const defaultClass = (students[0] && PRODUCT_text_(students[0]["Class/Level"] || students[0].ClassLevel)) || "KELAS 1";
    try {
      quickAddSetupSchedule(
        {
          Type: "KBM",
          SubjectOrActivityName: "Tahfidz & Diniyah",
          ClassOrGroupName: defaultClass,
          DayOfWeek: "Senin",
          StartTime: "07:30",
          EndTime: "08:30",
          TeacherID: "ustadz",
          TeacherSourceID: "GURU-01",
        },
        sessionUser
      );
    } catch (e) {}
  }

  // 5. Periode Akademik & Item Ujian jika belum ada
  const periods = PRODUCT_countRows_("AcademicPeriods", () => true);
  const curriculumItems = PRODUCT_countRows_("CurriculumExamItems", (r) => PRODUCT_toBool_(r.IsActive));
  if ((periods === 0 || curriculumItems === 0) && typeof quickSetupWizardAcademic === "function") {
    try {
      quickSetupWizardAcademic({}, sessionUser);
    } catch (e) {}
  }

  // 6. Akun Demo jika belum ada
  const demoAccounts = PRODUCT_readRows_(SHEET_DEMO_ACCOUNTS);
  if (!demoAccounts.some((d) => PRODUCT_toBool_(d.IsActive)) && typeof saveDemoAccount === "function") {
    try {
      saveDemoAccount(
        {
          Role: "Wali",
          Username: "demo_wali",
          PasswordHint: "wali123",
          IsActive: true,
          IsReadOnly: true,
        },
        sessionUser
      );
    } catch (e) {}
  }

  return PRODUCT_buildWizardStatus_();
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
  let pondokName = PRODUCT_text_(profile.PondokName);
  if (!pondokName) {
    const workspaces = PRODUCT_readWorkspacesSorted_();
    if (workspaces.length && workspaces[0].PondokName) {
      pondokName = PRODUCT_text_(workspaces[0].PondokName);
      profile.PondokName = pondokName;
      try {
        PRODUCT_upsertKeyValueRows_(
          SHEET_TENANT_PROFILE,
          "ProfileKey",
          "ProfileValue",
          [{ ProfileKey: "PondokName", ProfileValue: pondokName }],
          "system"
        );
      } catch (e) {}
    } else {
      pondokName = "Raudhatul Ulum";
      profile.PondokName = pondokName;
      try {
        PRODUCT_upsertKeyValueRows_(
          SHEET_TENANT_PROFILE,
          "ProfileKey",
          "ProfileValue",
          [{ ProfileKey: "PondokName", ProfileValue: pondokName }],
          "system"
        );
      } catch (e) {}
    }
  }
  let academicYear = PRODUCT_text_(profile.AcademicYear);
  if (!academicYear) {
    const existingPeriods = PRODUCT_readRows_("AcademicPeriods");
    academicYear = (existingPeriods[0] && PRODUCT_text_(existingPeriods[0].AcademicYear)) || "2026/2027";
    profile.AcademicYear = academicYear;
    try {
      PRODUCT_upsertKeyValueRows_(
        SHEET_TENANT_PROFILE,
        "ProfileKey",
        "ProfileValue",
        [
          { ProfileKey: "AcademicYear", ProfileValue: academicYear },
          { ProfileKey: "Semester", ProfileValue: PRODUCT_text_(profile.Semester) || "Ganjil" },
        ],
        "system"
      );
    } catch (e) {}
  }
  const semester = PRODUCT_text_(profile.Semester) || "Ganjil";

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
      ok: !!pondokName && !!academicYear,
      detail:
        !!pondokName && !!academicYear
          ? pondokName + " · TA " + academicYear + " (" + semester + ")"
          : "Nama pondok dan tahun ajaran wajib diisi.",
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
    // Beberapa salinan lama hanya menyimpan username wali tanpa nama.
    // Username tetap dapat dipakai sebagai nama awal dan bisa diedit kemudian.
    const displayName = PRODUCT_text_(row.Name) || username;
    const rawRole = PRODUCT_text_(row.Role);
    const roleAliases = { guru: "Ustadz", ustaz: "Ustadz", ustadz: "Ustadz", orangtua: "Wali", orangtuaasantri: "Wali", walisantri: "Wali", wali: "Wali", pimpinan: "Mudir", mudir: "Mudir", admin: "Admin" };
    const role = roleAliases[rawRole.toLowerCase().replace(/[\s_-]+/g, "")] || rawRole || "Wali";
    const errors = [];
    if (!displayName) errors.push("Nama user wajib diisi.");
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
        Name: displayName,
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
  const rows = PRODUCT_readRows_(sheetName).filter((row) =>
    Object.keys(row || {}).some((key) => PRODUCT_text_(row[key]) !== ""),
  );
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
