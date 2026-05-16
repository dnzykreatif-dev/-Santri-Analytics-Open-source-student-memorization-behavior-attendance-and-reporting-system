function doGet(e) {
  const template = HtmlService.createTemplateFromFile("Index");

  return template
    .evaluate()
    .setTitle("Monitor Santri")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

// Function to run parent contact conversion from frontend
function runParentContactConversion(currentUser) {
  try {
    // Check if user has permission (Mudir or Admin only)
    if (currentUser.Role !== "Mudir" && currentUser.Role !== "Admin") {
      return {
        ok: false,
        message:
          "Akses ditolak. Hanya Mudir/Admin yang dapat menjalankan konversi.",
      };
    }

    return convertParentContactsToUsers();
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

// Function to setup complete app from frontend
function runCompleteSetup(currentUser) {
  try {
    // Check if user has permission (Mudir or Admin only)
    if (currentUser.Role !== "Mudir" && currentUser.Role !== "Admin") {
      return {
        ok: false,
        message:
          "Akses ditolak. Hanya Mudir/Admin yang dapat menjalankan setup.",
      };
    }

    return setupCompleteApp();
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

function getFullStudentReport(studentId) {
  try {
    const students = getStudentsList();
    const hafalan = getHafalanLogs();
    const perilaku = getBehaviorLogs();

    const student = students.find(
      (s) => String(s.StudentID) === String(studentId),
    );

    if (!student) {
      return {
        success: false,
        message: "Data santri tidak ditemukan",
      };
    }

    // Filter hafalan dan perilaku berdasarkan studentId
    const studentHafalan = hafalan.filter(
      (h) => String(h.StudentID) === String(studentId),
    );
    const studentPerilaku = perilaku.filter(
      (p) => String(p.StudentID) === String(studentId),
    );

    return {
      success: true,
      data: {
        student: student,
        hafalan: studentHafalan,
        perilaku: studentPerilaku,
      },
    };
  } catch (e) {
    return {
      success: false,
      message: "Error: " + e.message,
    };
  }
}

// Helper functions untuk mengambil data dari spreadsheet
function getStudentsList() {
  try {
    const ss = getSpreadsheet_();
    const sheet = getSheet_("Students");
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const studentsRaw = data.slice(1);

    const result = [];
    for (let i = 0; i < studentsRaw.length; i++) {
      const row = studentsRaw[i];
      const studentObj = serializeRow(row, headers);
      result.push(studentObj);
    }
    return result;
  } catch (e) {
    return [];
  }
}

function getHafalanLogs() {
  try {
    const sheet = getSheet_("MemorizationLogs");
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];

    const headers = data[0];
    const logs = data.slice(1).map((row) => serializeRow(row, headers));
    return logs;
  } catch (e) {
    return [];
  }
}

function getBehaviorLogs() {
  try {
    const sheet = getSheet_("Incidents");
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];

    const headers = data[0];
    const incidents = data.slice(1).map((row) => serializeRow(row, headers));
    return incidents;
  } catch (e) {
    return [];
  }
}

// Entry point & include
function include(filename) {
  const template = HtmlService.createTemplateFromFile(filename);
  return template.evaluate().getContent();
}

// ============================================
// PULANG BULANAN MODULE
// ============================================

const SHEET_PULANG_BULANAN = "PulangBulanan";
const PULANG_BULANAN_HEADERS = [
  "PulangID",
  "StudentID",
  "StudentName",
  "Class",
  "Month",
  "Year",
  "PeriodLabel",
  "StatusPulang",
  "TanggalPulang",
  "JamPulang",
  "TanggalKembali",
  "JamKembali",
  "StatusKembali",
  "KeterlambatanMenit",
  "Penjemput",
  "HubunganPenjemput",
  "Phone",
  "Notes",
  "CreatedBy",
  "CreatedAt",
  "UpdatedAt",
];

// Helper functions untuk Pulang Bulanan
function PB_getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function PB_getOrCreateSheet_(sheetName, headers) {
  const ss = PB_getSpreadsheet_();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  const lastColumn = Math.max(sheet.getLastColumn(), headers.length);
  const firstRow = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const isEmpty = firstRow.every((v) => v === "" || v === null);
  if (isEmpty) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function PB_sheetToObjects_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return [];
  }
  const headers = values[0].map((h) => String(h).trim());
  return values
    .slice(1)
    .filter((row) => row.some((cell) => cell !== "" && cell !== null))
    .map((row, index) => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      obj._rowNumber = index + 2;
      return obj;
    });
}

function PB_objectToRow_(obj, headers) {
  return headers.map((header) =>
    obj[header] !== undefined ? obj[header] : "",
  );
}

function PB_generateId_(prefix) {
  return prefix + "-" + Utilities.getUuid().slice(0, 8).toUpperCase();
}

function PB_now_() {
  return new Date();
}

function PB_text_(value) {
  return String(value || "").trim();
}

function PB_num_(value) {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

// Setup Sheet Pulang Bulanan
function setupPulangBulanan() {
  PB_getOrCreateSheet_(SHEET_PULANG_BULANAN, PULANG_BULANAN_HEADERS);
  return {
    success: true,
    message: "Sheet PulangBulanan berhasil disiapkan.",
  };
}

// Helper validasi role
function PB_canManagePulang_(currentUser) {
  if (!currentUser) {
    return false;
  }
  return currentUser.Role === "Mudir" || currentUser.Role === "Ustadz";
}

function PB_canViewPulang_(currentUser) {
  if (!currentUser) {
    return false;
  }
  return ["Mudir", "Ustadz", "Wali"].includes(currentUser.Role);
}

// Helper ambil data santri
function PB_getStudentById_(studentId) {
  let students = [];
  if (typeof getStudents === "function") {
    const res = getStudents();
    if (Array.isArray(res)) {
      students = res;
    } else if (res && res.success && Array.isArray(res.data)) {
      students = res.data;
    }
  }
  return (
    students.find((s) => String(s.StudentID) === String(studentId)) || null
  );
}

// Hitung keterlambatan kembali
function PB_calculateLateMinutes_(tanggalKembali, jamKembali, batasJamKembali) {
  if (!tanggalKembali || !jamKembali) {
    return 0;
  }
  const batas = batasJamKembali || "17:00";
  const kembaliDate = new Date(tanggalKembali);
  const kembaliParts = String(jamKembali).split(":");
  kembaliDate.setHours(Number(kembaliParts[0] || 0));
  kembaliDate.setMinutes(Number(kembaliParts[1] || 0));
  kembaliDate.setSeconds(0);
  const batasDate = new Date(tanggalKembali);
  const batasParts = String(batas).split(":");
  batasDate.setHours(Number(batasParts[0] || 17));
  batasDate.setMinutes(Number(batasParts[1] || 0));
  batasDate.setSeconds(0);
  const diffMs = kembaliDate.getTime() - batasDate.getTime();
  if (diffMs <= 0) {
    return 0;
  }
  return Math.ceil(diffMs / 60000);
}

function PB_getStatusKembali_(tanggalKembali, jamKembali, batasJamKembali) {
  if (!tanggalKembali || !jamKembali) {
    return "Belum Kembali";
  }
  const terlambat = PB_calculateLateMinutes_(
    tanggalKembali,
    jamKembali,
    batasJamKembali,
  );
  return terlambat > 0 ? "Terlambat" : "Tepat Waktu";
}

// Helper nama bulan
function PB_getMonthName_(month) {
  const names = {
    1: "Januari",
    2: "Februari",
    3: "Maret",
    4: "April",
    5: "Mei",
    6: "Juni",
    7: "Juli",
    8: "Agustus",
    9: "September",
    10: "Oktober",
    11: "November",
    12: "Desember",
  };
  return names[String(month)] || String(month || "");
}

// 1. Ambil data Pulang Bulanan
function getPulangBulananLogs(currentUser, filters) {
  try {
    if (!PB_canViewPulang_(currentUser)) {
      throw new Error("Akses ditolak.");
    }
    const sheet = PB_getOrCreateSheet_(
      SHEET_PULANG_BULANAN,
      PULANG_BULANAN_HEADERS,
    );
    let logs = PB_sheetToObjects_(sheet);
    filters = filters || {};
    const month = filters.Month ? String(filters.Month) : "";
    const year = filters.Year ? String(filters.Year) : "";
    const studentId = filters.StudentID ? String(filters.StudentID) : "";
    const kelas = filters.Class ? String(filters.Class) : "";
    const statusKembali = filters.StatusKembali
      ? String(filters.StatusKembali)
      : "";
    if (month) {
      logs = logs.filter((l) => String(l.Month) === month);
    }
    if (year) {
      logs = logs.filter((l) => String(l.Year) === year);
    }
    if (studentId) {
      logs = logs.filter((l) => String(l.StudentID) === studentId);
    }
    if (kelas) {
      logs = logs.filter((l) => String(l.Class) === kelas);
    }
    if (statusKembali) {
      logs = logs.filter((l) => String(l.StatusKembali) === statusKembali);
    }
    if (currentUser.Role === "Wali") {
      logs = logs.filter(
        (l) => String(l.StudentID) === String(currentUser.StudentID),
      );
    }
    if (currentUser.Role === "Ustadz" && currentUser.Class) {
      logs = logs.filter((l) => String(l.Class) === String(currentUser.Class));
    }
    logs = logs.map((l) => ({
      PulangID: l.PulangID || "",
      StudentID: l.StudentID || "",
      StudentName: l.StudentName || "",
      Class: l.Class || "",
      Month: l.Month || "",
      Year: l.Year || "",
      PeriodLabel: l.PeriodLabel || "",
      StatusPulang: l.StatusPulang || "",
      TanggalPulang: l.TanggalPulang || "",
      JamPulang: l.JamPulang || "",
      TanggalKembali: l.TanggalKembali || "",
      JamKembali: l.JamKembali || "",
      StatusKembali: l.StatusKembali || "",
      KeterlambatanMenit: l.KeterlambatanMenit || 0,
      Penjemput: l.Penjemput || "",
      HubunganPenjemput: l.HubunganPenjemput || "",
      Phone: l.Phone || "",
      Notes: l.Notes || "",
      CreatedBy: l.CreatedBy || "",
      CreatedAt: l.CreatedAt || "",
      UpdatedAt: l.UpdatedAt || "",
    }));
    logs.sort((a, b) => {
      const ay = Number(a.Year || 0);
      const by = Number(b.Year || 0);
      const am = Number(a.Month || 0);
      const bm = Number(b.Month || 0);
      if (by !== ay) return by - ay;
      return bm - am;
    });
    return {
      success: true,
      data: logs,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
}

// 2. Simpan data Pulang Bulanan
function savePulangBulanan(payload, currentUser) {
  try {
    if (!PB_canManagePulang_(currentUser)) {
      throw new Error(
        "Akses ditolak. Hanya Mudir/Ustadz yang dapat mencatat pulang bulanan.",
      );
    }
    payload = payload || {};
    if (!payload.StudentID) {
      throw new Error("Santri wajib dipilih.");
    }
    if (!payload.Month) {
      throw new Error("Bulan wajib dipilih.");
    }
    if (!payload.Year) {
      throw new Error("Tahun wajib diisi.");
    }
    if (!payload.StatusPulang) {
      throw new Error("Status pulang wajib dipilih.");
    }
    const student = PB_getStudentById_(payload.StudentID);
    const studentName = student
      ? student.Name || student.StudentName || student.Nama || ""
      : PB_text_(payload.StudentName);
    const studentClass = student
      ? student.Class || student.Kelas || ""
      : PB_text_(payload.Class);
    const sheet = PB_getOrCreateSheet_(
      SHEET_PULANG_BULANAN,
      PULANG_BULANAN_HEADERS,
    );
    const logs = PB_sheetToObjects_(sheet);
    const month = PB_text_(payload.Month);
    const year = PB_text_(payload.Year);
    const duplicate = logs.find(
      (l) =>
        String(l.StudentID) === String(payload.StudentID) &&
        String(l.Month) === month &&
        String(l.Year) === year,
    );
    if (duplicate) {
      throw new Error(
        "Data pulang bulanan santri ini untuk bulan dan tahun tersebut sudah ada. Gunakan tombol edit.",
      );
    }
    const statusKembali = PB_getStatusKembali_(
      payload.TanggalKembali,
      payload.JamKembali,
      payload.BatasJamKembali || "17:00",
    );
    const lateMinutes = PB_calculateLateMinutes_(
      payload.TanggalKembali,
      payload.JamKembali,
      payload.BatasJamKembali || "17:00",
    );
    const periodLabel = PB_getMonthName_(month) + " " + year;
    const newLog = {
      PulangID: PB_generateId_("PLG"),
      StudentID: PB_text_(payload.StudentID),
      StudentName: studentName,
      Class: studentClass,
      Month: month,
      Year: year,
      PeriodLabel: periodLabel,
      StatusPulang: PB_text_(payload.StatusPulang),
      TanggalPulang: PB_text_(payload.TanggalPulang),
      JamPulang: PB_text_(payload.JamPulang),
      TanggalKembali: PB_text_(payload.TanggalKembali),
      JamKembali: PB_text_(payload.JamKembali),
      StatusKembali: statusKembali,
      KeterlambatanMenit: lateMinutes,
      Penjemput: PB_text_(payload.Penjemput),
      HubunganPenjemput: PB_text_(payload.HubunganPenjemput),
      Phone: PB_text_(payload.Phone),
      Notes: PB_text_(payload.Notes),
      CreatedBy: currentUser.Name || currentUser.Username || "",
      CreatedAt: PB_now_(),
      UpdatedAt: PB_now_(),
    };
    sheet.appendRow(PB_objectToRow_(newLog, PULANG_BULANAN_HEADERS));
    return {
      success: true,
      message: "Data pulang bulanan berhasil disimpan.",
      data: newLog,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
}

// 3. Update data Pulang Bulanan
function updatePulangBulanan(pulangId, payload, currentUser) {
  try {
    if (!PB_canManagePulang_(currentUser)) {
      throw new Error(
        "Akses ditolak. Hanya Mudir/Ustadz yang dapat mengubah data.",
      );
    }
    payload = payload || {};
    const sheet = PB_getOrCreateSheet_(
      SHEET_PULANG_BULANAN,
      PULANG_BULANAN_HEADERS,
    );
    const logs = PB_sheetToObjects_(sheet);
    const target = logs.find((l) => String(l.PulangID) === String(pulangId));
    if (!target) {
      throw new Error("Data pulang bulanan tidak ditemukan.");
    }
    const student = PB_getStudentById_(payload.StudentID || target.StudentID);
    const studentName = student
      ? student.Name || student.StudentName || student.Nama || ""
      : PB_text_(payload.StudentName || target.StudentName);
    const studentClass = student
      ? student.Class || student.Kelas || ""
      : PB_text_(payload.Class || target.Class);
    const month = PB_text_(payload.Month || target.Month);
    const year = PB_text_(payload.Year || target.Year);
    const duplicate = logs.find(
      (l) =>
        String(l.PulangID) !== String(pulangId) &&
        String(l.StudentID) === String(payload.StudentID || target.StudentID) &&
        String(l.Month) === month &&
        String(l.Year) === year,
    );
    if (duplicate) {
      throw new Error(
        "Data santri ini pada bulan dan tahun tersebut sudah ada.",
      );
    }
    const statusKembali = PB_getStatusKembali_(
      payload.TanggalKembali,
      payload.JamKembali,
      payload.BatasJamKembali || "17:00",
    );
    const lateMinutes = PB_calculateLateMinutes_(
      payload.TanggalKembali,
      payload.JamKembali,
      payload.BatasJamKembali || "17:00",
    );
    target.StudentID = PB_text_(payload.StudentID || target.StudentID);
    target.StudentName = studentName;
    target.Class = studentClass;
    target.Month = month;
    target.Year = year;
    target.PeriodLabel = PB_getMonthName_(month) + " " + year;
    target.StatusPulang = PB_text_(payload.StatusPulang || target.StatusPulang);
    target.TanggalPulang = PB_text_(payload.TanggalPulang);
    target.JamPulang = PB_text_(payload.JamPulang);
    target.TanggalKembali = PB_text_(payload.TanggalKembali);
    target.JamKembali = PB_text_(payload.JamKembali);
    target.StatusKembali = statusKembali;
    target.KeterlambatanMenit = lateMinutes;
    target.Penjemput = PB_text_(payload.Penjemput);
    target.HubunganPenjemput = PB_text_(payload.HubunganPenjemput);
    target.Phone = PB_text_(payload.Phone);
    target.Notes = PB_text_(payload.Notes);
    target.UpdatedAt = PB_now_();
    sheet
      .getRange(target._rowNumber, 1, 1, PULANG_BULANAN_HEADERS.length)
      .setValues([PB_objectToRow_(target, PULANG_BULANAN_HEADERS)]);
    return {
      success: true,
      message: "Data pulang bulanan berhasil diperbarui.",
      data: target,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
}

// 4. Hapus data Pulang Bulanan
function deletePulangBulanan(pulangId, currentUser) {
  try {
    if (!PB_canManagePulang_(currentUser)) {
      throw new Error(
        "Akses ditolak. Hanya Mudir/Ustadz yang dapat menghapus data.",
      );
    }
    const sheet = PB_getOrCreateSheet_(
      SHEET_PULANG_BULANAN,
      PULANG_BULANAN_HEADERS,
    );
    const logs = PB_sheetToObjects_(sheet);
    const target = logs.find((l) => String(l.PulangID) === String(pulangId));
    if (!target) {
      throw new Error("Data pulang bulanan tidak ditemukan.");
    }
    sheet.deleteRow(target._rowNumber);
    return {
      success: true,
      message: "Data pulang bulanan berhasil dihapus.",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
}

// 5. Summary Pulang Bulanan
function getPulangBulananSummary(currentUser, filters) {
  try {
    const res = getPulangBulananLogs(currentUser, filters);
    if (!res.success) {
      return res;
    }
    const logs = res.data || [];
    const total = logs.length;
    const pulang = logs.filter((l) => l.StatusPulang === "Pulang").length;
    const tidakPulang = logs.filter(
      (l) => l.StatusPulang === "Tidak Pulang",
    ).length;
    const izin = logs.filter((l) => l.StatusPulang === "Izin").length;
    const tepatWaktu = logs.filter(
      (l) => l.StatusKembali === "Tepat Waktu",
    ).length;
    const terlambat = logs.filter(
      (l) => l.StatusKembali === "Terlambat",
    ).length;
    const belumKembali = logs.filter(
      (l) => l.StatusKembali === "Belum Kembali",
    ).length;
    return {
      success: true,
      data: {
        total,
        pulang,
        tidakPulang,
        izin,
        tepatWaktu,
        terlambat,
        belumKembali,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
}
