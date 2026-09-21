const SHEET_SCHEDULES = "Schedules";

function getSchedules(currentUser) {
  try {
    requireSessionUser_(currentUser, { roles: ["Admin", "Mudir"] });
    const sheet = getSheet_(SHEET_SCHEDULES);
    if (!sheet) return { ok: true, data: { schedules: [] } };

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { ok: true, data: { schedules: [] } };

    const headers = data[0];
    const schedules = data.slice(1).map(row => serializeRow(row, headers));

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
      SubjectOrActivityName: payload.SubjectOrActivityName,
      ClassOrGroupName: payload.ClassOrGroupName,
      DayOfWeek: payload.DayOfWeek,
      StartTime: normalizeScheduleTime_(payload.StartTime || ""),
      EndTime: normalizeScheduleTime_(payload.EndTime || ""),
      IsActive: payload.IsActive !== undefined ? payload.IsActive : true,
    };

    if (!rowData.TeacherID || !rowData.SubjectOrActivityName || !rowData.ClassOrGroupName || !rowData.DayOfWeek) {
      return { ok: false, message: "Data jadwal tidak lengkap." };
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
  return String(value || "").trim().replace(".", ":");
}

function deleteSchedule(scheduleId, currentUser) {
  try {
    requireSessionUser_(currentUser, { roles: ["Admin", "Mudir"] });
    const sheet = getSheet_(SHEET_SCHEDULES);
    const existingIndex = findRowIndexById_(SHEET_SCHEDULES, scheduleId);

    if (existingIndex > -1) {
      sheet.deleteRow(existingIndex);
      if (typeof ATT_clearScheduleCache_ === "function") ATT_clearScheduleCache_(scheduleId);
      return { ok: true, message: "Jadwal berhasil dihapus." };
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
