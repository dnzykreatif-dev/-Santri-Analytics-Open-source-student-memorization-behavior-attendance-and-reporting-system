const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const seedSource = fs.readFileSync(path.join(root, "SeedSchedulesMaster.gs"), "utf8");
const attendanceSource = fs.readFileSync(path.join(root, "Attendance.gs"), "utf8");
const authSource = fs.readFileSync(path.join(root, "UserManagement.gs"), "utf8");
const frontendSource = fs.readFileSync(path.join(root, "JS_App.html"), "utf8");
const attendanceTabSource = fs.readFileSync(path.join(root, "Tab_Absensi.html"), "utf8");

function readJsonConstant(source, name) {
  const marker = `const ${name} = `;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `${name} tidak ditemukan`);
  const arrayStart = source.indexOf("[", start + marker.length);
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = arrayStart; index < source.length; index++) {
    const char = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "[") depth++;
    else if (char === "]" && --depth === 0) {
      return JSON.parse(source.slice(arrayStart, index + 1));
    }
  }
  throw new Error(`${name} tidak lengkap`);
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/ustadzah|ustadz|ustzh|usth|ustz|ust\.|ust/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const teachers = readJsonConstant(seedSource, "MASTER_SCHEDULE_TEACHERS");
const schedules = readJsonConstant(seedSource, "MASTER_ATTENDANCE_SCHEDULES");

function resolveTeacher(user) {
  const username = normalize(user.Username);
  const name = normalize(user.Name);
  const direct = teachers.find((teacher) => {
    const usernames = [teacher.Username].concat(teacher.UsernameAliases || []);
    const names = [teacher.Name, teacher.ShortName].concat(teacher.Aliases || []);
    return usernames.some((value) => username && normalize(value) === username) ||
      names.some((value) => name && normalize(value) === name);
  });
  return direct || teachers.find(
    (teacher) => teacher.TeacherSourceID === user.TeacherSourceID,
  );
}

function mergeCount(rows) {
  const merged = [];
  rows.sort((a, b) => a.StartTime.localeCompare(b.StartTime)).forEach((row) => {
    const previous = merged.find((candidate) =>
      candidate.TeacherSourceID === row.TeacherSourceID &&
      candidate.Type === row.Type &&
      candidate.SubjectOrActivityName === row.SubjectOrActivityName &&
      candidate.ClassOrGroupName === row.ClassOrGroupName &&
      candidate.DayOfWeek === row.DayOfWeek &&
      candidate.EndTime === row.StartTime,
    );
    if (previous) previous.EndTime = row.EndTime;
    else merged.push({ ...row });
  });
  return merged.length;
}

const dede = resolveTeacher({ Username: "dede", Name: "Ust. Dede" });
const mudirDede = resolveTeacher({ Username: "mudir", Name: "Dede Nuriman,Lc." });
const legacyWrongDede = resolveTeacher({
  Username: "dede",
  Name: "Ust. Dede",
  TeacherSourceID: "T005",
});
const rido = resolveTeacher({ Username: "rido", Name: "Ust. Rido" });

assert.equal(dede.TeacherSourceID, "T001");
assert.equal(mudirDede.TeacherSourceID, "T001");
assert.equal(legacyWrongDede.TeacherSourceID, "T001");
assert.equal(rido.TeacherSourceID, "T005");

const dedeWednesday = schedules.filter(
  (row) => row.DayOfWeek === "Rabu" && row.TeacherSourceID === "T001",
);
const ridoWednesday = schedules.filter(
  (row) => row.DayOfWeek === "Rabu" && row.TeacherSourceID === "T005",
);
assert.equal(dedeWednesday.length, 6);
assert.equal(mergeCount(dedeWednesday), 3);
assert.equal(ridoWednesday.length, 9);
assert.equal(mergeCount(ridoWednesday), 5);

assert.match(attendanceSource, /ATTENDANCE_MASTER_DATA_VERSION = "2026-09-24\.2"/);
assert.match(attendanceSource, /TeacherName: ATT_teacherDisplayName_\(normalized\)/);
assert.match(attendanceTabSource, /Pengajar: <strong x-text="sched\.TeacherName \|\| sched\.TeacherID \|\| '-'"><\/strong>/);
assert.match(authSource, /UserID: row\[headers\.indexOf\("UserID"\)\]/);
assert.match(authSource, /TeacherSourceID: row\[headers\.indexOf\("TeacherSourceID"\)\]/);
assert.match(frontendSource, /if \(!activeUserId && responseUserId && this\.user\)/);
assert.match(frontendSource, /if \(responseUserId && activeUserId && responseUserId !== activeUserId\) return false/);
assert.match(frontendSource, /authRestoring: true/);
assert.match(frontendSource, /restoreViewState\(savedView, canonicalUser\)/);
assert.match(frontendSource, /verifyAttendanceSave\(payload, generation, err\.message\)/);
assert.match(attendanceSource, /session: ATT_clientSessionSummary_\(updatedSession\)/);

const attendanceContext = vm.createContext({
  Utilities: {
    formatDate: (date) => new Date(date).toISOString().slice(0, 10),
  },
  Session: {
    getScriptTimeZone: () => "Asia/Jakarta",
  },
});
vm.runInContext(
  `${attendanceSource}\nthis.__classCandidates = ATT_classCandidates_; this.__clientSession = ATT_clientSessionDetail_;`,
  attendanceContext,
);
const conflictingCandidates = Array.from(
  attendanceContext.__classCandidates("12 Ikhwan", "11", "Akhwat"),
);
assert.ok(conflictingCandidates.includes("12 Ikhwan"));
assert.ok(!conflictingCandidates.includes("11 Akhwat"));

const serializedSession = attendanceContext.__clientSession(vm.runInContext(`({
  SessionID: "ATS1",
  ScheduleID: "SCH1",
  AttendanceDate: new Date("2026-09-21T00:00:00.000Z"),
  SubmittedAt: new Date("2026-09-21T01:00:00.000Z"),
  UpdatedAt: new Date("2026-09-21T01:00:00.000Z"),
  AttendanceType: "KBM",
  ClassOrGroupName: "10 Ikhwan",
  ActivityName: "Aqidah",
  Status: "Submitted"
})`, attendanceContext));
assert.equal(serializedSession.AttendanceDate, "2026-09-21");
assert.equal(serializedSession.SubmittedAt, "2026-09-21T01:00:00.000Z");
assert.equal(serializedSession.UpdatedAt, "2026-09-21T01:00:00.000Z");
assert.ok(Object.values(serializedSession).every((value) => value === null || ["string", "number", "boolean"].includes(typeof value)));

console.log(
  "Identity sync OK: Dede/Mudir=3 kartu Rabu; Rido=5 kartu Rabu; kelas utama tidak bercampur dengan fallback.",
);
