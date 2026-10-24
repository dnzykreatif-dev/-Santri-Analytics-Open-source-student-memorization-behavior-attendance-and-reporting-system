function getStudentLinks(studentId) {
  const sheet = getSheet_("HafalanLinks");
  if (!sheet) return { ok: true, data: { links: [] } };

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { ok: true, data: { links: [] } };

  const headers = data[0];
  const links = data
    .slice(1)
    .filter((row) => row[1] === studentId)
    .map((row) => serializeRow(row, headers))
    .sort((a, b) => new Date(b.DateAdded) - new Date(a.DateAdded));

  return { ok: true, data: { links } };
}

function addHafalanLink(data, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin", "Ustadz"],
  });
  requireProductModuleEnabled_("memorization", sessionUser);
  const sheet = getSheet_("HafalanLinks");

  if (!data || !data.StudentID || !data.URL) {
    return { ok: false, message: "Data link tidak lengkap." };
  }

  sheet.appendRow([
    "LNK" + Date.now(),
    data.StudentID,
    new Date().toISOString(),
    data.Title || "Link Hafalan",
    data.URL,
    data.Type || "Rekaman",
    sessionUser.Username || data.TeacherID || "System",
  ]);
  bumpStudentDataRevision_();
  AUTH_appendAuditLog_("CREATE", "HafalanLink", data.StudentID, sessionUser, {
    type: data.Type || "Rekaman",
  });

  return { ok: true, message: "Link berhasil disimpan." };
}

function updateHafalanLink(linkId, data, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin", "Ustadz"],
  });
  requireProductModuleEnabled_("memorization", sessionUser);
  const row = findRowIndexById_("HafalanLinks", linkId);
  if (row === -1) return { ok: false, message: "Link tidak ditemukan." };

  const sheet = getSheet_("HafalanLinks");
  sheet.getRange(row, 4, 1, 3).setValues([[data.Title, data.URL, data.Type]]);
  bumpStudentDataRevision_();
  AUTH_appendAuditLog_("UPDATE", "HafalanLink", linkId, sessionUser, {
    title: data.Title,
  });

  return { ok: true, message: "Link berhasil diupdate." };
}

function deleteHafalanLink(linkId, currentUser) {
  const sessionUser = requireSessionUser_(currentUser, {
    roles: ["Mudir", "Admin", "Ustadz"],
  });
  requireProductModuleEnabled_("memorization", sessionUser);
  const row = findRowIndexById_("HafalanLinks", linkId);
  if (row === -1) return { ok: false, message: "Link tidak ditemukan." };

  const sheet = getSheet_("HafalanLinks");
  sheet.deleteRow(row);
  bumpStudentDataRevision_();
  AUTH_appendAuditLog_("DELETE", "HafalanLink", linkId, sessionUser, {});
  return { ok: true, message: "Link berhasil dihapus." };
}
