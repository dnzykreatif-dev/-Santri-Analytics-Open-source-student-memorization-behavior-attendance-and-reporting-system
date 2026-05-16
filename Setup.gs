// Setup and initialization functions
function setupUsersSheet() {
  try {
    const spreadsheet = getSpreadsheet_();
    let sheet = spreadsheet.getSheetByName(SHEET_USERS);

    if (!sheet) {
      // Create new Users sheet
      sheet = spreadsheet.insertSheet(SHEET_USERS);
      sheet.appendRow(USER_HEADERS);

      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, USER_HEADERS.length);
      headerRange.setBackground("#4F46E5");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");

      // Set column widths
      sheet.setColumnWidth(1, 100); // UserID
      sheet.setColumnWidth(2, 150); // Name
      sheet.setColumnWidth(3, 120); // Username
      sheet.setColumnWidth(4, 200); // Email
      sheet.setColumnWidth(5, 120); // Phone
      sheet.setColumnWidth(6, 100); // Role
      sheet.setColumnWidth(7, 100); // StudentID
      sheet.setColumnWidth(8, 100); // Class
      sheet.setColumnWidth(9, 100); // Salt
      sheet.setColumnWidth(10, 200); // PasswordHash
      sheet.setColumnWidth(11, 100); // Status
      sheet.setColumnWidth(12, 150); // CreatedAt
      sheet.setColumnWidth(13, 150); // UpdatedAt
      sheet.setColumnWidth(14, 150); // LastLogin

      // Freeze header row
      sheet.setFrozenRows(1);

      // Create default Mudir user if no users exist
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        const salt = Utilities.getUuid().substring(0, 8);
        const passwordHash = hashPasswordWithSalt("mudir123", salt);
        const userId = "USR" + Date.now();
        const now = new Date().toISOString();

        const defaultUser = [
          userId,
          "Mudir Default",
          "mudir",
          "mudir@ponpes.com",
          "081234567890",
          "Mudir",
          "",
          "",
          salt,
          passwordHash,
          "Active",
          now,
          now,
          "",
        ];

        sheet.appendRow(defaultUser);
      }

      return { ok: true, message: "Sheet Users berhasil dibuat." };
    } else {
      // Check if sheet has all required columns
      const headers = sheet
        .getRange(1, 1, 1, sheet.getLastColumn())
        .getValues()[0];
      const missingHeaders = USER_HEADERS.filter(
        (header) => !headers.includes(header),
      );

      if (missingHeaders.length > 0) {
        // Add missing headers
        const newHeaders = [...headers];
        missingHeaders.forEach((header) => newHeaders.push(header));
        sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);

        return { ok: true, message: "Header Users diperbarui." };
      }

      return { ok: true, message: "Sheet Users sudah ada." };
    }
  } catch (e) {
    return { ok: false, message: "Error setup: " + e.message };
  }
}

// Initialize the application
function initializeApp() {
  const results = [];

  // Setup Users sheet
  const usersResult = setupUsersSheet();
  results.push({ sheet: SHEET_USERS, result: usersResult });

  return { ok: true, results };
}

// Setup complete application with parent contact conversion
function setupCompleteApp() {
  const results = [];

  // Setup Users sheet
  const usersResult = setupUsersSheet();
  results.push({ sheet: SHEET_USERS, result: usersResult });

  // Convert parent contacts to Wali users
  const conversionResult = convertParentContactsToUsers();
  results.push({ task: "Convert parent contacts", result: conversionResult });

  return { ok: true, results };
}

// Convert all parent contacts to Wali users
function convertParentContactsToUsers() {
  try {
    const spreadsheet = getSpreadsheet_();
    const studentsSheet = spreadsheet.getSheetByName("Students");
    const usersSheet = spreadsheet.getSheetByName(SHEET_USERS);

    if (!studentsSheet || !usersSheet) {
      return {
        ok: false,
        message: "Sheet Students atau Users tidak ditemukan.",
      };
    }

    // Get all students with parent contact
    const studentsData = studentsSheet.getDataRange().getValues();
    const headers = studentsData[0];

    // Find column indices
    const nameCol = headers.indexOf("Name") + 1;
    const parentContactCol = headers.indexOf("ParentContact") + 1;
    const studentIdCol = headers.indexOf("StudentID") + 1;
    const classCol = headers.indexOf("Class/Level") + 1;

    if (nameCol === 0 || parentContactCol === 0 || studentIdCol === 0) {
      return {
        ok: false,
        message: "Kolom yang diperlukan tidak ditemukan di sheet Students.",
      };
    }

    // Get existing usernames from Users sheet
    const usersData = usersSheet.getDataRange().getValues();
    const userHeaders = usersData[0];
    const usernameCol = userHeaders.indexOf("Username") + 1;
    const existingUsernames = new Set();

    for (let i = 1; i < usersData.length; i++) {
      if (usersData[i][usernameCol - 1]) {
        existingUsernames.add(usersData[i][usernameCol - 1].toString().trim());
      }
    }

    const salt = Utilities.getUuid().substring(0, 8);
    const passwordHash = hashPasswordWithSalt("123456", salt);
    const now = new Date().toISOString();

    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Process each student
    for (let i = 1; i < studentsData.length; i++) {
      try {
        const studentName = studentsData[i][nameCol - 1];
        const parentContact = studentsData[i][parentContactCol - 1];
        const studentId = studentsData[i][studentIdCol - 1];
        const studentClass = studentsData[i][classCol - 1] || "";

        if (!parentContact || !studentName || !studentId) {
          skippedCount++;
          continue;
        }

        // Clean phone number to use as username
        const phoneNumber = parentContact.toString().replace(/\D/g, "");
        if (phoneNumber.length < 10) {
          skippedCount++;
          continue;
        }

        const username = phoneNumber;

        // Skip if username already exists
        if (existingUsernames.has(username)) {
          skippedCount++;
          continue;
        }

        // Create user data
        const userId = "WALI" + Date.now() + i;
        const userData = [
          userId,
          studentName + " (Wali)",
          username,
          "",
          parentContact,
          "Wali",
          studentId,
          studentClass,
          salt,
          passwordHash,
          "Active",
          now,
          now,
          "",
        ];

        // Append to Users sheet
        usersSheet.appendRow(userData);
        existingUsernames.add(username);
        createdCount++;
      } catch (e) {
        errorCount++;
        console.error("Error processing student row " + i + ": " + e.message);
      }
    }

    return {
      ok: true,
      message: `Konversi selesai. ${createdCount} user Wali dibuat, ${skippedCount} dilewati, ${errorCount} error.`,
      stats: {
        created: createdCount,
        skipped: skippedCount,
        errors: errorCount,
      },
    };
  } catch (e) {
    return { ok: false, message: "Error konversi: " + e.message };
  }
}

// Test function to verify setup
function testUserManagement() {
  try {
    // Test getUsers function
    const testUser = { Username: "test", Role: "Mudir" };
    const usersResult = getUsers(testUser);

    // Test addUser function
    const newUserData = {
      Name: "Test User",
      Username: "testuser" + Date.now(),
      Email: "test@example.com",
      Phone: "08123456789",
      Role: "Wali",
      Password: "test123",
      Status: "Active",
    };

    const addResult = addUser(newUserData, testUser);

    return {
      ok: true,
      getUsers: usersResult.ok ? "Success" : usersResult.message,
      addUser: addResult.ok ? "Success" : addResult.message,
    };
  } catch (e) {
    return { ok: false, message: "Test failed: " + e.message };
  }
}
