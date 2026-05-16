function logMemorization(data) {
  const sheet = getSheet_("MemorizationLogs");

  if (!data || !data.StudentID || !data.Surah) {
    return {
      ok: false,
      message: "Data tidak lengkap. Pastikan Santri dan Surah dipilih.",
    };
  }
  if (parseInt(data.AyahEnd) < parseInt(data.AyahStart)) {
    return {
      ok: false,
      message: "Ayah Akhir tidak boleh lebih kecil dari Awal",
    };
  }

  const logDate = data.CustomDate
    ? new Date(data.CustomDate + "T" + (data.CustomTime || "00:00"))
    : new Date();

  sheet.appendRow([
    "LOG" + Date.now(),
    data.StudentID,
    logDate.toISOString(),
    data.Surah,
    data.AyahStart,
    data.AyahEnd,
    data.Juz,
    data.Category,
    data.Status,
    "Mudir",
    data.Quality || "Lancar",
  ]);
  return { ok: true };
}

function updateMemorization(logId, data) {
  const sheet = getSheet_("MemorizationLogs");
  const row = findRowIndexById_("MemorizationLogs", logId);

  if (row === -1) {
    return { ok: false, message: "Data hafalan tidak ditemukan." };
  }

  // Update kolom 4 sampai 11 (Surah s/d Quality)
  // Index kolom: 4=Surah, 5=AyahStart, 6=AyahEnd, 7=Juz, 8=Category, 9=Status, 11=Quality
  // Kolom 3 (Date) juga bisa diupdate jika perlu

  const rowData = [
    data.Surah,
    data.AyahStart,
    data.AyahEnd,
    data.Juz,
    data.Category,
    data.Status,
    "Mudir", // TeacherID
    data.Quality || "Lancar",
  ];

  // Update range mulai kolom 4 (Surah) sampai kolom 11 (Quality)
  sheet.getRange(row, 4, 1, 8).setValues([rowData]);

  return { ok: true, message: "Hafalan berhasil diperbarui." };
}

function deleteMemorization(logId) {
  const sheet = getSheet_("MemorizationLogs");
  const row = findRowIndexById_("MemorizationLogs", logId);

  if (row === -1) {
    return { ok: false, message: "Data hafalan tidak ditemukan." };
  }

  sheet.deleteRow(row);
  return { ok: true, message: "Hafalan berhasil dihapus." };
}

function getMemorizationHistory(studentId) {
  const data = getSheet_("MemorizationLogs").getDataRange().getValues();
  if (data.length <= 1) return { ok: true, data: { history: [] } };

  const headers = data[0];
  const logs = data
    .slice(1)
    .filter((row) => row[1] === studentId)
    .map((row) => serializeRow(row, headers))
    .sort((a, b) => new Date(b.DateLogged) - new Date(a.DateLogged));

  return { ok: true, data: { history: logs } };
}
