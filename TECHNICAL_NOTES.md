# Santri Analytics Technical Notes

## Runtime Shape

This project is a Google Apps Script web app. `doGet()` renders `Index.html`,
which includes layout, tab, modal, style, and JavaScript partials. The frontend
uses Alpine.js and calls server functions through `google.script.run`.

Server responses should keep the existing shape:

```js
{ ok: boolean, data?: object, message?: string }
```

Authentication returns `{ ok: true, user }` for compatibility with the current
login handler.

## Core Sheets

`initializeApp()` is the safe setup entry point. It prepares `Users` plus the
core operational sheets without deleting existing data:

- `Students`
- `MemorizationLogs`
- `Incidents`
- `Attendance`
- `HafalanLinks`
- `PulangBulanan`

Setup is idempotent. Missing sheets are created, and missing headers are added
to the end of the first row. Existing rows and existing columns are preserved.

## Main Flows

- Mudir/Admin manage users, run setup, and can use `runHealthCheck()`.
- Ustadz/Mudir input memorization logs, attendance notes, incidents, and links.
- Wali users are matched to students by `StudentID`, `WaliUsername`, or parent
  contact behavior already present in the app.
- Inactive Wali status is synced to linked student rows through
  `syncStudentStatus()` and also filtered from active dashboard counts.

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

Student detail behavior now follows role:

- Wali: detail santri acts as the main working view inside `Santri`.
- Mudir / Ustadz: click a student name to open the modal detail surface.

### 8. Files most recently added or updated

- `Tab_InformasiPesantren.html`
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

These notes describe the current stabilized baseline. Future UI/UX upgrades
should build on this contract instead of reintroducing hidden menu paths or
clamping the score logic back to 0-100.
