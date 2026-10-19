/* ---------- WA GAGAL (tabel wa_log, dicatat midtrans-webhook v4) ---------- */
// Tampil di atas halaman Pesanan. Hanya muncul kalau ada WA gagal yang belum ditangani.
const _pesananAsli = VIEWS.pesanan;
VIEWS.pesanan = async function () {
  const jalan = _pesananAsli();                 // halaman Pesanan sudah tergambar di sini
  $('#view').insertAdjacentHTML('afterbegin', '<div id="waFail"></div>');
  loadWaFail();
  await jalan;
};
const PENERIMA_WA = { pelanggan: 'Pelanggan', driver: 'Driver', admin: 'Admin' };
async function loadWaFail() {
  const box = $('#waFail'); if (!box) return;
  const { data, error } = await sb.from('wa_log')
    .select('id,created_at,order_id,recipient,target,reason,message')
    .eq('ok', false).is('resolved_at', null)
    .order('created_at', { ascending: false }).limit(50);
  if (error || !data || !data.length) { box.innerHTML = ''; return; }
  box.innerHTML = `<div class="card" style="border-left:4px solid var(--danger);background:var(--warn);margin-bottom:14px">
    <h2 style="color:var(--danger);margin-bottom:6px">⚠️ ${data.length} WA gagal terkirim</h2>
    <div class="help" style="margin:0 0 10px">Tekan <b>Kirim manual</b> untuk membuka WhatsApp dengan pesan yang sama, lalu <b>Tandai selesai</b>.</div>
    ${data.map((w) => {
      const nomor = String(w.target || '').replace(/\D/g, '');
      const link = nomor ? `https://wa.me/${nomor}?text=${encodeURIComponent(w.message || '')}` : '';
      return `<div style="border-top:1px solid var(--line);padding:10px 0">
        <div><b>${esc(PENERIMA_WA[w.recipient] || w.recipient || '-')}</b> · ${esc(w.order_id || '-')} <span class="small">· ${esc(waktu(w.created_at))}</span></div>
        <div class="small">Nomor: ${esc(nomor || '-')} · Alasan: ${esc(w.reason || '-')}</div>
        <div class="mbtns" style="justify-content:flex-start;margin-top:6px">
          ${link ? `<a class="btn sm" href="${esc(link)}" target="_blank" rel="noopener" style="text-decoration:none">Kirim manual</a>` : ''}
          <button class="btn ghost sm" type="button" data-wa-done="${esc(w.id)}">Tandai selesai</button>
        </div></div>`;
    }).join('')}
  </div>`;
}
document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-wa-done]');
  if (!b) return;
  b.disabled = true;
  const r = await sb.from('wa_log').update({ resolved_at: new Date().toISOString() }).eq('id', b.dataset.waDone);
  if (r.error) { b.disabled = false; toast(r.error.message, true); return; }
  toast('Ditandai selesai'); loadWaFail();
});
/* ---------- AKUN MITRA (dashboard driver, mitra.html) ---------- */
// Menambah kolom "Akun Mitra" di tab Driver: status, tombol Kirim info (WA ke driver), dan Reset.
S.mitra = {};
RES.driver.cols.push({ key: 'mitra', label: 'Akun Mitra', render: (r) => {
  const m = S.mitra[r.slug];
  const link = S.siteUrl ? `${S.siteUrl}/mitra.html` : '';
  const pesanInfo = `Halo ${r.name}, dashboard Mitra Tempera sudah bisa dipakai:\n${link}\n\nKode ID kamu: ${r.driver_code || '-'}\nPilih "Daftar / aktifkan akun", masukkan Kode ID dan nomor WA ini, lalu buat PIN sendiri. Kode verifikasi akan dikirim ke WA ini.`;
  const info = (link && r.phone && r.driver_code)
    ? `<a class="btn ghost sm" href="https://wa.me/${esc(normWA(r.phone))}?text=${encodeURIComponent(pesanInfo)}" target="_blank" rel="noopener" style="text-decoration:none">Kirim info</a>` : '';
  if (!m || !m.aktif) return `<span class="badge">Belum daftar</span> ${info}`;
  const st = m.terkunci ? '<span class="badge b-cancelled">Terkunci 15 mnt</span>' : '<span class="badge b-paid">Aktif</span>';
  return `${st}<div class="small">${esc(m.sesi)} HP masuk</div><button class="btn ghost sm" type="button" data-mitra-reset="${esc(r.slug)}" data-nama="${esc(r.name)}">Reset</button>`;
} });
const _driverAsli = VIEWS.driver;
VIEWS.driver = async function () {
  const r = await sb.rpc('admin_mitra_status');
  S.mitra = {};
  if (!r.error) (r.data || []).forEach((x) => { S.mitra[x.driver_slug] = x; });
  return _driverAsli();
};
document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-mitra-reset]');
  if (!b) return;
  if (!confirm(`Reset akun mitra ${b.dataset.nama}?\n\nPIN dihapus dan semua HP-nya keluar. Driver harus daftar ulang lewat kode WA di halaman mitra.`)) return;
  b.disabled = true;
  const r = await sb.rpc('admin_reset_mitra', { p_slug: b.dataset.mitraReset });
  if (r.error) { b.disabled = false; toast(r.error.message, true); return; }
  toast('Akun mitra direset'); nav('driver');
});
