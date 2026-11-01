// Public library entry point. The host wrapper supplies tenant context per call.
var SANTRI_CORE_CONTEXT = null;

function runAction(action, args, context) {
  if (!isExternalActionAllowed_(action)) {
    throw new Error("Action tidak diizinkan oleh library inti.");
  }
  const previous = SANTRI_CORE_CONTEXT;
  SANTRI_CORE_CONTEXT = context || {};
  try {
    const handler = globalThis[action];
    if (typeof handler !== "function") {
      throw new Error("Action tidak ditemukan di library inti: " + action);
    }
    const result = handler.apply(null, Array.isArray(args) ? args : []);
    return result && typeof result.ok === "boolean"
      ? result
      : { ok: true, data: result === undefined ? null : result };
  } finally {
    SANTRI_CORE_CONTEXT = previous;
  }
}

function CORE_getContextProperty_(key, fallback) {
  const properties =
    SANTRI_CORE_CONTEXT && SANTRI_CORE_CONTEXT.properties
      ? SANTRI_CORE_CONTEXT.properties
      : {};
  return properties[key] === undefined ? fallback : properties[key];
}

function getInstallationMode_() {
  const mode = String(CORE_getContextProperty_("INSTALLATION_MODE", "tenant"))
    .trim()
    .toLowerCase();
  return ["legacy", "tenant"].includes(mode) ? mode : "tenant";
}

function isTenantInstallation_() {
  return getInstallationMode_() === "tenant";
}

function getConfiguredSpreadsheetId_() {
  const spreadsheetId = String(
    (SANTRI_CORE_CONTEXT && SANTRI_CORE_CONTEXT.spreadsheetId) || "",
  ).trim();
  if (!spreadsheetId) {
    throw new Error("Spreadsheet pondok belum dikirim oleh wrapper.");
  }
  return spreadsheetId;
}

function getConfiguredReportTemplateId_() {
  const templateId = String(
    (SANTRI_CORE_CONTEXT && SANTRI_CORE_CONTEXT.reportTemplateId) || "",
  ).trim();
  if (!templateId) {
    throw new Error("Template raport pondok belum dikonfigurasi.");
  }
  return templateId;
}

function getReportV2Rollout_() {
  const mode = String(CORE_getContextProperty_("REPORT_V2_ROLLOUT", "off"))
    .trim()
    .toLowerCase();
  return {
    mode: ["off", "canary", "on"].includes(mode) ? mode : "off",
    canaryUsers: String(
      CORE_getContextProperty_("REPORT_V2_CANARY_USERS", ""),
    )
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

function PRODUCT_readInstallationManifest_() {
  const mode = getInstallationMode_();
  const spreadsheetId = String(
    (SANTRI_CORE_CONTEXT && SANTRI_CORE_CONTEXT.spreadsheetId) || "",
  ).trim();
  const reportTemplateId = String(
    (SANTRI_CORE_CONTEXT && SANTRI_CORE_CONTEXT.reportTemplateId) || "",
  ).trim();
  const tenantId = String(CORE_getContextProperty_("TENANT_ID", "")).trim();
  const ownerEmail = String(
    CORE_getContextProperty_("INSTALLATION_OWNER_EMAIL", ""),
  ).trim();
  const supportEmail = String(
    CORE_getContextProperty_("SUPPORT_EMAIL", ""),
  ).trim();
  return {
    mode,
    tenantId,
    spreadsheetId,
    reportTemplateId,
    hasSpreadsheetId: !!spreadsheetId,
    hasReportTemplateId: !!reportTemplateId,
    ownerEmail,
    supportEmail,
    ready: mode === "tenant" && !!spreadsheetId && !!reportTemplateId && !!tenantId,
    checks: [],
    note: "Manifest dibaca dari wrapper pondok.",
  };
}

function PRODUCT_readReleaseStatus_() {
  const configuredId = String(CORE_getContextProperty_("CORE_LIBRARY_ID", ""));
  const configuredVersion = String(CORE_getContextProperty_("CORE_LIBRARY_VERSION", ""));
  const configuredChannel = String(CORE_getContextProperty_("CORE_UPDATE_CHANNEL", "stable"));
  const enabled = String(CORE_getContextProperty_("CORE_LIBRARY_ENABLED", "on")) === "on";
  return {
    product: "Santri Analytics",
    wrapperVersion: "host",
    localCoreVersion: "1.0.0",
    sharedCore: {
      configured: !!configuredId,
      libraryId: configuredId,
      version: configuredVersion || "1",
      channel: configuredChannel,
      enabled,
      identifier: "SantriCore",
      updatePolicy: "approval_required",
    },
    updateReady: !!configuredId && enabled,
    note: "Permintaan sedang dijalankan oleh library inti.",
  };
}
