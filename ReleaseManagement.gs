const SANTRI_RELEASE = {
  product: "Santri Analytics",
  wrapperVersion: "1.0.0",
  coreVersion: "1.0.0",
  channel: "stable",
  updatePolicy: "approval_required",
};

/**
 * Returns the release contract for this pondok installation.
 * The local wrapper stays usable while the shared core is introduced in stages.
 */
function getAppReleaseStatus(currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  const data = PRODUCT_readReleaseStatus_();
  data.checkedBy = sessionUser.Username;
  return { ok: true, data };
}

/**
 * Menyimpan konfigurasi library inti untuk instalasi pondok.
 * Pemasangan dependency library tetap dilakukan sekali dari editor Apps Script;
 * fungsi ini hanya mengatur versi yang dipakai oleh wrapper pondok.
 */
function saveSharedCoreSettings(settings, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin"],
  });
  settings = settings || {};
  const libraryId = String(settings.CORE_LIBRARY_ID || "").trim();
  const version = String(settings.CORE_LIBRARY_VERSION || "").trim();
  const channel = String(settings.CORE_UPDATE_CHANNEL || "stable").trim().toLowerCase();
  const enabled = String(settings.CORE_LIBRARY_ENABLED || "off").trim().toLowerCase();
  const identifier = String(settings.CORE_LIBRARY_IDENTIFIER || "SantriCore").trim();

  if (enabled === "on" && (!libraryId || !version)) {
    throw new Error("Isi ID dan versi library sebelum mengaktifkan inti bersama.");
  }
  if (libraryId && !/^[A-Za-z0-9_-]{20,}$/.test(libraryId)) {
    throw new Error("ID library belum valid.");
  }
  if (version && !/^\d+$/.test(version)) {
    throw new Error("Versi library harus berupa nomor versi Apps Script, contoh 1.");
  }
  if (!["stable", "canary", "test"].includes(channel)) {
    throw new Error("Saluran update harus stable, canary, atau test.");
  }
  if (!["on", "off"].includes(enabled)) {
    throw new Error("Status library harus on atau off.");
  }
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(identifier)) {
    throw new Error("Nama pengenal library belum valid.");
  }

  PropertiesService.getScriptProperties().setProperties({
    CORE_LIBRARY_ID: libraryId,
    CORE_LIBRARY_VERSION: version,
    CORE_UPDATE_CHANNEL: channel,
    CORE_LIBRARY_ENABLED: enabled,
    CORE_LIBRARY_IDENTIFIER: identifier,
  }, false);
  AUTH_appendAuditLog_("UPDATE", "Release", libraryId || "local", sessionUser, {
    libraryId,
    version,
    channel,
    enabled,
  });
  return {
    ok: true,
    message: enabled === "on" ? "Library inti diaktifkan." : "Pengaturan library tersimpan.",
    data: PRODUCT_readReleaseStatus_(),
  };
}

function PRODUCT_readReleaseStatus_() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const configuredCoreVersion = String(properties.CORE_LIBRARY_VERSION || "").trim();
  const configuredCoreId = String(properties.CORE_LIBRARY_ID || "").trim();
  const libraryEnabled =
    String(properties.CORE_LIBRARY_ENABLED || "off").trim().toLowerCase() === "on";
  const libraryIdentifier = String(
    properties.CORE_LIBRARY_IDENTIFIER || "SantriCore",
  ).trim();
  const configuredChannel = String(
    properties.CORE_UPDATE_CHANNEL || SANTRI_RELEASE.channel,
  )
    .trim()
    .toLowerCase();
  const channel = ["stable", "canary", "test"].includes(configuredChannel)
    ? configuredChannel
    : SANTRI_RELEASE.channel;

  return {
    product: SANTRI_RELEASE.product,
    wrapperVersion: SANTRI_RELEASE.wrapperVersion,
    localCoreVersion: SANTRI_RELEASE.coreVersion,
    sharedCore: {
      configured: !!configuredCoreId,
      libraryId: configuredCoreId,
      version: configuredCoreVersion || SANTRI_RELEASE.coreVersion,
      channel,
      enabled: libraryEnabled,
      identifier: libraryIdentifier,
      updatePolicy: SANTRI_RELEASE.updatePolicy,
    },
    updateReady: !!configuredCoreId && !!configuredCoreVersion && libraryEnabled,
    note: libraryEnabled
      ? "Inti bersama aktif. Update tetap menunggu persetujuan pondok."
      : configuredCoreId
      ? "Inti bersama sudah dicatat. Update tetap menunggu persetujuan pondok."
      : "Instalasi masih memakai inti lokal. Library bersama belum dipasang.",
  };
}

