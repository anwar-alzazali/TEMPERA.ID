/* ---------- CRUD umum ---------- */
const PLACEHOLDERS = ['{nama}', '{customer_wa}', '{order_id}', '{invoice_no}', '{link_invoice}', '{armada}', '{tanggal}', '{jam}', '{peserta}', '{jemput}', '{destinasi}', '{rincian}', '{total}', '{potongan}', '{pendapatan_driver}', '{sumber}', '{driver_name}', '{driver_phone}'];

const RES = {
  armada: {
    table: 'fleet', title: 'Armada', pk: 'id', order: { col: 'sort_order', asc: true },
    defaults: { is_active: true, sort_order: 0 },
    cols: [{ key: 'name', label: 'Armada' }, { key: 'price', label: 'Harga', num: true, render: (r) => rp(r.price) },
      { key: 'capacity_comfort', label: 'Kapasitas', render: (r) => `${r.capacity_comfort} nyaman / max ${r.capacity_max}` },
      { key: 'is_active', label: 'Aktif', render: (r) => r.is_active ? 'Ya' : 'Tidak' }],
    fields: [
      { key: 'id', label: 'ID (huruf kecil, tanpa spasi)', type: 'text', required: true, createOnly: true },
      { key: 'name', label: 'Nama lengkap', type: 'text', required: true },
      { key: 'short_name', label: 'Nama pendek', type: 'text', required: true },
      { key: 'badge', label: 'Label (mis. Best Seller)', type: 'text' },
      { key: 'price', label: 'Harga sewa 12 jam (Rp)', type: 'number', required: true },
      { key: 'capacity_comfort', label: 'Kapasitas nyaman', type: 'number', required: true },
      { key: 'capacity_max', label: 'Kapasitas maksimal', type: 'number', required: true },
      { key: 'baggage', label: 'Info bagasi', type: 'text' },
      { key: 'max_info', label: 'Info kapasitas maks', type: 'text' },
      { key: 'note', label: 'Catatan (awali ⚠ / ✅ / ℹ)', type: 'text', full: true },
      { key: 'images', label: 'Foto', type: 'array', full: true, help: 'Nama file di folder images situs, pisahkan dengan koma. Boleh juga alamat penuh https://...' },
      { key: 'sort_order', label: 'Urutan tampil', type: 'number' },
      { key: 'is_active', label: 'Tampil di web', type: 'bool' }]
  },
  banner: {
    table: 'banners', title: 'Banner', pk: 'id', order: { col: 'sort_order', asc: true }, canDelete: true,
    defaults: { is_active: true, sort_order: 0 },
    cols: [{ key: 'title', label: 'Judul' },
      { key: 'starts_at', label: 'Tayang', render: (r) => `${r.starts_at ? waktu(r.starts_at) : 'langsung'} → ${r.ends_at ? waktu(r.ends_at) : 'tanpa batas'}` },
      { key: 'is_active', label: 'Aktif', render: (r) => r.is_active ? 'Ya' : 'Tidak' }],
    fields: [
      { key: 'title', label: 'Judul', type: 'text', required: true, full: true },
      { key: 'subtitle', label: 'Teks singkat', type: 'text', full: true },
      { key: 'image_url', label: 'Gambar (nama file di folder images, atau alamat https://...)', type: 'text', full: true },
      { key: 'button_text', label: 'Teks tombol', type: 'text' },
      { key: 'button_url', label: 'Tujuan tombol (alamat / #pesan)', type: 'text' },
      { key: 'starts_at', label: 'Mulai tayang', type: 'datetime' },
      { key: 'ends_at', label: 'Selesai tayang', type: 'datetime' },
      { key: 'sort_order', label: 'Urutan', type: 'number' },
      { key: 'is_active', label: 'Aktif', type: 'bool' }]
  },
  driver: {
    table: 'drivers', title: 'Driver', pk: 'id', order: { col: 'driver_code', asc: true },
    defaults: { is_active: true },
    cols: [
      { key: 'driver_code', label: 'ID', render: (r) => r.driver_code || '-' },
      { key: 'name', label: 'Nama' },
      { key: 'phone', label: 'WA', render: (r) => r.phone ? `${esc(r.phone)} <a class="btn ghost sm" href="https://wa.me/${esc(normWA(r.phone))}" target="_blank" rel="noopener" style="text-decoration:none;margin-left:4px">Kirim pesan</a>` : '-' },
      { key: 'plate', label: 'Plat', render: (r) => r.plate || '-' },
      { key: 'is_active', label: 'Aktif', render: (r) => r.is_active === false ? 'Tidak' : 'Ya' },
      { key: 'ref', label: 'Link referral', render: (r) => { const u = S.siteUrl ? `${S.siteUrl}/?r=${r.slug}` : ''; return `<button class="btn ghost sm" type="button" data-copy="${esc(u)}">Salin</button> ${u ? `<button class="btn ghost sm" type="button" data-qr="${esc(u)}" data-qrname="${esc(r.slug)}">QR</button>` : ''}`; } },
      { key: 'card', label: 'ID Card', render: (r) => {
          const tok = S.cards[r.slug];
          const u = (S.siteUrl && tok) ? `${S.siteUrl}/kartu.html?t=${tok}` : '';
          return `<button class="btn ghost sm" type="button" data-copy="${esc(u)}">Salin link</button> <button class="btn ghost sm" type="button" data-rotate="${esc(r.slug)}">Ganti token</button>`;
        } },
      { key: 'cetak', label: 'Kartu Cetak', render: (r) => {
          if (!S.siteUrl) return '<span class="small">Isi site_url dulu</span>';
          if (!r.driver_code || !S.cards[r.slug]) return '<span class="small">Kode ID/token belum ada</span>';
          return `<button class="btn ghost sm" type="button" data-print="${esc(r.slug)}">Cetak kartu</button>`;
        } }],
    fields: [
      { key: 'slug', label: 'Slug (otomatis dari kode ID, untuk link ?r=slug)', type: 'text', required: true, createOnly: true, autoNew: true },
      { key: 'name', label: 'Nama', type: 'text', required: true },
      { key: 'phone', label: 'Nomor WA (08... atau 62...)', type: 'text', required: true },
      { key: 'plate', label: 'Plat nomor kendaraan', type: 'text' },
      { key: 'base', label: 'Basis / kota', type: 'text' },
      { key: 'vehicle_type', label: 'Jenis kendaraan', type: 'text' },
      { key: 'motto', label: 'Motto', type: 'text' },
      { key: 'photo_url', label: 'Foto (pilih dari galeri HP)', type: 'photo', full: true },
      { key: 'is_active', label: 'Aktif', type: 'bool' }],
    note: '<div class="help">Kode ID (contoh TMP-024) dan slug (tmp-024) dibuat otomatis saat disimpan. ID Card driver dan link referral berbeda link. Ganti token akan langsung mematikan link ID card lama dan kartu cetak yang sudah dibuat.</div>'
  },
  template: {
    table: 'wa_templates', title: 'Template WA', pk: 'id', order: { col: 'id', asc: true }, noCreate: true, stamp: true,
    cols: [{ key: 'id', label: 'ID' }, { key: 'title', label: 'Untuk' }, { key: 'updated_at', label: 'Diubah', render: (r) => waktu(r.updated_at) }],
    fields: [
      { key: 'title', label: 'Judul', type: 'text', full: true },
      { key: 'template_text', label: 'Isi pesan', type: 'textarea', rows: 16, full: true }],
    note: `<div class="help">Penanda yang bisa dipakai (diisi otomatis saat pesan dikirim):</div><div class="chips">${PLACEHOLDERS.map((p) => `<span class="chip">${p}</span>`).join('')}</div><div class="help">Template yang dipakai sistem: <b>order_paid_customer</b>, <b>order_paid_admin</b>, <b>order_paid_driver</b>. Template lain (admin_lunas, driver_lunas) adalah sisa versi lama.</div>`
  }
};
for (const key of Object.keys(RES)) VIEWS[key] = () => viewCrud(key);

// Tombol "Cetak kartu": buka kartu-anggota.html dengan data driver + kode tanda tangan tetap,
// supaya QR di kartu bisa diverifikasi (lihat function verifikasi, jenis "kartu cetak").
document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-print]');
  if (!b) return;
  const slug = b.dataset.print;
  const r = S.drivers.find((x) => x.slug === slug);
  const tok = S.cards[slug];
  if (!r || !tok || !r.driver_code || !S.siteUrl) { toast('Data driver, kode ID, token kartu, atau alamat situs belum lengkap', true); return; }
  b.disabled = true;
  try {
    const k = (await hmacHex(tok, `${r.driver_code}.cetak`)).slice(0, 20);
    const p = new URLSearchParams({ nama: r.name || '', id: r.driver_code, telp: r.phone || '', k });
    if (r.photo_url) p.set('foto', /^https?:/i.test(r.photo_url) ? r.photo_url : `${S.siteUrl}/${String(r.photo_url).replace(/^\/+/, '')}`);
    window.open(`${S.siteUrl}/kartu-anggota.html?${p.toString()}`, '_blank');
  } finally { b.disabled = false; }
});

function fotoDriver(r) {
  const u = r.photo_url ? (/^https?:/i.test(r.photo_url) ? r.photo_url : `${S.siteUrl || ''}/${String(r.photo_url).replace(/^\/+/, '')}`) : '';
  const ini = esc(String(r.name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase());
  return u ? `<img class="drvfoto" src="${esc(u)}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'drvfoto drvini',textContent:'${ini}'}))">` : `<div class="drvfoto drvini">${ini}</div>`;
}
RES.driver.kartu = (r, i) => {
  const c = (k) => { const x = RES.driver.cols.find((y) => y.key === k); return x && x.render ? x.render(r) : ''; };
  return `<div class="card drvcard"><div class="drvtop">${fotoDriver(r)}<div class="drvnama"><b>${esc(r.name)}</b><div class="small">${esc(r.driver_code || '-')} · ${esc(r.plate || 'tanpa plat')}</div>
      <div class="small">${esc(r.phone || '-')}</div></div>
      <div class="drvstat">${r.is_active === false ? '<span class="badge b-cancelled">Nonaktif</span>' : '<span class="badge b-paid">Aktif</span>'}</div></div>
    <div class="drvbtn">${r.phone ? `<a class="btn ghost sm" href="https://wa.me/${esc(normWA(r.phone))}" target="_blank" rel="noopener" style="text-decoration:none">WhatsApp</a>` : ''}${c('ref')}${c('card')}${c('cetak')}<button class="btn sm" type="button" data-i="${i}">Ubah</button></div>
    <div class="drvmitra">${c('mitra')}</div></div>`;
};
let ROWS = {};
async function viewCrud(key) {
  const R = RES[key];
  const { data, error } = await sb.from(R.table).select('*').order(R.order.col, { ascending: R.order.asc });
  if (error) { $('#view').innerHTML = `<div class="empty">Gagal memuat: ${esc(error.message)}</div>`; return; }
  ROWS[key] = data || [];
  $('#view').innerHTML = `
    <div class="bar" style="justify-content:space-between;align-items:center"><h2 style="margin:0">${esc(R.title)}</h2>${R.noCreate ? '' : '<button class="btn" id="btnNew" type="button">+ Tambah</button>'}</div>
    ${R.kartu ? `<div class="drvlist">${ROWS[key].map((r, i) => R.kartu(r, i)).join('') || '<div class="empty">Belum ada data.</div>'}</div>` : `<div class="card"><div class="tablewrap"><table>
      <thead><tr>${R.cols.map((c) => `<th class="${c.num ? 'num' : ''}">${esc(c.label)}</th>`).join('')}<th></th></tr></thead>
      <tbody>${ROWS[key].map((r, i) => `<tr>${R.cols.map((c) => `<td class="${c.num ? 'num' : ''}">${c.render ? c.render(r) : esc(r[c.key])}</td>`).join('')}<td class="num"><button class="btn ghost sm" type="button" data-i="${i}">Ubah</button></td></tr>`).join('') || `<tr><td colspan="${R.cols.length + 1}" class="empty">Belum ada data.</td></tr>`}</tbody>
    </table></div></div>`}`;
  if (!R.noCreate) $('#btnNew').addEventListener('click', () => openForm(key, null));
  $$('#view button[data-i]').forEach((b) => b.addEventListener('click', () => openForm(key, ROWS[key][Number(b.dataset.i)])));
}
function fieldHTML(f, val, disabled) {
  const id = 'f_' + f.key, cls = f.full ? ' class="full"' : '';
  if (f.type === 'photo') {
    const prev = val ? `<img src="${esc(val)}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;display:block;margin-bottom:8px">` : '';
    return `<div${cls}><label>${esc(f.label)}</label>
      <div id="${id}_prev">${prev}</div>
      <input type="file" id="${id}_file" accept="image/*">
      <input type="hidden" id="${id}" value="${esc(val || '')}">
      <div class="help" id="${id}_status">&nbsp;</div></div>`;
  }
  if (f.type === 'bool') return `<div${cls}><label class="chk"><input type="checkbox" id="${id}" ${val ? 'checked' : ''}> ${esc(f.label)}</label></div>`;
  if (f.type === 'textarea') return `<div${cls}><label>${esc(f.label)}<textarea id="${id}" rows="${f.rows || 4}">${esc(val == null ? '' : val)}</textarea></label></div>`;
  const type = f.type === 'number' ? 'number' : (f.type === 'datetime' ? 'datetime-local' : 'text');
  const v = f.type === 'array' ? (Array.isArray(val) ? val.join(', ') : '') : (f.type === 'datetime' ? isoToLocal(val) : (val == null ? '' : val));
  return `<div${cls}><label>${esc(f.label)}${f.required ? ' *' : ''}<input id="${id}" type="${type}" value="${esc(v)}" ${f.type === 'number' ? 'step="any"' : ''} ${disabled ? 'disabled' : ''}></label>${f.help ? `<div class="help">${esc(f.help)}</div>` : ''}</div>`;
}
function readField(f, required) {
  const el = $('#f_' + f.key);
  if (f.type === 'bool') return el.checked;
  const v = el.value.trim();
  if (f.type === 'number') return v === '' ? (required ? null : 0) : Number(v);
  if (f.type === 'array') return v ? v.split(',').map((x) => x.trim()).filter(Boolean) : [];
  if (f.type === 'datetime') return v ? new Date(v).toISOString() : null;
  return v === '' ? null : v;
}
function openForm(key, row) {
  const R = RES[key], isNew = !row;
  const src = row || R.defaults || {};
  openModal(`
    <h2>${isNew ? 'Tambah' : 'Ubah'} ${esc(R.title)}</h2>
    ${R.note || ''}
    <div class="fgrid">${R.fields.filter((f) => !(f.autoNew && isNew)).map((f) => fieldHTML(f, src[f.key], f.createOnly && !isNew)).join('')}</div>
    <div class="mbtns">
      ${(!isNew && R.canDelete) ? '<button class="btn danger" id="mDel" type="button">Hapus</button>' : ''}
      <button class="btn ghost" id="mCancel" type="button">Batal</button>
      <button class="btn" id="mSave" type="button">Simpan</button>
    </div>`);
  if (key === 'driver' && isNew) {
    const nameEl = $('#f_name'), slugEl = $('#f_slug');
    let slugTouched = false;
    slugEl.addEventListener('input', () => { slugTouched = true; });
    nameEl.addEventListener('input', () => {
      if (slugTouched) return;
      slugEl.value = nameEl.value.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    });
  }
  const photoField = R.fields.find((f) => f.type === 'photo');
  if (photoField) {
    const pid = 'f_' + photoField.key;
    const fileEl = $('#' + pid + '_file'), hiddenEl = $('#' + pid), statusEl = $('#' + pid + '_status');
    fileEl.addEventListener('change', async () => {
      const file = fileEl.files[0]; if (!file) return;
      statusEl.textContent = 'Mengunggah…';
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const up = await sb.storage.from('driver-photos').upload(path, file, { upsert: false });
      if (up.error) { statusEl.textContent = 'Gagal unggah: ' + up.error.message; return; }
      const pub = sb.storage.from('driver-photos').getPublicUrl(path).data.publicUrl;
      hiddenEl.value = pub;
      $('#' + pid + '_prev').innerHTML = `<img src="${esc(pub)}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;display:block;margin-bottom:8px">`;
      statusEl.textContent = 'Terunggah';
    });
  }
  $('#mCancel').addEventListener('click', closeModal);
  $('#mSave').addEventListener('click', () => saveForm(key, row));
  if ($('#mDel')) $('#mDel').addEventListener('click', async () => {
    if (!confirm('Hapus data ini?')) return;
    const r = await sb.from(R.table).delete().eq(R.pk, row[R.pk]);
    if (r.error) { toast(r.error.message, true); return; }
    toast('Dihapus'); closeModal(); nav(key);
  });
}
async function saveForm(key, row) {
  const R = RES[key], isNew = !row, payload = {};
  for (const f of R.fields) {
    if (f.createOnly && !isNew) continue;
    if (f.autoNew && isNew) continue; // diisi trigger database (kode ID dan slug)
    const v = readField(f, f.required);
    if (f.required && (v === null || v === '' || (Array.isArray(v) && !v.length))) { toast(`${f.label} wajib diisi`, true); return; }
    payload[f.key] = v;
  }
  if (R.stamp) payload.updated_at = new Date().toISOString();
  const btn = $('#mSave'); btn.disabled = true;
  const res = isNew ? await sb.from(R.table).insert(payload) : await sb.from(R.table).update(payload).eq(R.pk, row[R.pk]);
  btn.disabled = false;
  if (res.error) { toast(res.error.message, true); return; }
  toast('Tersimpan'); closeModal();
  if (key === 'driver') await loadShared();
  nav(key);
}
