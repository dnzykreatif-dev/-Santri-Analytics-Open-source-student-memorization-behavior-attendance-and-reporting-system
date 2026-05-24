function getDashboardSummary(user, filters = {}) {
  const ss = getSpreadsheet_();
  const studentsSheet = getSheet_("Students");
  const memorizationSheet = getSheet_("MemorizationLogs");

  const allStudents = normalizeSheetData(
    studentsSheet.getDataRange().getValues(),
  );
  const allUsers = normalizeSheetData(
    getSheet_("Users").getDataRange().getValues(),
  );
  const allMemorizationLogs = normalizeSheetData(
    memorizationSheet.getDataRange().getValues(),
  );
  const allIncidents = getRecentIncidents();

  // Filter out students associated with Inactive users (case-insensitive check)
  const activeStudents = allStudents.filter((s) => {
    const user = allUsers.find(
      (u) => u.Username === s.WaliUsername || u.Phone === s.ParentContact,
    );
    const userStatus = String(user?.Status || "")
      .toLowerCase()
      .trim();
    return !user || userStatus !== "inactive";
  });

  // === WALI ACCESS CONTROL ===
  // Jika user adalah Wali, hanya tampilkan data untuk StudentID yang terkait
  let students = activeStudents;
  let memorizationLogs = allMemorizationLogs;
  let incidents = allIncidents;
  let isWaliUser = user && user.Role === "Wali";
  let waliStudentId = isWaliUser ? user.StudentID : null;

  if (isWaliUser && waliStudentId) {
    // Filter students - hanya tampilkan siswa yang terkait dengan wali ini
    students = allStudents.filter(
      (s) => String(s.StudentID) === String(waliStudentId),
    );

    // Filter memorization logs
    memorizationLogs = allMemorizationLogs.filter(
      (log) => String(log.StudentID) === String(waliStudentId),
    );

    // Filter incidents
    incidents = allIncidents.filter(
      (inc) => String(inc.StudentID) === String(waliStudentId),
    );
  }

  // Filter Date Logic
  const startDate =
    filters && filters.startDate ? new Date(filters.startDate) : null;
  const endDate = filters && filters.endDate ? new Date(filters.endDate) : null;

  const filterByDate = (itemDateString) => {
    if (!startDate || !endDate || !itemDateString) return true;
    const itemDate = new Date(itemDateString);
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);
    return itemDate >= startDate && itemDate <= adjustedEndDate;
  };

  const filteredMemorizationLogs = memorizationLogs.filter((log) => {
    if (!filterByDate(log.DateLogged)) return false;
    if (filters.classFilter) {
      const student = students.find((s) => s.StudentID === log.StudentID);
      if (!student || student["Class/Level"] !== filters.classFilter)
        return false;
    }
    if (filters.memoCategory && log.Category !== filters.memoCategory)
      return false;
    return true;
  });

  const filteredIncidents = incidents.filter((incident) => {
    if (!filterByDate(incident.DateOfIncident)) return false;
    if (filters.classFilter) {
      const student = students.find((s) => s.StudentID === incident.StudentID);
      if (!student || student["Class/Level"] !== filters.classFilter)
        return false;
    }
    if (filters.incidentType && incident.IncidentType !== filters.incidentType)
      return false;
    return true;
  });

  // === LOGIC BARU: GABUNGAN HAFALAN + ABSENSI ===

  // 1. Ambil data absensi
  const attendanceSheet = ss.getSheetByName("Attendance");
  let attendanceLogs = [];
  if (attendanceSheet) {
    let rawAttendanceLogs = normalizeSheetData(
      attendanceSheet.getDataRange().getValues(),
    );

    // Filter attendance logs berdasarkan waliStudentId jika user adalah Wali
    if (isWaliUser && waliStudentId) {
      rawAttendanceLogs = rawAttendanceLogs.filter(
        (log) => String(log.StudentID) === String(waliStudentId),
      );
    }

    // Tandai sebagai 'Keterangan' agar frontend mengenalinya
    attendanceLogs = rawAttendanceLogs.map((log) => ({
      ...log,
      Category: "Keterangan",
      Surah: log.Type, // Gunakan field Surah untuk menampilkan Type di frontend
      StudentName:
        students.find((s) => s.StudentID === log.StudentID)?.Name || "Santri",
    }));
  }

  // 2. Gabungkan log hafalan dan absensi
  let allLogs = [...filteredMemorizationLogs, ...attendanceLogs];

  // 3. Sort gabungan
  const recentLogs = allLogs.sort(
    (a, b) => new Date(b.DateLogged) - new Date(a.DateLogged),
  );

  const recentIncidents = filteredIncidents;
  // ================================================

  // Attention Logic
  const attentionStudents = [];
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
  oneMonthAgo.setHours(0, 0, 0, 0);

  students.forEach((student) => {
    const studentIncidents = incidents.filter(
      (inc) =>
        inc.StudentID === student.StudentID && inc.IncidentType === "Violation",
    );
    const recentViolations = studentIncidents.filter(
      (inc) => new Date(inc.DateOfIncident) >= oneMonthAgo,
    );

    if (recentViolations.length >= 2) {
      attentionStudents.push({
        id: student.StudentID,
        name: student.Name,
        reasons: [
          `${recentViolations.length} pelanggaran dalam 30 hari terakhir.`,
        ],
        totalViolations: recentViolations.length,
      });
    }
  });

  // Stats Per Kelas
  const statsPerKelas = {};
  students.forEach((s) => {
    const kelas = s["Class/Level"] || "Tanpa Kelas";
    if (!statsPerKelas[kelas])
      statsPerKelas[kelas] = { total: 0, pelanggaran: 0 };
    statsPerKelas[kelas].total++;
    statsPerKelas[kelas].pelanggaran += incidents.filter(
      (inc) =>
        inc.StudentID === s.StudentID && inc.IncidentType === "Violation",
    ).length;
  });

  // Get student's data for Wali view
  let studentDetail = null;
  if (isWaliUser && students.length > 0) {
    studentDetail = students[0];
  }

  // === CHART DATA: Memorization Trend (Last 30 days) ===
  const memoChartData = [];
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  // Group memorization logs by date (last 30 days)
  const memoByDate = {};
  const allMemorizationForChart = isWaliUser
    ? allMemorizationLogs
    : memorizationLogs;

  allMemorizationForChart.forEach((log) => {
    const logDate = new Date(log.DateLogged);
    if (logDate >= thirtyDaysAgo) {
      const dateKey = logDate.toISOString().split("T")[0];
      if (!memoByDate[dateKey]) {
        memoByDate[dateKey] = { total: 0, approved: 0 };
      }
      memoByDate[dateKey].total++;
      if (log.Status === "Approved" || log.Status === "Mutqin") {
        memoByDate[dateKey].approved++;
      }
    }
  });

  // Fill in all dates with 0 values
  for (let i = 30; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split("T")[0];
    if (!memoByDate[dateKey]) {
      memoByDate[dateKey] = { total: 0, approved: 0 };
    }
    memoChartData.push({
      date: dateKey,
      label: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      total: memoByDate[dateKey].total,
      approved: memoByDate[dateKey].approved,
    });
  }

  // === CHART DATA: Behavior Score Trend (Per Student, Last 30 days) ===
  const behaviorChartData = [];
  const studentScores = {};

  // Calculate cumulative score per student
  students.forEach((student) => {
    const studentIncidents = isWaliUser
      ? allIncidents.filter(
          (inc) => String(inc.StudentID) === String(waliStudentId),
        )
      : allIncidents.filter((inc) => inc.StudentID === student.StudentID);

    let cumulativeScore = 100; // Base score
    const dailyScores = {};

    studentIncidents
      .sort((a, b) => new Date(a.DateOfIncident) - new Date(b.DateOfIncident))
      .forEach((inc) => {
        const incDate = new Date(inc.DateOfIncident);
        if (incDate >= thirtyDaysAgo) {
          // Points SUDAH mengandung tanda: negatif untuk Violation, positif untuk Improvement
          cumulativeScore += parseInt(inc.Points) || 0;
          // Clamp score between 0 and 100
          cumulativeScore = Math.min(100, Math.max(0, cumulativeScore));
          const dateKey = incDate.toISOString().split("T")[0];
          dailyScores[dateKey] = cumulativeScore;
        }
      });

    // Get the latest score
    const latestScore = Math.max(0, Math.min(100, cumulativeScore));
    // Debug logging
    Logger.log(
      "getDashboardSummary - StudentID: " +
        student.StudentID +
        ", Total Incidents: " +
        studentIncidents.length +
        ", LatestScore: " +
        latestScore,
    );
    if (student.Name) {
      studentScores[student.StudentID] = {
        name: student.Name,
        score: latestScore,
      };
    }
  });

  // Calculate average behavior score per day for chart
  const avgScoreByDate = {};
  for (let i = 30; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split("T")[0];
    avgScoreByDate[dateKey] = {
      label: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      avgScore: 100, // Default baseline
    };
  }

  // Calculate average across all students
  const totalStudentsCount = students.length;
  if (totalStudentsCount > 0) {
    Object.keys(avgScoreByDate).forEach((dateKey) => {
      let totalScore = 0;
      let studentCount = 0;
      students.forEach((student) => {
        const studentIncidents = isWaliUser
          ? allIncidents.filter(
              (inc) => String(inc.StudentID) === String(waliStudentId),
            )
          : allIncidents.filter((inc) => inc.StudentID === student.StudentID);

        let studentScore = 100;
        studentIncidents.forEach((inc) => {
          const incDate = new Date(inc.DateOfIncident);
          if (incDate <= new Date(dateKey + "T23:59:59")) {
            // Points SUDAH mengandung tanda: negatif untuk Violation, positif untuk Improvement
            studentScore += parseInt(inc.Points) || 0;
          }
        });
        // Clamp score between 0 and 100
        studentScore = Math.min(100, Math.max(0, studentScore));
        totalScore += studentScore;
        studentCount++;
      });
      if (studentCount > 0) {
        avgScoreByDate[dateKey].avgScore = Math.round(
          totalScore / studentCount,
        );
      }
    });
  }

  behaviorChartData.push(...Object.values(avgScoreByDate));

  // Top 5 students with lowest scores (for attention)
  const lowScoreStudents = Object.values(studentScores)
    .filter((s) => s.score < 80)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  return {
    ok: true,
    data: {
      totalStudents: students.length,
      totalLogs: filteredMemorizationLogs.length,
      totalIncidents: filteredIncidents.length,
      recentLogs: recentLogs,
      recentIncidents: recentIncidents,
      attentionStudents: attentionStudents,
      statsPerKelas: statsPerKelas,
      // Flag untuk frontend menyesuaikan tampilan
      isWaliUser: isWaliUser,
      studentDetail: studentDetail,
      // Chart data
      memoChartData: memoChartData,
      behaviorChartData: behaviorChartData,
      lowScoreStudents: lowScoreStudents,
    },
  };
}
