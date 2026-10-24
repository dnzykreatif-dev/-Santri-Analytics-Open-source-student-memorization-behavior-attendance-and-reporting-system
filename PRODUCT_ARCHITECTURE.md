# Arah Produk Santri Analytics

Dokumen ini menjadi keputusan utama pengembangan Santri Analytics. Jika
dokumen lama atau asumsi lama berbeda dengan isi dokumen ini, dokumen ini yang
digunakan.

## Keputusan Utama

Santri Analytics adalah aplikasi multi-pondok berbasis Google Apps Script.
Setiap pondok memiliki data dan konfigurasi sendiri. Aplikasi adalah pusat
operasional; spreadsheet adalah sumber penyimpanan, alat impor, ekspor, dan
cadangan.

Data Raudhatul Ulum dan workbook jadwal 2026 tidak menjadi data bawaan produk.
Data tersebut hanya boleh dipakai untuk demo internal, pengujian, atau migrasi
ke instalasi Raudhatul Ulum.

## Pemisahan Aplikasi Dan Data

### Yang menjadi bagian dari aplikasi

- Login, role, keamanan, dan pemulihan sesi.
- Manajemen santri, pengajar, kelas, mapel, kegiatan, dan jadwal.
- Absensi berbasis sesi.
- Rekap, raport, hafalan, perilaku, dan laporan wali.
- Validasi, audit, pencadangan, dan riwayat perubahan.
- Tampilan desktop dan HP.

### Yang menjadi data pondok

- Profil lembaga dan tahun ajaran.
- Akun serta identitas pengajar.
- Daftar santri dan status aktifnya.
- Kelas, gender, mapel, kegiatan, dan jam pelajaran.
- Jadwal aktif dan seluruh riwayat absensi.

## Mode Instalasi

### `legacy`

Mode kompatibilitas untuk instalasi lama Raudhatul Ulum. Mode ini masih dapat
memakai master jadwal 2026 secara sengaja melalui fungsi migrasi yang dibatasi
untuk Admin/Mudir.

### `tenant`

Mode produksi pondok. Mode ini wajib dipakai untuk pondok baru. Aplikasi hanya
membaca spreadsheet yang ditentukan oleh `SPREADSHEET_ID`, tidak melakukan
fallback ke database lama, dan tidak menanam jadwal atau akun dari kode.

## Sumber Data Resmi

| Data | Sheet resmi | Aturan |
| --- | --- | --- |
| Santri | `Students` | Hanya status aktif masuk absensi baru |
| Akun/pengajar | `Users` | `UserID` dan `TeacherSourceID` stabil |
| Jadwal | `Schedules` | Sumber utama kartu jadwal dan absensi |
| Pilihan master | `ScheduleMasters` | Pilihan kelas, mapel, kegiatan, dan jam |
| Sesi absensi | `AttendanceSessions` | Satu jadwal dan tanggal menjadi satu sesi |
| Detail absensi | `Attendance` | Satu baris per santri dalam sesi |

`Students[Class/Level]` harus sama dengan
`Schedules[ClassOrGroupName]`. Santri lulus atau berhenti dinonaktifkan
dengan `Status`, bukan dihapus, agar riwayat tetap terhubung.

## Cara Kerja Admin

1. Admin membuka **Setup Pondok** untuk melengkapi profil, akun, santri, dan
   kelas.
2. Admin membuat jadwal melalui **Manajemen Jadwal**.
3. Admin dapat memakai template spreadsheet untuk impor massal.
4. Aplikasi menampilkan pratinjau, konflik, dan data yang ditolak sebelum
   perubahan diterapkan.
5. Jadwal yang sudah tidak berlaku dinonaktifkan, bukan dihapus.
6. Guru melihat jadwalnya sendiri dan mengisi absensi dari kelas aktif.

## Aturan Impor

Impor tidak boleh langsung menimpa data operasional. Setiap impor harus:

- memakai ID stabil;
- membuat cadangan atau staging;
- memeriksa data ganda dan referensi yang tidak ditemukan;
- menampilkan pratinjau perubahan;
- meminta konfirmasi Admin/Mudir;
- mencatat hasil di `AuditLogs`.

Impor master bawaan 2026 tidak digunakan untuk instalasi tenant. Untuk pondok
baru, template yang dipakai adalah template generik milik pondok tersebut.

## Aturan Pengembangan

- Jangan menanam nama santri, guru, kelas, atau jadwal pelanggan baru ke kode.
- Jangan menggunakan kemiripan nama sebagai kunci identitas.
- Jangan menghapus riwayat hanya karena data master berubah.
- Jangan menambah tombol yang mengubah banyak data tanpa pratinjau dan validasi.
- Jangan deploy langsung ke produksi sebelum staging dan smoke test lulus.
- Setiap perubahan yang memengaruhi data harus memiliki rollback atau backup.

## Status Implementasi

Sudah tersedia:

- Absensi sesi Pondok/KBM/Kegiatan.
- Pembatasan jadwal berdasarkan identitas pengajar.
- Editor jadwal dan perubahan massal dengan validasi.
- Setup Pondok dan template impor.
- Mode tenant serta pencegahan auto-seed master bawaan.
- Dokumentasi data master dan tes regresi utama.

Urutan pekerjaan berikutnya:

1. Uji instalasi tenant kosong dengan spreadsheet baru.
2. Uji impor template santri, pengajar, dan jadwal.
3. Uji akun Admin, Mudir, Ustadz, dan Wali.
4. Uji absensi sampai laporan wali.
5. Buat paket deployment staging dan prosedur rollback.

## Konfigurasi Produksi Pondok

Setiap project pondok harus memiliki Script Properties berikut:

```text
INSTALLATION_MODE=tenant
TENANT_ID=kode-unik-pondok
SPREADSHEET_ID=ID-spreadsheet-pondok
REPORT_TEMPLATE_ID=ID-template-raport-pondok
INSTALLATION_OWNER_EMAIL=email-admin
SUPPORT_EMAIL=email-dukungan
```

`clasp push` hanya mengirim source code. Deployment web app produksi tetap
memakai versi yang ditetapkan sampai versi baru dibuat dan deployment tersebut
diperbarui secara sengaja.
