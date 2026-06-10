# UI/UX Upgrade Plan

## Referensi

Referensi utama: `E:\PROJECTS\apps-script\Aplikasi TPQ anak`

Area yang sudah dipelajari dari referensi:

- `Index.html`: struktur app shell, boot loading, global loading overlay, page content.
- `PartialLogin.html`: login dua tahap berbasis role.
- `PartialStyles.html`: token style, komponen dasar, mobile responsive rules.
- `PartialSidebar.html`: sidebar desktop role-aware.
- `PartialBottomNav.html`: bottom navigation mobile dengan menu More.
- `PartialTopbar.html`: topbar compact.
- `PageDashboard.html`: dashboard hero, KPI carousel mobile, KPI grid desktop.
- `PageSantri.html`: pola table desktop dan card list mobile.
- `ScriptApp.html`: state login, nav config, helper mobile nav, loading states.

## Tujuan

Meningkatkan UI/UX Santri Analytics tanpa mengganggu stabilitas fitur yang sudah diperbaiki.

Target akhir:

- Login lebih ramah HP dan desktop.
- Navigasi lebih modern dan role-aware.
- Dashboard lebih mudah dibaca.
- List/form lebih nyaman dipakai di mobile.
- Loading, empty state, dan feedback lebih konsisten.
- Kontrak frontend-backend tetap stabil.

## Prinsip Implementasi

- Tidak copy mentah dari aplikasi TPQ; adopsi pola yang cocok dengan domain Santri Analytics.
- Tidak mengubah logic backend besar kecuali perlu adapter kecil.
- Tidak melakukan redesign besar dalam satu commit.
- Setiap tahap harus commit terpisah.
- Setiap tahap wajib minimal validasi:
  - Parse semua `.gs`.
  - Parse script `JS_App.html`.
  - `git diff --check`.
- Pertahankan response shape `{ ok, data, message }`.
- Pertahankan akses role:
  - Wali hanya melihat santri terkait.
  - Mudir/Admin punya manajemen user.
  - Ustadz fokus input/operasional.

## Tahap 1: Fondasi Style

Tujuan: membuat dasar visual konsisten tanpa mengubah layout besar.

Rencana:

- Tambahkan token CSS di `Style.html`:
  - warna utama,
  - warna status,
  - radius,
  - shadow,
  - spacing,
  - safe-area mobile.
- Tambahkan/rapikan komponen reusable:
  - `.app-card`,
  - `.app-btn`,
  - `.app-input`,
  - `.app-badge`,
  - `.app-empty-state`,
  - `.mobile-list-card`,
  - `.kpi-card`.
- Mapping style lama seperti `bento-card`, `card`, dan tombol lama agar tetap kompatibel.

Commit target:

`Add UI design tokens and shared components`

## Tahap 2: Upgrade Login

Tujuan: login lebih jelas untuk Mudir/Admin, Ustadz, dan Wali.

Rencana:

- Ubah `Layout_Login.html` menjadi login dua tahap:
  - pilih role,
  - input username/password.
- Role card:
  - Mudir/Admin,
  - Ustadz,
  - Wali.
- Untuk Wali:
  - label bisa diarahkan ke username/no HP sesuai data yang tersedia,
  - gunakan `inputmode="tel"` bila mode no HP dipakai.
- Tambahkan tombol kembali `Ganti role`.
- Pertahankan panggilan backend `login(username, password)`, kecuali perlu adapter ringan.
- Tambahkan loading state di tombol login.

Commit target:

`Upgrade role-based login experience`

## Tahap 3: App Shell Mobile/Desktop

Tujuan: navigasi lebih nyaman tanpa mengganti tab logic yang sudah ada.

Rencana:

- Desktop:
  - sidebar lebih stabil,
  - item nav berbasis role,
  - user info dan logout di sidebar.
- Mobile:
  - bottom navigation untuk tab utama,
  - tombol `More` untuk tab tambahan,
  - safe-area bottom padding.
- Topbar:
  - compact,
  - nama user dan role,
  - tombol menu mobile,
  - quick stat sederhana bila tersedia.
- Pertahankan `currentTab` agar kompatibel dengan struktur sekarang.

Commit target:

`Modernize app shell navigation`

## Tahap 4: Dashboard Refresh

Tujuan: dashboard lebih scannable untuk Mudir/Admin/Ustadz/Wali.

Rencana:

- Tambahkan hero greeting:
  - `Assalamu'alaikum, [nama]`.
- KPI:
  - mobile: horizontal carousel,
  - desktop: grid.
- Rapikan kartu:
  - total santri,
  - setoran hafalan,
  - catatan perilaku,
  - perhatian khusus.
- Pertahankan chart yang sudah ada.
- Pertahankan ringkasan list hafalan/perilaku yang sudah dibuat ringkas.

Commit target:

`Refresh dashboard layout`

## Tahap 5: List dan Form UX

Tujuan: halaman operasional lebih nyaman dipakai di HP.

Halaman prioritas:

- `Tab_Students.html`
- `Tab_Hafalan.html`
- `Tab_PerilakuInput.html`
- `Tab_PerilakuList.html`
- `Tab_PulangBulanan.html`
- `Tab_Users.html`
- `Tab_LinkLive.html`

Rencana:

- Desktop tetap table untuk data yang padat.
- Mobile gunakan card list.
- Filter di mobile dibuat stack vertikal.
- Tombol aksi diperbesar agar nyaman disentuh.
- Empty state dibuat konsisten.
- Tetap gunakan `Muat Lagi` yang sudah ditambahkan.

Commit target:

`Improve mobile list and form views`

## Tahap 6: Loading dan Feedback

Tujuan: Apps Script terasa lebih stabil saat load data.

Rencana:

- Boot loading screen saat inisialisasi.
- Global loading overlay untuk aksi berat.
- Top loading bar untuk refresh data.
- Toast lebih konsisten untuk sukses/error.
- Disabled state pada tombol saat proses.

Commit target:

`Polish loading and feedback states`

## Risiko dan Mitigasi

- Risiko: UI berubah terlalu banyak sekaligus.
  - Mitigasi: commit kecil per tahap.
- Risiko: binding Alpine rusak karena perubahan HTML.
  - Mitigasi: parse `JS_App.html`, cek string binding yang rawan kutip.
- Risiko: role Wali tidak sesuai pola login referensi.
  - Mitigasi: jangan ubah backend auth dulu; adaptasi frontend secara konservatif.
- Risiko: mobile layout overlap bottom nav.
  - Mitigasi: gunakan padding bottom dengan `env(safe-area-inset-bottom)`.

## Checklist Tiap Tahap

- [ ] Baca file yang terdampak.
- [ ] Edit hanya area terkait.
- [ ] Validasi parse `.gs`.
- [ ] Validasi parse `JS_App.html`.
- [ ] Jalankan `git diff --check`.
- [ ] Cek `git diff --stat`.
- [ ] Commit dengan pesan spesifik.

## Catatan Status Saat Dokumen Dibuat

Branch aktif: `codex/stabilize-santri-analytics`

Commit stabilisasi yang sudah ada:

- `bfa8d5a` - Stabilize app setup and behavior scoring
- `5f8e230` - Fix monthly leave CRUD
- `c60e633` - Condense behavior note lists
- `b1edcdb` - Condense dashboard behavior notes
- `2d83c4f` - Condense memorization lists
- `9740f37` - Condense long management lists

Tahap berikutnya yang disarankan:

1. Mulai dari `Tahap 1: Fondasi Style`.
2. Setelah aman, lanjut `Tahap 2: Upgrade Login`.
