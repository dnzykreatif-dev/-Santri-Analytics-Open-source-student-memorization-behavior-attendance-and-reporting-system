const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const scriptProperties = {};
const context = {
  console,
  Utilities: {
    formatDate(value) {
      return new Date(value).toISOString().slice(0, 10);
    },
    getUuid() {
      return "12345678-1234-1234-1234-123456789012";
    },
  },
  Session: { getScriptTimeZone: () => "Asia/Jakarta" },
  normalizePhoneNumber(value) {
    return String(value || "").replace(/\D/g, "").replace(/^0/, "62");
  },
  PropertiesService: {
    getScriptProperties() {
      return {
        getProperty(name) {
          return scriptProperties[name] || null;
        },
      };
    },
  },
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "Config.gs"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "Academic.gs"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "ReportV2.gs"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "ProductReadiness.gs"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "ReleaseManagement.gs"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "Code.gs"), "utf8"), context);

const attendance = context.REPORT_calculateAttendanceSummary_([
  ...Array.from({ length: 8 }, () => ({ Status: "Hadir" })),
  { Status: "Telat" },
  { Status: "Izin" },
]);
assert.strictEqual(attendance.total, 10);
assert.strictEqual(attendance.attended, 9);
assert.strictEqual(attendance.percentage, 90);
assert.strictEqual(
  context.REPORT_resolveEligibilityStatus_(attendance, 75, null),
  "Layak",
);
assert.strictEqual(
  context.REPORT_resolveEligibilityStatus_(attendance, 75, {
    Decision: "Approved",
  }),
  "Layak",
);

const belowThreshold = context.REPORT_calculateAttendanceSummary_([
  { Status: "Hadir" },
  { Status: "Telat" },
  { Status: "Sakit" },
  { Status: "Alpa" },
]);
assert.strictEqual(belowThreshold.percentage, 50);
assert.strictEqual(
  context.REPORT_resolveEligibilityStatus_(belowThreshold, 75, null),
  "Tidak layak",
);
assert.strictEqual(
  context.REPORT_resolveEligibilityStatus_(belowThreshold, 75, {
    Decision: "Approved",
  }),
  "Disetujui dengan pengecualian",
);
assert.strictEqual(
  context.REPORT_resolveEligibilityStatus_(
    context.REPORT_calculateAttendanceSummary_([]),
    75,
    null,
  ),
  "Data belum cukup",
);

const semesterResult = context.AC_calculateSubjectResult_(
  { SubjectID: "SUB-1", Name: "Fiqih", DefaultKKM: 75 },
  [
    {
      ComponentID: "CMP-EXAM",
      Name: "Ujian Semester",
      Weight: 100,
      MaxScore: 100,
    },
  ],
  [{ ComponentID: "CMP-EXAM", Score: 83 }],
);
assert.strictEqual(semesterResult.finalScore, 83);
assert.strictEqual(semesterResult.complete, true);

const legacyResult = context.AC_calculateSubjectResult_(
  { SubjectID: "SUB-2", Name: "Bahasa Arab", DefaultKKM: 75 },
  [
    { ComponentID: "H", Name: "Harian", Weight: 40, MaxScore: 100 },
    { ComponentID: "T", Name: "Tugas", Weight: 20, MaxScore: 100 },
    { ComponentID: "P", Name: "PTS", Weight: 20, MaxScore: 100 },
    { ComponentID: "U", Name: "PAS/PAT", Weight: 20, MaxScore: 100 },
  ],
  [
    { ComponentID: "H", Score: 80 },
    { ComponentID: "T", Score: 90 },
    { ComponentID: "P", Score: 70 },
    { ComponentID: "U", Score: 85 },
  ],
);
assert.strictEqual(legacyResult.finalScore, 81);

const wali = { Role: "Wali", Username: "081234567890", StudentID: "STU-1" };
const ownStudent = {
  StudentID: "STU-1",
  WaliUsername: "081234567890",
  "Class/Level": "7A",
};
const otherStudent = {
  StudentID: "STU-2",
  WaliUsername: "089999999999",
  "Class/Level": "7A",
};
assert.strictEqual(context.REPORT_canViewStudent_(wali, ownStudent, "PER-1"), true);
assert.strictEqual(context.REPORT_canViewStudent_(wali, otherStudent, "PER-1"), false);

context.REPORT_getRows_ = (sheetName) => {
  if (sheetName === "AcademicTeacherAssignments") {
    return [
      {
        PeriodID: "PER-1",
        SubjectID: "SUB-1",
        ClassOrGroupName: "7A",
        TeacherSourceID: "TCH-1",
        IsActive: true,
      },
    ];
  }
  return [];
};
const teacher = { Role: "Ustadz", Username: "ustadz-1", TeacherSourceID: "TCH-1" };
assert.strictEqual(context.REPORT_canViewStudent_(teacher, ownStudent, "PER-1"), true);
assert.strictEqual(
  context.REPORT_canViewStudent_(teacher, { ...otherStudent, "Class/Level": "8B" }, "PER-1"),
  false,
);

context.REPORT_getRows_ = (sheetName) => {
  if (sheetName === "AcademicTeacherAssignments") return [];
  if (sheetName === "Schedules") {
    return [
      {
        ClassOrGroupName: "7A",
        TeacherID: "Ustadz Zidan",
        IsActive: true,
      },
    ];
  }
  return [];
};
assert.strictEqual(
  context.REPORT_canViewStudent_(
    { Role: "Ustadz", Username: "zidan", Name: "Ustadz Zidan" },
    ownStudent,
    "PER-1",
  ),
  true,
);
assert.strictEqual(
  context.REPORT_canViewStudent_(
    { Role: "Ustadz", Username: "kelas-7a", Class: "7A" },
    ownStudent,
    "PER-1",
  ),
  true,
);

context.REPORT_getRows_ = (sheetName) => {
  if (sheetName === "CurriculumExamItems") {
    return [
      {
        ItemID: "CUR-1",
        PeriodID: "PER-1",
        Category: "KBM",
        Name: "Fiqih",
        ClassOrGroupName: "7A",
        AssessmentType: "Angka",
        KKM: 75,
        MaxScore: 100,
        IncludeInReport: true,
        IsActive: true,
      },
      {
        ItemID: "CUR-2",
        PeriodID: "PER-1",
        Category: "Hafalan",
        Name: "Hafalan Qur'an",
        ClassOrGroupName: "7A",
        AssessmentType: "Hafalan",
        KKM: 75,
        MaxScore: 100,
        IncludeInReport: true,
        IsActive: true,
      },
    ];
  }
  if (sheetName === "CurriculumExamScores") {
    return [
      {
        PeriodID: "PER-1",
        ItemID: "CUR-1",
        StudentID: "STU-1",
        Score: 88,
        Status: "",
        Notes: "Baik",
      },
      {
        PeriodID: "PER-1",
        ItemID: "CUR-2",
        StudentID: "STU-1",
        Score: "",
        Status: "Lancar",
        Notes: "Perlu murojaah rutin",
      },
    ];
  }
  return [];
};
const curriculum = context.REPORT_buildCurriculumReport_(
  "STU-1",
  { PeriodID: "PER-1" },
  ownStudent,
);
assert.strictEqual(curriculum.summary.totalItems, 2);
assert.strictEqual(curriculum.summary.complete, true);
assert.strictEqual(curriculum.summary.average, 88);
assert.strictEqual(curriculum.groups.length, 2);

assert.strictEqual(context.isExternalActionAllowed_("downloadStudentReportPdf"), true);
assert.strictEqual(context.isExternalActionAllowed_("syncCurriculumExamItemsFromSchedules"), true);
assert.strictEqual(context.isExternalActionAllowed_("saveCurriculumExamScores"), true);
assert.strictEqual(context.isExternalActionAllowed_("getProductReadiness"), true);
assert.strictEqual(context.isExternalActionAllowed_("saveModuleLicenses"), true);
assert.strictEqual(context.isExternalActionAllowed_("createSetupImportTemplates"), true);
assert.strictEqual(context.isExternalActionAllowed_("previewSetupWizardImports"), true);
assert.strictEqual(context.isExternalActionAllowed_("applySetupWizardImports"), true);
assert.strictEqual(context.isExternalActionAllowed_("completeSetupWizard"), true);
assert.strictEqual(context.isExternalActionAllowed_("getAppReleaseStatus"), true);
assert.strictEqual(context.isExternalActionAllowed_("REPORT_getRows_"), false);
assert.strictEqual(context.isExternalActionAllowed_("setupCompleteApp"), false);
assert.ok(context.getProductReadinessSchemas_().SetupImportStudents.includes("Name"));
assert.ok(context.getProductReadinessSchemas_().SetupImportUsers.includes("Username"));
assert.ok(context.getProductReadinessSchemas_().SetupImportSchedules.includes("SubjectOrActivityName"));

context.PRODUCT_hasReadinessSheets_ = () => false;
assert.strictEqual(context.isProductModuleEnabled_("academic", { Role: "Wali" }), true);
assert.strictEqual(context.PRODUCT_defaultEntitlements_().modules.academic, true);

context.PRODUCT_hasReadinessSheets_ = () => true;
context.PRODUCT_readSettings_ = () => ({ PRODUCT_MODULE_GATING: "on" });
context.PRODUCT_readModules_ = () => [
  { ModuleCode: "academic", IsActive: false },
  { ModuleCode: "behavior", IsActive: true },
];
assert.strictEqual(context.isProductModuleEnabled_("academic", { Role: "Wali" }), false);
assert.strictEqual(context.isProductModuleEnabled_("behavior", { Role: "Wali" }), true);
assert.throws(
  () => context.requireProductModuleEnabled_("academic", { Role: "Wali" }),
  /Modul ini belum aktif/,
);

context.PRODUCT_readSettings_ = () => ({ PRODUCT_MODULE_GATING: "canary" });
assert.strictEqual(context.isProductModuleEnabled_("academic", { Role: "Wali" }), true);
assert.strictEqual(context.isProductModuleEnabled_("academic", { Role: "Admin" }), false);

assert.strictEqual(context.isReportV2EnabledFor_({ Role: "Admin" }), false);
scriptProperties.REPORT_V2_ROLLOUT = "canary";
assert.strictEqual(context.isReportV2EnabledFor_({ Role: "Admin" }), true);
assert.strictEqual(context.isReportV2EnabledFor_({ Role: "Ustadz", Username: "u1" }), false);
scriptProperties.REPORT_V2_CANARY_USERS = "u1,wali-1";
assert.strictEqual(context.isReportV2EnabledFor_({ Role: "Ustadz", Username: "u1" }), true);
scriptProperties.REPORT_V2_ROLLOUT = "on";
assert.strictEqual(context.isReportV2EnabledFor_({ Role: "Wali" }), true);

console.log("Report v2 regression tests passed.");
