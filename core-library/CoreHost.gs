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

function PRODUCT_readInstallationManifest_() {
  return {
    mode: "tenant",
    tenantId: String(CORE_getContextProperty_("TENANT_ID", "")),
    hasSpreadsheetId: !!getConfiguredSpreadsheetId_(),
    hasReportTemplateId: !!String(
      (SANTRI_CORE_CONTEXT && SANTRI_CORE_CONTEXT.reportTemplateId) || "",
    ).trim(),
    ready: !!getConfiguredSpreadsheetId_(),
    checks: [],
    note: "Manifest dibaca dari wrapper pondok.",
  };
}

function PRODUCT_readReleaseStatus_() {
  return {
    product: "Santri Analytics",
    wrapperVersion: "host",
    localCoreVersion: "1.0.0",
    sharedCore: {
      configured: true,
      version: "1.0.0",
      channel: "stable",
      enabled: true,
      identifier: "SantriCore",
      updatePolicy: "approval_required",
    },
    updateReady: true,
    note: "Permintaan sedang dijalankan oleh library inti.",
  };
}
