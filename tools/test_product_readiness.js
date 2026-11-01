const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

const sheets = {};

function makeSheet(name, initialRows = []) {
  const rows = initialRows.map((row) => [...row]);
  return {
    name,
    hiddenCols: [],
    getLastRow() {
      return rows.length;
    },
    getLastColumn() {
      return rows.reduce((max, r) => Math.max(max, r.length), 0);
    },
    getMaxRows() {
      return Math.max(rows.length, 100);
    },
    insertRowsAfter() {},
    setFrozenRows() {},
    hideColumns(colIndex) {
      this.hiddenCols.push(colIndex);
    },
    getDataRange() {
      return {
        getValues() {
          if (rows.length === 0) return [[""]];
          const width = rows.reduce((max, r) => Math.max(max, r.length), 1);
          return rows.map((r) => {
            const copy = [...r];
            while (copy.length < width) copy.push("");
            return copy;
          });
        },
      };
    },
    getRange(row, col, numRows = 1, numCols = 1) {
      return {
        getValues() {
          const out = [];
          for (let r = 0; r < numRows; r++) {
            const src = rows[row - 1 + r] || [];
            const line = [];
            for (let c = 0; c < numCols; c++) {
              line.push(src[col - 1 + c] === undefined ? "" : src[col - 1 + c]);
            }
            out.push(line);
          }
          return out;
        },
        setValues(values) {
          for (let r = 0; r < values.length; r++) {
            const targetIdx = row - 1 + r;
            while (rows.length <= targetIdx) rows.push([]);
            for (let c = 0; c < values[r].length; c++) {
              rows[targetIdx][col - 1 + c] = values[r][c];
            }
          }
        },
        clearContent() {
          for (let r = 0; r < numRows; r++) {
            const targetIdx = row - 1 + r;
            if (rows[targetIdx]) {
              for (let c = 0; c < numCols; c++) {
                rows[targetIdx][col - 1 + c] = "";
              }
            }
          }
        },
      };
    },
    appendRow(rowValues) {
      rows.push([...rowValues]);
    },
    deleteRow(rowNumber) {
      rows.splice(rowNumber - 1, 1);
    },
    deleteRows(rowNumber, howMany) {
      rows.splice(rowNumber - 1, howMany);
    },
    _rows: rows,
  };
}

const spreadsheet = {
  getSheetByName(name) {
    return sheets[name] || null;
  },
  insertSheet(name) {
    sheets[name] = makeSheet(name);
    return sheets[name];
  },
  getUrl() {
    return "https://docs.google.com/spreadsheets/d/staging-sheet";
  },
};

const scriptProperties = {
  INSTALLATION_MODE: "tenant",
  TENANT_ID: "TENANT-STAGING",
  SPREADSHEET_ID: "staging-sheet",
  REPORT_TEMPLATE_ID: "staging-report",
  INSTALLATION_OWNER_EMAIL: "admin@pondok.id",
  SUPPORT_EMAIL: "support@pondok.id",
};

let uuidCounter = 0;
const context = {
  SpreadsheetApp: {
    openById() {
      return spreadsheet;
    },
  },
  PropertiesService: {
    getScriptProperties() {
      return {
        getProperty(k) {
          return scriptProperties[k] || null;
        },
        getProperties() {
          return { ...scriptProperties };
        },
        setProperties(next) {
          Object.assign(scriptProperties, next);
        },
      };
    },
  },
  Utilities: {
    getUuid() {
      uuidCounter += 1;
      return ("00000000" + uuidCounter).slice(-8) + "-1234-1234-1234-1234567890ab";
    },
    base64Decode(b64) {
      return Buffer.from(b64, "base64");
    },
    newBlob(buf) {
      return {
        getDataAsString() {
          return buf.toString("utf8");
        },
      };
    },
    parseCsv(text, delimiter = ",") {
      return text
        .trim()
        .split(/\r?\n/)
        .map((line) => line.split(delimiter));
    },
  },
  requireSessionUser_(user) {
    if (!user || !["Mudir", "Admin"].includes(user.Role)) {
      throw new Error("Akses ditolak.");
    }
    return user;
  },
  AUTH_appendAuditLog_() {},
};

vm.createContext(context);
for (const file of [
  "Config.gs",
  "Database.gs",
  "Setup.gs",
  "Installation.gs",
  "ReleaseManagement.gs",
  "ProductReadiness.gs",
]) {
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
}

const adminUser = { Username: "mudir", Role: "Mudir" };

// 1. Setup product readiness sheets & verify technical columns hidden
const setupRes = context.setupProductReadinessSheets();
assert.strictEqual(setupRes.ok, true);
assert.ok(sheets.SetupImportUsers.hiddenCols.length >= 5);

// 2. Test saveSetupWorkspace (Riwayat Setup & Kontrol Layanan Pondok)
const wsRes = context.saveSetupWorkspace(
  {
    PondokName: "Pondok Pesantren Al-Hikmah",
    OwnerEmail: "admin@alhikmah.sch.id",
    ContactPerson: "Ust. Fauzi",
    ContactPhone: "081299887766",
    City: "Pontianak",
    DatabaseSpreadsheetID: "sheet-alhikmah",
    DeploymentUrl: "https://script.google.com/macros/s/test/exec",
    CurrentStep: "Data",
    Status: "Proses",
    PackageName: "Pro Lengkap",
    ServiceType: "Web App + APK Android",
    ActiveModules: "Tahfidz, Akademik, Raport, Absensi, Wali",
    MaxStudents: "500",
    BillingCycle: "Tahunan",
    PriceAmount: "2500000",
    PaidAmount: "1500000",
    PaymentStatus: "DP / Cicilan",
    PaymentMethod: "Transfer BSI",
    LastPaymentDate: "2026-11-01",
    StartDate: "2026-11-01",
    ExpiryDate: "2027-11-01",
    Notes: "Sedang import data santri",
  },
  adminUser,
);
assert.strictEqual(wsRes.ok, true);
assert.strictEqual(wsRes.data.workspace.PondokName, "Pondok Pesantren Al-Hikmah");
assert.strictEqual(wsRes.data.workspace.PackageName, "Pro Lengkap");
assert.strictEqual(wsRes.data.workspace.ServiceType, "Web App + APK Android");
assert.strictEqual(wsRes.data.workspace.PaymentStatus, "DP / Cicilan");
assert.strictEqual(wsRes.data.workspace.PriceAmount, "2500000");
assert.strictEqual(wsRes.data.workspace.PaidAmount, "1500000");
assert.strictEqual(wsRes.data.workspace.ContactPerson, "Ust. Fauzi");

// 2b. Test saveSetupProgress, error recording, resumeSetupWorkspace, and deleteSetupWorkspace
const wsSecond = context.saveSetupWorkspace(
  {
    PondokName: "Pondok Pesantren Darussalam",
    City: "Kubu Raya",
    CurrentStep: "Jadwal",
    Status: "Terkendala",
    LastError: "Sheet jadwal belum sesuai format",
  },
  adminUser,
);
assert.strictEqual(wsSecond.ok, true);
const secondId = wsSecond.data.workspace.WorkspaceID;

const resumeRes = context.resumeSetupWorkspace({ WorkspaceID: wsRes.data.workspace.WorkspaceID }, adminUser);
assert.strictEqual(resumeRes.ok, true);
assert.strictEqual(resumeRes.data.savedWizardStep, "data");
assert.strictEqual(resumeRes.data.activeWorkspaceId, wsRes.data.workspace.WorkspaceID);

const progressRes = context.saveSetupProgress(
  {
    WorkspaceID: wsRes.data.workspace.WorkspaceID,
    CurrentStep: "akademik",
    Status: "Proses",
    clearError: true,
  },
  adminUser,
);
assert.strictEqual(progressRes.ok, true);
assert.strictEqual(progressRes.data.workspace.CurrentStep, "Akademik");
assert.strictEqual(progressRes.data.savedWizardStep, "akademik");

const delRes = context.deleteSetupWorkspace({ WorkspaceID: secondId }, adminUser);
assert.strictEqual(delRes.ok, true);
assert.strictEqual(delRes.data.workspaces.length, 1);
assert.strictEqual(delRes.data.workspaces[0].WorkspaceID, wsRes.data.workspace.WorkspaceID);

// 2c. Test getProductReadiness ensures workspaces is never empty and activeWorkspace is always bound
const readinessRes = context.getProductReadiness(adminUser);
assert.strictEqual(readinessRes.ok, true);
assert.ok(readinessRes.data.workspaces.length >= 1);
assert.ok(readinessRes.data.activeWorkspace);
assert.strictEqual(readinessRes.data.activeWorkspaceId, readinessRes.data.activeWorkspace.WorkspaceID);

// 3. Test uploadTenantLogo validation & storage
const badLogo = context.uploadTenantLogo({ dataUrl: "https://invalid" }, adminUser);
assert.strictEqual(badLogo.ok, false);
const validLogo = context.uploadTenantLogo(
  { dataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=" },
  adminUser,
);
assert.strictEqual(validLogo.ok, true);

// 4. Test seedSetupDummyData idempotency (running twice does not duplicate users)
context.seedSetupDummyData(adminUser);
context.seedSetupDummyData(adminUser);
const previewDummy = context.previewSetupWizardImports(adminUser);
assert.strictEqual(previewDummy.ok, true);
assert.strictEqual(previewDummy.data.totals.students, 2);
assert.strictEqual(previewDummy.data.totals.users, 4);
assert.strictEqual(previewDummy.data.totals.schedules, 2);

// 5. Test CSV import with blank trailing rows and Salt+PasswordHash support
const csvUsers = [
  "Nama Lengkap,Username,Salt,PasswordHash,Peran,Status",
  "Ustadz Hash,ustadz_hash,SALT123,HASH456,Guru,Active",
  ",,,,,",
].join("\n");
const csvRes = context.importSetupCsv(
  {
    kind: "users",
    fileName: "users.csv",
    contentBase64: Buffer.from(csvUsers, "utf8").toString("base64"),
  },
  adminUser,
);
assert.strictEqual(csvRes.ok, true);
assert.strictEqual(csvRes.data.rows, 1);

const previewAfterCsv = context.previewSetupWizardImports(adminUser);
assert.strictEqual(previewAfterCsv.ok, true);
assert.strictEqual(previewAfterCsv.data.users.items.length, 1);
assert.strictEqual(previewAfterCsv.data.users.items[0].payload.Role, "Ustadz");
assert.strictEqual(previewAfterCsv.data.users.items[0].payload.Salt, "SALT123");

// 6. Test PRODUCT_buildWizardStatus_ profile inference and autoCompleteSetupPrerequisites
const wizardStatusBefore = context.PRODUCT_buildWizardStatus_();
const profileCheck = wizardStatusBefore.checks.find((c) => c.id === "profile");
assert.strictEqual(profileCheck.ok, true);
assert.ok(profileCheck.detail.includes("TA"));

const autoRes = context.autoCompleteSetupPrerequisites(adminUser);
assert.strictEqual(autoRes.ok, true);
assert.ok(autoRes.data.wizardStatus.checks.find((c) => c.id === "profile").ok);

// 7. Test applySmartSchedules (smart schedule import with auto Ustadz creation)
const smartRes = context.applySmartSchedules(
  {
    schedules: [
      {
        DayOfWeek: "Senin",
        StartTime: "07:30",
        EndTime: "08:30",
        SubjectOrActivityName: "Tahfidz Juz 30",
        ClassOrGroupName: "1 Wustha",
        TeacherName: "Ust. Zulkifli",
        Type: "Hafalan",
      },
      {
        DayOfWeek: "Senin",
        StartTime: "08:30",
        EndTime: "09:30",
        SubjectOrActivityName: "Fiqih Safinah",
        ClassOrGroupName: "1 Wustha",
        TeacherName: "Ust. Zulkifli",
        Type: "KBM",
      },
    ],
  },
  adminUser,
);
assert.strictEqual(smartRes.ok, true);
assert.strictEqual(smartRes.data.count, 2);
assert.ok(smartRes.data.ustadzCreated >= 0);
assert.ok(sheets.Schedules._rows.length > 2);

console.log("Product readiness tests OK.");
