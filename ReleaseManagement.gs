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

