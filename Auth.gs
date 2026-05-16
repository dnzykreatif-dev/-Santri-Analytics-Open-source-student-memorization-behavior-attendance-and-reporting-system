function login(username, password) {
  return loginWithSalt(username, password);
}

function registerUser(username, password, role = "Wali") {
  try {
    const sheet = getSheet_("Users");
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const inputUsername = String(username || "").trim();

    if (!inputUsername || !password) {
      return { ok: false, message: "Username dan Password wajib diisi." };
    }

    // Check if username already exists
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
          newRow.push("");
          break;
        case "Username":
          newRow.push(inputUsername);
          break;
        case "Email":
          newRow.push("");
          break;
        case "Phone":
          newRow.push("");
          break;
        case "Role":
          newRow.push(role);
          break;
        case "StudentID":
          newRow.push("");
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
