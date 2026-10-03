/* v2 (149): + kolom CARA BAYAR (rekening bank, QRIS, catatan). Perlu SQL 149.
/* ===== BLOK 134: tab HALAMAN DRIVER di panel (berkas terpisah, dimuat SETELAH skrip utama panel dan SETELAH blok 125) =====
   Admin mengisi halaman pribadi tiap driver (paket Dasar). Halaman publiknya: halaman.html?d=<slug>.
   Butuh: tabel driver_halaman (SQL 134) dan fungsi unggahGambar dari blok 125. */
(function () {
  'use strict';
  const MAKS_MOBIL = 5;
  const aman = (u) => (/^https:\/\/[^\s"'<>]+$/i.test(String(u || '').trim()) ? String(u).trim() : '');
  const linkHalaman = (slug) => `${S.siteUrl || location.origin + location.pathname.replace(/[^/]*$/, '').replace(/\/$/, '')}/halaman.html?d=${slug}`;
  let ROWS = {};
  let mobil = [];

  VIEWS.halaman = async function () {
    const r = await sb.from('driver_halaman').select('slug,nama_tampil,aktif,paket,updated_at');
    if (r.error) { $('#view').innerHTML = `<div class="empty">Gagal memuat: ${esc(r.error.message)}</div>`; return; }
    ROWS = {}; (r.data || []).forEach((x) => { ROWS[x.slug] = x; });
    $('#view').innerHTML = `<h2>Halaman Driver</h2>
      <div class="help">Halaman pribadi paket Dasar: profil, armada, dan formulir yang membuka WhatsApp driver. Pesanan lewat halaman ini tidak tercatat di sistem. Halaman hanya terlihat publik kalau <b>Aktif</b> dicentang.</div>
      <div class="card"><div class="tablewrap"><table><thead><tr><th>Driver</th><th>Halaman</th><th></th></tr></thead><tbody>
      ${S.drivers.filter((d) => d.is_active !== false).map((d) => { const h = ROWS[d.slug]; const link = h ? linkHalaman(d.slug) : '';
        return `<tr><td><b>${esc(d.name)}</b><div class="small">${esc(d.driver_code || d.slug)}</div></td>
        <td>${h ? `<span class="badge ${h.aktif ? 'b-paid' : 'b-pending'}">${h.aktif ? 'Aktif' : 'Belum aktif'}</span> <span class="small">${esc(h.paket)}</span>` : '<span class="badge">Belum dibuat</span>'}</td>
        <td class="num"><button class="btn sm" type="button" data-hm-atur="${esc(d.slug)}">${h ? 'Ubah' : 'Buat'}</button>
          ${h ? `<button class="btn ghost sm" type="button" data-copy="${esc(link)}">Salin link</button> <a class="btn ghost sm" href="${esc(link)}" target="_blank" rel="noopener" style="text-decoration:none">Buka</a>` : ''}</td></tr>`; }).join('') || '<tr><td colspan="3" class="empty">Belum ada driver aktif.</td></tr>'}
      </tbody></table></div></div>`;
  };

  const gambarField = (id, label, nilai) => `<div class="full"><label>${esc(label)}</label><div id="hm_${id}_p">${aman(nilai) ? `<img src="${esc(aman(nilai))}" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:12px;display:block;margin-bottom:6px">` : ''}</div>
    <input type="hidden" id="hm_${id}" value="${esc(aman(nilai))}"><input type="file" accept="image/*" data-hm-img="${id}"><div class="help" id="hm_${id}_s">&nbsp;</div></div>`;

  function barisMobil() {
    $('#hmMobil').innerHTML = mobil.map((m, i) => `<div class="card" style="margin-bottom:8px;padding:10px">
      <div class="fgrid">
        <div><label>Jenis mobil<input data-hm-m="${i}" data-f="jenis" value="${esc(m.jenis || '')}" maxlength="60" placeholder="mis. Avanza"></label></div>
        <div><label>Tahun<input data-hm-m="${i}" data-f="tahun" value="${esc(m.tahun || '')}" maxlength="4" inputmode="numeric"></label></div>
        <div><label>Kapasitas (orang)<input data-hm-m="${i}" data-f="kapasitas" value="${esc(m.kapasitas || '')}" maxlength="2" inputmode="numeric"></label></div>
        <div><label>Harga mulai (Rp)<input data-hm-m="${i}" data-f="harga_mulai" value="${esc(m.harga_mulai || '')}" maxlength="16" inputmode="numeric"></label></div>
        <div class="full"><label>Keterangan harga<input data-hm-m="${i}" data-f="harga_ket" value="${esc(m.harga_ket || '')}" maxlength="80" placeholder="mis. per 12 jam, sudah termasuk BBM"></label></div>
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${aman(m.foto) ? `<img src="${esc(aman(m.foto))}" alt="" style="width:64px;height:48px;object-fit:cover;border-radius:8px">` : ''}
        <input type="file" accept="image/*" data-hm-mfoto="${i}" style="flex:1;min-width:160px"><button class="btn danger sm" type="button" data-hm-mhapus="${i}">Hapus</button></div></div>`).join('') || '<div class="small">Belum ada mobil.</div>';
    $('#hmTambah').style.display = mobil.length >= MAKS_MOBIL ? 'none' : '';
  }

  function formHalaman(slug) {
    const d = S.drivers.find((x) => x.slug === slug); if (!d) return;
    const rowMini = ROWS[slug];
    (async () => {
      let h = null;
      if (rowMini) { const r = await sb.from('driver_halaman').select('*').eq('slug', slug).limit(1); h = (r.data || [])[0] || null; }
      h = h || { slug, nama_tampil: d.name, slogan: '', bio: '', kota: '', wa: normWA(d.phone || ''), foto_profil: aman(d.photo_url), foto_sampul: '', logo_url: '', warna: '#0891b2', mobil: [], sosial: {}, paket: 'dasar', aktif: false };
      mobil = (Array.isArray(h.mobil) ? h.mobil : []).map((m) => ({ ...m }));
      const sos = h.sosial || {};
      openModal(`<h2>${rowMini ? 'Ubah' : 'Buat'} halaman: ${esc(d.name)}</h2>
        <div class="help">Alamat: ${esc(linkHalaman(slug))}</div>
        <div class="fgrid">
          <div><label>Nama tampilan *<input id="hm_nama" maxlength="80" value="${esc(h.nama_tampil)}"></label></div>
          <div><label>Kota<input id="hm_kota" maxlength="60" value="${esc(h.kota || '')}" placeholder="mis. Bandung"></label></div>
          <div class="full"><label>Slogan singkat<input id="hm_slogan" maxlength="120" value="${esc(h.slogan || '')}"></label></div>
          <div class="full"><label>Tentang (maks 800 huruf)<textarea id="hm_bio" rows="4" maxlength="800">${esc(h.bio || '')}</textarea></label></div>
          <div><label>Nomor WA yang tampil ke publik *<input id="hm_wa" value="${esc(h.wa || '')}" inputmode="numeric" placeholder="08xx atau 62xx"></label></div>
          <div><label>Warna utama<input id="hm_warna" type="color" value="${esc(/^#[0-9a-fA-F]{6}$/.test(h.warna) ? h.warna : '#0891b2')}" style="padding:2px"></label></div>
          ${gambarField('foto_profil', 'Foto profil', h.foto_profil)}${gambarField('foto_sampul', 'Foto sampul (lebar)', h.foto_sampul)}${gambarField('logo_url', 'Logo (opsional, menggantikan foto profil)', h.logo_url)}
          <div><label>Instagram (alamat https)<input id="hm_ig" value="${esc(sos.instagram || '')}" placeholder="https://instagram.com/..."></label></div>
          <div><label>TikTok (alamat https)<input id="hm_tt" value="${esc(sos.tiktok || '')}"></label></div>
          <div class="full"><label>Facebook (alamat https)<input id="hm_fb" value="${esc(sos.facebook || '')}"></label></div>
          <div class="full"><label>Rekening bank (satu bank per baris, atau pisahkan dengan ;)<textarea id="hm_rekening" rows="3" maxlength="1200" placeholder="BCA | 1234567890 | Nama Pemilik | bank-bca.png">${esc(h.rekening || '')}</textarea></label>
            <div class="help">Format: <b>Bank | Nomor rekening | Atas nama | logo</b>. Logo boleh dikosongkan (tampil lencana teks) atau diisi nama berkas di folder images (mis. bank-bca.png). Maksimal 6 bank.</div></div>
          <div class="full"><label>QRIS: nama berkas di folder images, atau alamat https<input id="hm_qris" maxlength="500" value="${esc(h.qris_url || '')}" placeholder="qris-rafly.png"></label>
            <input type="file" accept="image/*" data-hm-qris="1"><div class="help" id="hm_qris_s">Pengunggah mengecilkan gambar. Setelah mengunggah, pindai QR-nya sendiri untuk memastikan masih terbaca; kalau tidak, unggah berkas PNG asli ke folder images.</div></div>
          <div class="full"><label>Catatan pembayaran (maks 400 huruf)<textarea id="hm_infobayar" rows="2" maxlength="400" placeholder="mis. Kirim bukti bayar lewat WhatsApp setelah transfer.">${esc(h.info_bayar || '')}</textarea></label></div>
          <div><label>Paket<select id="hm_paket"><option value="dasar" ${h.paket === 'dasar' ? 'selected' : ''}>Dasar</option><option value="pro" ${h.paket === 'pro' ? 'selected' : ''}>Pro</option></select></label></div>
          <div><label class="chk"><input id="hm_aktif" type="checkbox" ${h.aktif ? 'checked' : ''}> Aktif (terlihat publik)</label></div>
        </div>
        <h2 style="margin-top:12px">Mobil (maks ${MAKS_MOBIL})</h2><div id="hmMobil"></div>
        <button class="btn ghost sm" type="button" id="hmTambah">+ Tambah mobil</button>
        <div class="mbtns"><button class="btn ghost" id="hmBatal" type="button">Batal</button><button class="btn" id="hmSimpan" type="button" data-slug="${esc(slug)}">Simpan</button></div>`);
      barisMobil();
      $('#hmBatal').addEventListener('click', closeModal);
      $('#hmTambah').addEventListener('click', () => { if (mobil.length < MAKS_MOBIL) { mobil.push({ jenis: '', tahun: '', kapasitas: '', harga_mulai: '', harga_ket: '', foto: '' }); barisMobil(); } });
      $('#hmSimpan').addEventListener('click', () => simpan(slug));
    })();
  }

  async function simpan(slug) {
    const v = (id) => $('#hm_' + id).value.trim();
    const wa = normWA(v('wa'));
    if (!v('nama')) { toast('Nama tampilan wajib diisi', true); return; }
    if (!/^[0-9]{9,15}$/.test(wa)) { toast('Nomor WA tidak valid', true); return; }
    const sosial = {}; [['instagram', 'ig'], ['tiktok', 'tt'], ['facebook', 'fb']].forEach(([k, id]) => { const x = v(id); if (x) { if (!aman(x)) { sosial.__salah = k; } else sosial[k] = x; } });
    if (sosial.__salah) { toast(`Alamat ${sosial.__salah} harus diawali https://`, true); return; }
    const mob = mobil.filter((m) => String(m.jenis || '').trim()).map((m) => ({
      jenis: String(m.jenis).trim().slice(0, 60), tahun: String(m.tahun || '').replace(/\D/g, '').slice(0, 4), kapasitas: String(m.kapasitas || '').replace(/\D/g, '').slice(0, 2),
      harga_mulai: String(m.harga_mulai || '').replace(/\D/g, '').slice(0, 9), harga_ket: String(m.harga_ket || '').trim().slice(0, 80), foto: aman(m.foto) }));
    const payload = { slug, nama_tampil: v('nama'), slogan: v('slogan') || null, bio: v('bio') || null, kota: v('kota') || null, wa,
      foto_profil: v('foto_profil') || null, foto_sampul: v('foto_sampul') || null, logo_url: v('logo_url') || null, warna: $('#hm_warna').value,
      mobil: mob, sosial, paket: $('#hm_paket').value, aktif: $('#hm_aktif').checked };
    const barisRek = $('#hm_rekening').value.split(/\n|;/).map((x) => x.trim()).filter(Boolean);
    const rapi = [];
    for (let i = 0; i < barisRek.length; i++) {
      const [bk, no, an, lg] = barisRek[i].split('|').map((x) => String(x || '').trim());
      if (!bk || !no || bk.length > 30 || !/^[0-9][0-9 .\-]{3,30}$/.test(no)) { toast(`Rekening baris ${i + 1} tidak valid: harus "Bank | Nomor | Atas nama | logo", nomor hanya angka`, true); return; }
      if (lg && !/^(https:\/\/[^\s"'<>]+|[A-Za-z0-9_.-]+)$/.test(lg)) { toast(`Logo di baris ${i + 1} harus nama berkas atau alamat https`, true); return; }
      rapi.push([bk, no, an || '', lg || ''].join(' | ').replace(/( \| )+$/, ''));
    }
    if (rapi.length > 6) { toast('Maksimal 6 rekening', true); return; }
    const qrisIsi = $('#hm_qris').value.trim();
    if (qrisIsi && !/^(https:\/\/[^\s"'<>]+|[A-Za-z0-9_.-]+)$/.test(qrisIsi)) { toast('QRIS harus nama berkas (tanpa spasi) atau alamat https', true); return; }
    payload.rekening = rapi.length ? rapi.join('\n') : null; payload.qris_url = qrisIsi || null; payload.info_bayar = $('#hm_infobayar').value.trim() || null;
    const b = $('#hmSimpan'); b.disabled = true;
    const r = await sb.from('driver_halaman').upsert(payload, { onConflict: 'slug' });
    b.disabled = false;
    if (r.error) { toast(r.error.message, true); return; }
    toast('Tersimpan'); closeModal(); VIEWS.halaman();
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-hm-atur]'); if (a) { formHalaman(a.dataset.hmAtur); return; }
    const x = e.target.closest('[data-hm-mhapus]'); if (x) { mobil.splice(+x.dataset.hmMhapus, 1); barisMobil(); }
  });
  document.addEventListener('input', (e) => {
    const i = e.target.dataset && e.target.dataset.hmM; if (i === undefined || !mobil[+i]) return; mobil[+i][e.target.dataset.f] = e.target.value;
  });
  document.addEventListener('change', async (e) => {
    const t = e.target; if (!t.matches || !t.matches('input[type="file"]') || !t.files || !t.files[0]) return;
    if (typeof unggahGambar !== 'function') { toast('Fungsi unggah gambar (blok 125) belum termuat', true); return; }
    if (t.dataset.hmQris) {
      const st = $('#hm_qris_s'); st.textContent = 'Mengunggah…';
      try { const url = await unggahGambar(t.files[0], { lebar: 1400, folder: 'tempera/halaman' }); $('#hm_qris').value = url; st.textContent = 'Terunggah. Pindai QR-nya untuk memastikan terbaca, lalu tekan Simpan.'; }
      catch (err) { st.textContent = 'Gagal: ' + err.message; }
      t.value = ''; return;
    }
    const kunci = t.dataset.hmImg, idx = t.dataset.hmMfoto; if (!kunci && idx === undefined) return;
    const st = kunci ? $('#hm_' + kunci + '_s') : null; if (st) st.textContent = 'Mengunggah…';
    try {
      const url = await unggahGambar(t.files[0], { lebar: kunci === 'foto_sampul' ? 1600 : 1000, folder: 'tempera/halaman' });
      if (kunci) { $('#hm_' + kunci).value = url; $('#hm_' + kunci + '_p').innerHTML = `<img src="${esc(url)}" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:12px;display:block;margin-bottom:6px">`; st.textContent = 'Terunggah. Tekan Simpan.'; }
      else { mobil[+idx].foto = url; barisMobil(); }
    } catch (err) { if (st) st.textContent = 'Gagal: ' + err.message; else toast('Gagal unggah: ' + err.message, true); }
    t.value = '';
  });

  NAVS.splice(Math.max(0, NAVS.findIndex((n) => n[0] === 'driver')) + 1, 0, ['halaman', 'Halaman Driver']);
  try { if ($('#shell') && !$('#shell').hidden) nav(location.hash.replace('#', '') || 'pesanan'); } catch (_e) { /* belum login */ }
})();
