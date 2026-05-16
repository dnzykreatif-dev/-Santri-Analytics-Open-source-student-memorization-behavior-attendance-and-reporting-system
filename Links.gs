function getStudentLinks(studentId) {
  const sheet = getSheet_("HafalanLinks");
  if (!sheet) return { ok: true, data: { links: [] } };

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { ok: true, data: { links: [] } };

  const headers = data[0];
  const links = data
    .slice(1)
    .filter((row) => row[1] === studentId)
    .map((row) => serializeRow(row, headers))
    .sort((a, b) => new Date(b.DateAdded) - new Date(a.DateAdded));

  return { ok: true, data: { links } };
}

function addHafalanLink(data) {
  const sheet = getSheet_("HafalanLinks");

  if (!data || !data.StudentID || !data.URL) {
    return { ok: false, message: "Data link tidak lengkap." };
  }

  sheet.appendRow([
    "LNK" + Date.now(),
    data.StudentID,
    new Date().toISOString(),
    data.Title || "Link Hafalan",
    data.URL,
    data.Type || "Rekaman",
    data.TeacherID || "System",
  ]);

  return { ok: true, message: "Link berhasil disimpan." };
}

function updateHafalanLink(linkId, data) {
  const row = findRowIndexById_("HafalanLinks", linkId);
  if (row === -1) return { ok: false, message: "Link tidak ditemukan." };

  const sheet = getSheet_("HafalanLinks");
  sheet.getRange(row, 4, 1, 3).setValues([[data.Title, data.URL, data.Type]]);

  return { ok: true, message: "Link berhasil diupdate." };
}

function deleteHafalanLink(linkId) {
  const row = findRowIndexById_("HafalanLinks", linkId);
  if (row === -1) return { ok: false, message: "Link tidak ditemukan." };

  const sheet = getSheet_("HafalanLinks");
  sheet.deleteRow(row);
  return { ok: true, message: "Link berhasil dihapus." };
}
