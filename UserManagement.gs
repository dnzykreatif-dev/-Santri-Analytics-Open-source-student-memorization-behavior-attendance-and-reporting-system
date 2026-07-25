// User Management Functions for Mudir/Admin
const SHEET_USERS = "Users";
const USER_HEADERS = [
  "UserID",
  "Name",
  "Username",
  "Email",
  "Phone",
  "Role",
  "StudentID",
  "Class",
  "Salt",
  "PasswordHash",
  "Status",
  "CreatedAt",
  "UpdatedAt",
  "LastLogin",
];

/**
 * Get all users (only accessible by Mudir/Admin)
 */
function getUsers(currentUser) {
  try {
    requireSessionUser_(currentUser, { roles: ["Mudir", "Admin"] });

    const sheet = getSheet_(SHEET_USERS);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    repairMissingIds_(sheet, headers, "UserID", "USR", {
      usernameHeader: "Username",
      phoneHeader: "Phone",
      roleHeader: "Role",
      statusHeader: "Status",
      createdAtHeader: "CreatedAt",
    });
    const refreshedData = sheet.getDataRange().getValues();

    if (refreshedData.length <= 1) {
      return { ok: true, data: { users: [] } };
    }

    const refreshedHeaders = refreshedData[0];
    const users = refreshedData.slice(1).map((row) => {
      const user = serializeRow(row, refreshedHeaders);
      // Remove sensitive data
      delete user.Salt;
      delete user.PasswordHash;
      return user;
    });

    return { ok: true, data: { users } };
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

/**
 * Add new user (only accessible by Mudir/Admin)
 */
function addUser(userData, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, {
      roles: ["Mudir", "Admin"],
    });

    const sheet = getSheet_(SHEET_USERS);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    // Validate required fields
    if (!userData.Username || !userData.Name || !userData.Role) {
      return { ok: false, message: "Username, Nama, dan Role wajib diisi." };
    }

    // Check if username already exists
    const inputUsername = String(userData.Username || "").trim();
    const existingUser = data
      .slice(1)
      .find(
        (row) =>
          String(row[headers.indexOf("Username")] || "").trim() ===
          inputUsername,
      );

    if (existingUser) {
      return {
        ok: false,
        message: "Username sudah terdaftar. Silakan gunakan username lain.",
      };
    }

    // Generate UserID
    const userId = "USR" + Date.now();

    // Generate salt and hash password if provided
    let salt = "";
    let passwordHash = "";
    if (userData.Password) {
      salt = Utilities.getUuid().substring(0, 8);
      passwordHash = hashPasswordWithSalt(userData.Password, salt);
    }

    // Prepare new user row
    const newRow = [];
    USER_HEADERS.forEach((header) => {
      switch (header) {
        case "UserID":
          newRow.push(userId);
          break;
        case "Name":
          newRow.push(userData.Name || "");
          break;
        case "Username":
          newRow.push(String(userData.Username || "").trim());
          break;
        case "Email":
          newRow.push(userData.Email || "");
          break;
        case "Phone":
          newRow.push(userData.Phone || "");
          break;
        case "Role":
          newRow.push(userData.Role || "Wali");
          break;
        case "StudentID":
          newRow.push(userData.StudentID || "");
          break;
        case "Class":
          newRow.push(userData.Class || "");
          break;
        case "Salt":
          newRow.push(salt);
          break;
        case "PasswordHash":
          newRow.push(passwordHash);
          break;
        case "Status":
          newRow.push(userData.Status || "Active");
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
    AUTH_appendAuditLog_("CREATE", "User", userId, sessionUser, {
      username: inputUsername,
      role: userData.Role || "Wali",
    });

    // Return user data without sensitive info
    const newUser = {
      UserID: userId,
      Name: userData.Name,
      Username: userData.Username,
      Email: userData.Email,
      Phone: userData.Phone,
      Role: userData.Role || "Wali",
      StudentID: userData.StudentID,
      Class: userData.Class,
      Status: userData.Status || "Active",
      CreatedAt: new Date().toISOString(),
    };

    return {
      ok: true,
      data: { user: newUser },
      message: "User berhasil ditambahkan.",
    };
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

/**
 * Update existing user (only accessible by Mudir/Admin)
 */
function updateUser(userId, userData, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, {
      roles: ["Mudir", "Admin"],
    });

    const sheet = getSheet_(SHEET_USERS);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    repairMissingIds_(sheet, headers, "UserID", "USR", {
      usernameHeader: "Username",
      phoneHeader: "Phone",
      roleHeader: "Role",
      statusHeader: "Status",
      createdAtHeader: "CreatedAt",
    });
    const refreshedData = sheet.getDataRange().getValues();
    const refreshedHeaders = refreshedData[0];

    // Find user row
    const userIndex = findRowIndexById_(SHEET_USERS, userId);
    if (userIndex === -1) {
      return { ok: false, message: "User tidak ditemukan." };
    }

    // Check if username is being changed and if it already exists
    if (userData.Username !== undefined && userData.Username !== null) {
      const usernameStr = String(userData.Username || "").trim();
      const existingUser = refreshedData.slice(1).find((row, index) => {
        const rowUserId = row[refreshedHeaders.indexOf("UserID")];
        const rowUsername = String(
          row[refreshedHeaders.indexOf("Username")] || "",
        ).trim();
        return rowUserId !== userId && rowUsername === usernameStr;
      });

      if (existingUser) {
        return {
          ok: false,
          message: "Username sudah digunakan oleh user lain.",
        };
      }
    }

    // Get current user data
    const currentRow = refreshedData[userIndex - 1]; // userIndex is 1-based
    const currentUserObj = serializeRow(currentRow, refreshedHeaders);

    // Update fields
    const updatedRow = [...currentRow];
    USER_HEADERS.forEach((header) => {
      if (
        userData[header] !== undefined &&
        header !== "UserID" &&
        header !== "CreatedAt"
      ) {
        const colIndex = headers.indexOf(header); // Use actual column index from sheet
        if (colIndex === -1) return;
        if (header === "UpdatedAt") {
          updatedRow[colIndex] = new Date().toISOString();
        } else if (header !== "Salt" && header !== "PasswordHash") {
          updatedRow[colIndex] = userData[header];
        }
      }
    });

    if (userData.Password) {
      const saltIndex = refreshedHeaders.indexOf("Salt");
      const hashIndex = refreshedHeaders.indexOf("PasswordHash");
      if (saltIndex === -1 || hashIndex === -1) {
        return {
          ok: false,
          message: "Kolom Salt atau PasswordHash tidak ditemukan.",
        };
      }
      const salt = Utilities.getUuid().substring(0, 8);
      const passwordHash = hashPasswordWithSalt(userData.Password, salt);
      updatedRow[saltIndex] = salt;
      updatedRow[hashIndex] = passwordHash;
    }

    // Update UpdatedAt
    updatedRow[refreshedHeaders.indexOf("UpdatedAt")] = new Date().toISOString();

    // Write back to sheet
    sheet.getRange(userIndex, 1, 1, updatedRow.length).setValues([updatedRow]);

    // Sync status to Student records only for Wali users
    if (userData.Status && currentUserObj.Role === "Wali") {
      syncStudentStatus(currentUserObj.Username, userData.Status);
    }

    if (
      userData.Status !== undefined ||
      userData.Role !== undefined ||
      userData.Username !== undefined ||
      userData.Password !== undefined
    ) {
      AUTH_revokeAllSessionsForUsername_(currentUserObj.Username, {
        reason: "user-updated",
      });
    }

    // Return updated user data without sensitive info
    const updatedUser = serializeRow(updatedRow, refreshedHeaders);
    delete updatedUser.Salt;
    delete updatedUser.PasswordHash;

    AUTH_appendAuditLog_("UPDATE", "User", userId, sessionUser, {
      username: updatedUser.Username,
      role: updatedUser.Role,
    });

    return {
      ok: true,
      data: { user: updatedUser },
      message: "User berhasil diupdate.",
    };
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

/**
 * Change the password for the currently logged-in user.
 * This is self-service only and does not allow changing another account.
 */
function changeOwnPassword(currentUser, oldPassword, newPassword) {
  try {
    const sessionUser = requireSessionUser_(currentUser, {
      allowAnonymous: false,
    });

    const oldPasswordText = String(oldPassword || "");
    const newPasswordText = String(newPassword || "");

    if (!oldPasswordText || !newPasswordText) {
      return { ok: false, message: "Password lama dan baru wajib diisi." };
    }

    if (newPasswordText.length < 6) {
      return { ok: false, message: "Password baru minimal 6 karakter." };
    }

    const sheet = getSheet_(SHEET_USERS);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const inputUsername = String(sessionUser.Username || "").trim();

    const userIndex = data.findIndex(
      (row, index) =>
        index > 0 &&
        String(row[headers.indexOf("Username")] || "").trim() === inputUsername,
    );

    if (userIndex === -1) {
      return { ok: false, message: "User tidak ditemukan." };
    }

    const row = data[userIndex];
    const saltIndex = headers.indexOf("Salt");
    const hashIndex = headers.indexOf("PasswordHash");
    const updatedAtIndex = headers.indexOf("UpdatedAt");

    if (saltIndex === -1 || hashIndex === -1) {
      return {
        ok: false,
        message: "Kolom Salt atau PasswordHash tidak ditemukan.",
      };
    }

    const currentSalt = row[saltIndex] || "";
    const currentHash = row[hashIndex] || "";
    const oldHash = hashPasswordWithSalt(oldPasswordText, currentSalt);

    if (currentHash !== oldHash) {
      return { ok: false, message: "Password lama salah." };
    }

    const newSalt = Utilities.getUuid().substring(0, 8);
    const newHash = hashPasswordWithSalt(newPasswordText, newSalt);
    const updatedRow = [...row];
    updatedRow[saltIndex] = newSalt;
    updatedRow[hashIndex] = newHash;

    if (updatedAtIndex !== -1) {
      updatedRow[updatedAtIndex] = new Date().toISOString();
    }

    sheet.getRange(userIndex + 1, 1, 1, updatedRow.length).setValues([updatedRow]);
    AUTH_revokeAllSessionsForUsername_(inputUsername, {
      reason: "password-change",
    });
    AUTH_appendAuditLog_("PASSWORD_CHANGE", "User", inputUsername, sessionUser, {});

    return { ok: true, message: "Password berhasil diubah." };
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

/**
 * Delete user (only accessible by Mudir/Admin)
 */
function deleteUser(userId, currentUser) {
  try {
    const sessionUser = requireSessionUser_(currentUser, {
      roles: ["Mudir", "Admin"],
    });

    const sheet = getSheet_(SHEET_USERS);
    const userIndex = findRowIndexById_(SHEET_USERS, userId);

    if (userIndex === -1) {
      return { ok: false, message: "User tidak ditemukan." };
    }

    // Prevent self-deletion
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const userRow = data[userIndex - 1];
    const user = serializeRow(userRow, headers);

    if (user.Username === sessionUser.Username) {
      return { ok: false, message: "Tidak dapat menghapus akun sendiri." };
    }

    sheet.deleteRow(userIndex);
    AUTH_revokeAllSessionsForUsername_(user.Username, {
      reason: "user-deleted",
    });
    AUTH_appendAuditLog_("DELETE", "User", userId, sessionUser, {
      username: user.Username,
    });
    return { ok: true, message: "User berhasil dihapus." };
  } catch (e) {
    return { ok: false, message: "Error: " + e.message };
  }
}

/**
 * Hash password with salt
 */
function hashPasswordWithSalt(password, salt) {
  if (!password) return "";
  const saltedPassword = salt + password;
  const rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    saltedPassword,
  );
  return rawHash
    .map(function (b) {
      const v = (b < 0 ? b + 256 : b).toString(16);
      return v.length === 1 ? "0" + v : v;
    })
    .join("");
}

/**
 * Normalize phone number to standard format (8xxxxxxxxxx)
 * Handles: 08xxxxx, 8xxxxx, +628xxxxx, 628xxxxx, 62xxxxx
 * @param {string} phone - Phone number in any format
 * @returns {string} - Normalized phone number starting with 8
 */
function normalizePhoneNumber(phone) {
  if (!phone) return "";
  let cleaned = String(phone || "").replace(/[\s\-\(\)]/g, "");
  // Remove leading zeros and country code
  cleaned = cleaned.replace(/^(\+?0?62|62)/, "");
  cleaned = cleaned.replace(/^0/, "");
  return cleaned;
}

/**
 * Update login function to use salt
 * Supports flexible phone number login for Wali role:
 * - 08xxxxxxxx (Indonesian format with 0)
 * - 8xxxxxxxx (without leading 0)
 * - +628xxxxxxxx (with country code and +)
 * - 628xxxxxxxx (with country code without +)
 */
function loginWithSalt(username, password) {
  const sheet = getSheet_(SHEET_USERS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const inputUsername = String(username || "").trim();
  const inputNormalized = normalizePhoneNumber(inputUsername);

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const dbUsername = String(row[headers.indexOf("Username")] || "").trim();
    const dbRole = String(row[headers.indexOf("Role")] || "").trim();

    // Check direct match
    let isMatch = dbUsername === inputUsername;

    // For Wali role, also check normalized phone number match
    if (!isMatch && dbRole === "Wali" && inputNormalized) {
      const dbNormalized = normalizePhoneNumber(dbUsername);
      isMatch = dbNormalized === inputNormalized;
    }

    if (isMatch) {
      const salt = row[headers.indexOf("Salt")] || "";
      const dbPasswordHash = row[headers.indexOf("PasswordHash")] || "";
      const hashedInput = hashPasswordWithSalt(password || "", salt);

      if (dbPasswordHash === hashedInput) {
        // Update LastLogin
        const lastLoginIndex = headers.indexOf("LastLogin");
        sheet
          .getRange(i + 1, lastLoginIndex + 1)
          .setValue(new Date().toISOString());

        const userStudentId = row[headers.indexOf("StudentID")] || "";
        const userClass = row[headers.indexOf("Class")] || "";

        return {
          ok: true,
          user: {
            Username: dbUsername,
            Name: row[headers.indexOf("Name")] || "",
            Role: row[headers.indexOf("Role")] || "Wali",
            Email: row[headers.indexOf("Email")] || "",
            Phone: row[headers.indexOf("Phone")] || "",
            StudentID: userStudentId,
            Class: userClass,
          },
        };
      }
    }
  }
  return { ok: false, message: "Username / Password salah" };
}
