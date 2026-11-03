# Panduan Lengkap: Impor Cerdas Jadwal, Kurikulum, & Setup Raport Santri Analytics

Dokumen ini merupakan panduan teknis dan operasional menyeluruh mengenai sistem integrasi Jadwal KBM, Pemetaan Kurikulum Kitab Kuning, Setup Raport F4 Resmi, dan Tata Kelola Akademik pada **Santri Analytics**.

---

## 1. Arsitektur & Alur Data Riil (Bukan Simulasi)

Pada versi terbaru, seluruh sajian nilai, kurikulum kitab, identitas pejabat, dan ustadz pengajar pada Raport Santri bersumber 100% dari rekaman riil sistem:

```
[ Tabel Jadwal KBM ] (342 Sesi Riil)
        │
        ├──> Auto-Klasifikasi Jenjang (Tsanawiyyah 7-9 vs Aliyah 10-12)
        ├──> Auto-Klasifikasi Rumpun Mapel (Diniyyah vs Umum)
        └──> Pemetaan Ustadz Pengajar & Rombel
                    │
                    ▼
[ Setup Raport & Kurikulum ]
        │
        ├──> Kop Lembaga & Logo Resmi (Auto-Compress < 15KB)
        ├──> Penugasan Wali Kelas Riil per Tingkat (Kelas 7 - 12)
        ├──> Pemetaan Kitab Kuning (Standar Utama & Override Jenjang)
        └──> KKM Dinamis per Mata Pelajaran
                    │
                    ▼
[ Raport F4 & Leger Nilai ]
        │
        ├──> 100% Bebas Data Palsu (Belum dinilai ditampilkan '-')
        ├──> 1 Halaman F4 Presisi per Santri (Tanpa duplikasi)
        └──> Kop Resmi Berstandar Pesantren + Tanda Tangan 3 Pihak
```

---

## 2. Fitur Impor Cerdas Jadwal & Kurikulum Pondok

Fitur **Impor Cerdas Jadwal** memungkinkan Mudir atau Admin memasukkan jadwal mingguan pesantren (ratusan baris) dalam hitungan detik secara otomatis.

### A. Lokasi Akses
- Dari menu **Akademik** $\rightarrow$ klik tombol **⚡ Impor Cerdas Jadwal** (di sub-tab *Jadwal KBM* atau *Kurikulum*).
- Atau dari menu **Jadwal KBM** $\rightarrow$ klik tombol **⚡ Impor Cerdas Jadwal & Kurikulum**.

### B. Format & Fleksibilitas Input
1. **Header-Agnostic & Multi-Delimiter**:
   - Mendukung format file `.csv`, `.tsv`, `.txt`, atau salinan langsung (*copy-paste*) dari Microsoft Excel / Google Sheets.
   - Otomatis mengenali pemisah kolom berupa Tab, Titik Koma (`;`), maupun Koma (`,`).
   - Otomatis mencocokkan nama kolom yang beragam, seperti:
     - `schedule_id`, `id`, `kode_jadwal`
     - `kelas`, `tingkat`, `level`, `grade`, `rombel`
     - `kelompok`, `gender`, `ikhwan_akhwat`
     - `hari`, `day`, `hari_belajar`
     - `waktu`, `jam`, `jam_pelajaran`, `period`
     - `mata_pelajaran`, `mapel`, `subject`, `pelajaran`
     - `pengajar`, `guru`, `ustadz`, `teacher_id`
2. **Pengisian Cepat Data Riil**:
   - Tersedia tombol **"📋 Muat Data Riil Pondok Ini (342 Sesi)"** untuk langsung memuat seluruh 342 sesi KBM resmi pondok (Kelas 7 s/d 12, Ikhwan & Akhwat) tanpa perlu mengetik manual.

### C. Analisis Cerdas & Auto-Klasifikasi
Saat tombol **"🔍 Pratinjau Cerdas"** diklik, backend menjalankan:
- **Pengenalan Waktu Otomatis**: Mendeteksi format jam titik maupun titik dua (`07.00–07.40` atau `07:00 - 07:40`).
- **Pengelompokan Jenjang**: Mengelompokkan kelas santri ke dalam tingkat **Tsanawiyyah** (Kelas 7, 8, 9) dan **Aliyah** (Kelas 10, 11, 12).
- **Rekomendasi Kitab Standar**:
  - *Akidah*: Aqidatul Awam (Tsanawiyyah) / Jauharatut Tauhid (Aliyah)
  - *Fiqih*: Safinatun Najah (Tsanawiyyah) / Fathul Qorib (Aliyah)
  - *Nahwu*: Al-Ajurumiyyah (Tsanawiyyah) / Alfiyah Ibnu Malik (Aliyah)
  - *Shorof*: Amtsilatut Tashrifiyyah
  - *Hadits*: Al-Arba'in An-Nawawiyyah
  - *Tajwid*: Tuhfatul Athfal
  - *Siroh/Tarikh*: Khulashoh Nuril Yaqin
  - *Akhlak/Adab*: Taisirul Khalaq
  - *Tafsir*: Tafsir Jalalain
  - *Balaghah*: Jauharul Maknun
  - *Ushul Fiqih*: Al-Waraqat

### D. Eksekusi & Opsi Sinkronisasi
- **Bersihkan Jadwal KBM Lama**: Mengganti jadwal lama secara bersih dan mencegah jadwal usang tertinggal.
- **Sinkronkan Otomatis ke Setup Akademik & Raport**: Otomatis mendaftarkan mata pelajaran baru ke master sheet serta memperbarui pemetaan kitab di profil raport pondok.

---

## 3. Pengaturan Setup Raport & Identitas Lembaga

Dapat diakses melalui menu **Akademik** $\rightarrow$ tombol **Setup** $\rightarrow$ seksi **Setup Raport & Lembaga**.

### A. Live Preview Kop Surat Pesantren
Menampilkan pratinjau langsung kop surat resmi sesuai format F4:
- **Nama Yayasan**: Menampilkan nama yayasan penaung (default: `YAYASAN MIFTAHUL HUDA AL-BAROKAH`).
- **Nama Lembaga/Pondok**: Huruf kapital tebal (default: `RAUDHATUL ULUM`).
- **Kaligrafi Arab**: Teks Arab resmi lembaga (default: `معهد مفتاح الهدى البركة`).
- **Alamat & Kontak**: Alamat lengkap, nomor telepon/WhatsApp, dan No. Statistik Pesantren (NSPP/NPSN).

### B. Logo Resmi Lembaga & Proteksi Kuota Sel (Anti Limit 50.000 Karakter)
- Pengguna dapat mengunggah file logo resmi pondok (.png / .jpg / .webp).
- **Auto-Compressor**: Gambar otomatis dikompresi ke resolusi 120x120px dengan ukuran base64 ~10KB - 15KB (di bawah 20.000 karakter). Hal ini mencegah error batas sel Google Sheets 50.000 karakter.
- **Fallback Vektor Resmi**: Jika logo belum diunggah atau direset, sistem otomatis memakai lambang vektor resmi kubah masjid Islami warna hijau zamrud dan bintang emas yang tidak pernah buram atau pecah.

### C. Pejabat Penandatangan Riil
- **Pimpinan Pondok / Mudir**: Menggunakan akun riil Mudir pesantren (**Dede Nuriman, Lc.**).
- **Titimangsa Resmi**: Kota titimangsa resmi penerbitan raport (**Pemangkat**).

### D. Penugasan Wali Kelas per Kelas
- Pengaturan wali kelas riil untuk masing-masing jenjang: **KELAS 7**, **KELAS 8**, **KELAS 9**, **KELAS 10**, **KELAS 11**, **KELAS 12**.
- Dilengkapi fitur *autocomplete datalist* yang terhubung ke daftar nama Ustadz & Pengajar riil pada database pondok.

---

## 4. Panduan Mengedit Pemetaan Kitab Kuning Secara Manual

### A. Konsep Dasar
Pemetaan kitab diatur pada tabel/kartu **📖 Pemetaan Kitab Kuning per Mata Pelajaran**. Terdapat 2 tingkat pengaturan:
1. **Kitab Rujukan Utama (Semua Kelas)**: Standar umum yang berlaku otomatis untuk semua santri.
2. **Kitab Khusus Tingkat (Override per Jenjang)**: Digunakan jika ada jenjang tertentu yang mengkaji kitab berbeda.

### B. Langkah Edit Manual Kitab Rujukan Utama (Semua Kelas)
1. Pada baris **Pilih Tingkat**, pastikan tab **`[🏷️ Semua Kelas]`** aktif (warna hijau gelap).
2. Pada kartu mapel yang ingin diubah (misal: *Akidah*):
   - Klik kolom isian di bawah tulisan **"KITAB RUJUKAN UTAMA"**.
   - Ketikkan nama kitab yang diinginkan (contoh: `Aqidatul Awam`).
3. Nilai ini otomatis menjadi standar untuk seluruh santri semua kelas.

### C. Langkah Edit Manual Kitab Khusus Kelas (Override)
Jika jenjang tertentu memiliki rujukan kitab berbeda (contoh: *Kelas 10* mengkaji *Fathul Qorib*, sementara kelas lain *Safinatun Najah*):
1. Pada baris **Pilih Tingkat**, klik tombol kelas yang dituju, misal **`[🏫 KELAS 10]`**.
2. Kolom isian pada kartu akan berubah label menjadi:
   **"Nama Kitab Khusus KELAS 10"**.
3. Ketikkan nama kitab khususnya di kolom tersebut: `Fathul Qorib`.
4. Jika mapel lain pada kelas tersebut memakai kitab yang sama dengan rujukan umum, **kosongkan saja**. Sistem otomatis memakai kitab rujukan utama.

### D. Mengubah Batas Nilai KKM
- Pada pojok kanan atas setiap kartu terdapat input **KKM: `[ 70 ]`**.
- Anda dapat langsung mengetikkan angka KKM baru (contoh: `75`). Batas ini akan menjadi acuan ketuntasan santri pada lembar raport.

### E. Menambah Mata Pelajaran Baru Secara Manual
1. Di atas deretan kartu, isi formulir **Tambah Mapel Baru**:
   - Ketik nama mapel (contoh: `Mahfudzot` atau `Faroidh`).
   - Ketik nama kitab (contoh: `Mahfudzot Juz 1` atau `Matan Rahabiyyah`).
   - Pilih target kelas (*Semua Kelas* atau kelas tertentu).
2. Klik **`+ Tambah Mapel`**. Kartu baru akan langsung tersedia untuk diatur.

---

## 5. Mekanisme Penyimpanan Aman & Auto-Draft

Untuk kenyamanan pengisian yang seringkali memakan waktu:
1. **Auto-Draft di LocalStorage**:
   - Setiap ketikan atau perubahan otomatis tersimpan seketika di penyimpanan lokal browser perangkat (`santriAnalytics:raportSetupDraft`).
   - Jika tab browser tertutup, komputer restart, atau koneksi terputus, seluruh data isian otomatis pulih kembali saat halaman dibuka.
2. **Tombol Simpan Terdistribusi**:
   - Tombol **"💾 Simpan Seluruh Pengaturan Raport"** di bagian bawah halaman.
   - Tombol **Sticky Floating Save Pill** di tengah bawah layar yang selalu mengambang, memudahkan penyimpanan kapan saja tanpa harus menggulir ke bawah.

---

## 6. Prosedur Pencetakan Raport F4 Resmi

1. Buka menu **Akademik** $\rightarrow$ klik tombol **"📜 Cetak Raport Massal & Leger"**.
2. Pilih **Periode Raport** dan **Kelas** yang ingin dicetak.
3. Di toolbar atas pratinjau:
   - Pilih **Semua Santri 1 Kelas** (untuk cetak massal satu rombel sekaligus), atau
   - Pilih nama santri tertentu untuk cetak satuan (1 lembar).
4. Klik tombol **🖨️ Cetak Raport (PDF F4)**.
5. **Petunjuk Dialog Cetak Browser**:
   - Ukuran Kertas: Pilih **Folio / F4** (atau *Legal/A4* jika printer tidak memiliki profil F4).
   - Layout: **Portrait**.
   - Margin: **Default** atau **None**.
   - Opsi Lain: **Hapus centang (uncheck) "Headers and footers"** agar URL browser dan tanggal di pojok bawah tidak ikut tercetak.

---

## 7. Keamanan API & Whitelist Action Apps Script

Seluruh komunikasi frontend ke Google Apps Script backend melalui fungsi `callGoogleScript` dilindungi oleh security dispatcher di [Code.gs](file:///e:/PROJECTS/apps-script/Santri%20Analytics/Code.gs):

| Action Name | Fungsi Handler | Modul | Hak Akses Role |
| --- | --- | --- | --- |
| `importSmartSchedules` | `importSmartSchedules(payload, user)` | Schedules & Academic | Mudir, Admin |
| `getRaportSetup` | `getRaportSetup(user)` | Academic | Mudir, Admin, Ustadz |
| `saveRaportSetup` | `saveRaportSetup(payload, user)` | Academic | Mudir, Admin |
| `getBulkClassReportData` | `getBulkClassReportData(periodId, classId, user)` | Academic | Mudir, Admin, Ustadz |
| `getClassLegerNilai` | `getClassLegerNilai(periodId, classId, user)` | Academic | Mudir, Admin, Ustadz |

Tindakan keamanan:
- Seluruh action wajib terdaftar di array `isExternalActionAllowed_`.
- Action yang bersifat mandiri pada host terdaftar di `PRODUCT_isWrapperOnlyAction_`.
- Action yang memodifikasi data dilindungi oleh verifikasi session token `requireSessionUser_`.
