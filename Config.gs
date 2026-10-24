const SPREADSHEET_ID = "1yF-V02aCl7CFBjcW76TM7pKVHbPPVLQj0nRjTSB-fz0";

// ID File Google Docs yang digunakan sebagai template laporan
// Buat file Google Docs, isi dengan placeholder seperti {{Nama}}, {{Kelas}}, dll
// Lalu copy ID dari URL dan paste di sini.
const REPORT_TEMPLATE_ID = "14DFlDVlTTDdQXYiRyGMsdDP5-7qc4YRArzxnVaR1fXc";

function getInstallationMode_() {
  const mode = String(
    PropertiesService.getScriptProperties().getProperty("INSTALLATION_MODE") || "legacy",
  )
    .trim()
    .toLowerCase();
  return ["legacy", "tenant"].includes(mode) ? mode : "legacy";
}

// Embedded master data is a demo/migration aid only. A tenant installation
// must start from its own spreadsheet and manage its own operational rows.
function isTenantInstallation_() {
  return getInstallationMode_() === "tenant";
}

function getConfiguredSpreadsheetId_() {
  const configured = String(
    PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID") || "",
  ).trim();
  if (configured) return configured;
  if (getInstallationMode_() === "tenant") {
    throw new Error(
      "Instalasi pondok belum dikonfigurasi. Isi Script Property SPREADSHEET_ID terlebih dahulu.",
    );
  }
  return SPREADSHEET_ID;
}

function getConfiguredReportTemplateId_() {
  const configured = String(
    PropertiesService.getScriptProperties().getProperty("REPORT_TEMPLATE_ID") || "",
  ).trim();
  if (configured) return configured;
  if (getInstallationMode_() === "tenant") {
    throw new Error(
      "Template raport belum dikonfigurasi. Isi Script Property REPORT_TEMPLATE_ID terlebih dahulu.",
    );
  }
  return REPORT_TEMPLATE_ID;
}

function getReportV2Rollout_() {
  const properties = PropertiesService.getScriptProperties();
  const mode = String(properties.getProperty("REPORT_V2_ROLLOUT") || "off")
    .trim()
    .toLowerCase();
  return {
    mode: ["off", "canary", "on"].includes(mode) ? mode : "off",
    canaryUsers: String(properties.getProperty("REPORT_V2_CANARY_USERS") || "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  };
}

function isReportV2EnabledFor_(currentUser) {
  const rollout = getReportV2Rollout_();
  if (rollout.mode === "on") return true;
  if (rollout.mode === "off") return false;

  const role = String((currentUser && currentUser.Role) || "").trim();
  if (["Mudir", "Admin"].includes(role)) return true;
  const username = String((currentUser && currentUser.Username) || "")
    .trim()
    .toLowerCase();
  return !!username && rollout.canaryUsers.includes(username);
}
