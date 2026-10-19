/* ---------- LAPORAN ---------- */
VIEWS.laporan = async function () {
  $('#view').innerHTML = `
    <h2>Laporan</h2>
    <div class="bar"><select id="rPer">
      <option value="7">7 hari terakhir</option><option value="30" selected>30 hari terakhir</option>
      <option value="bulan">Bulan ini</option><option value="all">Semua waktu</option></select></div>
    <div id="rOut"><div class="empty">Memuat…</div></div>`;
  $('#rPer').addEventListener('change', loadLaporan);
  await loadLaporan();
};
async function loadLaporan() {
  const per = $('#rPer').value;
  let q = sb.from('orders').select('*').in('status', PAID_SET).limit(3000);
  const now = new Date();
  if (per === '7' || per === '30') q = q.gte('paid_at', new Date(now.getTime() - Number(per) * 86400000).toISOString());
  if (per === 'bulan') q = q.gte('paid_at', new Date(now.getFullYear(), now.getMonth(), 1).toISOString());
  const [o, f] = await Promise.all([q, sb.from('v_funnel').select('*')]);
  if (o.error) { $('#rOut').innerHTML = `<div class="empty">Gagal memuat: ${esc(o.error.message)}</div>`; return; }
  const rows = o.data || [];
  const sum = (arr, k) => arr.reduce((a, x) => a + (Number(x[k]) || 0), 0);
  const byDrv = {};
  rows.forEach((x) => { const k = earner(x) || '(belum ditentukan)'; (byDrv[k] = byDrv[k] || []).push(x); });
  const drvRows = Object.keys(byDrv).map((k) => `<tr><td>${esc(k === '(belum ditentukan)' ? k : driverName(k))}</td><td class="num">${byDrv[k].length}</td><td class="num">${rp(sum(byDrv[k], 'total'))}</td><td class="num">${rp(sum(byDrv[k], 'driver_earning'))}</td></tr>`).join('');
  const fun = (f.data || []).map((x) => `<tr><td>${esc(x.sumber === 'direct' ? 'Langsung dari web' : driverName(x.sumber))}</td><td class="num">${x.visit}</td><td class="num">${x.scan}</td><td class="num">${x.order_dibuat}</td><td class="num">${x.closing}</td><td class="num">${rp(x.omzet)}</td></tr>`).join('');
  $('#rOut').innerHTML = `
    <div class="stats">
      <div class="stat"><div class="v">${rows.length}</div><div class="l">Pesanan lunas</div></div>
      <div class="stat"><div class="v">${rp(sum(rows, 'total'))}</div><div class="l">Omzet</div></div>
      <div class="stat"><div class="v">${rp(sum(rows, 'admin_cut_amount'))}</div><div class="l">Potongan admin</div></div>
      <div class="stat"><div class="v">${rp(sum(rows, 'driver_earning'))}</div><div class="l">Pendapatan driver</div></div>
    </div>
    <div class="card" style="margin-bottom:14px"><h2>Per pembawa pesanan</h2><div class="tablewrap"><table>
      <thead><tr><th>Pembawa pesanan</th><th class="num">Trip</th><th class="num">Omzet</th><th class="num">Pendapatan</th></tr></thead>
      <tbody>${drvRows || '<tr><td colspan="4" class="empty">Belum ada data.</td></tr>'}</tbody></table></div>
      <div class="help" style="margin-top:8px">Pendapatan dicatat untuk yang membawa pesanan (pemilik link/QR). Bila driver itu melemparkan trip ke orang lain, pendapatan tetap di sini &mdash; pembagian dengan pelaksana adalah urusan mereka sendiri.</div></div>
    <div class="card"><h2>Kunjungan → closing (semua waktu)</h2><div class="tablewrap"><table>
      <thead><tr><th>Sumber</th><th class="num">Visit</th><th class="num">Scan</th><th class="num">Order dibuat</th><th class="num">Closing</th><th class="num">Omzet</th></tr></thead>
      <tbody>${fun || '<tr><td colspan="6" class="empty">Belum ada data.</td></tr>'}</tbody></table></div>
      <div class="help" style="margin-top:8px">Visit = hanya berkunjung. Scan = lewat link/QR driver. Closing = pesanan yang sudah dibayar.</div></div>`;
}

/* ---------- KAS ---------- */
const KAS_JENIS = { setoran_driver: 'Setoran driver', komisi_admin: 'Komisi admin (otomatis)', pengeluaran: 'Pengeluaran', lainnya: 'Lainnya' };
let KAS_ROWS = [];
VIEWS.kas = async function () {
  const { data, error } = await sb.from('kas_transaksi').select('*').order('tanggal', { ascending: true }).order('created_at', { ascending: true });
  if (error) { $('#view').innerHTML = `<div class="empty">Gagal memuat: ${esc(error.message)}</div>`; return; }
  let saldo = 0;
  KAS_ROWS = (data || []).map((r) => { saldo += Number(r.jumlah); return { ...r, saldoSaat: saldo }; }).reverse();
  const totalMasuk = (data || []).filter((r) => r.jumlah > 0).reduce((a, r) => a + Number(r.jumlah), 0);
  const totalKeluar = (data || []).filter((r) => r.jumlah < 0).reduce((a, r) => a + Number(r.jumlah), 0);

  const kasLink = (S.siteUrl && S.kasToken) ? `${S.siteUrl}/kas.html?t=${S.kasToken}` : '';

  $('#view').innerHTML = `
    <div class="bar" style="justify-content:space-between;align-items:center"><h2 style="margin:0">Kas</h2><button class="btn" id="btnKasNew" type="button">+ Tambah</button></div>
    <div class="stats">
      <div class="stat"><div class="v">${rp(saldo)}</div><div class="l">Saldo kas saat ini</div></div>
      <div class="stat"><div class="v">${rp(totalMasuk)}</div><div class="l">Total masuk</div></div>
      <div class="stat"><div class="v">${rp(Math.abs(totalKeluar))}</div><div class="l">Total keluar</div></div>
      <div class="stat"><div class="v">${KAS_ROWS.length}</div><div class="l">Jumlah transaksi</div></div>
    </div>
    <div class="card" style="margin-bottom:14px">
      <h2>Link kas untuk anggota</h2>
      <div class="mbtns" style="justify-content:flex-start">
        ${kasLink ? `<button class="btn ghost sm" type="button" data-copy="${esc(kasLink)}">Salin link</button><a class="btn ghost sm" href="${esc(kasLink)}" target="_blank" rel="noopener" style="text-decoration:none">Buka</a>` : '<span class="small">Alamat situs belum diisi di Pengaturan (site_url)</span>'}
        <button class="btn ghost sm" type="button" id="btnKasRotate">Ganti token</button>
      </div>
      <div class="help" style="margin-top:8px">Satu link sama untuk semua anggota &mdash; semua orang melihat pembukuan yang sama persis. Ganti token akan langsung mematikan link lama.</div>
    </div>
    <div class="card"><div class="tablewrap"><table>
      <thead><tr><th>Tanggal</th><th>Jenis</th><th>Keterangan</th><th class="num">Jumlah</th><th class="num">Saldo</th></tr></thead>
      <tbody>${KAS_ROWS.map((r, i) => `<tr>
        <td class="small">${esc(tglPendek(r.tanggal))}</td>
        <td>${esc(KAS_JENIS[r.jenis] || r.jenis)}${r.driver_slug ? `<div class="small">${esc(driverName(r.driver_slug))}</div>` : ''}</td>
        <td>${esc(r.keterangan || '-')}</td>
        <td class="num" style="color:${r.jumlah < 0 ? 'var(--danger)' : '#166534'}">${r.jumlah < 0 ? '- ' : '+ '}${rp(Math.abs(r.jumlah))}</td>
        <td class="num">${rp(r.saldoSaat)}</td>
      </tr>`).join('') || `<tr><td colspan="5" class="empty">Belum ada transaksi.</td></tr>`}</tbody>
    </table></div></div>`;

  $('#btnKasNew').addEventListener('click', openKasForm);
  $('#btnKasRotate').addEventListener('click', async () => {
    if (!confirm('Ganti token link kas? Link lama akan langsung berhenti berfungsi, jadi anggota perlu link barunya.')) return;
    const r = await sb.rpc('rotate_kas_token');
    if (r.error) { toast(r.error.message, true); return; }
    S.kasToken = r.data;
    toast('Token diganti. Bagikan link kas yang baru ke anggota.');
    nav('kas');
  });
};

function openKasForm() {
  const drOpts = S.drivers.map((d) => `<option value="${esc(d.slug)}">${esc(d.name)}</option>`).join('');
  const today = new Date().toISOString().slice(0, 10);
  openModal(`
    <h2>Tambah transaksi kas</h2>
    <div class="fgrid">
      <div><label>Jenis<select id="kJenis">
        <option value="setoran_driver">Setoran driver (masuk)</option>
        <option value="pengeluaran">Pengeluaran (keluar)</option>
        <option value="lainnya">Lainnya (masuk)</option>
      </select></label></div>
      <div><label>Tanggal<input id="kTanggal" type="date" value="${today}"></label></div>
      <div id="kDriverWrap"><label>Driver<select id="kDriver">${drOpts}</select></label></div>
      <div><label>Jumlah (Rp)<input id="kJumlah" type="number" step="any" placeholder="mis. 50000"></label></div>
      <div class="full"><label>Keterangan<input id="kKet" type="text" placeholder="mis. Setoran kas bulan Oktober"></label></div>
    </div>
    <div class="mbtns">
      <button class="btn ghost" id="kCancel" type="button">Batal</button>
      <button class="btn" id="kSave" type="button">Simpan</button>
    </div>`);
  const jenisSel = $('#kJenis');
  const toggleDriver = () => { $('#kDriverWrap').style.display = jenisSel.value === 'setoran_driver' ? '' : 'none'; };
  jenisSel.addEventListener('change', toggleDriver); toggleDriver();
  $('#kCancel').addEventListener('click', closeModal);
  $('#kSave').addEventListener('click', async () => {
    const jenis = jenisSel.value;
    const tanggal = $('#kTanggal').value || today;
    let jumlah = Number($('#kJumlah').value);
    const keterangan = $('#kKet').value.trim();
    const driver_slug = jenis === 'setoran_driver' ? ($('#kDriver').value || null) : null;
    if (!jumlah || jumlah <= 0) { toast('Jumlah harus lebih dari 0', true); return; }
    if (jenis === 'setoran_driver' && !driver_slug) { toast('Pilih drivernya', true); return; }
    if (jenis === 'pengeluaran') jumlah = -Math.abs(jumlah);
    const r = await sb.from('kas_transaksi').insert({ jenis, tanggal, jumlah, keterangan: keterangan || null, driver_slug });
    if (r.error) { toast(r.error.message, true); return; }
    toast('Tersimpan'); closeModal(); nav('kas');
  });
}
