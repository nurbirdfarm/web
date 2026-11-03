# Struktur Google Sheets

Jalankan fungsi `setupProject()` sekali dari editor Apps Script. Fungsi ini membuat sheet dan header bila belum tersedia.

| Sheet | Kolom |
|---|---|
| Products | id, category, name, species, sex, age, type, price, status, featured, description, parentage, photoIds, videoUrl, audioUrl, createdAt, updatedAt |
| Articles | id, title, excerpt, content, coverId, published, createdAt, updatedAt |
| Gallery | id, title, mediaType, fileId, url, createdAt |
| Testimonials | id, customer, quote, published, createdAt |
| Settings | key, value |
| Admins | email, pinHash, active |

Kategori produk yang dipakai: `kenari`, `burung-lain`, `kandang`, `pakan`, `perlengkapan`.
Status stok: `Tersedia`, `Terjual`, `Inden`.

`photoIds` disimpan sebagai daftar ID file Drive yang dipisahkan koma. Folder upload dibuat otomatis oleh Apps Script. Untuk akses gambar publik, file upload diatur dapat dilihat oleh siapa pun yang memiliki tautan. Jangan unggah dokumen pribadi ke folder media.
