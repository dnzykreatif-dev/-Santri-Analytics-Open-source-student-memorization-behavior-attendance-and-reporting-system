// Setup and initialization functions
const CORE_SHEET_SCHEMAS = {
  Students: [
    "StudentID",
    "Name",
    "Class/Level",
    "Level",
    "Gender",
    "ParentContact",
    "CreatedAt",
    "WaliUsername",
    "CatatanPembinaan",
    "Status",
  ],
  MemorizationLogs: [
    "LogID",
    "StudentID",
    "DateLogged",
    "Surah",
    "AyahStart",
    "AyahEnd",
    "Juz",
    "Category",
    "Status",
    "TeacherID",
    "Quality",
  ],
  Incidents: [
    "IncidentID",
    "StudentID",
    "DateOfIncident",
    "IncidentType",
    "Description",
    "Severity",
    "Points",
    "ReportedBy",
    "Resolution",
    "Category",
  ],
  Attendance: [
    "AttendanceID",
    "StudentID",
    "DateLogged",
    "Type",
    "Notes",
    "TeacherID",
  ],
  HafalanLinks: [
    "LinkID",
    "StudentID",
    "DateAdded",
    "Title",
    "URL",
    "Type",
    "TeacherID",
  ],
  PesantrenInfo: [
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
  ],
};

function setupSheetWithHeaders_(sheetName, requiredHeaders) {
  const spreadsheet = getSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(sheetName);
  let created = false;

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    created = true;
  }

  const isBlank = sheet.getLastRow() === 0 || sheet.getLastColumn() === 0;
  if (isBlank) {
    sheet.getRange(1, 1, 1, requiredHeaders.length).setValues([requiredHeaders]);
    sheet.setFrozenRows(1);
    return {
      ok: true,
      created,
      addedHeaders: requiredHeaders,
      message: "Sheet " + sheetName + " siap.",
    };
  }

  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map((header) => String(header || "").trim());
  const missingHeaders = requiredHeaders.filter(
    (header) => !headers.includes(header),
  );

  if (missingHeaders.length > 0) {
    sheet
      .getRange(1, headers.length + 1, 1, missingHeaders.length)
      .setValues([missingHeaders]);
  }

  sheet.setFrozenRows(1);
  return {
    ok: true,
    created,
    addedHeaders: missingHeaders,
    message:
      missingHeaders.length > 0
        ? "Header " + sheetName + " diperbarui."
        : "Sheet " + sheetName + " sudah siap.",
  };
}

function setupCoreSheets() {
  const results = [];
  Object.keys(CORE_SHEET_SCHEMAS).forEach((sheetName) => {
    results.push({
      sheet: sheetName,
      result: setupSheetWithHeaders_(sheetName, CORE_SHEET_SCHEMAS[sheetName]),
    });
  });

  results.push({
    sheet: SHEET_PULANG_BULANAN,
    result: setupSheetWithHeaders_(
      SHEET_PULANG_BULANAN,
      PULANG_BULANAN_HEADERS,
    ),
  });

  if (functionExists_("setupAcademicSheets")) {
    results.push({
      task: "Setup academic sheets",
      result: setupAcademicSheets(),
    });
  }

  return { ok: true, data: { results }, message: "Sheet inti siap." };
}

function canManageSetup_(currentUser) {
  return (
    currentUser &&
    (currentUser.Role === "Mudir" || currentUser.Role === "Admin")
  );
}

function functionExists_(name) {
  try {
    return typeof eval(name) === "function";
  } catch (e) {
    return false;
  }
}
function setupUsersSheet() {
  try {
    const setupResult = setupSheetWithHeaders_(SHEET_USERS, USER_HEADERS);
    const sheet = getSheet_(SHEET_USERS);

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

    return {
      ok: true,
      message: setupResult.message,
      addedHeaders: setupResult.addedHeaders,
    };
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

  const coreResult = setupCoreSheets();
  results.push({ task: "Setup core sheets", result: coreResult });

  return { ok: true, results };
}

// Setup complete application with parent contact conversion
function setupCompleteApp() {
  const results = [];

  // Setup Users sheet
  const usersResult = setupUsersSheet();
  results.push({ sheet: SHEET_USERS, result: usersResult });

  const coreResult = setupCoreSheets();
  results.push({ task: "Setup core sheets", result: coreResult });

  // Convert parent contacts to Wali users
  const conversionResult = convertParentContactsToUsers();
  results.push({ task: "Convert parent contacts", result: conversionResult });

  return { ok: true, results };
}

function runHealthCheck(currentUser) {
  if (!canManageSetup_(currentUser)) {
    return {
      ok: false,
      message: "Akses ditolak. Hanya Mudir/Admin yang dapat menjalankan health check.",
    };
  }

  try {
    const spreadsheet = getSpreadsheet_();
    const schemas = Object.assign({}, CORE_SHEET_SCHEMAS);
    schemas[SHEET_USERS] = USER_HEADERS;
    schemas[SHEET_PULANG_BULANAN] = PULANG_BULANAN_HEADERS;
    if (functionExists_("getAcademicSheetSchemas_")) {
      Object.assign(schemas, getAcademicSheetSchemas_());
    }

    const sheets = Object.keys(schemas).map((sheetName) => {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        return {
          name: sheetName,
          ok: false,
          missingHeaders: schemas[sheetName],
          message: "Sheet tidak ditemukan.",
        };
      }

      const headers =
        sheet.getLastColumn() > 0
          ? sheet
              .getRange(1, 1, 1, sheet.getLastColumn())
              .getValues()[0]
              .map((header) => String(header || "").trim())
          : [];
      const missingHeaders = schemas[sheetName].filter(
        (header) => !headers.includes(header),
      );

      return {
        name: sheetName,
        ok: missingHeaders.length === 0,
        missingHeaders,
        message:
          missingHeaders.length === 0
            ? "OK"
            : "Header belum lengkap: " + missingHeaders.join(", "),
      };
    });

    const requiredFunctions = [
      "login",
      "getStudents",
      "getDashboardSummary",
      "logMemorization",
      "logIncident",
      "getUsers",
      "getAcademicSetup",
      "saveAcademicPeriod",
      "setAcademicPeriodStatus",
      "saveAcademicSubject",
      "saveAssessmentComponent",
      "getAcademicScoreMatrix",
      "saveAcademicScores",
      "importAcademicScoresFromStaging",
      "updateStudentAcademicProfile",
      "getPesantrenInfo",
      "savePesantrenInfo",
      "setPesantrenInfoStatus",
      "deletePesantrenInfo",
      "savePulangBulanan",
      "updatePulangBulanan",
      "deletePulangBulanan",
    ];
    const functions = requiredFunctions.map((name) => ({
      name,
      ok: functionExists_(name),
    }));

    const failedSheets = sheets.filter((sheet) => !sheet.ok);
    const failedFunctions = functions.filter((fn) => !fn.ok);
    const ok = failedSheets.length === 0 && failedFunctions.length === 0;

    return {
      ok,
      data: { sheets, functions },
      message: ok
        ? "Health check OK. Aplikasi siap digunakan."
        : "Health check menemukan masalah.",
    };
  } catch (e) {
    return { ok: false, message: "Health check gagal: " + e.message };
  }
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
