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
