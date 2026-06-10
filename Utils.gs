/**
 * Sync Wali status to all linked Students.
 */
function syncStudentStatus(waliUsername, status) {
  try {
    const sheet = getSheet_("Students");
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const waliCol = headers.indexOf("WaliUsername");
    const statusCol = headers.indexOf("Status");

    if (waliCol === -1) {
      return { ok: false, message: "Kolom WaliUsername tidak ditemukan." };
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
      return { ok: false, message: "Kolom Status tidak dapat dibuat." };
    }

    const cleanUsername = String(waliUsername || "")
      .trim()
      .toLowerCase();
    let syncedCount = 0;
    for (let i = 1; i < currentData.length; i++) {
      const studentWali = String(currentData[i][waliCol] || "")
        .trim()
        .toLowerCase();
      if (studentWali === cleanUsername) {
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

    return {
      ok: true,
      message: "Status tersinkron untuk " + syncedCount + " santri.",
    };
  } catch (e) {
    return { ok: false, message: "Error sync status: " + e.message };
  }
}

function normalizeIncidentPoints_(incidentType, points) {
  const value = Math.abs(Number(points) || 0);
  if (incidentType === "Violation") return -value;
  if (incidentType === "Improvement") return value;
  return Number(points) || 0;
}

function getIncidentPoints_(incident) {
  if (!incident) return 0;
  return normalizeIncidentPoints_(incident.IncidentType, incident.Points);
}

function calculateBehaviorScore_(incidents, untilDate) {
  const cutoff = untilDate ? new Date(untilDate) : null;
  return (incidents || [])
    .filter((incident) => {
      if (!cutoff) return true;
      const incidentDate = new Date(incident.DateOfIncident);
      return !isNaN(incidentDate.getTime()) && incidentDate <= cutoff;
    })
    .sort(
      (a, b) =>
        new Date(a.DateOfIncident).getTime() -
        new Date(b.DateOfIncident).getTime(),
    )
    .reduce((score, incident) => score + getIncidentPoints_(incident), 100);
}
