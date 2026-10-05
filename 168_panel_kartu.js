/* ===== BLOK 168 v3 (+kuota, kartu dibuat driver): panel -> Pengaturan -> "Kartu Nama Digital (uji coba anggota)" (berkas terpisah; muat SETELAH 166). Butuh SQL 167 + 169. v2: kode driver otomatis huruf besar (dipakai driver untuk mengisi kartunya sendiri dari dashboard mitra), tampil kapan driver terakhir mengubah dan menyetujui.
   Admin mengisi kartu tiap anggota: nama, foto, layanan, WA, rekening. Halaman publik: tempera.id/k/<alamat> (kartu-digital.html). ===== */
(function () {
  'use strict';
  const sebelumnya = VIEWS.pengaturan;
  VIEWS.pengaturan = async function () {
    await sebelumnya();
    const lama = $('#kdMount'); if (lama) lama.remove();
    const box = document.createElement('div'); box.id = 'kdMount'; $('#view').appendChild(box);
    pasang(box);
    await muat();
  };
  const WARNA = { biru: 'Biru', hijau: 'Hijau', ungu: 'Ungu', bata: 'Merah bata' };
  const HTTPS = /^https:\/\/[^\s"'<>]+$/i;
  let DATA = [];
  const terbuka = new Set();
  const situs = () => { let u = 'https://tempera.id'; try { if (typeof S !== 'undefined' && S && S.siteUrl) u = String(S.siteUrl); } catch (e) {} return u.replace(/\/+$/, ''); };
  const linkKartu = (slug, via) => `${situs()}/k/${slug}${via ? '?s=' + via : ''}`;
  const hariIni = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
  const tambahBulan = (iso) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCMonth(d.getUTCMonth() + 1); return d.toISOString().slice(0, 10); };
  const normWA = (v) => { const raw = String(v || '').trim(); const n = raw.replace(/[^0-9]/g, ''); if (raw.startsWith('+')) return n; if (n.startsWith('01')) return '60' + n.slice(1); if (n.startsWith('0')) return '62' + n.slice(1); if (n.startsWith('8')) return '62' + n; return n; };
  const layananKeTeks = (a) => (Array.isArray(a) ? a : []).map((x) => (x.harga ? `${x.nama} | ${x.harga}` : x.nama)).join('\n');
  const teksKeLayanan = (t) => String(t || '').split('\n').map((s) => s.trim()).filter(Boolean).map((s) => { const i = s.indexOf('|'); return i < 0 ? { nama: s.slice(0, 60), harga: '' } : { nama: s.slice(0, i).trim().slice(0, 60), harga: s.slice(i + 1).trim().slice(0, 30) }; }).filter((x) => x.nama);
  const qrData = (url) => { try { if (typeof qrcode !== 'function') return ''; const q = qrcode(0, 'M'); q.addData(url); q.make(); return q.createDataURL(5, 2); } catch (e) { return ''; } };
  function status(r) {
    if (!r.setuju) return ['Belum disetujui', '#B45309'];
    if (!r.aktif) return ['Tersembunyi', '#64748B'];
    if (r.berlaku_sampai && r.berlaku_sampai < hariIni()) return ['Berakhir', '#B91C1C'];
    return ['Tampil', '#059669'];
  }
  const lencana = (r) => { const [t, c] = status(r); return `<span style="display:inline-block;padding:2px 9px;border-radius:999px;font-size:11px;font-weight:700;color:#fff;background:${c}">${t}</span>`; };

  async function muat() {
    const m = $('#kdMount'); if (!m) return;
    const r = await sb.from('kd_kartu').select('*').order('id', { ascending: false });
    const kepala = '<h2 style="margin-top:24px">Kartu Nama Digital (uji coba anggota)</h2>';
    if (r.error) { m.innerHTML = `${kepala}<div class="card"><div class="help">Belum bisa dimuat: ${esc(r.error.message)}. Jalankan SQL 167 di Supabase dulu.</div></div>`; return; }
    DATA = r.data || [];
    const ks = await sb.from('app_settings').select('value').eq('key', 'kd_kuota');
    const kuota = parseInt(String((ks.data && ks.data[0] && ks.data[0].value) || '').replace(/"/g, ''), 10);
    const sendiri = DATA.filter((x) => x.dibuat_oleh === 'driver').length;
    m.innerHTML = `${kepala}
      <div class="small" style="margin-bottom:8px"><b>${DATA.length}</b> kartu dari kuota <b>${Number.isFinite(kuota) ? kuota : 20}</b>${DATA.length >= (Number.isFinite(kuota) ? kuota : 20) ? ' <b style="color:#B91C1C">(penuh)</b>' : ''} · dibuat sendiri oleh driver: <b>${sendiri}</b>. Ubah kuota di bagian Pengaturan (<code>kd_kuota</code>).</div>
      <div class="help" style="margin-bottom:10px">Satu kartu per anggota. Alamat publiknya <b>${esc(situs())}/k/&lt;alamat&gt;</b>. Kartu hanya tampil kalau <b>pemilik sudah setuju</b> datanya (nomor WA, foto, rekening) dilihat umum, statusnya Tampil, dan belum lewat tanggal berlaku. Alamat tidak bisa diubah setelah dibuat supaya QR yang sudah dibagikan tidak mati.</div>
      ${formBaru()}${DATA.map(itemHtml).join('') || '<div class="small" style="margin:8px 0">Belum ada kartu.</div>'}`;
  }

  function fields(r, baru) {
    const w = r.warna || 'biru';
    return `<div class="fgrid" data-kf>
      <div><label>Alamat (huruf kecil, angka, tanda hubung)<input data-f="slug" value="${esc(r.slug || '')}" maxlength="39" placeholder="mis. tmp-011 atau pakdedi"${baru ? '' : ' disabled'}></label></div>
      <div><label>Kode driver (isi supaya driver bisa mengisi sendiri)<input data-f="driver_kode" value="${esc(r.driver_kode || '')}" maxlength="40" placeholder="mis. TMP-011"></label></div>
      <div><label>Nama<input data-f="nama" value="${esc(r.nama || '')}" maxlength="60"></label></div>
      <div><label>Nomor WhatsApp<input data-f="wa" value="${esc(r.wa || '')}" inputmode="tel" maxlength="20" placeholder="0812xxxx atau +60 12xxxx"></label></div>
      <div class="full"><label>Bio satu baris (maks 140)<input data-f="bio" value="${esc(r.bio || '')}" maxlength="140" placeholder="mis. Sewa mobil dan antar-jemput di Bandung"></label></div>
      <div class="full"><label>Mobil dan layanan, satu per baris: <code>nama | harga</code><textarea data-f="layanan" rows="4" placeholder="Avanza 2022, 6 kursi | Rp 650.000 per hari&#10;Antar bandara | Rp 150.000">${esc(layananKeTeks(r.layanan))}</textarea></label></div>
      <div class="full"><label>Rekening (opsional; teks biasa, maks 300)<textarea data-f="rekening" rows="2" placeholder="BCA 1234567890 a.n. Nama Lengkap">${esc(r.rekening || '')}</textarea></label></div>
      <div class="full"><label>Foto profil (unggah dari HP, otomatis dikecilkan)<input type="file" accept="image/*" data-kd-foto></label>
        <input data-f="foto_url" value="${esc(r.foto_url || '')}" placeholder="https://… (terisi otomatis setelah unggah)"><div class="small" data-kd-fst></div></div>
      <div class="full"><label>Gambar QRIS (opsional)<input type="file" accept="image/*" data-kd-qris></label>
        <input data-f="qris_url" value="${esc(r.qris_url || '')}" placeholder="https://… (terisi otomatis setelah unggah)"><div class="small" data-kd-qst></div></div>
      <div><label>Warna kartu<select data-f="warna">${Object.keys(WARNA).map((k) => `<option value="${k}"${k === w ? ' selected' : ''}>${WARNA[k]}</option>`).join('')}</select></label></div>
      <div><label>Gratis sampai (catatan)<input type="date" data-f="gratis_sampai" value="${esc(r.gratis_sampai || '')}"></label></div>
      <div><label>Tampil sampai (kosong = tanpa batas)<input type="date" data-f="berlaku_sampai" value="${esc(r.berlaku_sampai || '')}"></label></div>
      <div><button class="btn ghost sm" type="button" data-kd-gratis>Mulai gratis 1 bulan dari hari ini</button></div>
      <div class="full"><label>Catatan admin (tidak tampil ke publik)<input data-f="catatan_admin" value="${esc(r.catatan_admin || '')}" maxlength="500"></label></div>
      <div class="full"><label class="chk"><input type="checkbox" data-f="setuju"${r.setuju ? ' checked' : ''}> Pemilik sudah setuju nomor WA, foto, dan rekening tampil untuk umum</label></div>
      <div class="full"><label class="chk"><input type="checkbox" data-f="aktif"${r.aktif === false ? '' : ' checked'}> Tampil</label></div>
    </div>`;
  }
  function itemHtml(r) {
    const url = linkKartu(r.slug), qr = qrData(linkKartu(r.slug, 'qr'));
    return `<details class="card" data-kid="${esc(r.id)}" style="margin-bottom:10px"${terbuka.has(String(r.id)) ? ' open' : ''}>
      <summary style="cursor:pointer"><b>${esc(r.nama)}</b> ${lencana(r)} <span class="small">${r.dibuat_oleh === 'driver' ? 'dibuat driver · ' : ''}/k/${esc(r.slug)}${r.berlaku_sampai ? ' · sampai ' + esc(r.berlaku_sampai) : ''}</span></summary>
      <div style="margin-top:10px">
        <div class="small" style="margin-bottom:8px">${r.driver_kode ? 'Driver ' + esc(r.driver_kode) + ' bisa mengisi sendiri' : '<b>Kode driver kosong: driver belum bisa mengisi sendiri</b>'}${r.diubah_driver ? ' · diubah driver ' + esc(new Date(r.diubah_driver).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })) : ''}${r.setuju_pada ? ' · setuju tampil ' + esc(new Date(r.setuju_pada).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })) : ''}</div>
        <div class="small" style="margin-bottom:8px">Dilihat: lewat QR <b>${esc(r.lihat_qr)}</b> · lewat link <b>${esc(r.lihat_link)}</b>${r.terakhir_dilihat ? ' · terakhir ' + esc(new Date(r.terakhir_dilihat).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })) : ''}</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
          ${qr ? `<img src="${esc(qr)}" alt="QR kartu ${esc(r.nama)}" width="120" height="120" style="background:#fff;border-radius:8px">` : ''}
          <div style="display:flex;flex-direction:column;gap:6px"><a href="${esc(url)}" target="_blank" rel="noopener">${esc(url)}</a>
            <div class="mbtns" style="justify-content:flex-start"><button class="btn ghost sm" type="button" data-kd-salin="${esc(url)}">Salin link</button>${qr ? `<a class="btn ghost sm" download="qr-${esc(r.slug)}.png" href="${esc(qr)}">Unduh QR</a>` : ''}</div></div>
        </div>
        ${fields(r, false)}
        <button class="btn sm" type="button" data-kd-simpan="${esc(r.id)}">Simpan</button> <button class="btn ghost sm" type="button" data-kd-hapus="${esc(r.id)}">Hapus</button>
      </div></details>`;
  }
  function formBaru() {
    return `<details class="card" data-kbaru style="margin-bottom:10px"><summary style="cursor:pointer"><b>+ Tambah kartu</b></summary>
      <div style="margin-top:10px">${fields({}, true)}<button class="btn sm" type="button" data-kd-tambah>Buat kartu</button></div></details>`;
  }
  const baca = (root) => { const o = {}; root.querySelectorAll('[data-f]').forEach((el) => { o[el.dataset.f] = el.type === 'checkbox' ? el.checked : el.value.trim(); }); return o; };
  function cek(v, baru) {
    if (baru && !/^[a-z0-9][a-z0-9-]{1,38}$/.test(v.slug)) return 'Alamat: 2-39 karakter, huruf kecil, angka, dan tanda hubung (tidak boleh diawali tanda hubung)';
    if (v.nama.length < 2 || v.nama.length > 60) return 'Nama 2-60 huruf';
    const wa = normWA(v.wa); if (!/^[0-9]{9,15}$/.test(wa)) return 'Nomor WhatsApp tidak valid';
    if (v.bio.length > 140) return 'Bio maksimal 140 huruf';
    if (v.foto_url && !HTTPS.test(v.foto_url)) return 'Alamat foto harus berawalan https://';
    if (v.qris_url && !HTTPS.test(v.qris_url)) return 'Alamat QRIS harus berawalan https://';
    if (v.rekening.length > 300) return 'Rekening maksimal 300 huruf';
    if (teksKeLayanan(v.layanan).length > 12) return 'Layanan maksimal 12 baris';
    if (v.berlaku_sampai && !/^\d{4}-\d{2}-\d{2}$/.test(v.berlaku_sampai)) return 'Tanggal berlaku tidak valid';
    if (v.aktif && !v.setuju) return 'Centang dulu: pemilik sudah setuju datanya tampil untuk umum';
    return '';
  }
  const muatan = (v) => ({ driver_kode: v.driver_kode ? v.driver_kode.toUpperCase() : null, nama: v.nama, bio: v.bio || null, wa: normWA(v.wa), foto_url: v.foto_url || null, layanan: teksKeLayanan(v.layanan), rekening: v.rekening || null, qris_url: v.qris_url || null, warna: v.warna, setuju: !!v.setuju, aktif: !!v.aktif, gratis_sampai: v.gratis_sampai || null, berlaku_sampai: v.berlaku_sampai || null, catatan_admin: v.catatan_admin || null });

  function pasang(m) {
    m.addEventListener('toggle', (e) => { const d = e.target; if (d && d.dataset && d.dataset.kid) { if (d.open) terbuka.add(d.dataset.kid); else terbuka.delete(d.dataset.kid); } }, true);
    m.addEventListener('change', async (e) => {
      const f = e.target; if (!f.matches || !(f.matches('[data-kd-foto]') || f.matches('[data-kd-qris]'))) return;
      const foto = f.matches('[data-kd-foto]'), file = f.files && f.files[0]; if (!file) return;
      const kf = f.closest('[data-kf]'), st = kf.querySelector(foto ? '[data-kd-fst]' : '[data-kd-qst]'), inp = kf.querySelector(foto ? '[data-f="foto_url"]' : '[data-f="qris_url"]');
      st.textContent = 'Mengunggah…';
      try { inp.value = await unggahGambar(file, { lebar: foto ? 600 : 800, folder: 'kartu' }); st.textContent = 'Terunggah. Tekan Simpan untuk menyimpan.'; }
      catch (er) { st.textContent = 'Gagal unggah: ' + (er && er.message ? er.message : er); }
      f.value = '';
    });
    m.addEventListener('click', async (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-kd-gratis')) {
        const kf = b.closest('[data-kf]'), h = hariIni(), s = tambahBulan(h);
        kf.querySelector('[data-f="gratis_sampai"]').value = s; kf.querySelector('[data-f="berlaku_sampai"]').value = s; toast('Gratis dan berlaku sampai ' + s + '. Tekan Simpan.'); return;
      }
      if (b.dataset.kdSalin) { try { await navigator.clipboard.writeText(b.dataset.kdSalin); toast('Link tersalin'); } catch (er) { toast('Tidak bisa menyalin', true); } return; }
      if (b.dataset.kdSimpan) {
        const id = Number(b.dataset.kdSimpan), v = baca(b.closest('details').querySelector('[data-kf]')), er = cek(v, false);
        if (er) { toast(er, true); return; }
        const r = await sb.from('kd_kartu').update(muatan(v)).eq('id', id);
        if (r.error) { toast(/driver_kode/i.test(r.error.message) ? 'Kode driver itu sudah punya kartu lain' : r.error.message, true); return; }
        toast('Kartu tersimpan'); terbuka.add(String(id)); await muat();
      } else if (b.dataset.kdHapus) {
        const id = Number(b.dataset.kdHapus);
        if (!confirm('Hapus kartu ini? Link dan QR-nya langsung mati. Untuk sekadar menyembunyikan, hilangkan centang Tampil lalu Simpan.')) return;
        const r = await sb.from('kd_kartu').delete().eq('id', id);
        if (r.error) { toast(r.error.message, true); return; }
        toast('Dihapus'); await muat();
      } else if (b.hasAttribute('data-kd-tambah')) {
        const v = baca(b.closest('details').querySelector('[data-kf]')), er = cek(v, true);
        if (er) { toast(er, true); return; }
        const r = await sb.from('kd_kartu').insert(Object.assign({ slug: v.slug }, muatan(v)));
        if (r.error) { toast(/driver_kode/i.test(r.error.message) ? 'Kode driver itu sudah punya kartu lain' : /duplicate|unique/i.test(r.error.message) ? 'Alamat itu sudah dipakai' : r.error.message, true); return; }
        toast('Kartu dibuat'); await muat();
      }
    });
  }
})();
