function downloadStudentReportPdf(studentId, periodId, currentUser) {
  let temporaryFile = null;
  try {
    const sessionUser = requireSessionUser_(currentUser, { allowAnonymous: false });
    requireProductModuleEnabled_("academic", sessionUser);
    if (!isReportV2EnabledFor_(sessionUser)) {
      return { ok: false, message: "Raport versi baru belum diaktifkan." };
    }
    const reportResult = REPORT_buildStudentReportData_(
      studentId,
      periodId,
      sessionUser,
    );
    if (!reportResult.ok) return reportResult;
    const report = reportResult.data;
    if (!report.academic || !report.academic.period) {
      return { ok: false, message: "Periode raport tidak ditemukan." };
    }
    if (REPORT_text_(report.academic.period.Status) !== "Published") {
      return { ok: false, message: "PDF resmi hanya tersedia setelah raport dipublikasikan." };
    }

    const templateId = getConfiguredReportTemplateId_();
    if (!templateId || templateId === "ID_GOOGLE_DOCS_TEMPLATE_ANDA") {
      return { ok: false, message: "ID template laporan belum dikonfigurasi." };
    }

    const safeName = REPORT_text_(report.profile.Name || "Santri").replace(
      /[\\/:*?"<>|]+/g,
      "-",
    );
    const safePeriod = REPORT_text_(report.period || "Raport").replace(
      /[\\/:*?"<>|]+/g,
      "-",
    );
    temporaryFile = DriveApp.getFileById(templateId).makeCopy(
      "TEMP_Raport_" + safeName + "_" + Date.now(),
    );
    const doc = DocumentApp.openById(temporaryFile.getId());
    const body = doc.getBody();
    const generatedLabel = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "dd MMMM yyyy HH:mm",
    );

    REPORT_PDF_replace_(body, "Nama", report.profile.Name || "-");
    REPORT_PDF_replace_(body, "Kelas", report.profile["Class/Level"] || "-");
    REPORT_PDF_replace_(body, "TanggalLaporan", generatedLabel);
    REPORT_PDF_replace_(body, "TotalSkor", report.behavior.score);
    REPORT_PDF_replace_(
      body,
      "CatatanUstadz",
      report.profile.CatatanPembinaan || "Tidak ada catatan khusus.",
    );
    REPORT_PDF_replace_(body, "StatusLabel", report.behavior.predikat || "-");
    REPORT_PDF_appendReport_(body, report, generatedLabel);
    doc.saveAndClose();

    const filename = "Raport_" + safeName + "_" + safePeriod + ".pdf";
    const pdfBlob = temporaryFile.getAs(MimeType.PDF).setName(filename);
    const bytes = pdfBlob.getBytes();
    if (bytes.length > 8 * 1024 * 1024) {
      return { ok: false, message: "Ukuran PDF melebihi batas unduhan 8 MB." };
    }
    AUTH_appendAuditLog_("DOWNLOAD", "StudentReport", studentId, sessionUser, {
      periodId: report.academic.period.PeriodID,
      format: "pdf",
    });
    return {
      ok: true,
      message: "PDF raport siap diunduh.",
      data: {
        filename,
        mimeType: "application/pdf",
        base64: Utilities.base64Encode(bytes),
      },
    };
  } catch (e) {
    return { ok: false, message: "Gagal membuat PDF: " + e.message };
  } finally {
    if (temporaryFile) {
      try {
        temporaryFile.setTrashed(true);
      } catch (ignored) {}
    }
  }
}

function generateStudentReportPdf(id, note, currentUser, periodId) {
  return downloadStudentReportPdf(id, periodId, currentUser);
}

function REPORT_PDF_replace_(body, placeholder, value) {
  body.replaceText(
    "\\{\\{" + placeholder + "\\}\\}",
    String(value === null || value === undefined ? "-" : value),
  );
}

function REPORT_PDF_appendReport_(body, report, generatedLabel) {
  body.appendPageBreak();
  body
    .appendParagraph("RAPORT SANTRI")
    .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph("Periode: " + report.period);
  body.appendParagraph(
    "Rentang: " +
      (report.reportMeta.startDate || "-") +
      " s.d. " +
      (report.reportMeta.endDate || "-"),
  );
  body.appendParagraph("Dibuat: " + generatedLabel);

  body.appendParagraph("A. Nilai Ujian Semester").setHeading(
    DocumentApp.ParagraphHeading.HEADING2,
  );
  const academicRows = [["Mata Pelajaran", "Nilai", "KKM", "Predikat"]];
  (report.academic.subjects || []).forEach((subject) => {
    academicRows.push([
      String(subject.Name || "-"),
      subject.finalScore === null ? "-" : String(subject.finalScore),
      String(subject.KKM || "-"),
      String(subject.predikat || "-"),
    ]);
  });
  body.appendTable(academicRows);

  body.appendParagraph("B. Kehadiran dan Kelayakan Ujian").setHeading(
    DocumentApp.ParagraphHeading.HEADING2,
  );
  body.appendTable([
    ["Persentase", "Hadir", "Telat", "Izin", "Sakit", "Alpa", "Status"],
    [
      String(report.attendance.percentage || 0) + "%",
      String(report.attendance.hadir || 0),
      String(report.attendance.telat || 0),
      String(report.attendance.izin || 0),
      String(report.attendance.sakit || 0),
      String(report.attendance.alpa || 0),
      String((report.eligibility && report.eligibility.status) || "-"),
    ],
  ]);
  if (report.eligibility && report.eligibility.override) {
    body.appendParagraph(
      "Pengecualian: " + (report.eligibility.override.reason || "-"),
    );
  }

  body.appendParagraph("C. Ujian Seluruh Kurikulum").setHeading(
    DocumentApp.ParagraphHeading.HEADING2,
  );
  const curriculumRows = [["Kategori", "Materi", "Nilai", "Status", "Catatan"]];
  ((report.curriculum && report.curriculum.items) || []).forEach((item) => {
    curriculumRows.push([
      String(item.Category || "-"),
      String(item.Name || "-"),
      item.Score === null || item.Score === undefined ? "-" : String(item.Score),
      String(item.predikat || item.Status || "-"),
      String(item.Notes || "-"),
    ]);
  });
  body.appendTable(curriculumRows);

  body.appendParagraph("D. Hafalan dan Perilaku").setHeading(
    DocumentApp.ParagraphHeading.HEADING2,
  );
  body.appendTable([
    ["Total Setoran", "Setoran Baru", "Muroja'ah", "Skor Akhlak", "Predikat"],
    [
      String(report.hafalan.total || 0),
      String(report.hafalan.newCount || 0),
      String(report.hafalan.reviewCount || 0),
      String(report.behavior.score),
      String(report.behavior.predikat || "-"),
    ],
  ]);

  body.appendPageBreak();
  body.appendParagraph("LAMPIRAN RINCI").setHeading(
    DocumentApp.ParagraphHeading.HEADING1,
  );

  body.appendParagraph("Rincian Kehadiran").setHeading(
    DocumentApp.ParagraphHeading.HEADING2,
  );
  const attendanceRows = [["Tanggal", "Kategori", "Kegiatan", "Status", "Catatan"]];
  (report.details.attendance || []).forEach((item) => {
    attendanceRows.push([
      REPORT_dateKey_(item.AttendanceDate || item.DateLogged) || "-",
      String(item.Category || "-"),
      String(item.ActivityName || "-"),
      String(item.Status || "-"),
      String(item.Notes || "-"),
    ]);
  });
  body.appendTable(attendanceRows);

  body.appendParagraph("Rincian Hafalan").setHeading(
    DocumentApp.ParagraphHeading.HEADING2,
  );
  const memoRows = [["Tanggal", "Surah", "Ayat", "Kategori", "Kualitas"]];
  (report.details.memorization || []).forEach((item) => {
    memoRows.push([
      REPORT_dateKey_(item.DateLogged) || "-",
      String(item.Surah || "-"),
      [item.AyahStart, item.AyahEnd].filter(Boolean).join("-") || "-",
      String(item.Category || "-"),
      String(item.Quality || item.Status || "-"),
    ]);
  });
  body.appendTable(memoRows);

  body.appendParagraph("Rincian Prestasi dan Pelanggaran").setHeading(
    DocumentApp.ParagraphHeading.HEADING2,
  );
  const incidentRows = [["Tanggal", "Jenis", "Keterangan", "Poin"]];
  (report.details.incidents || []).forEach((item) => {
    incidentRows.push([
      REPORT_dateKey_(item.DateOfIncident) || "-",
      String(item.IncidentType || "-"),
      String(item.Description || "-"),
      String(getIncidentPoints_(item)),
    ]);
  });
  body.appendTable(incidentRows);
}

function getStudentFullReport(id, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, { allowAnonymous: false });
    const ss = getSpreadsheet_();
    const studentSheet = getSheet_("Students");
    const studentData = studentSheet.getDataRange().getValues();
    const studentHeaders = studentData[0];

    let studentObj = null;
    for (let i = 1; i < studentData.length; i++) {
      if (String(studentData[i][0]) === String(id)) {
        studentObj = serializeRow(studentData[i], studentHeaders);
        break;
      }
    }

    if (!studentObj) return { ok: false, message: "Santri tidak ditemukan." };
    REPORT_requireStudentAccess_(sessionUser, studentObj, "");

    // Get memos/hafalan data
    const memosSheet = getSheet_("MemorizationLogs");
    const memosData = memosSheet.getDataRange().getValues();
    const memosHeaders = memosData[0];
    const studentMemos = normalizeSheetData(memosData).filter(
      (m) => String(m.StudentID) === String(id),
    );

    // Get incidents data
    const incidentsSheet = getSheet_("Incidents");
    const incidentsData = incidentsSheet.getDataRange().getValues();
    const incidentsHeaders = incidentsData[0];
    const studentIncidents = normalizeSheetData(incidentsData).filter(
      (i) => String(i.StudentID) === String(id),
    );

    const totalScore = calculateBehaviorScore_(studentIncidents);
    // Debug logging
    Logger.log(
      "getStudentFullReport - StudentID: " +
        id +
        ", Total Incidents: " +
        studentIncidents.length +
        ", TotalScore: " +
        totalScore,
    );

    // Get raport data (last report)
    const raportData = {
      totalScore: totalScore,
      statusLabel:
        totalScore >= 80
          ? "SANTRI UNGGUL"
          : totalScore >= 50
            ? "SANTRI NORMAL"
            : totalScore >= 30
              ? "PERLU PEMBINAAN"
              : "PEMBINAAN INTENSIF",
    };

    return {
      ok: true,
      message: "Data berhasil dimuat",
      data: {
        memos: studentMemos,
        incidents: studentIncidents,
        raport: raportData,
      },
    };
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

function sendReportToEmail(id, note, email, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, { allowAnonymous: false });
    const ss = getSpreadsheet_();
    const studentsSheet = getSheet_("Students");
    const studentData = studentsSheet.getDataRange().getValues();
    const studentHeaders = studentData[0];

    let studentName = "Santri";
    let studentClass = "";
    let studentTotalScore = 0;
    let studentStatusLabel = "Belum terdata";

    let studentObjForAccess = null;
    for (let i = 1; i < studentData.length; i++) {
      const row = studentData[i];
      if (String(row[0]) === String(id)) {
        const studentObj = serializeRow(row, studentHeaders);
        studentObjForAccess = studentObj;
        studentName = studentObj.Name;
        studentClass = studentObj["Class/Level"];

        const allIncidents = normalizeSheetData(
          ss.getSheetByName("Incidents").getDataRange().getValues(),
        );
        const studentIncidents = allIncidents.filter(
          (inc) => String(inc.StudentID) === String(id),
        );
        studentTotalScore = calculateBehaviorScore_(studentIncidents);
        // Debug logging
        Logger.log(
          "sendReportToEmail - StudentID: " +
            id +
            ", Total Incidents: " +
            studentIncidents.length +
            ", studentTotalScore: " +
            studentTotalScore,
        );

        if (studentTotalScore >= 80) studentStatusLabel = "SANTRI UNGGUL";
        else if (studentTotalScore >= 50) studentStatusLabel = "SANTRI NORMAL";
        else if (studentTotalScore >= 30)
          studentStatusLabel = "PERLU PEMBINAAN";
        else studentStatusLabel = "PEMBINAAN INTENSIF";
        break;
      }
    }
    if (!studentObjForAccess) {
      return { ok: false, message: "Santri tidak ditemukan." };
    }
    REPORT_requireStudentAccess_(sessionUser, studentObjForAccess, "");

    const subject = `Laporan Perkembangan Santri ${studentName} - Ponpes Monitor`;
    const body =
      `Assalamu'alaikum Bapak/Ibu Wali dari ${studentName},\n\n` +
      `Berikut adalah ringkasan laporan perkembangan ananda ${studentName} di Ponpes:\n\n` +
      `Nama: ${studentName}\n` +
      `Kelas: ${studentClass}\n` +
      `Skor Perilaku Total: ${studentTotalScore}\n` +
      `Status Perkembangan: ${studentStatusLabel}\n\n` +
      `Catatan Khusus Ustadz: ${note || "Tidak ada catatan khusus dari Ustadz."}\n\n` +
      `Mohon untuk terus memantau dan membimbing ananda di rumah.\n\n` +
      `Terima kasih.\n` +
      `Wassalamu'alaikum Warahmatullahi Wabarakatuh.\n\n` +
      `Admin Ponpes Monitor`;

    MailApp.sendEmail(email, subject, body);
    AUTH_appendAuditLog_("EMAIL", "StudentReport", id, sessionUser, {
      recipientDomain: String(email || "").split("@")[1] || "",
    });
    return { ok: true, message: "Email laporan berhasil terkirim." };
  } catch (e) {
    return { ok: false, message: `Gagal mengirim email: ${e.message}` };
  }
}
