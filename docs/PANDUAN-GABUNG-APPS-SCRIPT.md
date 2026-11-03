# Panduan menggabungkan project dengan Google Apps Script

Panduan ini memasang panel admin dan API untuk situs publik GitHub Pages.

## 1. Siapkan Google Sheets

1. Buat Google Spreadsheet baru dengan nama `NUR BIRDFARM Database`.
2. Salin ID spreadsheet dari URL: bagian di antara `/d/` dan `/edit`.
3. Buka **Extensions → Apps Script**.
4. Di `Project Settings`, aktifkan tampilan `Show "appsscript.json" manifest file` bila ingin mengatur zona waktu.
5. Buat file `Code.gs`, lalu salin seluruh isi `apps-script/Code.gs`.
6. Buat file HTML bernama `Admin` (Apps Script akan menamainya `Admin.html`), lalu salin `apps-script/Admin.html`.
7. Buat file HTML bernama `Admin.css`, lalu salin `apps-script/Admin.css.html`.
8. Buat file HTML bernama `Admin.js`, lalu salin `apps-script/Admin.js.html`.

## 2. Isi konfigurasi Apps Script

Di bagian atas `Code.gs`, isi:
- `SPREADSHEET_ID`: ID spreadsheet.
- `ADMIN_PIN`: PIN awal yang hanya diketahui pemilik/admin. Ganti sebelum deployment.

Simpan project. Jalankan `setupProject()` dari dropdown fungsi. Google akan meminta izin akses Sheets dan Drive. Tinjau izin lalu izinkan. Fungsi ini membuat header, folder media, pengaturan awal, dan akun admin untuk email Google yang menjalankan setup.

**Penting:** PIN awal adalah mekanisme sederhana, bukan sistem autentikasi berkelas enterprise. Gunakan PIN panjang yang tidak mudah ditebak, jangan menyematkan PIN di situs publik, dan jangan membagikan URL admin. Batasi akses deployment bila memungkinkan.

## 3. Deploy Apps Script sebagai Web App

1. Klik **Deploy → New deployment**.
2. Pilih tipe **Web app**.
3. `Execute as`: **Me**.
4. `Who has access`: **Anyone** untuk endpoint katalog publik. Endpoint tulis/admin tetap memerlukan PIN.
5. Klik **Deploy**, selesaikan otorisasi.
6. Salin URL Web App yang berakhiran `/exec`.

URL tersebut akan dipakai dua tempat:
- Situs publik: `public/js/config.js` pada `API_URL`.
- Panel admin: buka URL `/exec?admin=1`.

Jangan gunakan URL `/dev` untuk situs yang sudah dipublikasikan.

## 4. Hubungkan situs GitHub Pages

1. Buka `public/js/config.js`.
2. Isi `API_URL` dengan URL `/exec` hasil deployment.
3. Isi `WHATSAPP_NUMBER` dengan nomor bisnis, format angka internasional tanpa tanda `+`.
4. Sesuaikan nama peternakan dan tautan sosial.
5. Upload seluruh isi folder `public/` ke repository GitHub.
6. Buka **Settings → Pages**, pilih branch dan folder root yang berisi `index.html`.
7. Tunggu proses publikasi, lalu buka alamat GitHub Pages.

Situs akan mengambil data JSON dari Apps Script. Jika API belum diisi, situs menampilkan data demo lokal agar desain dapat diperiksa.

## 5. Masuk ke panel admin

1. Buka URL Web App dengan parameter `?admin=1`.
2. Masukkan PIN awal yang ditentukan di `Code.gs`.
3. Setelah berhasil masuk, gunakan menu Produk, Artikel, Galeri, Testimoni, dan Pengaturan.
4. Untuk produk, isi kategori, nama, harga, status, deskripsi, serta media bila ada.
5. Klik Simpan. Data masuk ke Google Sheets dan media masuk ke Google Drive.

## 6. Perubahan kode dan deployment baru

- Perubahan pada file HTML/CSS/JS Apps Script: klik **Deploy → Manage deployments → Edit → New version → Deploy**.
- Perubahan pada situs GitHub Pages: commit dan push file pada folder `public/`.
- Jika hanya mengubah data produk, tidak perlu deploy ulang.

## 7. Catatan operasional

- Isi data awal melalui panel admin; hapus data demo bila tidak ingin menampilkannya.
- Harga disimpan sebagai angka rupiah tanpa pemisah.
- Foto/video/audio bersifat opsional per produk. Batas upload awal di panel adalah 8 MB per file.
- Browser menyimpan cache katalog selama 3 menit. Perubahan data mungkin tidak langsung terlihat pada perangkat yang masih memakai cache; muat ulang paksa bila perlu.
- Untuk katalog ratusan item, pola ini memadai sebagai awal. Apps Script memiliki kuota dan batas eksekusi; hindari file media besar dan permintaan berulang.
- Jangan menyimpan data pelanggan atau informasi sensitif di endpoint publik.
