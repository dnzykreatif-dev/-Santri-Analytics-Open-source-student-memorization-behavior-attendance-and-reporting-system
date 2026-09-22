const SPREADSHEET_ID = "1yF-V02aCl7CFBjcW76TM7pKVHbPPVLQj0nRjTSB-fz0";

// ID File Google Docs yang digunakan sebagai template laporan
// Buat file Google Docs, isi dengan placeholder seperti {{Nama}}, {{Kelas}}, dll
// Lalu copy ID dari URL dan paste di sini.
const REPORT_TEMPLATE_ID = "14DFlDVlTTDdQXYiRyGMsdDP5-7qc4YRArzxnVaR1fXc";

function getConfiguredSpreadsheetId_() {
  return (
    PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID") ||
    SPREADSHEET_ID
  );
}

function getConfiguredReportTemplateId_() {
  return (
    PropertiesService.getScriptProperties().getProperty("REPORT_TEMPLATE_ID") ||
    REPORT_TEMPLATE_ID
  );
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
