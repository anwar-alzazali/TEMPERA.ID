/* ---------- QR referral membawa penanda &s=qr (Fase B) ---------- */
// Tombol "Salin" tetap link biasa; tombol "QR" membuat QR dengan penanda supaya
// dashboard mitra bisa membedakan kunjungan lewat scan QR dan klik link.
(function () {
  const col = RES.driver.cols.find((c) => c.key === 'ref');
  if (!col) return;
  col.render = (r) => {
    const u = S.siteUrl ? `${S.siteUrl}/?r=${r.slug}` : '';
    return `<button class="btn ghost sm" type="button" data-copy="${esc(u)}">Salin</button> ${u ? `<button class="btn ghost sm" type="button" data-qr="${esc(u + '&s=qr')}" data-qrname="${esc(r.slug)}">QR</button>` : ''}`;
  };
})();
  /* ---------- KETERSEDIAAN ARMADA (SQL 83) ---------- */
// 1) Tab Armada: kolom & isian "Jumlah unit" (kosong = tidak dibatasi).
// 2) Tab baru "Ketersediaan": tutup tanggal (satu armada / semua, rentang), daftar & Buka lagi,
//    serta ringkasan pemakaian 14 hari ke depan.
RES.armada.cols.splice(2, 0, { key: 'unit_count', label: 'Unit', render: (r) => (r.unit_count == null ? '<span class="small">tak dibatasi</span>' : esc(r.unit_count)) });
RES.armada.fields.splice(7, 0, { key: 'unit_count', label: 'Jumlah unit (kosongkan = tidak dibatasi)', type: 'number', help: 'Kalau di satu tanggal pesanan (DP/Lunas, atau menunggu bayar < 45 menit) sudah sebanyak ini, armada otomatis penuh di tanggal itu.' });
const _readFieldAsli = readField;
readField = function (f, required) {
  if (f.key === 'unit_count') { const v = $('#f_unit_count').value.trim(); return v === '' ? null : Math.max(0, parseInt(v, 10) || 0); }
  return _readFieldAsli(f, required);
};

NAVS.splice(4, 0, ['ketersediaan', 'Ketersediaan']);
const hariIniWIBp = () => new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
VIEWS.ketersediaan = async function () {
  const fl = await sb.from('fleet').select('id,short_name,unit_count,sort_order').eq('is_active', true).order('sort_order');
  const armada = fl.data || [];
  const opsi = '<option value="">Semua armada</option>' + armada.map((f) => `<option value="${esc(f.id)}">${esc(f.short_name)}</option>`).join('');
  const hari = hariIniWIBp();
  $('#view').innerHTML = `
    <h2>Ketersediaan</h2>
    <div class="card" style="margin-bottom:14px">
      <h2>Tutup tanggal</h2>
      <div class="fgrid">
        <div><label>Dari tanggal<input id="kbDari" type="date" value="${hari}" min="${hari}"></label></div>
        <div><label>Sampai tanggal<input id="kbSampai" type="date" value="${hari}" min="${hari}"></label></div>
        <div><label>Armada<select id="kbArmada">${opsi}</select></label></div>
        <div><label>Catatan (hanya admin)<input id="kbCatatan" placeholder="mis. Hiace servis / full lewat WA"></label></div>
      </div>
      <div class="mbtns" style="justify-content:flex-start"><button class="btn" type="button" id="kbSimpan">Tutup tanggal ini</button></div>
      <div class="help" style="margin-top:8px">Tanggal yang ditutup langsung tampil "penuh" di formulir pesan dan ditolak server. Pesanan yang sudah dibayar tidak terpengaruh.</div>
    </div>
    <div class="card" style="margin-bottom:14px"><h2>Tanggal yang ditutup</h2><div id="kbList"><div class="empty">Memuat…</div></div></div>
    <div class="card"><h2>Pemakaian 14 hari ke depan</h2><div id="kbGrid"><div class="empty">Memuat…</div></div>
      <div class="help" style="margin-top:8px">Angka = unit terpakai / jumlah unit. ∞ = tidak dibatasi. Merah = penuh atau ditutup.</div></div>`;
  $('#kbDari').addEventListener('change', () => { if ($('#kbSampai').value < $('#kbDari').value) $('#kbSampai').value = $('#kbDari').value; });
  $('#kbSimpan').addEventListener('click', async (e) => {
    const dari = $('#kbDari').value, sampai = $('#kbSampai').value || dari;
    if (!dari) { toast('Isi tanggal', true); return; }
    if (sampai < dari) { toast('Tanggal "sampai" tidak boleh sebelum "dari"', true); return; }
    e.target.disabled = true;
    const r = await sb.from('fleet_blocks').insert({ date_from: dari, date_to: sampai, fleet_id: $('#kbArmada').value || null, note: $('#kbCatatan').value.trim() || null });
    e.target.disabled = false;
    if (r.error) { toast(r.error.message, true); return; }
    toast('Tanggal ditutup'); $('#kbCatatan').value = ''; muatKetersediaan(armada);
  });
  muatKetersediaan(armada);
};
async function muatKetersediaan(armada) {
  const nama = (id) => (id ? ((armada.find((f) => f.id === id) || {}).short_name || id) : 'Semua armada');
  const hari = hariIniWIBp();
  const bl = await sb.from('fleet_blocks').select('*').gte('date_to', hari).order('date_from');
  $('#kbList').innerHTML = bl.error ? `<div class="empty">Gagal memuat: ${esc(bl.error.message)}</div>`
    : (bl.data || []).length ? `<div class="tablewrap"><table><thead><tr><th>Tanggal</th><th>Armada</th><th>Catatan</th><th></th></tr></thead><tbody>
      ${bl.data.map((b) => `<tr><td>${esc(tglPendek(b.date_from))}${b.date_to !== b.date_from ? ' – ' + esc(tglPendek(b.date_to)) : ''}</td><td>${esc(nama(b.fleet_id))}</td><td class="small">${esc(b.note || '-')}</td>
        <td class="num"><button class="btn ghost sm" type="button" data-kb-buka="${esc(b.id)}">Buka lagi</button></td></tr>`).join('')}</tbody></table></div>`
    : '<div class="empty">Tidak ada tanggal yang ditutup.</div>';
  const g = await sb.rpc('admin_ketersediaan', { p_dari: hari, p_hari: 14 });
  if (g.error) { $('#kbGrid').innerHTML = `<div class="empty">Gagal memuat: ${esc(g.error.message)}</div>`; return; }
  const tgl = [...new Set(g.data.map((x) => x.tanggal))];
  const sel = (x) => {
    const penuh = x.ditutup || (x.unit != null && x.terpakai >= x.unit);
    const isi = x.ditutup ? 'tutup' : `${x.terpakai}/${x.unit == null ? '∞' : x.unit}`;
    return `<td class="num" style="${penuh ? 'background:#fee2e2;color:#991b1b;font-weight:700' : ''}">${esc(isi)}</td>`;
  };
  $('#kbGrid').innerHTML = `<div class="tablewrap"><table data-grid><thead><tr><th>Tanggal</th>${armada.map((f) => `<th class="num">${esc(f.short_name)}</th>`).join('')}</tr></thead><tbody>
    ${tgl.map((d) => `<tr><td>${esc(tglPendek(d))}</td>${armada.map((f) => { const x = g.data.find((y) => y.tanggal === d && y.fleet_id === f.id); return x ? sel(x) : '<td></td>'; }).join('')}</tr>`).join('')}
  </tbody></table></div>`;
}
document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-kb-buka]');
  if (!b) return;
  if (!confirm('Buka lagi tanggal ini? Pelanggan bisa memesan lagi.')) return;
  b.disabled = true;
  const r = await sb.from('fleet_blocks').delete().eq('id', b.dataset.kbBuka);
  if (r.error) { b.disabled = false; toast(r.error.message, true); return; }
  toast('Tanggal dibuka lagi'); nav('ketersediaan');
});
/* ---------- ULASAN PELANGGAN (SQL 92) ---------- */
// Tab "Ulasan": semua ulasan masuk (terbaru di atas), rata-rata, tombol Tampilkan / Sembunyikan.
// Hanya ulasan yang diberi izin pelanggan yang bisa ditampilkan di situs (dijaga juga oleh database).
NAVS.splice(NAVS.findIndex((n) => n[0] === 'laporan') + 1, 0, ['ulasan', 'Ulasan']);
const STATUS_UL = { menunggu: 'Menunggu', tampil: 'Tampil di situs', sembunyi: 'Disembunyikan' };
VIEWS.ulasan = async function () {
  $('#view').innerHTML = `
    <div class="bar" style="justify-content:space-between;align-items:center"><h2 style="margin:0">Ulasan pelanggan</h2>
      <select id="ulFilter" style="width:auto"><option value="">Semua</option><option value="menunggu" selected>Menunggu</option><option value="tampil">Tampil di situs</option><option value="sembunyi">Disembunyikan</option></select></div>
    <div class="stats" id="ulStats"></div>
    <div id="ulList"><div class="empty">Memuat…</div></div>
    <div class="help" style="margin-top:10px">Ajakan ulasan dikirim otomatis lewat WA sehari setelah trip. Bintang 1–3 juga langsung dikabarkan ke Telegram. Link Google (kalau sudah punya) diisi di Pengaturan → <b>google_review_url</b>.</div>`;
  $('#ulFilter').addEventListener('change', muatUlasanPanel);
  muatUlasanPanel();
};
async function muatUlasanPanel() {
  const semua = await sb.from('ulasan').select('*').order('created_at', { ascending: false }).limit(500);
  if (semua.error) { $('#ulList').innerHTML = `<div class="empty">Gagal memuat: ${esc(semua.error.message)}</div>`; return; }
  const rows = semua.data || [];
  const rata = rows.length ? (rows.reduce((a, x) => a + x.bintang, 0) / rows.length) : 0;
  const tampil = rows.filter((x) => x.status === 'tampil');
  $('#ulStats').innerHTML = `
    <div class="stat"><div class="v">${rows.length ? rata.toFixed(1).replace('.', ',') + ' ⭐' : '-'}</div><div class="l">Rata-rata semua (${rows.length} ulasan)</div></div>
    <div class="stat"><div class="v">${rows.filter((x) => x.status === 'menunggu').length}</div><div class="l">Menunggu diperiksa</div></div>
    <div class="stat"><div class="v">${tampil.length}</div><div class="l">Tampil di situs</div></div>
    <div class="stat"><div class="v">${rows.filter((x) => x.bintang <= 3).length}</div><div class="l">Bintang 1–3</div></div>`;
  const f = $('#ulFilter').value;
  const list = f ? rows.filter((x) => x.status === f) : rows;
  $('#ulList').innerHTML = list.length ? list.map((u) => `
    <div class="card" style="margin-bottom:10px${u.bintang <= 3 ? ';border-left:4px solid var(--danger)' : ''}">
      <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
        <div><span style="color:#f59e0b;font-size:18px">${'★'.repeat(u.bintang)}</span><span style="color:#cbd5e1;font-size:18px">${'★'.repeat(5 - u.bintang)}</span>
          <b style="margin-left:6px">${esc(u.nama_tampil || '-')}</b></div>
        <span class="badge ${u.status === 'tampil' ? 'b-paid' : u.status === 'sembunyi' ? 'b-cancelled' : 'b-pending'}">${esc(STATUS_UL[u.status] || u.status)}</span>
      </div>
      <div style="margin:8px 0;white-space:pre-line">${u.teks ? esc(u.teks) : '<span class="small">(tanpa komentar)</span>'}</div>
      <div class="small">${esc(waktu(u.created_at))} · ${esc(u.order_id)} · ${esc(u.armada || '-')} · Driver: ${esc(u.driver_slug ? driverName(u.driver_slug) : '-')} · ${u.izin_tampil ? '✅ boleh ditampilkan' : '🔒 tidak diizinkan tampil'}</div>
      <div class="mbtns" style="justify-content:flex-start;margin-top:8px">
        ${u.status !== 'tampil' ? (u.izin_tampil ? `<button class="btn sm" type="button" data-ul="${esc(u.id)}" data-st="tampil">Tampilkan di situs</button>` : '') : ''}
        ${u.status !== 'sembunyi' ? `<button class="btn ghost sm" type="button" data-ul="${esc(u.id)}" data-st="sembunyi">${u.status === 'tampil' ? 'Sembunyikan' : 'Tandai sudah dibaca'}</button>` : ''}
      </div>
    </div>`).join('') : '<div class="card empty">Tidak ada ulasan.</div>';
}
document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-ul]');
  if (!b) return;
  b.disabled = true;
  const r = await sb.from('ulasan').update({ status: b.dataset.st, dimoderasi_at: new Date().toISOString() }).eq('id', b.dataset.ul);
  if (r.error) { b.disabled = false; toast(r.error.message, true); return; }
  toast(b.dataset.st === 'tampil' ? 'Ulasan ditampilkan di situs' : 'Ulasan disembunyikan'); muatUlasanPanel();
});
