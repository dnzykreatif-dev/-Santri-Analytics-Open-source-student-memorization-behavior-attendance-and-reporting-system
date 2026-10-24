/**
 * Wali-facing report sharing.
 *
 * The finance project uses the same interaction pattern for arrears:
 * validate the recipient, prepare a preview, audit the action, then let the
 * browser open WhatsApp. Santri Analytics reports academic/operational data,
 * so this module deliberately contains no billing or financial fields.
 */
function getGuardianReportSharePreview(studentId, periodId, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, { allowAnonymous: false });
    requireProductModuleEnabled_("academic", sessionUser);

    const reportResult = typeof REPORT_buildStudentReportData_ === "function"
      ? REPORT_buildStudentReportData_(studentId, periodId, sessionUser)
      : getStudentReportData(studentId, periodId, sessionUser);
    if (!reportResult || !reportResult.ok || !reportResult.data) {
      return reportResult || { ok: false, message: "Data laporan belum tersedia." };
    }

    const report = reportResult.data;
    const profile = report.profile || {};
    const phone = normalizeGuardianWhatsAppPhone_(profile.ParentContact || profile.WaliUsername);
    const rawPhone = String(profile.ParentContact || profile.WaliUsername || "").trim();
    const isValidPhone = /^62\d{8,13}$/.test(phone);
    const periodLabel = String(report.period || report.academic?.period?.Title || "Periode berjalan");
    const schoolName = getGuardianReportSchoolName_();
    const attendance = report.attendance || {};
    const academic = report.academic || {};
    const academicAverage = academic.summary && academic.summary.average !== null && academic.summary.average !== undefined
      ? academic.summary.average
      : "-";
    const note = String(profile.CatatanPembinaan || "").trim();

    const message = [
      "Assalamu'alaikum Bapak/Ibu Wali,",
      "",
      `Berikut ringkasan perkembangan ananda *${profile.Name || "-"}* (${profile["Class/Level"] || "-"}) untuk *${periodLabel}* dari ${schoolName}:`,
      "",
      `• Akademik: rata-rata ${academicAverage}`,
      `• Kehadiran: ${attendance.percentage || 0}% (Hadir ${attendance.hadir || 0}, Izin ${attendance.izin || 0}, Sakit ${attendance.sakit || 0}, Alpa ${attendance.alpa || 0})`,
      `• Hafalan: ${report.hafalan?.total || 0} setoran (baru ${report.hafalan?.newCount || 0}, muroja'ah ${report.hafalan?.reviewCount || 0})`,
      `• Perilaku: ${report.behavior?.predikat || "-"} (skor ${report.behavior?.score ?? "-"})`,
      note ? `• Catatan pembinaan: ${note}` : "",
      "",
      "Laporan lengkap tersedia dalam PDF raport. Mohon dibaca dan menjadi bahan pendampingan ananda di rumah.",
      "",
      `Terima kasih.\n${schoolName}`
    ].filter(Boolean).join("\n");

    const safeName = String(profile.Name || "Santri").replace(/[\\/:*?"<>|]+/g, "-");
    const safePeriod = periodLabel.replace(/[\\/:*?"<>|]+/g, "-");
    const link = isValidPhone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : "";

    AUTH_appendAuditLog_("PREPARE_SHARE", "StudentReport", String(studentId), sessionUser, {
      channel: "whatsapp",
      periodId: report.academic?.period?.PeriodID || periodId || "",
      phoneValid: isValidPhone,
    });

    return {
      ok: true,
      data: {
        studentName: profile.Name || "-",
        className: profile["Class/Level"] || "-",
        period: periodLabel,
        message,
        phone,
        rawPhone,
        isValidPhone,
        link,
        pdfAvailable: !!(report.reportMeta?.downloadable || report.academic?.period),
        pdfFilename: `Raport_${safeName}_${safePeriod}.pdf`,
        note: isValidPhone
          ? "Siap dibuka di WhatsApp"
          : rawPhone
            ? "Nomor wali perlu diperbaiki"
            : "Kontak wali belum diisi",
      },
    };
  } catch (error) {
    return { ok: false, message: "Gagal menyiapkan share laporan: " + error.message };
  }
}

function normalizeGuardianWhatsAppPhone_(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.indexOf("62") === 0) return digits;
  if (digits.indexOf("0") === 0) return "62" + digits.slice(1);
  if (digits.indexOf("8") === 0) return "62" + digits;
  return digits;
}

function getGuardianReportSchoolName_() {
  try {
    if (typeof PRODUCT_readRows_ === "function" && typeof SHEET_TENANT_PROFILE !== "undefined") {
      const profile = PRODUCT_readRows_(SHEET_TENANT_PROFILE);
      const row = profile.find((item) => String(item.ProfileKey || "") === "PondokName");
      if (row && String(row.ProfileValue || "").trim()) return String(row.ProfileValue).trim();
    }
  } catch (ignored) {}
  return "Pondok";
}
