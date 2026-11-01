# Dokumentasi Santri Analytics untuk Dijual

Dokumen ini menjelaskan cara menyiapkan, memasang, menguji, memperbarui, dan mengembalikan Santri Analytics dengan aman.

## Prinsip utama

Setiap pondok memakai:

1. Satu Spreadsheet milik pondok sendiri.
2. Satu salinan project Apps Script.
3. Satu Template Raport milik pondok sendiri.
4. Akun admin yang dikelola pondok.

Data pondok tidak dicampur dengan data pondok lain. Pembuat aplikasi hanya diberi akses bantuan jika diperlukan dan dapat dicabut oleh pemilik pondok.

## Isi paket penjualan

- Salinan Spreadsheet Template Resmi Kosong.
- Salinan project Apps Script.
- Template Google Docs untuk raport.
- **Paket Raport Lengkap & Bulk PDF 1-Klik (100% Data Riil & Presisi Format F4/A4)**:
  - Cetak raport serentak 1 kelas atau perorangan santri (Format Pondok F4, TPQ A4, MDT F4, Leger Nilai Landscape, dan Sertifikat Kenaikan Jilid).
  - Mengeliminasi seluruh angka simulasi/mock; 100% data ditarik riil dari spreadsheet (Academic, MemorizationLogs, Incidents, Attendance).
  - Tampilan kop surat resmi lengkap dengan lambang crest, 4 baris teks berjenjang, kaligrafi Arab, alamat & No. Statistik (NSPP), dan double border.
  - Bebas duplikasi halaman santri dengan deduplikasi ketat dan selector cetak cerdas.
  - Cetak bersih bebas link URL script google di footer dengan format kertas standar Folio/F4.
- **Layanan Upgrade Tambahan: Santri Analytics PRO (360° Intelligence)**:
  - Dijual sebagai add-on/upgrade terpisah dalam satu aplikasi.
  - Simulasi multi-data operasional (perilaku riil/minus, absensi alpa, halaqah ziyadah vs muroja'ah, akademik).
  - Diagnosis karakter objektif, radar 5 pilar, SWOT, histori pelanggaran, dan panduan aksi sinergis 2 pihak (Ustadz & Orang Tua).
  - Akses langsung untuk akun Wali Santri guna memantau perkembangan anak.
- Panduan singkat admin, ustadz, dan wali.
- Bantuan pemasangan dan import data.
- Backup dan pemeliharaan sesuai paket yang dibeli.

## Cara menyiapkan pondok baru

### 1. Buat salinan data

Di Google Drive:

1. Salin `Santri Analytics - Template Resmi Kosong`.
2. Ubah nama sesuai nama pondok.
3. Pastikan salinan berada di Drive pondok.
4. Salin Template Raport Google Docs.
5. Jangan memakai file `JANGAN DIPAKAI - Salinan Berisi Data Lama`.

### 2. Buat salinan Apps Script

1. Salin project Apps Script Template.
2. Beri nama sesuai nama pondok.
3. Pastikan project dapat membuka Spreadsheet salinan.
4. Deploy sebagai Web App untuk pondok tersebut.
5. Simpan URL deployment di catatan penyerahan.

### 3. Hubungkan aplikasi ke milik pondok

1. Buka aplikasi dan login dengan akun awal `mudir`.
2. Buka menu `Setup Pondok`.
3. Pilih langkah `Profil`.
4. Isi nama pondok dan informasi kontak.
5. Masukkan link atau ID Spreadsheet salinan pondok.
6. Masukkan link atau ID Template Raport salinan pondok.
7. Isi email pemilik pondok.
8. Klik `Hubungkan Spreadsheet Pondok`.
9. Setelah halaman dimuat ulang, login kembali dengan akun dari Spreadsheet pondok.

Setelah langkah ini, aplikasi tidak lagi memakai database template.

### 4. Isi data pondok & Jadwal Cerdas

Gunakan menu `Wizard Setup`:

1. **Santri & Pengguna**:
   - Klik `Buat Template` atau unggah file data santri dan akun.
   - Klik `Preview` lalu `Proses Import`.
   - Klik `Pasangkan Wali ↔ Santri Asli` agar seluruh akun wali otomatis tertaut ke anaknya tanpa ketik StudentID manual.
2. **Jadwal KBM & Kegiatan (Cerdas Baca Excel & CSV)**:
   - Pilih tab **Langkah 4. Jadwal**.
   - Unggah langsung file jadwal pondok dalam format `.xlsx`, `.xls`, atau `.csv`.
   - Sistem cerdas mendeteksi otomatis format tabel biasa maupun matriks roster KBM (jam pelajaran kolom/baris).
   - Akun Ustadz baru (kode `T001` - `T013`) otomatis didaftarkan ke sistem tanpa perlu input manual.
   - Klik `Terapkan Jadwal & Lanjut`.

### 5. Siapkan akademik otomatis (1x Klik)

1. Pada **Langkah 5. Akademik**, klik tombol **Siapkan Periode & Item Ujian Otomatis (1x Klik)**.
2. Sistem otomatis membuat periode akademik aktif (misal `2026/2027 Ganjil`) dan menyinkronkan seluruh item ujian raport dari jadwal aktif yang baru diunggah.
3. Seluruh kurikulum raport langsung siap digunakan oleh guru untuk input nilai.

### 6. Buat akun demo & verifikasi kesiapan

1. Buka **Langkah 6. Demo**, simpan akun demo wali/ustadz untuk uji coba atau presentasi.
2. Buka **Langkah 7. Cek Kesiapan**: jika ada bagian yang kurang, gunakan tombol `⚡ Lengkapi Otomatis yang Kurang`.
3. Klik `Selesaikan Setup`. Status pondok otomatis berubah menjadi `100% Siap Pakai`.

### 7. Pengelolaan Multi-Pondok & Penjualan (Katalog Pelanggan)

Pada menu **📋 2. Riwayat Setup & Kontrol Pelanggan**:
1. Melihat status seluruh pondok pelanggan (Aktif, Proses, Terkendala, Siap Pakai).
2. Mengelola status pembayaran (Belum Bayar, DP/Cicilan, Lunas) serta masa aktif lisensi.
3. Pondok aktif ditandai dengan badge `★ PONDOK AKTIF` dan form kiri otomatis memuat profil pondok aktif saat ini.
4. Jika ingin mendaftarkan pondok baru, klik `+ Setup Pondok Baru`.

## Pembagian akses

- Mudir/Admin: mengelola seluruh data sesuai modul yang dibeli.
- Ustadz: hanya melihat kelas, jadwal, dan mapel yang menjadi tanggung jawabnya.
- Wali: hanya melihat data anaknya sendiri.
- Akun demo: hanya untuk presentasi dan dapat direset.

## Cara update aplikasi

1. Jangan langsung mengedit project pondok yang sedang dipakai.
2. Uji perubahan pada branch dan Apps Script staging.
3. Gunakan salinan Spreadsheet staging.
4. Jalankan pemeriksaan sintaks dan pengujian lokal.
5. Deploy staging dan uji semua peran.
6. Siapkan backup Spreadsheet pondok sebelum update.
7. Terapkan update ke deployment pondok sesuai jadwal.
8. Jalankan login, absensi, nilai, raport, PDF, dan pembatasan akses.

Dengan model library bersama, pembaruan inti dapat dipakai oleh banyak instalasi setelah versi library diuji. Perubahan yang mengubah struktur Spreadsheet tetap harus diuji dan dimigrasikan secara bertahap.

### Cara mengaktifkan Library inti

1. Buat project Apps Script library dari folder `core-library`.
2. Publikasikan versi library, misalnya versi `1`.
3. Pada project pondok, buka `Project Settings` lalu tambahkan library menggunakan ID project library.
4. Gunakan identifier `SantriCore` dan pilih nomor versi yang sudah diuji.
5. Buka `Setup Pondok` lalu bagian `Update Inti Aplikasi`.
6. Masukkan ID library dan nomor versinya.
7. Simpan dengan status `Off` terlebih dahulu.
8. Uji semua fungsi menggunakan kode lokal.
9. Ubah saluran ke `test`, lalu aktifkan `On` hanya untuk staging.
10. Setelah staging aman, gunakan `canary` dan baru kemudian `stable`.

Jika library bermasalah, ubah status menjadi `Off`. Aplikasi kembali memakai
kode lokal yang masih disimpan di project pondok.

### Cara update tanpa menempel kode manual

Pengelola aplikasi cukup memperbarui folder Library melalui `clasp`:

```powershell
cd core-library
clasp push --force
clasp version "SantriCore staging v2"
clasp deploy --versionNumber 2 --description "SantriCore staging v2"
```

Template dan project pondok tidak perlu ditempeli file satu per satu. Mereka
hanya diarahkan ke nomor versi Library yang sudah diuji. Untuk setiap perubahan
yang memerlukan file baru atau perubahan sheet, tetap lakukan uji staging dan
backup terlebih dahulu.

## Jika terjadi masalah

1. Matikan feature flag yang baru.
2. Catat waktu, akun, dan menu yang bermasalah.
3. Kembalikan deployment ke versi aman sebelumnya.
4. Jangan menghapus sheet atau data untuk memperbaiki error.
5. Pulihkan backup hanya setelah sumber masalah dipastikan.

Template dan salinan lama tidak boleh dihapus sembarangan karena dapat menjadi titik pemulihan.

## Checklist sebelum dijual

- [ ] Spreadsheet template kosong sudah terverifikasi.
- [ ] Template Raport tidak berisi data pondok lama.
- [ ] Project Apps Script dapat diakses pemilik pondok.
- [ ] Aplikasi berhasil diarahkan ke Spreadsheet pondok.
- [ ] Login ulang setelah penggantian database berhasil.
- [ ] Import CSV santri, user, dan jadwal berhasil.
- [ ] Periode dan pilihan kelas muncul.
- [ ] Nilai seluruh kurikulum dapat diinput.
- [ ] Raport dan PDF dapat dibuka sesuai peran.
- [ ] Wali tidak dapat melihat santri lain.
- [ ] Ustadz tidak dapat melihat kelas yang tidak ditugaskan.
- [ ] Akun demo berhasil login.
- [ ] Reset akun dan data demo berhasil.
- [ ] Backup dan rollback sudah diuji.
- [ ] URL deployment dan kontak bantuan sudah diserahkan.

## Status pekerjaan saat dokumentasi ini dibuat

- Perubahan koneksi database tenant dibuat di cabang `codex/product-readiness`.
- Produksi tidak diubah dan tidak di-deploy.
- Pemeriksaan sintaks seluruh file `.gs` lulus.
- Pemeriksaan JavaScript aplikasi lulus.
- Pengujian konfigurasi instalasi, library bridge, isolasi jadwal, view state, identitas guru, dan raport lulus.
- Deployment ke project Template Apps Script dilakukan sebagai langkah terpisah setelah review commit ini.
