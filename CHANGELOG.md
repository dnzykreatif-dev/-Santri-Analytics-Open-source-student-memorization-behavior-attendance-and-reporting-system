# Changelog

Perubahan penting Santri Analytics dicatat di dokumen ini. Nomor versi mengacu
pada versi deployment Google Apps Script.

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
