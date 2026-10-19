/* ===== BLOK 125 (tempel di paling bawah panel.html, tepat di atas tag penutup script, SETELAH blok 104) =====
   Isi: (1) tombol "Tandai DP / Lunas" untuk pesanan manual, (2) kolom Pengaturan banyak-baris (catatan AI, petunjuk bayar) + unggah gambar hero,
        (3) unggah gambar dari HP untuk Armada & Banner (tanpa alamat URL), (4) tab Galeri (unggah banyak foto + watermark). */

/* ---------- (1) PEMBAYARAN MANUAL ---------- */
const _openOrder125 = openOrder;
openOrder = async function (id) {
  await _openOrder125(id);
  const o = ORDERS.find((x) => x.id === id);
  if (!o || o.status !== 'pending' || o.midtrans_status !== 'manual') return;
  const act = $('#modalBody .act'); if (!act) return;
  const isDP = o.payment_mode === 'dp', jumlah = isDP ? o.dp_amount : o.total;
  const box = document.createElement('div');
  box.style.cssText = 'background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:12px;margin-bottom:12px';
  box.innerHTML = `<b>Pembayaran manual — menunggu</b><div class="small" style="margin:4px 0 8px">Cek mutasi BRImo / GoPay Merchant. Harus masuk: <b>${rp(jumlah)}</b> (${isDP ? 'DP' : 'lunas'}).</div><button class="btn" type="button" id="oBayarManual">✅ Tandai ${isDP ? 'DP diterima' : 'Lunas'} (${rp(jumlah)})</button>`;
  act.prepend(box);
  const kirimTandai = async (paksa) => {
    const ses = await sb.auth.getSession(); const tok = ses.data && ses.data.session && ses.data.session.access_token;
    const r = await fetch(`${SB_URL}/functions/v1/bayar-manual`, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SB_KEY, Authorization: `Bearer ${tok}` }, body: JSON.stringify({ order_id: o.order_id, paksa: !!paksa }) });
    return r.json().catch(() => ({ ok: false, error: 'Balasan tidak terbaca' }));
  };
  $('#oBayarManual').addEventListener('click', async (e) => {
    if (!confirm(`Pastikan ${rp(jumlah)} sudah masuk di mutasi.\n\nTandai ${isDP ? 'DP diterima' : 'LUNAS'} sekarang? Konfirmasi WA akan dikirim ke pelanggan dan driver, invoice terbit.`)) return;
    e.target.disabled = true;
    let j = await kirimTandai(false);
    if (j.penuh && confirm(j.error + '\n\nTetap tandai (abaikan armada penuh)?')) j = await kirimTandai(true);
    if (!j.ok) { e.target.disabled = false; toast(j.error || 'Gagal menandai', true); return; }
    toast(j.sudah ? 'Sudah diproses sebelumnya' : 'Ditandai. Konfirmasi dikirim.'); closeModal(); loadOrders();
  });
};

/* ---------- (3) PENGUNGGAH GAMBAR (dipakai Armada, Banner, hero, Galeri) ---------- */
const MEDIA_BUCKET = 'media';
function bacaGambar(file) {
  return new Promise((res, rej) => { const u = URL.createObjectURL(file); const i = new Image();
    i.onload = () => { URL.revokeObjectURL(u); res(i); }; i.onerror = () => { URL.revokeObjectURL(u); rej(new Error('Berkas bukan gambar yang bisa dibaca')); }; i.src = u; });
}
async function pasangWatermark(c, x) {
  try {
    const logo = await loadImg(QR_LOGO_SRC);
    const t = document.createElement('canvas'); t.width = 1328; t.height = 1287; const tx = t.getContext('2d');
    tx.drawImage(logo, 0, 151, 1328, 1287, 0, 0, 1328, 1287); tx.globalCompositeOperation = 'source-in'; tx.fillStyle = '#fff'; tx.fillRect(0, 0, 1328, 1287);
    const lw = Math.round(c.width * 0.16), lh = Math.round(lw * 1287 / 1328), cx = c.width / 2, y0 = Math.round(c.height * 0.70);
    x.save(); x.globalAlpha = 0.35; x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = Math.round(lw * 0.06);
    x.drawImage(t, Math.round(cx - lw / 2), y0, lw, lh);
    const fs = Math.max(12, Math.round(lw * 0.22)); x.font = `700 ${fs}px system-ui,Arial,sans-serif`; x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'top';
    x.fillText('tempera.id', cx, y0 + lh + Math.round(fs * 0.25)); x.restore();
  } catch (_e) { /* logo gagal dimuat: foto tetap dipakai tanpa watermark */ }
}
// Kecilkan di browser (EXIF/GPS ikut terhapus karena digambar ulang), WEBP; cadangan JPEG untuk browser lama
async function kecilkanGambar(file, opsi) {
  const { lebar = 1200, kualitas = 0.8, watermark = false } = opsi || {};
  const img = await bacaGambar(file);
  const skala = Math.min(1, lebar / img.naturalWidth), w = Math.round(img.naturalWidth * skala), h = Math.round(img.naturalHeight * skala);
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(img, 0, 0, w, h);
  if (watermark) await pasangWatermark(c, x);
  let blob = await new Promise((r) => c.toBlob(r, 'image/webp', kualitas)), ext = 'webp';
  if (!blob || blob.type !== 'image/webp') { blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.85)); ext = 'jpg'; }
  return { blob, ext, w, h };
}
async function unggahGambar(file, opsi) {
  const { folder = 'umum' } = opsi || {};
  const k = await kecilkanGambar(file, opsi);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${k.ext}`;
  const up = await sb.storage.from(MEDIA_BUCKET).upload(path, k.blob, { contentType: k.blob.type, cacheControl: '31536000', upsert: false });
  if (up.error) throw new Error(up.error.message);
  return sb.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
const gambarSrc = (v) => (/^https?:\/\//i.test(v) ? v : `${S.siteUrl}/images/${String(v).replace(/^\/+/, '')}`);

// jenis isian baru: 'gambar' (banyak, daftar) dan 'gambarsatu' (satu)
const _fieldHTML125 = fieldHTML;
fieldHTML = function (f, val, disabled) {
  const id = 'f_' + f.key, cls = f.full ? ' class="full"' : '';
  if (f.type === 'gambar') return `<div${cls}><label>${esc(f.label)}</label><div id="${id}_list"></div><input type="hidden" id="${id}" value="${esc(JSON.stringify(Array.isArray(val) ? val : []))}"><input type="file" accept="image/*" multiple data-upl="multi" data-target="${id}" data-lebar="${f.lebar || 1200}"><div class="help" id="${id}_st">Pilih foto dari galeri HP. Otomatis dikecilkan. ★ = jadikan foto utama.</div></div>`;
  if (f.type === 'gambarsatu') return `<div${cls}><label>${esc(f.label)}</label><div id="${id}_list"></div><input type="hidden" id="${id}" value="${esc(val || '')}"><input type="file" accept="image/*" data-upl="one" data-target="${id}" data-lebar="${f.lebar || 1200}"><div class="help" id="${id}_st"></div></div>`;
  return _fieldHTML125(f, val, disabled);
};
const _readField125 = readField;
readField = function (f, required) {
  if (f.type === 'gambar') { try { const a = JSON.parse($('#f_' + f.key).value || '[]'); return Array.isArray(a) ? a : []; } catch (_e) { return []; } }
  if (f.type === 'gambarsatu') { const v = $('#f_' + f.key).value.trim(); return v || null; }
  return _readField125(f, required);
};
function gambarDaftar(id) {
  const h = $('#' + id), list = $('#' + id + '_list'); if (!h || !list) return [];
  const multi = !!$(`[data-upl="multi"][data-target="${id}"]`);
  let arr; if (multi) { try { arr = JSON.parse(h.value || '[]'); } catch (_e) { arr = []; } } else arr = h.value ? [h.value] : [];
  return { h, list, multi, arr };
}
function gambarRender(id) {
  const g = gambarDaftar(id); if (!g.list) return;
  g.list.innerHTML = g.arr.map((v, i) => `<div style="display:inline-block;margin:0 8px 8px 0;text-align:center"><img src="${esc(gambarSrc(v))}" alt="" style="width:84px;height:64px;object-fit:cover;border-radius:8px;border:1px solid var(--line);display:block"><div style="display:flex;gap:4px;justify-content:center;margin-top:4px">${g.multi && i > 0 ? `<button type="button" class="btn ghost sm" data-gmb-first="${esc(id)}|${i}">★</button>` : ''}<button type="button" class="btn ghost sm" data-gmb-del="${esc(id)}|${i}">✕</button></div></div>`).join('') || '<div class="small">Belum ada gambar.</div>';
}
function gambarSimpan(id, arr) { const g = gambarDaftar(id); g.h.value = g.multi ? JSON.stringify(arr) : (arr[0] || ''); gambarRender(id); }
const _openForm125 = openForm;
openForm = function (key, row) { _openForm125(key, row); $$('#modalBody [data-upl]').forEach((el) => gambarRender(el.dataset.target)); };
document.addEventListener('click', (e) => {
  const d = e.target.closest('[data-gmb-del]'), f = e.target.closest('[data-gmb-first]');
  if (d) { const [id, i] = d.dataset.gmbDel.split('|'); const g = gambarDaftar(id); g.arr.splice(+i, 1); gambarSimpan(id, g.arr); }
  if (f) { const [id, i] = f.dataset.gmbFirst.split('|'); const g = gambarDaftar(id); const [v] = g.arr.splice(+i, 1); g.arr.unshift(v); gambarSimpan(id, g.arr); }
});
document.addEventListener('change', async (e) => {
  const inp = e.target; if (!inp.matches || !inp.matches('input[data-upl]')) return;
  const id = inp.dataset.target, st = $('#' + id + '_st'), files = [...inp.files]; if (!files.length) return;
  const g = gambarDaftar(id); let arr = g.arr.slice();
  for (let i = 0; i < files.length; i++) {
    st.textContent = `Mengunggah ${i + 1} dari ${files.length}…`;
    try {
      const url = await unggahGambar(files[i], { lebar: +inp.dataset.lebar || 1200, folder: id.replace(/^f_/, '') });
      if (g.multi) arr.push(url); else arr = [url];
      gambarSimpan(id, arr);
    } catch (err) { st.textContent = 'Gagal: ' + err.message; inp.value = ''; return; }
  }
  st.textContent = 'Terunggah. Tekan Simpan untuk menyimpan perubahan.'; inp.value = '';
});
(function () {
  const a = RES.armada.fields.find((f) => f.key === 'images'); if (a) { a.type = 'gambar'; a.lebar = 1200; }
  const b = RES.banner.fields.find((f) => f.key === 'image_url'); if (b) { b.type = 'gambarsatu'; b.lebar = 1600; b.label = 'Gambar banner'; }
})();

/* ---------- (2) PENGATURAN: kolom banyak-baris + unggah gambar hero ---------- */
const MULTI_SET = ['ai_catatan', 'manual_bayar_info'];
const _pengaturan125 = VIEWS.pengaturan;
VIEWS.pengaturan = async function () {
  await _pengaturan125();
  MULTI_SET.forEach((k) => {
    const inp = $(`#view input[data-key="${k}"]`); if (!inp) return;
    const ta = document.createElement('textarea'); ta.rows = 8; ta.value = inp.value; ta.dataset.key = k; inp.replaceWith(ta);
    const old = ta.closest('.setrow').querySelector('button[data-save]'), nb = old.cloneNode(true); old.replaceWith(nb);   // lepas penanganan lama (hanya membaca <input>)
    nb.addEventListener('click', async () => { const r = await sb.from('app_settings').update({ value: ta.value.trim() }).eq('key', k); if (r.error) { toast(r.error.message, true); return; } toast('Tersimpan'); });
  });
  const hero = $('#view input[data-key="hero_bg_image"]');
  if (hero) {
    const fi = document.createElement('input'); fi.type = 'file'; fi.accept = 'image/*'; fi.style.marginTop = '6px'; hero.after(fi);
    const st = document.createElement('div'); st.className = 'help'; st.textContent = 'Unggah dari HP: otomatis dikecilkan (lebar maks 1920) dan langsung disimpan.'; fi.after(st);
    fi.addEventListener('change', async () => {
      const f = fi.files[0]; if (!f) return; st.textContent = 'Memproses…';
      try {
        const url = await unggahGambar(f, { lebar: 1920, folder: 'hero' });
        const r = await sb.from('app_settings').update({ value: url }).eq('key', 'hero_bg_image');
        if (r.error) throw new Error(r.error.message);
        hero.value = url; st.textContent = 'Terunggah dan tersimpan.';
      } catch (e) { st.textContent = 'Gagal: ' + e.message; }
      fi.value = '';
    });
  }
};

/* ---------- (4) TAB GALERI ---------- */
NAVS.splice(Math.max(0, NAVS.findIndex((n) => n[0] === 'armada')) + 1, 0, ['galeri', 'Galeri']);
const WIL_GL = { lembang: 'Lembang', dago: 'Kota Bandung & Dago', ciwidey: 'Ciwidey', pangalengan: 'Pangalengan', lainnya: 'Lainnya' };
VIEWS.galeri = async function () {
  $('#view').innerHTML = `
    <h2>Galeri</h2>
    <div class="card" style="margin-bottom:14px"><h2>Unggah foto</h2>
      <div class="fgrid">
        <div><label>Wilayah<select id="glWil">${Object.keys(WIL_GL).map((k) => `<option value="${k}">${esc(WIL_GL[k])}</option>`).join('')}</select></label></div>
        <div><label>Keterangan (untuk semua foto yang dipilih; bisa diubah nanti)<input id="glKet" placeholder="mis. Kawah Putih, Ciwidey"></label></div>
        <div class="full"><label>Foto (boleh pilih banyak)<input id="glFile" type="file" accept="image/*" multiple></label></div>
      </div>
      <label class="chk"><input type="checkbox" id="glWm" checked> Pasang watermark logo Tempera</label>
      <div class="mbtns" style="justify-content:flex-start"><button class="btn" type="button" id="glGo">Unggah</button></div>
      <div class="help" id="glSt">Foto dikecilkan di HP (lebar maks 1200) dan data lokasi (GPS) otomatis terhapus. Pastikan pelanggan yang tampak jelas sudah mengizinkan.</div></div>
    <div class="card"><h2>Foto di galeri</h2><div id="glList"><div class="empty">Memuat…</div></div></div>`;
  $('#glGo').addEventListener('click', async (e) => {
    const files = [...$('#glFile').files]; if (!files.length) { toast('Pilih foto dulu', true); return; }
    e.target.disabled = true; const ket = $('#glKet').value.trim() || null, wil = $('#glWil').value, wm = $('#glWm').checked; let ok = 0;
    for (let i = 0; i < files.length; i++) {
      $('#glSt').textContent = `Mengunggah ${i + 1} dari ${files.length}…`;
      try {
        const url = await unggahGambar(files[i], { lebar: 1200, folder: 'galeri', watermark: wm });
        const r = await sb.from('galeri').insert({ url, keterangan: ket, wilayah: wil, tampil: true });
        if (r.error) throw new Error(r.error.message); ok++;
      } catch (err) { $('#glSt').textContent = `Gagal pada foto ${i + 1}: ${err.message}`; e.target.disabled = false; muatGaleriPanel(); return; }
    }
    e.target.disabled = false; $('#glFile').value = ''; $('#glSt').textContent = `${ok} foto terunggah.`; muatGaleriPanel();
  });
  muatGaleriPanel();
};
async function muatGaleriPanel() {
  const r = await sb.from('galeri').select('*').order('created_at', { ascending: false }).limit(200);
  if (r.error) { $('#glList').innerHTML = `<div class="empty">Gagal memuat: ${esc(r.error.message)}</div>`; return; }
  const rows = r.data || [];
  $('#glList').innerHTML = rows.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px">${rows.map((g) => `
    <div style="border:1px solid var(--line);border-radius:12px;padding:8px;${g.tampil ? '' : 'opacity:.55'}">
      <img src="${esc(g.url)}" alt="" loading="lazy" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px;display:block">
      <input data-gl-ket="${esc(g.id)}" value="${esc(g.keterangan || '')}" placeholder="Keterangan" style="margin-top:6px">
      <select data-gl-wil="${esc(g.id)}" style="margin-top:6px">${Object.keys(WIL_GL).map((k) => `<option value="${k}" ${k === g.wilayah ? 'selected' : ''}>${esc(WIL_GL[k])}</option>`).join('')}</select>
      <div class="mbtns" style="justify-content:flex-start;margin-top:6px"><button class="btn sm" type="button" data-gl-simpan="${esc(g.id)}">Simpan</button>
        <button class="btn ghost sm" type="button" data-gl-tampil="${esc(g.id)}" data-v="${g.tampil ? '0' : '1'}">${g.tampil ? 'Sembunyikan' : 'Tampilkan'}</button>
        <button class="btn danger sm" type="button" data-gl-hapus="${esc(g.id)}" data-url="${esc(g.url)}">Hapus</button></div></div>`).join('')}</div>` : '<div class="empty">Belum ada foto.</div>';
}
document.addEventListener('click', async (e) => {
  const s = e.target.closest('[data-gl-simpan]'), t = e.target.closest('[data-gl-tampil]'), h = e.target.closest('[data-gl-hapus]');
  if (s) { const id = s.dataset.glSimpan; const r = await sb.from('galeri').update({ keterangan: $(`[data-gl-ket="${CSS.escape(id)}"]`).value.trim() || null, wilayah: $(`[data-gl-wil="${CSS.escape(id)}"]`).value }).eq('id', id); if (r.error) toast(r.error.message, true); else toast('Tersimpan'); }
  if (t) { const r = await sb.from('galeri').update({ tampil: t.dataset.v === '1' }).eq('id', t.dataset.glTampil); if (r.error) toast(r.error.message, true); else { toast(t.dataset.v === '1' ? 'Ditampilkan' : 'Disembunyikan'); muatGaleriPanel(); } }
  if (h) {
    if (!confirm('Hapus foto ini dari galeri? Berkasnya juga dihapus.')) return;
    const r = await sb.from('galeri').delete().eq('id', h.dataset.glHapus); if (r.error) { toast(r.error.message, true); return; }
    const path = String(h.dataset.url || '').split('/object/public/media/')[1]; if (path) await sb.storage.from(MEDIA_BUCKET).remove([decodeURIComponent(path)]);
    toast('Dihapus'); muatGaleriPanel();
  }
});
