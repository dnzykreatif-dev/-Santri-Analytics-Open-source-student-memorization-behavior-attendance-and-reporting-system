/**
 * Configuration checks and one-time binding for one-pondok-one-installation
 * deployments. The binding is deliberately explicit: a copied installation
 * must point to the buyer's own Spreadsheet before it is marked ready.
 */
function getInstallationManifest(currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  const data = PRODUCT_readInstallationManifest_();
  data.checkedBy = sessionUser.Username;
  return { ok: true, data };
}

/**
 * Mengikat salinan aplikasi ke Spreadsheet milik pondok.
 *
 * Fungsi ini hanya boleh dipanggil oleh Mudir/Admin yang sudah login. ID boleh
 * berupa ID Spreadsheet saja atau URL Spreadsheet. Spreadsheet template tidak
 * boleh dipakai sebagai database operasional.
 */
function configureTenantInstallation(payload, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  payload = payload || {};

  const spreadsheetId = INSTALL_normalizeDriveId_(payload.spreadsheetId || payload.SpreadsheetID);
  if (!spreadsheetId) {
    throw new Error("Masukkan ID atau URL Spreadsheet milik pondok.");
  }

  const currentId = String(getConfiguredSpreadsheetId_() || "").trim();
  if (currentId && spreadsheetId === currentId) {
    throw new Error("Spreadsheet tujuan masih sama dengan database saat ini. Gunakan salinan Spreadsheet milik pondok.");
  }

  const templateId = INSTALL_normalizeDriveId_(payload.templateSpreadsheetId || "");
  if (templateId && spreadsheetId === templateId) {
    throw new Error("Spreadsheet template tidak boleh dijadikan database operasional.");
  }
  const reportTemplateId = INSTALL_normalizeDriveId_(payload.reportTemplateId || payload.REPORT_TEMPLATE_ID);
  if (!reportTemplateId) {
    throw new Error("Masukkan ID atau URL Template Raport milik pondok.");
  }
  try {
    DocumentApp.openById(reportTemplateId);
  } catch (error) {
    throw new Error("Template Raport tidak dapat dibuka. Pastikan ID benar dan akun pemilik script memiliki akses.");
  }

  let target;
  try {
    target = SpreadsheetApp.openById(spreadsheetId);
  } catch (error) {
    throw new Error("Spreadsheet tujuan tidak dapat dibuka. Pastikan ID benar dan akun pemilik script memiliki akses.");
  }
  const requiredSheets = ["Users", "Students"];
  const missingSheets = requiredSheets.filter((name) => !target.getSheetByName(name));
  if (missingSheets.length) {
    throw new Error("Spreadsheet tujuan belum berupa salinan template. Sheet yang kurang: " + missingSheets.join(", "));
  }

  const tenantId = String(payload.tenantId || payload.TenantID || "").trim() || INSTALL_makeTenantId_(spreadsheetId);
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{2,63}$/.test(tenantId)) {
    throw new Error("TenantID hanya boleh berisi huruf, angka, garis bawah, atau tanda hubung.");
  }
  const ownerEmail = String(payload.ownerEmail || payload.installationOwnerEmail || "").trim();
  const supportEmail = String(payload.supportEmail || ownerEmail).trim();
  if (!ownerEmail) {
    throw new Error("Email pemilik pondok wajib diisi.");
  }
  if (!/^\S+@\S+\.\S+$/.test(ownerEmail)) {
    throw new Error("Email pemilik instalasi belum valid.");
  }
  if (supportEmail && !/^\S+@\S+\.\S+$/.test(supportEmail)) {
    throw new Error("Email dukungan belum valid.");
  }

  const properties = PropertiesService.getScriptProperties();
  properties.setProperties({
    INSTALLATION_MODE: "tenant",
    SPREADSHEET_ID: spreadsheetId,
    TENANT_ID: tenantId,
    INSTALLATION_OWNER_EMAIL: ownerEmail,
    SUPPORT_EMAIL: supportEmail,
    REPORT_TEMPLATE_ID: reportTemplateId,
  }, false);

  AUTH_appendAuditLog_("UPDATE", "Installation", tenantId, sessionUser, {
    action: "bind_tenant_spreadsheet",
    spreadsheetId,
    ownerEmail,
  });
  return {
    ok: true,
    message: "Aplikasi sudah terhubung ke Spreadsheet pondok.",
    data: PRODUCT_readInstallationManifest_(),
  };
}

function INSTALL_normalizeDriveId_(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const match = text.match(/\/(?:spreadsheets|document|file)\/d\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : (/^[A-Za-z0-9_-]{20,}$/.test(text) ? text : "");
}

function INSTALL_makeTenantId_(spreadsheetId) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, spreadsheetId);
  const hex = digest.map((byte) => (byte + 256) % 256).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return "TENANT-" + hex.slice(0, 12).toUpperCase();
}

function PRODUCT_readInstallationManifest_() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const mode = getInstallationMode_();
  const spreadsheetId = String(properties.SPREADSHEET_ID || "").trim();
  const reportTemplateId = String(properties.REPORT_TEMPLATE_ID || "").trim();
  const tenantId = String(properties.TENANT_ID || "").trim();
  const ownerEmail = String(properties.INSTALLATION_OWNER_EMAIL || "").trim();
  const supportEmail = String(properties.SUPPORT_EMAIL || "").trim();
  const checks = [
    {
      key: "mode",
      label: "Mode instalasi pondok",
      ok: mode === "tenant",
      detail: mode === "tenant" ? "tenant" : "legacy (kompatibilitas lama)",
    },
    {
      key: "tenantId",
      label: "TenantID",
      ok: !!tenantId,
      detail: tenantId || "Belum diisi",
    },
    {
      key: "spreadsheet",
      label: "Spreadsheet milik pondok",
      ok: !!spreadsheetId,
      detail: spreadsheetId ? "Sudah dikonfigurasi" : "Belum diisi",
    },
    {
      key: "reportTemplate",
      label: "Template raport",
      ok: !!reportTemplateId,
      detail: reportTemplateId ? "Sudah dikonfigurasi" : "Belum diisi",
    },
    {
      key: "ownerEmail",
      label: "Email pemilik instalasi",
      ok: !!ownerEmail,
      detail: ownerEmail || "Belum diisi",
    },
    {
      key: "supportEmail",
      label: "Email dukungan",
      ok: !!supportEmail,
      detail: supportEmail || "Belum diisi",
    },
  ];

  return {
      mode,
      tenantId,
      hasSpreadsheetId: !!spreadsheetId,
      hasReportTemplateId: !!reportTemplateId,
      ownerEmail,
      supportEmail,
      ready: checks.every((check) => check.ok),
      checks,
      note:
        mode === "tenant"
          ? "Mode tenant aktif. Aplikasi tidak memakai database fallback lama."
          : "Mode legacy aktif untuk menjaga kompatibilitas aplikasi lama.",
  };
}

