const SHEET_PESANTREN_INFO = "PesantrenInfo";
const PESANTREN_INFO_HEADERS = [
  "InfoID",
  "Title",
  "Category",
  "Summary",
  "Content",
  "DisplayDate",
  "EventDate",
  "EndDate",
  "Location",
  "Priority",
  "IsPinned",
  "Audience",
  "Status",
  "AttachmentTitle",
  "AttachmentURL",
  "ContactName",
  "ContactPhone",
  "CreatedBy",
  "CreatedAt",
  "UpdatedBy",
  "UpdatedAt",
];

const PESANTREN_INFO_CATEGORIES = [
  "Pengumuman",
  "Kalender Pendidikan",
  "Kegiatan Pondok",
  "Panduan Wali",
  "Kontak",
  "Dokumen",
];

const PESANTREN_INFO_AUDIENCES = ["Semua", "Wali", "Internal"];
const PESANTREN_INFO_STATUSES = ["Draft", "Published", "Archived"];
const PESANTREN_INFO_PRIORITIES = ["Normal", "Sedang", "Tinggi"];

function PI_text_(value) {
  return String(value || "").trim();
}

function PI_bool_(value) {
  if (typeof value === "boolean") return value;
  const normalized = PI_text_(value).toLowerCase();
  return ["true", "1", "yes", "y", "on"].includes(normalized);
}

function PI_dateOnly_(value) {
  if (!value) return "";
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  const text = PI_text_(value);
  if (!text) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  const date = new Date(text);
  if (isNaN(date.getTime())) return text;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function PI_timestamp_(value) {
  if (!value) return 0;
  const date = value instanceof Date ? value : new Date(value);
  const time = date.getTime();
  return isNaN(time) ? 0 : time;
}

function PI_autoSummary_(title, summary, content) {
  const baseSummary = PI_text_(summary);
  if (baseSummary) {
    return baseSummary.length > 180
      ? baseSummary.slice(0, 177).trim() + "..."
      : baseSummary;
  }

  const contentText = PI_text_(content).replace(/\s+/g, " ");
  if (contentText) {
    return contentText.length > 180
      ? contentText.slice(0, 177).trim() + "..."
      : contentText;
  }

  return PI_text_(title);
}

function PI_generateId_() {
  return "INF" + Date.now();
}

function PI_getSheet_() {
  setupSheetWithHeaders_(SHEET_PESANTREN_INFO, PESANTREN_INFO_HEADERS);
  return getSheet_(SHEET_PESANTREN_INFO);
}

function PI_objectToRow_(obj, headers) {
  return headers.map((header) =>
    obj[header] !== undefined ? obj[header] : "",
  );
}

function PI_canView_(currentUser) {
  return (
    currentUser &&
    ["Mudir", "Admin", "Ustadz", "Wali"].includes(currentUser.Role)
  );
}

function PI_canManage_(currentUser) {
  return (
    currentUser &&
    ["Mudir", "Admin", "Ustadz"].includes(currentUser.Role)
  );
}

function PI_isPublishedAudience_(item) {
  const status = PI_text_(item.Status || "Draft");
  const audience = PI_text_(item.Audience || "Semua");
  return status === "Published" && (audience === "Semua" || audience === "Wali");
}

function PI_isPublicAudience_(item) {
  const status = PI_text_(item.Status || "Draft");
  const audience = PI_text_(item.Audience || "Semua");
  return status === "Published" && audience === "Semua";
}

function PI_normalizeItem_(item) {
  const normalized = { ...item };
  normalized.IsPinned = PI_bool_(normalized.IsPinned);
  normalized.DisplayDate = PI_dateOnly_(normalized.DisplayDate);
  normalized.EventDate = PI_dateOnly_(normalized.EventDate);
  normalized.EndDate = PI_dateOnly_(normalized.EndDate);
  normalized.CreatedAt = normalized.CreatedAt || "";
  normalized.UpdatedAt = normalized.UpdatedAt || "";
  normalized.Priority = PI_text_(normalized.Priority) || "Normal";
  normalized.Audience = PI_text_(normalized.Audience) || "Semua";
  normalized.Status = PI_text_(normalized.Status) || "Draft";
  normalized.Category = PI_text_(normalized.Category) || "Pengumuman";
  normalized.Summary = PI_text_(normalized.Summary);
  normalized.Content = PI_text_(normalized.Content);
  normalized.Location = PI_text_(normalized.Location);
  normalized.AttachmentTitle = PI_text_(normalized.AttachmentTitle);
  normalized.AttachmentURL = PI_text_(normalized.AttachmentURL);
  normalized.ContactName = PI_text_(normalized.ContactName);
  normalized.ContactPhone = PI_text_(normalized.ContactPhone);
  normalized.IsPublished = normalized.Status === "Published";
  normalized.IsDraft = normalized.Status === "Draft";
  normalized.IsArchived = normalized.Status === "Archived";
  return normalized;
}

function PI_publicUrl_(value) {
  const url = PI_text_(value);
  return /^https?:\/\//i.test(url) ? url : "";
}

function PI_publicItem_(item) {
  return {
    InfoID: item.InfoID,
    Title: item.Title,
    Category: item.Category,
    Summary: item.Summary,
    Content: item.Content,
    DisplayDate: item.DisplayDate,
    EventDate: item.EventDate,
    EndDate: item.EndDate,
    Location: item.Location,
    Priority: item.Priority,
    IsPinned: item.IsPinned,
    AttachmentTitle: item.AttachmentTitle,
    AttachmentURL: PI_publicUrl_(item.AttachmentURL),
    ContactName: item.ContactName,
    ContactPhone: item.ContactPhone,
  };
}

function PI_sortItems_(items) {
  return items.sort((a, b) => {
    if (a.IsPinned !== b.IsPinned) {
      return a.IsPinned ? -1 : 1;
    }

    if (a.Status !== b.Status) {
      const statusOrder = { Published: 3, Draft: 2, Archived: 1 };
      return (statusOrder[b.Status] || 0) - (statusOrder[a.Status] || 0);
    }

    const aDate = PI_timestamp_(a.UpdatedAt || a.DisplayDate || a.EventDate || a.CreatedAt);
    const bDate = PI_timestamp_(b.UpdatedAt || b.DisplayDate || b.EventDate || b.CreatedAt);
    return bDate - aDate;
  });
}

function PI_buildSummary_(items) {
  const published = items.filter((item) => item.Status === "Published").length;
  const draft = items.filter((item) => item.Status === "Draft").length;
  const archived = items.filter((item) => item.Status === "Archived").length;
  const pinned = items.filter((item) => item.IsPinned).length;
  const upcoming = items.filter((item) => {
    const eventDate = PI_timestamp_(item.EventDate);
    if (!eventDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today.getTime();
  }).length;

  return {
    total: items.length,
    published,
    draft,
    archived,
    pinned,
    upcoming,
  };
}

function PI_getVisibleItems_(currentUser, filters) {
  const sheet = PI_getSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    return [];
  }

  const headers = values[0];
  const allItems = values
    .slice(1)
    .filter((row) => row.some((cell) => cell !== "" && cell !== null))
    .map((row) => PI_normalizeItem_(serializeRow(row, headers)));

  let items = allItems.filter((item) => {
    if (PI_canManage_(currentUser)) {
      return true;
    }
    return PI_isPublishedAudience_(item);
  });

  const category = PI_text_(filters && filters.Category);
  const status = PI_text_(filters && filters.Status);
  const audience = PI_text_(filters && filters.Audience);
  const search = PI_text_(filters && filters.Search).toLowerCase();
  const pinnedOnly = PI_bool_(filters && filters.PinnedOnly);

  if (category) {
    items = items.filter((item) => item.Category === category);
  }

  if (status) {
    items = items.filter((item) => item.Status === status);
  } else if (!PI_canManage_(currentUser)) {
    items = items.filter((item) => item.Status === "Published");
  }

  if (audience) {
    items = items.filter((item) => item.Audience === audience);
  }

  if (search) {
    items = items.filter((item) => {
      const haystack = [
        item.Title,
        item.Summary,
        item.Content,
        item.Category,
        item.Location,
        item.AttachmentTitle,
        item.ContactName,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }

  if (pinnedOnly) {
    items = items.filter((item) => item.IsPinned);
  }

  return PI_sortItems_(items);
}

function getPesantrenInfo(currentUser, filters) {
  try {
    if (!PI_canView_(currentUser)) {
      return { ok: false, message: "Akses ditolak." };
    }

    const sheet = PI_getSheet_();
    const data = sheet.getDataRange().getValues();
    const headers = data.length > 0 ? data[0] : PESANTREN_INFO_HEADERS;
    const allItems = data.length <= 1
      ? []
      : data
          .slice(1)
          .filter((row) => row.some((cell) => cell !== "" && cell !== null))
          .map((row) => PI_normalizeItem_(serializeRow(row, headers)));

    const visibleItems = PI_getVisibleItems_(currentUser, filters);
    const summary = PI_buildSummary_(allItems.filter((item) => {
      if (PI_canManage_(currentUser)) return true;
      return PI_isPublishedAudience_(item);
    }));

    return {
      ok: true,
      data: {
        items: visibleItems,
        summary,
        canManage: PI_canManage_(currentUser),
        categories: PESANTREN_INFO_CATEGORIES,
        audiences: PESANTREN_INFO_AUDIENCES,
        statuses: PESANTREN_INFO_STATUSES,
        priorities: PESANTREN_INFO_PRIORITIES,
        visibleCount: visibleItems.length,
      },
      message: "Data informasi pesantren berhasil dimuat.",
    };
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

function getPublicPesantrenInfo(filters) {
  try {
    const sheet = PI_getSheet_();
    const values = sheet.getDataRange().getValues();
    const headers = values.length > 0 ? values[0] : PESANTREN_INFO_HEADERS;
    let items = values.length <= 1
      ? []
      : values
          .slice(1)
          .filter((row) => row.some((cell) => cell !== "" && cell !== null))
          .map((row) => PI_normalizeItem_(serializeRow(row, headers)))
          .filter((item) => PI_isPublicAudience_(item));

    const category = PI_text_(filters && filters.Category);
    const search = PI_text_(filters && filters.Search).toLowerCase();
    const pinnedOnly = PI_bool_(filters && filters.PinnedOnly);

    if (category) {
      items = items.filter((item) => item.Category === category);
    }

    if (search) {
      items = items.filter((item) => {
        const haystack = [
          item.Title,
          item.Summary,
          item.Content,
          item.Category,
          item.Location,
          item.AttachmentTitle,
          item.ContactName,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    if (pinnedOnly) {
      items = items.filter((item) => item.IsPinned);
    }

    items = PI_sortItems_(items);
    const summary = PI_buildSummary_(items);

    return {
      ok: true,
      data: {
        items: items.map((item) => PI_publicItem_(item)),
        summary,
        categories: PESANTREN_INFO_CATEGORIES,
        visibleCount: items.length,
      },
      message: "Data informasi publik pesantren berhasil dimuat.",
    };
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

function PI_findExistingRow_(sheet, infoId) {
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return -1;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0] || "") === String(infoId || "")) {
      return i + 1;
    }
  }
  return -1;
}

function PI_buildRecord_(payload, currentUser, existing) {
  const now = new Date().toISOString();
  const title = PI_text_(payload.Title);
  const content = PI_text_(payload.Content);
  const summary = PI_autoSummary_(title, payload.Summary, content);
  const status = PI_text_(payload.Status) || "Published";
  const priority = PI_text_(payload.Priority) || "Normal";
  const audience = PI_text_(payload.Audience) || "Semua";

  return {
    InfoID: existing ? existing.InfoID : PI_generateId_(),
    Title: title,
    Category: PI_text_(payload.Category) || "Pengumuman",
    Summary: summary,
    Content: content,
    DisplayDate: PI_dateOnly_(payload.DisplayDate),
    EventDate: PI_dateOnly_(payload.EventDate),
    EndDate: PI_dateOnly_(payload.EndDate),
    Location: PI_text_(payload.Location),
    Priority: priority,
    IsPinned: PI_bool_(payload.IsPinned),
    Audience: audience,
    Status: status,
    AttachmentTitle: PI_text_(payload.AttachmentTitle),
    AttachmentURL: PI_text_(payload.AttachmentURL),
    ContactName: PI_text_(payload.ContactName),
    ContactPhone: PI_text_(payload.ContactPhone),
    CreatedBy: existing ? existing.CreatedBy || "" : currentUser.Name || currentUser.Username || "",
    CreatedAt: existing ? existing.CreatedAt || now : now,
    UpdatedBy: currentUser.Name || currentUser.Username || "",
    UpdatedAt: now,
  };
}

function savePesantrenInfo(payload, currentUser) {
  try {
    if (!PI_canManage_(currentUser)) {
      return {
        ok: false,
        message: "Akses ditolak. Hanya Mudir/Admin/Ustadz yang dapat mengelola informasi.",
      };
    }

    payload = payload || {};
    if (!PI_text_(payload.Title)) {
      return { ok: false, message: "Judul informasi wajib diisi." };
    }
    if (!PI_text_(payload.Category)) {
      return { ok: false, message: "Kategori informasi wajib dipilih." };
    }
    if (!PI_text_(payload.Content)) {
      return { ok: false, message: "Isi informasi wajib diisi." };
    }

    const sheet = PI_getSheet_();
    const values = sheet.getDataRange().getValues();
    let existing = null;
    let rowNumber = -1;

    if (PI_text_(payload.InfoID)) {
      rowNumber = PI_findExistingRow_(sheet, payload.InfoID);
      if (rowNumber !== -1 && values.length > 1) {
        existing = serializeRow(values[rowNumber - 1], values[0]);
      }
    }

    const record = PI_buildRecord_(payload, currentUser, existing);

    if (rowNumber === -1) {
      sheet.appendRow(PI_objectToRow_(record, PESANTREN_INFO_HEADERS));
    } else {
      sheet
        .getRange(rowNumber, 1, 1, PESANTREN_INFO_HEADERS.length)
        .setValues([PI_objectToRow_(record, PESANTREN_INFO_HEADERS)]);
    }

    return {
      ok: true,
      data: { item: PI_normalizeItem_(record) },
      message: existing
        ? "Informasi pesantren berhasil diperbarui."
        : "Informasi pesantren berhasil disimpan.",
    };
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

function setPesantrenInfoStatus(infoId, status, currentUser) {
  try {
    if (!PI_canManage_(currentUser)) {
      return {
        ok: false,
        message: "Akses ditolak. Hanya Mudir/Admin/Ustadz yang dapat mengubah status.",
      };
    }

    if (PESANTREN_INFO_STATUSES.indexOf(status) === -1) {
      return { ok: false, message: "Status tidak valid." };
    }

    const sheet = PI_getSheet_();
    const rowNumber = PI_findExistingRow_(sheet, infoId);
    if (rowNumber === -1) {
      return { ok: false, message: "Informasi tidak ditemukan." };
    }

    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const row = serializeRow(values[rowNumber - 1], headers);
    row.Status = status;
    row.UpdatedBy = currentUser.Name || currentUser.Username || "";
    row.UpdatedAt = new Date().toISOString();

    sheet
      .getRange(rowNumber, 1, 1, PESANTREN_INFO_HEADERS.length)
      .setValues([PI_objectToRow_(row, PESANTREN_INFO_HEADERS)]);

    return {
      ok: true,
      data: { item: PI_normalizeItem_(row) },
      message: "Status informasi berhasil diperbarui.",
    };
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

function deletePesantrenInfo(infoId, currentUser) {
  try {
    if (!PI_canManage_(currentUser)) {
      return {
        ok: false,
        message: "Akses ditolak. Hanya Mudir/Admin/Ustadz yang dapat menghapus informasi.",
      };
    }

    const sheet = PI_getSheet_();
    const rowNumber = PI_findExistingRow_(sheet, infoId);
    if (rowNumber === -1) {
      return { ok: false, message: "Informasi tidak ditemukan." };
    }

    sheet.deleteRow(rowNumber);
    return {
      ok: true,
      message: "Informasi pesantren berhasil dihapus.",
    };
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}
