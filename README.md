Struktur folder dibuat berdasarkan file sumber yang diunggah.
Isi file berupa placeholder awal agar setiap file mudah dikenali.
Anda memberikan 43 file kode yang terpisah. Berikut adalah daftar file dan isi singkatnya:

Code.gs (Fragment 1 dari 43)
Ini adalah bagian dari file Code.gs yang berisi fungsi-fungsi untuk mencatat dan mengambil data kehadiran santri (logAttendance, getStudentAttendance).

Code.gs (Fragment 2 dari 43)
Bagian lain dari Code.gs ini berisi fungsi login dan registerUser (juga createAccount) untuk manajemen autentikasi pengguna, termasuk pengecekan username duplikat, pembuatan UserID, dan hashing password dengan salt.

Code.gs (Fragment 3 dari 43)
Fragment ini berisi fungsi doGet untuk melayani halaman web utama. Juga ada fungsi helper runParentContactConversion dan runCompleteSetup yang memerlukan otorisasi Mudir/Admin. Kemudian ada fungsi untuk mendapatkan laporan santri lengkap (getFullStudentReport), dan beberapa fungsi helper untuk mendapatkan daftar santri, log hafalan, dan log insiden. Bagian akhir dari fragment ini adalah modul lengkap untuk fitur "Pulang Bulanan" dengan berbagai fungsi helper (PB*getSpreadsheet*, PB*getOrCreateSheet*, PB*sheetToObjects*, dll.), fungsi CRUD (getPulangBulananLogs, savePulangBulanan, updatePulangBulanan, deletePulangBulanan), dan fungsi summary (getPulangBulananSummary).

Config.gs
File ini mendefinisikan SPREADSHEET_ID dan REPORT_TEMPLATE_ID.

Code.gs (Fragment 4 dari 43)
Ini adalah bagian dari Code.gs yang berisi fungsi getDashboardSummary untuk mengambil ringkasan data dashboard, termasuk logika filter tanggal, penggabungan data hafalan dan absensi, serta identifikasi santri yang perlu perhatian khusus.

Code.gs (Fragment 5 dari 43)
Fragment ini berisi fungsi-fungsi helper umum seperti getSpreadsheet*, getSheet*, serializeRow, normalizeSheetData, findRowIndexById\_, dan hashPassword.

Head.html
File ini berisi tag meta HTML dan referensi CDN untuk Tailwind CSS, Chart.js, dan font Inter.

Code.gs (Fragment 6 dari 43)
Bagian dari Code.gs ini berisi fungsi-fungsi untuk mencatat, memperbarui, menghapus, dan mengambil data insiden (perilaku) santri (getDailyStats, logIncident, updateIncident, deleteIncident, getRecentIncidents, getStudentIncidents).

Index.html
Ini adalah file HTML utama yang mengintegrasikan berbagai layout dan modal menggunakan Alpine.js, termasuk kondisi login/register dan toast notification.

JS_App.html
File ini berisi kode JavaScript Alpine.js utama untuk aplikasi, termasuk manajemen state, fungsi helper (callGoogleScript, showToast, resetForm), aksi autentikasi, pengambilan data, aksi CRUD untuk santri, hafalan, kehadiran, insiden, laporan, manajemen user, dan fitur Pulang Bulanan.

JS_Data.html
File ini mendefinisikan konstanta JavaScript INCIDENT_CATEGORIES yang digunakan untuk data statis kategori insiden.

Layout_Header.html
File ini berisi markup HTML untuk header aplikasi, menampilkan nama pengguna dan peran, serta tombol logout.

Layout_Login.html
File ini berisi markup HTML untuk form login.

Layout_NavDesktop.html
File ini berisi markup HTML untuk navigasi desktop, menampilkan tombol tab berdasarkan peran pengguna.

Layout_NavMobile.html
File ini berisi markup HTML untuk navigasi bawah (bottom navigation) yang responsif untuk tampilan mobile, juga dengan tombol tab berdasarkan peran pengguna.

Layout_Register.html
File ini berisi markup HTML untuk form registrasi akun Wali Santri.

Layout_Toast.html
File ini berisi markup HTML untuk komponen toast notification yang ditampilkan di bagian bawah layar.

Code.gs (Fragment 7 dari 43)
Bagian dari Code.gs ini berisi fungsi-fungsi CRUD untuk tautan hafalan santri (getStudentLinks, addHafalanLink, updateHafalanLink, deleteHafalanLink).

Code.gs (Fragment 8 dari 43)
Bagian dari Code.gs ini berisi fungsi-fungsi CRUD untuk log hafalan santri (logMemorization, updateMemorization, deleteMemorization, getMemorizationHistory).

Modal_AddStudent.html
File ini berisi markup HTML untuk modal (pop-up) yang digunakan untuk menambahkan data santri baru.

Modal_Detail_Grafik.html
File ini berisi markup HTML untuk konten tab "Grafik" di modal detail santri, menampilkan grafik hafalan dan perilaku.

Modal_Detail_Hafalan.html
File ini berisi markup HTML untuk konten tab "Hafalan" di modal detail santri, termasuk form input hafalan dan riwayat hafalan.

Modal_Detail_Laporan.html
File ini berisi markup HTML untuk konten tab "Laporan" di modal detail santri, memungkinkan pembuatan PDF dan pengiriman laporan via WhatsApp/Email.

Modal_Detail_Links.html
File ini berisi markup HTML untuk konten tab "Link Live" di modal detail santri, termasuk form input link dan daftar link yang tersimpan.

Modal_Detail_Perilaku.html
File ini berisi markup HTML untuk konten tab "Catatan Perilaku" di modal detail santri, termasuk form input insiden dan rekam jejak perilaku.

Modal_Detail_Raport.html
File ini berisi markup HTML untuk konten tab "Raport" di modal detail santri, menampilkan ringkasan raport digital dan tombol cetak.

Modal_StudentDetail.html
File ini berisi markup HTML untuk modal utama yang menampilkan detail santri, termasuk header, tab navigasi, dan area konten untuk setiap tab detail.

Code.gs (Fragment 9 dari 43)
Bagian dari Code.gs ini berisi fungsi generateStudentReportPdf untuk membuat laporan PDF dari template Google Docs, getStudentFullReport (yang tampaknya tidak digunakan atau digantikan oleh getStudentReportData di fragment lain), dan sendReportToEmail.

Code.gs (Fragment 10 dari 43)
Bagian dari Code.gs ini berisi fungsi-fungsi untuk setup awal sheet Users (setupUsersSheet), inisialisasi aplikasi (initializeApp), setup lengkap aplikasi termasuk konversi kontak orang tua ke user Wali (setupCompleteApp, convertParentContactsToUsers), dan fungsi testUserManagement.

Code.gs (Fragment 11 dari 43)
Bagian dari Code.gs ini berisi fungsi getStudents (termasuk logika filter berdasarkan peran dan perhitungan skor perilaku), addStudent (yang juga mendaftarkan user Wali), updateStudentNote, getStudentDetailData, getStudentAnalytics untuk data grafik, dan getStudentReportData untuk data raport.

Style.html
File ini berisi gaya CSS kustom untuk aplikasi, termasuk gaya Bento UI, scrollbar, navigasi aktif, dan animasi skeleton loading.

Tab_Dashboard.html
File ini berisi markup HTML untuk tab dashboard, menampilkan filter tanggal, ringkasan statistik, daftar santri yang perlu perhatian, serta log hafalan dan insiden terbaru.

Tab_Hafalan.html
File ini berisi markup HTML untuk tab "Input Aktivitas Santri", dengan toggle antara form input hafalan dan form input keterangan (sakit/izin/alpha), serta daftar 5 aktivitas terakhir.

Tab_LinkLive.html
File ini berisi markup HTML untuk tab "Link Live Hafalan Santri", termasuk form untuk menambah/mengedit link dan daftar link yang tersimpan.

Tab_PanduanUstadz.html
File ini berisi markup HTML untuk tab "Panduan Ustadz", menjelaskan aturan pencatatan pelanggaran dan prestasi.

Tab_PanduanWali.html
File ini berisi markup HTML untuk tab "Panduan Wali Santri", menjelaskan cara memantau perkembangan, membaca laporan, dan kerjasama pembinaan.

Tab_PerilakuInput.html
File ini berisi markup HTML untuk tab "Input Catatan Perilaku", termasuk form input dan tombol cepat untuk insiden umum, serta daftar evaluasi perilaku terbaru.

Tab_PerilakuList.html
File ini berisi markup HTML untuk tab "Daftar Kasus Perilaku", menampilkan daftar insiden terbaru dan tombol untuk menambah catatan baru.

Tab_PulangBulanan.html
File ini berisi markup HTML untuk tab "Pulang Bulanan", menampilkan header, filter, ringkasan statistik pulang bulanan, tabel log pulang bulanan, dan modal form untuk mencatat/mengedit data pulang bulanan.

Tab_Students.html
File ini berisi markup HTML untuk tab "Daftar Santri", termasuk fitur pencarian dan filter kelas, daftar santri dalam tampilan kartu (mobile) dan tabel (desktop), serta tombol untuk menambah santri.

Tab_Users.html
File ini berisi markup HTML untuk tab "Manajemen User", termasuk header, tombol konversi kontak parent dan tambah user, filter dan pencarian user, tabel daftar user, ringkasan statistik user, dan modal form untuk menambah/mengedit user.

Code.gs (Fragment 12 dari 43)
Bagian dari Code.gs ini berisi fungsi-fungsi CRUD untuk manajemen user (getUsers, addUser, updateUser, deleteUser), fungsi hashPasswordWithSalt untuk keamanan password, dan loginWithSalt untuk proses login yang lebih aman.

Untuk mempercantik tampilan UI, warna, tombol, dan animasi:
Style.html (File 32): Untuk menambahkan CSS kustom, animasi global, gaya scrollbar, atau mendefinisikan kelas utilitas baru seperti .nav-active.
File-file HTML parsial (Contoh: Layout_Header.html, Tab_Dashboard.html, Modal_AddStudent.html): Di sinilah Anda akan mengubah atau menambahkan kelas-kelas Tailwind CSS (misalnya bg-blue-500, text-white, rounded-xl, shadow-sm, hover:bg-red-100, transition-all, animate-pulse) pada elemen-elemen HTML seperti div, button, input, dan p untuk mengontrol warna, bentuk, bayangan, dan efek hover/animasi.
