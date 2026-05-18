// ========== SECTION: SETTINGS SERVICE ==========

const SETTINGS_SHEET_NAME = "SETTINGS";
const SETTINGS_HEADERS = ["Key", "Value"];

const DEFAULT_APP_SETTINGS = {
  PONDOK_NAME: "Pondok Pesantren Raudhatul Ulum",
  PONDOK_LOGO_URL: "",
  APP_NAME: "Santri Analytics",
  THEME_COLOR: "emerald",
  PONDOK_ADDRESS:
    "Jl. Raya Contoh No. 123, Desa Contoh, Kec. Contoh, Kab. Contoh, Prov. Contoh",
  ADMIN_WHATSAPP: "+6281234567890",
  ACADEMIC_YEAR: "2025/2026",
  MUDIR_NAME: "Ustadz H. Abdullah",
  FEATURE_LIVE_HAFALAN_ENABLED: true,
  FEATURE_RAPORT_ENABLED: true,
  FEATURE_RANKING_ENABLED: true,
  FEATURE_PERILAKU_ENABLED: true,
  HEADER_BANNER_URL: "",
};

function getSettingsSheet_() {
  return SpreadsheetService.getOrCreateSheet(
    SETTINGS_SHEET_NAME,
    SETTINGS_HEADERS,
  );
}

function R(ok, message, data, meta) {
  return { ok, message, data, meta };
}

// Function to get all settings
function getAppSettings() {
  try {
    const sheet = getSettingsSheet_();
    const data = SpreadsheetService.sheetToObjects(sheet);

    const settings = {};
    data.forEach((row) => {
      settings[row.Key] = row.Value;
    });

    // Merge with defaults to ensure all keys are present
    const mergedSettings = { ...DEFAULT_APP_SETTINGS, ...settings };

    return R(true, "App settings retrieved successfully", mergedSettings);
  } catch (err) {
    console.error("Error in getAppSettings:", err);
    return R(false, "Failed to retrieve app settings: " + err.message);
  }
}

// Function to update multiple settings at once
function updateAppSettings(newSettings) {
  try {
    const sheet = getSettingsSheet_();
    const existingData = SpreadsheetService.sheetToObjects(sheet);
    const updatedKeys = Object.keys(newSettings);

    const dataToUpdate = [];

    // Update existing settings and add new ones
    updatedKeys.forEach((newKey) => {
      const existingRowIndex = existingData.findIndex(
        (row) => row.Key === newKey,
      );
      if (existingRowIndex > -1) {
        existingData[existingRowIndex].Value = newSettings[newKey];
      } else {
        existingData.push({ Key: newKey, Value: newSettings[newKey] });
      }
    });

    // Clear existing sheet data and write back the updated data
    sheet.clearContents();
    sheet
      .getRange(1, 1, 1, SETTINGS_HEADERS.length)
      .setValues([SETTINGS_HEADERS]);

    const rows = existingData.map((obj) =>
      SETTINGS_HEADERS.map((header) => obj[header]),
    );
    if (rows.length > 0) {
      sheet
        .getRange(2, 1, rows.length, SETTINGS_HEADERS.length)
        .setValues(rows);
    }

    return R(true, "App settings updated successfully", newSettings);
  } catch (err) {
    console.error("Error in updateAppSettings:", err);
    return R(false, "Failed to update app settings: " + err.message);
  }
}

// Function to handle file uploads for logo/banner
function uploadSettingFile(fileData, fileType) {
  try {
    if (!fileData || !fileType) {
      throw new Error("File data and type are required.");
    }

    const blob = Utilities.newBlob(
      Utilities.base64Decode(fileData.base64),
      fileData.mimeType,
      fileData.fileName,
    );
    const driveFolderId = getOrCreateDriveFolder_("SantriAnalytics_Settings");
    const file = DriveApp.getFolderById(driveFolderId).createFile(blob);
    const fileUrl = file.getUrl();

    // Update settings with the new file URL
    const updatePayload = {};
    if (fileType === "PONDOK_LOGO") {
      updatePayload.PONDOK_LOGO_URL = fileUrl;
    } else if (fileType === "HEADER_BANNER") {
      updatePayload.HEADER_BANNER_URL = fileUrl;
    } else {
      throw new Error("Invalid file type specified.");
    }

    updateAppSettings(updatePayload);

    return R(true, "File uploaded and setting updated successfully", {
      url: fileUrl,
    });
  } catch (err) {
    console.error("Error in uploadSettingFile:", err);
    return R(false, "Failed to upload file: " + err.message);
  }
}

function getOrCreateDriveFolder_(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next().getId();
  } else {
    return DriveApp.createFolder(folderName).getId();
  }
}
