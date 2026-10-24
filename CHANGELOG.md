# Changelog

## 2026-10-25 - Pondasi instalasi aman per pondok

- Menambahkan pengaturan koneksi aplikasi ke Spreadsheet milik pondok.
- Menambahkan pengaturan Template Raport milik pondok.
- Menolak koneksi ke Spreadsheet template sebagai database operasional.
- Menambahkan validasi akses Spreadsheet dan Template Raport.
- Menambahkan pencatatan audit saat database instalasi dihubungkan.
- Menambahkan formulir koneksi di Wizard Setup dan login ulang otomatis setelah pergantian database.
- Menambahkan dokumentasi lengkap pemasangan, import data, demo, update, dan rollback.

Perubahan penting Santri Analytics dicatat di dokumen ini. Nomor versi mengacu
pada versi deployment Google Apps Script.

## Unreleased - Product Readiness Level 1 - 2026-10

### Added

- Menambahkan `Setup Pondok` sebagai langkah awal persiapan pondok baru.
- Menambahkan pemeriksaan kesiapan untuk profil pondok, paket fitur, data
  santri, akun pengguna, jadwal, periode akademik, kurikulum, dan akun demo.
- Menambahkan template import terpisah untuk santri, pengguna, dan jadwal.
- Menambahkan alur `Buat Template`, `Preview`, `Proses Import`, dan
  `Selesaikan Setup`.
- Menambahkan pencatatan perubahan setup ke `AuditLogs`.
- Menambahkan isolasi data jadwal untuk instalasi tenant: jadwal master yang
  tertanam di kode tidak lagi di-seed otomatis pada absensi.
- Menambahkan informasi sumber jadwal dan mode instalasi ke editor jadwal.
- Menetapkan `PRODUCT_ARCHITECTURE.md` sebagai keputusan tunggal arah produk
  multi-pondok dan sumber data resmi.
- Menambahkan isolasi data jadwal untuk instalasi tenant: jadwal master yang
  tertanam di kode tidak lagi di-seed otomatis pada absensi.
- Menambahkan informasi sumber jadwal dan mode instalasi ke editor jadwal.

### Safety

- Perubahan dikembangkan pada branch `codex/product-readiness` dan project
  staging terpisah.
- Deployment produksi tidak diubah selama pengerjaan Level 1.
- Fitur readiness tetap memakai mode `off` secara default sehingga aplikasi
  lama tetap berjalan seperti sebelumnya.
- Import memeriksa data lebih dahulu, melewati data yang sudah ada, dan tidak
  menghapus sheet atau data lama.
- Tombol master jadwal dibatasi untuk mode demo/kompatibilitas; instalasi tenant
  diarahkan ke pembuatan jadwal sendiri atau import template pondok.
- Tombol master jadwal dibatasi untuk mode demo/kompatibilitas; instalasi tenant
  diarahkan ke pembuatan jadwal sendiri atau import template pondok.

### Staging

- Deployment staging Level 1: versi `10` dengan keterangan `Setup wizard
  level 1 staging`.
- Pengujian lokal yang sudah dijalankan: regresi raport, sinkronisasi
  identitas absensi, pemulihan tampilan, pemeriksaan sintaks `.gs` dan
  JavaScript, serta `git diff --check`.

### Batasan yang masih dicatat

- Wizard Level 1 masih menggunakan sheet template; belum membuat project
  Apps Script, spreadsheet, atau deployment baru secara otomatis.
- Data periode akademik, kurikulum, dan jadwal ujian tetap perlu dilengkapi
  melalui menu aplikasi setelah import dasar.
- Generator data demo lengkap dan proses penjualan/lisensi otomatis belum
  termasuk Level 1.

### Ownership handoff

- Menambahkan mode instalasi `tenant` untuk pondok pembeli.
- Menambahkan pemeriksaan `TenantID`, Spreadsheet, template raport, pemilik,
  dan email dukungan.
- Mode `tenant` menolak fallback ke database lama jika `SPREADSHEET_ID` belum
  dikonfigurasi.
- Menambahkan tes regresi `tools/test_installation_config.js`.

### Shared core preparation

- Menambahkan kontrak versi wrapper dan inti aplikasi bersama.
- Menambahkan status channel `stable`, `canary`, dan `test` per instalasi.
- Menambahkan kebijakan update dengan persetujuan pondok, sehingga update tidak
  diterapkan diam-diam.
- Menampilkan status koneksi inti bersama pada menu `Setup Pondok`.
- Menambahkan `runAppAction()` sebagai pintu pemanggilan yang dapat memilih
  kode lokal atau `SantriCore.runAction()`.
- Menyiapkan source package `core-library` dengan adapter konteks tenant.

## Version 201 - 2026-09-21

### Fixed

- Menormalisasi respons `getAttendanceSession()` menjadi data primitif yang
  aman dikirim melalui `google.script.run`.
- Mengubah objek tanggal Spreadsheet menjadi string ISO sebelum dikirim ke
  browser.
- Memperbaiki halaman sesi yang berhasil pulih setelah refresh tetapi gagal
  memuat daftar santri karena callback menerima respons kosong.
- Menyamakan bentuk respons sesi dari proses buka dan simpan absensi.

### Tests

- Menambahkan regresi serialisasi `Date` pada pengujian sinkronisasi absensi.
- Memastikan pemetaan Dede/Mudir, Rido, kelas, dan fallback tetap benar.

## Version 200 - 2026-09-21

### Added

- Pemulihan tab, subtab absensi, tanggal, mode jadwal, serta sesi yang sedang
  dibuka setelah refresh browser.
- State tampilan yang dipisahkan per akun di `sessionStorage`.
- Shell pemulihan sesi agar halaman login tidak berkedip sebelum sesi aktif
  selesai divalidasi.
- Verifikasi server setelah respons simpan absensi tidak lengkap.
- Pengujian regresi `tools/test_view_state.js`.

### Fixed

- Refresh tidak lagi selalu mengembalikan pengguna ke dashboard.
- Respons asynchronous dari akun lama tidak boleh menimpa tampilan akun baru.
- Notifikasi gagal palsu sesudah absensi sebenarnya tersimpan dikurangi dengan
  verifikasi ulang isi sesi.

## Versions 196-198 - 2026-09

### Changed

- Mempercepat pemuatan jadwal dan sesi dengan cache yang dipisahkan per akun.
- Mencegah permintaan ganda dari klik berulang dan memberi respons visual
  langsung pada kontrol absensi.
- Mengubah simpan detail absensi menjadi upsert agar membuka kembali draft
  tidak menghasilkan duplikasi.
- Merapikan tombol status kehadiran untuk desktop dan HP agar tidak bertumpuk.
- Mengganti dialog browser lama pada navigasi dengan alur state aplikasi.

## Version 195 - 2026-09

### Added

- Modul sesi absensi untuk `Pondok`, `KBM`, dan `Kegiatan`.
- `TeacherSourceID` sebagai identitas kanonis pengajar pada akun, jadwal, sesi,
  dan detail absensi.
- Seed 420 jadwal master 2026: 342 KBM dan 78 kegiatan.
- Audit serta perbaikan integritas akun, jadwal, kelas, santri, dan sesi.
- Rekap kehadiran dan ringkasan wali.
- Satu konfigurasi navigasi untuk desktop dan HP.

### Security

- Membatasi Ustadz ke jadwal sendiri di backend.
- Menolak cache dan respons yang identitas penggunanya tidak sama dengan sesi
  aktif.
# Unreleased - Raport v2

- Added semester-exam-only periods while preserving legacy weighted periods.
- Added period attendance eligibility, audited overrides, and teacher-scoped access.
- Added authenticated on-demand PDF downloads with detailed activity appendices.
- Added environment Script Properties and `off`/`canary`/`on` rollout controls.
- Restricted the external HTTP dispatcher to an explicit public endpoint allowlist.
## 2026-10-22

- Menambahkan pembuatan Paket Demo otomatis: akun Mudir, Admin, Ustadz, dan Wali, data santri contoh, jadwal, absensi, hafalan, perilaku, serta nilai raport contoh.
- Menambahkan reset data demo yang hanya menghapus baris bertanda `DEMO-` dan akun demo; data pondok asli tidak disentuh.
- Akun demo dapat ditandai hanya-baca dan percobaan simpan/perubahan dari akun tersebut ditolak oleh backend.
