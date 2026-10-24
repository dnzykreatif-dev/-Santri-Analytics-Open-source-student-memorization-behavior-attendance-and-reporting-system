const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const source = fs
  .readFileSync(path.join(root, "JS_App.html"), "utf8")
  .replace(/^\s*<script>\s*/, "")
  .replace(/\s*<\/script>\s*$/, "");

const values = new Map();
const context = vm.createContext({
  window: {},
  INCIDENT_CATEGORIES: [],
  sessionStorage: {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  },
  console,
  setTimeout,
  clearTimeout,
});
vm.runInContext(source, context);

const app = context.window.app();
app.user = { UserID: "USR-RIDO", Username: "rido", Role: "Ustadz", TeacherSourceID: "T005" };
app.isLoggedIn = true;
app.authRestoring = false;
app.currentTab = "absensi";
app.attendanceView = "KBM";
app.attendanceDate = "2026-09-21";
app.attendanceActiveSession = true;
app.attendanceSessionData = {
  ScheduleID: "MASTER-KBM-RIDO-1",
  Type: "KBM",
  TeacherID: "rido",
  TeacherSourceID: "T005",
  SubjectOrActivityName: "Fiqh",
  ClassOrGroupName: "12 Ikhwan",
  DayOfWeek: "Senin",
};
app.saveViewState();

const saved = app.readViewState(app.user);
assert.equal(saved.currentTab, "absensi");
assert.equal(saved.attendanceView, "KBM");
assert.equal(saved.attendanceDate, "2026-09-21");
assert.equal(saved.attendanceActiveSchedule.ScheduleID, "MASTER-KBM-RIDO-1");

const restored = context.window.app();
restored.user = app.user;
restored.restoreViewState(saved, app.user);
assert.equal(restored.currentTab, "absensi");
assert.equal(restored.attendanceView, "KBM");
assert.equal(restored.attendanceRestoreSchedule.ScheduleID, "MASTER-KBM-RIDO-1");

restored.attendanceDate = "2026-09-22";
const payload = restored.attendanceSchedulePayload({
  ScheduleID: "MASTER-KBM-RIDO-1",
  Type: "KBM",
  AttendanceDate: "2026-09-21",
  TeacherID: "rido",
  TeacherSourceID: "T005",
  SubjectOrActivityName: "Fiqh",
  ClassOrGroupName: "12 Ikhwan",
});
assert.equal(payload.AttendanceDate, "2026-09-22");

restored.applyAttendanceSession({
  session: { ScheduleID: "MASTER-KBM-RIDO-1", AttendanceDate: "2026-09-21" },
  records: [],
});
assert.equal(restored.attendanceSessionData.AttendanceDate, "2026-09-22");

restored.restoreViewState({ currentTab: "users" }, { UserID: "USR-RIDO", Role: "Ustadz" });
assert.equal(restored.currentTab, "dashboard");

console.log("View state OK: tab, filter absensi, tanggal, dan sesi aktif pulih per akun.");
