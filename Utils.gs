// ========== SECTION: SYNC LOGIC ==========

/**
 * Sync status for students linked to a specific user (Wali)
 */
// ========== SECTION: STATUS SYNC ==========

/**
 * Sync Wali status to all linked Students.
 * When a Wali's status changes to inactive, all their linked students
 * should also be marked as inactive in the Students sheet.
 *
 * The Students sheet has a "Status" column (index 7) that stores the student status.
 * This function updates that column based on the Wali's status.
 *
 * @param {string} waliUsername - The username of the Wali
 * @param {string} status - The new status (e.g., "Active" or "Inactive")
 */
function syncStudentStatus(waliUsername, status) {
  try {
    const sheet = getSheet_("Students");
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const waliCol = headers.indexOf("WaliUsername");
    const statusCol = headers.indexOf("Status");

    if (waliCol === -1) {
      console.warn("WaliUsername column not found in Students sheet");
      return;
    }

    // If Status column doesn't exist, add it
    if (statusCol === -1) {
      // Add "Status" column header at the end
      sheet.getRange(1, headers.length + 1).setValue("Status");
      // Note: headers array is a copy, so we need to update statusCol
    }

    // Re-fetch headers to get the correct column index after potential addition
    const currentData = sheet.getDataRange().getValues();
    const currentHeaders = currentData[0];
    const actualStatusCol = currentHeaders.indexOf("Status");

    if (actualStatusCol === -1) {
      console.warn("Status column could not be created in Students sheet");
      return;
    }

    let syncedCount = 0;
    for (let i = 1; i < currentData.length; i++) {
      if (String(currentData[i][waliCol] || "").trim() === waliUsername) {
        // Normalize status: "inactive" -> "Inactive", "active" -> "Active"
        let normalizedStatus = "Active";
        if (status && String(status).toLowerCase() === "inactive") {
          normalizedStatus = "Inactive";
        }

        // Update the Status column in the Students sheet
        sheet.getRange(i + 1, actualStatusCol + 1).setValue(normalizedStatus);
        syncedCount++;
      }
    }

    console.log(
      "Synced status for " + syncedCount + " students of Wali: " + waliUsername,
    );
  } catch (e) {
    console.error("Sync status error: " + e.message);
  }
}
