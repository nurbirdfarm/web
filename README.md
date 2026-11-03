# NUR BIRDFARM — Project Website & Admin

Project ini mengikuti rancangan `Rancangan Website Peternak Burung (Fokus Kenari)`: situs publik statis untuk GitHub Pages, panel admin Google Apps Script, Google Sheets sebagai database, Google Drive untuk media, dan pemesanan melalui WhatsApp.

## Isi folder

- `public/` — situs katalog statis (HTML, CSS, JavaScript), cocok untuk GitHub Pages.
- `apps-script/Code.gs` — API JSON, CRUD, upload media, dan inisialisasi spreadsheet.
- `apps-script/Admin.html` — panel admin yang dijalankan sebagai Web App Apps Script.
- `apps-script/Admin.css.html` — stylesheet panel admin.
- `apps-script/Admin.js.html` — JavaScript panel admin.
- `docs/PANDUAN-GABUNG-APPS-SCRIPT.md` — langkah pemasangan dan penggabungan.
- `docs/STRUKTUR-SHEET.md` — struktur tabel Google Sheets.

## Sebelum dipakai

1. Buka `public/js/config.js`, ganti `WHATSAPP_NUMBER` dengan nomor WhatsApp bisnis format internasional tanpa `+` (contoh Indonesia: `62812xxxxxxx`).
2. Ganti teks identitas, alamat, dan tautan sosial di bagian pengaturan panel admin setelah spreadsheet diinisialisasi.
3. Ganti foto contoh di katalog dengan foto milik peternakan. Data contoh ditandai sebagai data demo.
4. Atur akses Web App Apps Script. Endpoint publik hanya membaca katalog dan pengaturan publik. Fungsi admin berjalan di halaman Web App dan dilindungi PIN yang disimpan di Script Properties.

## Menjalankan situs publik secara lokal

Buka folder `public/` dengan Live Server atau server statis lokal. Jangan membuka `index.html` langsung dari `file://` jika ingin menguji API karena browser dapat membatasi `fetch`.

## Deploy

Lihat `docs/PANDUAN-GABUNG-APPS-SCRIPT.md`. Jangan membagikan URL deployment admin kepada publik.
