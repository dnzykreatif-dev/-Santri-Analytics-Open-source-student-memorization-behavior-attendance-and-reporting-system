function getStudents(user) {
  const ss = getSpreadsheet_();
  const sheet = getSheet_("Students");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const studentsRaw = data.slice(1);
  let result = [];

  const allIncidents = normalizeSheetData(
    ss.getSheetByName("Incidents").getDataRange().getValues(),
  );

  for (let i = 0; i < studentsRaw.length; i++) {
    const row = studentsRaw[i];
    const studentObj = serializeRow(row, headers);

    // Calculate Score
    const studentIncidents = allIncidents.filter(
      (inc) => inc.StudentID === studentObj.StudentID,
    );
    const totalScore = studentIncidents.reduce(
      (sum, inc) => sum + (Number(inc.Points) || 0),
      100,
    );
    studentObj.TotalScore = totalScore;

    // Set Status Label
    if (totalScore >= 80) {
      studentObj.StatusLabel = "SANTRI UNGGUL";
      studentObj.StatusColor = "bg-green-500 text-white";
    } else if (totalScore >= 50) {
      studentObj.StatusLabel = "SANTRI NORMAL";
      studentObj.StatusColor = "bg-blue-500 text-white";
    } else if (totalScore >= 30) {
      studentObj.StatusLabel = "PERLU PEMBINAAN";
      studentObj.StatusColor = "bg-yellow-500 text-white";
    } else {
      studentObj.StatusLabel = "PEMBINAAN INTENSIF";
      studentObj.StatusColor = "bg-red-600 text-white animate-pulse";
    }

    // Filter by Role
    const userRole = user ? user.Role : "Admin";
    const userName = user ? String(user.Username || "").trim() : "";

    if (userRole === "Wali") {
      const wali = String(studentObj.WaliUsername || "").trim();
      const parentContact = String(studentObj.ParentContact || "").trim();
      if (wali === userName || parentContact === userName) {
        result.push(studentObj);
      }
    } else {
      result.push(studentObj);
    }
  }

  return { ok: true, data: { students: result } };
}

function addStudent(data) {
  const sheet = getSheet_("Students");
  const cleanPhone = String(data.ParentContact || "").trim();

  sheet.appendRow([
    "STU" + Date.now(),
    data.Name,
    data.ClassLevel,
    cleanPhone,
    new Date().toISOString(),
    data.WaliUsername || "",
    "",
  ]);

  if (cleanPhone) {
    registerUser(cleanPhone, "123456", "Wali");
  }

  return {
    ok: true,
    message: "Santri berhasil ditambahkan dan akun wali telah dibuat.",
  };
}

function updateStudentNote(id, note) {
  const sheet = getSheet_("Students");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const studentIDCol = headers.indexOf("StudentID");
  const catatanPembinaanCol = headers.indexOf("CatatanPembinaan");

  if (studentIDCol === -1 || catatanPembinaanCol === -1) {
    return { ok: false, message: "Kolom tidak ditemukan." };
  }

  for (let i = 1; i < data.length; i++) {
    if (data[i][studentIDCol] === id) {
      sheet.getRange(i + 1, catatanPembinaanCol + 1).setValue(note);
      return { ok: true };
    }
  }
  return { ok: false, message: "Santri tidak ditemukan." };
}

function getStudentDetailData(studentId) {
  const memos = normalizeSheetData(
    getSheet_("MemorizationLogs").getDataRange().getValues(),
  )
    .filter((m) => String(m.StudentID) === String(studentId))
    .sort((a, b) => new Date(b.DateLogged) - new Date(a.DateLogged));

  const incidents = normalizeSheetData(
    getSheet_("Incidents").getDataRange().getValues(),
  )
    .filter((i) => String(i.StudentID) === String(studentId))
    .sort((a, b) => new Date(b.DateOfIncident) - new Date(a.DateOfIncident));

  return { ok: true, data: { memos, incidents } };
}

function getStudentAnalytics(studentId) {
  const allMemos = normalizeSheetData(
    getSheet_("MemorizationLogs").getDataRange().getValues(),
  );
  const allIncidents = normalizeSheetData(
    getSheet_("Incidents").getDataRange().getValues(),
  );

  const studentMemos = allMemos.filter((log) => log.StudentID === studentId);
  const studentIncidents = allIncidents.filter(
    (inc) => inc.StudentID === studentId,
  );

  const weeks = 8;
  const labels = [];
  const memoCounts = new Array(weeks).fill(0);
  const incidentPoints = new Array(weeks).fill(0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    weekEnd.setHours(23, 59, 59, 999);

    labels.unshift("W" + (weeks - i));

    studentMemos.forEach((log) => {
      const d = new Date(log.DateLogged);
      if (d >= weekStart && d < weekEnd) memoCounts[weeks - 1 - i]++;
    });

    studentIncidents.forEach((inc) => {
      const d = new Date(inc.DateOfIncident);
      if (d >= weekStart && d < weekEnd)
        incidentPoints[weeks - 1 - i] += Number(inc.Points) || 0;
    });
  }

  return {
    ok: true,
    data: { labels, memos: memoCounts, points: incidentPoints },
  };
}

// ========== SECTION: STUDENT REPORT ==========
function getStudentReportData(studentId) {
  const ss = getSpreadsheet_();

  // 1. Data Profil
  const studentSheet = getSheet_("Students");
  const studentData = studentSheet.getDataRange().getValues();
  const studentHeaders = studentData[0];
  let studentObj = null;
  for (let i = 1; i < studentData.length; i++) {
    if (studentData[i][0] === studentId) {
      studentObj = serializeRow(studentData[i], studentHeaders);
      break;
    }
  }
  if (!studentObj) return { ok: false, message: "Santri tidak ditemukan" };

  // 2. Rekap Hafalan
  const memos = normalizeSheetData(
    getSheet_("MemorizationLogs").getDataRange().getValues(),
  ).filter((m) => m.StudentID === studentId);

  // Hitung total halaman/juz (estimasi sederhana atau bisa dibuat lebih kompleks)
  const totalSetoran = memos.length;

  // Grouping Hafalan per Kategori
  const hafalanKategori = {
    "Setoran Baru": memos.filter((m) => m.Category === "Setoran Baru").length,
    "Muroja'ah": memos.filter((m) => m.Category === "Muroja'ah").length,
    Lainnya: memos.filter(
      (m) => !["Setoran Baru", "Muroja'ah"].includes(m.Category),
    ).length,
  };

  // 3. Rekap Perilaku
  const incidents = normalizeSheetData(
    getSheet_("Incidents").getDataRange().getValues(),
  ).filter((inc) => inc.StudentID === studentId);

  const totalSkor = incidents.reduce(
    (sum, inc) => sum + (Number(inc.Points) || 0),
    100,
  );
  const pelanggaran = incidents.filter(
    (inc) => inc.IncidentType === "Violation",
  ).length;
  const prestasi = incidents.filter(
    (inc) => inc.IncidentType === "Improvement",
  ).length;

  // 4. Rekap Kehadiran
  let statsHadir = { sakit: 0, izin: 0, alpha: 0 };
  const attSheet = ss.getSheetByName("Attendance");
  if (attSheet) {
    const attendance = normalizeSheetData(
      attSheet.getDataRange().getValues(),
    ).filter((att) => att.StudentID === studentId);

    statsHadir.sakit = attendance.filter((a) => a.Type === "Sakit").length;
    statsHadir.izin = attendance.filter((a) => a.Type === "Izin").length;
    statsHadir.alpha = attendance.filter((a) => a.Type === "Alpha").length;
  }

  // 5. Penilaian Akhir (Logika Sederhana)
  let predikat = "Cukup";
  if (totalSkor >= 100 && pelanggaran === 0) predikat = "Istimewa";
  else if (totalSkor >= 70) predikat = "Sangat Baik";
  else if (totalSkor >= 40) predikat = "Baik";
  else if (totalSkor < 0) predikat = "Perlu Bimbingan";

  return {
    ok: true,
    data: {
      profile: studentObj,
      period: "Semester Ini",
      hafalan: {
        total: totalSetoran,
        details: hafalanKategori,
        lastMemo: memos[0] || null,
      },
      behavior: {
        score: totalSkor,
        violations: pelanggaran,
        achievements: prestasi,
        predikat: predikat,
      },
      attendance: statsHadir,
    },
  };
}
