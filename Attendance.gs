function logAttendance(data) {
  const sheet = getSheet_("Attendance");

  if (!data || !data.StudentID) {
    return { ok: false, message: "Santri belum dipilih." };
  }

  sheet.appendRow([
    "ATT" + Date.now(),
    data.StudentID,
    data.DateLogged || new Date().toISOString(),
    data.Type, // Sakit, Izin, Alpha
    data.Notes || "",
    data.TeacherID || "System",
  ]);

  return { ok: true, message: "Kehadiran berhasil dicatat." };
}

function getStudentAttendance(studentId) {
  const data = getSheet_("Attendance").getDataRange().getValues();
  if (data.length <= 1) return { ok: true, data: { attendance: [] } };

  const headers = data[0];
  const logs = data
    .slice(1)
    .filter((row) => row[1] === studentId)
    .map((row) => serializeRow(row, headers))
    .sort((a, b) => new Date(b.DateLogged) - new Date(a.DateLogged));

  return { ok: true, data: { attendance: logs } };
}
