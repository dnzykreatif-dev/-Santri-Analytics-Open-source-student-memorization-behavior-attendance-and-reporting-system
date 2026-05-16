function getDailyStats(studentId) {
  const incidents = normalizeSheetData(
    getSheet_("Incidents").getDataRange().getValues(),
  );
  const today = new Date().toISOString().split("T")[0];
  const todayIncidents = incidents.filter(
    (i) => i.StudentID === studentId && i.DateOfIncident.startsWith(today),
  );

  return {
    violations: todayIncidents.filter((i) => i.IncidentType === "Violation")
      .length,
    improvements: todayIncidents.filter((i) => i.IncidentType === "Improvement")
      .length,
  };
}

function logIncident(data, user) {
  const incidentSheet = getSheet_("Incidents");
  const studentSheet = getSheet_("Students");

  if (!data || !data.StudentID) {
    return { ok: false, message: "Data santri tidak lengkap." };
  }

  if (data.IncidentType === "Improvement") {
    const stats = getDailyStats(data.StudentID);
    const hasViolation = stats.violations > 0;
    if (hasViolation && stats.improvements >= 1)
      return {
        ok: false,
        message: "Hari ini ada pelanggaran, maksimal prestasi hanya 1.",
      };
    if (!hasViolation && stats.improvements >= 2)
      return { ok: false, message: "Maksimal 2 prestasi per hari." };
  }

  incidentSheet.appendRow([
    "INC" + Date.now(),
    data.StudentID,
    data.DateOfIncident,
    data.IncidentType,
    data.Description,
    data.Severity,
    data.Points,
    user ? user.Username : "System",
    "",
    data.Category || "Umum",
  ]);

  const students = normalizeSheetData(studentSheet.getDataRange().getValues());
  const student = students.find((s) => s.StudentID === data.StudentID);

  return {
    ok: true,
    broadcast: {
      parentContact: student ? student.ParentContact : "",
      studentName: student ? student.Name : "Santri",
      type: data.IncidentType,
      desc: data.Description,
      points: data.Points,
    },
  };
}

function updateIncident(incidentId, data, user) {
  const sheet = getSheet_("Incidents");
  const row = findRowIndexById_("Incidents", incidentId);

  if (row === -1) {
    return { ok: false, message: "Data insiden tidak ditemukan." };
  }

  // Kolom: 4=IncidentType, 5=Desc, 6=Severity, 7=Points, 10=Category
  const rowData = [
    data.IncidentType,
    data.Description,
    data.Severity,
    data.Points,
    user ? user.Username : "System", // ReportedBy (update auditor)
    "", // Resolution
    data.Category || "Umum",
  ];

  // Update range mulai kolom 4 sampai 10
  sheet.getRange(row, 4, 1, 7).setValues([rowData]);

  return { ok: true, message: "Insiden berhasil diperbarui." };
}

function deleteIncident(incidentId) {
  const sheet = getSheet_("Incidents");
  const row = findRowIndexById_("Incidents", incidentId);

  if (row === -1) {
    return { ok: false, message: "Data insiden tidak ditemukan." };
  }

  sheet.deleteRow(row);
  return { ok: true, message: "Insiden berhasil dihapus." };
}

function getRecentIncidents() {
  const ss = getSpreadsheet_();
  const incidentsRaw = ss
    .getSheetByName("Incidents")
    .getDataRange()
    .getValues();
  const studentsRaw = ss.getSheetByName("Students").getDataRange().getValues();

  const incidents = normalizeSheetData(incidentsRaw);
  const students = normalizeSheetData(studentsRaw);

  return incidents
    .map((inc) => {
      const student = students.find((s) => s.StudentID === inc.StudentID);
      return {
        ...inc,
        StudentName: student ? student.Name : "Santri Tidak Ditemukan",
      };
    })
    .sort((a, b) => new Date(b.DateOfIncident) - new Date(a.DateOfIncident));
}

function getStudentIncidents(studentId) {
  const data = getSheet_("Incidents").getDataRange().getValues();
  if (data.length <= 1) return { ok: true, data: { incidents: [] } };

  const headers = data[0];
  const incidents = data
    .slice(1)
    .filter((row) => row[1] === studentId)
    .map((row) => serializeRow(row, headers))
    .sort((a, b) => new Date(b.DateOfIncident) - new Date(a.DateOfIncident));

  return { ok: true, data: { incidents } };
}
