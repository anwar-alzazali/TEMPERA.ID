/* [MAIN.JS] v8 (96) -- + bagian ulasan pelanggan. v7 (88): + label 'tinggal X unit' (sisa 1–3). v6: ketersediaan armada per tanggal. v4 -- tema 2 warna, bahasa Indonesia + Melayu, paket = template destinasi,
   Trip Custom, cuaca ikut waktu, termasuk/tidak termasuk, hero & media sosial dari panel. */

let WA_NUMBER = '6285196755972'; // nomor WA admin (ditimpa app_settings.admin_wa bila tersedia & publik)

/* ================================================================= *
 * BAHASA: Indonesia (id) + Melayu (ms). Teks statis di HTML memakai
 * data-i18n / data-i18n-html / data-i18n-ph / data-i18n-aria; teks yang
 * dibuat JS memakai t('kunci', {nilai}).
 * ================================================================= */
const I18N = {
id: {
  page_title: 'Tempera - Private Trip & Sewa Mobil Bandung | Teman Perjalanan',
  nav_home: 'Beranda', nav_weather: 'Cuaca Live', nav_dest: 'Paket Wisata', nav_fleet: 'Sewa Mobil',
  nav_custom: 'Trip Custom', nav_faq: 'FAQ', nav_book: 'Pesan Sekarang', nav_book_short: 'Pesan',
  aria_theme: 'Ganti tema terang/gelap', aria_menu: 'Buka menu navigasi', aria_left: 'Geser ke kiri', aria_right: 'Geser ke kanan',

  hero_title: 'Sewa Mobil & Private Trip Bandung',
  hero_sub: 'Mobil + driver 12 jam ke Lembang, Ciwidey, Pangalengan, dan Kota Bandung. Bayar online, bisa DP.',
  hero_p1: 'BBM termasuk', hero_p2: 'Sewa 12 jam', hero_p3: 'Bisa bayar DP',
  hero_cta1: 'Lihat Paket Wisata', hero_cta2: 'Pilih Armada',

  wx_title: 'Cuaca Live Bandung & Sekitarnya', wx_src: 'Data Open-Meteo, diperbarui tiap 10 menit',
  wx_hum: 'Kelembapan', wx_wind: 'Angin', wx_time: 'Waktu', wx_forecast: 'Prakiraan 12 Jam', wx_now: 'Sekarang',
  wx_loading: 'Memuat...', wx_live: 'Live', wx_feels: 'Terasa {n}°', wx_alt: '{n} mdpl', wx_refresh: 'Muat ulang cuaca',
  wx_pagi: 'Pagi', wx_siang: 'Siang', wx_sore: 'Sore', wx_malam: 'Malam',

  dest_title: 'Paket Wisata Bandung Favorit', dest_sub: 'Satu wilayah per hari: lebih santai, tanpa biaya lintas',
  tag_utara: 'Bandung Utara', tag_kota: 'Kota Bandung', tag_selatan: 'Bandung Selatan', tag_combo: 'Utara + Kota',
  pk_lembang: 'Paket Wisata Lembang', pk_dago: 'Paket Kota Bandung & Dago', pk_ciwidey: 'Paket Wisata Ciwidey',
  pk_pangalengan: 'Paket Wisata Pangalengan', pk_combo: 'Paket Lembang + Dago',
  pk_info: '4 destinasi, sewa 12 jam, tanpa biaya lintas',
  pk_from: 'mulai {price}', pk_with: '{price} dengan {car}', pk_btn: 'Pilih paket ini',

  fleet_title: 'Armada Sewa Mobil Bandung',
  fleet_note: '⏱ Semua harga di bawah untuk <b>sewa 12 jam</b> (mobil + driver + BBM). Contoh: jemput 07.00, selesai paling lambat 19.00.',
  th_fleet: 'Armada', th_cap: 'Nyaman / Maks', th_bag: 'Bagasi', th_price: 'Harga 12 Jam', th_act: 'Aksi',
  cap_comfort: '{n} Nyaman', card_cap: '{cap} • Maks {max}', card_people: '👥 <b>{cap}</b> + driver • Maks {max}',
  card_btn: 'Pilih Unit - {price} / 12 Jam', tbl_pick: 'Pilih', opt_placeholder: '— Pilih Armada Dulu —', opt_label: '{name} - {price} / 12 Jam',
  opt_full: ' — penuh di tanggal ini', opt_left: ' — tinggal {n} unit!',
  av_low: '⏳ Tinggal sedikit di tanggal ini: {list}.',
  rv_title: 'Kata Pelanggan', rv_sub: '⭐ {rata} dari 5 · {n} ulasan asli pelanggan Tempera', rv_left: 'Geser ke kiri', rv_right: 'Geser ke kanan',
  av_some: '🚫 Penuh di tanggal ini: {list}. Pilih armada lain atau tanggal lain.',
  av_all: '🚫 <b>Semua armada penuh di tanggal ini.</b> Pilih tanggal lain, atau <a href="{wa}" target="_blank" rel="noopener" style="text-decoration:underline">tanya admin lewat WhatsApp</a>.',
  av_card_full: '{car} penuh di tanggal yang dipilih. Pilih armada lain atau ubah tanggal.',
  av_wa_msg: 'Halo Admin Tempera, saya mau tanya ketersediaan armada untuk tanggal {tgl}.',

  tc_title: 'Trip Custom', tc_sub: 'Antar kota, bandara, mudik Lebaran, dan trip lebih dari 1 hari',
  tc_desc: 'Mobil dan driver khusus untuk rombongan Anda, bukan angkutan umum. Pilih tujuan, lalu tanyakan harganya lewat WhatsApp (tergantung jarak, jumlah hari, dan jam berangkat).',
  tc_soetta: 'Bandara Soetta', tc_garut: 'Bandung - Garut', tc_tasik: 'Bandung - Tasik', tc_jakarta: 'Bandung - Jakarta',
  tc_multi: 'Trip 2–3 hari', tc_other: 'Tujuan lain', tc_btn: 'Tanya Harga Lewat WhatsApp',
  tc_msg_dest: 'Halo Admin Tempera, saya mau tanya Trip Custom: Bandung - {dest}.',
  tc_msg_multi: 'Halo Admin Tempera, saya mau tanya Trip Custom 2–3 hari.',
  tc_msg_other: 'Halo Admin Tempera, saya mau tanya Trip Custom ke tujuan lain.',
  tc_msg_days: 'Halo Admin Tempera, saya mau trip {n} hari: {regions}.',
  dest_soetta: 'Bandara Soekarno-Hatta',

  book_title: 'Booking Sewa Mobil & Paket Wisata Bandung',
  form_name: 'Nama Lengkap *', ph_name: 'Nama Anda', form_wa: 'WhatsApp *', ph_wa: '0812xxxx atau +60 12xxxx',
  form_armada: 'Pilih Armada (Sewa 12 Jam) *',
  step1: 'Langkah 1: Pilih Wilayah Biar Hemat',
  titik0: '<b style="color:var(--accent)">🏙 Kota Bandung = titik 0.</b> Jemput dan antar di Bandung, jadi destinasi Kota Bandung &amp; Dago boleh digabung dengan wilayah mana pun <b>tanpa biaya lintas</b>. Biaya lintas hanya berlaku kalau menggabung 2 atau 3 wilayah di luar kota (Lembang, Ciwidey, Pangalengan).',
  rg_north: '🌲 UTARA', rg_ok1: '✓ 1 Arah Efisien', rg_south: '⛰️ SELATAN', rg_ok2: '✓ 1 Arah Selatan',
  step2: 'Langkah 2: Pilih Destinasi (Centang yang Mau Dikunjungi)',
  form_date: 'Tanggal *', form_time: 'Jam Jemput', form_pax: 'Jumlah Peserta *',
  form_note: 'Catatan / Lokasi Jemput', ph_note: 'Jemput di Stasiun Bandung...',
  grp_lembang: '🌲 Lembang ({n} Destinasi)', grp_dago: '🏙 Kota Bandung & Dago ({n} Destinasi)',
  grp_ciwidey: '⛰ Ciwidey ({n} Destinasi)', grp_pangalengan: '☕ Pangalengan ({n} Destinasi)',
  picked: '{n} dipilih', pick_hint: 'Pilih destinasi yang ingin dikunjungi', pick_all: 'Pilih Semua', clear_all: 'Hapus Semua',
  kota: 'Kota Bandung',

  dur_base: '⏱ <b>Sewa dibatasi 12 jam</b>, dihitung dari jam jemput.',
  dur_with: '⏱ <b>Sewa dibatasi 12 jam.</b> Jemput {start}, selesai paling lambat {end}.',
  dur_nextday: ' (hari berikutnya)',
  dur_min: '🕒 Pesan paling lambat <b>{n} jam</b> sebelum jam jemput.',
  dur_none: '<b>Untuk tanggal ini semua jam jemput sudah terlalu dekat.</b> Pilih tanggal berikutnya atau hubungi admin.',
  res_dur: '12 jam', res_dur_val: '12 jam ({start} - {end})',

  summary: 'Rincian Biaya', sum_armada: '🚐 Armada', not_chosen: 'Belum dipilih', choose_above: 'Pilih armada di atas',
  sum_dur: 'Durasi sewa:', sum_cross: 'Biaya lintas:', sum_dest: 'Destinasi:', none_yet: 'Belum ada', sum_cap: 'Kapasitas:',
  sum_total: 'Total Tarif', inc_title: '✅ Termasuk', inc_list: 'Mobil, driver, BBM, air mineral, pemakaian sampai 12 jam',
  exc_title: '❌ Tidak termasuk', exc_list: 'Tol, parkir, makan driver',
  submit: 'Konfirmasi & Bayar', processing: 'Memproses...',
  lbl_beda_lembah: ' (Beda Lembah Selatan)', lbl_utsel: ' (Lintas Utara-Selatan)', lbl_tiga: ' (3 Penjuru)',
  cap_line: '{cap} Nyaman • Maks {max}', mb_sewa: 'Sewa 12 jam',

  cap_ok: '✅ {n} orang muat nyaman di {car}', cap_warn: '⚠ {n} orang melebihi nyaman ({cap}) tapi masih maks {max}',
  cap_over: '🚫 {n} orang melebihi MAKS {max}',
  cm_title: 'Melebihi Kapasitas Maksimal', cm_text: '{n} orang melebihi kapasitas maksimal {car} ({max}). Pilih armada yang lebih besar.',
  cm_change: 'Ubah Jumlah', cm_upgrade: 'Upgrade',
  up_msg: 'Halo Admin Tempera, saya butuh armada untuk {n} orang (melebihi kapasitas 1 unit terbesar). Mohon info unit gabungan / armada tambahan.',

  pm_title: 'Cara Bayar', pm_full: 'Bayar Lunas', pm_full_d: 'Selesai sekali bayar', pm_dp: 'Bayar DP {p}%', pm_dp_d: 'Sisa tunai ke driver',
  pm_prev_dp: 'Bayar sekarang: {dp} · Sisa tunai ke driver: {rest}', pm_prev_full: 'Bayar sekarang: {total} (lunas)',

  dlg_ok: 'OK', dlg_continue: 'Lanjutkan', dlg_back: 'Kembali', dlg_chat: 'Chat admin', dlg_no: 'Tidak',
  err_name: 'Isi nama lengkap dulu.', err_wa: 'Nomor WhatsApp tidak valid. Contoh: 0812xxxxxxx atau +60 12-345 6789.',
  err_fleet: 'Pilih armada dulu.', err_dest: 'Pilih minimal satu destinasi.', err_pax: 'Isi jumlah peserta dulu.',
  err_datetime: 'Isi tanggal dan jam jemput dulu.',
  err_min: 'Pemesanan minimal {n} jam sebelum jam jemput. Pilih tanggal atau jam yang lebih lambat, atau hubungi admin lewat WhatsApp untuk pesanan mendadak.',
  err_past: 'Jam jemput sudah lewat. Pilih tanggal atau jam yang lebih lambat.',
  ask_overcomfort: '{n} orang melebihi kapasitas nyaman {car} ({cap}), tapi masih di bawah maksimal {max}. Tetap lanjut?',
  btn_keep: 'Tetap lanjut', btn_change_pax: 'Ubah jumlah',
  ask_cross: 'Destinasi yang kamu pilih mencakup {n} wilayah di luar Kota Bandung, jadi ada biaya lintas {cost}. Lanjutkan?',
  btn_change_choice: 'Ubah pilihan',
  err_snap: 'Sistem pembayaran belum siap. Muat ulang halaman lalu coba lagi.',
  dp_note: ' Sisa {rest} dibayar tunai langsung ke driver saat perjalanan.',
  pay_ok: 'Pembayaran berhasil!{dp} Konfirmasi dan invoice akan dikirim ke WhatsApp Anda.',
  pay_pending: 'Menunggu pembayaran.{dp} Invoice dikirim ke WhatsApp setelah pembayaran diterima.',
  pay_err: 'Pembayaran gagal. Silakan coba lagi.',
  order_fail: 'Gagal membuat pesanan: {e}', order_fail2: 'Gagal membuat pesanan. Coba lagi.',
  net_err: 'Koneksi ke server bermasalah. Periksa internetmu lalu coba lagi.',

  w_bl_title: 'Sama-Sama Selatan, Tapi Beda Lembah', w_bl_badge: '62 KM MEMUTAR',
  w_bl_desc: 'Ciwidey itu <b>Selatan Barat</b>, Pangalengan itu <b>Selatan Timur</b>. Tidak ada jalan tembus langsung.',
  w_bl_via: 'harus memutar lewat', w_bl_route: 'Banjaran - 62 KM • 2 Jam',
  w_base: 'Paket dasar', w_bl_add: '+ Beda Lembah (BBM + waktu)', w_total: 'Total',
  w_only_ciw: 'Pilih Ciwidey saja (Hemat)', w_only_pgl: 'Pilih Pangalengan saja',
  w_us_title: 'Rute Berlawanan Arah - Utara vs Selatan',
  w_us_desc: 'Lembang itu <b>Utara</b>, Ciwidey/Pangalengan itu <b>Selatan</b>. Harus lewat tengah Kota Bandung, macet 2x.',
  w_us_dist: 'Total memutar ~90KM • 3-4 Jam di jalan kalau 1 hari', w_us_add: '+ Lintas Utara-Selatan',
  w_us_btn: '💡 Mending jadi 2 hari? (Lebih santai, driver rekomen)',
  w_3_badge: '3 PENJURU BANDUNG', w_3_dirs: 'UTARA • SELATAN BARAT • SELATAN TIMUR',
  w_3_title: 'Wah, kamu mau muterin Bandung 1 hari penuh! 🔥',
  w_north: 'Utara', w_sw: 'Selatan Barat', w_se: 'Selatan Timur',
  w_3_dist_l: 'Jarak total hari ini', w_3_dist_v: '~152 KM • 7-8 Jam di jalan',
  w_3_photo_l: 'Waktu foto-foto', w_3_photo_v: 'Sisa 2 jam saja 😥',
  w_3_add: '+ Biaya 3 Penjuru (BBM + lembur driver)',
  w_3_honest: 'Jujur, kalau dipaksakan 1 hari bakal capek banget. Driver rekomen <b class="text-white">pecah jadi 3 hari</b> biar puas.',
  w_3_btn: '💡 MAU DIBIKIN 3 HARI SAJA? (Lebih santai)', w_3_one: 'Atau pilih 1 wilayah saja:', w_only: '{r} saja',
  w_3_keep: 'Tetap 3 wilayah? Lanjutkan saja isi formulir.',

  faq_title: 'Pertanyaan yang Sering Diajukan',
  faq_q1: 'Berapa lama durasi sewanya?',
  faq_a1: 'Sewa dibatasi 12 jam, dihitung dari jam jemput. Contoh: dijemput pukul 07.00, selesai paling lambat pukul 19.00. Di formulir pemesanan, jam selesainya otomatis ditampilkan.',
  faq_q2: 'Apa saja yang termasuk dan tidak termasuk?',
  faq_a2: 'Termasuk: mobil, driver, BBM, air mineral, dan pemakaian sampai 12 jam. Tidak termasuk: tol, parkir, dan makan driver.',
  faq_q3: 'Kenapa ada biaya tambahan kalau destinasi lebih dari satu wilayah?',
  faq_a3: 'Kota Bandung adalah titik jemput dan antar, jadi destinasi di Kota Bandung & Dago bisa digabung dengan wilayah mana pun tanpa biaya lintas. Biaya lintas hanya berlaku kalau kamu menggabung 2 wilayah di luar kota (dua dari Lembang, Ciwidey, Pangalengan), dan lebih besar lagi kalau ketiganya. Satu wilayah saja tidak kena biaya tambahan.',
  faq_q4: 'Berapa destinasi yang disarankan dalam sehari?',
  faq_a4: 'Kami sarankan tidak lebih dari 4 destinasi supaya perjalanan tetap santai, tidak terburu-buru.',
  faq_q5: 'Apa itu Trip Custom?',
  faq_a5: 'Perjalanan di luar sewa 12 jam biasa: antar kota (Jakarta, Garut, Tasikmalaya, dan lainnya), antar-jemput Bandara Soekarno-Hatta, mudik Lebaran, atau trip lebih dari 1 hari. Mobil dan driver khusus untuk rombongan Anda.',
  faq_q6: 'Bagaimana cara pesan Trip Custom?',
  faq_a6: 'Pilih tujuannya di bagian Trip Custom, lalu tanyakan harganya lewat WhatsApp. Harga tergantung jarak, jumlah hari, dan jam berangkat.',
  faq_q7: 'Bisa bayar DP?',
  faq_a7: 'Bisa. Saat checkout, pilih "Bayar DP". Anda cukup membayar sebagian lewat Midtrans, sisanya dibayar tunai langsung ke driver saat perjalanan.',
  faq_q8: 'Bayarnya lewat apa?', faq_a8: 'Lewat Midtrans: bisa QRIS, transfer bank, atau e-wallet.',
  faq_q9: 'Saya dari Malaysia, bisa pesan?',
  faq_a9: 'Bisa. Tulis nomor WhatsApp lengkap dengan kode negara, misalnya +60 12-345 6789. Kalau metode pembayaran yang tersedia tidak bisa Anda pakai, chat admin lewat WhatsApp.',
  faq_q10: 'Bagaimana kalau driver atau mobil berhalangan?',
  faq_a10: 'Kami carikan pengganti sejenis dari mitra kami, supaya perjalanan Anda tetap berjalan.',
  faq_q11: 'Bagaimana cara menghubungi admin?',
  faq_a11: 'Tekan tombol WhatsApp di pojok kanan bawah, atau pakai kontak di bagian paling bawah halaman ini.',

  ft_tagline: 'Teman Perjalanan • Bandung • Private Trip',
  ft_desc: 'Private trip Bandung dengan mobil dan driver untuk rombongan Anda sendiri. Harga transparan, rute bisa diatur.',
  ft_area: 'Melayani Bandung dan sekitarnya', ft_crafted: 'Dibuat dengan',
  wa_online: 'Online', wa_consult: 'Konsultasi WA',
  wa_float_msg: 'Halo Admin Tempera, saya mau konsultasi paket wisata',
  wa_2days: 'Halo mau paket 2 hari Lembang + Ciwidey/Pangalengan'
},
ms: {
  page_title: 'Tempera - Private Trip & Sewa Kereta Bandung | Teman Perjalanan',
  nav_home: 'Laman Utama', nav_weather: 'Cuaca Semasa', nav_dest: 'Pakej Pelancongan', nav_fleet: 'Sewa Kereta',
  nav_custom: 'Trip Tersuai', nav_faq: 'Soalan Lazim', nav_book: 'Tempah Sekarang', nav_book_short: 'Tempah',
  aria_theme: 'Tukar tema cerah/gelap', aria_menu: 'Buka menu navigasi', aria_left: 'Anjak ke kiri', aria_right: 'Anjak ke kanan',

  hero_title: 'Sewa Kereta & Private Trip Bandung',
  hero_sub: 'Kereta + pemandu 12 jam ke Lembang, Ciwidey, Pangalengan dan Bandar Bandung. Bayar dalam talian, boleh bayar deposit.',
  hero_p1: 'Petrol termasuk', hero_p2: 'Sewa 12 jam', hero_p3: 'Boleh bayar deposit',
  hero_cta1: 'Lihat Pakej', hero_cta2: 'Pilih Kereta',

  wx_title: 'Cuaca Semasa Bandung & Sekitarnya', wx_src: 'Data Open-Meteo, dikemas kini setiap 10 minit',
  wx_hum: 'Kelembapan', wx_wind: 'Angin', wx_time: 'Waktu', wx_forecast: 'Ramalan 12 Jam', wx_now: 'Kini',
  wx_loading: 'Memuatkan...', wx_live: 'Langsung', wx_feels: 'Terasa {n}°', wx_alt: '{n} m', wx_refresh: 'Muat semula cuaca',
  wx_pagi: 'Pagi', wx_siang: 'Tengah hari', wx_sore: 'Petang', wx_malam: 'Malam',

  dest_title: 'Pakej Pelancongan Bandung Pilihan', dest_sub: 'Satu kawasan sehari: lebih santai, tanpa caj rentas',
  tag_utara: 'Bandung Utara', tag_kota: 'Bandar Bandung', tag_selatan: 'Bandung Selatan', tag_combo: 'Utara + Bandar',
  pk_lembang: 'Pakej Lembang', pk_dago: 'Pakej Bandar Bandung & Dago', pk_ciwidey: 'Pakej Ciwidey',
  pk_pangalengan: 'Pakej Pangalengan', pk_combo: 'Pakej Lembang + Dago',
  pk_info: '4 destinasi, sewa 12 jam, tanpa caj rentas',
  pk_from: 'dari {price}', pk_with: '{price} dengan {car}', pk_btn: 'Pilih pakej ini',

  fleet_title: 'Kereta Sewa di Bandung',
  fleet_note: '⏱ Semua harga di bawah untuk <b>sewa 12 jam</b> (kereta + pemandu + petrol). Contoh: dijemput 7.00 pagi, tamat selewat-lewatnya 7.00 malam.',
  th_fleet: 'Kereta', th_cap: 'Selesa / Maks', th_bag: 'Bagasi', th_price: 'Harga 12 Jam', th_act: 'Tindakan',
  cap_comfort: '{n} Selesa', card_cap: '{cap} • Maks {max}', card_people: '👥 <b>{cap}</b> + pemandu • Maks {max}',
  card_btn: 'Pilih - {price} / 12 Jam', tbl_pick: 'Pilih', opt_placeholder: '— Pilih Kereta Dahulu —', opt_label: '{name} - {price} / 12 Jam',
  opt_full: ' — penuh pada tarikh ini', opt_left: ' — tinggal {n} unit sahaja!',
  av_low: '⏳ Tinggal sedikit pada tarikh ini: {list}.',
  rv_title: 'Kata Pelanggan', rv_sub: '⭐ {rata} daripada 5 · {n} ulasan sebenar pelanggan Tempera', rv_left: 'Anjak ke kiri', rv_right: 'Anjak ke kanan',
  av_some: '🚫 Penuh pada tarikh ini: {list}. Pilih kereta lain atau tarikh lain.',
  av_all: '🚫 <b>Semua kereta penuh pada tarikh ini.</b> Pilih tarikh lain, atau <a href="{wa}" target="_blank" rel="noopener" style="text-decoration:underline">tanya admin melalui WhatsApp</a>.',
  av_card_full: '{car} penuh pada tarikh yang dipilih. Pilih kereta lain atau tukar tarikh.',
  av_wa_msg: 'Hai Admin Tempera, saya ingin bertanya tentang kekosongan kereta untuk tarikh {tgl}.',

  tc_title: 'Trip Tersuai', tc_sub: 'Antara bandar, lapangan terbang, balik raya dan trip lebih dari 1 hari',
  tc_desc: 'Kereta dan pemandu khas untuk rombongan anda, bukan pengangkutan awam. Pilih destinasi, kemudian tanya harga melalui WhatsApp (bergantung pada jarak, bilangan hari dan masa bertolak).',
  tc_soetta: 'Lapangan Terbang Soetta', tc_garut: 'Bandung - Garut', tc_tasik: 'Bandung - Tasik', tc_jakarta: 'Bandung - Jakarta',
  tc_multi: 'Trip 2–3 hari', tc_other: 'Destinasi lain', tc_btn: 'Tanya Harga Melalui WhatsApp',
  tc_msg_dest: 'Hai Admin Tempera, saya ingin bertanya tentang Trip Tersuai: Bandung - {dest}.',
  tc_msg_multi: 'Hai Admin Tempera, saya ingin bertanya tentang Trip Tersuai 2–3 hari.',
  tc_msg_other: 'Hai Admin Tempera, saya ingin bertanya tentang Trip Tersuai ke destinasi lain.',
  tc_msg_days: 'Hai Admin Tempera, saya ingin trip {n} hari: {regions}.',
  dest_soetta: 'Lapangan Terbang Soekarno-Hatta',

  book_title: 'Tempahan Sewa Kereta & Pakej Bandung',
  form_name: 'Nama Penuh *', ph_name: 'Nama anda', form_wa: 'WhatsApp *', ph_wa: '+60 12-345 6789',
  form_armada: 'Pilih Kereta (Sewa 12 Jam) *',
  step1: 'Langkah 1: Pilih Kawasan Supaya Jimat',
  titik0: '<b style="color:var(--accent)">🏙 Bandar Bandung = titik 0.</b> Jemputan dan hantaran di Bandung, jadi destinasi Bandar Bandung &amp; Dago boleh digabung dengan kawasan mana-mana <b>tanpa caj rentas</b>. Caj rentas hanya dikenakan jika menggabungkan 2 atau 3 kawasan di luar bandar (Lembang, Ciwidey, Pangalengan).',
  rg_north: '🌲 UTARA', rg_ok1: '✓ Sehala, Jimat Masa', rg_south: '⛰️ SELATAN', rg_ok2: '✓ Sehala ke Selatan',
  step2: 'Langkah 2: Pilih Destinasi (Tandakan yang Ingin Dilawati)',
  form_date: 'Tarikh *', form_time: 'Masa Jemputan', form_pax: 'Bilangan Peserta *',
  form_note: 'Catatan / Lokasi Jemputan', ph_note: 'Jemput di Stesen Bandung...',
  grp_lembang: '🌲 Lembang ({n} Destinasi)', grp_dago: '🏙 Bandar Bandung & Dago ({n} Destinasi)',
  grp_ciwidey: '⛰ Ciwidey ({n} Destinasi)', grp_pangalengan: '☕ Pangalengan ({n} Destinasi)',
  picked: '{n} dipilih', pick_hint: 'Pilih destinasi yang ingin dilawati', pick_all: 'Pilih Semua', clear_all: 'Kosongkan',
  kota: 'Bandar Bandung',

  dur_base: '⏱ <b>Sewa terhad 12 jam</b>, dikira dari masa jemputan.',
  dur_with: '⏱ <b>Sewa terhad 12 jam.</b> Jemput {start}, tamat selewat-lewatnya {end}.',
  dur_nextday: ' (hari berikutnya)',
  dur_min: '🕒 Tempah sekurang-kurangnya <b>{n} jam</b> sebelum masa jemputan.',
  dur_none: '<b>Untuk tarikh ini semua masa jemputan sudah terlalu dekat.</b> Pilih tarikh lain atau hubungi admin.',
  res_dur: '12 jam', res_dur_val: '12 jam ({start} - {end})',

  summary: 'Ringkasan Harga', sum_armada: '🚐 Kereta', not_chosen: 'Belum dipilih', choose_above: 'Pilih kereta di atas',
  sum_dur: 'Tempoh sewa:', sum_cross: 'Caj rentas:', sum_dest: 'Destinasi:', none_yet: 'Belum ada', sum_cap: 'Kapasiti:',
  sum_total: 'Jumlah Harga', inc_title: '✅ Termasuk', inc_list: 'Kereta, pemandu, petrol, air mineral, penggunaan sehingga 12 jam',
  exc_title: '❌ Tidak termasuk', exc_list: 'Tol, parkir, makan pemandu',
  submit: 'Sahkan & Bayar', processing: 'Sedang diproses...',
  lbl_beda_lembah: ' (Lembah Selatan Berbeza)', lbl_utsel: ' (Rentas Utara-Selatan)', lbl_tiga: ' (3 Penjuru)',
  cap_line: '{cap} Selesa • Maks {max}', mb_sewa: 'Sewa 12 jam',

  cap_ok: '✅ {n} orang muat dengan selesa dalam {car}', cap_warn: '⚠ {n} orang melebihi kapasiti selesa ({cap}) tetapi masih dalam maksimum {max}',
  cap_over: '🚫 {n} orang melebihi MAKSIMUM {max}',
  cm_title: 'Melebihi Kapasiti Maksimum', cm_text: '{n} orang melebihi kapasiti maksimum {car} ({max}). Sila pilih kereta yang lebih besar.',
  cm_change: 'Tukar Bilangan', cm_upgrade: 'Naik Taraf',
  up_msg: 'Hai Admin Tempera, saya perlukan kenderaan untuk {n} orang (melebihi kapasiti 1 unit terbesar). Mohon maklumat unit gabungan / kereta tambahan.',

  pm_title: 'Cara Bayaran', pm_full: 'Bayar Penuh', pm_full_d: 'Selesai sekali bayar', pm_dp: 'Bayar Deposit {p}%', pm_dp_d: 'Baki tunai kepada pemandu',
  pm_prev_dp: 'Bayar sekarang: {dp} · Baki tunai kepada pemandu: {rest}', pm_prev_full: 'Bayar sekarang: {total} (penuh)',

  dlg_ok: 'OK', dlg_continue: 'Teruskan', dlg_back: 'Kembali', dlg_chat: 'Hubungi admin', dlg_no: 'Tidak',
  err_name: 'Sila isi nama penuh.', err_wa: 'Nombor WhatsApp tidak sah. Contoh: +60 12-345 6789.',
  err_fleet: 'Sila pilih kereta dahulu.', err_dest: 'Sila pilih sekurang-kurangnya satu destinasi.', err_pax: 'Sila isi bilangan peserta.',
  err_datetime: 'Sila isi tarikh dan masa jemputan.',
  err_min: 'Tempahan mesti dibuat sekurang-kurangnya {n} jam sebelum masa jemputan. Pilih tarikh atau masa yang lebih lewat, atau hubungi admin melalui WhatsApp untuk tempahan segera.',
  err_past: 'Masa jemputan sudah berlalu. Pilih tarikh atau masa yang lebih lewat.',
  ask_overcomfort: '{n} orang melebihi kapasiti selesa {car} ({cap}), tetapi masih di bawah maksimum {max}. Teruskan?',
  btn_keep: 'Teruskan', btn_change_pax: 'Tukar bilangan',
  ask_cross: 'Destinasi yang anda pilih merangkumi {n} kawasan di luar Bandar Bandung, jadi ada caj rentas {cost}. Teruskan?',
  btn_change_choice: 'Tukar pilihan',
  err_snap: 'Sistem pembayaran belum sedia. Muat semula halaman dan cuba lagi.',
  dp_note: ' Baki {rest} dibayar tunai terus kepada pemandu semasa perjalanan.',
  pay_ok: 'Pembayaran berjaya!{dp} Pengesahan dan invois akan dihantar ke WhatsApp anda.',
  pay_pending: 'Menunggu pembayaran.{dp} Invois akan dihantar ke WhatsApp selepas pembayaran diterima.',
  pay_err: 'Pembayaran gagal. Sila cuba lagi.',
  order_fail: 'Gagal membuat tempahan: {e}', order_fail2: 'Gagal membuat tempahan. Sila cuba lagi.',
  net_err: 'Sambungan ke pelayan bermasalah. Semak internet anda dan cuba lagi.',

  w_bl_title: 'Sama-sama Selatan, Tetapi Lembah Berbeza', w_bl_badge: '62 KM BERPUSING',
  w_bl_desc: 'Ciwidey di <b>Selatan Barat</b>, Pangalengan di <b>Selatan Timur</b>. Tiada jalan terus antara keduanya.',
  w_bl_via: 'perlu berpusing melalui', w_bl_route: 'Banjaran - 62 KM • 2 Jam',
  w_base: 'Harga asas', w_bl_add: '+ Lembah Berbeza (petrol + masa)', w_total: 'Jumlah',
  w_only_ciw: 'Ciwidey sahaja (Jimat)', w_only_pgl: 'Pangalengan sahaja',
  w_us_title: 'Laluan Bertentangan Arah - Utara vs Selatan',
  w_us_desc: 'Lembang di <b>Utara</b>, Ciwidey/Pangalengan di <b>Selatan</b>. Perlu melalui tengah Bandar Bandung, sesak dua kali.',
  w_us_dist: 'Jumlah perjalanan ~90KM • 3-4 jam di jalan jika 1 hari', w_us_add: '+ Rentas Utara-Selatan',
  w_us_btn: '💡 Jadikan 2 hari? (Lebih santai, disyorkan pemandu)',
  w_3_badge: '3 PENJURU BANDUNG', w_3_dirs: 'UTARA • SELATAN BARAT • SELATAN TIMUR',
  w_3_title: 'Wah, anda mahu pusing seluruh Bandung dalam 1 hari! 🔥',
  w_north: 'Utara', w_sw: 'Selatan Barat', w_se: 'Selatan Timur',
  w_3_dist_l: 'Jumlah jarak hari ini', w_3_dist_v: '~152 KM • 7-8 jam di jalan',
  w_3_photo_l: 'Masa bergambar', w_3_photo_v: 'Tinggal 2 jam sahaja 😥',
  w_3_add: '+ Caj 3 Penjuru (petrol + kerja lebih masa pemandu)',
  w_3_honest: 'Sejujurnya, jika dipaksa dalam 1 hari memang sangat memenatkan. Pemandu mencadangkan <b class="text-white">pecahkan kepada 3 hari</b> supaya puas.',
  w_3_btn: '💡 JADIKAN 3 HARI? (Lebih santai)', w_3_one: 'Atau pilih 1 kawasan sahaja:', w_only: '{r} sahaja',
  w_3_keep: 'Kekal 3 kawasan? Teruskan mengisi borang.',

  faq_title: 'Soalan Lazim',
  faq_q1: 'Berapa lama tempoh sewa?',
  faq_a1: 'Sewa terhad 12 jam, dikira dari masa jemputan. Contoh: dijemput 7.00 pagi, tamat selewat-lewatnya 7.00 malam. Dalam borang tempahan, masa tamat dipaparkan secara automatik.',
  faq_q2: 'Apa yang termasuk dan tidak termasuk?',
  faq_a2: 'Termasuk: kereta, pemandu, petrol, air mineral dan penggunaan sehingga 12 jam. Tidak termasuk: tol, parkir dan makan pemandu.',
  faq_q3: 'Kenapa ada caj tambahan jika destinasi lebih dari satu kawasan?',
  faq_a3: 'Bandar Bandung ialah titik jemputan dan hantaran, jadi destinasi di Bandar Bandung & Dago boleh digabung dengan kawasan mana-mana tanpa caj rentas. Caj rentas hanya dikenakan jika anda menggabungkan 2 kawasan di luar bandar (dua daripada Lembang, Ciwidey, Pangalengan), dan lebih tinggi jika ketiga-tiganya. Satu kawasan sahaja tidak dikenakan caj tambahan.',
  faq_q4: 'Berapa destinasi yang disyorkan dalam sehari?',
  faq_a4: 'Kami syorkan tidak lebih dari 4 destinasi supaya perjalanan kekal santai dan tidak tergesa-gesa.',
  faq_q5: 'Apa itu Trip Tersuai?',
  faq_a5: 'Perjalanan di luar sewa 12 jam biasa: antara bandar (Jakarta, Garut, Tasikmalaya dan lain-lain), jemputan dan hantaran ke Lapangan Terbang Soekarno-Hatta, balik raya, atau trip lebih dari 1 hari. Kereta dan pemandu khas untuk rombongan anda.',
  faq_q6: 'Bagaimana cara menempah Trip Tersuai?',
  faq_a6: 'Pilih destinasi di bahagian Trip Tersuai, kemudian tanya harga melalui WhatsApp. Harga bergantung pada jarak, bilangan hari dan masa bertolak.',
  faq_q7: 'Boleh bayar deposit?',
  faq_a7: 'Boleh. Semasa pembayaran, pilih "Bayar Deposit". Anda hanya perlu membayar sebahagian melalui Midtrans, bakinya dibayar tunai terus kepada pemandu semasa perjalanan.',
  faq_q8: 'Bayaran melalui apa?', faq_a8: 'Melalui Midtrans: QRIS, pindahan bank atau e-dompet.',
  faq_q9: 'Saya dari Malaysia, boleh menempah?',
  faq_a9: 'Boleh. Tulis nombor WhatsApp lengkap dengan kod negara, contohnya +60 12-345 6789. Jika kaedah pembayaran yang tersedia tidak dapat anda gunakan, hubungi admin melalui WhatsApp.',
  faq_q10: 'Bagaimana jika pemandu atau kereta tidak dapat hadir?',
  faq_a10: 'Kami akan carikan pengganti yang setara daripada rakan kongsi kami, supaya perjalanan anda tetap berjalan.',
  faq_q11: 'Bagaimana cara menghubungi admin?',
  faq_a11: 'Tekan butang WhatsApp di penjuru kanan bawah, atau gunakan maklumat hubungan di bahagian paling bawah halaman ini.',

  ft_tagline: 'Teman Perjalanan • Bandung • Private Trip',
  ft_desc: 'Private trip Bandung dengan kereta dan pemandu untuk rombongan anda sendiri. Harga telus, laluan boleh diatur.',
  ft_area: 'Berkhidmat di Bandung dan sekitarnya', ft_crafted: 'Dibuat dengan',
  wa_online: 'Dalam talian', wa_consult: 'Konsultasi WA',
  wa_float_msg: 'Hai Admin Tempera, saya ingin bertanya tentang pakej pelancongan',
  wa_2days: 'Hai, saya mahu pakej 2 hari Lembang + Ciwidey/Pangalengan'
}
};
const WX_DESC = {
  id: {0:'Cerah',1:'Cerah Berawan',2:'Berawan Sebagian',3:'Mendung',45:'Berkabut',48:'Kabut Tebal',51:'Gerimis Ringan',53:'Gerimis',55:'Gerimis Lebat',56:'Gerimis',57:'Gerimis Lebat',61:'Hujan Ringan',63:'Hujan Sedang',65:'Hujan Lebat',80:'Hujan Ringan',81:'Hujan Sedang',82:'Hujan Lebat',95:'Petir',96:'Petir + Hujan',99:'Badai Petir',_:'Berawan'},
  ms: {0:'Cerah',1:'Cerah Berawan',2:'Separa Berawan',3:'Mendung',45:'Berkabus',48:'Kabus Tebal',51:'Hujan Renyai',53:'Renyai',55:'Renyai Lebat',56:'Renyai',57:'Renyai Lebat',61:'Hujan Ringan',63:'Hujan Sederhana',65:'Hujan Lebat',80:'Hujan Ringan',81:'Hujan Sederhana',82:'Hujan Lebat',95:'Ribut Petir',96:'Ribut Petir + Hujan',99:'Ribut Petir Kuat',_:'Berawan'}
};

let currentLang = (function(){
  try{ const s=localStorage.getItem('tempera_lang'); if(s==='id'||s==='ms') return s; }catch(e){}
  return /^ms\b/i.test(navigator.language||'') ? 'ms' : 'id';   // tamu dengan HP berbahasa Melayu langsung dapat bahasa Melayu
})();
function t(key, vars){
  const d=I18N[currentLang]||I18N.id;
  let s=(key in d)?d[key]:(key in I18N.id?I18N.id[key]:key);
  if(vars) s=s.replace(/\{(\w+)\}/g,(m,k)=>(k in vars?String(vars[k]):m));
  return s;
}
function applyStaticText(root){
  const r=root||document;
  r.querySelectorAll('[data-i18n]').forEach(el=>{ el.textContent=t(el.dataset.i18n); });
  r.querySelectorAll('[data-i18n-html]').forEach(el=>{ el.innerHTML=t(el.dataset.i18nHtml); });   // hanya teks kamus (tepercaya)
  r.querySelectorAll('[data-i18n-ph]').forEach(el=>{ el.setAttribute('placeholder',t(el.dataset.i18nPh)); });
  r.querySelectorAll('[data-i18n-aria]').forEach(el=>{ el.setAttribute('aria-label',t(el.dataset.i18nAria)); el.setAttribute('title',t(el.dataset.i18nAria)); });
  if(!root){ document.title=t('page_title'); document.documentElement.lang=currentLang; }
}
function updateLangButton(){
  const flag=document.getElementById('currentLangFlag'), lbl=document.getElementById('currentLang');
  if(flag) flag.textContent=currentLang==='ms'?'🇲🇾':'🇮🇩';
  if(lbl) lbl.textContent=currentLang==='ms'?'MY':'ID';
  document.querySelectorAll('#langMenu [data-lang]').forEach(b=>{
    const on=b.dataset.lang===currentLang; const c=b.querySelector('.check');
    b.style.background=on?'var(--bg-section-alt)':'transparent'; if(c) c.classList.toggle('hidden',!on);
  });
}
function applyLanguage(lang){
  currentLang=(lang==='ms')?'ms':'id';
  try{ localStorage.setItem('tempera_lang',currentLang); }catch(e){}
  applyStaticText(); updateLangButton(); refreshDynamic();
}
function changeLanguage(lang){ applyLanguage(lang); document.getElementById('langMenu')?.classList.add('hidden'); }

/* ---------- Tema: terang (teal) / gelap (emas). CSS mengurus warnanya; JS cuma ikon & pilihan manual ---------- */
function effectiveTheme(){
  let manual=null; try{ manual=localStorage.getItem('tempera_theme_manual'); }catch(e){}
  if(manual==='light'||manual==='dark') return manual;
  return window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
}
function updateThemeIcon(){ const b=document.getElementById('themeToggleBtn'); if(b) b.textContent=effectiveTheme()==='dark'?'🌙':'☀️'; }
function applyTheme(theme){
  if(theme){ document.documentElement.setAttribute('data-theme',theme); try{ localStorage.setItem('tempera_theme_manual',theme); }catch(e){} }
  else{ document.documentElement.removeAttribute('data-theme'); try{ localStorage.removeItem('tempera_theme_manual'); }catch(e){} }
  updateThemeIcon();
}
function toggleTheme(){ applyTheme(effectiveTheme()==='dark'?'light':'dark'); }

function toggleDropdown(e){ e.stopPropagation(); document.getElementById('langMenu').classList.toggle('hidden'); }
window.addEventListener('click',()=>{ document.getElementById('langMenu')?.classList.add('hidden'); document.getElementById('mobileMenu')?.classList.add('hidden'); });
function toggleMobileMenu(e){ if(e) e.stopPropagation(); const m=document.getElementById('mobileMenu'); const btn=document.getElementById('hamburgerBtn'); const nowOpen=m.classList.toggle('hidden')===false; if(btn) btn.setAttribute('aria-expanded',String(nowOpen)); }
function closeMobileMenu(){ document.getElementById('mobileMenu')?.classList.add('hidden'); }
function handlePesanSekarang(e){ if(e) e.preventDefault(); document.getElementById('pesan').scrollIntoView({behavior:'smooth'}); }

/* ---------- Data armada bawaan (dipakai kalau database tidak terjangkau) ---------- */
let ARMADA_DATA=[
{id:'calya',name:'Toyota Calya / Sigra',shortName:'Calya / Sigra',badge:'Ekonomis • 4 Nyaman',images:['calya-black-gold.jpg','calya-white.jpg'],capacityNum:4,capacityMax:6,baggage:'2 koper kabin kecil',maxInfo:'Max 6 tanpa bagasi',note:'⚠ Tidak muat 6 + koper besar',noteClass:'text-amber-600',price:550000},
{id:'avanza',name:'Toyota Avanza / Xenia New',shortName:'Avanza / Xenia New',badge:'Paling Laris • 5 Nyaman',images:['avanza-black-gold.jpg','avanza-white.jpg'],capacityNum:5,capacityMax:6,baggage:'1 besar + 2 kecil',maxInfo:'Max 6 tanpa koper besar',note:'✅ Muat stroller lipat',noteClass:'text-emerald-600',price:650000},
{id:'xpander',name:'Mitsubishi Xpander',shortName:'Xpander',badge:'MPV Nyaman • 6 Nyaman',images:['xpander-black.jpg','xpander-white.jpg'],capacityNum:6,capacityMax:7,baggage:'1 besar + 2 kecil',maxInfo:'Max 7 tanpa bagasi besar',note:'✅ Kabin paling lega',noteClass:'text-emerald-600',price:800000},
{id:'innova',name:'Toyota Innova Reborn / Zenix',shortName:'Innova Reborn / Zenix',badge:'Best Seller • 6 Nyaman',images:['innova-black-gold.jpg','innova-white.jpg'],capacityNum:6,capacityMax:7,baggage:'2 besar + 2 kecil',maxInfo:'Max 7 tipe G tanpa bagasi besar',note:'✅ Rekomendasi luar kota',noteClass:'text-emerald-600',price:950000},
{id:'hiace',name:'Toyota Hiace Premio',shortName:'Hiace Premio',badge:'Premium • 11 Nyaman',images:['hiace-black-gold.jpg','hiace-white.jpg'],capacityNum:11,capacityMax:14,baggage:'8-10 koper besar',maxInfo:'Max resmi 12, modif 14 tanpa bagasi besar',note:'ℹ 12 orang = lipat 2 kursi untuk koper',noteClass:'text-slate-500',price:1600000}
];

let CROSS_2=400000, CROSS_3=800000, DP_PERCENT=30, BOOKING_MIN_HOURS=12;
let PAYMENT_MODE='lunas';
let SETTINGS={};   // app_settings publik (hero, media sosial, dll)
const SB_URL='https://wjmotidelqgcyyujacud.supabase.co';

function imgSrc(img){ return /^https?:\/\//i.test(img) ? img : 'images/'+img; }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function safeUrl(u){ u=String(u||'').trim(); return (/^(https?:\/\/|\/|#)/i.test(u) || /^[a-z0-9_.\-\/?=&#%]+$/i.test(u)) ? u : ''; }
function formatPrice(p){ return 'Rp '+Number(p||0).toLocaleString('id-ID'); }

async function sbGet(path){
  const r=await fetch(`${SB_URL}/rest/v1/${path}`,{headers:{apikey:SUPABASE_ANON_KEY,Authorization:`Bearer ${SUPABASE_ANON_KEY}`}});
  if(!r.ok) throw new Error('HTTP '+r.status);
  return r.json();
}
function mapFleetRow(f){
  const note=f.note||'';
  const noteClass=note.startsWith('⚠')?'text-amber-600':(note.startsWith('ℹ')?'text-slate-500':'text-emerald-600');
  return {id:f.id,name:f.name,shortName:f.short_name,badge:f.badge||'',images:Array.isArray(f.images)?f.images:[],
    capacityNum:f.capacity_comfort,capacityMax:f.capacity_max,baggage:f.baggage||'',maxInfo:f.max_info||'',note,noteClass,price:f.price};
}
function fleetSig(a){ return a.map(u=>[u.id,u.name,u.shortName,u.badge,u.price,u.capacityNum,u.capacityMax,u.baggage,u.maxInfo,u.note,(u.images||[]).join('|')].join('~')).join('#'); }

function renderBanners(rows){
  const now=Date.now();
  const list=(rows||[]).filter(b=>b.is_active!==false&&(!b.starts_at||new Date(b.starts_at)<=now)&&(!b.ends_at||new Date(b.ends_at)>=now));
  let box=document.getElementById('promo-banners');
  if(!list.length){ if(box) box.innerHTML=''; return; }
  if(!box){
    const anchor=document.getElementById('pesan'); if(!anchor||!anchor.parentNode) return;
    box=document.createElement('section'); box.id='promo-banners'; anchor.parentNode.insertBefore(box,anchor);
  }
  box.className='px-4 py-6';
  box.innerHTML='<div class="max-w-6xl mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-3">'+list.map(b=>{
    const img=b.image_url?`<img src="${esc(imgSrc(b.image_url))}" alt="${esc(b.title)}" loading="lazy" class="w-full h-40 object-cover">`:'';
    const link=safeUrl(b.button_url);
    const btn=(b.button_text&&link)?`<a href="${esc(link)}" class="inline-block mt-3 px-4 py-2 rounded-full text-[11px] font-bold" style="background:var(--accent);color:var(--on-accent)">${esc(b.button_text)}</a>`:'';
    const sub=b.subtitle?`<p class="text-[12px] mt-1" style="color:var(--text-secondary)">${esc(b.subtitle)}</p>`:'';
    return `<div class="rounded-[20px] overflow-hidden border" style="background:var(--bg-card);border-color:var(--border-soft)">${img}<div class="p-5"><h3 class="text-[15px] font-bold" style="color:var(--text-primary)">${esc(b.title)}</h3>${sub}${btn}</div></div>`;
  }).join('')+'</div>';
}

// Catat kunjungan: scan (lewat link/QR driver) atau visit, sekali per sesi
function logTraffic(){
  try{
    if(sessionStorage.getItem('tempera_logged')) return;
    sessionStorage.setItem('tempera_logged','1');
    const q=new URLSearchParams(location.search), fresh=q.get('r');
    const kind=(fresh&&/^[a-z0-9_-]{1,40}$/i.test(fresh))?'scan':'visit';
    const via=kind==='scan'?(q.get('s')==='qr'?'qr':'link'):null;   // QR referral baru membawa &s=qr
    fetch(`${SB_URL}/rest/v1/traffic`,{method:'POST',
      headers:{apikey:SUPABASE_ANON_KEY,Authorization:`Bearer ${SUPABASE_ANON_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},
      body:JSON.stringify({kind,driver_slug:getRef()||null,via})}).catch(()=>{});
  }catch(e){}
}

/* ---------- Hero, kontak & media sosial: isinya bisa diatur di panel -> Pengaturan ---------- */
// Gambar latar: nama file di folder images, atau alamat https penuh. Tanda kutip/kurung ditolak (aman untuk CSS url()).
function heroImageUrl(v){
  v=String(v||'').trim(); if(!v) return '';
  if(/["'()\\\s<>]/.test(v)) return '';
  if(/^https:\/\//i.test(v)) return v;
  return /^[a-z0-9_.\-\/]+$/i.test(v) ? 'images/'+v.replace(/^\/+/,'') : '';
}
function applyHero(){
  const h=document.getElementById('heroTitle'), p=document.getElementById('heroSub'), hero=document.getElementById('home'), bg=document.getElementById('heroBg');
  const ms=currentLang==='ms';
  const title=String((ms?SETTINGS.hero_title_ms:SETTINGS.hero_title)||'').trim();
  const sub=String((ms?SETTINGS.hero_subtitle_ms:SETTINGS.hero_subtitle)||'').trim();
  if(h) h.textContent=title||t('hero_title');
  if(p) p.textContent=sub||t('hero_sub');
  const url=heroImageUrl(SETTINGS.hero_bg_image);
  if(hero&&bg){
    if(url){ bg.style.backgroundImage=`url("${url}")`; hero.classList.add('has-img'); }
    else{ bg.style.backgroundImage=''; hero.classList.remove('has-img'); }
  }
}
function socialUrl(v){ v=String(v||'').trim(); return /^https:\/\/[^\s"'<>]+$/i.test(v) ? v : ''; }
function formatWaLocal(n){ const d=String(n||''); if(!d.startsWith('62')) return '+'+d; const x='0'+d.slice(2); return x.replace(/^(\d{4})(\d{4})(\d+)$/,'$1-$2-$3'); }
function waLink(msg){ return `https://wa.me/${WA_NUMBER}`+(msg?`?text=${encodeURIComponent(msg)}`:''); }
function applyContacts(){
  const fb=document.getElementById('floatingWaBtn'); if(fb) fb.href=waLink(t('wa_float_msg'));
  const set=(id,url)=>{ const a=document.getElementById(id); if(!a) return; if(url){ a.href=url; a.hidden=false; } else { a.removeAttribute('href'); a.hidden=true; } };
  set('socWa', waLink(''));
  set('socIg', socialUrl(SETTINGS.social_instagram));
  set('socTiktok', socialUrl(SETTINGS.social_tiktok));
  set('socFb', socialUrl(SETTINGS.social_facebook));
  const txt=document.getElementById('footerWaText'); if(txt) txt.textContent='WhatsApp '+formatWaLocal(WA_NUMBER);
  refreshTripCustomLink();
}

// Sewa berbatas 12 jam: tampilkan jam selesai dari jam jemput
function updateDurasi(){
  const sel=document.getElementById('formJam'); const v=(sel&&sel.value)||'';
  const m=/^(\d{2}):(\d{2})$/.exec(v);
  let selesai='';
  if(m){ const h=parseInt(m[1],10)+12; selesai=String(h%24).padStart(2,'0')+':'+m[2]+(h>=24?t('dur_nextday'):''); }
  const sedia=sel?[...sel.options].some(o=>!o.disabled):true;
  const note=document.getElementById('durasiNote');
  if(note) note.innerHTML=(m?t('dur_with',{start:v,end:selesai}):t('dur_base'))
    +(BOOKING_MIN_HOURS>0?'<br>'+t('dur_min',{n:BOOKING_MIN_HOURS}):'')
    +(sedia?'':'<br>'+t('dur_none'));
  const rd=document.getElementById('resDurasi'); if(rd) rd.textContent=m?t('res_dur_val',{start:v,end:selesai}):t('res_dur');
}

// Batas waktu pemesanan (server create-order tetap penentu akhirnya)
function pickupMs(tgl, jam){ const x=Date.parse(`${tgl}T${jam||'00:00'}:00+07:00`); return Number.isFinite(x)?x:NaN; }
function batasMs(){ return Date.now()+BOOKING_MIN_HOURS*3600*1000; }
function tanggalWIB(offsetHari){ return new Date(Date.now()+7*3600*1000+offsetHari*86400*1000).toISOString().slice(0,10); }
let tglDiubahPelanggan=false;
function updateBatasWaktu(){
  const tglEl=document.getElementById('formTanggal'), jamEl=document.getElementById('formJam');
  if(!tglEl||!jamEl) return;
  const nilai=(o)=>o.value||o.textContent;
  const terakhir=[...jamEl.options].map(nilai).sort().pop();
  let awal=null;
  for(let i=0;i<400;i++){ const d=tanggalWIB(i); if(pickupMs(d,terakhir)>=batasMs()){ awal=d; break; } }
  if(!awal) awal=tanggalWIB(0);
  tglEl.min=awal;
  if(!tglEl.value||tglEl.value<awal||!tglDiubahPelanggan) tglEl.value=awal;
  [...jamEl.options].forEach(o=>{ o.disabled=!(pickupMs(tglEl.value,nilai(o))>=batasMs()); });
  const terpilih=jamEl.selectedOptions[0];
  if(terpilih&&terpilih.disabled){ const pertama=[...jamEl.options].find(o=>!o.disabled); if(pertama) jamEl.value=nilai(pertama); }
  updateDurasi();
  if(tglEl.value!==cekTgl) cekKetersediaan();
}

async function initRemoteData(){
  logTraffic();
  try{
    const rows=await sbGet('fleet?select=*&is_active=eq.true&order=sort_order.asc');
    if(Array.isArray(rows)&&rows.length){
      const mapped=rows.map(mapFleetRow);
      if(fleetSig(mapped)!==fleetSig(ARMADA_DATA)){ ARMADA_DATA=mapped; refreshDynamic(); }
    }
  }catch(e){ console.warn('fleet:',e); }
  try{
    const rows=await sbGet('app_settings?select=key,value&is_public=eq.true');
    const s={}; (rows||[]).forEach(r=>{ s[r.key]=r.value; });
    SETTINGS=s;
    const n=(v,d)=>{ const x=parseInt(v); return isNaN(x)?d:x; };
    CROSS_2=n(s.cross_cost_2,CROSS_2); CROSS_3=n(s.cross_cost_3,CROSS_3); DP_PERCENT=n(s.dp_percent,DP_PERCENT);
    { const mh=parseFloat(s.booking_min_hours); if(Number.isFinite(mh)) BOOKING_MIN_HOURS=Math.min(Math.max(0,mh),1440); }
    { const w=normalizeWA(String(s.admin_wa||'')); if(w.length>=10&&w.length<=15) WA_NUMBER=w; }
    applyHero(); applyContacts(); calculateLive(); updateBatasWaktu();
  }catch(e){ console.warn('settings:',e); }
  try{ renderBanners(await sbGet('banners?select=*&order=sort_order.asc')); }catch(e){ console.warn('banners:',e); }
}

/* ---------- Ketersediaan armada per tanggal (SQL 83). Server (create-order) tetap penjaga utama;
   di sini hanya supaya pelanggan tidak memilih armada yang sudah penuh. ---------- */
let PENUH=new Set(), SISA={}, cekTgl='';
async function cekKetersediaan(){
  const tgl=document.getElementById('formTanggal')?.value||''; if(!/^\d{4}-\d{2}-\d{2}$/.test(tgl)) return;
  cekTgl=tgl;
  try{
    const panggil=(fn)=>fetch(`${SB_URL}/rest/v1/rpc/${fn}`,{method:'POST',headers:{apikey:SUPABASE_ANON_KEY,Authorization:`Bearer ${SUPABASE_ANON_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({p_tanggal:tgl})});
    let r=await panggil('status_armada');                  // penuh + sisa 1–3 (SQL 87)
    if(r.status===404) r=await panggil('armada_penuh');     // cadangan kalau SQL 87 belum dijalankan
    if(!r.ok) throw new Error('HTTP '+r.status);
    const rows=await r.json(); if(cekTgl!==tgl) return;
    const arr=Array.isArray(rows)?rows:[];
    PENUH=new Set(arr.filter(x=>x.penuh!==false).map(x=>x.fleet_id));
    SISA={}; arr.forEach(x=>{ if(x.penuh===false&&Number(x.sisa)>0) SISA[x.fleet_id]=Number(x.sisa); });
  }catch(e){ console.warn('ketersediaan:',e); PENUH=new Set(); SISA={}; }
  terapkanKetersediaan();
}
function terapkanKetersediaan(){
  const sel=document.getElementById('calcUnit'); if(!sel) return;
  const tadi=getSelectedArmada();
  [...sel.options].forEach(o=>{ if(!o.dataset.id) return;
    const u=ARMADA_DATA.find(x=>x.id===o.dataset.id); const penuh=PENUH.has(o.dataset.id);
    o.disabled=penuh; o.textContent=t('opt_label',{name:u?u.name:o.dataset.name,price:formatPrice(u?u.price:o.value)})+(penuh?t('opt_full'):(SISA[o.dataset.id]?t('opt_left',{n:SISA[o.dataset.id]}):'')); });
  let note=document.getElementById('availNote');
  if(!note){ const d=document.getElementById('durasiNote'); if(!d) return; note=document.createElement('div'); note.id='availNote'; note.className='rounded-xl p-3 text-[12px]'; note.setAttribute('role','status'); note.style.cssText='background:#fef2f2;border:1px solid #fecaca;color:#991b1b'; d.after(note); }
  const penuhAktif=ARMADA_DATA.filter(u=>PENUH.has(u.id));
  const sedikit=ARMADA_DATA.filter(u=>!PENUH.has(u.id)&&SISA[u.id]);
  const merah='background:#fef2f2;border:1px solid #fecaca;color:#991b1b', kuning='background:#fffbeb;border:1px solid #fde68a;color:#92400e';
  const nm=(u)=>u.shortName||u.name;
  if(!penuhAktif.length&&!sedikit.length){ note.hidden=true; note.innerHTML=''; }
  else if(penuhAktif.length>=ARMADA_DATA.length){
    const tgl=document.getElementById('formTanggal')?.value||'';
    note.style.cssText=merah; note.innerHTML=t('av_all',{wa:esc(waLink(t('av_wa_msg',{tgl})))}); note.hidden=false;
  } else {
    note.textContent=''; note.style.cssText=penuhAktif.length?merah:kuning;
    const baris=[];
    if(penuhAktif.length) baris.push(t('av_some',{list:penuhAktif.map(nm).join(', ')}));
    if(sedikit.length) baris.push(t('av_low',{list:sedikit.map(u=>`${nm(u)} (${SISA[u.id]} unit)`).join(', ')}));
    baris.forEach((b,i)=>{ if(i) note.appendChild(document.createElement('br')); note.appendChild(document.createTextNode(b)); });
    note.hidden=false;
  }
  if(tadi&&PENUH.has(tadi.id)){ sel.selectedIndex=0; calculateLive(); checkCapacityLive(); }
}

/* ---------- Ulasan asli pelanggan (SQL 92). Bagian dibuat di sini, tepat sebelum FAQ,
   HANYA kalau sudah ada ulasan yang ditampilkan admin. ---------- */
let ULASAN={list:[],jumlah:0,rata:null};
async function muatUlasan(){
  try{
    const h={apikey:SUPABASE_ANON_KEY,Authorization:`Bearer ${SUPABASE_ANON_KEY}`,'Content-Type':'application/json'};
    const [a,b]=await Promise.all([
      fetch(`${SB_URL}/rest/v1/rpc/ulasan_tampil`,{method:'POST',headers:h,body:JSON.stringify({p_limit:12})}),
      fetch(`${SB_URL}/rest/v1/rpc/ringkasan_ulasan`,{method:'POST',headers:h,body:'{}'})]);
    if(!a.ok||!b.ok) return;
    const list=await a.json(), sum=await b.json(); const r=Array.isArray(sum)?sum[0]:sum;
    ULASAN={list:Array.isArray(list)?list:[],jumlah:Number(r&&r.jumlah)||0,rata:r&&r.rata!=null?Number(r.rata):null};
    renderUlasan();
  }catch(e){ console.warn('ulasan:',e); }
}
function renderUlasan(){
  let sec=document.getElementById('ulasan');
  if(!ULASAN.list.length){ if(sec) sec.remove(); return; }
  if(!sec){ const faq=document.getElementById('faq'); if(!faq) return; sec=document.createElement('section'); sec.id='ulasan'; sec.className='py-24 theme-section border-t'; sec.style.borderColor='var(--border-soft)'; faq.before(sec); }
  const loc=currentLang==='ms'?'ms-MY':'id-ID';
  const bulan=(ym)=>{ const m=/^(\d{4})-(\d{2})$/.exec(ym||''); return m?new Date(Date.UTC(+m[1],+m[2]-1,15)).toLocaleDateString(loc,{month:'long',year:'numeric',timeZone:'UTC'}):''; };
  const rata=ULASAN.rata!=null?ULASAN.rata.toLocaleString(loc,{minimumFractionDigits:1,maximumFractionDigits:1}):'-';
  const kartu=ULASAN.list.map(u=>{ const n=Math.max(1,Math.min(5,Number(u.bintang)||0));
    return `<article class="theme-card border" style="width:290px;border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:10px">
      <div aria-label="${n}/5" style="color:#f59e0b;font-size:18px;letter-spacing:2px">${'★'.repeat(n)}<span style="color:var(--border-color)">${'★'.repeat(5-n)}</span></div>
      ${u.teks?`<p style="margin:0;font-size:13.5px;line-height:1.6;color:var(--text-secondary);white-space:pre-line;display:-webkit-box;-webkit-line-clamp:7;-webkit-box-orient:vertical;overflow:hidden">"${esc(u.teks)}"</p>`:''}
      <p style="margin:auto 0 0;font-size:12px;color:var(--text-muted)"><b style="color:var(--text-primary)">${esc(u.nama)}</b>${u.armada?' · '+esc(u.armada):''}${u.bulan?' · '+esc(bulan(u.bulan)):''}</p>
    </article>`; }).join('');
  sec.innerHTML=`<div class="max-w-7xl mx-auto px-4">
    <div class="text-center max-w-2xl mx-auto mb-12"><h2 class="text-3xl md:text-[38px] font-serif uppercase tracking-widest" style="color:var(--accent)">${esc(t('rv_title'))}</h2>
      <div class="w-16 h-[2px] mx-auto mt-5" style="background:var(--accent)"></div>
      <p class="text-[13px] mt-3 font-semibold" style="color:var(--text-muted)">${esc(t('rv_sub',{rata,n:ULASAN.jumlah}))}</p></div>
    <div class="flex items-center gap-3">
      <button type="button" class="slider-arrow hidden sm:flex" data-slide="ulasanTrack" data-dir="-1" aria-label="${esc(t('rv_left'))}">‹</button>
      <div class="slider-track" id="ulasanTrack" style="flex:1">${kartu}</div>
      <button type="button" class="slider-arrow hidden sm:flex" data-slide="ulasanTrack" data-dir="1" aria-label="${esc(t('rv_right'))}">›</button>
    </div></div>`;
}

/* ---------- Destinasi & paket (paket = template destinasi, harga tetap dari armada) ---------- */
const DESTINASI_DATA={lembang:["Tangkuban Perahu","Floating Market","Farmhouse Susu Lembang","Orchid Forest Cikole","Dusun Bambu","The Great Asia Africa","Lembang Park & Zoo","De Ranch Lembang","Grafika Cikole","Maribaya & The Lodge","Fairy Garden","Kebun Strawberry Lembang"],dago:["Tebing Keraton","Dago Dreampark","Tahura Djuanda","Punclut & Cakrawala","Lawangwangi & Dago Tea House","Bukit Bintang","Gedung Sate, Braga & Alun-alun","Trans Studio Bandung"],ciwidey:["Kawah Putih","Ranca Upas & Rusa","Situ Patenggang","Glamping Lakeside Rancabali","Kawah Rengganis","Barusen Hills","Ciwidey Valley","Kebun Teh Rancabali","Pinisi Resto & Danau"],pangalengan:["Nimo Highland","Situ Cileunca & Rafting","Wayang Windu Panenjoan","Pineus Tilu","Sunrise Point Cukul","Kebun Teh Malabar","Riung Gunung","Situ Cipanunjang"]};
const PAKET={
  lembang:{lembang:["Tangkuban Perahu","Floating Market","Farmhouse Susu Lembang","Orchid Forest Cikole"]},
  dago:{dago:["Tebing Keraton","Tahura Djuanda","Punclut & Cakrawala","Gedung Sate, Braga & Alun-alun"]},
  ciwidey:{ciwidey:["Kawah Putih","Ranca Upas & Rusa","Situ Patenggang","Kebun Teh Rancabali"]},
  pangalengan:{pangalengan:["Nimo Highland","Situ Cileunca & Rafting","Wayang Windu Panenjoan","Kebun Teh Malabar"]},
  lembang_dago:{lembang:["Tangkuban Perahu","Farmhouse Susu Lembang"],dago:["Tebing Keraton","Punclut & Cakrawala"]}
};
const OUTER=['lembang','ciwidey','pangalengan'];
const REGION_NAME={lembang:'Lembang',ciwidey:'Ciwidey',pangalengan:'Pangalengan'};

function getSelectedArmada(){const s=document.getElementById('calcUnit');if(!s||!s.value||s.selectedIndex<=0)return null;const o=s.options[s.selectedIndex];return{id:o.dataset.id,name:o.dataset.name,cap:parseInt(o.dataset.cap)||0,capmax:parseInt(o.dataset.capmax)||0,price:parseInt(o.value)||0};}
function selectUnitById(id){ const s=document.getElementById('calcUnit'); for(let i=0;i<s.options.length;i++){ if(s.options[i].dataset.id===id){ s.selectedIndex=i; return true; } } return false; }
function selectUnitFromCard(id){
  if(PENUH.has(id)){ const u=ARMADA_DATA.find(x=>x.id===id); notify(t('av_card_full',{car:u?u.name:id})); document.getElementById('pesan').scrollIntoView({behavior:'smooth'}); return; }
  selectUnitById(id); calculateLive(); checkCapacityLive(); document.getElementById('pesan').scrollIntoView({behavior:'smooth'});
}
function cheapestUnit(){ return ARMADA_DATA.reduce((a,u)=>(!a||u.price<a.price)?u:a,null); }

function pilihPaket(key){
  const p=PAKET[key]; if(!p) return;
  document.querySelectorAll('input[name="destinasi"]').forEach(cb=>{ cb.checked=!!(p[cb.dataset.group]&&p[cb.dataset.group].includes(cb.value)); });
  if(!getSelectedArmada()){   // armada pilihan pelanggan tidak ditimpa; Calya, atau termurah yang belum penuh
    const bisa=ARMADA_DATA.filter(u=>!PENUH.has(u.id)).sort((a,b)=>a.price-b.price);
    const c=bisa.find(u=>u.id==='calya')||bisa[0]; if(c) selectUnitById(c.id);
  }
  calculateLive(); checkCapacityLive();
  openAccordion(Object.keys(p)[0]);
  document.getElementById('pesan').scrollIntoView({behavior:'smooth'});
}
function renderPaketPrices(){
  const a=getSelectedArmada(), c=cheapestUnit();
  document.querySelectorAll('[data-paket-price]').forEach(el=>{
    el.textContent=a?t('pk_with',{price:formatPrice(a.price),car:a.name}):(c?t('pk_from',{price:formatPrice(c.price)}):'');
  });
}

function initInnerArmadaSliders(){
  if(window._armadaTimers) window._armadaTimers.forEach(clearInterval);
  window._armadaTimers=[];
  document.querySelectorAll('.armada-img-container').forEach(c=>{
    const slides=c.querySelectorAll('.armada-img-slide'); const dots=c.querySelectorAll('.armada-img-dot');
    if(slides.length<=1) return; let idx=0;
    const show=(i)=>{ slides.forEach((s,j)=>s.classList.toggle('active',j===i)); dots.forEach((d,j)=>{ d.style.background=j===i?'var(--accent)':'var(--border-soft)'; }); };
    window._armadaTimers.push(setInterval(()=>{ idx=(idx+1)%slides.length; show(idx); },4000));
  });
}

function renderArmada(){
  const cards=document.getElementById('armada-cards'), tbody=document.getElementById('armada-harga-body'), sel=document.getElementById('calcUnit'), destWrapper=document.getElementById('destinasi-wrapper');
  cards.innerHTML=''; tbody.innerHTML=''; sel.innerHTML=''; destWrapper.innerHTML='';
  Object.keys(DESTINASI_DATA).forEach(g=>{
    const w=document.createElement('div'); w.className='rounded-xl border overflow-hidden shadow-sm'; w.style.background='var(--bg-section-alt)'; w.style.borderColor='var(--border-soft)';
    w.innerHTML=`<button type="button" onclick="toggleAccordion('${g}')" class="w-full flex items-center justify-between p-4 text-sm font-semibold" style="color:var(--text-primary)"><span>${esc(t('grp_'+g,{n:DESTINASI_DATA[g].length}))}</span><div class="flex items-center gap-2"><span id="count-${g}" class="text-[10px] px-2 py-1 rounded-full font-bold" style="background:var(--accent-glow);color:var(--accent)">${esc(t('picked',{n:0}))}</span>▾</div></button><div id="acc-${g}" class="accordion-content"><div class="p-4 pt-0"><div class="flex justify-between items-center mb-3 pb-2 border-b" style="border-color:var(--border-soft)"><span class="text-[11px]" style="color:var(--text-muted)">${esc(t('pick_hint'))}</span><button type="button" onclick="selectAllInGroup('${g}',true)" class="text-[11px] font-bold" style="color:var(--accent)">${esc(t('pick_all'))}</button></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs" id="dest-${g}"></div><div class="mt-3 flex justify-end"><button type="button" onclick="selectAllInGroup('${g}',false)" class="text-[10px]" style="color:var(--text-muted)">${esc(t('clear_all'))}</button></div></div></div>`;
    destWrapper.appendChild(w);
    w.querySelector(`#dest-${g}`).innerHTML=DESTINASI_DATA[g].map(v=>`<label class="dest-item flex gap-2 items-center cursor-pointer"><input type="checkbox" name="destinasi" data-group="${g}" value="${esc(v)}" class="dest-checkbox w-4 h-4 rounded"><span style="color:var(--text-secondary)">${esc(v)}</span></label>`).join('');
  });
  document.querySelectorAll('input[name="destinasi"]').forEach(cb=>cb.addEventListener('change',calculateLive));
  const ph=document.createElement('option'); ph.value=''; ph.textContent=t('opt_placeholder'); ph.disabled=true; ph.selected=true; sel.appendChild(ph);
  ARMADA_DATA.forEach(unit=>{
    const imgs=(unit.images&&unit.images.length)?unit.images:[''];
    const cap=t('cap_comfort',{n:unit.capacityNum});
    const card=document.createElement('div'); card.className='armada-card-uniform rounded-[24px] overflow-hidden flex flex-col h-full theme-card border';
    card.innerHTML=`<div class="h-48 bg-black relative overflow-hidden armada-img-container"><div class="armada-img-track relative w-full h-full">${imgs.map((img,i)=>`<div class="armada-img-slide ${i===0?'active':''}">${img?`<img src="${esc(imgSrc(img))}" loading="lazy" alt="Sewa ${esc(unit.name)} Bandung" class="w-full h-full object-contain p-2">`:''}</div>`).join('')}</div>${unit.badge?`<div class="absolute top-3 left-3 px-3 py-1 rounded-full z-10" style="background:var(--accent);color:var(--on-accent)"><span class="text-[9px] font-bold uppercase">${esc(unit.badge)}</span></div>`:''}<div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">${imgs.length>1?imgs.map((_,i)=>`<div class="w-1.5 h-1.5 rounded-full armada-img-dot" style="background:${i===0?'var(--accent)':'var(--border-soft)'}"></div>`).join(''):''}</div></div><div class="p-6 flex flex-col flex-grow" style="background:var(--bg-card)"><h3 class="text-[15px] font-bold" style="color:var(--text-primary)">${esc(unit.name)}</h3><p class="text-[10px] uppercase mb-3 font-bold" style="color:var(--accent)">${esc(t('card_cap',{cap,max:unit.capacityMax}))}</p><ul class="text-[11px] space-y-2.5 mb-6 border-y py-4 flex-grow" style="color:var(--text-secondary);border-color:var(--border-soft)"><li>${t('card_people',{cap:esc(cap),max:esc(unit.capacityMax)})}</li>${unit.baggage?`<li>🧳 ${esc(unit.baggage)}</li>`:''}${unit.maxInfo?`<li>💺 ${esc(unit.maxInfo)}</li>`:''}${unit.note?`<li class="${esc(unit.noteClass)}">${esc(unit.note)}</li>`:''}</ul><button type="button" data-unit="${esc(unit.id)}" class="block text-center w-full font-bold py-3 rounded-full text-[10px] mt-auto" style="background:var(--accent);color:var(--on-accent)">${esc(t('card_btn',{price:formatPrice(unit.price)}))}</button></div>`;
    cards.appendChild(card);
    const tr=document.createElement('tr');
    tr.innerHTML=`<td class="py-5 px-6 font-bold text-[13px]">${esc(unit.name)}</td><td class="py-5 px-6 text-center"><b>${esc(unit.capacityNum)}</b> / ${esc(unit.capacityMax)}</td><td class="py-5 px-6 text-xs">${esc(unit.baggage)}</td><td class="py-5 px-6 font-bold text-right" style="color:var(--accent)">${formatPrice(unit.price)}</td><td class="py-5 px-6 text-center"><button type="button" data-unit="${esc(unit.id)}" class="border text-[10px] px-4 py-1.5 rounded-full" style="background:var(--bg-card);border-color:var(--border-color)">${esc(t('tbl_pick'))}</button></td>`;
    tbody.appendChild(tr);
    const opt=document.createElement('option'); opt.value=unit.price; opt.dataset.id=unit.id; opt.dataset.name=unit.shortName||unit.name; opt.dataset.cap=unit.capacityNum; opt.dataset.capmax=unit.capacityMax;
    opt.textContent=t('opt_label',{name:unit.name,price:formatPrice(unit.price)}); sel.appendChild(opt);
  });
  setTimeout(initInnerArmadaSliders,200);
}
document.addEventListener('click',(e)=>{ const b=e.target.closest('[data-unit]'); if(b) selectUnitFromCard(b.dataset.unit); });
document.addEventListener('click',(e)=>{ const b=e.target.closest('[data-paket]'); if(b) pilihPaket(b.dataset.paket); });

function toggleAccordion(g){ const c=document.getElementById('acc-'+g); if(!c) return; const isOpen=c.classList.contains('open'); document.querySelectorAll('.accordion-content').forEach(x=>x.classList.remove('open')); if(!isOpen) c.classList.add('open'); }
function openAccordion(g){ const c=document.getElementById('acc-'+g); if(!c) return; document.querySelectorAll('.accordion-content').forEach(x=>x.classList.remove('open')); c.classList.add('open'); }
function focusRegion(r){ openAccordion(r); document.getElementById('acc-'+r)?.scrollIntoView({behavior:'smooth',block:'center'}); }
function selectAllInGroup(g,checked){ document.querySelectorAll(`input[name="destinasi"][data-group="${g}"]`).forEach(cb=>cb.checked=checked); calculateLive(); }
function onlyRegion(keep){ OUTER.filter(g=>g!==keep).forEach(g=>document.querySelectorAll(`input[name="destinasi"][data-group="${g}"]`).forEach(cb=>cb.checked=false)); calculateLive(); }

function checkCapacityLive(){
  const j=parseInt(document.getElementById('formJumlah').value)||0;
  const info=document.getElementById('resCapacityInfo'), txt=document.getElementById('resCapacityText');
  if(j<=0||!info||!txt){ if(info) info.classList.add('hidden'); return false; }
  const a=getSelectedArmada(); if(!a){ info.classList.add('hidden'); return false; }
  info.classList.remove('hidden');
  if(j<=a.cap){ txt.innerHTML=`<span style="color:#059669">${esc(t('cap_ok',{n:j,car:a.name}))}</span>`; return false; }
  if(j<=a.capmax){ txt.innerHTML=`<span style="color:#D97706">${esc(t('cap_warn',{n:j,cap:a.cap,max:a.capmax}))}</span>`; return 'over_comfort'; }
  txt.innerHTML=`<span style="color:#DC2626">${esc(t('cap_over',{n:j,max:a.capmax}))}</span>`; return 'over_max';
}

// Jumlah wilayah & biaya lintas dari centang destinasi. Kota Bandung (grup 'dago') = titik 0, tidak dihitung.
function getRegionInfo(){
  const has=(k)=>document.querySelectorAll(`input[name="destinasi"][data-group="${k}"]:checked`).length>0;
  const list=OUTER.filter(has); const count=list.length;
  return { count, list, cost: count===2?CROSS_2:(count===3?CROSS_3:0) };
}

function calculateLive(){
  const sel=document.getElementById('calcUnit');
  const base=parseInt(sel.value)||0;
  const hasArmada=!!(sel.value&&sel.selectedIndex>0);
  Object.keys(DESTINASI_DATA).forEach(g=>{ const el=document.getElementById('count-'+g); if(el) el.textContent=t('picked',{n:document.querySelectorAll(`input[name="destinasi"][data-group="${g}"]:checked`).length}); });
  const region=getRegionInfo(); const cost=region.cost;
  const hasC=region.list.includes('ciwidey'), hasP=region.list.includes('pangalengan');
  let crossType='none', labelCost='';
  if(region.count===2){ if(hasC&&hasP){ crossType='beda_lembah'; labelCost=t('lbl_beda_lembah'); } else { crossType='utara_selatan'; labelCost=t('lbl_utsel'); } }
  else if(region.count===3){ crossType='tiga_penjuru'; labelCost=t('lbl_tiga'); }
  const a=getSelectedArmada();
  const setTxt=(id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=v; };
  if(!hasArmada){
    setTxt('resArmadaName',t('not_chosen')); setTxt('resArmadaCap',t('choose_above')); setTxt('resBasePrice','Rp 0');
    setTxt('resRegionCost','Rp 0'); setTxt('resRegionLabel',''); setTxt('resTotalPrice','Rp 0');
    setTxt('mobileArmadaName',t('not_chosen')); setTxt('mobileTotalPrice','Rp 0');
    document.getElementById('mobileStickyBar')?.classList.add('hidden');
  } else {
    setTxt('resArmadaName',a.name); setTxt('resArmadaCap',t('cap_line',{cap:a.cap,max:a.capmax}));
    setTxt('resBasePrice',formatPrice(base)); setTxt('resRegionCost',formatPrice(cost)); setTxt('resRegionLabel',labelCost);
    setTxt('resTotalPrice',formatPrice(base+cost)); setTxt('mobileArmadaName',a.name); setTxt('mobileTotalPrice',formatPrice(base+cost));
    document.getElementById('mobileStickyBar')?.classList.remove('hidden');
  }
  updatePaymentPreview(hasArmada?(base+cost):0);
  renderPaketPrices();
  const listEl=document.getElementById('resSelectedList'); const all=document.querySelectorAll('input[name="destinasi"]:checked');
  if(!all.length) listEl.textContent=t('none_yet');
  else{ const g={}; all.forEach(cb=>{ (g[cb.dataset.group]=g[cb.dataset.group]||[]).push(cb.value); });
    listEl.textContent=Object.keys(g).map(k=>`${(k==='dago'?t('kota'):REGION_NAME[k]).toUpperCase()}: ${g[k].join(', ')}`).join(' | '); }
  renderCrossWarning(crossType,base,cost);
}

function renderCrossWarning(crossType,base,cost){
  const warn=document.getElementById('crossTripWarning'); if(!warn) return;
  if(crossType==='none'){ warn.classList.add('hidden'); warn.innerHTML=''; return; }
  const rp=(v)=>formatPrice(v);
  if(crossType==='beda_lembah'){
    warn.className='rounded-[20px] border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-5 mt-4';
    warn.innerHTML=`<div class="flex gap-3"><div class="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold shrink-0">!</div><div class="flex-1">
      <div class="flex items-center gap-2 flex-wrap"><p class="text-[11px] font-black tracking-[0.12em] text-amber-800 uppercase">${t('w_bl_title')}</p><span class="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-white">${t('w_bl_badge')}</span></div>
      <p class="mt-2 text-[13px] font-semibold leading-snug text-zinc-800">${t('w_bl_desc')}</p>
      <div class="mt-3 bg-white rounded-xl border border-amber-200 p-3 flex items-center justify-between"><div class="text-center"><div class="text-[9px] text-zinc-400">CIWIDEY</div><div class="font-bold text-[11px]">Kawah Putih</div></div><div class="flex-1 px-2 text-center"><div class="text-[9px] text-zinc-400">${t('w_bl_via')}</div><div class="text-[10px] font-bold text-amber-600">${t('w_bl_route')}</div><div class="h-0.5 bg-amber-200 my-1 border-dashed border-t"></div></div><div class="text-center"><div class="text-[9px] text-zinc-400">PANGALENGAN</div><div class="font-bold text-[11px]">Wayang Windu</div></div></div>
      <div class="mt-3 rounded-xl bg-white/90 p-3 border border-amber-200"><div class="flex justify-between text-[11px]"><span class="text-zinc-500">${t('w_base')}</span><span class="font-semibold">${rp(base)}</span></div><div class="flex justify-between text-[11px] mt-1"><span class="text-amber-700 font-medium">${t('w_bl_add')}</span><span class="font-bold text-amber-700">${rp(cost)}</span></div><div class="mt-2 flex justify-between border-t pt-2 text-[13px] font-black"><span>${t('w_total')}</span><span>${rp(base+cost)}</span></div></div>
      <div class="mt-3 flex gap-2 flex-wrap"><button type="button" onclick="selectAllInGroup('pangalengan',false)" class="px-3 py-1.5 bg-white border rounded-full text-[10px] font-bold">${t('w_only_ciw')}</button><button type="button" onclick="selectAllInGroup('ciwidey',false)" class="px-3 py-1.5 bg-white border rounded-full text-[10px] font-bold">${t('w_only_pgl')}</button></div>
    </div></div>`;
  } else if(crossType==='utara_selatan'){
    warn.className='rounded-[20px] border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 p-5 mt-4';
    warn.innerHTML=`<div class="flex gap-3"><div class="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold shrink-0">!</div><div class="flex-1">
      <p class="text-[11px] font-black tracking-[0.12em] text-orange-800 uppercase">${t('w_us_title')}</p>
      <p class="mt-2 text-[13px] font-semibold text-zinc-800">${t('w_us_desc')}</p>
      <div class="mt-3 bg-white rounded-xl border border-orange-200 p-3 text-center"><div class="flex items-center justify-center gap-2 text-[11px] font-bold"><span>LEMBANG</span><span class="text-orange-500">↔ 65KM ↕</span><span>CIWIDEY / PANGALENGAN</span></div><div class="text-[10px] text-zinc-500 mt-1">${t('w_us_dist')}</div></div>
      <div class="mt-3 rounded-xl bg-white/90 p-3 border border-orange-200"><div class="flex justify-between text-[11px] mt-1"><span class="text-orange-700 font-medium">${t('w_us_add')}</span><span class="font-bold text-orange-700">${rp(cost)}</span></div><div class="mt-2 flex justify-between border-t pt-2 text-[13px] font-black"><span>${t('w_total')}</span><span>${rp(base+cost)}</span></div></div>
      <div class="mt-3"><button type="button" onclick="goTripCustom(2)" class="w-full bg-zinc-900 text-white rounded-full py-2.5 text-[11px] font-bold">${t('w_us_btn')}</button></div>
    </div></div>`;
  } else {
    warn.className='rounded-[20px] border-2 border-zinc-900 bg-zinc-900 text-white p-5 mt-4';
    warn.innerHTML=`<div class="flex flex-col">
      <div class="flex items-center gap-2 flex-wrap"><span class="bg-amber-400 text-black text-[10px] font-black px-2.5 py-1 rounded-full">${t('w_3_badge')}</span><span class="text-[10px] text-zinc-400">${t('w_3_dirs')}</span></div>
      <p class="mt-3 text-[15px] font-bold leading-tight">${t('w_3_title')}</p>
      <div class="mt-4 grid grid-cols-3 gap-2 text-center">
        <div class="bg-zinc-800 rounded-xl p-2.5 border border-zinc-700"><div class="text-[9px] text-zinc-400">07:00</div><div class="text-[11px] font-bold mt-1">LEMBANG</div><div class="text-[9px] text-amber-300">${t('w_north')}</div></div>
        <div class="bg-zinc-800 rounded-xl p-2.5 border border-zinc-700"><div class="text-[9px] text-zinc-400">11:30</div><div class="text-[11px] font-bold mt-1">CIWIDEY</div><div class="text-[9px] text-amber-300">${t('w_sw')}</div></div>
        <div class="bg-zinc-800 rounded-xl p-2.5 border-2 border-amber-400"><div class="text-[9px] text-amber-400">14:30</div><div class="text-[11px] font-bold mt-1">PANGALENGAN</div><div class="text-[9px] text-amber-300">${t('w_se')}</div></div>
      </div>
      <div class="mt-4 rounded-xl bg-white text-black p-3">
        <div class="flex justify-between gap-2 text-[11px]"><span class="text-zinc-500">${t('w_3_dist_l')}</span><span class="font-bold text-right">${t('w_3_dist_v')}</span></div>
        <div class="flex justify-between gap-2 text-[11px] mt-1.5"><span class="text-zinc-500">${t('w_3_photo_l')}</span><span class="font-bold text-red-500 text-right">${t('w_3_photo_v')}</span></div>
        <div class="mt-2 pt-2 border-t flex justify-between gap-2 text-[12px] font-black"><span>${t('w_3_add')}</span><span class="whitespace-nowrap">${rp(cost)}</span></div>
        <div class="mt-1 flex justify-between text-[13px] font-black"><span>${t('w_total')}</span><span>${rp(base+cost)}</span></div>
      </div>
      <p class="text-[11px] text-zinc-400 mt-3 leading-snug">${t('w_3_honest')}</p>
      <button type="button" onclick="goTripCustom(3)" class="mt-4 w-full bg-amber-400 text-black rounded-full py-3 text-[12px] font-black">${t('w_3_btn')}</button>
      <p class="text-[11px] text-zinc-400 mt-4 mb-2">${t('w_3_one')}</p>
      <div class="grid grid-cols-3 gap-2">${OUTER.map(r=>`<button type="button" onclick="onlyRegion('${r}')" class="bg-zinc-800 border border-zinc-700 rounded-full py-2.5 text-[11px] font-bold">${t('w_only',{r:REGION_NAME[r]})}</button>`).join('')}</div>
      <p class="text-[10px] text-zinc-500 mt-3">${t('w_3_keep')}</p>
    </div>`;
  }
}

/* ---------- Trip Custom: pilihan tujuan mengisi link WhatsApp ---------- */
const TRIP_CUSTOM={ soetta:'dest_soetta', garut:'Garut', tasik:'Tasikmalaya', jakarta:'Jakarta' };
let tcSelected='soetta', tcCustomMsg='';
function tripCustomMessage(){
  if(tcCustomMsg) return tcCustomMsg;
  if(tcSelected==='multi') return t('tc_msg_multi');
  if(tcSelected==='other') return t('tc_msg_other');
  const d=TRIP_CUSTOM[tcSelected]; return t('tc_msg_dest',{dest:d&&d.startsWith('dest_')?t(d):d});
}
function refreshTripCustomLink(){
  const box=document.getElementById('tcTujuan'), a=document.getElementById('tcWa'); if(!box||!a) return;
  box.querySelectorAll('.tc-chip').forEach(b=>{ const on=b.dataset.tc===tcSelected; b.classList.toggle('on',on); b.setAttribute('aria-pressed',String(on)); });
  a.href=waLink(tripCustomMessage());
}
function setTujuan(key,customMsg){ tcSelected=key; tcCustomMsg=customMsg||''; refreshTripCustomLink(); }
document.addEventListener('click',(e)=>{ const b=e.target.closest('.tc-chip'); if(b) setTujuan(b.dataset.tc); });
// Dari peringatan wilayah: arahkan ke Trip Custom dengan pesan berisi wilayah yang dipilih
function goTripCustom(days){
  const regions=getRegionInfo().list.map(r=>REGION_NAME[r]);
  if(document.querySelector('input[name="destinasi"][data-group="dago"]:checked')) regions.push(t('kota'));
  setTujuan('multi', t('tc_msg_days',{n:days,regions:regions.join(', ')||'-'}));
  document.getElementById('tripcustom')?.scrollIntoView({behavior:'smooth'});
}

/* ---------- Modal kapasitas (melebihi maksimal) ---------- */
let capacityModalLastFocus=null;
function showCapacityModal(jumlah,armada){
  const modal=document.getElementById('capacityModal'), box=document.getElementById('capacityModalBox');
  document.getElementById('capacityModalIcon').textContent='🚫';
  document.getElementById('capacityModalTitle').textContent=t('cm_title');
  document.getElementById('capacityModalText').textContent=t('cm_text',{n:jumlah,car:armada.name,max:armada.capmax});
  const actions=document.getElementById('capacityModalActions');
  actions.innerHTML=`<button type="button" onclick="closeCapacityModal()" class="cm-btn cm-ghost">${esc(t('cm_change'))}</button><button type="button" onclick="upgradeArmada()" class="cm-btn cm-main">${esc(t('cm_upgrade'))}</button>`;
  modal.classList.remove('hidden');
  capacityModalLastFocus=document.activeElement;
  const first=actions.querySelector('button'); if(first) first.focus(); else box.focus();
}
function closeCapacityModal(){ document.getElementById('capacityModal').classList.add('hidden'); if(capacityModalLastFocus&&capacityModalLastFocus.focus) capacityModalLastFocus.focus(); }
function upgradeArmada(){
  const j=parseInt(document.getElementById('formJumlah').value)||0;
  // armada termurah yang masih muat (kapasitas maksimal); kalau melebihi kapasitas nyaman, pelanggan tetap ditanya saat bayar
  const pilih=ARMADA_DATA.filter(u=>u.capacityMax>=j).sort((a,b)=>a.price-b.price)[0];
  closeCapacityModal();
  if(!pilih){ window.open(waLink(t('up_msg',{n:j})),'_blank'); return; }
  selectUnitFromCard(pilih.id);
}

/* ---------- Cuaca: latar mengikuti waktu (pagi/siang/sore/malam), ikon emoji berwarna ---------- */
const BANDUNG_LAT=-6.9175, BANDUNG_LON=107.6191;
const LOCATIONS={lembang:{name:'Lembang',lat:-6.8107,lon:107.6167,alt:1200},ciwidey:{name:'Ciwidey',lat:-7.1,lon:107.45,alt:1500},pangalengan:{name:'Pangalengan',lat:-7.2,lon:107.57,alt:1600}};
const WX={main:null,loc:{},failed:false};
function getWeatherType(code){ if(code===0) return 'sunny'; if([1,2].includes(code)) return 'partly'; if(code===3) return 'cloudy'; if([45,48].includes(code)) return 'fog'; if([51,53,55,56,57].includes(code)) return 'drizzle'; if([61,63,65,80,81,82].includes(code)) return 'rain'; if([95,96,99].includes(code)) return 'thunder'; return 'partly'; }
// \uFE0F memaksa tampilan emoji berwarna (tanpa itu sebagian HP menggambar ☁/☀ sebagai huruf hitam)
function getWeatherIcon(code,isDay){ const V='\uFE0F'; const x=getWeatherType(code);
  if(x==='sunny') return isDay?'☀'+V:'🌙'; if(x==='partly') return isDay?'🌤'+V:'☁'+V; if(x==='cloudy') return '☁'+V;
  if(x==='fog') return '🌫'+V; if(x==='drizzle') return '🌦'+V; if(x==='rain') return '🌧'+V; if(x==='thunder') return '⛈'+V; return '⛅'; }
function getWeatherDesc(code){ const d=WX_DESC[currentLang]||WX_DESC.id; return d[code]||d._; }
function wxPhase(){ const h=(new Date().getUTCHours()+7)%24; if(h>=5&&h<10) return 'pagi'; if(h>=10&&h<15) return 'siang'; if(h>=15&&h<18) return 'sore'; return 'malam'; }
function wxLocale(){ return currentLang==='ms'?'ms-MY':'id-ID'; }
function renderWeather(){
  const card=document.getElementById('weather-main-card'); if(!card) return;
  const phase=wxPhase();
  card.classList.remove('wx-pagi','wx-siang','wx-sore','wx-malam'); card.classList.add('wx-'+phase);
  const set=(id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=v; };
  set('weather-daynight',t('wx_'+phase));
  set('weather-time',new Date().toLocaleString(wxLocale(),{weekday:'long',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Jakarta'})+' WIB • '+t('wx_live'));
  const main=document.getElementById('weather-lottie-main');
  const d=WX.main;
  if(!d||!d.current){
    set('weather-temp','--'); set('weather-desc',WX.failed?'':t('wx_loading')); set('weather-feel','');
    if(main) main.textContent=''; return;
  }
  const c=d.current, isDay=c.is_day===1, code=c.weather_code;
  set('weather-temp',Math.round(c.temperature_2m));
  set('weather-desc',getWeatherDesc(code));
  set('weather-feel',t('wx_feels',{n:Math.round(c.apparent_temperature)})+(c.precipitation>0?` • ${c.precipitation} mm`:''));
  if(main) main.textContent=getWeatherIcon(code,isDay);
  set('weather-humidity',c.relative_humidity_2m+'%');
  set('weather-wind',Math.round(c.wind_speed_10m)+' km/h');
  const sun=document.getElementById('weather-sun');
  if(sun&&d.daily&&d.daily.sunrise){ const hm=(s)=>String(s||'').slice(11,16)||'--'; sun.textContent=`🌅 ${hm(d.daily.sunrise[0])} • 🌇 ${hm(d.daily.sunset[0])}`; }
  const hc=document.getElementById('weather-hourly');
  if(hc&&d.hourly){
    const now=Date.now(); let start=0;
    for(let i=0;i<d.hourly.time.length;i++){ if(Date.parse(d.hourly.time[i]+':00+07:00')>=now-3600*1000){ start=i; break; } }
    hc.innerHTML='';
    for(let i=start;i<Math.min(start+12,d.hourly.time.length);i++){
      const el=document.createElement('div'); el.className='wx-glass wx-hour';
      const jam=String(d.hourly.time[i]).slice(11,16);
      el.innerHTML=`<p class="wx-muted text-[10px]">${esc(i===start?t('wx_now'):jam)}</p><div class="text-[18px] my-1">${getWeatherIcon(d.hourly.weather_code[i],d.hourly.is_day[i]===1)}</div><p class="text-[12px] font-bold">${Math.round(d.hourly.temperature_2m[i])}°</p>`;
      hc.appendChild(el);
    }
  }
  Object.keys(LOCATIONS).forEach(renderLocCard);
}
function renderLocCard(key){
  const card=document.getElementById('card-'+key), loc=LOCATIONS[key], d=WX.loc[key]; if(!card) return;
  if(!d||!d.current){ card.innerHTML=`<div><p class="font-bold text-[13px]">${loc.name}</p><p class="wx-muted text-[10px]">${esc(t('wx_alt',{n:loc.alt.toLocaleString('id-ID')}))}</p></div>`; return; }
  card.innerHTML=`<div><p class="font-bold text-[13px]">${loc.name}</p><p class="wx-muted text-[10px]">${esc(t('wx_alt',{n:loc.alt.toLocaleString('id-ID')}))} • ${esc(getWeatherDesc(d.current.weather_code))}</p></div><div class="text-right"><div class="text-[22px]">${getWeatherIcon(d.current.weather_code,d.current.is_day===1)}</div><p class="font-bold text-[16px]">${Math.round(d.current.temperature_2m)}°</p></div>`;
}
async function fetchWeather(){
  try{
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${BANDUNG_LAT}&longitude=${BANDUNG_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,is_day&daily=sunrise,sunset&timezone=Asia%2FJakarta&forecast_days=2`;
    const r=await fetch(url); if(!r.ok) throw new Error('HTTP '+r.status);
    WX.main=await r.json(); WX.failed=false;
  }catch(e){ WX.failed=true; console.warn('cuaca:',e); }
  renderWeather();
  Object.keys(LOCATIONS).forEach(async key=>{
    try{ const loc=LOCATIONS[key];
      const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,weather_code,is_day&timezone=Asia%2FJakarta`);
      if(!r.ok) throw new Error('HTTP '+r.status); WX.loc[key]=await r.json(); renderLocCard(key);
    }catch(e){ renderLocCard(key); }
  });
}

/* ---------- Pilihan Lunas / DP (dibuat lewat JS, tepat sebelum tombol bayar) ---------- */
function initPaymentModeUI(){
  const btn=document.getElementById('submitBtn');
  if(!btn||!btn.parentNode||document.getElementById('paymentModeBox')) return;
  const box=document.createElement('div'); box.id='paymentModeBox'; box.className='pm-box';
  box.innerHTML=`<p class="pm-title" data-i18n="pm_title"></p>
    <div class="pm-grid">
      <label class="pm-opt"><input type="radio" name="paymentMode" value="lunas" checked><span data-pm-card="lunas" class="pm-card on"><b data-i18n="pm_full"></b><small data-i18n="pm_full_d"></small></span></label>
      <label class="pm-opt"><input type="radio" name="paymentMode" value="dp"><span data-pm-card="dp" class="pm-card"><b id="pmDpLabel"></b><small data-i18n="pm_dp_d"></small></span></label>
    </div>
    <p id="pmPreview" class="pm-preview"></p>`;
  btn.parentNode.insertBefore(box,btn);
  applyStaticText(box);
  box.querySelectorAll('input[name="paymentMode"]').forEach(r=>r.addEventListener('change',()=>{
    PAYMENT_MODE=r.value;
    box.querySelectorAll('[data-pm-card]').forEach(el=>el.classList.toggle('on',el.dataset.pmCard===r.value));
    calculateLive();
  }));
}
function updatePaymentPreview(total){
  const lbl=document.getElementById('pmDpLabel'); if(lbl) lbl.textContent=t('pm_dp',{p:DP_PERCENT});
  const prev=document.getElementById('pmPreview'); if(!prev) return;
  if(!total){ prev.textContent=''; return; }
  if(PAYMENT_MODE==='dp'){ const dp=Math.round(total*DP_PERCENT/100); prev.textContent=t('pm_prev_dp',{dp:formatPrice(dp),rest:formatPrice(total-dp)}); }
  else prev.textContent=t('pm_prev_full',{total:formatPrice(total)});
}

/* ---------- Dialog TEMPERA (pengganti alert/confirm bawaan browser) ---------- */
function temperaDialog({message,okText,cancelText=null}){
  return new Promise((resolve)=>{
    const lama=document.getElementById('temperaDialog'); if(lama) lama.remove();
    const fokusAwal=document.activeElement;
    const overlay=document.createElement('div'); overlay.id='temperaDialog';
    overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true'); overlay.setAttribute('aria-label','TEMPERA');
    overlay.style.cssText='position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.55)';
    const card=document.createElement('div');
    card.style.cssText='width:100%;max-width:380px;background:var(--bg-card);color:var(--text-primary);border:1px solid var(--border-color);border-radius:20px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.35)';
    const head=document.createElement('div'); head.style.cssText='display:flex;align-items:center;gap:10px;margin-bottom:12px';
    const logo=document.createElement('span'); logo.className='logo'; logo.style.setProperty('--w','26px');
    const judul=document.createElement('b'); judul.textContent='TEMPERA'; judul.style.cssText='letter-spacing:.22em;font-size:13px;color:var(--accent)';
    head.append(logo,judul);
    const pesan=document.createElement('p'); pesan.textContent=message;
    pesan.style.cssText='margin:0 0 18px;font-size:14px;line-height:1.55;white-space:pre-line;color:var(--text-secondary)';
    const baris=document.createElement('div'); baris.style.cssText='display:flex;gap:10px;justify-content:flex-end';
    const gaya='flex:1;padding:11px 14px;border-radius:999px;font-size:12px;font-weight:700;cursor:pointer;';
    let btnBatal=null;
    if(cancelText){ btnBatal=document.createElement('button'); btnBatal.type='button'; btnBatal.textContent=cancelText; btnBatal.style.cssText=gaya+'background:transparent;color:var(--text-primary);border:1px solid var(--border-color)'; baris.appendChild(btnBatal); }
    const btnOk=document.createElement('button'); btnOk.type='button'; btnOk.textContent=okText||t('dlg_ok');
    btnOk.style.cssText=gaya+'border:0;background:var(--accent);color:var(--on-accent)'; baris.appendChild(btnOk);
    card.append(head,pesan,baris); overlay.appendChild(card); document.body.appendChild(overlay);
    const kunci=document.body.style.overflow; document.body.style.overflow='hidden';
    const tutup=(hasil)=>{ document.removeEventListener('keydown',onKey,true); overlay.remove(); document.body.style.overflow=kunci; if(fokusAwal&&fokusAwal.focus){ try{ fokusAwal.focus(); }catch(e){} } resolve(hasil); };
    function onKey(e){
      if(e.key==='Escape'){ e.preventDefault(); tutup(false); }
      else if(e.key==='Tab'){ const el=btnBatal?[btnBatal,btnOk]:[btnOk]; const i=el.indexOf(document.activeElement); e.preventDefault(); el[(i+(e.shiftKey?el.length-1:1))%el.length].focus(); }
    }
    document.addEventListener('keydown',onKey,true);
    btnOk.addEventListener('click',()=>tutup(true));
    if(btnBatal) btnBatal.addEventListener('click',()=>tutup(false)); else overlay.addEventListener('click',(e)=>{ if(e.target===overlay) tutup(true); });
    btnOk.focus();
  });
}
function notify(message,okText){ return temperaDialog({message,okText:okText||t('dlg_ok')}).then(()=>{}); }
function askConfirm(message,okText,cancelText){ return temperaDialog({message,okText:okText||t('dlg_continue'),cancelText:cancelText||t('dlg_back')}); }

/* ---------- Bahasa berganti: gambar ulang bagian dinamis tanpa kehilangan isian pelanggan ---------- */
function refreshDynamic(){
  const sel=document.getElementById('calcUnit');
  const unitId=(sel&&sel.selectedIndex>0)?sel.options[sel.selectedIndex].dataset.id:null;
  const checked=new Set([...document.querySelectorAll('input[name="destinasi"]:checked')].map(cb=>cb.dataset.group+'|'+cb.value));
  const open=document.querySelector('.accordion-content.open'); const openId=open?open.id.replace('acc-',''):null;
  renderArmada();
  if(unitId) selectUnitById(unitId);
  terapkanKetersediaan();
  document.querySelectorAll('input[name="destinasi"]').forEach(cb=>{ cb.checked=checked.has(cb.dataset.group+'|'+cb.value); });
  if(openId) openAccordion(openId);
  calculateLive(); checkCapacityLive(); updateDurasi(); renderWeather(); applyHero(); applyContacts(); renderUlasan();
}

function normalizeWA(input){
  const raw=String(input||'').trim();
  let num=raw.replace(/[^0-9]/g,'');
  if(raw.startsWith('+')) return num;                         // sudah pakai kode negara (+62 / +60 / dll)
  if(num.startsWith('01')) return '60'+num.substring(1);      // nomor HP Malaysia: 01x -> 601x
  if(num.startsWith('0')) return '62'+num.substring(1);       // nomor HP Indonesia: 08x -> 628x
  if(num.startsWith('8')) return '62'+num;
  return num;
}

/* ---------- Asal pengunjung: link/QR driver (?r=slug), disimpan 30 hari ---------- */
function captureRef(){
  try{ const ref=new URLSearchParams(location.search).get('r');
    if(ref&&/^[a-z0-9_-]{1,40}$/i.test(ref)) localStorage.setItem('tempera_ref',JSON.stringify({slug:ref.toLowerCase(),t:Date.now()}));
  }catch(e){}
}
function getRef(){
  try{ const o=JSON.parse(localStorage.getItem('tempera_ref')||'null'); if(o&&o.slug&&Date.now()-o.t<30*86400000) return o.slug; }catch(e){}
  return '';
}
captureRef();

/* ---------- Pemesanan & pembayaran Midtrans (harga dihitung server, bukan browser) ---------- */
const MIDTRANS_ENDPOINT='https://wjmotidelqgcyyujacud.supabase.co/functions/v1/create-order';
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqbW90aWRlbHFnY3l5dWphY3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMzE2ODIsImV4cCI6MjEwNDkwNzY4Mn0.kZVRZhw0ryUcT-Pb7akpaO6vR4gOGwCkpD1kvk_uRac';

async function handleFormSubmitMidtrans(event){
  event.preventDefault();
  const nama=document.getElementById('formNama')?.value.trim()||'';
  const kontak=normalizeWA(document.getElementById('formKontak')?.value||'');
  if(!nama){ await notify(t('err_name')); return; }
  if(kontak.length<10||kontak.length>15){ await notify(t('err_wa')); return; }
  const armada=getSelectedArmada();
  if(!armada){ await notify(t('err_fleet')); return; }
  if(!document.querySelectorAll('input[name="destinasi"]:checked').length){ await notify(t('err_dest')); return; }
  const jumlahNum=parseInt(document.getElementById('formJumlah')?.value)||0;
  if(jumlahNum<=0){ await notify(t('err_pax')); return; }
  {
    const tglV=document.getElementById('formTanggal')?.value||'', jamV=document.getElementById('formJam')?.value||'';
    const jm=pickupMs(tglV,jamV);
    if(!Number.isFinite(jm)){ await notify(t('err_datetime')); return; }
    if(jm<batasMs()){ await notify(BOOKING_MIN_HOURS>0?t('err_min',{n:BOOKING_MIN_HOURS}):t('err_past')); return; }
  }
  if(jumlahNum>armada.capmax){ showCapacityModal(jumlahNum,armada); return; }
  if(jumlahNum>armada.cap){
    if(!(await askConfirm(t('ask_overcomfort',{n:jumlahNum,car:armada.name,cap:armada.cap,max:armada.capmax}),t('btn_keep'),t('btn_change_pax')))) return;
  }
  const region=getRegionInfo();
  if(region.count>=2){
    if(!(await askConfirm(t('ask_cross',{n:region.count,cost:formatPrice(region.cost)}),t('dlg_continue'),t('btn_change_choice')))) return;
  }
  const by={lembang:[],dago:[],ciwidey:[],pangalengan:[]};
  document.querySelectorAll('input[name="destinasi"]:checked').forEach(cb=>{ by[cb.dataset.group].push(cb.value); });
  const payload={
    fleet_id:armada.id, customer_name:nama, customer_wa:kontak,
    trip_date:document.getElementById('formTanggal')?.value||'', trip_time:document.getElementById('formJam')?.value||'',
    pax:jumlahNum, pickup_note:document.getElementById('formCatatan')?.value.trim()||'',
    destinations:by, ref:getRef(), payment_mode:PAYMENT_MODE
  };
  const btn=document.getElementById('submitBtn');
  if(btn){ btn.textContent=t('processing'); btn.disabled=true; }
  try{
    const res=await fetch(MIDTRANS_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${SUPABASE_ANON_KEY}`,'apikey':SUPABASE_ANON_KEY},body:JSON.stringify(payload)});
    const data=await res.json();
    if(data.snap_token){
      if(!window.snap){ await notify(t('err_snap')); return; }
      const dpNote=(data.payment_mode==='dp'&&data.dp_amount)?t('dp_note',{rest:formatPrice(data.total-data.dp_amount)}):'';
      window.snap.pay(data.snap_token,{
        onSuccess:()=>notify(t('pay_ok',{dp:dpNote})),
        onPending:()=>notify(t('pay_pending',{dp:dpNote})),
        onError:()=>notify(t('pay_err')),
        onClose:()=>{}
      });
    } else {
      if(data.penuh){ cekTgl=''; cekKetersediaan(); await notify(data.error); return; }
      await notify(data.error?t('order_fail',{e:data.error}):t('order_fail2'));
    }
  }catch(e){ console.error(e); await notify(t('net_err')); }
  finally{ if(btn){ btn.textContent=t('submit'); btn.disabled=false; } }
}

/* ---------- Slider: tombol panah geser kartu armada & paket ---------- */
document.addEventListener('click',(e)=>{
  const b=e.target.closest('[data-slide]'); if(!b) return;
  const track=document.getElementById(b.dataset.slide); if(!track) return;
  track.scrollBy({left:Number(b.dataset.dir)*track.clientWidth*0.85,behavior:'smooth'});
});

/* ---------- Mulai ---------- */
window.addEventListener('DOMContentLoaded',()=>{
  updateThemeIcon();
  document.getElementById('themeToggleBtn')?.addEventListener('click',toggleTheme);
  if(window.matchMedia){
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{
      let manual=null; try{ manual=localStorage.getItem('tempera_theme_manual'); }catch(e){}
      if(!manual){ document.documentElement.removeAttribute('data-theme'); updateThemeIcon(); }
    });
  }
  applyStaticText(); updateLangButton();
  initPaymentModeUI();
  renderArmada(); calculateLive(); applyHero(); applyContacts();
  const yr=document.getElementById('footerYear'); if(yr) yr.textContent=new Date().getFullYear();
  document.getElementById('formJam')?.addEventListener('change',updateDurasi);
  document.getElementById('formTanggal')?.addEventListener('change',()=>{ tglDiubahPelanggan=true; updateBatasWaktu(); });
  updateBatasWaktu();
  openAccordion('lembang');
  initRemoteData(); muatUlasan();

  fetchWeather();
  let weatherInterval=setInterval(fetchWeather,600000);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) clearInterval(weatherInterval);
    else{ fetchWeather(); weatherInterval=setInterval(fetchWeather,600000); }
  });
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeCapacityModal(); });

  // Pengaman: kolom form selalu bisa diketuk & diketik walau ada CSS lain (mis. css/driver.css) yang memblokir
  const fixStyle=document.createElement('style');
  fixStyle.textContent='#travelForm input,#travelForm textarea,#travelForm select{pointer-events:auto!important;-webkit-user-select:text!important;user-select:text!important;touch-action:manipulation}#capacityModal.hidden{display:none!important}';
  document.head.appendChild(fixStyle);

  // HP: saat mengetik di form, sembunyikan bar total & tombol WA supaya tidak menutupi kolom
  const formEl=document.getElementById('travelForm');
  if(formEl){
    const overlays=()=>[document.getElementById('mobileStickyBar'),document.getElementById('floatingWaBtn')].filter(Boolean);
    formEl.addEventListener('focusin',(e)=>{ if(!e.target.matches('input,textarea,select')) return; overlays().forEach(o=>{ o.style.display='none'; }); setTimeout(()=>{ try{ e.target.scrollIntoView({block:'center',behavior:'smooth'}); }catch(err){} },300); });
    formEl.addEventListener('focusout',()=>{ overlays().forEach(o=>{ o.style.display=''; }); });
  }
});
