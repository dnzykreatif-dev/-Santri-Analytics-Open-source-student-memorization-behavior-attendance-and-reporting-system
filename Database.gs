function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet_(sheetName) {
  return getSpreadsheet_().getSheetByName(sheetName);
}

function serializeRow(row, headers) {
  const obj = {};
  headers.forEach((header, i) => {
    let value = row[i];
    if (value instanceof Date) {
      value = value.toISOString();
    }
    obj[header] = value === undefined ? null : value;
  });
  return obj;
}

function normalizeSheetData(data) {
  if (!data || data.length < 1) return [];
  const headers = data[0];
  const rows = data.slice(1);
  return rows.map((row) => serializeRow(row, headers));
}

function repairMissingIds_(sheet, headers, idHeader, prefix, options = {}) {
  if (!sheet || !headers || !idHeader) return 0;

  const idIndex = headers.indexOf(idHeader);
  if (idIndex === -1) return 0;

  const createdAtIndex = headers.indexOf(options.createdAtHeader || "CreatedAt");
  const statusIndex = headers.indexOf(options.statusHeader || "Status");
  const phoneIndex = headers.indexOf(options.phoneHeader || "Phone");
  const usernameIndex = headers.indexOf(options.usernameHeader || "Username");
  const waliUsernameIndex = headers.indexOf(
    options.waliUsernameHeader || "WaliUsername",
  );
  const roleIndex = headers.indexOf(options.roleHeader || "Role");

  const data = sheet.getDataRange().getValues();
  const now = new Date().toISOString();
  let repairedCount = 0;

  for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
    const row = data[rowIndex];
    const currentId = String(row[idIndex] || "").trim();
    if (!currentId) {
      const generatedId = prefix + Date.now() + rowIndex;
      sheet.getRange(rowIndex + 1, idIndex + 1).setValue(generatedId);
      row[idIndex] = generatedId;
    }

    if (createdAtIndex !== -1 && !String(row[createdAtIndex] || "").trim()) {
      sheet.getRange(rowIndex + 1, createdAtIndex + 1).setValue(now);
      row[createdAtIndex] = now;
    }

    if (statusIndex !== -1 && !String(row[statusIndex] || "").trim()) {
      sheet.getRange(rowIndex + 1, statusIndex + 1).setValue("Active");
      row[statusIndex] = "Active";
    }

    if (
      phoneIndex !== -1 &&
      waliUsernameIndex !== -1 &&
      !String(row[waliUsernameIndex] || "").trim()
    ) {
      const phoneValue = String(row[phoneIndex] || "").trim();
      if (phoneValue) {
        sheet
          .getRange(rowIndex + 1, waliUsernameIndex + 1)
          .setValue(normalizePhoneNumber(phoneValue) || phoneValue);
      }
    }

    if (
      prefix === "USR" &&
      usernameIndex !== -1 &&
      roleIndex !== -1 &&
      !String(row[usernameIndex] || "").trim()
    ) {
      const phoneValue = String(row[phoneIndex] || "").trim();
      const roleValue = String(row[roleIndex] || "").trim();
      if (roleValue === "Wali" && phoneValue) {
        sheet
          .getRange(rowIndex + 1, usernameIndex + 1)
          .setValue(normalizePhoneNumber(phoneValue) || phoneValue);
      }
    }

    repairedCount++;
  }

  return repairedCount;
}
/**
 * Helper: Mencari index baris berdasarkan ID di kolom pertama (ID unik).
 * Mengembalikan -1 jika tidak ditemukan.
 */
function findRowIndexById_(sheetName, recordId) {
  const sheet = getSheet_(sheetName);
  const data = sheet.getDataRange().getValues();

  // ID biasanya di kolom pertama (index 0)
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === recordId) {
      return i + 1; // Return row number (1-based index)
    }
  }
  return -1;
}
function hashPassword(password) {
  if (!password) return "";
  var rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password,
  );
  return rawHash
    .map(function (b) {
      var v = (b < 0 ? b + 256 : b).toString(16);
      return v.length == 1 ? "0" + v : v;
    })
    .join("");
} // Helper database & serialisasi
