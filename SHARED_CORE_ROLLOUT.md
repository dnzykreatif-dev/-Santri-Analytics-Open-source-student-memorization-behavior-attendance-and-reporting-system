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
