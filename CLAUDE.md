# Tempera (tempera.id) — konteks proyek

Pemilik: Anwar Alzazali. Bahasa: Indonesia. Jawaban singkat. Jangan buat file catatan tambahan selain file ini.
Tempera = sewa mobil + sopir dan private trip Bandung (Lembang, Dago, Ciwidey, Pangalengan). Nama Tempera milik komunitas driver.

## Aturan kerja (wajib)
- Jangan minta rahasia (token Fonnte/Telegram, API key, Midtrans, passphrase). Rahasia hanya di Supabase Secrets / Cloudflare Variables, TIDAK di repo.
- Setiap kali pemilik harus mengerjakan sesuatu sendiri (jalankan SQL, deploy fungsi), kirim berkasnya dengan SendUserFile bersama langkah pasangnya.
- Jangan sentuh repo lain (kamiku/Akadia, TEMPERA---teman-perjalanan, backup-tempera) kecuali diminta jelas.
- Kerjakan per tahap, uji, kirim sekaligus; hindari bolak-balik revisi kecil.
- Push ke `main` = deploy ke Cloudflare Pages (situs langsung berubah). Uji dulu; perubahan besar lewat cabang.

## Struktur
- Situs publik statis: `index.html`, `js/main.js` (destinasi, armada, Trip Custom `TC_JARAK` berisi jarak perkiraan), `css/`.
- Panel admin: `panel.html` + `panel/*.js` (urut nomor: 00_dasar, 10_login_nav, 20_pesanan, 30_laporan_kas, 40_crud, 50_persetujuan_pengaturan, 60_wa_mitra, 70_qr_ulasan, 80_kas_iuran, 90_blok125, 99_mulai; plus analitik, destinasi, kode_unik, pengumuman, rapi).
- Halaman lain: `mitra.html` (portal driver/mitra, stiker QR dibuat di browser), `invoice.html`, `surat-jalan.html`, `kartu*.html`, `kas-bayar.html`, `verifikasi.html`, `ulasan.html`, `galeri.html`, `driver/`, `r/`.
- Backend: Supabase proyek `wjmotidelqgcyyujacud` (jangan tertukar dengan proyek kamiku/Akadia). Fungsi Edge (nama = URL): create-order, midtrans-webhook, bayar-manual, wa-masuk, tg-masuk (bot Telegram pertama: balas pelanggan, tombol AI, tombol bayar), tg-asisten + bot-admin (bot Telegram kedua "Tempera Asisten"), wa-driver-tugas, kirim-invoice, kirim-pengingat, get-invoice, get-surat-jalan, get-driver-card, verifikasi, ulasan, driver-auth, driver-dashboard, ongkir, ongkir-diag, bayar, bayar-notif, notif-status, draf-admin, create/confirm-kas-payment, health.

## Aturan data penting
- `drivers`: kode ID `TMP-0NN` dibuat trigger; slug = lower(kode ID) otomatis. Pesanan memakai slug (`assigned_driver`, `driver_slug`). Nomor WA pelanggan di `orders.customer_wa` berformat 62..., nomor driver `drivers.phone` berformat 08....
- Pesanan: `TRIP-<ms>` (dari situs) dan `MAN-<ms>` (Trip custom buatan admin, `source='manual'`). WA tugas otomatis ke driver (`wa-driver-tugas`) hanya menerima order_id `TRIP-`, jadi pesanan `MAN-` dikirim lewat bot atau tombol panel.
- Pembayaran sekarang MANUAL (`app_settings.payment_gateway='manual'`): kode unik di nominal, admin menandai bayar lewat tombol Telegram (`bayar-manual`). Midtrans belum dipakai.
- Invoice dan surat jalan terbit otomatis oleh trigger bila status bayar (dp_paid/paid/confirmed) dan driver terisi.

## Bot Telegram
- Bot 1 (secrets TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_WEBHOOK_SECRET): notifikasi pesanan/pelanggan, Reply = balas pelanggan lewat WA, tombol AI diam/aktif, tombol "Pembayaran sudah masuk".
- Bot 2 `@tempera_asisten_bot` (secret TELEGRAM_BOT_TOKEN_ASISTEN; rahasia webhook diturunkan dari token, pasang lewat `tg-asisten?pasang=1`): asisten admin berbasis Claude Haiku (ANTHROPIC_API_KEY). Alat: ringkasan, cari_pesanan, daftar_driver, qr_driver, buat_trip_custom (lalu tombol kirim invoice ke pelanggan dan tugas ke driver), ubah_driver_aktif, tambah_driver, lihat/tambah_catatan_ai. Aksi ubah selalu minta konfirmasi tombol, dicatat di tabel `bot_aksi`. Hanya akun TELEGRAM_CHAT_ID yang dilayani. Belum ada ingatan antarpesan.
- Rencana bot: modul Akadia (RPC admin sudah ada), notifikasi gabungan, ingatan percakapan, perintah suara (butuh layanan speech-to-text), QR berlogo/stiker, ubah status pesanan, alihkan driver.

## Status dan tertunda
- Google Maps/Cloud billing ditolak (kasus #76675818): kalkulator rute Trip Custom belum memakai peta; alternatif OSM/OpenRouteService belum dikerjakan. `TC_JARAK` masih perkiraan.
- Verifikasi iPaymu menunggu.
- Pemantau Tempera: Worker `tempera-pengingat` di Cloudflare (tidak terhubung repo); cron `*/10` dan `0 0` tidak jalan; rencana Worker baru `pantau-tempera`. Workflow GitHub "Pantau Tempera" jangan di-Disable dulu.
- Panel "tambah driver" tidak lagi meminta slug (commit d1b0362); uji tambah driver di panel belum dikonfirmasi pemilik.

## Foto tugas driver (selesai 22 Okt 2026, digabung ke main)
Tab "Foto" di mitra.html (redup, aktif hanya saat ada tugas dalam jam foto). Tombol Ambil foto membuka kamera bawaan HP (input capture); foto harus baru (lastModified < 3 menit, bukan galeri), lokasi dibaca lewat watchPosition (maks 50 dtk), alamat dari OpenStreetMap Nominatim (zoom 18, tanpa Google), stempel digambar di canvas: logo emas + TEMPERA + tagline, jam besar, tanggal+hari, alamat, Kode Foto 12 karakter. Backend (Supabase Tempera): tabel `trip_foto` (order_id, nomor 1-5 unique, driver_slug, path, diambil_pada, lokasi, lat/lng/akurasi, kode), bucket PRIVAT `trip-foto` (jpeg maks 800 KB, path `<orders.id>/<nomor>.jpg`), Edge Function `driver-foto` (aksi status/unggah; verify_jwt on, sesi mitra dicek seperti driver-dashboard). Aturan di server: hanya driver yang ditugaskan (assigned_driver) pada pesanan berbayar; jendela = 1 jam sebelum jemput s.d. jemput + durasi (dari nama armada "12 Jam", bawaan 12 jam) + 1 jam; maks 5 foto per pesanan; jam HP harus selisih <= 10 menit dari server. Belum ada: layar foto di panel admin atau tombol bot (sementara lihat lewat Supabase Storage), daftar foto di sisi driver, kamera langsung di halaman dengan stempel saat membidik (ditunda, kamera bawaan lebih andal). Pesanan uji `Uji Anwar` (INV-2610-0004, MAN-) harus dibatalkan di panel setelah uji. Trip custom memakai durasi bawaan 12 jam untuk jendela foto.
