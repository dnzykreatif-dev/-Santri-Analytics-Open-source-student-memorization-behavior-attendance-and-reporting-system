const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.resolve('BAHAN PROMOSI/assets/screenshots');

function getBase64Image(fileName) {
  const fullPath = path.join(SCREENSHOT_DIR, fileName);
  if (!fs.existsSync(fullPath)) return '';
  const ext = path.extname(fileName).toLowerCase().replace('.', '');
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,${fs.readFileSync(fullPath).toString('base64')}`;
}

const images = {
  step1: getBase64Image('step1_hubungkan_database.png'),
  step4_jalur: getBase64Image('step4_jadwal_3_jalur.png'),
  step4_preview: getBase64Image('step4_preview_upload_jadwal.png'),
  step5: getBase64Image('step5_akademik_item_ujian.png'),
  step6: getBase64Image('step6_akun_demo_wali.png'),
  step7: getBase64Image('step7_cek_kesiapan.png'),
  riwayat: getBase64Image('riwayat_kontrol_pelanggan_aktif.png'),
  dashboard: getBase64Image('dashboard_mudir.png'),
  wali: getBase64Image('akses_wali_santri.png'),
  perilaku: getBase64Image('catatan_perilaku.png'),
  akademik: getBase64Image('akademik_raport.png'),
};

const COMMON_CSS = `
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
    @bottom-right {
      content: counter(page);
    }
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.55;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }
  .cover-header {
    text-align: center;
    border-bottom: 2px solid #065f46;
    padding-bottom: 20px;
    margin-bottom: 25px;
  }
  .tagline {
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
    color: #059669;
    margin-bottom: 6px;
  }
  h1 {
    font-size: 20pt;
    color: #064e3b;
    margin: 4px 0 10px 0;
    line-height: 1.25;
  }
  .subtitle {
    font-size: 10.5pt;
    color: #475569;
    margin: 0;
  }
  h2 {
    font-size: 13.5pt;
    color: #065f46;
    border-bottom: 1.5px solid #e2e8f0;
    padding-bottom: 5px;
    margin-top: 24px;
    margin-bottom: 12px;
    page-break-after: avoid;
  }
  h3 {
    font-size: 11pt;
    color: #0f172a;
    margin-top: 16px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }
  p, li {
    font-size: 9.8pt;
    color: #334155;
  }
  ul, ol {
    margin: 8px 0 14px 20px;
    padding: 0;
  }
  li {
    margin-bottom: 5px;
  }
  .alert-box {
    background: #f0fdf4;
    border-left: 4px solid #10b981;
    padding: 10px 14px;
    border-radius: 0 6px 6px 0;
    margin: 14px 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }
  .alert-warning {
    background: #fffbeb;
    border-left: 4px solid #f59e0b;
  }
  .alert-info {
    background: #f8fafc;
    border-left: 4px solid #3b82f6;
  }
  .screenshot-card {
    margin: 16px 0 20px 0;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
    page-break-inside: avoid;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .screenshot-img {
    max-width: 100%;
    max-height: 380px;
    border-radius: 5px;
    border: 1px solid #e2e8f0;
    display: block;
    margin: 0 auto;
  }
  .screenshot-caption {
    font-size: 8.5pt;
    font-weight: 700;
    color: #065f46;
    margin-top: 8px;
    letter-spacing: 0.3px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 9pt;
    page-break-inside: avoid;
  }
  th {
    background: #064e3b;
    color: white;
    padding: 8px 10px;
    text-align: left;
    font-weight: 600;
  }
  td {
    border-bottom: 1px solid #e2e8f0;
    padding: 7px 10px;
    vertical-align: top;
  }
  tr:nth-child(even) {
    background: #f8fafc;
  }
  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 10px;
    font-size: 7.5pt;
    font-weight: 700;
    background: #dcfce7;
    color: #166534;
  }
  .page-break {
    page-break-after: always;
  }
`;

function buildManualHtml() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<title>Panduan Setup Manual Lengkap - Santri Analytics</title>
<style>${COMMON_CSS}</style>
</head>
<body>

<div class="cover-header">
  <div class="tagline">SANTRI ANALYTICS — PANDUAN RESMI OPERASIONAL</div>
  <h1>Buku Panduan Setup Manual Lengkap</h1>
  <p class="subtitle">Panduan Langkah-demi-Langkah Instalasi, Import Data, Jadwal Cerdas, dan Manajemen Pesantren</p>
</div>

<div class="alert-box">
  <strong>Selamat Bergabung di Ekosistem Santri Analytics!</strong><br>
  Buku panduan ini disusun untuk mendampingi Administrator, Mudir, dan Dewan Asatidz dalam menyiapkan sistem dari nol hingga 100% siap pakai. Dilengkapi tangkapan layar (screenshot) aktual di setiap tahap konfigurasi.
</div>

<h2>1. Gambaran Umum Sistem & Arsitektur Cloud Mandiri</h2>
<p>Santri Analytics dirancang dengan prinsip <strong>Kedaulatan Data Penuh</strong>: seluruh database (Spreadsheet), raport (Google Docs), dan aset lembaga 100% tersimpan di akun Google Drive resmi milik pondok Anda sendiri. Tanpa biaya sewa server bulanan yang mahal, dan bebas risiko kebocoran data ke pihak ketiga.</p>

<div class="screenshot-card">
  <img class="screenshot-img" src="${images.dashboard}" alt="Dashboard Eksekutif Mudir">
  <div class="screenshot-caption">Gambar 1: Dashboard Eksekutif Pimpinan Pondok (Mudir) — Pemantauan Real-Time</div>
</div>

<h2>2. Menyiapkan Spreadsheet & Template Raport</h2>
<p>Sebelum membuka aplikasi, lakukan 2 langkah awal di Google Drive resmi pondok Anda:</p>
<ol>
  <li><strong>Salin Spreadsheet Database</strong>: Buka tautan template spreadsheet resmi dari email pengiriman lisensi Anda. Klik menu <code>File > Buat Salinan (Make a copy)</code> dan beri nama sesuai pondok Anda.</li>
  <li><strong>Salin Template Raport</strong>: Buka tautan template raport Google Docs resmi. Klik menu <code>File > Buat Salinan (Make a copy)</code> ke Drive pondok Anda.</li>
  <li>Simpan tautan / URL kedua file tersebut untuk dimasukkan pada Langkah 1 di aplikasi.</li>
</ol>

<h2>3. Langkah 1: Profil Pondok & Hubungkan Database</h2>
<p>Buka aplikasi Santri Analytics, login dengan akun awal <code>mudir</code> / <code>admin123</code>, lalu buka menu <strong>Setup Pondok</strong>:</p>
<ul>
  <li>Isi Nama Pondok, Alamat, Nomor WhatsApp, Email, dan unggah Logo Pesantren.</li>
  <li>Pada kotak berwarna kuning-keemasan, tempel Link / ID Spreadsheet dan Link / ID Template Raport pondok Anda.</li>
  <li>Klik tombol hijau <strong>Hubungkan Spreadsheet Pondok</strong>. Sistem akan otomatis menyiapkan seluruh sheet dalam hitungan detik!</li>
</ul>

<div class="screenshot-card">
  <img class="screenshot-img" src="${images.step1}" alt="Langkah 1: Hubungkan Database">
  <div class="screenshot-caption">Gambar 2: Langkah 1 Wizard — Menghubungkan ID Spreadsheet & Template Raport Pondok</div>
</div>

<h2>4. Langkah 2 & 3: Paket Modul, Data Santri & Sinkronisasi Wali</h2>
<p>Pada Langkah 2, tentukan modul yang diaktifkan (Tahfidz, Absensi, Perilaku, Akademik, Raport, Portal Wali). Pada Langkah 3, masukkan data santri melalui fitur import.</p>
<div class="alert-box alert-info">
  <strong>Fitur Cerdas: Pasangkan Wali ↔ Santri Asli (1x Klik)</strong><br>
  Klik tombol <em>Pasangkan Wali ↔ Santri Asli</em>. Sistem cerdas otomatis membuatkan akun login Wali Santri berdasarkan Nomor WhatsApp atau NIS santri, dan langsung menautkannya ke data anaknya masing-masing tanpa perlu mengetik StudentID manual!
</div>

<div class="screenshot-card">
  <img class="screenshot-img" src="${images.wali}" alt="Portal Khusus Wali Santri">
  <div class="screenshot-caption">Gambar 3: Portal Khusus Wali Santri — Pemantauan Hafalan, Presensi, dan Karakter Santri dari HP</div>
</div>

<div class="page-break"></div>

<h2>5. Langkah 4: Upload Jadwal Cerdas (Excel / CSV)</h2>
<p>Santri Analytics dilengkapi teknologi <strong>Smart Schedule Parser</strong> yang mampu membaca file jadwal pondok Anda secara otomatis tanpa perlu mengetik satu per satu:</p>

<div class="screenshot-card">
  <img class="screenshot-img" src="${images.step4_jalur}" alt="Langkah 4: 3 Jalur Jadwal">
  <div class="screenshot-caption">Gambar 4: Langkah 4 Wizard — 3 Jalur Pengaturan Jadwal KBM & Kegiatan</div>
</div>

<ul>
  <li><strong>Mendukung Format Roster Matriks KBM</strong>: Mendeteksi otomatis jadwal mingguan dengan kolom kelas (7A, 7B, dll.), baris jam pelajaran ke-1 s/d 8, maupun format waktu bertitik (<code>07.30 - 08.30</code>).</li>
  <li><strong>Pendaftaran Akun Ustadz Otomatis</strong>: Seluruh nama guru pengampu yang tertera di file Excel langsung didaftarkan otomatis sebagai akun login Ustadz (kode <code>T001</code> s/d <code>T013</code>) ke database!</li>
</ul>

<div class="screenshot-card">
  <img class="screenshot-img" src="${images.step4_preview}" alt="Pratinjau Upload Jadwal Excel Cerdas">
  <div class="screenshot-caption">Gambar 5: Pratinjau Pembacaan Otomatis 342 Jadwal & 13 Guru dari File Excel Asli Pondok</div>
</div>

<h2>6. Langkah 5: Akademik & Item Ujian Raport (1x Klik)</h2>
<p>Pada Langkah 5, Anda tidak perlu lagi menyusun kurikulum raport yang rumit secara manual. Cukup klik tombol <strong>Siapkan Periode & Item Ujian Otomatis (1x Klik)</strong>:</p>
<ul>
  <li>Sistem otomatis membuat Periode Akademik aktif sesuai tahun ajaran (misal <code>2026/2027 Ganjil</code>).</li>
  <li>Menarik seluruh mata pelajaran dari Jadwal KBM menjadi Item Ujian Raport yang siap diisi nilai oleh dewan ustadz.</li>
</ul>

<div class="screenshot-card">
  <img class="screenshot-img" src="${images.step5}" alt="Langkah 5: Akademik dan Item Ujian">
  <div class="screenshot-caption">Gambar 6: Langkah 5 Wizard — Periode Akademik & Penyiapan Kurikulum Raport Otomatis</div>
</div>

<div class="screenshot-card">
  <img class="screenshot-img" src="${images.akademik}" alt="Raport Santri Google Docs">
  <div class="screenshot-caption">Gambar 7: Modul Akademik & Raport Resmi Pesantren Format Google Docs / PDF</div>
</div>

<div class="page-break"></div>

<h2>7. Langkah 6: Akun Demo & Akun Wali</h2>
<p>Pada Langkah 6, buat minimal 1 akun demo untuk uji coba pameran atau presentasi tanpa mengotori data asli pondok:</p>

<div class="screenshot-card">
  <img class="screenshot-img" src="${images.step6}" alt="Langkah 6: Akun Demo">
  <div class="screenshot-caption">Gambar 8: Langkah 6 Wizard — Pembuatan Akun Demo (Mudir, Admin, Ustadz, Wali)</div>
</div>

<h2>8. Langkah 7: Cek Kesiapan & Selesai (100% Siap Pakai)</h2>
<p>Pada Langkah 7, sistem memeriksa 8 parameter kesiapan pondok. Jika ada yang bertanda kuning (Kurang), cukup klik tombol <strong>⚡ Lengkapi Otomatis yang Kurang</strong>, lalu klik <strong>Selesaikan Setup</strong>.</p>

<div class="screenshot-card">
  <img class="screenshot-img" src="${images.step7}" alt="Langkah 7: Cek Kesiapan">
  <div class="screenshot-caption">Gambar 9: Langkah 7 Wizard — Cek Kesiapan Sistem Menyeluruh</div>
</div>

<h2>9. Riwayat Setup & Kontrol Pelanggan Pondok</h2>
<p>Pada menu <strong>📋 Riwayat Setup & Kontrol Pelanggan</strong>, Anda dapat melihat ringkasan pondok aktif Anda dengan badge hijau <code>★ PONDOK AKTIF</code> dan progres 100% Siap Pakai. Di menu ini pula Anda dapat mendaftarkan pondok baru jika ingin menjual lisensi ke pesantren lain:</p>

<div class="screenshot-card">
  <img class="screenshot-img" src="${images.riwayat}" alt="Riwayat Setup & Kontrol Pelanggan">
  <div class="screenshot-caption">Gambar 10: Panel Riwayat Setup & Kontrol Pelanggan — Status 100% Siap Pakai</div>
</div>

<div class="screenshot-card">
  <img class="screenshot-img" src="${images.perilaku}" alt="Catatan Perilaku & Adab Santri">
  <div class="screenshot-caption">Gambar 11: Modul Kedisiplinan — Poin Adab, Pelanggaran, dan Prestasi Santri</div>
</div>

<h2>10. Layanan Dukungan Teknis</h2>
<p>Jika Anda membutuhkan bantuan setup, import data massal santri, atau memiliki pertanyaan teknis, tim teknis kami siap mendampingi Anda hingga tuntas melalui WhatsApp VIP Support yang tertera pada email pembelian Anda.</p>

</body>
</html>`;
}

function buildProposalHtml() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<title>Proposal Penawaran Resmi - Santri Analytics</title>
<style>${COMMON_CSS}</style>
</head>
<body>

<div class="cover-header">
  <div class="tagline">PROPOSAL KERJASAMA STRATEGIS DIGITALISASI PESANTREN</div>
  <h1>Santri Analytics</h1>
  <p class="subtitle">Sistem Informasi Manajemen Santri, Mutaba'ah Tahfidz, Presensi, dan Raport Terpadu Berbasis Cloud Google Workspace</p>
</div>

<h2>I. Eksekutif Ringkasan</h2>
<p>Santri Analytics adalah solusi modern yang mengintegrasikan seluruh operasional pesantren dalam satu platform terpadu. Membantu asatidz bekerja lebih efisien, memudahkan pimpinan memantau pondok berbasis data, dan membangun transparansi dengan wali santri secara real-time.</p>

<div class="screenshot-card">
  <img class="screenshot-img" src="${images.dashboard}" alt="Dashboard Mudir">
  <div class="screenshot-caption">Tampilan Dashboard Pimpinan Pesantren — Grafik Real-Time & Rekap Eksekutif</div>
</div>

<h2>II. 4 Keunggulan Utama untuk Yayasan / Pesantren</h2>
<table>
  <tr>
    <th style="width: 30%;">Keunggulan</th>
    <th>Dampak Nyata bagi Pondok Pesantren</th>
  </tr>
  <tr>
    <td><strong>1. 100% Data Milik Pondok</strong></td>
    <td>Database tersimpan aman di Google Drive resmi milik yayasan/pondok sendiri. Tanpa server pihak ketiga, kerahasiaan data santri terjamin mutlak.</td>
  </tr>
  <tr>
    <td><strong>2. Bebas Biaya Server Bulanan</strong></td>
    <td>Menggunakan infrastruktur Google Workspace tanpa biaya sewa VPS bulanan yang membebani kas yayasan.</td>
  </tr>
  <tr>
    <td><strong>3. Portal Wali Santri Real-Time</strong></td>
    <td>Orang tua dapat memantau capaian hafalan juz Al-Qur'an dan absensi ananda langsung dari smartphone dari rumah.</td>
  </tr>
  <tr>
    <td><strong>4. Raport Otomatis 1x Klik</strong></td>
    <td>Menghilangkan lembur akhir semester bagi dewan ustadz. Raport resmi terbit seketika format Docs/PDF lengkap dengan logo pondok.</td>
  </tr>
</table>

<div class="page-break"></div>

<h2>III. Dokumentasi Antarmuka Fitur Unggulan</h2>

<div class="screenshot-card">
  <img class="screenshot-img" src="${images.wali}" alt="Akses Wali Santri">
  <div class="screenshot-caption">Portal Wali Santri — Transparansi Perkembangan Santri Meningkatkan Kepercayaan Orang Tua</div>
</div>

<div class="screenshot-card">
  <img class="screenshot-img" src="${images.akademik}" alt="Raport Akademik">
  <div class="screenshot-caption">Modul Akademik & Cetak Raport Resmi — Standar Kurikulum Pesantren & Kemenag</div>
</div>

<div class="screenshot-card">
  <img class="screenshot-img" src="${images.step4_preview}" alt="Smart Upload Jadwal Excel">
  <div class="screenshot-caption">Teknologi Smart Schedule Parser — Sekali Upload Excel, Ratusan Jadwal & Akun Guru Aktif Seketika</div>
</div>

<h2>IV. Pilihan Paket Investasi Lembaga</h2>
<table>
  <tr>
    <th>Fitur & Layanan</th>
    <th>Paket Standar</th>
    <th>Paket Pro Lengkap (Rekomendasi)</th>
  </tr>
  <tr>
    <td>Maksimal Kuota Santri</td>
    <td>s/d 300 Santri</td>
    <td><span class="badge">Unlimited</span> Tanpa Batas</td>
  </tr>
  <tr>
    <td>Seluruh Modul (Tahfidz, Absensi, Nilai, Wali)</td>
    <td>Aktif Penuh</td>
    <td>Aktif Penuh</td>
  </tr>
  <tr>
    <td>Aplikasi Web & APK Android</td>
    <td>Tersedia</td>
    <td>Tersedia</td>
  </tr>
  <tr>
    <td>Bantuan Pemasangan & Input Data Awal</td>
    <td>Mandiri via Tutorial</td>
    <td><strong>Terima Beres oleh Tim Teknis</strong></td>
  </tr>
  <tr>
    <td>Pelatihan Dewan Asatidz</td>
    <td>Video & E-Book</td>
    <td><strong>Sesi Zoom / On-Call VIP</strong></td>
  </tr>
  <tr>
    <td>Dukungan Bantuan Teknis Prioritas</td>
    <td>6 Bulan</td>
    <td><strong>1 Tahun Penuh</strong></td>
  </tr>
  <tr>
    <td><strong>Nilai Investasi</strong></td>
    <td><strong>Rp 1.250.000</strong></td>
    <td><strong>Rp 2.450.000</strong></td>
  </tr>
</table>

<div class="alert-box">
  <strong>Penutup & Komitmen Kerjasama:</strong><br>
  Kami siap mendampingi proses modernisasi pesantren Anda secara bertahap dan berkesinambungan. Hubungi tim kami untuk konsultasi dan jadwal demonstrasi sistem langsung.
</div>

</body>
</html>`;
}

function buildCheatsheetHtml() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<title>Lembar Panduan Cepat (Quick Start Cheatsheet) - Santri Analytics</title>
<style>
  ${COMMON_CSS}
  @page {
    margin: 14mm 12mm 14mm 12mm;
  }
  .workflow-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin: 16px 0;
  }
  .workflow-item {
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 6px;
    padding: 10px;
    text-align: center;
  }
  .workflow-num {
    font-size: 14pt;
    font-weight: 800;
    color: #059669;
  }
  .workflow-title {
    font-weight: 700;
    font-size: 9pt;
    color: #064e3b;
    margin-top: 4px;
  }
  .workflow-desc {
    font-size: 8pt;
    color: #475569;
    margin-top: 4px;
  }
</style>
</head>
<body>

<div class="cover-header" style="padding-bottom: 12px; margin-bottom: 16px;">
  <div class="tagline">SANTRI ANALYTICS — CHEATSHEET 1 HALAMAN</div>
  <h1 style="font-size: 17pt;">Panduan Cepat Setup Kilat 10 Menit</h1>
  <p class="subtitle">Ringkasan Alur Konfigurasi untuk Mudir & Administrator Pondok Pesantren</p>
</div>

<div class="workflow-grid">
  <div class="workflow-item">
    <div class="workflow-num">1</div>
    <div class="workflow-title">SALIN TEMPLATE</div>
    <div class="workflow-desc">Salin Spreadsheet & Dokumen Raport ke Google Drive pondok.</div>
  </div>
  <div class="workflow-item">
    <div class="workflow-num">2</div>
    <div class="workflow-title">WIZARD SETUP</div>
    <div class="workflow-desc">Login (mudir/admin123), tempel Link ID Spreadsheet di Langkah 1.</div>
  </div>
  <div class="workflow-item">
    <div class="workflow-num">3</div>
    <div class="workflow-title">UPLOAD JADWAL</div>
    <div class="workflow-desc">Upload Excel Jadwal mingguan & pasangkan Wali Santri asli (1x klik).</div>
  </div>
  <div class="workflow-item">
    <div class="workflow-num">4</div>
    <div class="workflow-title">GO-LIVE PONDOK</div>
    <div class="workflow-desc">Status 100% Siap. Bagikan akun ke Dewan Ustadz & Wali Santri.</div>
  </div>
</div>

<h2>Tabel Ringkas 7 Langkah Wizard Setup</h2>
<table>
  <tr>
    <th style="width: 10%;">Langkah</th>
    <th style="width: 25%;">Nama Langkah</th>
    <th>Tindakan yang Dilakukan</th>
    <th style="width: 30%;">Hasil Instan</th>
  </tr>
  <tr>
    <td><strong>1</strong></td>
    <td><strong>Profil & Database</strong></td>
    <td>Isi identitas pondok & tempel Link Spreadsheet salinan.</td>
    <td>Database Google Drive terhubung seketika.</td>
  </tr>
  <tr>
    <td><strong>2</strong></td>
    <td><strong>Paket Modul</strong></td>
    <td>Pilih Mode Gating <code>Off</code> dan centang seluruh fitur.</td>
    <td>Tahfidz, Absensi, Perilaku, Nilai aktif.</td>
  </tr>
  <tr>
    <td><strong>3</strong></td>
    <td><strong>Data Santri</strong></td>
    <td>Upload data santri CSV & klik <em>Pasangkan Wali ↔ Santri</em>.</td>
    <td>Santri masuk & akun wali otomatis tertaut.</td>
  </tr>
  <tr>
    <td><strong>4</strong></td>
    <td><strong>Jadwal Cerdas</strong></td>
    <td>Upload file Excel jadwal (.xlsx / .csv) pondok Anda.</td>
    <td>Ratusan jadwal aktif & akun Ustadz terbuat.</td>
  </tr>
  <tr>
    <td><strong>5</strong></td>
    <td><strong>Akademik</strong></td>
    <td>Klik <em>Siapkan Periode & Item Ujian Otomatis (1x Klik)</em>.</td>
    <td>Periode 2026/2027 aktif & kurikulum raport siap.</td>
  </tr>
  <tr>
    <td><strong>6</strong></td>
    <td><strong>Akun Demo</strong></td>
    <td>Simpan minimal 1 akun demo untuk uji coba pameran.</td>
    <td>Login akun demo aktif.</td>
  </tr>
  <tr>
    <td><strong>7</strong></td>
    <td><strong>Cek Kesiapan</strong></td>
    <td>Klik <em>Lengkapi Otomatis</em> lalu <em>Selesaikan Setup</em>.</td>
    <td><span class="badge">100% SIAP PAKAI</span></td>
  </tr>
</table>

<h2>Format Akun Login Pengguna</h2>
<table>
  <tr>
    <th style="width: 22%;">Peran Pengguna</th>
    <th>Hak Akses & Fitur</th>
    <th style="width: 35%;">Format Akun Login</th>
  </tr>
  <tr>
    <td><strong>Pimpinan / Mudir</strong></td>
    <td>Dashboard grafik eksekutif, rekap absensi santri & guru, dan persetujuan raport.</td>
    <td><code>mudir</code> / password admin Anda</td>
  </tr>
  <tr>
    <td><strong>Dewan Ustadz</strong></td>
    <td>Input absensi kelas KBM, setoran tahfidz juz/surat, catatan adab, dan nilai raport.</td>
    <td>Kode ustadz (misal: <code>T001</code>) / password guru</td>
  </tr>
  <tr>
    <td><strong>Wali Santri</strong></td>
    <td>Portal monitoring capaian hafalan Al-Qur'an, kehadiran, catatan perilaku, dan raport anak.</td>
    <td>Nomor WhatsApp Wali atau NIS Santri</td>
  </tr>
</table>

<div class="alert-box" style="margin-top: 15px;">
  <strong>Tips Penting Keamanan:</strong> Segera buka menu <em>Ubah Password</em> di pojok kanan atas setelah setup awal untuk mengganti password bawaan sistem demi keamanan database lembaga Anda.
</div>

</body>
</html>`;
}

function generatePdf(htmlContent, outputPdfPath) {
  const tempHtmlPath = path.resolve('temp_render.html');
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

  console.log(`Generating PDF -> ${outputPdfPath} ...`);
  const args = [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${path.resolve(outputPdfPath)}`,
    `file:///${tempHtmlPath.replace(/\\/g, '/')}`,
  ];

  const res = cp.spawnSync(CHROME_PATH, args, { timeout: 30000 });
  if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);

  if (fs.existsSync(outputPdfPath)) {
    const size = fs.statSync(outputPdfPath).size;
    console.log(`✓ Success: ${outputPdfPath} (${(size / 1024).toFixed(1)} KB)`);
    return true;
  } else {
    console.error(`✗ Failed to generate PDF: ${outputPdfPath}`, res.stderr?.toString());
    return false;
  }
}

console.log('=== Compiling Marketing & Customer Delivery PDFs with Actual Screenshots ===');

generatePdf(
  buildManualHtml(),
  'BAHAN PROMOSI/01_PAKET_PEMBELI_DIGITAL/02_PANDUAN_SETUP_MANUAL_LENGKAP.pdf'
);

generatePdf(
  buildCheatsheetHtml(),
  'BAHAN PROMOSI/01_PAKET_PEMBELI_DIGITAL/03_QUICK_START_LEMBAR_PANDUAN_RINGKAS.pdf'
);

generatePdf(
  buildProposalHtml(),
  'BAHAN PROMOSI/02_MATERI_PROMOSI_DAN_IKLAN/04_PROPOSAL_PENAWARAN_RESMI_PESANTREN.pdf'
);

console.log('=== All PDFs Generated Successfully! ===');
