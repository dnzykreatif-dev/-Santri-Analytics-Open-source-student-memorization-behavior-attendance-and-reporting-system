const assert = require("assert");
const fs = require("fs");

const read = (file) => fs.readFileSync(file, "utf8");
const config = read("Config.gs");
const attendance = read("Attendance.gs");
const integrity = read("AttendanceIntegrity.gs");
const seed = read("SeedSchedulesMaster.gs");
const schedule = read("Schedule.gs");
const adminTab = read("Tab_JadwalAdmin.html");

assert.match(config, /function isTenantInstallation_\(\)/);
assert.match(attendance, /function ATT_ensureMasterDataVersion_\(sessionUser\) \{\s*if \(isTenantInstallation_\(\)\)/);
assert.match(attendance, /source: "tenant"/);
assert.match(integrity, /const teachers = isTenantInstallation_\(\)/);
assert.match(seed, /if \(isTenantInstallation_\(\)\) \{[\s\S]*?Sinkronisasi master bawaan dinonaktifkan/);
assert.match(schedule, /embeddedMasterImportAllowed: !isTenantInstallation_\(\)/);
assert.match(adminTab, /x-show="scheduleEditorData\?\.embeddedMasterImportAllowed"/);

console.log("Tenant schedule isolation guard OK.");
