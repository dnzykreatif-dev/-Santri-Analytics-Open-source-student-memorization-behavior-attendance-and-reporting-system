# Panduan Data Master Santri Analytics

Dokumen ini menjelaskan sumber data operasional, cara memperbaiki data secara
manual di spreadsheet, dan arah pengembangan agar pengelolaan aplikasi tidak
lagi bergantung pada perubahan kode.

## 1. Sumber Data Santri

Daftar nama santri pada menu `Santri`, pilihan santri, dan sesi absensi berasal
dari sheet **`Students`** pada spreadsheet yang terhubung melalui
`SPREADSHEET_ID` di `Config.gs`.

Kolom penting untuk absensi:

| Kolom | Fungsi | Contoh |
| --- | --- | --- |
| `StudentID` | ID unik dan stabil. Jangan digunakan ulang. | `STU001` |
| `NIS` | Nomor induk santri. | `2026001` |
| `Name` | Nama yang tampil di aplikasi. | `Ahmad Fulan` |
| `Class/Level` | Sumber utama kelas absensi. | `9 Ikhwan` |
| `Level` | Tingkat untuk akademik dan cadangan klasifikasi. | `9` |
| `Gender` | Kelompok santri. | `Ikhwan` / `Akhwat` |
| `Status` | Menentukan apakah santri masuk daftar absensi aktif. | `Active` |
| `DeletedAt` | Penanda soft delete. Kosong berarti data tidak dihapus. | kosong |

### Aturan kelas

- `Class/Level` adalah sumber utama. Nilainya harus sama dengan
  `Schedules.ClassOrGroupName`, misalnya `9 Ikhwan` atau `12 Akhwat`.
- `Level` dan `Gender` harus konsisten dengan `Class/Level` karena juga dipakai
  modul akademik dan statistik.
- Jika `Class/Level` kosong, absensi mencoba membentuk kelas dari
  `Level + Gender`.
- Penulisan yang disarankan adalah angka tingkat lalu kelompok: `7 Ikhwan`,
  `10 Akhwat`, dan seterusnya.

### Aturan status santri

Absensi hanya memuat baris yang:

- `DeletedAt` kosong; dan
- `Status` kosong, `Active`, atau `Aktif`.

Gunakan status berikut secara konsisten:

- `Active`: masih aktif dan muncul dalam absensi.
- `Lulus`: alumni; tidak muncul dalam absensi baru.
- `Berhenti`: keluar sebelum lulus; tidak muncul dalam absensi baru.
- `Inactive`: dinonaktifkan sementara; tidak muncul dalam absensi baru.

Jangan menghapus baris santri yang sudah mempunyai riwayat. Mengubah `Status`
menjaga hafalan, perilaku, nilai, dan absensi lama tetap terhubung ke
`StudentID` yang sama.

## 2. Cara Koreksi Manual di Spreadsheet

1. Buka sheet `Students`.
2. Cari santri berdasarkan `StudentID`, `NIS`, atau `Name`.
3. Perbaiki `Class/Level`, lalu selaraskan `Level` dan `Gender`.
4. Untuk santri lulus atau berhenti, ubah `Status`; jangan hapus barisnya.
5. Jangan mengubah `StudentID` pada data yang sudah memiliki riwayat.
6. Kembali ke aplikasi dan tekan `Refresh`. Daftar Santri dapat memakai cache
   sampai sekitar dua menit, sedangkan pembukaan ulang sesi absensi membaca
   data aktif terbaru.

Sebelum koreksi massal, buat salinan spreadsheet. Hindari mengurutkan hanya
satu kolom karena dapat memisahkan identitas santri dari data pada kolom lain.

## 3. Sumber Data Modul Lain

| Data | Sheet/sumber utama |
| --- | --- |
| Santri | `Students` |
| Akun dan role | `Users` |
| Jadwal aktif | `Schedules` |
| Sesi absensi | `AttendanceSessions` |
| Detail kehadiran santri | `Attendance` |
| Hafalan | `MemorizationLogs` |
| Perilaku | `Incidents` |
| Periode dan nilai akademik | `AcademicPeriods`, `AcademicSubjects`, `AssessmentComponents`, `AcademicScores` |

`SeedSchedulesMaster.gs` adalah alat migrasi jadwal 2026, bukan tempat yang
seharusnya diedit operator setiap hari. Setelah data tersedia di `Schedules`,
pengelolaan operasional harus dilakukan melalui aplikasi atau spreadsheet.

## 4. Arah Produk Tanpa Koding

Untuk penggunaan di pondok lain atau penjualan sebagai produk, sediakan menu
`Pengaturan` dan `Data Master` bagi Mudir/Admin:

1. **Profil lembaga**: nama, logo, tahun ajaran, zona waktu, dan identitas
   laporan.
2. **Tahun ajaran dan kenaikan kelas**: promosi massal, tinggal kelas, lulus,
   dan arsip angkatan dengan pratinjau sebelum diterapkan.
3. **Master kelas**: tingkat, nama rombel, kelompok Ikhwan/Akhwat, wali kelas,
   dan status aktif.
4. **Master pengajar dan akun**: hubungan akun dengan pengajar menggunakan ID,
   bukan kemiripan nama.
5. **Master mapel/kegiatan dan jadwal**: editor tabel, duplikasi pekan,
   pengecekan bentrok, serta impor/ekspor.
6. **Manajemen santri**: tambah, edit, pindah kelas, ubah status, dan aksi
   massal langsung dari aplikasi.
7. **Pusat impor spreadsheet**: unduh templat, unggah atau sinkronkan sheet,
   validasi, tampilkan perbedaan, lalu konfirmasi penerapan.
8. **Audit data**: santri tanpa kelas, kelas tidak dikenal, data ganda, akun
   tanpa pengajar, dan jadwal tanpa peserta.

Prinsip sinkronisasi yang disarankan:

- Spreadsheet tetap menjadi penyimpanan utama pada edisi Google Apps Script.
- Aplikasi dan spreadsheet membaca/menulis skema yang sama.
- Setiap perubahan memakai ID stabil, `UpdatedAt`, `RecordVersion`, dan audit
  log.
- Perubahan massal selalu memiliki pratinjau, validasi, dan cadangan.
- Pengaturan lembaga disimpan dalam sheet khusus seperti `AppSettings`, bukan
  konstanta di kode.

Dengan pola ini, pemasangan untuk pesantren baru cukup melalui wizard setup,
pengisian data master, atau impor templat tanpa menyentuh source code.
