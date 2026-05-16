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
    // Check permission - only Mudir or Admin can access
    if (
      !currentUser ||
      (currentUser.Role !== "Mudir" && currentUser.Role !== "Admin")
    ) {
      return {
        ok: false,
        message: "Akses ditolak. Hanya Mudir/Admin yang dapat mengelola user.",
      };
    }

    const sheet = getSheet_(SHEET_USERS);
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return { ok: true, data: { users: [] } };
    }

    const headers = data[0];
    const users = data.slice(1).map((row) => {
      const user = serializeRow(row, headers);
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
    // Check permission
    if (
      !currentUser ||
      (currentUser.Role !== "Mudir" && currentUser.Role !== "Admin")
    ) {
      return {
        ok: false,
        message: "Akses ditolak. Hanya Mudir/Admin yang dapat menambah user.",
      };
    }

    const sheet = getSheet_(SHEET_USERS);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    // Validate required fields
    if (!userData.Username || !userData.Name || !userData.Role) {
      return { ok: false, message: "Username, Nama, dan Role wajib diisi." };
    }

    // Check if username already exists
    const existingUser = data
      .slice(1)
      .find(
        (row) =>
          String(row[headers.indexOf("Username")] || "").trim() ===
          userData.Username.trim(),
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
          newRow.push(userData.Username.trim());
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
    // Check permission
    if (
      !currentUser ||
      (currentUser.Role !== "Mudir" && currentUser.Role !== "Admin")
    ) {
      return {
        ok: false,
        message: "Akses ditolak. Hanya Mudir/Admin yang dapat mengupdate user.",
      };
    }

    const sheet = getSheet_(SHEET_USERS);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    // Find user row
    const userIndex = findRowIndexById_(SHEET_USERS, userId);
    if (userIndex === -1) {
      return { ok: false, message: "User tidak ditemukan." };
    }

    // Check if username is being changed and if it already exists
    if (userData.Username) {
      const existingUser = data.slice(1).find((row, index) => {
        const rowUserId = row[headers.indexOf("UserID")];
        const rowUsername = String(
          row[headers.indexOf("Username")] || "",
        ).trim();
        return rowUserId !== userId && rowUsername === userData.Username.trim();
      });

      if (existingUser) {
        return {
          ok: false,
          message: "Username sudah digunakan oleh user lain.",
        };
      }
    }

    // Get current user data
    const currentRow = data[userIndex - 1]; // userIndex is 1-based
    const currentUserObj = serializeRow(currentRow, headers);

    // Update fields
    const updatedRow = [...currentRow];
    USER_HEADERS.forEach((header, index) => {
      if (
        userData[header] !== undefined &&
        header !== "UserID" &&
        header !== "CreatedAt"
      ) {
        if (header === "Password" && userData.Password) {
          // Handle password update
          const salt = Utilities.getUuid().substring(0, 8);
          const passwordHash = hashPasswordWithSalt(userData.Password, salt);
          updatedRow[headers.indexOf("Salt")] = salt;
          updatedRow[headers.indexOf("PasswordHash")] = passwordHash;
        } else if (header === "UpdatedAt") {
          updatedRow[index] = new Date().toISOString();
        } else if (header !== "Salt" && header !== "PasswordHash") {
          updatedRow[index] = userData[header];
        }
      }
    });

    // Update UpdatedAt
    updatedRow[headers.indexOf("UpdatedAt")] = new Date().toISOString();

    // Write back to sheet
    sheet.getRange(userIndex, 1, 1, updatedRow.length).setValues([updatedRow]);

    // Return updated user data without sensitive info
    const updatedUser = serializeRow(updatedRow, headers);
    delete updatedUser.Salt;
    delete updatedUser.PasswordHash;

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
 * Delete user (only accessible by Mudir/Admin)
 */
function deleteUser(userId, currentUser) {
  try {
    // Check permission
    if (
      !currentUser ||
      (currentUser.Role !== "Mudir" && currentUser.Role !== "Admin")
    ) {
      return {
        ok: false,
        message: "Akses ditolak. Hanya Mudir/Admin yang dapat menghapus user.",
      };
    }

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

    if (user.Username === currentUser.Username) {
      return { ok: false, message: "Tidak dapat menghapus akun sendiri." };
    }

    sheet.deleteRow(userIndex);
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
 * Update login function to use salt
 */
function loginWithSalt(username, password) {
  const sheet = getSheet_(SHEET_USERS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const inputUsername = String(username || "").trim();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const dbUsername = String(row[headers.indexOf("Username")] || "").trim();

    if (dbUsername === inputUsername) {
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
