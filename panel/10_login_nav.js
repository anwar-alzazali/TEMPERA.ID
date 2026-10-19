/* ---------- login ---------- */
/* Captcha Cloudflare Turnstile di formulir login */
let tsToken = '', tsWidget = null, tsMuat = false;
function muatTurnstile() {
  if (tsMuat) return; tsMuat = true;
  window.__tsSiap = () => {
    tsWidget = window.turnstile.render('#lTs', { sitekey: '0x4AAAAAAFSZKDiTs-n7JFdW', theme: 'auto', size: 'flexible',
      callback: (t) => { tsToken = t; }, 'expired-callback': () => { tsToken = ''; }, 'error-callback': () => { tsToken = ''; } });
  };
  const sc = document.createElement('script');
  sc.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__tsSiap'; sc.async = true;
  document.head.appendChild(sc);
}
function ulangTurnstile() { tsToken = ''; try { if (tsWidget !== null) window.turnstile.reset(tsWidget); } catch (e) {} }
function showLogin(msg) {
  $('#shell').hidden = true; $('#login').hidden = false;
  $('#lErr').textContent = msg || '';
  $('#login').classList.remove('pergi', 'ngebut');
  muatTurnstile();
}
$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (tsWidget !== null && !tsToken) { $('#lErr').textContent = 'Tunggu verifikasi keamanan selesai, lalu coba lagi.'; return; }
  const btn = $('#lBtn'); btn.disabled = true; $('#lErr').textContent = '';
  $('#login').classList.remove('rem'); $('#login').classList.add('ngebut');
  const { error } = await sb.auth.signInWithPassword({ email: $('#lEmail').value.trim(), password: $('#lPass').value, options: { captchaToken: tsToken || undefined } });
  btn.disabled = false; ulangTurnstile();
  $('#login').classList.remove('ngebut');
  if (error) { $('#login').classList.add('rem'); setTimeout(() => $('#login').classList.remove('rem'), 900); $('#lErr').textContent = /captcha/i.test(error.message || '') ? 'Verifikasi keamanan gagal. Muat ulang halaman lalu coba lagi.' : 'Email atau password salah.'; return; }
  $('#login').classList.add('pergi');
  await new Promise((r) => setTimeout(r, 750));
  await enter();
});
$('#btnLogout').addEventListener('click', async () => { await sb.auth.signOut(); showLogin(); });

async function enter() {
  const { data, error } = await sb.rpc('is_admin');
  if (error || data !== true) { await sb.auth.signOut(); showLogin('Akun ini bukan admin.'); return; }
  $('#login').hidden = true; $('#shell').hidden = false;
  await loadShared();
  refreshStats();
  nav(location.hash.replace('#', '') || 'pesanan');
}
async function loadShared() {
  const d = await sb.from('drivers').select('*').order('driver_code');
  S.drivers = d.data || [];
  const s = await sb.from('app_settings').select('key,value').in('key', ['site_url', 'kas_token']);
  const sm = {}; (s.data || []).forEach((x) => { sm[x.key] = x.value; });
  S.siteUrl = String(sm.site_url || '').replace(/\/+$/, '');
  S.kasToken = sm.kas_token || '';
  const c = await sb.from('driver_cards').select('driver_slug,token');
  S.cards = {};
  (c.data || []).forEach((x) => { S.cards[x.driver_slug] = x.token; });
}

/* ---------- navigasi ---------- */
const VIEWS = {};
const NAVS = [['pesanan', 'Pesanan'], ['laporan', 'Laporan'], ['kas', 'Kas'], ['armada', 'Armada'], ['pengaturan', 'Pengaturan'], ['template', 'Template WA'], ['banner', 'Banner'], ['driver', 'Driver'], ['persetujuan', 'Persetujuan']];
const ICON = {
  pesanan: '<path d="M9 5h6M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1zM8 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2M9 12h6M9 16h4"/>',
  analitik: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  laporan: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6"/>',
  kas: '<path d="M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-1zM16 14h2"/>',
  armada: '<path d="M5 17h14M3 13l2-6a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 6v4H3zM7 17v2M17 17v2M7 13h.01M17 13h.01"/>',
  pengaturan: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  template: '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8 9h8M8 13h5"/>',
  banner: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m21 16-5-5-8 8"/>',
  driver: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
  ulasan: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  galeri: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 15 5-5 4 4 3-3 6 6M8.5 8.5h.01"/>',
  ketersediaan: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  halaman: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  persetujuan: '<path d="M20 6 9 17l-5-5"/><circle cx="12" cy="12" r="9"/>'
};
const ICON_DEF = '<circle cx="12" cy="12" r="3"/>';
const NAV_GRUP = [
  ['Pesanan', ['pesanan', 'ketersediaan', 'ulasan']],
  ['Keuangan', ['analitik', 'laporan', 'kas']],
  ['Mitra', ['driver', 'persetujuan']],
  ['Isi situs', ['armada', 'galeri', 'banner']],
  ['Sistem', ['pengaturan', 'template']]
];
function navHtml(aktif) {
  const ada = new Map(NAVS.filter(([k]) => !(k === 'laporan' && VIEWS.analitik)).map(([k, l]) => [k, l]));
  const tombol = (k) => `<button type="button" data-k="${k}" class="${k === aktif ? 'on' : ''}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k] || ICON_DEF}</svg><span>${esc(ada.get(k))}</span></button>`;
  const dipakai = new Set();
  let h = NAV_GRUP.map(([judul, ks]) => {
    const isi = ks.filter((k) => ada.has(k)); isi.forEach((k) => dipakai.add(k));
    return isi.length ? `<div class="ngrp">${esc(judul)}</div>${isi.map(tombol).join('')}` : '';
  }).join('');
  const sisa = [...ada.keys()].filter((k) => !dipakai.has(k));   // tab baru yang belum dimasukkan kelompok
  if (sisa.length) h += `<div class="ngrp">Lainnya</div>${sisa.map(tombol).join('')}`;
  return h;
}
// Tombol menu bawah (HP) mewakili satu kelompok tab
const BNAV_ISI = { pesanan: ['pesanan', 'ketersediaan', 'ulasan'], analitik: ['analitik', 'laporan', 'kas'], driver: ['driver', 'persetujuan'], armada: ['armada', 'galeri', 'banner'] };
const bnavDari = (key) => Object.keys(BNAV_ISI).find((b) => BNAV_ISI[b].includes(key)) || '';
function nav(key) {
  if (key === 'laporan' && VIEWS.analitik) key = 'analitik';
  if (!VIEWS[key]) key = 'pesanan';
  location.hash = key;
  const sc = $('#nav').scrollTop;
  $('#nav').innerHTML = navHtml(key);
  $('#nav').scrollTop = sc;
  $$('#nav button').forEach((b) => b.addEventListener('click', () => nav(b.dataset.k)));
  const bk = bnavDari(key);
  $$('#bnav button[data-k]').forEach((b) => b.classList.toggle('on', b.dataset.k === bk));
  if ($('#bMore')) $('#bMore').classList.toggle('on', !bk);
  document.body.classList.remove('nav-open');
  window.scrollTo(0, 0);
  $('#view').innerHTML = '<div class="empty">Memuat…</div>';
  return VIEWS[key]();
}

function labelTables() {
  $$('#view table:not([data-grid])').forEach((t) => {
    const hs = $$('thead th', t).map((h) => h.textContent.trim());
    $$('tbody tr', t).forEach((tr) => { [...tr.children].forEach((td, i) => { if (hs[i] !== undefined && !td.hasAttribute('data-label')) td.setAttribute('data-label', hs[i]); if (!td.hasAttribute('colspan') && !(td.firstElementChild && td.firstElementChild.classList.contains('v') && td.children.length === 1)) { const w = document.createElement('span'); w.className = 'v'; while (td.firstChild) w.appendChild(td.firstChild); td.appendChild(w); } }); });
  });
}
new MutationObserver(labelTables).observe($('#view'), { childList: true, subtree: true });
const BNAV = [['pesanan', 'Pesanan'], ['analitik', 'Keuangan'], ['driver', 'Mitra'], ['armada', 'Isi situs']];
$('#bnav').innerHTML = BNAV.map(([k, l]) => `<button type="button" data-k="${k}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg><span>${l}</span></button>`).join('')
  + '<button type="button" id="bMore"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/></svg><span>Lainnya</span></button>';
$$('#bnav button[data-k]').forEach((b) => b.addEventListener('click', () => nav(b.dataset.k)));
$('#bMore').addEventListener('click', () => document.body.classList.toggle('nav-open'));
async function goSearch(v) {
  if (location.hash.replace('#', '') !== 'pesanan') await nav('pesanan');
  const f = $('#fQ'); if (f) { f.value = v; f.dispatchEvent(new Event('input')); }
}
$('#gSearch').addEventListener('keydown', (e) => { if (e.key === 'Enter') { goSearch(e.target.value); e.target.blur(); } });
$('#gSearch').addEventListener('input', (e) => { if (location.hash.replace('#', '') === 'pesanan') { const f = $('#fQ'); if (f) { f.value = e.target.value; f.dispatchEvent(new Event('input')); } } });
$('#bell').addEventListener('click', () => nav('pesanan'));
$('#avatar').addEventListener('click', () => { if (confirm('Keluar dari panel?')) $('#btnLogout').click(); });
$('#scrim').addEventListener('click', () => document.body.classList.remove('nav-open'));
