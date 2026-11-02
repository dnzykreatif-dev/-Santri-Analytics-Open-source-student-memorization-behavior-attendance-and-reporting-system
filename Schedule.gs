const SHEET_SCHEDULES = "Schedules";
const SHEET_SCHEDULE_MASTERS = "ScheduleMasters";

const SCHEDULE_MASTER_TYPES = ["Class", "Subject", "Activity", "TimeSlot"];

function getScheduleEditorData(currentUser) {
  try {
    requireSessionUser_(currentUser, { roles: ["Admin", "Mudir"] });
    setupSheetWithHeaders_(SHEET_SCHEDULE_MASTERS, CORE_SHEET_SCHEMAS.ScheduleMasters);

    const schedules = SCHEDULE_readSchedules_();
    const masters = SCHEDULE_readMasters_().filter((item) => item.IsActive);
    const activeStudents = SCHEDULE_readActiveStudents_();
    const users = typeof AUTH_getUsersByUsername_ === "function" ? AUTH_getUsersByUsername_() : [];
    const classes = new Set(activeStudents.map((item) => String(item["Class/Level"] || "").trim()).filter(Boolean));
    const subjects = new Set();
    const activities = new Set();
    schedules.forEach((item) => {
      if (!item.SubjectOrActivityName) return;
      if (item.Type === "KBM") subjects.add(item.SubjectOrActivityName);
      else activities.add(item.SubjectOrActivityName);
    });
    if (typeof AC_getSubjects_ === "function") {
      AC_getSubjects_().forEach((item) => {
        const name = String(item.Name || item.SubjectName || "").trim();
        if (name && item.IsActive !== false && String(item.IsActive).toLowerCase() !== "false") subjects.add(name);
      });
    }
    masters.forEach((item) => {
      if (item.MasterType === "Class") classes.add(item.Name);
      if (item.MasterType === "Subject") subjects.add(item.Name);
      if (item.MasterType === "Activity") activities.add(item.Name);
    });

    return { ok: true, data: {
      installationMode: getInstallationMode_(),
      embeddedMasterImportAllowed: !isTenantInstallation_(),
      scheduleSource: isTenantInstallation_() ? "Schedules milik pondok" : "Master aplikasi / Schedules",
      classes: Array.from(classes).sort(SCHEDULE_naturalCompare_),
      subjects: Array.from(subjects).sort(SCHEDULE_naturalCompare_),
      activities: Array.from(activities).sort(SCHEDULE_naturalCompare_),
      timeSlots: masters.filter((item) => item.MasterType === "TimeSlot").sort(SCHEDULE_masterSort_),
      teachers: users.filter((item) => ["Ustadz", "Mudir"].includes(String(item.Role || ""))),
      masters,
    }};
  } catch (e) {
    return { ok: false, message: "Gagal memuat editor jadwal: " + e.message };
  }
}

function validateSchedules(payload, currentUser) {
  try {
    requireSessionUser_(currentUser, { roles: ["Admin", "Mudir"] });
    const rows = Array.isArray(payload) ? payload : (payload && payload.schedules) || [];
    const schedules = rows.length ? rows.map(ATT_normalizeSchedule_) : SCHEDULE_readSchedules_().map(ATT_normalizeSchedule_);
    const issues = [];
    const active = schedules.filter((item) => item.IsActive && item.StartTime && item.EndTime);
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const a = active[i];
        const b = active[j];
        if (a.DayOfWeek !== b.DayOfWeek || !SCHEDULE_overlaps_(a, b)) continue;
        if (a.TeacherID && a.TeacherID === b.TeacherID) {
          issues.push({ severity: "critical", code: "teacher_conflict", message: "Pengajar memiliki dua jadwal yang bertabrakan.", scheduleIds: [a.ScheduleID, b.ScheduleID] });
        }
        if (a.ClassOrGroupName && a.ClassOrGroupName === b.ClassOrGroupName) {
          issues.push({ severity: "warning", code: "class_conflict", message: "Kelas memiliki dua jadwal yang bertabrakan.", scheduleIds: [a.ScheduleID, b.ScheduleID] });
        }
      }
    }
    active.filter((item) => !item.TeacherID || !item.ClassOrGroupName || !item.SubjectOrActivityName)
      .forEach((item) => issues.push({ severity: "critical", code: "incomplete_schedule", message: "Data jadwal belum lengkap.", scheduleIds: [item.ScheduleID] }));
    return { ok: true, data: { valid: !issues.some((item) => item.severity === "critical"), issues } };
  } catch (e) {
    return { ok: false, message: "Gagal memeriksa jadwal: " + e.message };
  }
}

function bulkUpdateSchedules(payload, currentUser) {
  try {
    requireSessionUser_(currentUser, { roles: ["Admin", "Mudir"] });
    payload = payload || {};
    const ids = Array.from(new Set((payload.scheduleIds || []).map((id) => String(id).trim()).filter(Boolean)));
    const operation = String(payload.operation || "").trim();
    if (!ids.length) return { ok: false, message: "Pilih minimal satu jadwal." };
    if (!["move_day", "move_time", "replace_teacher", "replace_class", "set_active"].includes(operation)) {
      return { ok: false, message: "Operasi jadwal tidak dikenal." };
    }
    if (payload.preview) return { ok: true, data: SCHEDULE_buildBulkPreview_(ids, operation, payload) };

    const sheet = getSheet_(SHEET_SCHEDULES);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const rows = sheet.getDataRange().getValues();
    const idCol = headers.indexOf("ScheduleID");
    const updates = [];
    rows.slice(1).forEach((row, index) => {
      const id = String(row[idCol] || "").trim();
      if (!ids.includes(id)) return;
      const current = serializeRow(row, headers);
      const next = SCHEDULE_applyBulkChange_(current, operation, payload);
      headers.forEach((header, column) => {
        if (next[header] !== undefined) row[column] = next[header];
      });
      updates.push({ rowIndex: index + 2, schedule: next });
    });
    if (!updates.length) return { ok: false, message: "Jadwal yang dipilih tidak ditemukan." };
    const values = updates.map((item) => rows[item.rowIndex - 1]);
    updates.forEach((item, index) => sheet.getRange(item.rowIndex, 1, 1, headers.length).setValues([values[index]]));
    updates.forEach((item) => { if (typeof ATT_clearScheduleCache_ === "function") ATT_clearScheduleCache_(item.schedule.ScheduleID); });
    return { ok: true, message: updates.length + " jadwal berhasil diperbarui.", data: { count: updates.length } };
  } catch (e) {
    return { ok: false, message: "Gagal memperbarui jadwal massal: " + e.message };
  }
}

function saveScheduleMaster(payload, currentUser) {
  try {
    requireSessionUser_(currentUser, { roles: ["Admin", "Mudir"] });
    setupSheetWithHeaders_(SHEET_SCHEDULE_MASTERS, CORE_SHEET_SCHEMAS.ScheduleMasters);
    payload = payload || {};
    const type = String(payload.MasterType || "").trim();
    const name = String(payload.Name || "").trim();
    if (!SCHEDULE_MASTER_TYPES.includes(type) || !name) return { ok: false, message: "Jenis dan nama master wajib diisi." };
    const start = normalizeScheduleTime_(payload.StartTime || "");
    const end = normalizeScheduleTime_(payload.EndTime || "");
    if (type === "TimeSlot" && (!start || !end || start >= end)) return { ok: false, message: "Slot jam harus memiliki waktu mulai dan selesai yang valid." };
    const id = String(payload.MasterID || "MASTER-" + Utilities.getUuid().slice(0, 8).toUpperCase());
    const sheet = getSheet_(SHEET_SCHEDULE_MASTERS);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = { MasterID: id, MasterType: type, Name: name, StartTime: start, EndTime: end, SortOrder: Number(payload.SortOrder || 999), IsActive: payload.IsActive !== false, UpdatedAt: new Date().toISOString() };
    const index = findRowIndexById_(SHEET_SCHEDULE_MASTERS, id);
    const values = headers.map((header) => row[header] !== undefined ? row[header] : "");
    if (index > -1) sheet.getRange(index, 1, 1, headers.length).setValues([values]);
    else sheet.appendRow(values);
    return { ok: true, message: "Master jadwal berhasil disimpan.", data: { master: row } };
  } catch (e) {
    return { ok: false, message: "Gagal menyimpan master jadwal: " + e.message };
  }
}

function deleteScheduleMaster(masterId, currentUser) {
  try {
    requireSessionUser_(currentUser, { roles: ["Admin", "Mudir"] });
    const index = findRowIndexById_(SHEET_SCHEDULE_MASTERS, masterId);
    if (index < 1) return { ok: false, message: "Master jadwal tidak ditemukan." };
    const sheet = getSheet_(SHEET_SCHEDULE_MASTERS);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const activeCol = headers.indexOf("IsActive");
    if (activeCol > -1) sheet.getRange(index, activeCol + 1).setValue(false);
    return { ok: true, message: "Master jadwal dinonaktifkan." };
  } catch (e) {
    return { ok: false, message: "Gagal menonaktifkan master jadwal: " + e.message };
  }
}

function SCHEDULE_readSchedules_() {
  const sheet = getSheet_(SHEET_SCHEDULES);
  return sheet ? ATT_sheetToObjects_(sheet).map(ATT_normalizeSchedule_) : [];
}

function SCHEDULE_readMasters_() {
  const sheet = getSheet_(SHEET_SCHEDULE_MASTERS);
  return sheet ? ATT_sheetToObjects_(sheet).map((item) => ({ ...item, IsActive: item.IsActive !== false && String(item.IsActive).toLowerCase() !== "false" })) : [];
}

function SCHEDULE_readActiveStudents_() {
  const sheet = getSheet_("Students");
  if (!sheet) return [];
  return ATT_sheetToObjects_(sheet).filter((item) => {
    const status = String(item.Status || "Active").toLowerCase();
    return !item.DeletedAt && ["", "active", "aktif"].includes(status);
  });
}

function SCHEDULE_overlaps_(a, b) {
  return a.StartTime < b.EndTime && b.StartTime < a.EndTime;
}

function SCHEDULE_applyBulkChange_(item, operation, payload) {
  const next = Object.assign({}, item);
  if (operation === "move_day") next.DayOfWeek = String(payload.DayOfWeek || next.DayOfWeek);
  if (operation === "move_time") { next.StartTime = normalizeScheduleTime_(payload.StartTime || next.StartTime); next.EndTime = normalizeScheduleTime_(payload.EndTime || next.EndTime); }
  if (operation === "replace_teacher") { const identity = SCHEDULE_resolveTeacherIdentity_({ TeacherID: payload.TeacherID }); next.TeacherID = identity.Username; next.TeacherSourceID = identity.TeacherSourceID; }
  if (operation === "replace_class") next.ClassOrGroupName = String(payload.ClassOrGroupName || next.ClassOrGroupName);
  if (operation === "set_active") next.IsActive = payload.IsActive !== false;
  return next;
}

function SCHEDULE_buildBulkPreview_(ids, operation, payload) {
  const current = SCHEDULE_readSchedules_().filter((item) => ids.includes(String(item.ScheduleID)));
  return { operation, count: current.length, changes: current.map((item) => ({ before: item, after: SCHEDULE_applyBulkChange_(item, operation, payload) })) };
}

function SCHEDULE_masterSort_(a, b) { return Number(a.SortOrder || 999) - Number(b.SortOrder || 999) || SCHEDULE_naturalCompare_(a.Name, b.Name); }
function SCHEDULE_naturalCompare_(a, b) { return String(a || "").localeCompare(String(b || ""), "id", { numeric: true, sensitivity: "base" }); }

function getSchedules(currentUser) {
  try {
    requireSessionUser_(currentUser, { roles: ["Admin", "Mudir"] });
    const sheet = getSheet_(SHEET_SCHEDULES);
    if (!sheet) return { ok: true, data: { schedules: [] } };

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { ok: true, data: { schedules: [] } };

    const headers = data[0];
    const schedules = data.slice(1).map(row => {
      const raw = serializeRow(row, headers);
      // The admin editor must receive the same canonical time values as attendance.
      // Raw Spreadsheet time cells can otherwise arrive as 1899-12-30 ISO strings.
      return Object.assign({}, raw, ATT_normalizeSchedule_(raw));
    });

    return { ok: true, data: { schedules } };
  } catch (e) {
    return { ok: false, message: "Gagal memuat jadwal: " + e.message };
  }
}

function saveSchedule(payload, currentUser) {
  try {
    requireSessionUser_(currentUser, { roles: ["Admin", "Mudir"] });
    setupSheetWithHeaders_(SHEET_SCHEDULES, CORE_SHEET_SCHEMAS.Schedules);
    const sheet = getSheet_(SHEET_SCHEDULES);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    payload = payload || {};
    const scheduleId = payload.ScheduleID || "SCH" + Date.now() + Math.floor(Math.random() * 1000);
    const teacherIdentity = SCHEDULE_resolveTeacherIdentity_(payload);
    const rowData = {
      ScheduleID: scheduleId,
      Type: normalizeScheduleType_(payload.Type),
      TeacherID: teacherIdentity.Username,
      TeacherSourceID: teacherIdentity.TeacherSourceID,
      SubjectOrActivityName: String(payload.SubjectOrActivityName || "").trim(),
      ClassOrGroupName: String(payload.ClassOrGroupName || "").trim(),
      DayOfWeek: String(payload.DayOfWeek || "").trim(),
      StartTime: normalizeScheduleTime_(payload.StartTime || ""),
      EndTime: normalizeScheduleTime_(payload.EndTime || ""),
      IsActive: payload.IsActive !== undefined ? payload.IsActive : true,
    };

    if (!rowData.TeacherID || !rowData.SubjectOrActivityName || !rowData.ClassOrGroupName || !rowData.DayOfWeek) {
      return { ok: false, message: "Data jadwal tidak lengkap." };
    }
    if ((rowData.StartTime && !rowData.EndTime) || (!rowData.StartTime && rowData.EndTime)) {
      return { ok: false, message: "Jam mulai dan jam selesai harus diisi berpasangan." };
    }
    if (rowData.StartTime && rowData.EndTime && rowData.StartTime >= rowData.EndTime) {
      return { ok: false, message: "Jam selesai harus lebih besar daripada jam mulai." };
    }

    // Check for existing
    const existingIndex = findRowIndexById_(SHEET_SCHEDULES, scheduleId);

    const rowArray = headers.map(header => rowData[header] !== undefined ? rowData[header] : "");

    if (existingIndex > -1) {
      sheet.getRange(existingIndex, 1, 1, headers.length).setValues([rowArray]);
    } else {
      sheet.appendRow(rowArray);
    }
    if (typeof ATT_clearScheduleCache_ === "function") ATT_clearScheduleCache_(scheduleId);

    return { ok: true, message: "Jadwal berhasil disimpan.", data: { schedule: rowData } };
  } catch (e) {
    return { ok: false, message: "Gagal menyimpan jadwal: " + e.message };
  }
}

function normalizeScheduleType_(value) {
  const text = String(value || "").trim().toLowerCase();
  if (text === "pondok") return "Pondok";
  if (text === "kegiatan") return "Kegiatan";
  return "KBM";
}

function normalizeScheduleTime_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    const timezone = (typeof Session !== "undefined" && Session.getScriptTimeZone && Session.getScriptTimeZone()) || "Asia/Jakarta";
    return Utilities.formatDate(value, timezone, "HH:mm");
  }

  if (typeof value === "number" && isFinite(value)) {
    // Spreadsheet time-only cells can arrive as a fraction of one day.
    if (value >= 0 && value < 1) {
      const totalMinutes = Math.round(value * 24 * 60) % (24 * 60);
      return ("0" + Math.floor(totalMinutes / 60)).slice(-2) + ":" + ("0" + (totalMinutes % 60)).slice(-2);
    }
  }

  const text = String(value || "").trim();
  const clock = text.replace(".", ":").match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (clock) {
    const hour = Number(clock[1]);
    const minute = Number(clock[2]);
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return ("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2);
    }
  }

  // Old rows may contain an ISO representation of a Spreadsheet time cell.
  if (text && /\d{4}-\d{2}-\d{2}T/.test(text)) {
    const parsed = new Date(text);
    if (!isNaN(parsed.getTime())) {
      const timezone = (typeof Session !== "undefined" && Session.getScriptTimeZone && Session.getScriptTimeZone()) || "Asia/Jakarta";
      return Utilities.formatDate(parsed, timezone, "HH:mm");
    }
  }

  return text;
}

function deleteSchedule(scheduleId, currentUser) {
  try {
    requireSessionUser_(currentUser, { roles: ["Admin", "Mudir"] });
    const sheet = getSheet_(SHEET_SCHEDULES);
    const existingIndex = findRowIndexById_(SHEET_SCHEDULES, scheduleId);

    if (existingIndex > -1) {
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const activeColumn = headers.indexOf("IsActive");
      if (activeColumn !== -1) {
        // Jadwal dinonaktifkan agar riwayat sesi dan laporan lama tetap aman.
        sheet.getRange(existingIndex, activeColumn + 1).setValue(false);
      } else {
        sheet.deleteRow(existingIndex);
      }
      if (typeof ATT_clearScheduleCache_ === "function") ATT_clearScheduleCache_(scheduleId);
      return { ok: true, message: "Jadwal dinonaktifkan. Riwayat absensi tetap aman." };
    }

    return { ok: false, message: "Jadwal tidak ditemukan." };
  } catch (e) {
    return { ok: false, message: "Gagal menghapus jadwal: " + e.message };
  }
}

function SCHEDULE_resolveTeacherIdentity_(payload) {
  const teacherId = String(payload.TeacherID || "").trim();
  const requestedSourceId = String(payload.TeacherSourceID || "").trim();
  const users = typeof AUTH_getUsersByUsername_ === "function"
    ? AUTH_getUsersByUsername_()
    : [];
  const user = users.find((item) =>
    (payload.TeacherUserID && String(item.UserID || "") === String(payload.TeacherUserID)) ||
    normalizeUsername_(item.Username) === normalizeUsername_(teacherId),
  );
  const username = String(user && user.Username || teacherId).trim();
  const sourceId = String(
    user && user.TeacherSourceID ||
      requestedSourceId ||
      (typeof ATT_sourceIdForUsername_ === "function"
        ? ATT_sourceIdForUsername_(username)
        : ""),
  ).trim();
  return { Username: username, TeacherSourceID: sourceId };
}

/**
 * Smart Schedule & Curriculum Auto-Setup Importer
 * Parses raw schedule tables (TSV/CSV/Excel copy-paste), auto-classifies subjects,
 * and synchronizes schedules, academic subjects, and raport kitabs in a single batch.
 */
function importSmartSchedules(payload, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, { roles: ["Admin", "Mudir"] });
    payload = payload || {};
    const rawText = String(payload.rawText || "").trim();
    if (!rawText) {
      return { ok: false, message: "Data jadwal kosong. Silakan tempel (paste) tabel jadwal atau unggah file." };
    }

    // 1. Parsing Baris & Kolom Cerdas
    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      return { ok: false, message: "Data jadwal minimal harus memiliki 1 baris judul kolom (header) dan 1 baris data." };
    }

    // Deteksi Delimiter (Tab, Titik Koma, atau Koma)
    const firstLine = lines[0];
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const semiCount = (firstLine.match(/;/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    let delimiter = "\t";
    if (semiCount > tabCount && semiCount > commaCount) delimiter = ";";
    else if (commaCount > tabCount && commaCount > semiCount) delimiter = ",";

    function splitLine(line) {
      if (delimiter === "\t") return line.split("\t");
      if (delimiter === ";") return line.split(";");
      const pattern = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
      const res = [];
      let m;
      while ((m = pattern.exec(line)) !== null) {
        res.push(m[1].replace(/^"|"$/g, ''));
      }
      return res.length > 0 ? res : line.split(",");
    }

    const rawHeaders = splitLine(lines[0]).map(h => String(h || "").trim().toLowerCase());
    
    // Pemetaan Header Fleksibel (Header-Agnostic)
    const colMap = {};
    rawHeaders.forEach((h, idx) => {
      const clean = h.replace(/[^a-z0-9_]/g, '');
      if (["schedule_id", "id", "kode_jadwal", "scheduleid"].includes(clean)) colMap.schedule_id = idx;
      else if (["class_id", "id_kelas", "kode_kelas", "classid"].includes(clean)) colMap.class_id = idx;
      else if (["kelompok", "gender", "putra_putri", "ikhwan_akhwat", "group"].includes(clean)) colMap.kelompok = idx;
      else if (["kelas", "tingkat", "level", "grade", "jenjang"].includes(clean)) colMap.kelas = idx;
      else if (["classorgroupname", "rombel", "nama_kelas", "kelas_lengkap"].includes(clean)) colMap.classorgroupname = idx;
      else if (["hari", "day", "hari_belajar", "dayofweek"].includes(clean)) colMap.hari = idx;
      else if (["waktu", "jam", "time", "jam_pelajaran", "waktu_belajar", "period"].includes(clean)) colMap.waktu = idx;
      else if (["starttime", "jam_mulai", "mulai"].includes(clean)) colMap.starttime = idx;
      else if (["endtime", "jam_selesai", "selesai"].includes(clean)) colMap.endtime = idx;
      else if (["subject_id", "id_mapel", "kode_mapel", "subjectid"].includes(clean)) colMap.subject_id = idx;
      else if (["mata_pelajaran", "mapel", "subject", "pelajaran", "subjectoractivityname", "activityname"].includes(clean)) colMap.mata_pelajaran = idx;
      else if (["kode", "kode_singkat", "singkatan"].includes(clean)) colMap.kode = idx;
      else if (["teacher_id", "id_guru", "kode_guru", "teacherid"].includes(clean)) colMap.teacher_id = idx;
      else if (["pengajar", "guru", "ustadz", "ustadzah", "teacher", "nama_guru", "teachername"].includes(clean)) colMap.pengajar = idx;
      else if (["status", "isactive", "aktif"].includes(clean)) colMap.status = idx;
    });

    if (colMap.mata_pelajaran === undefined && colMap.subject_id === undefined) {
      return { ok: false, message: "Kolom nama mata pelajaran (contoh: mata_pelajaran, mapel, subject) tidak ditemukan dalam tabel." };
    }

    function parseTimeRange(waktuStr, startColVal, endColVal) {
      if (startColVal && endColVal) {
        return { start: normalizeScheduleTime_(startColVal), end: normalizeScheduleTime_(endColVal) };
      }
      const str = String(waktuStr || "").trim();
      const m = str.match(/(\d{1,2})[.:](\d{2})\s*[-–—to]+\s*(\d{1,2})[.:](\d{2})/);
      if (m) {
        const sH = String(m[1]).padStart(2, '0');
        const sM = m[2];
        const eH = String(m[3]).padStart(2, '0');
        const eM = m[4];
        return { start: sH + ":" + sM, end: eH + ":" + eM };
      }
      return { start: "07:00", end: "07:40" };
    }

    const parsedSchedules = [];
    const detectedClasses = new Set();
    const detectedSubjects = new Map();
    const detectedTeachers = new Map();

    for (let i = 1; i < lines.length; i++) {
      const parts = splitLine(lines[i]);
      if (!parts || parts.length === 0 || parts.every(p => !p.trim())) continue;

      const subName = String(parts[colMap.mata_pelajaran] || parts[colMap.subject_id] || "").trim();
      if (!subName) continue;

      let clsName = "";
      if (colMap.classorgroupname !== undefined && parts[colMap.classorgroupname]) {
        clsName = String(parts[colMap.classorgroupname]).trim();
      } else {
        const kls = colMap.kelas !== undefined ? String(parts[colMap.kelas] || "").trim() : "";
        const klp = colMap.kelompok !== undefined ? String(parts[colMap.kelompok] || "").trim() : "";
        if (kls && klp) clsName = kls + " " + klp;
        else if (kls) clsName = /^\d+$/.test(kls) ? "KELAS " + kls : kls;
        else if (klp) clsName = klp;
        else clsName = "Semua Kelas";
      }

      const hariRaw = colMap.hari !== undefined ? String(parts[colMap.hari] || "").trim() : "Senin";
      const hari = hariRaw.charAt(0).toUpperCase() + hariRaw.slice(1).toLowerCase();

      const waktuRaw = colMap.waktu !== undefined ? parts[colMap.waktu] : "";
      const startRaw = colMap.starttime !== undefined ? parts[colMap.starttime] : "";
      const endRaw = colMap.endtime !== undefined ? parts[colMap.endtime] : "";
      const times = parseTimeRange(waktuRaw, startRaw, endRaw);

      const teacherName = colMap.pengajar !== undefined ? String(parts[colMap.pengajar] || "").trim() : "";
      const teacherSourceId = colMap.teacher_id !== undefined ? String(parts[colMap.teacher_id] || "").trim() : "";
      const schedId = colMap.schedule_id !== undefined && parts[colMap.schedule_id] ? String(parts[colMap.schedule_id]).trim() : ("SCH-" + (i < 10 ? "00" : (i < 100 ? "0" : "")) + i);

      let teacherUsername = "";
      if (teacherName) {
        teacherUsername = teacherName.toLowerCase().replace(/^(ust\.|ustzh\.|ustadz\.|ustadzah\.|kyai|guru)\s*/i, '').replace(/[^a-z0-9]/g, '');
        if (!detectedTeachers.has(teacherName)) {
          detectedTeachers.set(teacherName, {
            name: teacherName,
            username: teacherUsername || ("ust_" + (detectedTeachers.size + 1)),
            sourceId: teacherSourceId || ("T" + String(detectedTeachers.size + 1).padStart(3, '0'))
          });
        }
      }

      detectedClasses.add(clsName);

      // Klasifikasi Jenjang (Tsanawiyyah 7-9 vs Aliyah 10-12)
      const numMatch = (clsName.match(/\b(7|8|9|10|11|12)\b/) || [])[0];
      const levelTier = (numMatch && Number(numMatch) >= 10) ? "Aliyah" : ((numMatch && Number(numMatch) <= 9) ? "Tsanawiyyah" : "Semua");

      if (!detectedSubjects.has(subName)) {
        detectedSubjects.set(subName, {
          name: subName,
          code: colMap.kode !== undefined ? String(parts[colMap.kode] || "").trim() : "",
          teachers: new Set(),
          classes: new Set(),
          levels: new Set()
        });
      }
      const subInfo = detectedSubjects.get(subName);
      if (teacherName) subInfo.teachers.add(teacherName);
      subInfo.classes.add(clsName);
      subInfo.levels.add(levelTier);

      parsedSchedules.push({
        ScheduleID: schedId,
        Type: "KBM",
        TeacherID: teacherUsername || teacherName || "Admin",
        TeacherSourceID: teacherSourceId || "",
        SubjectOrActivityName: subName,
        ClassOrGroupName: clsName,
        DayOfWeek: hari,
        StartTime: times.start,
        EndTime: times.end,
        IsActive: true
      });
    }

    if (parsedSchedules.length === 0) {
      return { ok: false, message: "Tidak ada baris jadwal yang valid dapat dibaca dari data yang dimasukkan." };
    }

    // Standar Pemetaan Kitab Kuning Otomatis Berdasarkan Rumpun & Jenjang
    const smartKitabMap = {};
    const subjectListPreview = [];

    detectedSubjects.forEach((info, subName) => {
      const isAliyahOnly = info.levels.has("Aliyah") && !info.levels.has("Tsanawiyyah");
      const isTsanawiyyahOnly = info.levels.has("Tsanawiyyah") && !info.levels.has("Aliyah");
      const isBoth = info.levels.has("Aliyah") && info.levels.has("Tsanawiyyah");

      let category = "Diniyyah";
      let recommendedKitab = "Kitab Standar";

      const low = subName.toLowerCase();
      if (low.includes("umum")) {
        category = "Umum";
        recommendedKitab = "Buku Paket Nasional";
      } else if (low.includes("aqidah") || low.includes("tauhid")) {
        category = "Diniyyah";
        recommendedKitab = isAliyahOnly ? "Jauharatut Tauhid / Tijanud Darori" : "Aqidatul Awam";
      } else if (low.includes("fiqh") || low.includes("fiqih")) {
        category = "Diniyyah";
        recommendedKitab = isAliyahOnly ? "Fathul Qorib" : "Safinatun Najah";
      } else if (low.includes("qawaid")) {
        category = "Diniyyah";
        recommendedKitab = "Al-Qawaidul Fiqhiyyah";
      } else if (low.includes("ushul")) {
        category = "Diniyyah";
        recommendedKitab = "Al-Waraqat";
      } else if (low.includes("faraid") || low.includes("waris")) {
        category = "Diniyyah";
        recommendedKitab = "Matan Rahabiyyah";
      } else if (low.includes("nahwu")) {
        category = "Diniyyah";
        recommendedKitab = isAliyahOnly ? "Alfiyah Ibnu Malik" : "Al-Ajurumiyyah";
      } else if (low.includes("shorof")) {
        category = "Diniyyah";
        recommendedKitab = "Amtsilatut Tashrifiyyah";
      } else if (low.includes("balaghah")) {
        category = "Diniyyah";
        recommendedKitab = "Jauharul Maknun";
      } else if (low.includes("tafsir")) {
        category = "Diniyyah";
        recommendedKitab = "Tafsir Jalalain";
      } else if (low.includes("hadits") && (low.includes("h.") || low.includes("hafalan"))) {
        category = "Diniyyah";
        recommendedKitab = "Hafalan 100 Hadits Shahih";
      } else if (low.includes("hadits")) {
        category = "Diniyyah";
        recommendedKitab = "Al-Arba'in An-Nawawiyyah";
      } else if (low.includes("doa")) {
        category = "Diniyyah";
        recommendedKitab = "Al-Adzkar An-Nawawiyyah";
      } else if (low.includes("tilawah") || low.includes("tajwid")) {
        category = "Diniyyah";
        recommendedKitab = "Tuhfatul Athfal";
      } else if (low.includes("siroh") || low.includes("tarikh")) {
        category = "Diniyyah";
        recommendedKitab = "Khulashoh Nuril Yaqin";
      } else if (low.includes("adab") || low.includes("akhlak")) {
        category = "Diniyyah";
        recommendedKitab = "Taisirul Khalaq";
      } else if (low.includes("kitabah") || low.includes("imla")) {
        category = "Diniyyah";
        recommendedKitab = "Qawa'idul Imla'";
      } else if (low.includes("arab")) {
        category = "Diniyyah";
        recommendedKitab = "Al-Arabiyyah Baina Yadaik";
      }

      smartKitabMap[subName] = recommendedKitab;

      // Jika mapel diajarkan di kedua jenjang, petakan kitab khusus Tsanawiyyah vs Aliyah
      if (isBoth) {
        if (low.includes("fiqh") || low.includes("fiqih")) {
          smartKitabMap["KELAS 10::" + subName] = "Fathul Qorib";
          smartKitabMap["KELAS 11::" + subName] = "Fathul Qorib";
          smartKitabMap["KELAS 12::" + subName] = "Fathul Qorib";
          smartKitabMap["KELAS 7::" + subName] = "Safinatun Najah";
          smartKitabMap["KELAS 8::" + subName] = "Safinatun Najah";
          smartKitabMap["KELAS 9::" + subName] = "Safinatun Najah";
        }
      }

      subjectListPreview.push({
        name: subName,
        code: info.code,
        category: category,
        levels: Array.from(info.levels).join(", "),
        classesCount: info.classes.size,
        teachers: Array.from(info.teachers).join(", "),
        recommendedKitab: recommendedKitab
      });
    });

    if (payload.previewOnly) {
      return {
        ok: true,
        preview: true,
        summary: {
          totalSchedules: parsedSchedules.length,
          totalClasses: detectedClasses.size,
          classes: Array.from(detectedClasses).sort((a,b)=>a.localeCompare(b,'id',{numeric:true})),
          totalSubjects: detectedSubjects.size,
          totalTeachers: detectedTeachers.size,
          teachers: Array.from(detectedTeachers.values())
        },
        subjects: subjectListPreview,
        previewRows: parsedSchedules.slice(0, 10)
      };
    }

    // 2. Mode Eksekusi Simpan ke Sheet Schedules
    setupSheetWithHeaders_(SHEET_SCHEDULES, CORE_SHEET_SCHEMAS.Schedules);
    const sheet = getSheet_(SHEET_SCHEDULES);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    if (payload.overwrite === true) {
      // Bersihkan jadwal lama jika mode overwrite aktif
      if (sheet.getLastRow() > 1) {
        sheet.deleteRows(2, sheet.getLastRow() - 1);
      }
    }

    const rowsToAppend = parsedSchedules.map(sch => {
      return headers.map(h => sch[h] !== undefined ? sch[h] : "");
    });

    if (rowsToAppend.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAppend.length, headers.length).setValues(rowsToAppend);
    }

    // 3. Jika syncAcademic aktif, sinkronkan ke Master Mapel & Setup Raport!
    if (payload.syncAcademic !== false) {
      // A. Simpan Pemetaan Kitab ke TenantProfile
      if (typeof SI_getTenantProfile_ === "function" && typeof saveRaportSetup === "function") {
        try {
          const tenantProfile = SI_getTenantProfile_(sessionUser);
          const updatedKitabMap = Object.assign({}, tenantProfile.kitabMap || {}, smartKitabMap);
          saveRaportSetup({
            kitabMap: updatedKitabMap
          }, sessionUser);
        } catch (tpErr) {
          console.warn("Gagal update kitabMap profil: " + tpErr.message);
        }
      }

      // B. Daftarkan ke Master Mapel AcademicSubjects jika ada sheetnya
      try {
        const academicSubjectsSheet = getSheet_("AcademicSubjects");
        if (academicSubjectsSheet) {
          const subHeaders = academicSubjectsSheet.getRange(1, 1, 1, academicSubjectsSheet.getLastColumn()).getValues()[0];
          const existingSubs = academicSubjectsSheet.getDataRange().getValues().slice(1);
          const nameCol = subHeaders.indexOf("Name") > -1 ? subHeaders.indexOf("Name") : subHeaders.indexOf("SubjectName");
          const existingNames = new Set(existingSubs.map(r => String(r[nameCol] || "").trim().toLowerCase()));

          const newSubRows = [];
          detectedSubjects.forEach((info, subName) => {
            if (!existingNames.has(subName.toLowerCase())) {
              const rowObj = {
                SubjectID: "SUB-" + subName.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 10),
                Name: subName,
                SubjectName: subName,
                Code: info.code,
                Category: subName.toLowerCase().includes("umum") ? "Umum" : "Diniyyah",
                Classes: Array.from(info.classes).join(", "),
                DefaultKKM: 70,
                IsActive: true
              };
              newSubRows.push(subHeaders.map(h => rowObj[h] !== undefined ? rowObj[h] : ""));
            }
          });
          if (newSubRows.length > 0) {
            academicSubjectsSheet.getRange(academicSubjectsSheet.getLastRow() + 1, 1, newSubRows.length, subHeaders.length).setValues(newSubRows);
          }
        }
      } catch (acErr) {
        console.warn("Sinkronisasi AcademicSubjects: " + acErr.message);
      }
    }

    if (typeof ATT_clearScheduleCache_ === "function") {
      parsedSchedules.forEach(s => ATT_clearScheduleCache_(s.ScheduleID));
    }

    return {
      ok: true,
      message: "Sukses! " + parsedSchedules.length + " jadwal pelajaran berhasil diimpor & kurikulum berhasil disinkronkan.",
      data: {
        totalSchedules: parsedSchedules.length,
        totalClasses: detectedClasses.size,
        totalSubjects: detectedSubjects.size,
        totalTeachers: detectedTeachers.size
      }
    };
  } catch (e) {
    return { ok: false, message: "Gagal mengimpor jadwal cerdas: " + e.message };
  }
}
