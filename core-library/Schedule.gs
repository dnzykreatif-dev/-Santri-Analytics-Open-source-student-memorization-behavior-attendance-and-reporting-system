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
