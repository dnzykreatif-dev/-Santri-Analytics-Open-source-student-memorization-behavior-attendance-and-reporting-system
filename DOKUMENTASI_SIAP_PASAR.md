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

### 4. Isi data pondok

Gunakan menu `Setup Pondok`:

1. Klik `Buat Template`.
2. Isi data santri, guru, wali, dan jadwal.
3. Untuk Excel, simpan setiap sheet sebagai CSV UTF-8.
4. Unggah melalui `Upload Santri`, `Upload User`, atau `Upload Jadwal`.
5. Klik `Preview`.
6. Perbaiki baris yang salah.
7. Klik `Proses Import`.

Import hanya mengisi tempat import terlebih dahulu. Data utama tidak langsung ditimpa tanpa proses preview.

### 5. Siapkan akademik

1. Buat periode akademik.
2. Pastikan tanggal awal dan akhir benar.
3. Buat item ujian dari seluruh jadwal.
4. Masukkan nilai KBM, pondok, kegiatan, hafalan, doa, praktik, dan ujian lainnya.
5. Periksa kelayakan ujian berdasarkan persentase kehadiran.
6. Publikasikan periode setelah nilai wajib lengkap.

### 6. Buat akun demo

1. Buka tab `Demo`.
2. Klik `Buat Paket Demo Otomatis`.
3. Gunakan password demo yang berbeda dari password admin.
4. Catat akun Mudir, Admin, Ustadz, dan Wali.
5. Uji setiap akun pada browser atau jendela berbeda.
6. Jangan masukkan data santri asli ke akun demo.

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
