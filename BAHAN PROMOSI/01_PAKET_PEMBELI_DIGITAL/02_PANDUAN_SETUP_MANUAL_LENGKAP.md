# 📘 Panduan Setup Manual Lengkap — Santri Analytics
### Buku Panduan Operasional & Konfigurasi Mandiri untuk Administrator Pondok Pesantren

---

## 📌 DAFTAR ISI
1. [Persiapan Awal (Prasyarat)](#1-persiapan-awal-prasyarat)
2. [Menyiapkan Database di Google Drive Pondok](#2-menyiapkan-database-di-google-drive-pondok)
3. [Login Pertama & Membuka Wizard Setup](#3-login-pertama--membuka-wizard-setup)
4. [Langkah 1: Profil Lembaga & Hubungkan Database](#4-langkah-1-profil-lembaga--hubungkan-database)
5. [Langkah 2: Paket Modul & Fitur](#5-langkah-2-paket-modul--fitur)
6. [Langkah 3: Import Santri & Sinkronisasi Wali Otomatis](#6-langkah-3-import-santri--sinkronisasi-wali-otomatis)
7. [Langkah 4: Upload Jadwal Cerdas (Excel/CSV) & Akun Ustadz](#7-langkah-4-upload-jadwal-cerdas-excelcsv--akun-ustadz)
8. [Langkah 5: Akademik & Kurikulum Raport (1x Klik)](#8-langkah-5-akademik--kurikulum-raport-1x-klik)
9. [Langkah 6: Akun Wali Santri & Akun Demo](#9-langkah-6-akun-wali-santri--akun-demo)
10. [Langkah 7: Cek Kesiapan & Selesaikan Setup](#10-langkah-7-cek-kesiapan--selesaikan-setup)
11. [Cara Membagikan Akses ke Ustadz & Wali Santri](#11-cara-membagikan-akses-ke-ustadz--wali-santri)
12. [Cara Memasang di HP Android (APK & Shortcut Web)](#12-cara-memasang-di-hp-android-apk--shortcut-web)
13. [Solusi Kendala Teknis (FAQ & Troubleshooting)](#13-solusi-kendala-teknis-faq--troubleshooting)

---

## 1. Persiapan Awal (Prasyarat)
Sebelum memulai, pastikan Anda memiliki:
* Sebuah akun Google (Gmail atau Google Workspace) milik pondok pesantren.
* Laptop atau komputer dengan browser Google Chrome/Edge yang terhubung internet.
* Tautan Spreadsheet Template Resmi dan Template Dokumen Raport yang dikirimkan melalui email pembelian Anda.

---

## 2. Menyiapkan Database di Google Drive Pondok
Santri Analytics menggunakan arsitektur **Database Terisolasi**: data pondok Anda 100% tersimpan di Google Drive milik pondok Anda sendiri, bukan di server orang lain.

1. Buka tautan **Spreadsheet Template Resmi** dari email pembelian.
2. Di menu pojok kiri atas browser, klik **File > Buat Salinan (Make a copy)**.
3. Beri nama file, contoh: `Database Santri - PP Darul Ulum 2026/2027`.
4. Buka tautan **Template Raport Google Docs** dari email pembelian.
5. Klik **File > Buat Salinan (Make a copy)**.
6. Beri nama file, contoh: `Template Raport Resmi - PP Darul Ulum`.
7. **Penting**: Salin link URL kedua file tersebut dari *address bar* browser Anda dan simpan di catatan, karena akan dimasukkan pada Langkah 1 di aplikasi.

---

## 3. Login Pertama & Membuka Wizard Setup
1. Buka link **Web App** aplikasi Santri Analytics pondok Anda di browser.
2. Di halaman login, masukkan kredensial administrator awal:
   * **Username**: `mudir`
   * **Password**: `admin123`
3. Setelah berhasil masuk ke Dashboard, klik menu **Setup Pondok** pada bilah navigasi samping/atas.
4. Anda akan melihat halaman **Wizard Setup Pondok** yang memiliki 7 langkah berurutan (dari Langkah 1 Profil sampai Langkah 7 Cek).

---

## 4. Langkah 1: Profil Lembaga & Hubungkan Database
Langkah ini menetapkan identitas lembaga serta mengaitkan aplikasi ke Spreadsheet Google Drive pondok Anda:

1. **Identitas Lembaga**:
   * Isi **Nama Pondok**: (Contoh: `Pondok Pesantren Raudhatul Ulum`).
   * Isi **Nama Aplikasi**: (Contoh: `Santri Analytics`).
   * **Upload Logo**: Klik tombol upload untuk memilih logo pondok dari laptop Anda (format PNG/JPG transparan lebih disukai).
   * Isi Alamat, No. WhatsApp Admin/Pondok, Email Lembaga, Tahun Ajaran (contoh: `2026/2027`), dan Semester (`Ganjil` atau `Genap`).
2. **Hubungkan Database Pondok (Cukup Sekali Jalan)**:
   * Di kotak formulir berwarna kuning-keemasan:
     * Tempel link / ID Spreadsheet yang tadi Anda salin ke kolom **Link atau ID Spreadsheet pondok**.
     * Tempel link / ID Template Raport Docs ke kolom **Link atau ID Template Raport pondok**.
     * Masukkan email pemilik/admin pondok.
   * Klik tombol hijau: **`Simpan Profil & Hubungkan Spreadsheet Pondok`**.
3. Sistem akan otomatis menyiapkan seluruh lembar sheet (Users, Students, Schedules, Attendance, dll.) di Spreadsheet Anda secara instan tanpa perlu login ulang!

---

## 5. Langkah 2: Paket Modul & Fitur
1. Anda akan diarahkan ke **Langkah 2: Paket Modul**.
2. **Mode Penguncian**:
   * Untuk awal penggunaan, pilih **`Off`** agar seluruh fitur (Tahfidz, Akademik, Raport, Absensi, Perilaku, Pulang Bulanan) langsung terbuka untuk semua dewan guru.
3. Centang modul-modul yang ingin diaktifkan di pondok Anda.
4. Klik tombol **`Simpan Modul`**, lalu klik **`Berikutnya`**.

---

## 6. Langkah 3: Import Santri & Sinkronisasi Wali Otomatis
1. Pada **Langkah 3: Data**, Anda dapat memasukkan data santri dan akun guru.
2. Jika Anda sudah memiliki file Excel/CSV data santri:
   * Klik **`Upload Santri`** lalu pilih file CSV Anda.
   * Format kolom yang didukung: `Nama`, `NIS`, `Kelas`, `Jenis Kelamin`, `Nama Wali`, `No HP Wali`.
   * Klik **`Preview`** untuk melihat pratinjau data.
   * Klik **`Proses Import`** untuk menyimpan seluruh data santri ke database.
3. **Sinkronisasi Wali Santri Asli (Sangat Mudah)**:
   * Klik tombol **`Pasangkan Wali ↔ Santri Asli`**.
   * Sistem cerdas akan otomatis membuatkan akun login Wali Santri berdasarkan Nomor WhatsApp atau NIS santri, dan langsung memasangkan akun tersebut ke data anaknya masing-masing! Anda tidak perlu mengetik StudentID anak satu per satu.

---

## 7. Langkah 4: Upload Jadwal Cerdas (Excel/CSV) & Akun Ustadz
Santri Analytics dilengkapi teknologi **Smart Schedule Parser** yang sangat cerdas membaca format jadwal:

1. Masuk ke **Langkah 4: Jadwal**.
2. Klik tombol hijau: **`Pilih File Jadwal (Excel / CSV)`**.
3. Pilih file jadwal pondok Anda (format `.xlsx`, `.xls`, atau `.csv`).
4. **Keunggulan Cerdas**:
   * **Mendukung format tabel biasa**: Kolom Hari, Jam Mulai, Jam Selesai, Mapel, Kelas, Ustadz Pengampu.
   * **Mendukung format Matriks Roster KBM**: Format tabel jadwal sekolah/pesantren mingguan yang kolomnya berupa kelas (`7A`, `7B`, `8A`) atau hari dengan jam ke-1 s/d 8 dan format jam bertitik (`07.30 - 08.30`).
   * **Pendaftaran Akun Guru Otomatis**: Sistem otomatis membaca seluruh nama ustadz pengampu di jadwal dan mendaftarkannya sebagai akun login Ustadz (kode `T001`, `T002`, dst.) ke database.
5. Klik tombol **`✓ Terapkan Jadwal & Lanjut`**. Ratusan jadwal langsung tersimpan dalam hitungan detik!

---

## 8. Langkah 5: Akademik & Kurikulum Raport (1x Klik)
1. Pada **Langkah 5: Akademik**, Anda tidak perlu lagi merumuskan tabel kurikulum yang rumit dari awal.
2. Cukup klik tombol hijau: **`Siapkan Periode & Item Ujian Otomatis (1x Klik)`**.
3. Sistem secara otomatis:
   * Membuka **Periode Akademik Aktif** sesuai Tahun Ajaran pondok Anda (`2026/2027 Ganjil`).
   * Menarik seluruh mata pelajaran dari Jadwal KBM yang diunggah di Langkah 4 menjadi **Item Ujian Raport** yang siap diisi nilai oleh dewan ustadz.

---

## 9. Langkah 6: Akun Wali Santri & Akun Demo
1. Pada **Langkah 6: Demo**, sistem menyediakan fasilitas pembuatan akun demo untuk keperluan pameran/pengujian tanpa mencemari data asli.
2. Anda bisa memilih peran: Mudir, Admin, Ustadz, atau Wali.
3. Masukkan password yang diinginkan (minimal 6 karakter, contoh: `wali123`).
4. Klik **`Simpan Akun Demo & Lanjut`**.

---

## 10. Langkah 7: Cek Kesiapan & Selesaikan Setup
1. Di **Langkah 7: Cek**, aplikasi akan memeriksa 8 pilar kesiapan pondok Anda:
   * Profil Pondok
   * Paket Modul
   * Data Santri
   * Akun Pengguna (Mudir, Ustadz, Wali)
   * Jadwal KBM
   * Periode Akademik
   * Item Ujian Raport
   * Akun Demo
2. Jika masih ada kotak berwarna kuning (*Kurang*):
   * Cukup klik tombol **`⚡ Lengkapi Otomatis yang Kurang`**. Sistem akan otomatis melengkapi parameter yang kurang secara instan!
3. Jika seluruh kotak sudah berwarna hijau (*Siap*), klik tombol **`Selesaikan Setup`**.
4. **Selamat!** Status pondok Anda kini resmi **100% Siap Pakai**.

---

## 11. Cara Membagikan Akses ke Ustadz & Wali Santri
Setelah setup selesai, Anda bisa membagikan akses login:

1. **Untuk Dewan Ustadz / Guru**:
   * Buka menu **Data Pengguna (Tab Users)**.
   * Catat Username masing-masing Ustadz (misal: `T001_Ahmad`, password bawaan: `ustadz123` atau nomor telepon).
   * Bagikan link aplikasi kepada para Ustadz.
   * Ustadz dapat menginput absensi kelas, setoran hafalan, dan nilai ujian santri langsung dari smartphone mereka.
2. **Untuk Wali Santri**:
   * Buka portal login dan informasikan format login kepada wali:
     * **Username**: No. WhatsApp Wali yang terdaftar (contoh: `081234567890`) atau NIS Santri.
     * **Password**: Format standar yang telah ditentukan pondok (contoh: `santri123` atau 4 digit akhir nomor HP).
   * Saat wali login, mereka langsung melihat profil anaknya, riwayat absensi, grafik hafalan juz, dan catatan perilaku santri.

---

## 12. Cara Memasang di HP Android (APK & Shortcut Web)

### Opsi A: Menggunakan File APK Android
1. Unduh file `.apk` yang diberikan pada email pembelian ke HP Android Anda.
2. Buka file installer dan pilih **Instal**.
3. Jika muncul notifikasi *"Aplikasi dari sumber tidak dikenal"*, pilih **Izinkan untuk sumber ini**.
4. Aplikasi Santri Analytics akan muncul di layar utama HP dengan ikon logo pondok resmi.

### Opsi B: Menggunakan Shortcut Web (PWA - Bisa untuk Android & iPhone)
1. Buka link Web App di browser Google Chrome (Android) atau Safari (iPhone).
2. Di Google Chrome: Klik ikon titik tiga di pojok kanan atas $\rightarrow$ pilih **"Tambahkan ke Layar Utama" (Add to Home screen)**.
3. Di Safari (iPhone): Klik ikon Share di bawah $\rightarrow$ pilih **"Add to Home Screen"**.
4. Aplikasi akan tampil layaknya aplikasi native tanpa memakan memori HP.

---

## 13. Solusi Kendala Teknis (FAQ & Troubleshooting)

* **Tanya**: Saat menghubungkan Spreadsheet, muncul pesan *"Spreadsheet tidak dapat dibuka"*?  
  * **Solusi**: Pastikan Spreadsheet salinan Anda berada di Google Drive akun yang sama dengan pembuat Web App, atau setelan berbagi (*Share*) file Spreadsheet disetel minimal *"Editor"* untuk email akun admin.

* **Tanya**: Jadwal KBM saya di Excel banyak kolom gabungan (*merged cells*), apakah terbaca?  
  * **Solusi**: Ya! Fitur *Smart Schedule Parser* Santri Analytics versi terbaru sudah mendukung pembacaan *merged cells* secara otomatis.

* **Tanya**: Bagaimana jika tahun depan berganti Tahun Ajaran baru?  
  * **Solusi**: Cukup buka menu **Setup Pondok** $\rightarrow$ **Akademik**, lalu buat Periode Akademik baru (contoh: `2027/2028 Ganjil`). Seluruh data santri dan riwayat lama di tahun ajaran sebelumnya tetap tersimpan rapi sebagai arsip.

* **Tanya**: Ke mana saya harus menghubungi jika butuh bantuan?  
  * **Solusi**: Hubungi tim bantuan teknis kami melalui WhatsApp VIP Support yang tertera pada email pengiriman lisensi Anda. Tim kami siap mendampingi Anda hingga tuntas!
