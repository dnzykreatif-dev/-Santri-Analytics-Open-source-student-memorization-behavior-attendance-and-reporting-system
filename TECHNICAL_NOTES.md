# Santri Analytics Technical Notes

## Runtime Shape

This project is a Google Apps Script web app. `doGet()` renders `Index.html`,
which includes layout, tab, modal, style, and JavaScript partials. The frontend
uses Alpine.js and supports two transport modes:

1. Native Apps Script mode through `google.script.run`.
2. External-host mode through `fetch()` + `doPost(e)` dispatch.

Server responses should keep the existing shape:

```js
{ ok: boolean, data?: object, message?: string }
```

Authentication returns `{ ok: true, user }` for compatibility with the current
login handler.

## Deployment Targets

There are now two valid browser entry patterns:

- **Apps Script web app**: open the deployed `.../exec` URL directly. This is
  the primary and most stable runtime for the project.
- **External wrapper / host**: only works if the host provides a real
  `SCRIPT_URL` that points back to the deployed Apps Script web app and the
  page is allowed to be embedded or proxied safely.

Important notes for external hosting:

- `SCRIPT_URL` must be an absolute Apps Script web app URL.
- The host must not render the app as a static HTML export only.
- The app now sets `XFrameOptionsMode.ALLOWALL` so iframe-based hosts can
  embed the web app if their platform permits it.
- If the host blocks iframe loading or does not pass `SCRIPT_URL`, the page can
  appear blank even when the Apps Script deployment itself is healthy.

## External Transport Bridge

The browser bridge is designed to make the app more tolerant of non-native
hosts, but it still expects a live Apps Script backend.

Frontend behavior:

- If `google.script.run` exists, the app keeps using the native Apps Script
  transport.
- If `google.script.run` is missing, the bridge falls back to `fetch()` and
  posts `{ action, args }` to `SCRIPT_URL`.

Backend behavior:

- `doPost(e)` in `Code.gs` dispatches the requested action name.
- Responses are wrapped as JSON with `{ ok, data, message }`.
- The dispatcher is intentionally strict: only named global functions can be
  called.

## Core Sheets

`initializeApp()` is the safe setup entry point. It prepares `Users` plus the
core operational sheets without deleting existing data:

- `Students`
- `MemorizationLogs`
- `Incidents`
- `Attendance`
- `HafalanLinks`
- `PulangBulanan`
- `AcademicPeriods`
- `AcademicSubjects`
- `AssessmentComponents`
- `AcademicScores`
- `AcademicScoreImport`

Setup is idempotent. Missing sheets are created, and missing headers are added
to the end of the first row. Existing rows and existing columns are preserved.

## Main Flows

- Mudir/Admin manage users, run setup, and can use `runHealthCheck()`.
- Ustadz/Mudir input memorization logs, attendance notes, incidents, and links.
- Wali users are matched to students by `StudentID`, `WaliUsername`, or parent
  contact behavior already present in the app.
- Inactive Wali status is synced to linked student rows through
  `syncStudentStatus()` and also filtered from active dashboard counts.

## Attendance Module

Attendance is now session-based so one teacher schedule on one date maps to a
single editable attendance session. The operational types are `Pondok`, `KBM`,
and `Kegiatan`.

Key sheets:

- `Schedules` stores the source schedule used by the HP/PWA attendance flow.
- `AttendanceSessions` stores one row per attendance session/date/schedule.
- `Attendance` stores one row per student inside a session.
- `SeedSchedulesMaster.gs` contains the generated importer from
  `Database_Jadwal_Pesantren_2026_MASTER_APP_REVISI.xlsx`. It seeds missing
  teacher accounts and upserts the 2026 KBM/non-KBM schedules with stable
  `ScheduleID` values, so it can be run repeatedly without duplicating master
  rows.

Primary API flow:

1. `getAttendanceHome(currentUser, { date })` loads the user's schedule cards
   for the selected date and includes existing session counts.
2. `getAttendanceSession(payload, currentUser)` opens or creates a draft
   session and returns all students in `ClassOrGroupName`.
3. `saveAttendanceSession(payload, currentUser)` upserts student statuses for
   that session and updates the session summary counts.
4. `getAttendanceRecap(filters, currentUser)` returns monthly/statistical
   summaries by student, class, activity, and teacher.
5. `getGuardianAttendanceSummary(studentId, month, currentUser)` returns the
   Wali-facing monthly attendance summary for one student.

Compatibility notes:

- Existing `Attendance` rows without `SessionID` are still readable.
- The old single-student `logAttendance(data)` path remains available for
  older keterangan forms, but new class attendance should use sessions.
- `Alpha` and `Alpa` are normalized to `Alpa` in new summaries.

### Attendance student source of truth

- Attendance participants are read from the `Students` sheet.
- `Class/Level` is the canonical attendance class and should match
  `Schedules.ClassOrGroupName`.
- `Level + Gender` is only a fallback when `Class/Level` is empty or does not
  yet include an Ikhwan/Akhwat group. Conflicting fallback fields must not add
  a student to a second class.
- Rows with `DeletedAt` are excluded.
- Only blank, `Active`, or `Aktif` student statuses enter new attendance
  sessions. `Lulus`, `Berhenti`, and `Inactive` remain available as historical
  records but are excluded from attendance.
- Operational guidance and the no-code product roadmap are documented in
  `PANDUAN_DATA_MASTER.md`.

## Sistem Informasi Pesantren

`Sistem Informasi Pesantren` is now a real content module backed by the
`PesantrenInfo` sheet. The module is used for pondok information that Wali need
to read, such as announcements, education calendars, guardian guides,
documents, service contacts, and pondok activities.

Access rules:

- Mudir, Admin, and Ustadz can open `Sistem Informasi` and use
  `Input & Kelola` to add, edit, publish, archive, or delete content.
- Wali only sees published public content. Wali cannot access the input or
  management panel.
- Content appears to Wali only when `Status` is `Published` and `Audience` is
  `Semua` or `Wali`.

Input path for staff:

1. Open `Sistem Informasi`.
2. Click `Tambah Informasi` or the `Input & Kelola` section.
3. Fill title, category, summary/content, audience, status, priority, dates,
   optional attachment, and optional contact.
4. Use `Published` when the item is ready for Wali. Use `Draft` while preparing
   content, and `Archived` for old information.

The sheet setup is idempotent. `initializeApp()` creates the `PesantrenInfo`
sheet and missing headers without deleting existing rows.

## Academic Report Module

The academic report module is now the dedicated flow for full student report
cards that combine academic scores, memorization, behavior, and attendance.

Key sheets:

- `AcademicPeriods` for report periods and publish state.
- `AcademicSubjects` for flexible subjects by level, gender, class, and
  category.
- `AssessmentComponents` for per-period/per-subject score weights.
- `AcademicScores` for the normalized score matrix.
- `AcademicScoreImport` for staging mass imports.

Role rules:

- `Mudir` and `Admin` can manage periods, subjects, weights, publish, and
  unlock periods.
- `Ustadz` can enter scores and import staged data, but cannot publish or edit
  academic master data.
- `Wali` only sees published periods in the report view.

Default setup behavior:

- `Students` now carries optional `Level` and `Gender` headers.
- New academic reports seed default components at `Harian 40%`, `Tugas 20%`,
  `PTS 20%`, and `PAS/PAT 20%`.
- A period can only be published when required scores are present and valid
  for the applicable student-subject combinations.

Operational flow:

1. Fill student `Level` and `Gender` first.
2. Create a report period in `Akademik`.
3. Create subjects, then components or accept the seeded defaults.
4. Open the score matrix, fill scores, and save.
5. Or populate `AcademicScoreImport` and use the staging import.
6. Publish the period only after validation passes.

Student report output:

- `getStudentReportData(studentId, periodId, currentUser)` now returns
  `academic` alongside `hafalan`, `behavior`, and `attendance`.
- The report modal includes a period selector and a printable academic table.
- Wali sees an empty state when no period has been published yet.

### Report v2 rollout

Report v2 is additive and disabled by default. Configure it with Script
Properties instead of changing production IDs in source code:

- `SPREADSHEET_ID`: spreadsheet for the current environment; falls back to
  the legacy value in `Config.gs` when absent.
- `REPORT_TEMPLATE_ID`: Google Docs report template for the environment.
- `REPORT_V2_ROLLOUT`: `off`, `canary`, or `on`.
- `REPORT_V2_CANARY_USERS`: comma-separated usernames enabled during canary.

In `canary` mode, Mudir/Admin are enabled automatically. New periods created
while report v2 is enabled use one `Ujian Semester` component at 100%. Existing
periods are marked `WeightedComponents` and keep their original components.

New sheets are `AcademicTeacherAssignments` and
`ExamEligibilityOverrides`. Setup only appends missing headers/sheets. Run
`initializeApp()` twice on a staging copy and confirm the second run creates no
duplicates before touching production.

Safe activation order:

1. Clone the production spreadsheet, report template, and Apps Script project.
2. Set staging Script Properties and enable `REPORT_V2_ROLLOUT=on` there.
3. Run setup, health check, assignment synchronization preview, and role smoke tests.
4. Deploy production code with `REPORT_V2_ROLLOUT=off`.
5. Enable `canary`, validate selected users, then switch to `on`.
6. Roll back by setting the flag to `off`; if necessary, repoint the existing
   deployment ID to the previous secure version.

Official PDFs are generated on demand, returned as authenticated base64 data,
and downloaded by the browser. The temporary Google Docs copy is trashed in a
`finally` block and no public Drive PDF is retained.

## Behavior Score Rules

Behavior score starts at 100 and is accumulated in chronological order without
a maximum or minimum cap. Improvements can push the score above 100, and
repeated violations can push it below 0.

Incident points are normalized on write and read:

- `Violation` is always stored/calculated as negative.
- `Improvement` is always stored/calculated as positive.
- Existing historical rows with the wrong sign are corrected at calculation
  time by `calculateBehaviorScore_()`.

## Upgrade Guidance

Before adding major features or UI/UX changes, run:

1. `initializeApp()` after deploy if sheet structure may be incomplete.
2. `runHealthCheck(currentUser)` as Mudir/Admin.
3. A smoke test for login, dashboard, user password update, student detail,
   memorization, incidents, links, reports, and Pulang Bulanan.

Keep future frontend calls aligned with existing Apps Script functions or add a
small compatibility wrapper so older UI paths continue to work.

## Recent Stabilization and UX Work

This section records the work completed during the `codex/stabilize-santri-analytics`
branch so the next chat has a single source of truth.

### 1. Runtime and data-contract fixes

- Fixed the dashboard chart reference path so the render helper is called from
  the correct app object.
- Ensured user password updates write both `Salt` and `PasswordHash`.
- Consolidated student status synchronization so there is one active
  implementation path.
- Updated report flows to use `MemorizationLogs` consistently instead of the
  older `Memorization` reference.
- Preserved the frontend response shape `{ ok, data, message }` across the
  stabilized flows.

### 2. Setup and health-check hardening

- Made setup idempotent for the core sheets.
- Expanded `initializeApp()` so it validates and completes required headers
  without deleting user data.
- Added health-check behavior for Mudir/Admin so missing sheets and headers
  can be detected early.
- Kept all setup changes non-destructive to existing Google Sheet rows.

### 3. Behavior score rules

- Score starts at 100 and is no longer capped at 100 on the positive side.
- Prestasi / improvement entries can push the score above 100.
- Repeated violations can push the score below 0, so negative totals are
  visible instead of being clamped.
- Incident points are normalized so violation flow stays negative and
  improvement flow stays positive.

### 4. UI and navigation upgrade

- Added professional icons for every main menu item.
- Modernized desktop and mobile navigation with a stable `setCurrentTab()`
  flow.
- Added `Sistem Informasi Pesantren` as a visible tab and menu entry.
- Kept mobile bottom navigation and `More` menus role-aware.
- Added a dedicated `Tab_InformasiPesantren.html` page for pesantren
  information, quick actions, announcements, calendar entries, guides,
  documents, contacts, and staff-managed content.
- Added a compact mobile drawer and tightened bottom navigation spacing so the
  header and bottom menu do not cover the main content.

### 4a. Pesantren information content management

- Added `PesantrenInfo.gs` for role-aware CRUD around the `PesantrenInfo`
  sheet.
- Added `getPesantrenInfo`, `savePesantrenInfo`,
  `setPesantrenInfoStatus`, and `deletePesantrenInfo`.
- Staff see the `Input & Kelola` section by default when opening
  `Sistem Informasi`.
- The top action `Tambah Informasi` opens the editor directly for Mudir/Admin/
  Ustadz.
- The editor includes a short `Cara Input` guide so staff know that published
  content is what Wali can read.
- Wali see only public sections: Beranda, Pengumuman, Kalender, Panduan,
  Dokumen, and Kontak.

### 5. Student detail experience

- Refined the student detail modal into a clearer menu-like tab strip with
  icons for hafalan, perilaku, grafik, laporan, raport, and link live.
- Promoted the Wali experience so student detail is now the main working view
  inside the `Santri` tab for Wali users.
- Kept the old modal behavior for Admin and Ustadz when they click a student
  name.
- Added `Tab_WaliSantriDetail.html` as the Wali-oriented detail surface.

### 5a. Academic report feature

- Added `Academic.gs` as a dedicated backend module for academic periods,
  subjects, score components, score matrices, staging import, and publish
  validation.
- Added `Tab_Akademik.html` for staff-level management of the academic report
  workflow.
- Extended the student report modal so it now includes the academic table and
  period selector.
- Added `Level` and `Gender` to student setup so subject filtering can respect
  SMP/SMA and ikhwan/akhwat rules.
- Added `Tab_PanduanUstadz.html` content that explains academic reporting,
  system information, behavior logging, memorization, attendance, and report
  handling.

### 6. Lists, forms, and long-content handling

- Condensed long lists for behavior notes, dashboard note blocks, hafalan
  lists, and other dense views so they stay readable on mobile.
- Kept the existing `Muat Lagi` pattern for paginated scrolling behavior.
- Improved the pulang bulanan CRUD path and summary behavior.

### 7. Current frontend contract

Current tab structure remains compatible with the existing shell:

- `dashboard`
- `santri`
- `hafalan`
- `pelanggaran`
- `list_perilaku`
- `link_live`
- `pulang_bulanan`
- `panduan`
- `panduan_wali`
- `users`
- `informasi_pesantren`
- `akademik`

Student detail behavior now follows role:

- Wali: detail santri acts as the main working view inside `Santri`.
- Mudir / Ustadz: click a student name to open the modal detail surface.

### 8. Files most recently added or updated

- `Tab_InformasiPesantren.html`
- `Tab_Akademik.html`
- `Academic.gs`
- `Tab_WaliSantriDetail.html`
- `Index.html`
- `JS_App.html`
- `Layout_NavDesktop.html`
- `Layout_NavMobile.html`
- `Modal_StudentDetail.html`
- `Tab_Students.html`

### 9. Practical validation already used

- Parse all `.gs` files with Node.
- Parse `JS_App.html` after stripping the `<script>` wrapper.
- Run `git diff --check`.
- Verify `git status --short` is clean after commit.

## Troubleshooting Browser Hosting

If the external host shows a blank page while Apps Script runs normally:

1. Open the deployed Apps Script `.../exec` URL directly and confirm it works.
2. Check whether the wrapper host is embedding the app in an iframe or
   rewriting the page.
3. Verify that the wrapper injects `SCRIPT_URL` correctly.
4. Check console errors for `X-Frame-Options`, missing `SCRIPT_URL`, or failed
   `fetch()` calls to the Apps Script backend.
5. If the wrapper is only static hosting, use a redirect or reverse proxy
   rather than a static export of the HTML partials.

## Academic User Guide

When using the academic report module in the UI:

1. Open `Akademik`.
2. If the page is empty, click `Setup` as Mudir/Admin to create the period
   and subjects.
3. In `Profil Santri`, fill `Level` and `Gender` for each student.
4. In `Setup`, create or edit the period and subjects.
5. In `Input Nilai`, select period, subject, and class, then load the matrix.
6. Fill scores from 0 to 100 and save.
7. For mass input, fill `AcademicScoreImport` and use `Import Staging`.
8. Publish the period only after validation succeeds.

The `Panduan Ustadz` tab now explains the same flow in a more operational,
step-by-step format for staff.

These notes describe the current stabilized baseline. Future UI/UX upgrades
should build on this contract instead of reintroducing hidden menu paths or
clamping the score logic back to 0-100.

## Attendance Identity and Schedule Integrity (2026-09-16)

- `TeacherSourceID` is the canonical teacher key across `Users`, `Schedules`,
  `AttendanceSessions`, and `Attendance`. Username matching is retained only
  for legacy rows and must be exact after normalization.
- Session restoration resolves `Sessions.UserID` first. The browser validates
  the session with `resumeSession()` before showing user-scoped data.
- Attendance caches are scoped by user, teacher source, date, and schedule
  mode. Login and logout invalidate all user-scoped state, and stale async
  responses are rejected by an authentication generation number.
- `SeedSchedulesMaster.gs` contains 420 official rows: 342 KBM and 78
  activities. KBM times come from `Jadwal_KBM.waktu` in the official workbook.
- Regenerate the constants with `tools/generate_schedule_seed.py` whenever the
  official workbook changes. The generator validates row counts, teacher IDs,
  and every KBM time before writing the seed.
- `auditAttendanceIntegrity()` is read-only. `repairAttendanceIntegrity()`
  defaults to dry-run, backs up removable empty drafts in
  `AttendanceMigrationBackup`, preserves submitted history, and is idempotent.
- Desktop sidebar, mobile drawer, mobile bottom bar, and the `Lainnya` menu all
  read from one `NAVIGATION_ITEMS` configuration in `JS_App.html`.

## Session Restore and Attendance Response Safety (2026-09-21)

### Refresh lifecycle

- The Alpine application starts with `authRestoring: true` and does not render
  the public login page while a stored session is being checked.
- `resumeSession()` validates the token and returns the canonical user identity
  before any user-scoped request is allowed to populate the screen.
- A lightweight restore shell is shown during validation. On success, the app
  restores the previous page; on failure, it clears the invalid session and
  shows the login page.
- Each login/logout increments the authentication generation. Success or
  failure callbacks created by an earlier generation are ignored.

### Per-user view state

The browser stores the following object in `sessionStorage`, keyed by the
canonical user identity:

```text
{
  currentTab,
  attendanceView,
  attendanceDate,
  attendanceShowAllSchedules,
  attendanceActiveSchedule
}
```

Restore remains role-safe: a stored tab is accepted only if it is present in
the active role's `NAVIGATION_ITEMS`. An attendance session is reopened only
when its `ScheduleID` is present in the freshly authorized home response.

`resetUserScopedState()` clears schedules, attendance sessions, students,
recaps, active selections, request flags, and in-memory caches. Logout also
removes the persisted view state so a later account cannot inherit it.

### Apps Script serialization boundary

Rows read with `getValues()` may contain JavaScript `Date` objects. Returning a
raw row object through `google.script.run` can result in a success callback
with no usable payload. This is particularly visible when reopening an
attendance session after refresh because `AttendanceDate`, `SubmittedAt`, or
`UpdatedAt` may be real Spreadsheet dates.

All attendance responses crossing the browser boundary must use explicit DTO
helpers:

- `ATT_clientSessionSummary_()` for list/save responses; and
- `ATT_clientSessionDetail_()` for the session editor.

These helpers convert dates to ISO strings, normalize text and counts, and do
not expose internal fields such as `_rowNumber`. New endpoints must follow the
same rule: return arrays, plain objects, strings, numbers, booleans, or null;
never return a raw Spreadsheet row.

### Ambiguous save verification

The attendance write is idempotent and keyed by session plus student. If the
save callback has no valid response, the browser reopens the same session and
compares every submitted `StudentID`, `Status`, and `Notes` value. A matching
server state is treated as success; a mismatch remains an actionable error.
This prevents a committed write from being reported as failed merely because
the callback payload could not be serialized.

### Regression commands

```powershell
node tools/test_attendance_identity_sync.js
node tools/test_view_state.js
```

The identity test covers teacher isolation, official class matching, schedule
card counts, legacy fallback behavior, and session-response date
serialization. The view-state test covers per-user persistence and restoration
of tabs, attendance filters, dates, and active sessions.

The production deployment containing this fix is version `201` at deployment
ID `AKfycbxP3xqiB3va56ipHb-aVyS4nIN1oBdgWsTsSmDnc0L24TBpV2tE4PexMMmj0Uwgu0YVsQ`.
