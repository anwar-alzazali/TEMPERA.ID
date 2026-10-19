/* ===== BLOK 170: merapikan tab Pengaturan (berkas terpisah; muat PALING AKHIR, setelah 154 dan 166). =====
   Tidak mengubah isi atau penyimpanan apa pun: hanya mengelompokkan isian menjadi kartu yang bisa dilipat,
   melipat bagian tambahan (Destinasi, Pengumuman, dll.), dan menambah kotak cari. */
(function () {
  'use strict';
  const GRUP = [
    ['Pembayaran & DP', ['payment_gateway', 'teks_pembayaran', 'dp_percent', 'manual_banks', 'manual_bayar_info', 'manual_qris_image', 'manual_expiry_jam']],
    ['Biaya & potongan', ['admin_cut_type', 'admin_cut_value', 'cross_cost_2', 'cross_cost_3', 'booking_min_hours', 'kas_percent_admin']],
    ['Perusahaan & dokumen', ['company_name', 'company_tagline', 'company_address', 'company_logo_url', 'site_url', 'invoice_footer', 'sj_note', 'sj_signer_name', 'sj_signer_title', 'sj_stamp_url']],
    ['Tampilan situs', ['hero_bg_image', 'hero_title', 'hero_subtitle', 'hero_title_ms', 'hero_subtitle_ms', 'social_instagram', 'social_tiktok', 'social_facebook', 'google_review_url']],
    ['WhatsApp & asisten AI', ['admin_wa', 'tugas_kabari_lama', 'ai_mode', 'ai_penguji', 'ai_semua_nomor', 'ai_catatan']],
    ['Driver & iuran kas', ['driver_code_prefix', 'kd_kuota', 'iuran_biaya_layanan', 'iuran_mulai']],
    ['Teknis (jangan diubah)', ['kas_token', 'tugas_secret']]
  ];
  const terbuka = new Set(['Pembayaran & DP']);   // judul bagian yang sedang terbuka (diingat antar muat ulang)
  const norm = (t) => String(t || '').replace(/\s+/g, ' ').trim();
  const esc2 = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function buatDetails(judul, jumlah) {
    const d = document.createElement('details'); d.className = 'pgrp'; d.dataset.judul = judul;
    d.open = terbuka.has(judul);
    d.innerHTML = `<summary><span>${esc2(judul)}${jumlah ? `<span class="n">${jumlah} isian</span>` : ''}</span></summary><div class="pgbody"></div>`;
    d.addEventListener('toggle', () => { if (d.dataset.cari) return; if (d.open) terbuka.add(judul); else terbuka.delete(judul); });
    return d;
  }

  function rapikanIsian() {
    const view = document.getElementById('view'); if (!view) return;
    if (view.querySelector('#pgSet')) return;
    const kartu = [...view.children].find((el) => el.classList && el.classList.contains('card') && el.querySelector('.setrow'));
    if (!kartu) return;
    const baris = [...kartu.querySelectorAll('.setrow')];
    const kunci = (r) => { const e = r.querySelector('[data-key]'); return e ? e.dataset.key : ''; };
    const peta = new Map(); GRUP.forEach(([j, ks]) => ks.forEach((k) => peta.set(k, j)));
    const isi = new Map(); GRUP.forEach(([j]) => isi.set(j, []));
    isi.set('Lainnya', []);
    baris.forEach((r) => { const j = peta.get(kunci(r)) || 'Lainnya'; isi.get(j).push(r); });
    // urutan dalam kelompok mengikuti daftar di atas (bukan abjad)
    GRUP.forEach(([j, ks]) => isi.get(j).sort((a, b) => ks.indexOf(kunci(a)) - ks.indexOf(kunci(b))));
    const bantuan = kartu.nextElementSibling && kartu.nextElementSibling.classList.contains('help') ? kartu.nextElementSibling : null;
    const wadah = document.createElement('div'); wadah.id = 'pgSet';
    wadah.innerHTML = '<input type="search" id="pgCari" placeholder="Cari pengaturan… (mis. DP, rekening, logo)" autocomplete="off" style="margin-bottom:12px">';
    isi.forEach((rs, j) => {
      if (!rs.length) return;
      const d = buatDetails(j, rs.length); const body = d.querySelector('.pgbody');
      if (j === 'Biaya & potongan' && bantuan) { bantuan.style.margin = '0 0 6px'; body.appendChild(bantuan); }
      rs.forEach((r) => body.appendChild(r)); wadah.appendChild(d);
    });
    kartu.replaceWith(wadah);
    const cari = wadah.querySelector('#pgCari');
    cari.addEventListener('input', () => {
      const q = norm(cari.value).toLowerCase();
      wadah.querySelectorAll('details.pgrp').forEach((d) => {
        let ada = 0;
        d.querySelectorAll('.setrow').forEach((r) => { const cocok = !q || norm(r.textContent + ' ' + kunci(r)).toLowerCase().includes(q); r.style.display = cocok ? '' : 'none'; if (cocok) ada++; });
        d.style.display = ada ? '' : 'none';
        if (q) { d.dataset.cari = '1'; d.open = ada > 0; } else { delete d.dataset.cari; d.open = terbuka.has(d.dataset.judul); }
      });
    });
  }

  // Bagian tambahan (h2 + isi) dalam wadah #dsMount / #pgMount dilipat; dilakukan ulang bila wadah digambar ulang.
  function lipat(m) {
    if (!m || ![...m.children].some((c) => c.tagName === 'H2')) return;
    const anak = [...m.children]; const hasil = []; let cur = null;
    anak.forEach((el) => {
      if (el.tagName === 'H2') { cur = { judul: norm(el.textContent), els: [] }; hasil.push(cur); el.remove(); }
      else if (cur) cur.els.push(el);
    });
    hasil.forEach((h) => {
      const d = buatDetails(h.judul, 0); const body = d.querySelector('.pgbody');
      h.els.forEach((e) => body.appendChild(e)); m.appendChild(d);
    });
  }
  function awasi(id) {
    const m = document.getElementById(id); if (!m || m.dataset.rapi) return;
    m.dataset.rapi = '1'; lipat(m);
    new MutationObserver(() => lipat(m)).observe(m, { childList: true });
  }

  const sebelumnya = VIEWS.pengaturan;
  VIEWS.pengaturan = async function () {
    await sebelumnya();
    rapikanIsian();
    const v = document.getElementById('view');
    if (v) { const h = [...v.children].find((c) => c.tagName === 'H2'); if (h && /^Pengaturan$/i.test(norm(h.textContent))) h.remove(); }
    awasi('dsMount'); awasi('pgMount');
    // judul halaman seragam dengan tab lain
    if (v && !v.querySelector('.pagehead')) v.insertAdjacentHTML('afterbegin', '<div class="pagehead"><h1>Pengaturan</h1><p>Dikelompokkan per topik. Ketuk judul untuk membuka. Perubahan berlaku untuk pesanan berikutnya.</p></div>');
  };
})();
