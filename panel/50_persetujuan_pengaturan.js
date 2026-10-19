/* ---------- PERSETUJUAN DRIVER (dari daftar-driver.html) ---------- */
let PENDING_ROWS = [];
function pendBadge(st) {
  const map = { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' };
  const cls = st === 'approved' ? 'b-paid' : st === 'rejected' ? 'b-cancelled' : 'b-pending';
  return `<span class="badge ${cls}">${esc(map[st] || st)}</span>`;
}
VIEWS.persetujuan = async function () {
  $('#view').innerHTML = `
    <div class="bar" style="justify-content:space-between;align-items:center"><h2 style="margin:0">Persetujuan Driver</h2>
      <select id="pgStatus"><option value="pending" selected>Menunggu</option><option value="approved">Disetujui</option><option value="rejected">Ditolak</option><option value="">Semua</option></select>
    </div>
    <div class="card" id="pgList"></div>`;
  $('#pgStatus').addEventListener('change', loadPending);
  await loadPending();
};
async function loadPending() {
  const st = $('#pgStatus').value;
  let q = sb.from('drivers_pending').select('*').order('created_at', { ascending: false }).limit(200);
  if (st) q = q.eq('status', st);
  const { data, error } = await q;
  if (error) { $('#pgList').innerHTML = `<div class="empty">Gagal memuat: ${esc(error.message)}</div>`; return; }
  PENDING_ROWS = data || [];
  renderPending();
}
function renderPending() {
  if (!PENDING_ROWS.length) { $('#pgList').innerHTML = '<div class="empty">Tidak ada data.</div>'; return; }
  $('#pgList').innerHTML = `<div class="tablewrap"><table>
    <thead><tr><th>Daftar</th><th>Nama</th><th>WA</th><th>Kendaraan</th><th>Foto</th><th>Status</th><th></th></tr></thead>
    <tbody>${PENDING_ROWS.map((p) => `<tr>
      <td class="small">${esc(waktu(p.created_at))}</td>
      <td>${esc(p.name)}</td>
      <td>${esc(p.phone)} <a class="small" href="https://wa.me/${esc(normWA(p.phone))}" target="_blank" rel="noopener">chat</a></td>
      <td>${esc(p.vehicle_type || '-')}${p.plate ? `<div class="small">${esc(p.plate)}</div>` : ''}</td>
      <td>${p.photo_url ? `<img src="${esc(p.photo_url)}" style="width:40px;height:40px;border-radius:50%;object-fit:cover">` : '-'}</td>
      <td>${pendBadge(p.status)}</td>
      <td class="num">${p.status === 'pending' ? `<button class="btn sm" type="button" data-approve="${p.id}">Setujui</button> <button class="btn ghost sm" type="button" data-reject="${p.id}">Tolak</button>` : ''}</td>
    </tr>`).join('')}</tbody></table></div>`;
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-approve]');
  if (!b) return;
  const p = PENDING_ROWS.find((x) => String(x.id) === b.dataset.approve);
  if (p) openApproveForm(p);
});
document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-reject]');
  if (!b) return;
  if (!confirm('Tolak pendaftaran ini? Data pendaftar tetap disimpan sebagai riwayat, tapi tidak dibuatkan akun driver.')) return;
  const id = b.dataset.reject;
  const r = await sb.from('drivers_pending').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', id);
  if (r.error) { toast(r.error.message, true); return; }
  toast('Pendaftaran ditolak'); nav('persetujuan');
});
function openApproveForm(p) {
  const slugAwal = String(p.name || '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  openModal(`
    <h2>Setujui: ${esc(p.name)}</h2>
    <div class="help">Cek dan perbaiki data (terutama nomor WA) sebelum disimpan sebagai driver resmi. Kode ID dibuat otomatis.</div>
    <div class="fgrid">
      <div><label>Nama<input id="apName" value="${esc(p.name)}"></label></div>
      <div><label>Slug (untuk link ?r=slug)<input id="apSlug" value="${esc(slugAwal)}"></label></div>
      <div><label>Nomor WA<input id="apPhone" value="${esc(p.phone)}"></label></div>
      <div><label>Plat nomor<input id="apPlate" value="${esc(p.plate || '')}"></label></div>
      <div class="full"><label>Jenis kendaraan<input id="apVehicle" value="${esc(p.vehicle_type || '')}"></label></div>
    </div>
    <div class="mbtns">
      <button class="btn ghost" id="apCancel" type="button">Batal</button>
      <button class="btn" id="apSave" type="button">Simpan sebagai driver</button>
    </div>`);
  $('#apCancel').addEventListener('click', closeModal);
  $('#apSave').addEventListener('click', async () => {
    const name = $('#apName').value.trim();
    const slug = $('#apSlug').value.trim().toLowerCase();
    const phone = $('#apPhone').value.trim();
    const plate = $('#apPlate').value.trim();
    const vehicle_type = $('#apVehicle').value.trim();
    if (!name || !slug || !phone) { toast('Nama, slug, dan nomor WA wajib diisi', true); return; }
    const btn = $('#apSave'); btn.disabled = true;
    const ins = await sb.from('drivers').insert({
      slug, name, phone, plate: plate || null, vehicle_type: vehicle_type || null,
      photo_url: p.photo_url || null, is_active: true
    });
    if (ins.error) { toast(ins.error.message, true); btn.disabled = false; return; }
    try { await sb.rpc('rotate_driver_card', { p_slug: slug }); }
    catch (_e) { toast('Driver dibuat, tapi token kartu ID gagal dibuat otomatis. Ketuk "Ganti token" di tabel Driver nanti.', true); }
    const upd = await sb.from('drivers_pending').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', p.id);
    if (upd.error) toast('Driver tersimpan, tapi status pendaftaran gagal ditandai disetujui: ' + upd.error.message, true);
    else toast('Driver baru disimpan');
    closeModal();
    await loadShared();
    nav('persetujuan');
  });
}

/* ---------- PENGATURAN ---------- */
VIEWS.pengaturan = async function () {
  const { data, error } = await sb.from('app_settings').select('*').order('key');
  if (error) { $('#view').innerHTML = `<div class="empty">Gagal memuat: ${esc(error.message)}</div>`; return; }
  $('#view').innerHTML = `<h2>Pengaturan</h2><div class="card">${(data || []).map((r) => `
    <div class="setrow">
      <div><b>${esc(r.label || r.key)}</b><small>${esc(r.key)}${r.is_public ? ' · tampil ke publik' : ''}</small></div>
      <input data-key="${esc(r.key)}" value="${esc(r.value)}">
      <button class="btn sm" type="button" data-save="${esc(r.key)}">Simpan</button>
    </div>`).join('')}</div>
    <div class="help" style="margin-top:10px">Potongan admin: isi <b>percent</b> atau <b>flat</b> di "Jenis potongan". Nomor admin diawali 62 tanpa spasi. Perubahan berlaku untuk pesanan berikutnya; pesanan lama tidak berubah.</div>`;
  $$('#view button[data-save]').forEach((b) => b.addEventListener('click', async () => {
    const k = b.dataset.save, v = $(`#view input[data-key="${k}"]`).value.trim();
    const r = await sb.from('app_settings').update({ value: v }).eq('key', k);
    if (r.error) { toast(r.error.message, true); return; }
    if (k === 'site_url') S.siteUrl = v.replace(/\/+$/, '');
    toast('Tersimpan');
  }));
};
