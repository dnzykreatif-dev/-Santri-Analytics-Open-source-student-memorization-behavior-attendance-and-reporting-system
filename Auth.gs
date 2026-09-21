const SHEET_SESSIONS = "Sessions";
const SHEET_AUDIT_LOGS = "AuditLogs";
const SESSION_HEADERS = [
  "SessionID",
  "TokenHash",
  "UserID",
  "Username",
  "Role",
  "CreatedAt",
  "ExpiresAt",
  "LastSeenAt",
  "RevokedAt",
];
const AUDIT_LOG_HEADERS = [
  "AuditID",
  "Action",
  "EntityType",
  "EntityID",
  "Username",
  "Role",
  "Payload",
  "CreatedAt",
];
const AUTH_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const AUTH_LOGIN_WINDOW_MS = 15 * 60 * 1000;
const AUTH_LOGIN_MAX_FAILURES = 5;
const AUTH_LOGIN_CACHE_PREFIX = "auth:login:";
const AUTH_SESSION_CACHE_PREFIX = "auth:session:";

function login(username, password) {
  const inputUsername = String(username || "").trim();
  if (!inputUsername || !String(password || "").trim()) {
    return { ok: false, message: "Username dan Password wajib diisi." };
  }

  const loginThrottle = AUTH_getLoginThrottle_(inputUsername);
  if (loginThrottle.blocked) {
    return {
      ok: false,
      message:
        "Terlalu banyak percobaan login. Coba lagi setelah beberapa menit.",
    };
  }

  const result = loginWithSalt(username, password);
  if (!result.ok || !result.user) {
    AUTH_registerLoginFailure_(inputUsername);
    return result;
  }

  AUTH_clearLoginThrottle_(inputUsername);
  const session = AUTH_issueSession_(result.user);
  AUTH_appendAuditLog_("LOGIN", "Session", session.SessionID, session.user, {
    source: "login",
  });

  return {
    ok: true,
    user: session.user,
    message: "Login berhasil.",
  };
}

function logoutSession(currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, { allowAnonymous: true });
    if (!sessionUser || !sessionUser.SessionToken) {
      return { ok: true, message: "Sesi sudah selesai." };
    }

    const revoked = AUTH_revokeSession_(sessionUser.SessionToken, {
      reason: "logout",
    });
    if (revoked) {
      AUTH_appendAuditLog_("LOGOUT", "Session", revoked.SessionID, sessionUser, {
        source: "logout",
      });
    }

    return { ok: true, message: "Logout berhasil." };
  } catch (e) {
    return { ok: true, message: "Sesi sudah selesai." };
  }
}

function AUTH_hashToken_(token) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(token || ""),
  );
  return bytes
    .map(function (b) {
      const v = (b < 0 ? b + 256 : b).toString(16);
      return v.length === 1 ? "0" + v : v;
    })
    .join("");
}

function AUTH_generateSessionToken_() {
  return Utilities.getUuid() + Utilities.getUuid();
}

function AUTH_nowIso_() {
  return new Date().toISOString();
}

function AUTH_getSessionSheet_() {
  setupSheetWithHeaders_(SHEET_SESSIONS, SESSION_HEADERS);
  return getSheet_(SHEET_SESSIONS);
}

function AUTH_getAuditSheet_() {
  setupSheetWithHeaders_(SHEET_AUDIT_LOGS, AUDIT_LOG_HEADERS);
  return getSheet_(SHEET_AUDIT_LOGS);
}

function AUTH_getUsersByUsername_() {
  const sheet = getSheet_(SHEET_USERS);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  const headers = values[0];
  return values.slice(1).map((row) => serializeRow(row, headers));
}

function AUTH_findUserRecord_(username) {
  const normalized = normalizeUsername_(username);
  if (!normalized) return null;
  const users = AUTH_getUsersByUsername_();
  return (
    users.find(
      (row) => normalizeUsername_(row.Username) === normalized,
    ) || null
  );
}

function AUTH_findUserRecordById_(userId) {
  const normalized = String(userId || "").trim();
  if (!normalized) return null;
  return (
    AUTH_getUsersByUsername_().find(
      (row) => String(row.UserID || "").trim() === normalized,
    ) || null
  );
}

function AUTH_safeUser_(user, sessionData) {
  sessionData = sessionData || {};
  return {
    Username: String(user && user.Username ? user.Username : ""),
    Name: String(user && user.Name ? user.Name : ""),
    Role: String(user && user.Role ? user.Role : "Wali"),
    Email: String(user && user.Email ? user.Email : ""),
    Phone: String(user && user.Phone ? user.Phone : ""),
    StudentID: String(user && user.StudentID ? user.StudentID : ""),
    Class: String(user && user.Class ? user.Class : ""),
    TeacherSourceID: String(
      user && user.TeacherSourceID ? user.TeacherSourceID : "",
    ),
    UserID: String(user && user.UserID ? user.UserID : ""),
    Status: String(user && user.Status ? user.Status : "Active"),
    SessionToken: String(sessionData.SessionToken || ""),
    SessionExpiresAt: String(sessionData.SessionExpiresAt || ""),
  };
}

function AUTH_issueSession_(user) {
  const sessionSheet = AUTH_getSessionSheet_();
  const token = AUTH_generateSessionToken_();
  const tokenHash = AUTH_hashToken_(token);
  const expiresAt = new Date(Date.now() + AUTH_SESSION_TTL_MS).toISOString();
  const now = AUTH_nowIso_();
  const sessionId = "SES" + Utilities.getUuid().slice(0, 12).toUpperCase();

  const sessionRow = [
    sessionId,
    tokenHash,
    String(user && user.UserID ? user.UserID : ""),
    String(user && user.Username ? user.Username : ""),
    String(user && user.Role ? user.Role : ""),
    now,
    expiresAt,
    now,
    "",
  ];

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sessionSheet.appendRow(sessionRow);
  } finally {
    lock.releaseLock();
  }

  const safeUser = AUTH_safeUser_(user, {
    SessionToken: token,
    SessionExpiresAt: expiresAt,
  });

  return {
    SessionID: sessionId,
    SessionToken: token,
    SessionExpiresAt: expiresAt,
    user: safeUser,
  };
}

function AUTH_findSessionByToken_(token) {
  const tokenText = String(token || "").trim();
  if (!tokenText) return null;

  const cache = CacheService.getScriptCache();
  const cacheKey = AUTH_SESSION_CACHE_PREFIX + AUTH_hashToken_(tokenText);
  const cached = cache.get(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.SessionID) {
        return parsed;
      }
    } catch (e) {}
  }

  const sessionSheet = getSheet_(SHEET_SESSIONS);
  if (!sessionSheet) return null;
  const data = sessionSheet.getDataRange().getValues();
  if (data.length <= 1) return null;
  const headers = data[0];
  const rows = data.slice(1).map((row) => serializeRow(row, headers));
  const tokenHash = AUTH_hashToken_(tokenText);
  const now = Date.now();

  const session = rows.find((row) => {
    if (String(row.TokenHash || "") !== tokenHash) return false;
    if (String(row.RevokedAt || "").trim()) return false;
    const expiresAt = new Date(row.ExpiresAt || 0).getTime();
    return !isNaN(expiresAt) && expiresAt > now;
  });

  if (session) {
    cache.put(cacheKey, JSON.stringify(session), 300);
  }

  return session || null;
}

function AUTH_revokeSession_(token, meta = {}) {
  const sessionSheet = getSheet_(SHEET_SESSIONS);
  if (!sessionSheet) return null;
  const data = sessionSheet.getDataRange().getValues();
  if (data.length <= 1) return null;

  const headers = data[0];
  const rows = data.slice(1);
  const tokenHash = AUTH_hashToken_(token);
  const sessionIndex = headers.indexOf("TokenHash");
  const revokedIndex = headers.indexOf("RevokedAt");
  const lastSeenIndex = headers.indexOf("LastSeenAt");

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (String(row[sessionIndex] || "") !== tokenHash) {
      continue;
    }
    if (revokedIndex !== -1) {
      row[revokedIndex] = AUTH_nowIso_();
    }
    if (lastSeenIndex !== -1) {
      row[lastSeenIndex] = AUTH_nowIso_();
    }
    sessionSheet.getRange(i + 2, 1, 1, headers.length).setValues([row]);
    const session = serializeRow(row, headers);
    CacheService.getScriptCache().remove(
      AUTH_SESSION_CACHE_PREFIX + tokenHash,
    );
    return session;
  }

  return null;
}

function AUTH_revokeAllSessionsForUsername_(username, meta = {}) {
  const sessionSheet = getSheet_(SHEET_SESSIONS);
  if (!sessionSheet) return 0;
  const data = sessionSheet.getDataRange().getValues();
  if (data.length <= 1) return 0;

  const headers = data[0];
  const rows = data.slice(1);
  const usernameIndex = headers.indexOf("Username");
  const revokedIndex = headers.indexOf("RevokedAt");
  const now = AUTH_nowIso_();
  let count = 0;

  rows.forEach((row, index) => {
    if (String(row[usernameIndex] || "") !== String(username || "").trim()) {
      return;
    }
    if (!String(row[revokedIndex] || "").trim()) {
      row[revokedIndex] = now;
      sessionSheet.getRange(index + 2, 1, 1, headers.length).setValues([row]);
      CacheService.getScriptCache().remove(
        AUTH_SESSION_CACHE_PREFIX + String(row[1] || ""),
      );
      count++;
    }
  });

  return count;
}

function resolveSessionUser_(currentUser, options = {}) {
  const allowAnonymous = !!options.allowAnonymous;
  const token =
    currentUser &&
    (currentUser.SessionToken ||
      currentUser.sessionToken ||
      currentUser.Token ||
      currentUser.AuthToken ||
      "");

  if (!token) {
    return allowAnonymous ? null : null;
  }

  const session = AUTH_findSessionByToken_(token);
  if (!session) {
    return allowAnonymous ? null : null;
  }

  const latestUser =
    AUTH_findUserRecordById_(session.UserID) ||
    AUTH_findUserRecord_(session.Username);
  if (!latestUser) {
    return allowAnonymous ? null : null;
  }

  const status = String(latestUser.Status || "").toLowerCase().trim();
  if (status === "inactive" || status === "nonaktif") {
    return allowAnonymous ? null : null;
  }

  return AUTH_safeUser_(latestUser, {
    SessionToken: token,
    SessionExpiresAt: session.ExpiresAt,
  });
}

function resumeSession(currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser);
    return { ok: true, data: { user: sessionUser }, user: sessionUser };
  } catch (e) {
    return { ok: false, message: "Sesi login tidak valid. Silakan login ulang." };
  }
}

function requireSessionUser_(currentUser, options = {}) {
  const allowAnonymous = !!options.allowAnonymous;
  const roles = Array.isArray(options.roles) ? options.roles : null;
  const sessionUser = resolveSessionUser_(currentUser, { allowAnonymous });

  if (!sessionUser) {
    if (allowAnonymous) {
      return null;
    }
    throw new Error("Sesi login tidak valid. Silakan login ulang.");
  }

  if (roles && roles.length > 0 && !roles.includes(sessionUser.Role)) {
    throw new Error("Akses ditolak.");
  }

  return sessionUser;
}

function AUTH_appendAuditLog_(action, entityType, entityId, actor, payload) {
  try {
    const sheet = AUTH_getAuditSheet_();
    const now = AUTH_nowIso_();
    sheet.appendRow([
      "AUD" + Utilities.getUuid().slice(0, 12).toUpperCase(),
      action || "",
      entityType || "",
      entityId || "",
      actor && actor.Username ? actor.Username : "",
      actor && actor.Role ? actor.Role : "",
      payload ? JSON.stringify(payload) : "",
      now,
    ]);
  } catch (e) {}
}

function AUTH_getLoginThrottle_(username) {
  const cache = CacheService.getScriptCache();
  const cacheKey = AUTH_LOGIN_CACHE_PREFIX + String(username || "").toLowerCase();
  const raw = cache.get(cacheKey);
  if (!raw) {
    return { blocked: false, attempts: 0, windowStartedAt: 0 };
  }

  try {
    const parsed = JSON.parse(raw);
    const attempts = Number(parsed.attempts || 0);
    const windowStartedAt = Number(parsed.windowStartedAt || 0);
    const isBlocked =
      attempts >= AUTH_LOGIN_MAX_FAILURES &&
      Date.now() - windowStartedAt < AUTH_LOGIN_WINDOW_MS;
    return {
      blocked: isBlocked,
      attempts,
      windowStartedAt,
    };
  } catch (e) {
    return { blocked: false, attempts: 0, windowStartedAt: 0 };
  }
}

function AUTH_registerLoginFailure_(username) {
  const cache = CacheService.getScriptCache();
  const cacheKey = AUTH_LOGIN_CACHE_PREFIX + String(username || "").toLowerCase();
  const current = AUTH_getLoginThrottle_(username);
  const nextState = {
    attempts: current.attempts + 1,
    windowStartedAt: current.windowStartedAt || Date.now(),
  };
  const ttl = Math.max(
    60,
    Math.ceil(
      (AUTH_LOGIN_WINDOW_MS - (Date.now() - nextState.windowStartedAt)) / 1000,
    ),
  );
  cache.put(cacheKey, JSON.stringify(nextState), ttl);
}

function AUTH_clearLoginThrottle_(username) {
  CacheService.getScriptCache().remove(
    AUTH_LOGIN_CACHE_PREFIX + String(username || "").toLowerCase(),
  );
}

function registerUser(username, password, role = "Wali", extras = {}) {
  try {
    const sheet = getSheet_("Users");
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const inputUsername = String(username || "").trim();

    if (!inputUsername || !password) {
      return { ok: false, message: "Username dan Password wajib diisi." };
    }

    // Check if username already exists (also check normalized phone for Wali)
    const inputNormalized = normalizePhoneNumber(inputUsername);
    const existingUser = data
      .slice(1)
      .find((row) => {
        const dbUsername = String(row[headers.indexOf("Username")] || "").trim();
        const dbPhone = String(row[headers.indexOf("Phone")] || "").trim();
        if (dbUsername === inputUsername) return true;
        if (inputNormalized && role === "Wali") {
          if (normalizePhoneNumber(dbUsername) === inputNormalized) return true;
          if (normalizePhoneNumber(dbPhone) === inputNormalized) return true;
        }
        return false;
      });
    if (existingUser) {
      return {
        ok: false,
        message: "Username sudah terdaftar. Silakan gunakan username lain.",
      };
    }

    // Generate UserID
    const userId = "USR" + Date.now();

    // Generate salt and hash password
    const salt = Utilities.getUuid().substring(0, 8);
    const passwordHash = hashPasswordWithSalt(password, salt);

    // Prepare new user row
    const newRow = [];
    USER_HEADERS.forEach((header) => {
      switch (header) {
        case "UserID":
          newRow.push(userId);
          break;
        case "Name":
          newRow.push(extras.name || "");
          break;
        case "Username":
          newRow.push(inputUsername);
          break;
        case "Email":
          newRow.push("");
          break;
        case "Phone":
          newRow.push(extras.phone || inputUsername);
          break;
        case "Role":
          newRow.push(role);
          break;
        case "StudentID":
          newRow.push(extras.studentId || "");
          break;
        case "Class":
          newRow.push("");
          break;
        case "Salt":
          newRow.push(salt);
          break;
        case "PasswordHash":
          newRow.push(passwordHash);
          break;
        case "Status":
          newRow.push("Active");
          break;
        case "CreatedAt":
          newRow.push(new Date().toISOString());
          break;
        case "UpdatedAt":
          newRow.push(new Date().toISOString());
          break;
        case "LastLogin":
          newRow.push("");
          break;
        default:
          newRow.push("");
      }
    });

    sheet.appendRow(newRow);
    return { ok: true, message: "Registrasi berhasil! Silakan login." };
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

function createAccount(username, password) {
  try {
    return registerUser(username, password, "Wali");
  } catch (e) {
    return {
      ok: false,
      message: e.message || "Terjadi kesalahan saat registrasi akun.",
    };
  }
} // Login, Register
