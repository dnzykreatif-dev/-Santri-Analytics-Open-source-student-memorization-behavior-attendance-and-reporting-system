function generateStudentReportPdf(id, note) {
  try {
    if (
      !REPORT_TEMPLATE_ID ||
      REPORT_TEMPLATE_ID === "ID_GOOGLE_DOCS_TEMPLATE_ANDA"
    ) {
      return {
        ok: false,
        message: "ID Template Laporan belum diatur di Config.gs",
      };
    }

    // 1. Ambil Data Santri
    const ss = getSpreadsheet_();
    const studentSheet = getSheet_("Students");
    const studentData = studentSheet.getDataRange().getValues();
    const studentHeaders = studentData[0];

    let studentObj = null;
    for (let i = 1; i < studentData.length; i++) {
      if (studentData[i][0] === id) {
        studentObj = serializeRow(studentData[i], studentHeaders);
        break;
      }
    }

    if (!studentObj) return { ok: false, message: "Santri tidak ditemukan." };

    // 2. Hitung Ulang Skor untuk Laporan
    const incidents = normalizeSheetData(
      getSheet_("Incidents").getDataRange().getValues(),
    );
    const studentIncidents = incidents.filter((inc) => inc.StudentID === id);
    // Violations SUBTRACT points, other types ADD points
    const totalScore = studentIncidents.reduce((sum, inc) => {
      const points = Number(inc.Points) || 0;
      if (inc.IncidentType === "Violation") {
        return sum - points;
      }
      return sum + points;
    }, 100);

    // 3. Copy Template
    const template = DriveApp.getFileById(REPORT_TEMPLATE_ID);
    const newFile = template.makeCopy(
      "Laporan_" +
        studentObj.Name +
        "_" +
        new Date().toLocaleDateString("id-ID"),
    );
    const doc = DocumentApp.openById(newFile.getId());
    const body = doc.getBody();

    // 4. Ganti Placeholder
    body.replaceText("{{Nama}}", studentObj.Name);
    body.replaceText("{{Kelas}}", studentObj["Class/Level"] || "-");
    body.replaceText(
      "{{TanggalLaporan}}",
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
    body.replaceText("{{TotalSkor}}", totalScore);
    body.replaceText("{{CatatanUstadz}}", note || "Tidak ada catatan khusus.");

    // Tentukan Status Label
    let status = "PEMBINAAN INTENSIF";
    if (totalScore >= 80) status = "SANTRI UNGGUL";
    else if (totalScore >= 50) status = "SANTRI NORMAL";
    else if (totalScore >= 30) status = "PERLU PEMBINAAN";
    body.replaceText("{{StatusLabel}}", status);

    doc.saveAndClose();

    // 5. Konversi ke PDF
    const pdfBlob = newFile.getAs(MimeType.PDF);
    const pdfName = "Laporan_" + studentObj.Name + ".pdf";
    const pdfFile = DriveApp.createFile(pdfBlob).setName(pdfName);

    // Hapus file doc sementara, biarkan PDF saja
    newFile.setTrashed(true);

    return {
      ok: true,
      message: "PDF Berhasil dibuat",
      data: { viewUrl: pdfFile.getUrl() },
    };
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

function getStudentFullReport(id) {
  try {
    const ss = getSpreadsheet_();
    const studentSheet = getSheet_("Students");
    const studentData = studentSheet.getDataRange().getValues();
    const studentHeaders = studentData[0];

    let studentObj = null;
    for (let i = 1; i < studentData.length; i++) {
      if (studentData[i][0] === id) {
        studentObj = serializeRow(studentData[i], studentHeaders);
        break;
      }
    }

    if (!studentObj) return { ok: false, message: "Santri tidak ditemukan." };

    // Get memos/hafalan data
    const memosSheet = getSheet_("Memorization");
    const memosData = memosSheet.getDataRange().getValues();
    const memosHeaders = memosData[0];
    const studentMemos = normalizeSheetData(memosData).filter(
      (m) => m.StudentID === id,
    );

    // Get incidents data
    const incidentsSheet = getSheet_("Incidents");
    const incidentsData = incidentsSheet.getDataRange().getValues();
    const incidentsHeaders = incidentsData[0];
    const studentIncidents = normalizeSheetData(incidentsData).filter(
      (i) => i.StudentID === id,
    );

    // Calculate total score
    // Violations SUBTRACT points, other types ADD points
    const totalScore = studentIncidents.reduce((sum, inc) => {
      const points = Number(inc.Points) || 0;
      if (inc.IncidentType === "Violation") {
        return sum - points;
      }
      return sum + points;
    }, 100);

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

function sendReportToEmail(id, note, email) {
  // (Kode ini tetap sama seperti sebelumnya, tidak perlu diubah)
  try {
    const ss = getSpreadsheet_();
    const studentsSheet = getSheet_("Students");
    const studentData = studentsSheet.getDataRange().getValues();
    const studentHeaders = studentData[0];

    let studentName = "Santri";
    let studentClass = "";
    let studentTotalScore = 0;
    let studentStatusLabel = "Belum terdata";

    for (let i = 1; i < studentData.length; i++) {
      const row = studentData[i];
      if (row[0] === id) {
        const studentObj = serializeRow(row, studentHeaders);
        studentName = studentObj.Name;
        studentClass = studentObj["Class/Level"];

        const allIncidents = normalizeSheetData(
          ss.getSheetByName("Incidents").getDataRange().getValues(),
        );
        const studentIncidents = allIncidents.filter(
          (inc) => inc.StudentID === id,
        );
        // Violations SUBTRACT points, other types ADD points
        studentTotalScore = studentIncidents.reduce((sum, inc) => {
          const points = Number(inc.Points) || 0;
          if (inc.IncidentType === "Violation") {
            return sum - points;
          }
          return sum + points;
        }, 100);

        if (studentTotalScore >= 80) studentStatusLabel = "SANTRI UNGGUL";
        else if (studentTotalScore >= 50) studentStatusLabel = "SANTRI NORMAL";
        else if (studentTotalScore >= 30)
          studentStatusLabel = "PERLU PEMBINAAN";
        else studentStatusLabel = "PEMBINAAN INTENSIF";
        break;
      }
    }

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
    return { ok: true, message: "Email laporan berhasil terkirim." };
  } catch (e) {
    return { ok: false, message: `Gagal mengirim email: ${e.message}` };
  }
}
