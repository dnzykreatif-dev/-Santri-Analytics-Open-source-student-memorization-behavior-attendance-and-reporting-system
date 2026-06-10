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
