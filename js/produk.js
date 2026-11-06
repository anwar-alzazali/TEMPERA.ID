/* ===== Pembantu bersama halaman produk (bandara.html, open-trip.html).
   Harga dihitung SERVER (pesan-bandara / pesan-open-trip); halaman hanya menampilkan perkiraan dari pengaturan publik. ===== */
const P = (() => {
  const SB_URL = 'https://wjmotidelqgcyyujacud.supabase.co';
  const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqbW90aWRlbHFnY3l5dWphY3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMzE2ODIsImV4cCI6MjEwNDkwNzY4Mn0.kZVRZhw0ryUcT-Pb7akpaO6vR4gOGwCkpD1kvk_uRac';
  const H = { apikey: ANON, Authorization: `Bearer ${ANON}`, 'Content-Type': 'application/json' };
  let WA = '6285196755972';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rp = (v) => 'Rp' + Number(v || 0).toLocaleString('id-ID');
  const normWA = (n) => { let x = String(n || '').replace(/[^0-9]/g, ''); if (x.startsWith('0')) x = '62' + x.slice(1); else if (x.startsWith('8')) x = '62' + x; return x; };

  /* ---- bahasa: sama dengan beranda (localStorage tempera_lang) ---- */
  let lang = 'id';
  try { const s = localStorage.getItem('tempera_lang'); if (s === 'id' || s === 'ms') lang = s; } catch (e) {}
  try { const q = new URL(location.href).searchParams.get('lang'); if (q === 'ms' || q === 'id') lang = q; } catch (e) {}
  let KAMUS = { id: {}, ms: {} };
  const t = (k, v) => { let s = (KAMUS[lang] && KAMUS[lang][k]) ?? KAMUS.id[k] ?? k; if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]); return s; };
  function terapkan() {
    document.documentElement.lang = lang === 'ms' ? 'ms' : 'id';
    $$('[data-t]').forEach((el) => { el.textContent = t(el.dataset.t); });
    $$('[data-th]').forEach((el) => { el.innerHTML = t(el.dataset.th); });
    $$('[data-tp]').forEach((el) => { el.placeholder = t(el.dataset.tp); });
    const b = $('#pLang'); if (b) b.textContent = lang === 'ms' ? '🇲🇾 MY' : '🇮🇩 ID';
    document.dispatchEvent(new Event('p-lang'));
  }
  function kamus(k) { KAMUS = k; terapkan(); const b = $('#pLang'); if (b) b.addEventListener('click', () => { lang = lang === 'ms' ? 'id' : 'ms'; try { localStorage.setItem('tempera_lang', lang); } catch (e) {} terapkan(); }); }

  /* ---- ref driver (link/QR driver), sama dengan beranda ---- */
  try {
    const r = new URL(location.href).searchParams.get('ref');
    if (r && /^[a-z0-9_-]{1,40}$/i.test(r)) localStorage.setItem('tempera_ref', JSON.stringify({ slug: r.toLowerCase(), t: Date.now() }));
  } catch (e) {}
  const getRef = () => { try { const o = JSON.parse(localStorage.getItem('tempera_ref') || 'null'); if (o && o.slug && Date.now() - o.t < 30 * 86400000) return o.slug; } catch (e) {} return ''; };
  const refTag = () => { const s = getRef(); return /^tmp-\d{2,4}$/i.test(s) ? ` (Ref: ${s.toUpperCase()})` : ''; };
  const waLink = (msg) => `https://wa.me/${WA}` + (msg ? `?text=${encodeURIComponent(msg + refTag())}` : '');

  /* ---- data ---- */
  async function setelan(kunci) {
    const r = await fetch(`${SB_URL}/rest/v1/app_settings?select=key,value&key=in.(${kunci.join(',')})`, { headers: H });
    const j = await r.json(); const o = {}; if (Array.isArray(j)) j.forEach((x) => { o[x.key] = x.value; });
    { const w = normWA(o.admin_wa || ''); if (w.length >= 10 && w.length <= 15) WA = w; }
    return o;
  }
  async function rpc(fn, body) { const r = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, { method: 'POST', headers: H, body: JSON.stringify(body || {}) }); return r.json(); }
  async function fungsi(nama, body) {
    const r = await fetch(`${SB_URL}/functions/v1/${nama}`, { method: 'POST', headers: H, body: JSON.stringify(body), signal: AbortSignal.timeout ? AbortSignal.timeout(45000) : undefined });
    const j = await r.json().catch(() => ({ ok: false, error: 'Jawaban server tidak terbaca' }));
    return j;
  }

  /* ---- Midtrans Snap production, dimuat saat formulir disentuh ---- */
  let snapJanji = null;
  function muatSnap() {
    if (window.snap) return Promise.resolve(true);
    if (snapJanji) return snapJanji;
    snapJanji = new Promise((res) => {
      const sc = document.createElement('script'); sc.src = 'https://app.midtrans.com/snap/snap.js'; sc.setAttribute('data-client-key', 'Mid-client-In1jdxtwYWLalUfq'); sc.async = true;
      const batas = setTimeout(() => res(!!window.snap), 15000);
      sc.onload = () => { clearTimeout(batas); res(!!window.snap); };
      sc.onerror = () => { clearTimeout(batas); snapJanji = null; sc.remove(); res(false); };
      document.head.appendChild(sc);
    });
    return snapJanji;
  }

  /* ---- analitik: tanpa data pribadi ---- */
  const FBQ = { mulai_booking: 'InitiateCheckout', buat_pesanan: 'AddPaymentInfo', purchase: 'Purchase', klik_wa: 'Contact' };
  function lacak(nama, data) {
    try { if (typeof window.gtag === 'function') window.gtag('event', nama, data || {}); } catch (e) {}
    try { if (typeof window.fbq === 'function' && FBQ[nama]) window.fbq('track', FBQ[nama], data && data.value != null ? { value: data.value, currency: data.currency || 'IDR' } : {}); } catch (e) {}
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href*="wa.me"]'); if (!a) return;
    try { const u = new URL(a.href); if (!u.searchParams.get('text')) { u.searchParams.set('text', t('wa_msg') + refTag()); a.href = u.toString(); } } catch (er) {}
    const sek = a.closest('section[id],footer,header');
    lacak('klik_wa', { lokasi: (document.body.dataset.halaman || '') + ':' + (a.id || (sek && (sek.id || sek.tagName.toLowerCase())) || 'lain') });
  }, true);

  function pesan(el, teks, jenis) { if (!el) return; el.className = 'pmsg on ' + (jenis || 'err'); el.innerHTML = teks; if (jenis !== 'ok') el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  function bersih(el) { if (el) { el.className = 'pmsg'; el.innerHTML = ''; } }

  function bayar(data, nilai, kotak, halaman) {
    window.snap.pay(data.snap_token, {
      onSuccess: (r) => { lacak('purchase', { transaction_id: data.order_id, value: nilai, currency: 'IDR', produk: halaman, metode: (r && r.payment_type) || '' }); pesan(kotak, t('bayar_ok'), 'ok'); kotak.scrollIntoView({ behavior: 'smooth', block: 'center' }); },
      onPending: () => { pesan(kotak, t('bayar_pending'), 'info'); },
      onError: () => { pesan(kotak, t('bayar_gagal')); },
      onClose: () => { pesan(kotak, t('bayar_tutup', { wa: waLink(t('wa_bantu', { id: data.order_id })) }), 'info'); },
    });
  }

  function hariIni() { return new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10); }
  function tglPanjang(iso) { const d = new Date(iso + 'T00:00:00+07:00'); return d.toLocaleDateString(lang === 'ms' ? 'ms-MY' : 'id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }); }

  return { $, $$, esc, rp, normWA, t, kamus, get lang() { return lang; }, waLink, getRef, setelan, rpc, fungsi, muatSnap, lacak, pesan, bersih, bayar, hariIni, tglPanjang, terapkan };
})();
