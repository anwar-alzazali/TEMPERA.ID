/* ===== bandara.html: antar jemput Bandara Soetta. Harga & kapasitas dari app_settings bandara_* (diubah di panel → Pengaturan). ===== */
(function () {
  const { $, $$, rp, t } = P;
  const UMUM_ID = {
    wa_msg: 'Halo Tempera, saya mau tanya antar jemput Bandara Soetta.',
    wa_bantu: 'Halo admin, saya butuh bantuan pembayaran pesanan {id} (antar jemput bandara).',
    bayar_ok: '✅ <b>Pembayaran berhasil.</b> Konfirmasi dan invoice dikirim ke WhatsApp Anda. Data driver dikirim sebelum hari keberangkatan.',
    bayar_pending: '⏳ <b>Menunggu pembayaran.</b> Selesaikan dalam 30 menit. Konfirmasi otomatis dikirim ke WhatsApp setelah dibayar.',
    bayar_gagal: 'Pembayaran gagal. Coba lagi, atau pilih metode lain.',
    bayar_tutup: 'Jendela pembayaran ditutup. Tekan <b>Pesan &amp; bayar</b> lagi untuk mencoba, atau <a href="{wa}" target="_blank" rel="noopener" style="text-decoration:underline">minta bantuan admin</a>.',
  };
  const UMUM_MS = {
    wa_msg: 'Hai Tempera, saya ingin bertanya tentang transfer Lapangan Terbang Soetta.',
    wa_bantu: 'Hai admin, saya perlukan bantuan pembayaran tempahan {id} (transfer lapangan terbang).',
    bayar_ok: '✅ <b>Pembayaran berjaya.</b> Pengesahan dan invois dihantar ke WhatsApp anda. Maklumat pemandu dihantar sebelum hari perjalanan.',
    bayar_pending: '⏳ <b>Menunggu pembayaran.</b> Selesaikan dalam 30 minit. Pengesahan dihantar ke WhatsApp selepas dibayar.',
    bayar_gagal: 'Pembayaran gagal. Cuba lagi, atau pilih kaedah lain.',
    bayar_tutup: 'Tetingkap pembayaran ditutup. Tekan <b>Tempah &amp; bayar</b> sekali lagi, atau <a href="{wa}" target="_blank" rel="noopener" style="text-decoration:underline">minta bantuan admin</a>.',
  };
  const ID = Object.assign({}, UMUM_ID, {
    nav_beranda: 'Beranda', nav_ot: 'Open Trip', nav_pesan: 'Pesan',
    kicker: 'Bandung ⇄ Soekarno-Hatta', h1: 'Antar Jemput Bandara Soetta dari Bandung',
    sub: 'Mobil pribadi dengan driver, langsung dari rumah atau hotel Anda di Bandung. Harga pasti per mobil, bukan per orang. Pesan dan bayar online dalam 2 menit.',
    c1: 'BBM dan tol termasuk', c2: 'Driver pantau jadwal pesawat', c3: 'Gratis tunggu 60 menit', c4: 'Bisa bayar DP',
    cta: 'Cek harga & pesan', cta_wa: 'Tanya lewat WhatsApp',
    harga_judul: 'Harga per mobil, sekali jalan',
    harga_lead: 'Harga sama untuk <b>antar</b> (Bandung → bandara) maupun <b>jemput</b> (bandara → Bandung). Sudah termasuk mobil, driver, BBM, dan tol.',
    per_mobil: 'per mobil, sekali jalan', favorit: 'Paling nyaman',
    muat: 'Maks. {o} orang + {k} koper besar',
    cat_tambah: 'Luar Kota Bandung (Lembang, Soreang, Padalarang, Cimahi Utara, dan sekitarnya): tambah {x}.',
    form_judul: 'Pesan antar jemput bandara', form_lead: 'Isi data perjalanan. Harga akhir dihitung otomatis dan langsung bisa dibayar.',
    f_arah: 'Mau ke mana?', arah_antar: 'Antar ke bandara', arah_antar_s: 'Bandung → Soetta', arah_jemput: 'Jemput dari bandara', arah_jemput_s: 'Soetta → Bandung',
    f_kelas: 'Mobil', f_pax: 'Jumlah penumpang', f_koper: 'Koper besar <i>(bagasi kabin tidak dihitung)</i>',
    orang: '{n} orang', koper: '{n} koper',
    f_terminal: 'Terminal', f_terminal_s: 'Lihat di tiket atau aplikasi maskapai. Bisa diubah lewat WhatsApp bila berubah.',
    f_tgl_antar: 'Tanggal berangkat', f_tgl_jemput: 'Tanggal mendarat',
    f_jam_antar: 'Jam dijemput di rumah', f_jam_jemput: 'Jam pesawat mendarat',
    f_jam_antar_s: 'Saran: 5 jam sebelum jadwal terbang (domestik), 6 jam (internasional).', f_jam_jemput_s: 'Sesuai jadwal di tiket. Driver tetap menyesuaikan bila pesawat terlambat.',
    f_flight_antar: 'Nomor penerbangan <i>(opsional)</i>', f_flight_jemput: 'Nomor penerbangan <i>(wajib)</i>', f_flight_ph: 'Contoh: AK 380 / GA 404',
    f_flight_jemput_s: 'Driver memantau jadwal mendarat dengan nomor ini.',
    f_area_antar: 'Dijemput di', f_area_jemput: 'Diantar ke', area_kota: 'Kota Bandung', area_kota_s: 'tanpa tambahan', area_luar: 'Luar Kota Bandung',
    area_s: 'Luar kota: Lembang, Soreang, Padalarang, Cimahi Utara, Jatinangor, dan sekitarnya.',
    f_alamat_antar: 'Alamat jemput lengkap', f_alamat_jemput: 'Alamat tujuan lengkap', f_alamat_ph: 'Nama jalan, nomor rumah / nama hotel, patokan',
    f_nama: 'Nama pemesan', f_wa: 'Nomor WhatsApp', f_wa_ph: '08xx atau +60 12-345 6789',
    f_bayar: 'Pembayaran', dp: 'DP {p}%', bayar_dp_s: 'sisanya tunai ke driver', bayar_lunas: 'Bayar lunas', bayar_lunas_s: 'tidak perlu bawa tunai',
    setuju: 'Saya setuju dengan <a href="syarat.html" target="_blank" rel="noopener">Syarat &amp; Ketentuan</a> dan <a href="syarat.html#privasi" target="_blank" rel="noopener">Kebijakan Privasi</a>.',
    kirim: 'Pesan & bayar', memproses: 'Memproses…',
    aman: 'Pembayaran aman lewat Midtrans: QRIS, GoPay, ShopeePay, transfer bank (VA), kartu kredit/debit.',
    r_mobil: 'Mobil', r_tambah_luar: 'Tambahan luar kota', r_tambah_dini: 'Tambahan dini hari (sebelum 05.00)', r_total: 'Total', r_bayar_dp: 'Dibayar sekarang (DP)', r_sisa: 'Sisa, tunai ke driver', r_bayar: 'Dibayar sekarang',
    kap_lebih: '⚠️ <b>{nama}</b> muat maksimal {o} orang dan {k} koper besar. {saran}',
    kap_saran: 'Pilih <b>{nama}</b> ({harga}) supaya semua muat.', kap_saran_wa: 'Untuk rombongan sebesar ini, <a href="{wa}" target="_blank" rel="noopener" style="text-decoration:underline">tanya admin</a> (bisa 2 mobil).',
    kap_pindah: 'Pindah ke {nama}',
    e_tgl: 'Pilih tanggal.', e_jam: 'Isi jam.', e_flight: 'Isi nomor penerbangan (contoh: AK 380).', e_alamat: 'Isi alamat lengkap.', e_nama: 'Isi nama pemesan.', e_wa: 'Nomor WhatsApp tidak valid.', e_setuju: 'Centang persetujuan Syarat & Ketentuan dulu.', e_kap: 'Jumlah penumpang atau koper melebihi kapasitas mobil.', e_snap: 'Halaman pembayaran gagal dimuat. Periksa koneksi lalu coba lagi.', e_jaringan: 'Koneksi terputus. Coba lagi.',
    tutup_layanan: 'Layanan antar jemput bandara sedang ditutup. Silakan <a href="{wa}" target="_blank" rel="noopener" style="text-decoration:underline">hubungi admin lewat WhatsApp</a>.',
    t_judul: 'Termasuk', t1: 'Mobil pribadi + driver berpengalaman', t2: 'BBM dan tol Bandung - Soetta', t3: 'Jemput di alamat Anda, tanpa transit pool', t4: 'Gratis tunggu 60 menit setelah mendarat', t5: 'Invoice digital yang bisa dicek lewat QR',
    tt_judul: 'Perlu diketahui', tt1: 'Harga untuk satu mobil, bukan per orang', tt2: 'Tambahan waktu tunggu di atas 60 menit dikonfirmasi admin', tt3: 'Koper banyak? Pilih mobil yang lebih besar supaya muat', tt4: 'Tujuan lain (Jakarta, Garut, Tasik, menginap): tanya admin lewat WhatsApp',
    faq_judul: 'Pertanyaan umum',
    q1: 'Berapa lama perjalanan Bandung ke Bandara Soekarno-Hatta?', a1: 'Biasanya 3 sampai 4 jam lewat tol, tergantung lalu lintas. Untuk penerbangan internasional, sebaiknya dijemput 6 jam sebelum jadwal terbang; untuk domestik 5 jam.',
    q2: 'Bagaimana kalau pesawat saya terlambat?', a2: 'Driver memantau nomor penerbangan Anda dan menunggu di bandara. Gratis waktu tunggu 60 menit dihitung dari jam pesawat benar-benar mendarat.',
    q3: 'Apakah harga sudah termasuk tol?', a3: 'Ya. Harga per mobil sudah termasuk mobil, driver, BBM, dan tol Bandung - Soekarno-Hatta. Tidak ada biaya per orang.',
    q4: 'Kenapa tidak naik travel saja?', a4: 'Travel lebih murah untuk 1-2 orang tanpa banyak koper. Untuk keluarga atau rombongan dengan koper besar, mobil pribadi lebih praktis: dijemput di depan rumah atau hotel, tidak perlu ke pool, tidak berhenti di titik lain, dan bisa berangkat jam berapa pun.',
    q5: 'Saya dari Malaysia, bisa pesan?', a5: 'Bisa. Tulis nomor WhatsApp dengan kode negara (+60). Pembayaran bisa dengan kartu kredit/debit Visa atau Mastercard.',
    q6: 'Bagaimana cara bertemu driver di bandara?', a6: 'Sehari sebelumnya admin mengirim nama, nomor WhatsApp, dan pelat mobil driver. Setelah mendarat dan mengambil bagasi, kabari driver lewat WhatsApp; driver menunggu di titik jemput terminal Anda.',
    privasi: 'Privasi',
  });
  const MS = Object.assign({}, UMUM_MS, {
    nav_beranda: 'Laman Utama', nav_ot: 'Open Trip', nav_pesan: 'Tempah',
    kicker: 'Bandung ⇄ Soekarno-Hatta', h1: 'Transfer Lapangan Terbang Soetta ke Bandung',
    sub: 'Kereta peribadi dengan pemandu, terus dari rumah atau hotel anda di Bandung. Harga tetap per kereta, bukan per orang. Tempah dan bayar dalam talian dalam 2 minit.',
    c1: 'Minyak dan tol termasuk', c2: 'Pemandu pantau jadual penerbangan', c3: 'Percuma tunggu 60 minit', c4: 'Boleh bayar deposit',
    cta: 'Semak harga & tempah', cta_wa: 'Tanya melalui WhatsApp',
    harga_judul: 'Harga per kereta, sehala',
    harga_lead: 'Harga sama untuk <b>hantar</b> (Bandung → lapangan terbang) dan <b>ambil</b> (lapangan terbang → Bandung). Termasuk kereta, pemandu, minyak dan tol.',
    per_mobil: 'per kereta, sehala', favorit: 'Paling selesa',
    muat: 'Maks. {o} orang + {k} beg besar',
    cat_tambah: 'Luar Bandar Bandung (Lembang, Soreang, Padalarang, Cimahi Utara dan sekitarnya): tambah {x}.',
    form_judul: 'Tempah transfer lapangan terbang', form_lead: 'Isi maklumat perjalanan. Harga akhir dikira automatik dan terus boleh dibayar.',
    f_arah: 'Hendak ke mana?', arah_antar: 'Hantar ke lapangan terbang', arah_antar_s: 'Bandung → Soetta', arah_jemput: 'Ambil dari lapangan terbang', arah_jemput_s: 'Soetta → Bandung',
    f_kelas: 'Kereta', f_pax: 'Bilangan penumpang', f_koper: 'Beg besar <i>(beg kabin tidak dikira)</i>',
    orang: '{n} orang', koper: '{n} beg',
    f_terminal: 'Terminal', f_terminal_s: 'Lihat pada tiket atau aplikasi syarikat penerbangan. Boleh diubah melalui WhatsApp.',
    f_tgl_antar: 'Tarikh bertolak', f_tgl_jemput: 'Tarikh mendarat',
    f_jam_antar: 'Masa diambil di rumah/hotel', f_jam_jemput: 'Masa pesawat mendarat',
    f_jam_antar_s: 'Cadangan: 5 jam sebelum penerbangan (domestik), 6 jam (antarabangsa).', f_jam_jemput_s: 'Ikut jadual pada tiket. Pemandu akan menyesuaikan jika pesawat lewat.',
    f_flight_antar: 'Nombor penerbangan <i>(pilihan)</i>', f_flight_jemput: 'Nombor penerbangan <i>(wajib)</i>', f_flight_ph: 'Contoh: AK 380 / MH 711',
    f_flight_jemput_s: 'Pemandu memantau jadual mendarat dengan nombor ini.',
    f_area_antar: 'Diambil di', f_area_jemput: 'Dihantar ke', area_kota: 'Bandar Bandung', area_kota_s: 'tiada tambahan', area_luar: 'Luar Bandar Bandung',
    area_s: 'Luar bandar: Lembang, Soreang, Padalarang, Cimahi Utara, Jatinangor dan sekitarnya.',
    f_alamat_antar: 'Alamat ambil penuh', f_alamat_jemput: 'Alamat destinasi penuh', f_alamat_ph: 'Nama jalan, nombor rumah / nama hotel, mercu tanda',
    f_nama: 'Nama penempah', f_wa: 'Nombor WhatsApp', f_wa_ph: '+60 12-345 6789',
    f_bayar: 'Pembayaran', dp: 'Deposit {p}%', bayar_dp_s: 'baki tunai kepada pemandu', bayar_lunas: 'Bayar penuh', bayar_lunas_s: 'tidak perlu bawa tunai',
    setuju: 'Saya bersetuju dengan <a href="syarat.html" target="_blank" rel="noopener">Terma &amp; Syarat</a> dan <a href="syarat.html#privasi" target="_blank" rel="noopener">Dasar Privasi</a>.',
    kirim: 'Tempah & bayar', memproses: 'Memproses…',
    aman: 'Pembayaran selamat melalui Midtrans: kad kredit/debit (Visa, Mastercard), QRIS, e-wallet, pindahan bank Indonesia.',
    r_mobil: 'Kereta', r_tambah_luar: 'Tambahan luar bandar', r_tambah_dini: 'Tambahan awal pagi (sebelum 05.00)', r_total: 'Jumlah', r_bayar_dp: 'Dibayar sekarang (deposit)', r_sisa: 'Baki, tunai kepada pemandu', r_bayar: 'Dibayar sekarang',
    kap_lebih: '⚠️ <b>{nama}</b> muat maksimum {o} orang dan {k} beg besar. {saran}',
    kap_saran: 'Pilih <b>{nama}</b> ({harga}) supaya semua muat.', kap_saran_wa: 'Untuk kumpulan sebesar ini, <a href="{wa}" target="_blank" rel="noopener" style="text-decoration:underline">tanya admin</a> (boleh 2 kereta).',
    kap_pindah: 'Tukar ke {nama}',
    e_tgl: 'Pilih tarikh.', e_jam: 'Isi masa.', e_flight: 'Isi nombor penerbangan (contoh: AK 380).', e_alamat: 'Isi alamat penuh.', e_nama: 'Isi nama penempah.', e_wa: 'Nombor WhatsApp tidak sah.', e_setuju: 'Tandakan persetujuan Terma & Syarat dahulu.', e_kap: 'Bilangan penumpang atau beg melebihi kapasiti kereta.', e_snap: 'Halaman pembayaran gagal dimuatkan. Semak sambungan dan cuba lagi.', e_jaringan: 'Sambungan terputus. Cuba lagi.',
    tutup_layanan: 'Perkhidmatan transfer lapangan terbang ditutup buat sementara. Sila <a href="{wa}" target="_blank" rel="noopener" style="text-decoration:underline">hubungi admin melalui WhatsApp</a>.',
    t_judul: 'Termasuk', t1: 'Kereta peribadi + pemandu berpengalaman', t2: 'Minyak dan tol Bandung - Soetta', t3: 'Diambil di alamat anda, tanpa transit', t4: 'Percuma tunggu 60 minit selepas mendarat', t5: 'Invois digital yang boleh disemak melalui QR',
    tt_judul: 'Perlu diketahui', tt1: 'Harga untuk satu kereta, bukan per orang', tt2: 'Masa tunggu melebihi 60 minit disahkan oleh admin', tt3: 'Banyak beg? Pilih kereta lebih besar supaya muat', tt4: 'Destinasi lain (Jakarta, Garut, Tasik, bermalam): tanya admin melalui WhatsApp',
    faq_judul: 'Soalan lazim',
    q1: 'Berapa lama perjalanan Bandung ke Lapangan Terbang Soekarno-Hatta?', a1: 'Biasanya 3 hingga 4 jam melalui tol, bergantung pada trafik. Untuk penerbangan antarabangsa, sebaiknya diambil 6 jam sebelum penerbangan; domestik 5 jam.',
    q2: 'Bagaimana jika pesawat saya lewat?', a2: 'Pemandu memantau nombor penerbangan anda dan menunggu di lapangan terbang. Percuma tunggu 60 minit dikira dari masa pesawat benar-benar mendarat.',
    q3: 'Adakah harga termasuk tol?', a3: 'Ya. Harga per kereta termasuk kereta, pemandu, minyak dan tol Bandung - Soekarno-Hatta. Tiada caj per orang.',
    q4: 'Kenapa tidak naik travel/shuttle?', a4: 'Shuttle lebih murah untuk 1-2 orang tanpa banyak beg. Untuk keluarga atau kumpulan dengan beg besar, kereta peribadi lebih praktikal: diambil di depan rumah atau hotel, tiada transit, dan boleh bertolak bila-bila masa.',
    q5: 'Saya dari Malaysia, boleh tempah?', a5: 'Boleh. Tulis nombor WhatsApp dengan kod negara (+60). Pembayaran boleh dengan kad kredit/debit Visa atau Mastercard.',
    q6: 'Bagaimana berjumpa pemandu di lapangan terbang?', a6: 'Sehari sebelum, admin menghantar nama, nombor WhatsApp dan nombor plat pemandu. Selepas mendarat dan mengambil bagasi, maklumkan pemandu melalui WhatsApp; pemandu menunggu di titik ambil terminal anda.',
    privasi: 'Privasi',
  });

  const KELAS = { mpv: { nama: 'Avanza / Xpander' }, innova: { nama: 'Innova' }, hiace: { nama: 'Hiace' } };
  const URUT = ['mpv', 'innova', 'hiace'];
  const S = { harga: { mpv: 1000000, innova: 1200000, hiace: 1600000 }, orang: { mpv: 4, innova: 5, hiace: 10 }, koper: { mpv: 4, innova: 4, hiace: 10 }, luar: 100000, dini: 0, dp: 25, tunggu: 60, aktif: true };

  const f = $('#fBandara');
  const nilai = (name) => (f.querySelector(`input[name="${name}"]:checked`) || {}).value;
  const pilihRadio = (name, v) => { const el = f.querySelector(`input[name="${name}"][value="${v}"]`); if (el) { el.checked = true; } };

  function isiPilihan() {
    const maxO = Math.max(...URUT.map((k) => S.orang[k])), maxK = Math.max(...URUT.map((k) => S.koper[k]));
    const isi = (sel, max, mulai, kunci) => { const lama = Number(sel.value) || (kunci === 'orang' ? 2 : 2); sel.innerHTML = ''; for (let i = mulai; i <= max + 2; i++) { const o = document.createElement('option'); o.value = i; o.textContent = i > max ? t(kunci, { n: i }) + ' +' : t(kunci, { n: i }); sel.appendChild(o); } sel.value = String(Math.min(lama, max + 2)); };
    isi($('#fPax'), maxO, 1, 'orang'); isi($('#fKoper'), maxK, 0, 'koper');
  }
  function tampilHarga() {
    URUT.forEach((k) => {
      $$(`[data-k="harga_${k}"]`).forEach((el) => { el.textContent = rp(S.harga[k]); });
      $$(`[data-k="seg_${k}"]`).forEach((el) => { el.textContent = rp(S.harga[k]); });
      $$(`[data-k="muat_${k}"]`).forEach((el) => { el.textContent = t('muat', { o: S.orang[k], k: S.koper[k] }); });
    });
    $('#catatanTambah').textContent = t('cat_tambah', { x: rp(S.luar) });
    $('#sAreaLuar').textContent = '+' + rp(S.luar);
    $('#tDp').textContent = t('dp', { p: S.dp });
    $$('#kartuKelas .pcard').forEach((c) => c.classList.toggle('on', c.dataset.kelas === nilai('kelas')));
  }
  function arahUbah() {
    const j = nilai('arah') === 'jemput';
    const set = (id, k) => { const el = $(id); el.dataset.t ? (el.dataset.t = k, el.textContent = t(k)) : (el.dataset.th = k, el.innerHTML = t(k)); };
    set('#lTgl', j ? 'f_tgl_jemput' : 'f_tgl_antar'); set('#lJam', j ? 'f_jam_jemput' : 'f_jam_antar'); set('#sJam', j ? 'f_jam_jemput_s' : 'f_jam_antar_s');
    set('#lFlight', j ? 'f_flight_jemput' : 'f_flight_antar'); set('#lArea', j ? 'f_area_jemput' : 'f_area_antar'); set('#lAlamat', j ? 'f_alamat_jemput' : 'f_alamat_antar');
    $('#sFlight').hidden = !j;
  }
  function kapasitas() {
    const k = nilai('kelas'), o = Number($('#fPax').value), kp = Number($('#fKoper').value);
    const m = $('#mKapasitas');
    if (o <= S.orang[k] && kp <= S.koper[k]) { P.bersih(m); return true; }
    const cocok = URUT.find((x) => o <= S.orang[x] && kp <= S.koper[x]);
    const saran = cocok ? t('kap_saran', { nama: KELAS[cocok].nama, harga: rp(S.harga[cocok]) }) + ` <button type="button" class="pbtn ghost" style="padding:6px 12px;font-size:12px;margin-top:6px" data-pindah="${cocok}">${t('kap_pindah', { nama: KELAS[cocok].nama })}</button>`
      : t('kap_saran_wa', { wa: P.waLink(t('wa_msg') + ` (${o} orang, ${kp} koper)`) });
    m.className = 'pmsg on info'; m.innerHTML = t('kap_lebih', { nama: KELAS[k].nama, o: S.orang[k], k: S.koper[k], saran });
    return false;
  }
  function hitung() {
    const k = nilai('kelas'), luar = nilai('area') === 'luar' ? S.luar : 0;
    const jam = $('#fJam').value; const dini = jam && Number(jam.slice(0, 2)) < 5 ? S.dini : 0;
    const total = S.harga[k] + luar + dini;
    const dp = nilai('bayar') === 'dp' ? Math.min(Math.round(total * S.dp / 100), total) : null;
    return { k, luar, dini, total, dp };
  }
  function ringkas() {
    const h = hitung();
    let s = `<div class="br"><span>${t('r_mobil')}: ${KELAS[h.k].nama}</span><span>${rp(S.harga[h.k])}</span></div>`;
    if (h.luar) s += `<div class="br"><span>${t('r_tambah_luar')}</span><span>${rp(h.luar)}</span></div>`;
    if (h.dini) s += `<div class="br"><span>${t('r_tambah_dini')}</span><span>${rp(h.dini)}</span></div>`;
    s += `<div class="br total"><span>${t('r_total')}</span><b>${rp(h.total)}</b></div>`;
    if (h.dp != null) s += `<div class="br"><span>${t('r_bayar_dp')}</span><span><b>${rp(h.dp)}</b></span></div><div class="br"><span>${t('r_sisa')}</span><span>${rp(h.total - h.dp)}</span></div>`;
    $('#ringkas').innerHTML = s;
    $$('#kartuKelas .pcard').forEach((c) => c.classList.toggle('on', c.dataset.kelas === h.k));
  }
  function segar() { kapasitas(); ringkas(); }

  P.kamus({ id: ID, ms: MS });
  document.addEventListener('p-lang', () => { isiPilihan(); tampilHarga(); arahUbah(); segar(); const w = P.waLink(t('wa_msg')); $('#waHero').href = w; $('#waMelayang').href = w; });
  const tgl = $('#fTgl'); tgl.min = P.hariIni();
  try { const q = new URL(location.href).searchParams; if (q.get('arah') === 'jemput') pilihRadio('arah', 'jemput'); if (KELAS[q.get('kelas')]) pilihRadio('kelas', q.get('kelas')); } catch (e) {}
  isiPilihan(); arahUbah(); tampilHarga(); segar();

  f.addEventListener('change', (e) => { if (e.target.name === 'arah') arahUbah(); segar(); });
  f.addEventListener('input', (e) => { if (e.target.id === 'fJam') ringkas(); });
  f.addEventListener('click', (e) => { const b = e.target.closest('[data-pindah]'); if (b) { pilihRadio('kelas', b.dataset.pindah); segar(); } });
  $$('#kartuKelas .pcard').forEach((c) => {
    const pilih = () => { pilihRadio('kelas', c.dataset.kelas); segar(); $('#pesan').scrollIntoView({ behavior: 'smooth' }); };
    c.addEventListener('click', pilih); c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pilih(); } });
  });
  let mulai = false;
  f.addEventListener('focusin', () => { P.muatSnap(); if (!mulai) { mulai = true; P.lacak('mulai_booking', { lokasi: 'bandara' }); } });

  P.setelan(['admin_wa', 'dp_percent', 'bandara_aktif', 'bandara_tambah_luar_kota', 'bandara_tambah_dini_hari', 'bandara_tunggu_gratis_menit',
    ...URUT.flatMap((k) => [`bandara_harga_${k}`, `bandara_orang_${k}`, `bandara_koper_${k}`])]).then((o) => {
    const n = (k, d) => { const v = parseInt(String(o[k] ?? '').replace(/[^0-9]/g, ''), 10); return Number.isFinite(v) ? v : d; };
    URUT.forEach((k) => { S.harga[k] = n(`bandara_harga_${k}`, S.harga[k]); S.orang[k] = n(`bandara_orang_${k}`, S.orang[k]); S.koper[k] = n(`bandara_koper_${k}`, S.koper[k]); });
    S.luar = n('bandara_tambah_luar_kota', S.luar); S.dini = n('bandara_tambah_dini_hari', 0); S.dp = Math.max(1, Math.min(100, n('dp_percent', 25)));
    S.aktif = String(o.bandara_aktif ?? '1').trim() === '1';
    if (!S.aktif) { P.pesan($('#mForm'), t('tutup_layanan', { wa: P.waLink(t('wa_msg')) }), 'info'); $('#bKirim').disabled = true; }
    document.dispatchEvent(new Event('p-lang'));
  }).catch(() => {});

  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const m = $('#mForm'); P.bersih(m);
    const arah = nilai('arah'), flight = $('#fFlight').value.trim(), wa = P.normWA($('#fWa').value);
    if (!kapasitas()) return P.pesan(m, t('e_kap'));
    if (!tgl.value || tgl.value < P.hariIni()) return P.pesan(m, t('e_tgl'));
    if (!$('#fJam').value) return P.pesan(m, t('e_jam'));
    if (arah === 'jemput' && flight.replace(/[^A-Za-z0-9]/g, '').length < 3) return P.pesan(m, t('e_flight'));
    if ($('#fAlamat').value.trim().length < 5) return P.pesan(m, t('e_alamat'));
    if (!$('#fNama').value.trim()) return P.pesan(m, t('e_nama'));
    if (wa.length < 10 || wa.length > 15) return P.pesan(m, t('e_wa'));
    if (!$('#fSetuju').checked) return P.pesan(m, t('e_setuju'));
    const b = $('#bKirim'); b.disabled = true; b.textContent = t('memproses');
    try {
      const siap = await P.muatSnap();
      if (!siap) { P.pesan(m, t('e_snap')); return; }
      const d = await P.fungsi('pesan-bandara', {
        kelas: nilai('kelas'), arah, terminal: nilai('terminal'), penerbangan: flight, area: nilai('area'), alamat: $('#fAlamat').value.trim(),
        pax: Number($('#fPax').value), koper: Number($('#fKoper').value), trip_date: tgl.value, trip_time: $('#fJam').value,
        customer_name: $('#fNama').value.trim(), customer_wa: wa, payment_mode: nilai('bayar'), ref: P.getRef(),
      });
      if (!d || !d.ok) { P.pesan(m, P.esc((d && d.error) || t('e_jaringan'))); return; }
      const nilaiBayar = Number(d.payment_mode === 'dp' ? d.dp_amount : d.total) || 0;
      P.lacak('buat_pesanan', { value: Number(d.total) || 0, currency: 'IDR', produk: 'bandara', kelas: nilai('kelas'), arah });
      P.bayar(d, nilaiBayar, m, 'bandara');
    } catch (er) { P.pesan(m, t('e_jaringan')); }
    finally { b.disabled = !S.aktif; b.textContent = t('kirim'); }
  });
})();
