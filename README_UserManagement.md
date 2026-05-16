# Manajemen User untuk Mudir

## Fitur yang Ditambahkan

### 1. **CRUD User Management**

- **Tambah User**: Mudir/Admin dapat menambahkan user baru dengan data lengkap
- **Edit User**: Update informasi user termasuk password
- **Hapus User**: Hapus user dengan validasi (tidak bisa hapus akun sendiri)
- **Lihat User**: Tampilkan daftar semua user dengan filter dan pencarian

### 2. **Struktur Data User**

Menggunakan sheet "Users" dengan kolom:

- UserID (unik, auto-generated)
- Name (nama lengkap)
- Username (untuk login)
- Email
- Phone
- Role (Mudir, Admin, Ustadz, Wali)
- StudentID (jika role Wali)
- Class (jika role Ustadz)
- Salt & PasswordHash (keamanan password)
- Status (Active, Inactive, Suspended)
- CreatedAt, UpdatedAt, LastLogin

### 3. **Keamanan**

- Password di-hash dengan salt menggunakan SHA-256
- Akses terbatas hanya untuk role Mudir dan Admin
- Validasi input lengkap
- Tidak bisa menghapus akun sendiri

### 4. **UI/UX**

- Tab baru "Manajemen User" di navigasi (hanya tampil untuk Mudir/Admin)
- Tabel user dengan filter (role, status) dan pencarian
- Modal untuk tambah/edit user
- Statistik user (total, per role, active, recent)
- Responsif untuk desktop dan mobile

## File yang Ditambahkan/Dimodifikasi

### Backend (Google Apps Script)

1. **UserManagement.gs** - Fungsi CRUD user
   - `getUsers(currentUser)` - Ambil semua user
   - `addUser(userData, currentUser)` - Tambah user baru
   - `updateUser(userId, userData, currentUser)` - Update user
   - `deleteUser(userId, currentUser)` - Hapus user
   - `hashPasswordWithSalt(password, salt)` - Hash password dengan salt
   - `loginWithSalt(username, password)` - Login dengan sistem salt

2. **Auth.gs** - Diperbarui
   - `login()` - Menggunakan `loginWithSalt()`
   - `registerUser()` - Menggunakan struktur lengkap Users

3. **Setup.gs** - Setup sheet Users
   - `setupUsersSheet()` - Buat/update sheet Users
   - `initializeApp()` - Inisialisasi aplikasi
   - `testUserManagement()` - Fungsi testing

### Frontend (HTML/JavaScript)

1. **Tab_Users.html** - UI manajemen user
   - Tabel user dengan filter dan pencarian
   - Modal tambah/edit user
   - Statistik user

2. **JS_App.html** - Diperbarui
   - State untuk user management
   - Computed property `filteredUsers`
   - Fungsi `fetchUsers()`, `editUser()`, `submitUserForm()`, `deleteUser()`

3. **Index.html** - Include Tab_Users

4. **Layout_NavDesktop.html** - Tambah tombol "Manajemen User"

5. **Layout_NavMobile.html** - Tambah tombol "Users"

## Cara Penggunaan

### 1. Setup Awal

1. Deploy aplikasi ke Google Apps Script
2. Jalankan fungsi `initializeApp()` untuk membuat sheet Users
3. Login dengan user default:
   - Username: `mudir`
   - Password: `mudir123`

### 2. Menambahkan User Baru

1. Login sebagai Mudir atau Admin
2. Klik tab "Manajemen User"
3. Klik "Tambah User"
4. Isi form:
   - Nama lengkap
   - Username (unik)
   - Role (Mudir, Admin, Ustadz, Wali)
   - Password (minimal 6 karakter)
   - Data lainnya (opsional)
5. Klik "Simpan User"

### 3. Mengedit User

1. Di tabel user, klik ikon edit (pensil)
2. Update data yang diperlukan
3. Untuk ganti password, isi field password baru
4. Klik "Update User"

### 4. Menghapus User

1. Di tabel user, klik ikon hapus (tong sampah)
2. Konfirmasi penghapusan
3. User akan dihapus (kecuali akun sendiri)

## Validasi dan Keamanan

### Validasi Input

- Username harus unik
- Nama, Username, dan Role wajib diisi
- Password minimal 6 karakter (saat tambah user)
- Konfirmasi password harus cocok

### Keamanan Akses

- Hanya role Mudir dan Admin yang bisa akses
- Tidak bisa hapus akun sendiri
- Password di-hash dengan salt
- Data sensitif (salt, password hash) tidak ditampilkan di frontend

## Testing

Jalankan fungsi `testUserManagement()` untuk verifikasi:

1. Test getUsers (permission check)
2. Test addUser (create new user)
3. Test updateUser (modify user)
4. Test deleteUser (remove user)

## Catatan

1. **Migrasi Data**: User yang sudah ada akan tetap bisa login karena fungsi login sudah diupdate
2. **Default User**: User default "mudir" dibuat saat setup pertama kali
3. **Role Hierarchy**:
   - Mudir: Full access
   - Admin: Full access (kecuali mungkin beberapa fitur khusus)
   - Ustadz: Input hafalan, perilaku, link
   - Wali: Hanya lihat data santri yang diasuh

## Troubleshooting

### Issue: Tab "Manajemen User" tidak muncul

- Pastikan login sebagai Mudir atau Admin
- Cek role user di sheet Users

### Issue: Tidak bisa login

- Pastikan sheet Users sudah dibuat (jalankan `initializeApp()`)
- Cek username/password di sheet Users

### Issue: Error "Akses ditolak"

- Pastikan user memiliki role Mudir atau Admin
- Cek permission di fungsi `getUsers()`, `addUser()`, dll.

## Kontribusi

Fitur ini dikembangkan untuk memenuhi kebutuhan manajemen user di aplikasi Monitor Santri tanpa perlu mengubah kode secara manual. Semua operasi dapat dilakukan melalui webapp.
