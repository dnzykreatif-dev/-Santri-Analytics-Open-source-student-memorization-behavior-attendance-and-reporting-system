# Santri Analytics Core Library

Ini adalah source package untuk library inti bersama. Library menerima konteks
pondok dari project wrapper pada setiap aksi:

```javascript
SantriCore.runAction(action, args, {
  spreadsheetId: "Spreadsheet milik pondok",
  reportTemplateId: "Template raport milik pondok",
  properties: {
    INSTALLATION_MODE: "tenant",
    TENANT_ID: "kode-pondok",
    REPORT_V2_ROLLOUT: "off",
    REPORT_V2_CANARY_USERS: "",
  },
});
```

Jangan menyimpan ID Spreadsheet pondok atau password di source library.
Project library harus dibuat dan dikelola dari akun pengembang, lalu setiap
project pondok memasangnya sebagai dependency dengan versi tertentu. Versi
`HEAD` tidak boleh dipakai untuk produksi.

## Build

Jalankan `tools/build_core_library.ps1` dari root repository. Script tersebut
menyalin file backend `.gs` yang diperlukan ke folder ini dan mempertahankan
`CoreHost.gs` sebagai adapter konfigurasi.
