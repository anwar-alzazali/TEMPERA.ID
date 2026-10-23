/* ---------- KAS: REKAP IURAN, TARIF, IURAN KHUSUS (SQL 98) ---------- */
// Tambahan di tab Kas: rekap iuran per anggota per bulan (+ Cetak), tarif iuran (berlaku mulai bulan),
// iuran khusus (buat, kelola peserta & nominal, catat bayar manual, tutup, Cetak).
// Tab Driver: isian "Bebas iuran" & "Iuran mulai (YYYY-MM)".
RES.driver.fields.push(
  { key: 'bebas_iuran', label: 'Bebas iuran kas', type: 'bool' },
  { key: 'iuran_mulai', label: 'Iuran kas mulai (YYYY-MM, kosong = bulan bergabung)', type: 'text' });
const _readFieldKas = readField;
readField = function (f, required) {
  if (f.key === 'iuran_mulai') { const v = $('#f_iuran_mulai').value.trim(); const m = /^(\d{4})-(\d{2})/.exec(v); return m ? `${m[1]}-${m[2]}-01` : null; }
  return _readFieldKas(f, required);
};
const blnP = (ym) => { const m = /^(\d{4})-(\d{2})/.exec(ym || ''); return m ? new Date(Date.UTC(+m[1], +m[2] - 1, 15)).toLocaleDateString('id-ID', { month: 'short', year: '2-digit', timeZone: 'UTC' }) : ym; };
const blnL = (ym) => { const m = /^(\d{4})-(\d{2})/.exec(ym || ''); return m ? new Date(Date.UTC(+m[1], +m[2] - 1, 15)).toLocaleDateString('id-ID', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : ym; };
const IKN = { lunas: '✅', sebagian: '◐', belum: '❌', '-': '–' };
function cetakKas(judul, sub, isi) {
  const w = window.open('', '_blank'); if (!w) { toast('Izinkan pop-up untuk mencetak', true); return; }
  w.document.write(`<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>${esc(judul)}</title><style>
    body{font-family:system-ui,Arial,sans-serif;color:#0f172a;margin:24px}h1{font-size:18px;margin:0}p{margin:4px 0 14px;color:#475569;font-size:12px}
    table{border-collapse:collapse;width:100%;font-size:11.5px}th,td{border:1px solid #cbd5e1;padding:5px 4px;text-align:center}th{background:#e0f2fe}
    td:first-child,th:first-child{text-align:left}.small{color:#64748b;font-size:10px}.hutang{color:#b91c1c;font-weight:700}
    .kop{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #0891b2;padding-bottom:8px;margin-bottom:12px}.kop b{color:#0891b2;letter-spacing:.15em}
    button{display:none}@page{size:A4 landscape;margin:12mm}</style></head><body>
    <div class="kop"><div><b>TEMPERA</b><h1>${esc(judul)}</h1></div><div class="small">Dicetak ${esc(new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }))} WIB</div></div>
    <p>${esc(sub)}</p>${isi}<p style="margin-top:14px">Keterangan: ✅ lunas · ◐ sebagian · ❌ belum · – tidak ditagih</p></body></html>`);
  w.document.close(); w.focus(); setTimeout(() => w.print(), 300);
}
async function dataRekap() {
  const r = await sb.rpc('rekap_iuran', { p_slug: null });
  if (r.error) throw new Error(r.error.message);
  const bi = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 7);
  const per = {};
  r.data.forEach((x) => {
    const b = String(x.bulan).slice(0, 7);
    const a = (per[x.driver_slug] ||= { slug: x.driver_slug, nama: x.nama, kode: x.kode, bulan: {}, tunggakan: 0, dimuka: 0 });
    a.bulan[b] = x; if (b <= bi) a.tunggakan += Math.max(0, x.tagihan - x.terbayar); else if (x.terbayar > 0) a.dimuka++;
  });
  const semua = [...new Set(r.data.map((x) => String(x.bulan).slice(0, 7)))].filter((b) => b <= bi).sort();
  return { per: Object.values(per), semua };
}
function htmlRekap(d, jumlahBulan) {
  const kol = jumlahBulan ? d.semua.slice(-jumlahBulan) : d.semua;
  const rows = [...d.per].sort((a, b) => b.tunggakan - a.tunggakan || String(a.kode).localeCompare(String(b.kode)));
  const st = (v) => (!v || !(v.tagihan > 0) ? '-' : v.terbayar >= v.tagihan ? 'lunas' : v.terbayar > 0 ? 'sebagian' : 'belum');   // tagihan 0 = tidak ditagih, bukan lunas
  const adaTarif = d.per.some((a) => Object.values(a.bulan).some((v) => v.tagihan > 0));
  return `${adaTarif ? '' : '<div class="help" style="margin:0 0 10px;padding:8px 10px;background:#fef3c7;border-radius:8px;color:#92400e">Tarif iuran kas belum diatur (Rp0), jadi belum ada tagihan dan semua bulan tampil "–". Isi di kartu <b>Tarif iuran kas</b> di bawah.</div>'}<div class="tablewrap"><table data-grid style="min-width:${260 + kol.length * 56}px"><thead><tr><th>Anggota</th>${kol.map((b) => `<th class="num">${esc(blnP(b))}</th>`).join('')}<th class="num">Tunggakan</th></tr></thead><tbody>
    ${rows.map((a) => `<tr><td>${esc(a.nama)} <span class="small">${esc(a.kode || '')}${a.dimuka ? ` · di muka ${a.dimuka} bln` : ''}</span></td>${kol.map((b) => `<td class="num">${IKN[st(a.bulan[b])]}</td>`).join('')}
      <td class="num ${a.tunggakan > 0 ? 'hutang' : ''}" style="${a.tunggakan > 0 ? 'color:var(--danger,#b91c1c);font-weight:700' : ''}">${a.tunggakan > 0 ? rp(a.tunggakan) : '–'}</td></tr>`).join('') || '<tr><td colspan="99" class="empty">Belum ada anggota yang ditagih.</td></tr>'}
    <tr><td><b>Total tunggakan</b></td>${kol.map(() => '<td></td>').join('')}<td class="num"><b>${rp(rows.reduce((s, a) => s + a.tunggakan, 0))}</b></td></tr>
  </tbody></table></div>`;
}

const _kasAsli = VIEWS.kas;
VIEWS.kas = async function () {
  await _kasAsli();
  const v = $('#view'); if (!v) return;
  const box = document.createElement('div');
  box.innerHTML = `
    <div class="card" style="margin-top:14px"><div class="bar" style="justify-content:space-between;align-items:center;margin:0 0 8px"><h2 style="margin:0">Rekap iuran kas</h2>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><select id="rkPer" style="width:auto"><option value="6">6 bulan terakhir</option><option value="12">12 bulan</option><option value="0">Semua</option></select>
      <button class="btn ghost sm" type="button" id="rkCetak">Cetak</button></div></div>
      <div id="rkIsi"><div class="empty">Memuat…</div></div>
      <div class="help" style="margin-top:8px">Setoran driver otomatis menutup bulan tertua yang belum lunas. Anggota dihitung sejak bulan bergabung; ubah per anggota di tab Driver (Iuran mulai / Bebas iuran). Mulai hitung & biaya layanan: tab Pengaturan (<b>iuran_mulai</b>, <b>iuran_biaya_layanan</b>).</div></div>
    <div class="card" style="margin-top:14px"><h2>Tarif iuran kas</h2><div id="trIsi"><div class="empty">Memuat…</div></div>
      <div class="row2" style="margin-top:10px"><label>Berlaku mulai (bulan)<input id="trBulan" type="month"></label><label>Nominal per bulan (Rp)<input id="trNom" type="number" min="0" step="500" placeholder="10000"></label>
      <button class="btn" type="button" id="trSimpan">Simpan tarif</button></div>
      <div class="help">Tarif baru hanya berlaku mulai bulan yang dipilih; bulan-bulan sebelumnya tetap memakai tarif lama.</div></div>
    <div class="card" style="margin-top:14px"><h2>Iuran khusus</h2>
      <div class="fgrid"><div><label>Judul<input id="ikJudul" maxlength="80" placeholder="mis. Kemeja seragam 2026"></label></div>
        <div><label>Nominal per anggota (Rp)<input id="ikNom" type="number" min="0" step="1000" placeholder="120000"></label></div>
        <div><label>Batas bayar (opsional)<input id="ikBatas" type="date"></label></div>
        <div><label>Keterangan (opsional)<input id="ikKet" placeholder="mis. ukuran S–XXL, XXL +15rb"></label></div></div>
      <div class="mbtns" style="justify-content:flex-start"><button class="btn" type="button" id="ikBuat">Buat iuran</button></div>
      <div class="help">Semua anggota aktif (kecuali bebas iuran) otomatis menjadi peserta. Nominal per orang bisa diubah di "Kelola". Uang iuran khusus terpisah dari saldo kas.</div>
      <div id="ikList" style="margin-top:12px"><div class="empty">Memuat…</div></div></div>`;
  v.appendChild(box);
  let REKAP = null;
  const gambarRekap = () => { $('#rkIsi').innerHTML = REKAP ? htmlRekap(REKAP, +$('#rkPer').value) : ''; };
  try { REKAP = await dataRekap(); gambarRekap(); } catch (e) { $('#rkIsi').innerHTML = `<div class="empty">Gagal memuat: ${esc(e.message)}</div>`; }
  $('#rkPer').addEventListener('change', gambarRekap);
  $('#rkCetak').addEventListener('click', () => { if (!REKAP) return; const n = +$('#rkPer').value; const kol = n ? REKAP.semua.slice(-n) : REKAP.semua;
    cetakKas('Rekap Iuran Kas Mitra', kol.length ? `Periode ${blnL(kol[0])} – ${blnL(kol[kol.length - 1])}` : '', htmlRekap(REKAP, n)); });
  muatTarif(); muatIuranKhusus();
  $('#trSimpan').addEventListener('click', async (e) => {
    const b = $('#trBulan').value, n = parseInt($('#trNom').value, 10);
    if (!/^\d{4}-\d{2}$/.test(b) || !(n >= 0)) { toast('Isi bulan dan nominal', true); return; }
    e.target.disabled = true;
    const r = await sb.from('iuran_tarif').upsert({ berlaku_mulai: `${b}-01`, nominal: n });
    e.target.disabled = false; if (r.error) { toast(r.error.message, true); return; }
    toast('Tarif disimpan'); nav('kas');
  });
  $('#ikBuat').addEventListener('click', async (e) => {
    const j = $('#ikJudul').value.trim(), n = parseInt($('#ikNom').value, 10);
    if (!j || !(n > 0)) { toast('Isi judul dan nominal', true); return; }
    e.target.disabled = true;
    const r = await sb.rpc('admin_buat_iuran_khusus', { p_judul: j, p_keterangan: $('#ikKet').value.trim() || null, p_nominal: n, p_batas: $('#ikBatas').value || null });
    e.target.disabled = false; if (r.error) { toast(r.error.message, true); return; }
    toast('Iuran dibuat'); ['#ikJudul', '#ikNom', '#ikBatas', '#ikKet'].forEach((s) => { $(s).value = ''; }); muatIuranKhusus();
  });
};
async function muatTarif() {
  const r = await sb.from('iuran_tarif').select('*').order('berlaku_mulai', { ascending: false });
  $('#trIsi').innerHTML = r.error ? `<div class="empty">${esc(r.error.message)}</div>` : `<div class="tablewrap"><table style="min-width:280px"><thead><tr><th>Berlaku mulai</th><th class="num">Per bulan</th><th></th></tr></thead><tbody>
    ${(r.data || []).map((t) => `<tr><td>${esc(blnL(t.berlaku_mulai))}</td><td class="num">${rp(t.nominal)}</td><td class="num">${(r.data.length > 1) ? `<button class="btn ghost sm" type="button" data-tr-hapus="${esc(t.berlaku_mulai)}">Hapus</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`;
}
async function dataKhusus() {
  const [i, p, b] = await Promise.all([sb.from('iuran_khusus').select('*').order('id', { ascending: false }), sb.from('iuran_khusus_peserta').select('*'), sb.from('iuran_khusus_bayar').select('*').order('created_at')]);
  if (i.error || p.error || b.error) throw new Error((i.error || p.error || b.error).message);
  return (i.data || []).map((x) => {
    const peserta = p.data.filter((q) => q.iuran_id === x.id).map((q) => {
      const bayar = b.data.filter((y) => y.iuran_id === x.id && y.driver_slug === q.driver_slug);
      const terbayar = bayar.reduce((s, y) => s + y.jumlah, 0);
      return { ...q, nama: driverName(q.driver_slug), terbayar, sisa: Math.max(0, q.nominal - terbayar), bayar };
    }).sort((a, c) => (a.sisa > 0 ? 0 : 1) - (c.sisa > 0 ? 0 : 1) || String(a.nama).localeCompare(String(c.nama)));
    return { ...x, peserta, target: peserta.reduce((s, q) => s + q.nominal, 0), terkumpul: peserta.reduce((s, q) => s + Math.min(q.terbayar, q.nominal), 0),
             masuk: b.data.filter((y) => y.iuran_id === x.id).reduce((s, y) => s + y.jumlah, 0) };
  });
}
function htmlKhusus(x, idx) {   // tabel ringkas 4 kolom (muat di HP); idx diberikan = tombol Catat per baris
  const st = (q) => (!(q.nominal > 0) ? '-' : q.terbayar >= q.nominal ? 'lunas' : q.terbayar > 0 ? 'sebagian' : 'belum');
  const aksi = (q) => (idx != null && x.status !== 'selesai' && q.sisa > 0 ? `<button class="btn sm" type="button" data-ik-catat="${idx}|${esc(q.driver_slug)}">Catat</button>` : '');
  return `<div class="tablewrap"><table data-grid style="width:100%;min-width:0;table-layout:auto;font-size:13px"><thead><tr><th>Anggota</th><th class="num" style="padding:6px 4px">Status</th><th class="num" style="padding:6px 4px">Sisa</th>${idx != null ? '<th></th>' : ''}</tr></thead><tbody>
    ${x.peserta.map((q) => `<tr><td style="white-space:normal;word-break:break-word;padding:8px 6px 8px 0">${esc(q.nama)}</td><td class="num" style="padding:8px 4px">${IKN[st(q)]}</td><td class="num" style="padding:8px 4px;white-space:nowrap;${q.sisa > 0 ? 'color:var(--danger,#b91c1c);font-weight:700' : ''}">${q.sisa > 0 ? rp(q.sisa) : '–'}</td>${idx != null ? `<td style="padding:6px 0 6px 4px">${aksi(q)}</td>` : ''}</tr>`).join('') || '<tr><td colspan="4" class="empty">Belum ada peserta.</td></tr>'}
    <tr><td><b>Total</b></td><td></td><td class="num" style="white-space:nowrap"><b>${rp(x.target - x.terkumpul)}</b></td>${idx != null ? '<td></td>' : ''}</tr></tbody></table></div>`;
}
let IK = [];
async function muatIuranKhusus() {
  try { IK = await dataKhusus(); } catch (e) { $('#ikList').innerHTML = `<div class="empty">Gagal memuat: ${esc(e.message)}</div>`; return; }
  $('#ikList').innerHTML = IK.length ? IK.map((x, i) => `<div style="border-top:1px solid var(--line);padding:10px 0">
      <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><div><b>${esc(x.judul)}</b> ${x.status === 'selesai' ? '<span class="badge b-cancelled">Ditutup</span>' : '<span class="badge b-paid">Aktif</span>'}
        <div class="small">${x.batas ? `Batas ${esc(tglPendek(x.batas))} · ` : ''}Terkumpul ${rp(x.terkumpul)} dari ${rp(x.target)} · ${x.peserta.filter((q) => q.sisa > 0).length} belum lunas${x.masuk > x.terkumpul ? ` · lebih bayar ${rp(x.masuk - x.terkumpul)}` : ''}</div></div>
        <div class="mbtns" style="margin:0"><button class="btn ghost sm" type="button" data-ik-cetak="${i}">Cetak</button><button class="btn sm" type="button" data-ik-kelola="${i}">Kelola</button></div></div>${htmlKhusus(x, i)}</div>`).join('')
    : '<div class="empty">Belum ada iuran khusus.</div>';
}
function kelolaIuran(x) {
  const bukan = S.drivers.filter((d) => d.is_active !== false && !x.peserta.some((q) => q.driver_slug === d.slug));
  openModal(`<h2>${esc(x.judul)}</h2>
    <div class="fgrid"><div><label>Judul<input id="mkJudul" maxlength="80" value="${esc(x.judul)}"></label></div>
      <div><label>Batas bayar<input id="mkBatas" type="date" value="${esc(x.batas || '')}"></label></div>
      <div class="full"><label>Keterangan<input id="mkKet" value="${esc(x.keterangan || '')}"></label></div></div>
    <div class="mbtns" style="justify-content:flex-start"><button class="btn sm" type="button" id="mkSimpan">Simpan judul/keterangan</button>
      <button class="btn ghost sm" type="button" id="mkStatus">${x.status === 'aktif' ? 'Tutup iuran' : 'Aktifkan lagi'}</button></div>
    <h2 style="margin-top:14px">Peserta</h2>
    <div class="tablewrap"><table style="min-width:520px"><thead><tr><th>Anggota</th><th>Nominal</th><th class="num">Dibayar</th><th>Catat bayar manual</th><th></th></tr></thead><tbody>
      ${x.peserta.map((q) => `<tr><td>${esc(q.nama)}${q.sisa > 0 ? '' : ' ✅'}</td>
        <td><div style="display:flex;gap:4px"><input type="number" min="0" step="1000" value="${esc(q.nominal)}" data-mk-nom="${esc(q.driver_slug)}" style="width:100px"><button class="btn ghost sm" type="button" data-mk-nomsave="${esc(q.driver_slug)}">OK</button></div></td>
        <td class="num">${rp(q.terbayar)}${q.bayar.length ? `<div class="small">${q.bayar.map((y) => `${esc(tglPendek(y.tanggal))} ${rp(y.jumlah)}${y.kas_pending_id ? ' (QRIS)' : ` <a href="#" data-mk-hapusbayar="${esc(y.id)}">hapus</a>`}`).join('<br>')}</div>` : ''}</td>
        <td>${q.sisa > 0 ? `<div style="display:flex;gap:4px"><input type="number" min="1" step="1000" placeholder="${esc(q.sisa)}" data-mk-bayar="${esc(q.driver_slug)}" style="width:100px"><button class="btn sm" type="button" data-mk-bayarsave="${esc(q.driver_slug)}">Catat</button></div>` : ''}</td>
        <td class="num">${q.terbayar ? '' : `<button class="btn ghost sm" type="button" data-mk-keluar="${esc(q.driver_slug)}">Keluarkan</button>`}</td></tr>`).join('')}
    </tbody></table></div>
    ${bukan.length ? `<div class="row2" style="margin-top:10px"><label>Tambah peserta<select id="mkTambah">${bukan.map((d) => `<option value="${esc(d.slug)}">${esc(d.name)} (${esc(d.driver_code || d.slug)})</option>`).join('')}</select></label><button class="btn ghost" type="button" id="mkTambahBtn">Tambah</button></div>` : ''}
    <div class="help">"Catat bayar manual" untuk yang membayar tunai/transfer langsung ke admin. Pembayaran lewat QRIS tercatat otomatis.</div>
    <div class="mbtns"><button class="btn ghost" type="button" id="mkTutup">Tutup</button></div>`);
  const ulang = async () => { await muatIuranKhusus(); const baru = IK.find((y) => y.id === x.id); if (baru) kelolaIuran(baru); else closeModal(); };
  const jalan = async (p, pesanOk) => { const r = await p; if (r.error) { toast(r.error.message, true); return; } toast(pesanOk); ulang(); };
  $('#mkTutup').addEventListener('click', closeModal);
  $('#mkSimpan').addEventListener('click', () => { const j = $('#mkJudul').value.trim(); if (!j) { toast('Judul wajib', true); return; }
    jalan(sb.from('iuran_khusus').update({ judul: j, keterangan: $('#mkKet').value.trim() || null, batas: $('#mkBatas').value || null }).eq('id', x.id), 'Disimpan'); });
  $('#mkStatus').addEventListener('click', () => jalan(sb.from('iuran_khusus').update({ status: x.status === 'aktif' ? 'selesai' : 'aktif' }).eq('id', x.id), x.status === 'aktif' ? 'Iuran ditutup' : 'Iuran diaktifkan'));
  if ($('#mkTambahBtn')) $('#mkTambahBtn').addEventListener('click', () => jalan(sb.from('iuran_khusus_peserta').insert({ iuran_id: x.id, driver_slug: $('#mkTambah').value, nominal: x.nominal_default }), 'Peserta ditambahkan'));
  $$('#modalBody [data-mk-nomsave]').forEach((b) => b.addEventListener('click', () => { const s = b.dataset.mkNomsave; const n = parseInt($(`#modalBody [data-mk-nom="${CSS.escape(s)}"]`).value, 10);
    if (!(n >= 0)) { toast('Nominal tidak valid', true); return; } jalan(sb.from('iuran_khusus_peserta').update({ nominal: n }).eq('iuran_id', x.id).eq('driver_slug', s), 'Nominal diubah'); }));
  $$('#modalBody [data-mk-bayarsave]').forEach((b) => b.addEventListener('click', () => { const s = b.dataset.mkBayarsave; const el = $(`#modalBody [data-mk-bayar="${CSS.escape(s)}"]`);
    const n = parseInt(el.value || el.placeholder, 10); if (!(n > 0)) { toast('Isi jumlah', true); return; }
    jalan(sb.from('iuran_khusus_bayar').insert({ iuran_id: x.id, driver_slug: s, jumlah: n, keterangan: 'Dicatat admin (tunai/transfer)', dicatat_oleh: 'admin' }), 'Pembayaran dicatat'); }));
  $$('#modalBody [data-mk-keluar]').forEach((b) => b.addEventListener('click', () => { if (!confirm('Keluarkan anggota ini dari iuran?')) return;
    jalan(sb.from('iuran_khusus_peserta').delete().eq('iuran_id', x.id).eq('driver_slug', b.dataset.mkKeluar), 'Peserta dikeluarkan'); }));
  $$('#modalBody [data-mk-hapusbayar]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); if (!confirm('Hapus catatan pembayaran manual ini?')) return;
    jalan(sb.from('iuran_khusus_bayar').delete().eq('id', a.dataset.mkHapusbayar), 'Catatan dihapus'); }));
}
async function catatCepat(idx, slug, jumlah) {
  const x = IK[idx]; if (!x || !(jumlah > 0)) { toast('Nominal tidak valid', true); return; }
  const r = await sb.from('iuran_khusus_bayar').insert({ iuran_id: x.id, driver_slug: slug, jumlah, keterangan: 'Dicatat admin (tunai/transfer)', dicatat_oleh: 'admin' });
  if (r.error) { toast(r.error.message, true); return; }
  toast('Pembayaran dicatat'); muatIuranKhusus();
}
document.addEventListener('click', (e) => {
  const ca = e.target.closest('[data-ik-catat]'); if (ca) { const [i, sl] = ca.dataset.ikCatat.split('|'); const q = IK[+i].peserta.find((y) => y.driver_slug === sl); if (!q) return;
    const v = prompt(`Catat pembayaran ${q.nama} (Rp). Biarkan angka ini = lunas:`, q.sisa); if (v === null) return; catatCepat(+i, sl, Number(String(v).replace(/\D/g, ''))); return; }
  const k = e.target.closest('[data-ik-kelola]'); if (k) { kelolaIuran(IK[+k.dataset.ikKelola]); return; }
  const c = e.target.closest('[data-ik-cetak]'); if (c) { const x = IK[+c.dataset.ikCetak]; cetakKas(`Iuran: ${x.judul}`, `${x.batas ? 'Batas ' + tglPendek(x.batas) + ' · ' : ''}Terkumpul ${rp(x.terkumpul)} dari ${rp(x.target)}`, htmlKhusus(x)); return; }
  const h = e.target.closest('[data-tr-hapus]'); if (h) { if (!confirm('Hapus tarif ini?')) return;
    sb.from('iuran_tarif').delete().eq('berlaku_mulai', h.dataset.trHapus).then((r) => { if (r.error) toast(r.error.message, true); else { toast('Tarif dihapus'); nav('kas'); } }); }
});
