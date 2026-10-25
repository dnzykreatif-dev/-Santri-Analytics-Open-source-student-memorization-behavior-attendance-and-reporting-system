# Rencana Inti Aplikasi Bersama

Dokumen ini menjelaskan cara Santri Analytics dikembangkan menjadi satu inti
aplikasi dengan data terpisah untuk setiap pondok.

## Model

- Satu pondok memiliki Spreadsheet sendiri.
- Satu pondok memiliki project Apps Script/deployment sendiri.
- Kode inti dibagikan melalui Apps Script Library yang versinya dikunci.
- Pengaturan pondok tetap berada di project pondok melalui Script Properties.
- Update tidak berjalan diam-diam; Admin/Mudir menyetujui versi baru.

## Tahap Yang Sudah Dibuat

Setiap instalasi sekarang memiliki kontrak release di `ReleaseManagement.gs`:

- `wrapperVersion`: versi penghubung milik pondok;
- `localCoreVersion`: versi kode inti lokal;
- `CORE_LIBRARY_ID`: identitas library bersama;
- `CORE_LIBRARY_VERSION`: versi library yang dipakai;
- `CORE_UPDATE_CHANNEL`: `test`, `canary`, atau `stable`;
- `updatePolicy`: `approval_required`.

Statusnya dapat dibaca oleh Admin/Mudir melalui `getAppReleaseStatus()` dan
ditampilkan pada menu `Setup Pondok`.

Panggilan dari helper utama browser sekarang melewati `runAppAction()`. Saat
`CORE_LIBRARY_ENABLED=off`, fungsi ini memanggil kode lokal seperti sebelumnya.
Saat `CORE_LIBRARY_ENABLED=on`, fungsi ini mengirim action dan argumen ke
library dengan identifier `SantriCore`. Karena itu perpindahan dapat dilakukan
per modul tanpa mematikan instalasi lama.

Wrapper mengirim `spreadsheetId`, template raport, dan pengaturan rollout ke
library melalui konteks satu permintaan. Library tidak membaca ID database
penjual dan tidak menyimpan ID pondok di source code.

## Urutan Migrasi Inti

1. Bekukan kontrak fungsi backend yang dipakai browser.
2. Pindahkan helper umum, autentikasi, validasi akses, konfigurasi, dan audit
   ke project library terpisah.
3. Implementasikan `SantriCore.runAction(action, args)` pada library.
4. Tambahkan wrapper tipis pada project pondok.
5. Jalankan library dalam instalasi staging dengan data uji.
6. Uji Admin, Mudir, Ustadz, dan Wali.
7. Rilis versi `test`, lalu `canary`, lalu `stable`.
8. Simpan versi library sebelumnya untuk rollback.
9. Migrasikan modul absensi, akademik, raport, dan modul lain secara bertahap.

## Aturan Keamanan

- Library tidak boleh menyimpan data santri atau ID Spreadsheet pelanggan.
- Library menerima identitas pondok dari wrapper yang sedang menjalankan kode.
- Data dan Script Properties pelanggan tidak dipindahkan ke project penjual.
- Versi library harus dikunci; jangan memakai versi `HEAD` untuk produksi.
- Setiap update harus diuji pada staging dan memiliki versi rollback.

## Batasan Saat Ini

Kode aplikasi utama masih berjalan lokal di setiap project. Kontrak release yang
sekarang adalah fondasi dan indikator kesiapan, bukan berarti seluruh modul
sudah memakai library bersama. Pemindahan modul dilakukan setelah kontrak dan
pengujian wrapper selesai agar aplikasi produksi tetap aman.

Repository ini juga memiliki source package `core-library`. Folder tersebut
tidak ikut dikirim oleh deployment web app utama. Project Apps Script library
terpisah harus dibuat untuk package ini, lalu Script ID-nya dicatat sebagai
`CORE_LIBRARY_ID` sebelum `CORE_LIBRARY_ENABLED` boleh diubah menjadi `on`.

## Konfigurasi dari aplikasi

Setelah dependency library dipasang pada project pondok, Admin/Mudir dapat
mengisi bagian `Update Inti Aplikasi` di menu `Setup Pondok`:

- `ID Library Apps Script`: ID project library inti;
- `Nomor versi`: nomor versi Apps Script yang sudah dipublikasikan;
- `Saluran update`: `test`, `canary`, atau `stable`;
- `Status library`: `off` atau `on`.

Status awal harus tetap `off`. Jika library belum dipasang sebagai dependency,
jangan mengubah status menjadi `on` karena aplikasi akan gagal memanggil inti
bersama. Setiap penyimpanan konfigurasi dicatat ke `AuditLogs`.

## Cara merilis versi baru

1. Jalankan build package library dari repository.
2. Uji package dengan data staging.
3. Buat versi baru di project Apps Script library.
4. Pasang versi tersebut pada satu project staging pondok.
5. Set saluran `test`, lalu `canary` untuk akun terbatas.
6. Setelah lulus, gunakan nomor versi yang sama pada instalasi produksi.
7. Simpan nomor versi lama untuk rollback.

Pembaruan library tidak otomatis mengubah Spreadsheet atau data pondok. Setiap
instalasi tetap dapat memilih kapan menerima versi baru.

## Perintah pembaruan dengan clasp

Kode tidak ditempel satu per satu ke editor Apps Script. Folder `core-library`
memiliki file `.clasp.json` yang menunjuk ke project Library staging. Perintah
berikut dijalankan dari folder tersebut:

```powershell
cd core-library
clasp push --force
clasp version "SantriCore staging v2"
clasp deploy --versionNumber 2 --description "SantriCore staging v2"
```

Nomor versi disesuaikan dengan nomor yang dibuat Apps Script. Setelah versi
lulus uji, nomor itu dipasang sebagai dependency pada Template Apps Script dan
project pondok. Produksi tidak boleh memakai `clasp push` dari folder utama;
folder utama tetap menyimpan target deployment produksi sebagai titik aman.
