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
    throw new Error("Masukkan ID atau URL Spreadsheet milik pondok yang valid.");
  }

  const templateId = INSTALL_normalizeDriveId_(payload.templateSpreadsheetId || "");
  if (templateId && spreadsheetId === templateId) {
    throw new Error("Spreadsheet template utama tidak boleh dijadikan database operasional.");
  }

  const existingProps = PropertiesService.getScriptProperties().getProperties();
  const rawReportInput = String(
    payload.reportTemplateId || payload.REPORT_TEMPLATE_ID || existingProps.REPORT_TEMPLATE_ID || "",
  ).trim();
  const reportTemplateId = INSTALL_normalizeDriveId_(rawReportInput);
  if (!reportTemplateId) {
    throw new Error("Masukkan ID atau URL Template Raport milik pondok yang valid.");
  }
  if (typeof DocumentApp !== "undefined" && DocumentApp && typeof DocumentApp.openById === "function") {
    try {
      DocumentApp.openById(reportTemplateId);
    } catch (error) {
      throw new Error("Template Raport tidak dapat dibuka. Pastikan ID benar dan akun pemilik script memiliki akses.");
    }
  }

  let target;
  try {
    target = SpreadsheetApp.openById(spreadsheetId);
  } catch (error) {
    throw new Error("Spreadsheet tujuan tidak dapat dibuka. Pastikan ID benar dan akun pemilik script memiliki akses.");
  }

  const tenantId = String(payload.tenantId || payload.TenantID || "").trim() || INSTALL_makeTenantId_(spreadsheetId);
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{2,63}$/.test(tenantId)) {
    throw new Error("TenantID hanya boleh berisi huruf, angka, garis bawah, atau tanda hubung.");
  }
  const ownerEmail = String(
    payload.ownerEmail ||
      payload.installationOwnerEmail ||
      (payload.profile && payload.profile.ContactEmail) ||
      existingProps.INSTALLATION_OWNER_EMAIL ||
      "",
  ).trim();
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

  const capturedState = INSTALL_captureCurrentAdminAndSetupState_(sessionUser, currentUser);

  const properties = PropertiesService.getScriptProperties();
  properties.setProperties(
    {
      INSTALLATION_MODE: "tenant",
      SPREADSHEET_ID: spreadsheetId,
      TENANT_ID: tenantId,
      INSTALLATION_OWNER_EMAIL: ownerEmail,
      SUPPORT_EMAIL: supportEmail,
      REPORT_TEMPLATE_ID: reportTemplateId,
      REPORT_V2_ROLLOUT: existingProps.REPORT_V2_ROLLOUT || "on",
    },
    false,
  );

  INSTALL_initializeTargetSpreadsheetState_(target, sessionUser, currentUser, capturedState, payload, {
    spreadsheetId,
    reportTemplateId,
    tenantId,
    ownerEmail,
    supportEmail,
  });

  AUTH_appendAuditLog_("UPDATE", "Installation", tenantId, sessionUser, {
    action: "bind_tenant_spreadsheet",
    spreadsheetId,
    reportTemplateId,
    ownerEmail,
  });
  return {
    ok: true,
    message: "Identitas & Spreadsheet pondok berhasil dihubungkan dalam satu langkah.",
    data: PRODUCT_readInstallationManifest_(),
  };
}

function INSTALL_captureCurrentAdminAndSetupState_(sessionUser, currentUser) {
  const state = {
    userRow: null,
    userHeaders: [],
    sessionRows: [],
    sessionHeaders: [],
    workspaces: [],
    profile: {},
  };
  try {
    const usersSheet = getSheet_("Users");
    if (usersSheet && usersSheet.getLastRow() > 1) {
      const data = usersSheet.getDataRange().getValues();
      state.userHeaders = data[0].map((h) => String(h || "").trim());
      const uIdx = state.userHeaders.indexOf("Username");
      const targetUsername = String((sessionUser && sessionUser.Username) || "").trim().toLowerCase();
      if (uIdx >= 0 && targetUsername) {
        const found = data.slice(1).find((r) => String(r[uIdx] || "").trim().toLowerCase() === targetUsername);
        if (found) state.userRow = found;
      }
    }
  } catch (e) {}

  try {
    const sessSheet = getSheet_("UserSessions");
    if (sessSheet && sessSheet.getLastRow() > 1) {
      const data = sessSheet.getDataRange().getValues();
      state.sessionHeaders = data[0].map((h) => String(h || "").trim());
      const uIdx = state.sessionHeaders.indexOf("Username");
      const targetUsername = String((sessionUser && sessionUser.Username) || "").trim().toLowerCase();
      if (uIdx >= 0 && targetUsername) {
        state.sessionRows = data
          .slice(1)
          .filter((r) => String(r[uIdx] || "").trim().toLowerCase() === targetUsername);
      }
    }
  } catch (e) {}

  try {
    if (typeof PRODUCT_readRows_ === "function") {
      state.workspaces = PRODUCT_readRows_("SetupWorkspaces") || [];
    }
    if (typeof PRODUCT_readKeyValueSheet_ === "function") {
      state.profile = PRODUCT_readKeyValueSheet_("TenantProfile", "ProfileKey", "ProfileValue") || {};
    }
  } catch (e) {}

  return state;
}

function INSTALL_initializeTargetSpreadsheetState_(
  target,
  sessionUser,
  currentUser,
  capturedState,
  payload,
  binding
) {
  try {
    if (typeof setupDatabase === "function") {
      setupDatabase();
    }
    if (typeof setupProductReadinessSheets === "function") {
      setupProductReadinessSheets();
    }
  } catch (e) {}

  try {
    if (capturedState && capturedState.userRow) {
      const usersSheet = target.getSheetByName("Users");
      if (usersSheet) {
        const values = usersSheet.getDataRange().getValues();
        const headers = values[0].map((h) => String(h || "").trim());
        const uIdx = headers.indexOf("Username");
        const targetUsername = String((sessionUser && sessionUser.Username) || "").trim().toLowerCase();
        const exists =
          uIdx >= 0 &&
          values.slice(1).some((r) => String(r[uIdx] || "").trim().toLowerCase() === targetUsername);
        if (!exists) {
          const mappedRow = headers.map((h) => {
            const srcIdx = capturedState.userHeaders.indexOf(h);
            return srcIdx >= 0 ? capturedState.userRow[srcIdx] : "";
          });
          usersSheet.appendRow(mappedRow);
        }
      }
    }
  } catch (e) {}

  try {
    if (capturedState && capturedState.sessionRows && capturedState.sessionRows.length) {
      const sessSheet = target.getSheetByName("UserSessions");
      if (sessSheet) {
        const values = sessSheet.getDataRange().getValues();
        const headers = values[0].map((h) => String(h || "").trim());
        const idIdx = headers.indexOf("SessionID");
        const existingIds = new Set(
          values.slice(1).map((r) => String((idIdx >= 0 ? r[idIdx] : r[0]) || "").trim())
        );
        capturedState.sessionRows.forEach((srcRow) => {
          const srcIdIdx = capturedState.sessionHeaders.indexOf("SessionID");
          const sessId = String((srcIdIdx >= 0 ? srcRow[srcIdIdx] : srcRow[0]) || "").trim();
          if (sessId && !existingIds.has(sessId)) {
            const mappedRow = headers.map((h) => {
              const sIdx = capturedState.sessionHeaders.indexOf(h);
              return sIdx >= 0 ? srcRow[sIdx] : "";
            });
            sessSheet.appendRow(mappedRow);
          }
        });
      }
    }
  } catch (e) {}

  try {
    if (typeof PRODUCT_upsertRowsAndUpdate_ === "function" && capturedState && capturedState.workspaces.length) {
      PRODUCT_upsertRowsAndUpdate_(
        "SetupWorkspaces",
        "WorkspaceID",
        capturedState.workspaces,
        (sessionUser && sessionUser.Username) || "system"
      );
    }
  } catch (e) {}

  try {
    const mergedProfile = Object.assign({}, (capturedState && capturedState.profile) || {}, (payload && payload.profile) || {});
    if (binding && binding.ownerEmail && !mergedProfile.ContactEmail) {
      mergedProfile.ContactEmail = binding.ownerEmail;
    }
    if (!mergedProfile.AcademicYear) {
      mergedProfile.AcademicYear = "2026/2027";
    }
    if (!mergedProfile.Semester) {
      mergedProfile.Semester = "Ganjil";
    }
    if (!mergedProfile.PondokName) {
      mergedProfile.PondokName = "Raudhatul Ulum";
    }
    const profileRows = Object.keys(mergedProfile)
      .filter((key) => mergedProfile[key] !== undefined && String(mergedProfile[key]).trim() !== "")
      .map((key) => ({
        ProfileKey: key,
        ProfileValue: mergedProfile[key],
      }));
    if (profileRows.length && typeof PRODUCT_upsertKeyValueRows_ === "function") {
      PRODUCT_upsertKeyValueRows_(
        "TenantProfile",
        "ProfileKey",
        "ProfileValue",
        profileRows,
        (sessionUser && sessionUser.Username) || "system"
      );
    }
    if (typeof PRODUCT_syncActiveWorkspaceProgress_ === "function") {
      PRODUCT_syncActiveWorkspaceProgress_(sessionUser, {
        PondokName: mergedProfile.PondokName,
        OwnerEmail: (binding && binding.ownerEmail) || mergedProfile.ContactEmail,
        ContactPhone: mergedProfile.ContactPhone,
        City: mergedProfile.Address,
        DatabaseSpreadsheetID: binding && binding.spreadsheetId,
        ReportTemplateID: binding && binding.reportTemplateId,
        TenantID: binding && binding.tenantId,
        CurrentStep: "paket",
        Status: "Proses",
        clearError: true,
      });
    }
  } catch (e) {}
}

function INSTALL_normalizeDriveId_(value) {
  const text = String(value || "")
    .trim()
    .replace(/\u00d7/g, "x")
    .replace(/[\u200B-\u200D\uFEFF]/g, "");
  if (!text) return "";
  const match = text.match(/\/(?:spreadsheets|document|file|folders)\/(?:u\/\d+\/)?d\/([A-Za-z0-9_-]+)/);
  if (match) return match[1];
  const queryMatch = text.match(/[?&]id=([A-Za-z0-9_-]+)/);
  if (queryMatch) return queryMatch[1];
  return /^[A-Za-z0-9_-]{20,}$/.test(text) ? text : "";
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
      spreadsheetId,
      reportTemplateId,
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

