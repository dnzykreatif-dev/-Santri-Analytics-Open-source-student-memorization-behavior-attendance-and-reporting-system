# Santri Analytics

Santri Analytics adalah web app Google Apps Script untuk mengelola data
santri, absensi, hafalan, perilaku, akademik, informasi pesantren, dan laporan
wali. Aplikasi memakai Google Sheets sebagai penyimpanan utama dan dirancang
agar dapat digunakan dari desktop maupun HP.

Dokumentasi ini menggambarkan baseline deployment versi 201.

## Fitur Utama

- Absensi berbasis jadwal untuk `Pondok`, `KBM`, dan `Kegiatan`.
- Sesi absensi yang dapat disimpan, dibuka kembali, dan diperbarui tanpa
  membuat duplikasi.
- Rekap kehadiran per santri, kelas, guru, mata pelajaran/kegiatan, dan bulan.
- Pengelolaan santri, hafalan, perilaku, nilai akademik, dan laporan wali.
- Sinkronisasi identitas guru melalui `TeacherSourceID`.
- Navigasi konsisten pada sidebar desktop, drawer HP, bar bawah, dan menu
  `Lainnya`.
- Pemulihan halaman aktif sesudah refresh tanpa menampilkan halaman login
  sementara.

## Hak Akses

| Peran | Akses utama |
| --- | --- |
| Admin | Seluruh data, user, jadwal, audit, dan perbaikan integritas |
| Mudir | Monitoring seluruh data, semua jadwal, rekap, dan audit |
| Ustadz | Jadwal sendiri, absensi kelas yang diampu, hafalan, dan data operasional |
| Wali | Data dan laporan anak yang terhubung ke akun wali |

Pembatasan jadwal guru diterapkan di backend. Mengubah payload dari browser
tidak memberi Ustadz akses ke jadwal guru lain.

## Arsitektur

```text
Browser / PWA-like UI
        |
        | google.script.run
        v
Google Apps Script backend
        |
        v
Google Sheets database
```

File penting:

| File | Tanggung jawab |
| --- | --- |
| `Index.html` | Shell aplikasi dan pemilihan tampilan login/aplikasi |
| `JS_App.html` | State Alpine.js, autentikasi, cache, navigasi, dan aksi UI |
| `Attendance.gs` | Sesi absensi, penyimpanan detail, rekap, dan laporan wali |
| `AttendanceIntegrity.gs` | Audit serta perbaikan integritas akun/jadwal/absensi |
| `Schedule.gs` | Pengambilan dan pengelolaan jadwal |
| `SeedSchedulesMaster.gs` | Seed jadwal resmi tahun 2026 |
| `Students.gs` | Pengelolaan dan pembacaan data santri |
| `Auth.gs` | Login, logout, validasi token, dan pemulihan sesi |
| `Layout_NavDesktop.html` | Sidebar desktop dari konfigurasi navigasi bersama |
| `Layout_NavMobile.html` | Drawer, bar bawah, dan menu tambahan pada HP |
| `Tab_Absensi.html` | Antarmuka jadwal dan daftar status kehadiran |
| `Tab_JadwalAdmin.html` | Pengelolaan jadwal dan panel audit |

## Sumber Data Spreadsheet

| Sheet | Fungsi |
| --- | --- |
| `Students` | Data master santri dan kelas aktif |
| `Users` | Akun aplikasi serta relasi guru/wali |
| `Sessions` | Token sesi login |
| `Schedules` | Jadwal Pondok, KBM, dan Kegiatan |
| `AttendanceSessions` | Header satu sesi absensi per jadwal dan tanggal |
| `Attendance` | Status kehadiran tiap santri |
| `AttendanceMigrationBackup` | Cadangan draft kosong sebelum perbaikan data |

Daftar santri absensi berasal dari `Students`. Santri hanya dimuat jika
`DeletedAt` kosong dan `Status` kosong, `Active`, atau `Aktif`. Nilai
`Students[Class/Level]` harus cocok dengan `Schedules[ClassOrGroupName]`.
Petunjuk koreksi data lengkap tersedia di `PANDUAN_DATA_MASTER.md`.

## Modul Absensi

Alur Ustadz:

1. Login dan buka `Absensi Santri`.
2. Aplikasi mengambil jadwal milik akun berdasarkan `TeacherSourceID`, hari,
   tanggal, dan kategori.
3. Pilih satu jadwal.
4. Aplikasi membuat atau membuka kembali satu draft sesi yang sama.
5. Daftar santri diambil dari kelas jadwal dan awalnya ditandai `Hadir`.
6. Ubah status menjadi `Izin`, `Sakit`, `Alpa`, atau `Telat` bila diperlukan.
7. Simpan. Detail santri di-upsert berdasarkan sesi, bukan ditambahkan ulang.

Endpoint utama:

- `getAttendanceHome(currentUser, date)`
- `getAttendanceSession(payload, currentUser)`
- `saveAttendanceSession(payload, currentUser)`
- `getAttendanceRecap(filters, currentUser)`
- `getGuardianAttendanceSummary(studentId, month, currentUser)`
- `auditAttendanceIntegrity(currentUser)`
- `repairAttendanceIntegrity(options, currentUser)`

Identitas guru menggunakan `TeacherSourceID` sebagai kunci kanonis.
`Username` hanya menjadi fallback tepat untuk data lama. Satu sesi ditentukan
oleh jadwal dan tanggal sehingga membuka jadwal yang sama tidak membuat kartu
atau sesi duplikat.

## Refresh dan Pemulihan Halaman

Browser menyimpan state tampilan per akun di `sessionStorage`, mencakup:

- tab utama;
- subtab absensi;
- tanggal absensi;
- mode `Jadwal Saya` / `Semua Jadwal`; dan
- jadwal atau sesi yang sedang dibuka.

Saat refresh, aplikasi menjalankan `resumeSession()` lebih dahulu. Shell
pemulihan tampil sampai identitas tervalidasi, kemudian halaman sebelumnya
dibuka kembali. State akun lama dibersihkan saat login dan logout. Respons
asynchronous dari sesi lama ditolak memakai nomor generasi autentikasi.

## Keandalan Penyimpanan

Nilai `Date` dari Spreadsheet tidak boleh dikirim mentah ke browser karena
`google.script.run` dapat menyelesaikan callback tanpa payload. Respons sesi
selalu melewati DTO client yang mengubah tanggal menjadi string ISO dan hanya
mengirim tipe data primitif.

Jika callback penyimpanan tidak membawa respons yang valid, UI tidak langsung
menyatakan gagal. Aplikasi membuka ulang sesi dan membandingkan `StudentID`,
`Status`, dan `Notes`. Notifikasi berhasil ditampilkan bila data di server
sudah sama dengan input pengguna.

## Jadwal Master 2026

Seed resmi berisi 420 jadwal:

- 342 jadwal KBM; dan
- 78 jadwal kegiatan.

Jam KBM mengikuti kolom `Jadwal_KBM.waktu` pada workbook master. Setelah
workbook resmi berubah, regenerasi konstanta dengan:

```powershell
python tools/generate_schedule_seed.py
```

Periksa hasil audit sebelum menerapkan perubahan ke spreadsheet produksi.

## Setup

1. Isi `SPREADSHEET_ID` dan konfigurasi lain di `Config.gs`.
2. Pastikan seluruh sheet dan header wajib tersedia melalui fungsi setup.
3. Jalankan seed jadwal hanya dari akun Mudir/Admin yang berwenang.
4. Isi `TeacherSourceID` pada akun pengajar dan jadwal.
5. Deploy sebagai Google Apps Script Web App.
6. Uji login minimal sebagai Mudir, Ustadz, Ustadzah, Admin, dan Wali.

Migrasi dan setup dibuat idempoten: menjalankannya kembali tidak boleh membuat
header, jadwal, atau sesi yang sama menjadi berlipat.

## Pengujian Lokal

Jalankan regresi identitas, jadwal, kelas, dan serialisasi:

```powershell
node tools/test_attendance_identity_sync.js
```

Jalankan regresi pemulihan halaman:

```powershell
node tools/test_view_state.js
```

Sebelum deploy, parse seluruh `.gs` dan JavaScript dalam `JS_App.html`, lalu
jalankan:

```powershell
git diff --check
```

## Deployment

Alur deployment yang disarankan:

```powershell
clasp push
clasp version "Ringkasan perubahan"
clasp deploy --deploymentId <DEPLOYMENT_ID> --versionNumber <VERSION>
```

Deployment produksi yang didokumentasikan:

```text
Version: 201
Deployment ID: AKfycbxP3xqiB3va56ipHb-aVyS4nIN1oBdgWsTsSmDnc0L24TBpV2tE4PexMMmj0Uwgu0YVsQ
```

Peningkatan raport v2 menggunakan feature flag dan tidak aktif otomatis.
Siapkan project Apps Script, Spreadsheet, serta template laporan staging yang
terpisah, lalu atur Script Properties `SPREADSHEET_ID`, `REPORT_TEMPLATE_ID`,
`REPORT_V2_ROLLOUT`, dan `REPORT_V2_CANARY_USERS`. Pertahankan deployment ID
produksi agar APK tetap menggunakan URL yang sama.

Jalankan regresi raport sebelum deployment:

```powershell
node tools/test_report_v2.js
```

## Audit dan Pemulihan

- Jalankan `auditAttendanceIntegrity()` untuk pemeriksaan tanpa perubahan.
- Gunakan `repairAttendanceIntegrity({ dryRun: true })` terlebih dahulu.
- Terapkan perbaikan hanya sesudah hasil dry-run diperiksa.
- Draft kosong yang dibersihkan dicadangkan ke
  `AttendanceMigrationBackup`.
- Sesi `Submitted` dan riwayat lama tidak dihapus hanya karena belum memiliki
  `TeacherSourceID`.

## Dokumentasi Lanjutan

- `TECHNICAL_NOTES.md`: kontrak teknis, integrasi, dan keputusan arsitektur.
- `PANDUAN_DATA_MASTER.md`: koreksi kelas/status santri serta roadmap
  pengaturan tanpa kode.
- `CHANGELOG.md`: riwayat versi penting modul absensi.

## Catatan Keamanan

- Jangan menyimpan password plaintext di sheet atau source code.
- Jangan membagikan token sesi melalui URL atau log publik.
- Hak akses harus selalu diperiksa di backend, bukan hanya menyembunyikan menu.
- Buat cadangan spreadsheet sebelum migrasi atau perbaikan massal.
