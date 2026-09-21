// Setup and initialization functions
const CORE_SHEET_SCHEMAS = {
  Students: [
    "StudentID",
    "NIS",
    "Name",
    "Class/Level",
    "Level",
    "Gender",
    "ParentContact",
    "BirthPlace",
    "BirthDate",
    "SchoolUnit",
    "CohortYear",
    "Province",
    "Regency",
    "ResidencyStatus",
    "DormitoryBlock",
    "Room",
    "CreatedAt",
    "UpdatedAt",
    "RecordVersion",
    "WaliUsername",
    "CatatanPembinaan",
    "Status",
    "DeletedAt",
    "PhotoFileId",
    "PhotoUpdatedAt",
    "QrPublicId",
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
    "SessionID",
    "ScheduleID",
    "StudentID",
    "AttendanceDate",
    "DateLogged",
    "ClassOrGroupName",
    "Category",
    "ActivityName",
    "Status",
    "Notes",
    "TeacherID",
    "TeacherSourceID",
    "CreatedAt",
    "UpdatedAt",
  ],
  AttendanceSessions: [
    "SessionID",
    "ScheduleID",
    "AttendanceDate",
    "AttendanceType",
    "DayOfWeek",
    "ClassOrGroupName",
    "ActivityName",
    "TeacherID",
    "TeacherSourceID",
    "StartTime",
    "EndTime",
    "SubmittedBy",
    "SubmittedAt",
    "UpdatedAt",
    "TotalStudents",
    "HadirCount",
    "IzinCount",
    "SakitCount",
    "AlpaCount",
    "TelatCount",
    "Status",
  ],
  Schedules: [
    "ScheduleID",
    "Type",
    "TeacherID",
    "TeacherSourceID",
    "SubjectOrActivityName",
    "ClassOrGroupName",
    "DayOfWeek",
    "StartTime",
    "EndTime",
    "IsActive",
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
  StudentLookups: [
    "LookupID",
    "LookupType",
    "Key",
    "Label",
    "Value",
    "IsActive",
    "SortOrder",
    "CreatedAt",
    "UpdatedAt",
  ],
  SchemaMigrations: [
    "Version",
    "Description",
    "AppliedAt",
    "AppliedBy",
  ],
  AuditLogs: [
    "AuditID",
    "Action",
    "EntityType",
    "EntityID",
    "Username",
    "Role",
    "Payload",
    "CreatedAt",
  ],
  AttendanceMigrationBackup: [
    "BackupID",
    "SourceSheet",
    "SourceRow",
    "RecordID",
    "Reason",
    "PayloadJson",
    "BackedUpAt",
    "BackedUpBy",
  ],
  Sessions: [
    "SessionID",
    "TokenHash",
    "UserID",
    "Username",
    "Role",
    "CreatedAt",
    "ExpiresAt",
    "LastSeenAt",
    "RevokedAt",
  ],
};

const SCHEMA_MIGRATION_VERSION = "2026.09.16.2";

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

  recordSchemaMigration_(
    "2026.07.25.1",
    "Add student profile, sessions, audit, and lookup sheets",
    "system",
  );

  recordSchemaMigration_(
    "2026.08.11.1",
    "Update Attendance schema and add Schedules",
    "system",
  );

  recordSchemaMigration_(
    "2026.08.12.1",
    "Add StartTime and EndTime to Schedules",
    "system",
  );

  recordSchemaMigration_(
    "2026.09.01.1",
    "Add attendance sessions and recap-ready attendance headers",
    "system",
  );

  recordSchemaMigration_(
    "2026.09.16.1",
    "Add canonical teacher identity and attendance migration backup",
    "system",
  );

  recordSchemaMigration_(
    "2026.09.16.2",
    "Repair canonical teacher sessions and force master schedule reconciliation",
    "system",
  );

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

function recordSchemaMigration_(version, description, appliedBy) {
  try {
    const sheet = setupSheetWithHeaders_(
      "SchemaMigrations",
      CORE_SHEET_SCHEMAS.SchemaMigrations,
    );
    const migrationSheet = getSheet_("SchemaMigrations");
    const data = migrationSheet.getDataRange().getValues();
    if (data.length > 1) {
      const headers = data[0];
      const versionIndex = headers.indexOf("Version");
      const exists = data.slice(1).some((row) => String(row[versionIndex] || "") === String(version));
      if (exists) {
        return { ok: true, message: "Schema migration sudah tercatat." };
      }
    }

    migrationSheet.appendRow([
      version,
      description,
      new Date().toISOString(),
      appliedBy || "system",
    ]);
    return { ok: true, message: "Schema migration tercatat." };
  } catch (e) {
    return { ok: false, message: e.message };
  }
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

function setupStudentLookups() {
  try {
    const result = setupSheetWithHeaders_(
      "StudentLookups",
      CORE_SHEET_SCHEMAS.StudentLookups,
    );
    return {
      ok: true,
      message: result.message || "Sheet lookup santri siap.",
      addedHeaders: result.addedHeaders || [],
    };
  } catch (e) {
    return { ok: false, message: "Error setup lookup: " + e.message };
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

// Repair manual sheet entry by assigning default Wali password
function setupDefaultWaliPasswords() {
  try {
    const spreadsheet = getSpreadsheet_();
    const usersSheet = spreadsheet.getSheetByName(SHEET_USERS);

    if (!usersSheet) {
      return {
        ok: false,
        message: "Sheet Users tidak ditemukan.",
      };
    }

    const data = usersSheet.getDataRange().getValues();
    if (data.length <= 1) {
      return {
        ok: true,
        message: "Tidak ada data user yang perlu diperbaiki.",
        stats: { updated: 0, skipped: 0 },
      };
    }

    const headers = data[0];
    const roleIndex = headers.indexOf("Role");
    const saltIndex = headers.indexOf("Salt");
    const hashIndex = headers.indexOf("PasswordHash");

    if (roleIndex === -1 || saltIndex === -1 || hashIndex === -1) {
      return {
        ok: false,
        message: "Kolom Role, Salt, atau PasswordHash tidak ditemukan.",
      };
    }

    const defaultPassword = "123456";
    let updatedCount = 0;
    let skippedCount = 0;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const role = String(row[roleIndex] || "").trim();
      const currentSalt = String(row[saltIndex] || "").trim();
      const currentHash = String(row[hashIndex] || "").trim();

      if (role !== "Wali") {
        continue;
      }

      if (currentSalt || currentHash) {
        skippedCount++;
        continue;
      }

      const salt = Utilities.getUuid().substring(0, 8);
      row[saltIndex] = salt;
      row[hashIndex] = hashPasswordWithSalt(defaultPassword, salt);
      updatedCount++;
    }

    if (updatedCount > 0) {
      usersSheet
        .getRange(2, 1, data.length - 1, headers.length)
        .setValues(data.slice(1));
    }

    return {
      ok: true,
      message:
        "Password default Wali berhasil diisi untuk " + updatedCount + " baris.",
      stats: {
        updated: updatedCount,
        skipped: skippedCount,
      },
    };
  } catch (e) {
    return { ok: false, message: "Error perbaikan password: " + e.message };
  }
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
      "logoutSession",
      "resumeSession",
      "getStudents",
      "queryStudents",
      "getDashboardSummary",
      "getStudentStatistics",
      "exportStudentsCsv",
      "issueStudentQr",
      "resolveStudentQr",
      "logMemorization",
      "logIncident",
      "getAttendanceHome",
      "getAttendanceSession",
      "saveAttendanceSession",
      "getAttendanceRecap",
      "getGuardianAttendanceSummary",
      "auditAttendanceIntegrity",
      "repairAttendanceIntegrity",
      "updateStudentGenderBatch",
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
      "getPublicPesantrenInfo",
      "savePesantrenInfo",
      "setPesantrenInfoStatus",
      "deletePesantrenInfo",
      "savePulangBulanan",
      "updatePulangBulanan",
      "deletePulangBulanan",
      "setupStudentLookups",
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
    const nameCol = headers.indexOf("Name");
    const parentContactCol = headers.indexOf("ParentContact");
    const studentIdCol = headers.indexOf("StudentID");
    const classCol = headers.indexOf("Class/Level");
    const waliUsernameCol = headers.indexOf("WaliUsername");
    const deletedAtCol = headers.indexOf("DeletedAt");

    if (nameCol === -1 || parentContactCol === -1 || studentIdCol === -1) {
      return {
        ok: false,
        message: "Kolom yang diperlukan tidak ditemukan di sheet Students.",
      };
    }

    // Get existing users from Users sheet - build a set of normalized phone numbers
    const usersData = usersSheet.getDataRange().getValues();
    const userHeaders = usersData[0];
    const existingNormalizedPhones = new Set();

    for (let i = 1; i < usersData.length; i++) {
      const uUsername = String(usersData[i][userHeaders.indexOf("Username")] || "").trim();
      const uPhone = String(usersData[i][userHeaders.indexOf("Phone")] || "").trim();
      const normU = normalizePhoneNumber(uUsername);
      const normP = normalizePhoneNumber(uPhone);
      if (normU) existingNormalizedPhones.add(normU);
      if (normP) existingNormalizedPhones.add(normP);
    }

    const now = new Date().toISOString();
    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Process each student
    for (let i = 1; i < studentsData.length; i++) {
      try {
        const studentName = studentsData[i][nameCol];
        const parentContact = String(studentsData[i][parentContactCol] || "").trim();
        const studentId = studentsData[i][studentIdCol];
        const studentClass = studentsData[i][classCol] || "";
        const deletedAt = deletedAtCol >= 0 ? String(studentsData[i][deletedAtCol] || "").trim() : "";

        // Skip deleted students
        if (deletedAt) {
          skippedCount++;
          continue;
        }

        if (!parentContact || !studentName || !studentId) {
          skippedCount++;
          continue;
        }

        // Normalize phone for duplicate check
        const normalizedPhone = normalizePhoneNumber(parentContact);
        if (!normalizedPhone || normalizedPhone.length < 8) {
          skippedCount++;
          continue;
        }

        // Skip if user already exists with this phone number
        if (existingNormalizedPhones.has(normalizedPhone)) {
          skippedCount++;
          continue;
        }

        // Create unique salt and hash for each user
        const salt = Utilities.getUuid().substring(0, 8);
        const passwordHash = hashPasswordWithSalt("123456", salt);

        // Use phone number as username
        const username = parentContact.toString().replace(/\D/g, "");

        // Create user data matching USER_HEADERS order
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
        existingNormalizedPhones.add(normalizedPhone);
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
