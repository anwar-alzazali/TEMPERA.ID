/* ===== open-trip.html: jadwal dari rpc open_trip_publik (tabel open_trip, dibuat admin di panel → Open Trip). Bayar lunas per kursi. ===== */
(function () {
  const { $, esc, rp, t } = P;
  const UMUM = {
    id: {
      wa_msg: 'Halo Tempera, saya mau tanya open trip.',
      wa_bantu: 'Halo admin, saya butuh bantuan pembayaran pesanan {id} (open trip).',
      bayar_ok: '✅ <b>Pembayaran berhasil, kursi Anda sudah tercatat.</b> Konfirmasi dan invoice dikirim ke WhatsApp. Sehari sebelum berangkat kami kirim data driver.',
      bayar_pending: '⏳ <b>Menunggu pembayaran.</b> Kursi ditahan 30 menit. Selesaikan pembayaran supaya kursi tidak dilepas.',
      bayar_gagal: 'Pembayaran gagal. Coba lagi, atau pilih metode lain.',
      bayar_tutup: 'Jendela pembayaran ditutup. Kursi masih ditahan sampai 30 menit; tekan <b>Bayar</b> lagi untuk pesanan baru, atau <a href="{wa}" target="_blank" rel="noopener" style="text-decoration:underline">minta bantuan admin</a>.',
    },
    ms: {
      wa_msg: 'Hai Tempera, saya ingin bertanya tentang open trip.',
      wa_bantu: 'Hai admin, saya perlukan bantuan pembayaran tempahan {id} (open trip).',
      bayar_ok: '✅ <b>Pembayaran berjaya, tempat duduk anda sudah direkod.</b> Pengesahan dan invois dihantar ke WhatsApp. Sehari sebelum perjalanan kami hantar maklumat pemandu.',
      bayar_pending: '⏳ <b>Menunggu pembayaran.</b> Tempat duduk ditahan 30 minit.',
      bayar_gagal: 'Pembayaran gagal. Cuba lagi, atau pilih kaedah lain.',
      bayar_tutup: 'Tetingkap pembayaran ditutup. Tekan <b>Bayar</b> sekali lagi, atau <a href="{wa}" target="_blank" rel="noopener" style="text-decoration:underline">minta bantuan admin</a>.',
    },
  };
  const ID = Object.assign({}, UMUM.id, {
    nav_beranda: 'Beranda', nav_bandara: 'Bandara', nav_jadwal: 'Jadwal',
    kicker: 'Open Trip dari Bandung', h1: 'Jalan-jalan bareng, bayar per kursi',
    sub: 'Ikut jadwal yang sudah kami siapkan: berangkat bersama peserta lain dengan mobil dan driver Tempera. Cocok untuk yang datang sendiri, berdua, atau tidak mau repot menyewa satu mobil.',
    c1: 'Harga per orang', c2: 'Driver lokal', c3: 'Kursi terjamin setelah bayar', cta: 'Lihat jadwal',
    jadwal_judul: 'Jadwal open trip', jadwal_lead: 'Sisa kursi diperbarui langsung. Kursi ditahan 30 menit selama Anda membayar.',
    memuat: 'Memuat jadwal…', gagal: 'Jadwal belum bisa dimuat. Muat ulang halaman, atau tanya admin lewat WhatsApp.',
    kosong: 'Jadwal open trip berikutnya sedang disiapkan.', kosong_wa: 'Kabari saya lewat WhatsApp',
    per_orang: '/ orang', sisa: 'Sisa {n} kursi', sisa_tipis: 'Tinggal {n} kursi!', habis: 'Penuh', ditutup: 'Pendaftaran ditutup',
    lihat: 'Lihat & pesan', kumpul: 'Titik kumpul: {x}', jemput: 'Dijemput ke rumah ({x})', jemput_semua: 'Dijemput ke rumah',
    berangkat: 'Berangkat {jam}', min: 'Berangkat bila minimal {n} peserta',
    min_info: 'Satu mobil berisi <b>{k} peserta</b>. Mobil berangkat bila terisi minimal <b>{n} orang</b>; mobil berikutnya dibuka setelah mobil sebelumnya penuh. Kalau sampai batas waktu mobil Anda belum cukup, Anda boleh pindah jadwal atau uang kembali 100%.',
    armada: 'Mobil: {x}', tersedia: 'Kursi tersedia',
    st_kosong: 'Jadilah peserta pertama · berangkat bila minimal {min} orang',
    st_butuh: 'Mobil ke-{n}: {x}/{k} terisi · {y} orang lagi agar berangkat',
    st_pasti: 'Mobil ke-{n}: {x}/{k} terisi · pasti berangkat',
    st_baru: '{p} mobil pasti berangkat · mobil ke-{n} dibuka',
    itinerary: 'Rencana perjalanan', termasuk: 'Termasuk', tidak: 'Tidak termasuk', catatan: 'Catatan',
    f_kursi: 'Jumlah kursi', f_nama: 'Nama pemesan', f_wa: 'Nomor WhatsApp', f_wa_ph: '08xx atau +60 12-345 6789',
    f_peserta: 'Nama peserta lain', f_peserta_s: '(opsional, pisahkan dengan koma)', f_alamat: 'Alamat jemput lengkap', f_alamat_ph: 'Nama jalan, nomor rumah, patokan',
    setuju: 'Saya setuju dengan <a href="syarat.html" target="_blank" rel="noopener">Syarat &amp; Ketentuan</a> dan <a href="syarat.html#privasi" target="_blank" rel="noopener">Kebijakan Privasi</a>.',
    total: 'Total ({n} kursi)', bayar: 'Bayar {x}', memproses: 'Memproses…', tutup: 'Tutup',
    aman: 'Pembayaran lunas lewat Midtrans: QRIS, GoPay, ShopeePay, transfer bank (VA), kartu kredit/debit.',
    e_nama: 'Isi nama pemesan.', e_wa: 'Nomor WhatsApp tidak valid.', e_alamat: 'Isi alamat jemput.', e_setuju: 'Centang persetujuan Syarat & Ketentuan dulu.', e_snap: 'Halaman pembayaran gagal dimuat. Periksa koneksi lalu coba lagi.', e_jaringan: 'Koneksi terputus. Coba lagi.',
    bagikan: 'Bagikan', disalin: 'Link disalin',
    cara_judul: 'Cara ikut', s1: '1. Pilih jadwal', s1d: 'Lihat tujuan, tanggal, titik kumpul, dan sisa kursi.', s2: '2. Bayar kursi', s2d: 'Bayar online lewat QRIS, e-wallet, transfer bank, atau kartu. Kursi langsung tercatat atas nama Anda.', s3: '3. Datang ke titik kumpul', s3d: 'Sehari sebelumnya kami kirim data driver dan grup WhatsApp peserta.',
    pribadi: 'Mau berangkat hanya dengan rombongan sendiri? Pilih <a href="/#destinasi" style="text-decoration:underline">private trip (sewa mobil + driver 12 jam)</a>.',
    faq_judul: 'Pertanyaan umum',
    q1: 'Bagaimana kalau peserta tidak mencapai minimal?', a1: 'Kalau sampai batas waktu peserta belum mencapai jumlah minimal, Anda boleh memilih: pindah ke jadwal lain, atau uang kembali 100%.',
    q2: 'Bisa batal setelah bayar?', a2: 'Pembatalan mengikuti Syarat & Ketentuan. Karena kursi sudah ditahan untuk Anda, hubungi admin secepatnya kalau berhalangan; Anda juga boleh mengalihkan kursi ke orang lain.',
    q3: 'Apa bedanya dengan private trip?', a3: 'Di open trip Anda satu mobil dengan peserta lain dan mengikuti rute serta jam yang sudah ditentukan. Di private trip, mobil dan driver hanya untuk rombongan Anda dan rutenya bebas diatur.',
    q4: 'Bayar tiket masuk wisata sendiri?', a4: 'Lihat bagian "Termasuk" dan "Tidak termasuk" di tiap jadwal. Bila tidak disebut termasuk, tiket masuk dan makan dibayar sendiri di lokasi.',
    privasi: 'Privasi',
  });
  const MS = Object.assign({}, UMUM.ms, {
    nav_beranda: 'Laman Utama', nav_bandara: 'Lapangan Terbang', nav_jadwal: 'Jadual',
    kicker: 'Open Trip dari Bandung', h1: 'Melancong bersama, bayar per tempat duduk',
    sub: 'Sertai jadual yang kami sediakan: bertolak bersama peserta lain dengan kereta dan pemandu Tempera. Sesuai untuk yang datang seorang, berdua, atau tidak mahu menyewa sebuah kereta.',
    c1: 'Harga per orang', c2: 'Pemandu tempatan', c3: 'Tempat dijamin selepas bayar', cta: 'Lihat jadual',
    jadwal_judul: 'Jadual open trip', jadwal_lead: 'Baki tempat dikemas kini secara langsung. Tempat ditahan 30 minit semasa anda membayar.',
    memuat: 'Memuatkan jadual…', gagal: 'Jadual belum dapat dimuatkan. Muat semula halaman, atau tanya admin melalui WhatsApp.',
    kosong: 'Jadual open trip seterusnya sedang disediakan.', kosong_wa: 'Maklumkan saya melalui WhatsApp',
    per_orang: '/ orang', sisa: 'Baki {n} tempat', sisa_tipis: 'Tinggal {n} tempat!', habis: 'Penuh', ditutup: 'Pendaftaran ditutup',
    lihat: 'Lihat & tempah', kumpul: 'Titik berkumpul: {x}', jemput: 'Diambil di rumah ({x})', jemput_semua: 'Diambil di rumah',
    berangkat: 'Bertolak {jam}', min: 'Bertolak jika minimum {n} peserta',
    min_info: 'Satu kereta memuatkan <b>{k} peserta</b>. Kereta bertolak jika terisi minimum <b>{n} orang</b>; kereta seterusnya dibuka selepas kereta sebelumnya penuh. Jika tidak cukup, anda boleh tukar jadual atau wang dikembalikan 100%.',
    armada: 'Kereta: {x}', tersedia: 'Tempat tersedia',
    st_kosong: 'Jadilah peserta pertama · bertolak jika minimum {min} orang',
    st_butuh: 'Kereta ke-{n}: {x}/{k} terisi · {y} orang lagi untuk bertolak',
    st_pasti: 'Kereta ke-{n}: {x}/{k} terisi · pasti bertolak',
    st_baru: '{p} kereta pasti bertolak · kereta ke-{n} dibuka',
    itinerary: 'Rancangan perjalanan', termasuk: 'Termasuk', tidak: 'Tidak termasuk', catatan: 'Catatan',
    f_kursi: 'Bilangan tempat duduk', f_nama: 'Nama penempah', f_wa: 'Nombor WhatsApp', f_wa_ph: '+60 12-345 6789',
    f_peserta: 'Nama peserta lain', f_peserta_s: '(pilihan, pisahkan dengan koma)', f_alamat: 'Alamat ambil penuh', f_alamat_ph: 'Nama jalan, nombor rumah, mercu tanda',
    setuju: 'Saya bersetuju dengan <a href="syarat.html" target="_blank" rel="noopener">Terma &amp; Syarat</a> dan <a href="syarat.html#privasi" target="_blank" rel="noopener">Dasar Privasi</a>.',
    total: 'Jumlah ({n} tempat)', bayar: 'Bayar {x}', memproses: 'Memproses…', tutup: 'Tutup',
    aman: 'Bayaran penuh melalui Midtrans: kad kredit/debit, QRIS, e-wallet, pindahan bank Indonesia.',
    e_nama: 'Isi nama penempah.', e_wa: 'Nombor WhatsApp tidak sah.', e_alamat: 'Isi alamat ambil.', e_setuju: 'Tandakan persetujuan Terma & Syarat dahulu.', e_snap: 'Halaman pembayaran gagal dimuatkan. Semak sambungan dan cuba lagi.', e_jaringan: 'Sambungan terputus. Cuba lagi.',
    bagikan: 'Kongsi', disalin: 'Pautan disalin',
    cara_judul: 'Cara menyertai', s1: '1. Pilih jadual', s1d: 'Lihat destinasi, tarikh, titik berkumpul dan baki tempat.', s2: '2. Bayar tempat', s2d: 'Bayar dalam talian melalui kad, QRIS, e-wallet atau bank. Tempat terus direkod atas nama anda.', s3: '3. Datang ke titik berkumpul', s3d: 'Sehari sebelum, kami hantar maklumat pemandu dan kumpulan WhatsApp peserta.',
    pribadi: 'Mahu bertolak dengan kumpulan sendiri sahaja? Pilih <a href="/#destinasi" style="text-decoration:underline">private trip (sewa kereta + pemandu 12 jam)</a>.',
    faq_judul: 'Soalan lazim',
    q1: 'Bagaimana jika peserta tidak cukup minimum?', a1: 'Jika sehingga tarikh akhir peserta belum cukup, anda boleh pilih: tukar ke jadual lain, atau wang dikembalikan 100%.',
    q2: 'Boleh batal selepas bayar?', a2: 'Pembatalan mengikut Terma & Syarat. Hubungi admin secepat mungkin jika tidak dapat hadir; anda juga boleh memindahkan tempat kepada orang lain.',
    q3: 'Apa beza dengan private trip?', a3: 'Dalam open trip anda berkongsi kereta dengan peserta lain dan mengikut laluan serta masa yang ditetapkan. Dalam private trip, kereta dan pemandu hanya untuk kumpulan anda dan laluan bebas diatur.',
    q4: 'Tiket masuk dibayar sendiri?', a4: 'Lihat bahagian "Termasuk" dan "Tidak termasuk" pada setiap jadual. Jika tidak disebut termasuk, tiket masuk dan makan dibayar sendiri.',
    privasi: 'Privasi',
  });

  let DATA = [], aktif = null, kursi = 1;
  const jamTampil = (j) => String(j || '').replace(':', '.');
  // Kursi dijual per mobil (kursi_per_mobil, mis. 4). Mobil berikutnya dibuka setelah yang sebelumnya penuh.
  function mobil(r) {
    const k = Math.max(1, r.kursi_per_mobil || r.kuota), tr = Math.max(0, r.terisi != null ? r.terisi : r.kuota - r.sisa);
    const min = Math.min(k, Math.max(1, r.min_berangkat || k));
    const p = Math.floor(tr / k), x = tr % k, n = p + 1;
    let teks;
    if (tr === 0) teks = t('st_kosong', { min });
    else if (x === 0) teks = t('st_baru', { p, n });
    else teks = x >= min ? t('st_pasti', { n, x, k }) : t('st_butuh', { n, x, k, y: min - x });
    return { k, min, pct: Math.round(x / k * 100), teks };
  }
  function labelSisa(r) {
    if (!r.buka_pesan) return `<span class="sisa habis">${t('ditutup')}</span>`;
    if (r.sisa <= 0) return `<span class="sisa habis">${t('habis')}</span>`;
    if (!r.maks_mobil) return `<span class="sisa">${t('tersedia')}</span>`;
    if (r.sisa <= 2) return `<span class="sisa tipis">${t('sisa_tipis', { n: r.sisa })}</span>`;
    return `<span class="sisa">${t('sisa', { n: r.sisa })}</span>`;
  }
  const lokasi = (r) => r.jemput_rumah ? (r.area_jemput ? t('jemput', { x: r.area_jemput }) : t('jemput_semua')) : t('kumpul', { x: r.titik_kumpul || '-' });
  const fotoUrl = (u) => (/^(https:\/\/|images\/)[^\s"'()<>]+$/i.test(String(u || '')) ? u : '');

  function kartu(r) {
    const d = new Date(r.tanggal + 'T00:00:00+07:00');
    const bln = d.toLocaleDateString(P.lang === 'ms' ? 'ms-MY' : 'id-ID', { month: 'short', timeZone: 'Asia/Jakarta' });
    const hari = d.toLocaleDateString(P.lang === 'ms' ? 'ms-MY' : 'id-ID', { weekday: 'short', timeZone: 'Asia/Jakarta' });
    const mb = mobil(r), pct = mb.pct;
    const f = fotoUrl(r.foto_url);
    return `<article class="otkartu">
      <div class="foto"${f ? ` style="background-image:url('${esc(f)}')"` : ''}><div class="tgl">${esc(hari)}<b>${Number(r.tanggal.slice(8, 10))}</b>${esc(bln)}</div></div>
      <div class="isi">
        <h3>${esc(r.judul)}</h3>
        <p class="meta">${esc(t('berangkat', { jam: jamTampil(r.jam) }))} · ${esc(lokasi(r))}</p>
        <div>${labelSisa(r)} <span class="meta" style="font-size:12px">${esc(mb.teks)}</span><div class="bar" aria-hidden="true"><i style="width:${pct}%"></i></div></div>
        <div class="bawah"><span class="harga">${rp(r.harga)} <small>${t('per_orang')}</small></span>
          <button type="button" class="pbtn" style="padding:10px 16px;font-size:12px" data-buka="${r.id}">${t('lihat')}</button></div>
      </div></article>`;
  }
  function daftar() {
    const el = $('#daftar');
    if (!DATA.length) {
      el.innerHTML = `<div class="kosong" style="grid-column:1/-1">${esc(t('kosong'))}<br><a class="pbtn wa" style="margin-top:12px" href="${esc(P.waLink(t('wa_msg')))}" target="_blank" rel="noopener">${esc(t('kosong_wa'))}</a></div>`;
      return;
    }
    el.innerHTML = DATA.map(kartu).join('');
  }
  const blok = (judul, isi) => isi ? `<h4 style="margin:16px 0 4px;font-size:13px;text-transform:uppercase;letter-spacing:.06em">${esc(judul)}</h4><p class="pre" style="margin:0;font-size:14px;color:var(--text-secondary)">${esc(isi)}</p>` : '';

  function buka(id, dorong = true) {
    const r = DATA.find((x) => String(x.id) === String(id)); if (!r) return;
    aktif = r; kursi = 1;
    const bisa = r.buka_pesan && r.sisa > 0;
    $('#mBox').innerHTML = `<button type="button" class="tutup" data-tutup aria-label="${esc(t('tutup'))}">×</button>
      <h3 id="mJudul">${esc(r.judul)}</h3>
      <p class="meta" style="margin:0;font-size:13px;color:var(--text-muted)">${esc(P.tglPanjang(r.tanggal))} · ${esc(t('berangkat', { jam: jamTampil(r.jam) }))}</p>
      <p style="margin:6px 0 0;font-size:13.5px"><b>${esc(lokasi(r))}</b>${r.armada ? ' · ' + esc(t('armada', { x: r.armada })) : ''}</p>
      <div style="margin-top:10px">${labelSisa(r)} <span style="font-size:12px;color:var(--text-muted)">${esc(mobil(r).teks)}</span><div class="bar" aria-hidden="true"><i style="width:${mobil(r).pct}%"></i></div></div>
      <div class="pmsg on info" style="margin-top:12px">${t('min_info', { k: mobil(r).k, n: mobil(r).min })}</div>
      ${blok(t('itinerary'), r.itinerary)}${blok(t('termasuk'), r.termasuk)}${blok(t('tidak'), r.tidak_termasuk)}${blok(t('catatan'), r.catatan)}
      ${bisa ? `<form id="fOt" novalidate style="margin-top:18px;border-top:1px dashed var(--border-color);padding-top:16px">
        <div class="pf"><span>${esc(t('f_kursi'))}</span><div class="hitung"><button type="button" data-k="-1" aria-label="-">−</button><output id="oKursi">1</output><button type="button" data-k="1" aria-label="+">+</button>${r.maks_mobil ? `<span style="font-size:12px;color:var(--text-muted)">${esc(t('sisa', { n: r.sisa }))}</span>` : ''}</div></div>
        <div class="prow dua">
          <label class="pf"><span>${esc(t('f_nama'))}</span><input id="oNama" maxlength="80" autocomplete="name"></label>
          <label class="pf"><span>${esc(t('f_wa'))}</span><input id="oWa" type="tel" inputmode="tel" maxlength="20" autocomplete="tel" placeholder="${esc(t('f_wa_ph'))}"></label>
        </div>
        ${r.jemput_rumah ? `<label class="pf"><span>${esc(t('f_alamat'))}</span><textarea id="oAlamat" rows="2" maxlength="300" placeholder="${esc(t('f_alamat_ph'))}"></textarea></label>` : ''}
        <label class="pf" id="oPesertaBox" hidden><span>${esc(t('f_peserta'))} <i>${esc(t('f_peserta_s'))}</i></span><input id="oPeserta" maxlength="300"></label>
        <div class="pringkas"><div class="br total"><span id="oTotalL">${esc(t('total', { n: 1 }))}</span><b id="oTotal">${rp(r.harga)}</b></div></div>
        <label class="pchk"><input type="checkbox" id="oSetuju"><span>${t('setuju')}</span></label>
        <div class="pmsg" id="oMsg"></div>
        <button class="pbtn blok" type="submit" id="oKirim">${esc(t('bayar', { x: rp(r.harga) }))}</button>
        <p style="font-size:12px;color:var(--text-muted);text-align:center;margin:10px 0 0">${esc(t('aman'))}</p>
      </form>` : `<a class="pbtn wa blok" style="margin-top:18px" href="${esc(P.waLink(t('wa_msg') + ' ' + r.judul + ' (' + r.tanggal + ')'))}" target="_blank" rel="noopener">${esc(t('kosong_wa'))}</a>`}
      <button type="button" class="pbtn ghost blok" style="margin-top:10px" data-bagi>${esc(t('bagikan'))}</button>`;
    $('#modal').classList.add('on'); document.body.style.overflow = 'hidden';
    if (dorong) try { history.replaceState(null, '', '?id=' + r.id); } catch (e) {}
    P.muatSnap();
    P.lacak('mulai_booking', { lokasi: 'open_trip', trip: r.id });
  }
  function tutup() { $('#modal').classList.remove('on'); document.body.style.overflow = ''; aktif = null; try { history.replaceState(null, '', location.pathname); } catch (e) {} }
  function setKursi(n) {
    if (!aktif) return; kursi = Math.max(1, Math.min(n, aktif.sisa, 20));
    $('#oKursi').textContent = kursi; $('#oTotalL').textContent = t('total', { n: kursi });
    $('#oTotal').textContent = rp(aktif.harga * kursi); $('#oKirim').textContent = t('bayar', { x: rp(aktif.harga * kursi) });
    $('#oPesertaBox').hidden = kursi < 2;
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-buka]'); if (b) return buka(b.dataset.buka);
    if (e.target.closest('[data-tutup]') || e.target.id === 'modal') return tutup();
    const k = e.target.closest('#fOt [data-k]'); if (k) return setKursi(kursi + Number(k.dataset.k));
    if (e.target.closest('[data-bagi]') && aktif) {
      const url = `${location.origin}/open-trip?id=${aktif.id}`, judul = `Open Trip ${aktif.judul} - Tempera`;
      if (navigator.share) navigator.share({ title: judul, url }).catch(() => {});
      else navigator.clipboard && navigator.clipboard.writeText(url).then(() => { e.target.textContent = t('disalin'); });
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && aktif) tutup(); });
  document.addEventListener('submit', async (e) => {
    if (e.target.id !== 'fOt') return; e.preventDefault();
    const r = aktif, m = $('#oMsg'); P.bersih(m);
    const nama = $('#oNama').value.trim(), wa = P.normWA($('#oWa').value), al = $('#oAlamat') ? $('#oAlamat').value.trim() : '';
    if (!nama) return P.pesan(m, t('e_nama'));
    if (wa.length < 10 || wa.length > 15) return P.pesan(m, t('e_wa'));
    if (r.jemput_rumah && al.length < 5) return P.pesan(m, t('e_alamat'));
    if (!$('#oSetuju').checked) return P.pesan(m, t('e_setuju'));
    const b = $('#oKirim'); b.disabled = true; b.textContent = t('memproses');
    try {
      if (!(await P.muatSnap())) { P.pesan(m, t('e_snap')); return; }
      const d = await P.fungsi('pesan-open-trip', { trip_id: r.id, kursi, customer_name: nama, customer_wa: wa, alamat: al, peserta: $('#oPeserta').value.trim(), ref: P.getRef() });
      if (!d || !d.ok) {
        P.pesan(m, esc((d && d.error) || t('e_jaringan')));
        if (d && (d.penuh || d.tutup)) muat(r.id);
        return;
      }
      P.lacak('buat_pesanan', { value: Number(d.total) || 0, currency: 'IDR', produk: 'open_trip', trip: r.id, kursi });
      P.bayar(d, Number(d.total) || 0, m, 'open_trip');
    } catch (er) { P.pesan(m, t('e_jaringan')); }
    finally { b.disabled = false; b.textContent = t('bayar', { x: rp(r.harga * kursi) }); }
  });

  async function muat(bukaLagi) {
    try {
      const j = await P.rpc('open_trip_publik');
      if (!Array.isArray(j)) throw new Error('bukan larik');
      DATA = j; daftar();
      if (bukaLagi && aktif) { /* data penuh terbaru: perbarui label sisa tanpa menutup formulir */ const r = DATA.find((x) => x.id === aktif.id); if (r) { aktif.sisa = r.sisa; aktif.buka_pesan = r.buka_pesan; } }
      else { const q = new URL(location.href).searchParams.get('id'); if (q) buka(q, false); }
      seo();
    } catch (e) { $('#daftar').innerHTML = `<div class="kosong" style="grid-column:1/-1">${esc(t('gagal'))}</div>`; }
  }
  function seo() {
    const lama = document.getElementById('ldTrip'); if (lama) lama.remove();
    if (!DATA.length) return;
    const ld = { '@context': 'https://schema.org', '@graph': DATA.map((r) => ({ '@type': 'Event', name: `Open Trip ${r.judul}`, startDate: `${r.tanggal}T${r.jam}:00+07:00`, eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: r.tujuan, address: { '@type': 'PostalAddress', addressRegion: 'Jawa Barat', addressCountry: 'ID' } },
      organizer: { '@type': 'Organization', name: 'Tempera', url: 'https://tempera.id/' },
      offers: { '@type': 'Offer', price: String(r.harga), priceCurrency: 'IDR', availability: r.sisa > 0 && r.buka_pesan ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut', url: `https://tempera.id/open-trip?id=${r.id}` } })) };
    const s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ldTrip'; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
  }

  P.kamus({ id: ID, ms: MS });
  document.addEventListener('p-lang', () => { if (DATA.length || $('#daftar .otkartu')) daftar(); $('#waMelayang').href = P.waLink(t('wa_msg')); if (aktif) buka(aktif.id, false); });
  P.setelan(['admin_wa']).then(() => { $('#waMelayang').href = P.waLink(t('wa_msg')); }).catch(() => {});
  muat();
  setInterval(() => { if (!aktif && document.visibilityState === 'visible') muat(); }, 60000);
})();
