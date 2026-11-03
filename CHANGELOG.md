# Changelog

## 2026-11-04 - Versi Update: Impor Cerdas Jadwal KBM, Pemetaan Kurikulum Otomatis, & Whitelist Dispatcher Security

- **Fitur Impor Cerdas Jadwal & Kurikulum Pondok**:
  - Modal interaktif `Modal_SmartScheduleImport.html` untuk impor data jadwal secara massal (mendukung .csv, .tsv, .txt, maupun salinan langsung dari Excel/Google Sheets).
  - Parser cerdas *header-agnostic* yang otomatis mengenali nama kolom dan variasi delimiter (Tab, Titik Koma, Koma).
  - Tombol pengisian cepat data riil pondok (342 sesi KBM) dari modul `JS_ScheduleSample.html`.
  - Auto-klasifikasi tingkat Tsanawiyyah (Kelas 7–9) vs Aliyah (Kelas 10–12) dan rumpun mapel Diniyyah vs Umum.
  - Rekomendasi kitab kuning otomatis berdasarkan jenjang dan sinkronisasi satu klik ke master mapel `AcademicSubjects` dan `RaportSetup`.
- **Perbaikan Security Dispatcher & Action Whitelist (`Code.gs`)**:
  - Menyelesaikan kendala `✕ Action tidak diizinkan` pada pemanggilan backend `importSmartSchedules`.
  - Menambahkan `importSmartSchedules` ke dalam whitelist `isExternalActionAllowed_` dan `PRODUCT_isWrapperOnlyAction_` di seluruh environment (Root, Core Library, dan Staging).
- **Penyusunan Dokumentasi Komprehensif**:
  - Penambahan dokumen panduan lengkap `PANDUAN_SETUP_RAPORT_DAN_JADWAL.md` yang mencakup arsitektur data riil, panduan impor cerdas, panduan edit manual kitab rujukan umum vs override jenjang, manajemen batas sel logo, dan panduan cetak F4 bebas footer browser.


## 2026-11-02 - Versi Update: Solusi Batas Sel 50.000 Karakter, Kompresi Logo, & Penyimpanan Progres Bertahap

- **Penyelesaian Error Limit 50.000 Karakter Google Sheets**:
  - File logo pondok yang diunggah (`uploadRaportLogo`) kini otomatis dikompresi ke resolusi optimal 120x120px dengan ukuran base64 ~10KB - 15KB (< 20.000 karakter), aman jauh di bawah batas 50.000 karakter sel Google Sheets.
  - Backend `saveRaportSetup` dilengkapi mekanisme pemotongan aman (*fail-safe*) dan penyimpanan independen per kunci (isolated upsert) sehingga kendala pada satu data tidak akan pernah membatalkan data wali kelas dan pemetaan kitab.
- **Sistem Draf Otomatis di Browser (LocalStorage Persistence)**:
  - Setiap perubahan yang dimasukkan pada setup raport langsung tersimpan otomatis sebagai draf di perangkat pengguna (`santriAnalytics:raportSetupDraft`).
  - Jika browser ditutup atau di-refresh saat pengisian belum selesai, seluruh isian (wali kelas, pemetaan kitab, keterangan) otomatis dipulihkan sehingga pengguna tidak perlu mengetik ulang dari awal.
- **Penyimpanan Bertahap & Tombol Simpan Terdistribusi**:
  - Penambahan banner progres di bagian atas Setup Raport lengkap dengan indikator waktu simpan.
  - Penambahan tombol simpan khusus per-seksi: `💾 Simpan Penugasan Wali Kelas` dan `💾 Simpan Pemetaan Kitab`.
  - Penambahan **Sticky Floating Save Pill** di pojok kanan bawah agar pengguna dapat menyimpan progres kapan saja tanpa perlu menggulir ke bawah.

## 2026-11-02 - Versi Update: Keterangan Kelas, Tab Filter Kelas & Pemetaan Kitab Spesifik per-Jenjang

- **Keterangan Kelas Jelas pada Setiap Kartu Mapel**:
  - Setiap kartu mata pelajaran pada pemetaan kitab kini secara eksplisit mencantumkan keterangan kelas/rombel yang mempelajarinya (misal: `🏫 Kelas: KELAS 10` untuk mapel jadwal seperti *AQ (Aqidah)*, *Si (Sirah)*, *Hi (H.Doa)*, *Ti (Tilawah)*, atau `🏫 Kelas: Semua Kelas` untuk muatan umum pesantren).
  - Mengeliminasi kebingungan guru/mudir mengenai asal kelas dan sasaran mapel yang diajarkan.
- **Bar Filter Tab Kelas Interaktif**:
  - Penambahan tombol filter kelas di atas kartu pemetaan: `[🏷️ Semua Kelas]`, `[🏫 KELAS 7]`, `[🏫 KELAS 8]`, `[🏫 KELAS 9]`, `[🏫 KELAS 10]`, `[🏫 KELAS 11]`, `[🏫 KELAS 12]`.
  - Memungkinkan mudir menyaring hanya mapel yang diajarkan di kelas tertentu dengan sekali klik.
- **Dukungan Kitab Spesifik per Jenjang (Multi-Level Class Override)**:
  - Mendukung penentuan kitab yang berbeda untuk jenjang kelas yang berbeda pada mapel yang sama (misal: Fiqih Kelas 7 menggunakan *Safinatun Najah*, sedangkan Fiqih Kelas 10 menggunakan *Fathul Qorib*).
  - Format penyimpanan override `KELAS 10::Fiqih` dengan placeholder default otomatis.
  - Backend engine cetak raport F4 (`SantriIntelligence.gs`) otomatis memprioritaskan rujukan kitab spesifik kelas santri sebelum jatuh ke default umum.
- **Form Tambah Mapel dengan Pilihan Target Kelas**:
  - Input `+ Tambah Mapel Baru` kini dilengkapi dropdown target kelas (*Semua Kelas*, *Kelas 7*, *Kelas 8*, dst.).

## 2026-11-02 - Versi Update: Restrukturisasi Menu Akademik, Setup Raport Terpadu, Identitas Riil Mudir & Lembaga, serta Kurikulum Jadwal Riil

- **Restrukturisasi Total Menu Akademik & Pengalaman Pengguna (UX)**:
  - Menggantikan tampilan lama yang membingungkan dan alur 6 langkah kaku menjadi 5 sub-navigasi tab terstruktur:
    1. **📋 Raport & Penilaian**: Pusat kendali raport santri, filter periode & kelas, status penilaian, tombol cetak F4 massal per kelas, leger nilai, serta switcher mode *Daftar Santri & Status Raport* vs *Matrix Input Nilai*.
    2. **📚 Kurikulum & Kitab**: Pemetaan jadwal KBM aktif dan kurikulum ujian per kelas.
    3. **⚙️ Setup Raport & Lembaga**: Menu setup khusus raport terpadu yang sebelumnya belum tersedia.
    4. **🔧 Master Periode & Mapel**: Pengelolaan tahun ajaran, semester, bobot nilai, dan master mapel.
    5. **👤 Profil Santri**: Pengaturan jenjang pendidikan (SMP/SMA) dan gender santri.
- **Penyediaan Menu Terpadu "Setup Raport & Lembaga"**:
  - **Live Preview Kop Surat Interaktif**: Memvisualisasikan langsung lambang/logo, nama yayasan, nama pondok, teks kaligrafi Arab, alamat, kontak, dan NSPP secara real-time.
  - **Identitas Lembaga & NSPP**: Form edit instansi lembaga, teks kaligrafi Arab (`معهد روضة العلوم`), NSPP, alamat (Sinam, Pemangkat, Kab. Sambas), dan nomor telepon.
  - **Logo Pesantren & Vektor Fallback**: Kemampuan upload logo kustom lembaga langsung via file picker (disimpan sebagai base64), reset logo, dan fallback mulus ke lambang resmi SVG kubah & bintang emas hijau jika logo rusak/belum ada.
  - **Identitas Pejabat Penandatangan**: Pimpinan Pondok/Mudir disinkronkan langsung dengan akun aktif **Dede Nuriman, Lc.** (menghapus nama simulasi *KH. Ahmad Syarifuddin*), serta kota titimangsa resmi **Pemangkat** (menghapus *Tasikmalaya*).
  - **Penugasan Wali Kelas per Kelas**: Pengaturan dinamis penugasan wali kelas riil per rombel/kelas (Kelas 7, 8, 9, 10, 11, 12, dll.) lengkap dengan autocomplete datalist dari daftar Ustadz yang terdaftar di aplikasi (menghapus nama simulasi *Ustdz. Nida Fadhilah*).
  - **Pemetaan Kitab Kuning per Mata Pelajaran**: Input rujukan kitab kuning riil per mapel pesantren (menghilangkan label statis *Kitab Turots*).
  - **Opsi Penayangan Seksi C (Hafalan Nadzam & Matan)**: Toggle aktivasi seksi nadzam; jika santri/kelas tidak mempelajari Nadzam Alfiyah/Jauharul Maknun/Baiquniyah, seksi ini otomatis disembunyikan sehingga tidak menampilkan tabel kosong/simulasi.
- **Backend Raport Intelligence (`SantriIntelligence.gs`)**:
  - API baru `getRaportSetup(currentUser)` dan `saveRaportSetup(payload, currentUser)`.
  - Helper `SI_isClassMatch_(studentClass, scheduleClass)` untuk pencocokan kelas yang fleksibel dan toleran format (misal `"10"` vs `"KELAS 10"`).
  - Integrasi kurikulum raport langsung dari jadwal KBM kelas riil (`Schedules` & `AcademicSubjects`), dengan fallback cerdas ke master mapel pondok.
- **Sinkronisasi Multi-Environment**:
  - Tersinkronisasi identik di Production (`1x84JjMXFDR-eOeuuzV6S4sVsmFLnjrpLnnnoYKW4nZyj9tjIbLaKPKez`) dan Staging (`1_CIhMWKami-et1cawF4GM1gqRIsw8qXOTRrev6hTGflmwix0oCif-3ey`).

## 2026-11-02 - Versi Update: 100% Data Riil Rapor Santri, Presisi Format Referensi F4/A4, & Eliminasi Duplikasi

- **100% Data Riil Aplikasi (Eliminasi Total Nilai Palsu / Simulasi)**:
  - Menghapus seluruh fallback nilai mock/hardcoded (`defaultPondokSubjects` angka 91, 92, 95 dsb.) di `SantriIntelligence.gs`, `JS_App.html`, dan `Modal_BulkRaportPrint.html`.
  - Nilai Tahfidz, Pelajaran Kitab Kuning, Kurikulum Kepesantrenan, Presensi, dan Akhlak kini ditarik 100% dari rekaman riil di spreadsheet (`AcademicSubjects`, `AcademicScores`, `MemorizationLogs`, `Attendance`, dan `Incidents`).
  - Bila nilai mata pelajaran belum diinput oleh ustadz di sheet, sistem secara jujur menampilkan strip `-` dan terbilang `Belum dinilai` (BUKAN angka simulasi palsu).
  - Seksi Tahfidz menampilkan capaian riil santri; jika santri belum ada setoran hafalan pada periode berjalan, nilai dan predikat tertera `-` dengan keterangan `Belum ada catatan setoran pada periode ini`.
- **Eliminasi Pengulangan Halaman & Selector Cetak Cerdas**:
  - Deduplikasi ketat data santri pada backend `getBulkClassReportData` menggunakan hashing identitas unik (`StudentID` dan `Name + NIS`) sehingga santri ganda di database tidak akan pernah lagi dicetak dua kali.
  - Penambahan dropdown **Pilih Santri** di toolbar modal: Ustadz/Admin dapat memilih mencetak `Semua Santri 1 Kelas (Massal)` atau memilih santri spesifik (misal: hanya mencetak santri Bunga), menghasilkan tepat **1 lembar halaman F4 rapi** tanpa halaman duplikat.
  - Penambahan tombol shortcut `📜 Cetak Format F4 Resmi` langsung dari tab Raport pada modal detail santri perorangan (`Modal_Detail_Raport.html`).
- **Kop Surat Lembaga & Logo Presisi Sesuai Referensi F4/A4**:
  - Penyesuaian tata letak kop surat 100% identik dengan standar referensi resmi pesantren di folder `Referensi`:
    - Lambang/crest resmi di sebelah kiri (dengan fallback vektor SVG kubah & bintang emas Islami jika logo custom belum diunggah).
    - Teks kop 4 baris bertingkat: Nama Yayasan, Nama Pondok Pesantren (bold tegas), Kaligrafi Teks Arab Resmi Lembaga (`معهد ...`), dan Alamat Lengkap + No. Kontak + No. Statistik Pesantren (NSPP).
    - Garis ganda tebal-tipis (*double rule border*) melintang penuh pemisah kop resmi.
- **Pembersihan Footer Browser (Bebas Link URL Script Google)**:
  - Penyempurnaan aturan CSS `@media print` dan `@page` untuk ukuran kertas standar Folio/F4 (215mm x 330mm) dengan margin presisi agar dokumen muat pas 1 halaman per santri.
  - Penambahan banner panduan visual di UI toolbar cetak yang mengingatkan pengguna untuk menonaktifkan centang *"Headers and footers"* pada dialog cetak browser agar URL link browser dan tanggal di pojok bawah tidak tercetak.
- **Tabel Kurikulum Kitab Lengkap dengan Terbilang & Teks Arab**:
  - Pemetaan otomatis teks Arab untuk mata pelajaran kepesantrenan (Tafsir, Hadits, Mushthalah Hadits, Tauhid, Fiqih, Ushul Fiqih, Nahwu, Balaghah, Tasawuf) dengan nama kitab kuning rujukan.
  - Engine konversi terbilang Indonesia (`SI_terbilang_`) disempurnakan mendukung satuan, belasan, puluhan, ratusan, ribuan, hingga angka desimal koma (misal: 92.6 $\rightarrow$ *Sembilan puluh dua koma enam*).
  - Tanda tangan 3 kolom resmi (Orang Tua/Wali, Pimpinan Pondok, dan Wali Kelas) lengkap dengan titimangsa kota dan tanggal resmi Indonesia.

- **Paket Raport Lengkap & Bulk PDF 1-Klik**:
  - Menerapkan sistem raport terpadu berbasis referensi standar lembaga Islam: Format TPQ (A4), MDT (F4), Pondok Pesantren (F4), Leger Nilai 1 Kelas (Landscape), dan Sertifikat Kenaikan Jilid.
  - Kemampuan unduh/cetak PDF massal untuk seluruh santri 1 kelas sekaligus (`getBulkClassReportData`) tanpa harus memproses satu per satu.
  - Menggunakan engine cetak berbasis CSS `@media print` (`page-break-after: always`) client-side untuk mengeliminasi risiko eksekusi Google Apps Script timeout pada data puluhan hingga ratusan santri.
  - Tombol "📄 Cetak Raport 1 Kelas" terintegrasi di `Tab_Students.html` dan "📄 Cetak Raport Massal & Leger" di `Tab_Akademik.html`.
- **Santri Analytics PRO (360° Intelligence & Advanced Operational Simulation)**:
  - Modul `analytics_pro` resmi terdaftar di arsitektur produk (`PRODUCT_MODULES`, `PRODUCT_NAV_MODULES`, `PRODUCT_ACTION_MODULES`).
  - Lisensi modular dapat diatur per pondok melalui menu **Setup Pondok** $\rightarrow$ **Paket & Lisensi Modul** (gating) dengan kartu promosi upsell otomatis bagi pondok yang belum berlangganan.
  - **Simulasi Multi-Data Operasional Terpadu**:
    - Integrasi sinkron skor perilaku akumulatif riil dari sheet `Incidents` menggunakan `calculateBehaviorScore_`, mendukung nilai minus (seperti kasus Ahmad Mujahid -135) secara presisi.
    - Status perkembangan santri otomatis sinkron: `PEMBINAAN INTENSIF (KRITIS)` (merah/pulse), `PERLU PEMBINAAN` (kuning), `SANTRI NORMAL` (biru), atau `SANTRI UNGGUL` (hijau).
    - 4 Bento Cards metrik operasional mendalam: Poin Perilaku Riil & Rincian Kasus per Kategori (Asrama, Ibadah, Ketertiban), Presensi & Alpa, Halaqoh & Hafalan (Ziyadah vs Muroja'ah), serta Akademik & Kitab Kuning.
    - Radar Chart 5 Pilar (Tahfidz, Kitab, Akhlak, Ibadah, Sosial): Pilar Akhlak mencerminkan kondisi riil (skor 9/100 pada kasus Ahmad Mujahid) sehingga memberikan peringatan visual dini yang dramatis dan akurat.
    - Diagnosis Karakter & Potensi Terarah: Menghilangkan pujian semu pada santri bermasalah, menggantinya dengan diagnosis psikologis objektif ("Diagnosis Karakter & Pembinaan Khusus" dan "Potensi Tahfidz yang Terdistraksi").
    - Rekonstruksi Matriks SWOT: Larangan mutlak memasukkan adab ke dalam Strengths jika poin perilaku rendah/minus; penajaman Weaknesses mencakup krisis poin minus, kategori kasus terbanyak, absensi alpa, dan ketimpangan muroja'ah.
    - Panduan Aksi Sinergis 2 Pihak (Dual Action Plan): Solusi konkret intervensi krisis untuk Ustadz di pondok (konseling 1-on-1, kontrak komitmen tertulis, rotasi kamar, restorasi poin khidmah) dan Orang Tua di rumah (koordinasi pondok, karantina gadget/HP, dialog empatik, keteladanan ibadah).
  - **Akses Akun Wali Santri**:
    - Tombol "🧠 Analisis 360° (PRO)" diaktifkan pada `Tab_WaliSantriDetail.html` sehingga orang tua dapat memantau analisis perkembangan dan panduan pendampingan ananda di rumah.
  - **Engine Cetak Portofolio Eksekutif (PDF A4)**:
    - Perbaikan stylesheet `@media print` dengan isolasi kelas `body.is-printing-portfolio` untuk mencegah pratinjau cetak browser kosong/blank.
    - Lembar portofolio memuat Kop Resmi Pondok/Yayasan, Biodata Santri, Radar 5 Pilar, Bento Simulasi Operasional, Matriks SWOT, Histori Pelanggaran, Panduan Sinergi, dan 2 Kolom Tanda Tangan Resmi (Wali Santri & Ustadz Pembina Asrama).


## 2026-11-02 - Versi Production @212: Integrasi Product Readiness, Smart Schedule Parser & Multi-Pondok

- **Smart Schedule Parser**:
  - Deteksi cerdas file jadwal (.xlsx, .xls, .csv), mendukung format tabular biasa maupun matriks roster KBM (kolom kelas/hari, jam berderet, format titik `07.30 - 08.30`, jam ke-1 s/d 8).
  - Pendaftaran otomatis akun Ustadz baru (T001 - T013) dalam satu kali proses import jadwal tanpa input manual.
  - Whitelist backend action `applySmartSchedules` dan `autoCompleteSetupPrerequisites` di `isExternalActionAllowed_`.
- **Penyederhanaan Antarmuka Setup Pondok**:
  - Menggabungkan 7 tab membingungkan menjadi 2 Menu Utama yang bersih dan fokus:
    1. `🚀 1. Wizard Setup (Pondok Aktif)`: Alur berurutan 7 langkah untuk menyelesaikan persiapan pondok sampai siap pakai.
    2. `📋 2. Riwayat Setup & Kontrol Pelanggan`: Pusat rekap riwayat setup, status pembayaran, paket lisensi, dan masa aktif seluruh pondok.
  - Sub-tabel teknis dipisah ke tombol dropdown/toggle `⚙️ Modul & Teknis`.
- **Perbaikan Form & Status Pondok Aktif**:
  - Form tidak lagi kosong saat dibuka; langsung menampilkan data pondok yang sedang dikerjakan dengan banner hijau penjelas `Pondok Aktif Saat Ini`.
  - Auto-seeding active workspace sehingga data riwayat setup tidak pernah hilang atau null.
  - Penambahan badge `★ PONDOK AKTIF` dan tombol `🚀 Buka di Wizard`.
- **Akademik & Akun Wali Cerdas**:
  - Jalur Cepat 1x Klik untuk membuat Periode Akademik (default `2026/2027 Ganjil`) dan sinkronisasi otomatis seluruh Item Ujian Kurikulum dari Jadwal aktif.
  - Sinkronisasi otomatis Santri asli ke akun Wali berdasarkan No. HP Wali, Username, NIS, atau Nama Santri tanpa perlu mengetik StudentID manual.
- **Rollout ke Aplikasi Utama**:
  - Berhasil dideploy ke Production Deployment ID `AKfycbxP3xqiB3va56ipHb-aVyS4nIN1oBdgWsTsSmDnc0L24TBpV2tE4PexMMmj0Uwgu0YVsQ` pada versi `@212`.
  - Database pondok utama tetap terlindungi secara aman di Spreadsheet pondok sendiri tanpa terganggu database staging.

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
