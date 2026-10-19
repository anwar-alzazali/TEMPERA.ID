/* PETA PANEL (supaya mudah dirawat)
   Halaman: panel.html (kerangka) + panel/panel.css (gaya) + berkas panel/*.js yang dimuat BERURUTAN (semuanya satu lingkup global):
     00_dasar            helper, Supabase, HMAC, QR referral
     10_login_nav        login, menu (NAVS, NAV_GRUP, BNAV) dan pindah tab nav()
     20_pesanan          tab Pesanan + form Trip custom + kirim invoice WA
     30_laporan_kas      Laporan dan Kas (dasar)
     40_crud             CRUD umum (Armada, Banner, Driver, Template WA)
     50_persetujuan_pengaturan   Persetujuan driver dan Pengaturan (dasar)
     60_wa_mitra, 70_qr_ulasan, 80_kas_iuran, 90_blok125   tambahan: WA gagal, akun mitra, ulasan, rekap iuran, pembayaran manual, unggah gambar, Galeri
     analitik, kode_unik, destinasi, pengumuman, rapi       tambalan berlapis (membungkus VIEWS.* di atas); rapi.js harus terakhir
     99_mulai            memulai panel (WAJIB paling akhir)
   Menu: NAVS = daftar tab; NAV_GRUP = kelompok di sidebar; BNAV/BNAV_ISI = menu bawah HP.
   Tab baru: tambahkan ke NAVS, buat VIEWS.<kunci>, masukkan ke NAV_GRUP (kalau lupa, otomatis masuk "Lainnya").
   Setelah mengubah berkas panel, naikkan nomor ?v= pada tag script/link di panel.html supaya browser memuat versi baru. */
const SB_URL = 'https://wjmotidelqgcyyujacud.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqbW90aWRlbHFnY3l5dWphY3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMzE2ODIsImV4cCI6MjEwNDkwNzY4Mn0.kZVRZhw0ryUcT-Pb7akpaO6vR4gOGwCkpD1kvk_uRac';
const sb = supabase.createClient(SB_URL, SB_KEY);

/* ---------- helper ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rp = (v) => 'Rp ' + Number(v || 0).toLocaleString('id-ID');
const p2 = (n) => String(n).padStart(2, '0');
function tglPendek(s) { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || ''); return m ? `${m[3]}-${m[2]}-${m[1]}` : (s || '-'); }
function waktu(iso) {
  if (!iso) return '-';
  try { return new Date(iso).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch (_e) { return String(iso); }
}
function isoToLocal(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:${p2(d.getMinutes())}`;
}
function normWA(n) {
  let x = String(n || '').replace(/\D/g, '');
  if (x.startsWith('0')) x = '62' + x.slice(1); else if (x.startsWith('8')) x = '62' + x;
  return x;
}
let toastTimer;
function toast(msg, err) {
  const t = $('#toast'); t.textContent = msg; t.className = 'show' + (err ? ' err' : '');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.className = ''; }, 4000);
}
function openModal(html) { $('#modalBody').innerHTML = html; $('#modal').hidden = false; }
function closeModal() { $('#modal').hidden = true; $('#modalBody').innerHTML = ''; }
$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-copy]');
  if (!b) return;
  if (!b.dataset.copy) { toast('Alamat situs belum diisi di Pengaturan (site_url)', true); return; }
  navigator.clipboard.writeText(b.dataset.copy).then(() => toast('Tersalin'), () => toast('Gagal menyalin', true));
});
document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-rotate]');
  if (!b) return;
  const slug = b.dataset.rotate;
  if (!confirm('Ganti token ID card driver ini? Link lama akan langsung berhenti berfungsi, jadi driver perlu link barunya (termasuk kartu cetak yang sudah ada).')) return;
  b.disabled = true;
  const r = await sb.rpc('rotate_driver_card', { p_slug: slug });
  b.disabled = false;
  if (r.error) { toast(r.error.message, true); return; }
  S.cards[slug] = r.data;
  toast('Token diganti. Kirim link ID card yang baru ke driver.');
  if (VIEWS.driver && location.hash === '#driver') nav('driver');
});

/* ---------- HMAC (sama persis dengan yang dipakai function verifikasi) ---------- */
// Dipakai untuk membuat kode QR referral (opsional, kosmetik) dan kode tetap kartu cetak
// (wajib sama supaya verifikasi.html bisa mengenalinya). token driver_cards dipakai sebagai kunci.
const encHmac = new TextEncoder();
async function hmacHex(key, msg) {
  const k = await crypto.subtle.importKey('raw', encHmac.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, encHmac.encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/* ---------- QR referral dengan logo (dibuat langsung di panel) ---------- */
const QR_LOGO_SRC = 'images/logo_sky_blue_transparent.png';
function loadImg(src) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
}
async function makeQR(text, size) {
  const q = qrcode(0, 'H');            // level H: tahan logo di tengah
  q.addData(text); q.make();
  const n = q.getModuleCount(), quiet = 4;
  const cell = Math.floor(size / (n + quiet * 2)), total = cell * (n + quiet * 2);
  const c = document.createElement('canvas'); c.width = c.height = total;
  const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, total, total);
  x.fillStyle = '#000';
  for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) {
    if (q.isDark(r, k)) x.fillRect((k + quiet) * cell, (r + quiet) * cell, cell, cell);
  }
  try {
    const img = await loadImg(QR_LOGO_SRC);
    const t = document.createElement('canvas'); t.width = 1328; t.height = 1287;
    const tx = t.getContext('2d');
    tx.drawImage(img, 0, 151, 1328, 1287, 0, 0, 1328, 1287);   // potong bagian kosong atas
    tx.globalCompositeOperation = 'source-in';
    tx.fillStyle = '#0891b2'; tx.fillRect(0, 0, 1328, 1287);    // warnai teal
    const plate = Math.round(total * 0.20), pad = Math.round(plate * 0.06);
    const lw = plate - pad * 2, lh = Math.round(lw * 1287 / 1328);
    const px = Math.round((total - plate) / 2);
    x.fillStyle = '#fff'; x.beginPath();
    if (x.roundRect) x.roundRect(px, px, plate, plate, plate * 0.18); else x.rect(px, px, plate, plate);
    x.fill();
    x.drawImage(t, px + pad, px + Math.round((plate - lh) / 2), lw, lh);
  } catch (_e) { /* logo gagal dimuat: QR tetap valid tanpa logo */ }
  return c;
}
document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-qr]');
  if (!b) return;
  const url = b.dataset.qr;
  if (!url) { toast('Alamat situs belum diisi di Pengaturan (site_url)', true); return; }
  if (typeof qrcode !== 'function') { toast('Pustaka QR belum termuat, muat ulang halaman', true); return; }
  const c = await makeQR(url, 720);
  const nama = b.dataset.qrname || 'driver';
  openModal(`
    <h2>QR referral</h2>
    <div style="text-align:center"><div id="qrHolder"></div>
    <div class="small" style="word-break:break-all;margin-top:8px">${esc(url)}</div></div>
    <div class="mbtns"><button class="btn ghost" id="qrClose" type="button">Tutup</button><button class="btn" id="qrDl" type="button">Unduh PNG</button></div>`);
  c.style.width = '100%'; c.style.maxWidth = '320px'; c.style.height = 'auto';
  $('#qrHolder').appendChild(c);
  $('#qrClose').addEventListener('click', closeModal);
  $('#qrDl').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = c.toDataURL('image/png'); a.download = `qr-${nama}.png`;
    document.body.appendChild(a); a.click(); a.remove();
  });
});

const S = { drivers: [], siteUrl: '', cards: {} };
const STATUS = { pending: 'Menunggu bayar', dp_paid: 'DP Diterima', paid: 'Lunas', confirmed: 'Dikonfirmasi', completed: 'Selesai', cancelled: 'Dibatalkan', expired: 'Kedaluwarsa' };
const PAID_SET = ['dp_paid', 'paid', 'confirmed', 'completed'];
const WILAYAH = { lembang: 'Lembang', dago: 'Dago', ciwidey: 'Ciwidey', pangalengan: 'Pangalengan', custom: 'Rute', catatan: 'Catatan' };
const badge = (st) => `<span class="badge b-${esc(st)}">${esc(STATUS[st] || st)}</span>`;
// Pelaksana trip (tampil di daftar pesanan & surat jalan): yang ditugaskan, atau pembawa bila belum ditugaskan.
const drv = (o) => o.assigned_driver || o.driver_slug || '';
// Pemilik pendapatan (dipakai di Laporan): pembawa pesanan (link/QR-nya) lebih diutamakan;
// bila pesanan langsung dari web, pendapatan jatuh ke yang ditugaskan menjalankan trip.
const earner = (o) => o.driver_slug || o.assigned_driver || '';
const driverName = (slug) => { const d = S.drivers.find((x) => x.slug === slug); return d ? d.name : (slug || '-'); };
function destText(o) {
  const d = o.destinations || {};
  const lines = Object.keys(WILAYAH).filter((k) => Array.isArray(d[k]) && d[k].length).map((k) => `${WILAYAH[k]}: ${d[k].join(k === 'custom' ? ' \u2192 ' : k === 'catatan' ? '; ' : ', ')}`);
  return lines.length ? lines.join('\n') : '-';
}
