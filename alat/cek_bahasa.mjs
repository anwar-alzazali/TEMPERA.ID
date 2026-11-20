// Pemeriksa kamus tiga bahasa (id / ms / en). Jalankan: node alat/cek_bahasa.mjs
// Gagal (exit 1) bila ada kunci yang hilang di salah satu bahasa, atau {isian} yang tidak sama.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const BAHASA = ['id', 'ms', 'en'];
let gagal = 0;

function isian(s) { return [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(','); }

function banding(nama, kamus) {
  const kunci = new Set(BAHASA.flatMap((b) => Object.keys(kamus[b] || {})));
  for (const b of BAHASA) {
    if (!kamus[b]) { console.log(`✗ ${nama}: bahasa ${b} tidak ada`); gagal++; continue; }
    const hilang = [...kunci].filter((k) => !(k in kamus[b]));
    if (hilang.length) { console.log(`✗ ${nama} [${b}] kunci hilang: ${hilang.join(', ')}`); gagal++; }
  }
  for (const k of kunci) {
    const pola = BAHASA.filter((b) => kamus[b] && k in kamus[b]).map((b) => isian(kamus[b][k]));
    if (new Set(pola).size > 1) { console.log(`✗ ${nama} '${k}': {isian} berbeda antarbahasa (${pola.join(' | ')})`); gagal++; }
  }
  console.log(`• ${nama}: ${kunci.size} kunci diperiksa`);
}

// 1) Beranda: objek I18N di js/main.js
const main = readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');
const a = main.indexOf('const I18N = {'), z = main.indexOf('\nconst WX_DESC');
banding('js/main.js (beranda)', vm.runInNewContext('(' + main.slice(a + 'const I18N = '.length, z).trim().replace(/;$/, '') + ')'));

// 2) Halaman produk: kamus yang dikirim ke P.kamus({...})
for (const f of ['bandara.js', 'open-trip.js']) {
  let dapat = null;
  const P = new Proxy({ kamus: (k) => { dapat = k; } }, { get: (o, n) => (n in o ? o[n] : () => {}) });
  const doc = { addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; } };
  try { vm.runInNewContext(readFileSync(new URL('../js/' + f, import.meta.url), 'utf8'), { P, document: doc, window: {}, location: { href: 'http://x/' }, URL, setTimeout() {}, console }); }
  catch (e) { /* bagian setelah P.kamus boleh gagal tanpa DOM */ }
  if (!dapat) { console.log(`✗ ${f}: P.kamus tidak terpanggil`); gagal++; continue; }
  banding('js/' + f, dapat);
}

if (gagal) { console.log(`\n${gagal} masalah ditemukan.`); process.exit(1); }
console.log('\nSemua kamus lengkap di tiga bahasa.');
