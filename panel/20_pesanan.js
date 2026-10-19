/* ---------- PESANAN ---------- */
let ORDERS = [];
let STATS = null;
const wibDay = (iso) => { const t = new Date(iso).getTime(); return isNaN(t) ? '' : new Date(t + 7 * 3600000).toISOString().slice(0, 10); };
async function refreshStats() {
  const r = await sb.from('orders').select('status,total,created_at,assigned_driver,driver_slug').order('created_at', { ascending: false }).limit(1000);
  if (r.error) return;
  const rows = r.data || [];
  const hari = wibDay(new Date().toISOString());
  const kemarin = wibDay(new Date(Date.now() - 86400000).toISOString());
  const nilai = (day) => rows.filter((o) => wibDay(o.created_at) === day && PAID_SET.includes(o.status)).reduce((a, o) => a + (Number(o.total) || 0), 0);
  STATS = {
    nilaiHariIni: nilai(hari), nilaiKemarin: nilai(kemarin),
    jumlahHariIni: rows.filter((o) => wibDay(o.created_at) === hari && PAID_SET.includes(o.status)).length,
    lunas: rows.filter((o) => ['paid', 'confirmed', 'completed'].includes(o.status)).length,
    total: rows.length,
    perlu: rows.filter((o) => ['dp_paid', 'paid'].includes(o.status) && !drv(o)).length,
    pending: rows.filter((o) => o.status === 'pending').length
  };
  renderDash(); updateBell();
  try { const se = await sb.auth.getSession(); const em = se.data && se.data.session && se.data.session.user && se.data.session.user.email; if (em) $('#avatar').textContent = em.charAt(0).toUpperCase(); } catch (_e) { /* abaikan */ }
}
function updateBell() { if (STATS) $('#bellDot').hidden = !(STATS.perlu > 0); }
const KI = {
  uang: '<path d="M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-1zM16 14h2"/>',
  ok: '<path d="m4 12 5 5L20 6M2 12l5 5"/>',
  jam: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  dompet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/>'
};
function renderDash() {
  const el = $('#dash'); if (!el || !STATS) return;
  const st = STATS;
  let chip = 'hari ini';
  if (st.nilaiKemarin > 0) { const p = Math.round((st.nilaiHariIni - st.nilaiKemarin) / st.nilaiKemarin * 100); chip = (p >= 0 ? '↗ +' : '↘ ') + p + '%'; }
  else if (st.nilaiHariIni > 0) chip = 'baru';
  const k = (tone, ic, cp, l, v, sub, hot) => `<div class="kpi t-${tone}${hot ? ' hot' : ''}"><div class="top"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true">${KI[ic]}</svg></span><span class="cp">${esc(cp)}</span></div><div class="l">${esc(l)}</div><div class="v">${v}</div><div class="s">${esc(sub)}</div></div>`;
  el.innerHTML =
    k('accent', 'uang', chip, 'Nilai pesanan hari ini', rp(st.nilaiHariIni), `dari ${st.jumlahHariIni} pesanan berbayar`) +
    k('green', 'ok', st.total + ' total', 'Pesanan lunas', st.lunas + ' pesanan', `dari ${st.total} pesanan tercatat`) +
    k('amber', 'jam', st.perlu > 0 ? '⚠ Action' : 'Aman', 'Perlu diproses', st.perlu + ' pesanan', st.perlu > 0 ? 'sudah bayar, belum ada driver' : 'semua sudah punya driver', st.perlu > 0) +
    k('blue', 'dompet', 'belum bayar', 'Menunggu bayar', st.pending + ' pesanan', 'belum dibayar pelanggan');
}
VIEWS.pesanan = async function () {
  $('#view').innerHTML = `
    <div class="pagehead ph-row"><div><h1>Pesanan</h1><p>Pantau pembayaran, driver, dan jadwal trip • ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })}</p></div><button class="btn" id="fCustom" type="button">+ Trip custom</button></div>
    <div class="dash" id="dash"></div>
    <div class="pills" id="pills">${[['', 'Semua'], ['pending', 'Perlu bayar'], ['dp_paid', 'DP'], ['paid', 'Lunas'], ['confirmed', 'Dikonfirmasi'], ['completed', 'Selesai'], ['cancelled', 'Batal']].map(([v, l]) => `<button type="button" class="pill${v === '' ? ' on' : ''}" data-v="${v}">${l}</button>`).join('')}</div>
    <div class="bar">
      <select id="fStatus"><option value="">Semua status</option>${Object.keys(STATUS).map((k) => `<option value="${k}">${STATUS[k]}</option>`).join('')}</select>
      <select id="fSumber"><option value="">Semua sumber</option><option value="direct">Langsung dari web</option><option value="driver">Link/QR driver</option><option value="manual">Trip custom</option></select>
      <input id="fQ" placeholder="Cari nama / order / invoice / WA">
      <button class="btn" id="fGo" type="button">Muat ulang</button>
    </div>
    <div class="card" id="list"></div>`;
  $('#fGo').addEventListener('click', loadOrders);
  $('#fCustom').addEventListener('click', formTripCustom);
  $('#fStatus').addEventListener('change', loadOrders);
  $('#fSumber').addEventListener('change', loadOrders);
  $('#fQ').addEventListener('input', renderOrders);
  $$('#pills .pill').forEach((b) => b.addEventListener('click', () => {
    $('#fStatus').value = b.dataset.v;
    $$('#pills .pill').forEach((x) => x.classList.toggle('on', x === b));
    loadOrders();
  }));
  renderDash();
  refreshStats();
  await loadOrders();
};
async function loadOrders() {
  let q = sb.from('orders').select('*').order('created_at', { ascending: false }).limit(300);
  const st = $('#fStatus').value; if (st) q = q.eq('status', st);
  const so = $('#fSumber').value; if (so) q = q.eq('source', so);
  const { data, error } = await q;
  if (error) { toast(error.message, true); $('#list').innerHTML = `<div class="empty">Gagal memuat: ${esc(error.message)}</div>`; return; }
  ORDERS = data || [];
  renderOrders();
}
function renderOrders() {
  const q = ($('#fQ').value || '').toLowerCase().trim();
  const rows = ORDERS.filter((o) => !q || [o.customer_name, o.order_id, o.invoice_no, o.customer_wa, o.fleet_name].join(' ').toLowerCase().includes(q));
  if (!rows.length) { $('#list').innerHTML = '<div class="empty">Belum ada pesanan.</div>'; return; }
  $('#list').innerHTML = `<div class="tablewrap"><table>
    <thead><tr><th>Dibuat</th><th>Pesanan</th><th>Pelanggan</th><th>Trip</th><th class="num">Total</th><th>Status</th><th>Driver</th></tr></thead>
    <tbody>${rows.map((o) => `<tr class="click" data-id="${esc(o.id)}">
      <td class="small">${esc(waktu(o.created_at))}</td>
      <td><b>${esc(o.invoice_no || '—')}</b><div class="small">${esc(o.order_id)}</div></td>
      <td>${esc(o.customer_name)}<div class="small">${esc(o.customer_wa)}</div></td>
      <td>${esc(tglPendek(o.trip_date))} ${esc(o.trip_time || '')}<div class="small">${esc(o.fleet_name || '')}</div></td>
      <td class="num">${rp(o.total)}</td>
      <td>${badge(o.status)}<div class="small">${o.source === 'driver' ? 'Link driver' : o.source === 'manual' ? 'Trip custom' : 'Langsung'}</div></td>
      <td>${esc(driverName(drv(o)))}</td></tr>`).join('')}</tbody></table></div>`;
  $$('#list tr.click').forEach((tr) => tr.addEventListener('click', () => openOrder(tr.dataset.id)));
}

/* ---------- TRIP CUSTOM (pesanan manual, rute bebas) ---------- */
function formTripCustom() {
  const drOpts = '<option value="">— pilih driver —</option>' + S.drivers.filter((d) => d.is_active !== false)
    .map((d) => `<option value="${esc(d.slug)}" data-plat="${esc(d.plate || '')}">${esc(d.name)} (${esc(d.slug)})</option>`).join('');
  const hariIni = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
  openModal(`
    <h2>Trip custom</h2>
    <p class="small">Rute bebas. Setelah disimpan dan berstatus bayar + ada driver, invoice dan surat jalan (QR verifikasi) terbit otomatis seperti pesanan biasa.</p>
    <div class="row2"><label>Nama pelanggan<input id="tcNama"></label><label>WhatsApp pelanggan<input id="tcWa" inputmode="tel"></label></div>
    <div class="row2"><label>Tanggal trip<input id="tcTgl" type="date" value="${hariIni}"></label><label>Jam<input id="tcJam" placeholder="08.00"></label><label>Peserta<input id="tcPax" type="number" min="1" value="1"></label></div>
    <label>Titik jemput<input id="tcJemput" placeholder="mis. Stasiun Cimahi"></label>
    <label>Rute / tujuan (satu pemberhentian per baris, berurutan)<textarea id="tcRute" rows="3" placeholder="Stasiun Cimahi&#10;Resort Raisa Space, Cianjur"></textarea></label>
    <label>Catatan (muncul di invoice &amp; surat jalan)<input id="tcCat" placeholder="mis. Belum termasuk tol dan parkir"></label>
    <label>Nama layanan / armada<input id="tcArmada" value="Trip custom"></label>
    <label>Nomor invoice (kosongkan = otomatis)<input id="tcInv" placeholder="mis. INV-2610-0137" autocomplete="off"></label>
    <div class="row2"><label>Harga (Rp)<input id="tcHarga" type="number" min="0" inputmode="numeric"></label><label>Diskon (Rp)<input id="tcDisk" type="number" min="0" value="0"></label><label>Potongan admin (Rp)<input id="tcCut" type="number" min="0" value="0"></label></div>
    <div class="row2"><label>Status pembayaran<select id="tcSt"><option value="paid">Lunas</option><option value="dp_paid">DP diterima (sisa tunai ke driver)</option><option value="pending">Belum bayar</option></select></label><label id="tcDpW" hidden>Jumlah DP (Rp)<input id="tcDp" type="number" min="0" inputmode="numeric"></label></div>
    <div class="row2"><label>Driver bertugas<select id="tcDriver">${drOpts}</select></label><label>Plat (kosongkan = plat driver)<input id="tcPlat"></label></div>
    <div class="mbtns" style="justify-content:flex-start"><button class="btn" id="tcSimpan" type="button">Simpan trip</button><button class="btn ghost" id="tcBatal" type="button">Batal</button></div>`);
  $('#tcBatal').addEventListener('click', closeModal);
  $('#tcSt').addEventListener('change', () => { $('#tcDpW').hidden = $('#tcSt').value !== 'dp_paid'; });
  $('#tcSimpan').addEventListener('click', async () => {
    const nama = $('#tcNama').value.trim(), wa = normWA($('#tcWa').value);
    const rute = $('#tcRute').value.split('\n').map((x) => x.trim()).filter(Boolean);
    const harga = Math.max(0, Math.round(Number($('#tcHarga').value) || 0));
    const disk = Math.max(0, Math.round(Number($('#tcDisk').value) || 0));
    const cut = Math.max(0, Math.round(Number($('#tcCut').value) || 0));
    const st = $('#tcSt').value, drv0 = $('#tcDriver').value || null;
    const total = harga - disk;
    if (!nama || !wa) { toast('Nama dan WhatsApp pelanggan wajib diisi', true); return; }
    if (!$('#tcTgl').value) { toast('Tanggal trip wajib diisi', true); return; }
    if (!rute.length) { toast('Isi rute / tujuan', true); return; }
    if (harga <= 0 || total <= 0) { toast('Harga belum benar', true); return; }
    if (cut > total) { toast('Potongan admin melebihi total', true); return; }
    if (PAID_SET.includes(st) && !drv0) { toast('Pilih driver supaya surat jalan terbit', true); return; }
    let noInv = $('#tcInv').value.trim().toUpperCase();
    if (noInv && !/^INV-\d{4}-\d{3,5}$/.test(noInv)) { toast('Format nomor invoice: INV-2610-0137', true); return; }
    if (noInv) {
      const ada = await sb.from('orders').select('id').eq('invoice_no', noInv).limit(1);
      if (ada.error) { toast(ada.error.message, true); return; }
      if (ada.data && ada.data.length) { toast('Nomor invoice ' + noInv + ' sudah dipakai pesanan lain', true); return; }
    }
    const dp = st === 'dp_paid' ? Math.round(Number($('#tcDp').value) || 0) : 0;
    if (st === 'dp_paid' && (dp <= 0 || dp >= total)) { toast('Jumlah DP harus di antara 0 dan total', true); return; }
    const destinations = { custom: rute };
    const cat = $('#tcCat').value.trim(); if (cat) destinations.catatan = [cat];
    const row = {
      order_id: 'MAN-' + Date.now(), source: 'manual', product_type: 'rental', status: st,
      customer_name: nama, customer_wa: wa, fleet_name: $('#tcArmada').value.trim() || 'Trip custom',
      trip_date: $('#tcTgl').value, trip_time: $('#tcJam').value.trim() || null, pax: Math.max(1, Math.round(Number($('#tcPax').value) || 1)),
      pickup_note: $('#tcJemput').value.trim() || null, regions: [], destinations,
      base_price: harga, cross_cost: 0, discount: disk, total,
      admin_cut_type: 'flat', admin_cut_value: cut, admin_cut_amount: cut, driver_earning: total - cut,
      assigned_driver: drv0, driver_slug: drv0, vehicle_plate: $('#tcPlat').value.trim() || null,
      payment_type: 'manual', midtrans_status: 'manual',
      ...(noInv ? { invoice_no: noInv } : {}),
      payment_mode: st === 'dp_paid' ? 'dp' : 'lunas', dp_amount: st === 'dp_paid' ? dp : null,
    };
    $('#tcSimpan').disabled = true;
    const r = await sb.from('orders').insert(row).select('id').single();
    if (r.error) { $('#tcSimpan').disabled = false; toast(r.error.message, true); return; }
    toast('Trip custom disimpan'); closeModal(); await loadOrders(); openOrder(r.data.id);
  });
}
function driverMsg(o, d, sjLink) {
  const dpInfo = o.payment_mode === 'dp'
    ? `\n\n💰 Pesanan ini DP (baru bayar ${rp(o.dp_amount)}).\nTagih TUNAI ke pelanggan: ${rp(Math.max(0, Number(o.total) - Number(o.dp_amount || 0)))}\nSisa akan ditransfer admin: ${rp(Math.max(0, Number(o.dp_amount || 0) - Number(o.admin_cut_amount || 0)))}`
    : '';
  return `Halo ${d.name}, ada trip untukmu.\n\nOrder: ${o.order_id}\nPelanggan: ${o.customer_name} (${o.customer_wa})\nArmada: ${o.fleet_name || '-'}\nTanggal: ${tglPendek(o.trip_date)}, jam ${o.trip_time || '-'}\nPeserta: ${o.pax || '-'} orang\nTitik jemput: ${o.pickup_note || '-'}\n\nDestinasi:\n${destText(o)}\n\nPendapatanmu: ${rp(o.driver_earning)}${dpInfo}${sjLink ? `\n\nSurat jalan: ${sjLink}` : ''}`;
}
async function openOrder(id) {
  const o = ORDERS.find((x) => x.id === id); if (!o) return;
  const cur = drv(o);
  const stOpts = Object.keys(STATUS).map((k) => `<option value="${k}" ${k === o.status ? 'selected' : ''}>${STATUS[k]}</option>`).join('');
  const drOpts = '<option value="">— belum ditentukan —</option>' + S.drivers.filter((d) => d.is_active !== false || d.slug === cur)
    .map((d) => `<option value="${esc(d.slug)}" ${d.slug === cur ? 'selected' : ''}>${esc(d.name)} (${esc(d.slug)})</option>`).join('');
  const invLink = (S.siteUrl && o.invoice_token && PAID_SET.includes(o.status)) ? `${S.siteUrl}/invoice.html?t=${o.invoice_token}` : '';
  const sjLink = (S.siteUrl && o.sj_no && o.sj_token) ? `${S.siteUrl}/surat-jalan.html?t=${o.sj_token}` : '';
  const dObj = S.drivers.find((d) => d.slug === cur);
  const waDriver = (dObj && dObj.phone) ? `https://wa.me/${normWA(dObj.phone)}?text=${encodeURIComponent(driverMsg(o, dObj, sjLink))}` : '';

  // cek apakah data pesanan sudah berbeda dari surat jalan yang terbit (perlu revisi)
  let sjChanged = false;
  if (o.sj_no) {
    const r = await sb.rpc('sj_changed', { p_order: o.id });
    sjChanged = r.data === true;
  }
  const sjInfo = o.sj_no
    ? `${esc(o.sj_no)} · Rev ${esc(o.sj_rev)}${sjChanged ? ' <span class="badge b-pending">Data berubah, perlu revisi</span>' : ''}`
    : '<span class="small">Belum terbit — perlu status DP Diterima/Lunas &amp; driver bertugas</span>';

  openModal(`
    <h2>${esc(o.invoice_no || o.order_id)} ${badge(o.status)}</h2>
    <dl class="det">
      <dt>Order</dt><dd>${esc(o.order_id)}</dd>
      <dt>Pelanggan</dt><dd>${esc(o.customer_name)} · <a href="https://wa.me/${esc(normWA(o.customer_wa))}" target="_blank" rel="noopener">${esc(o.customer_wa)}</a></dd>
      <dt>Armada</dt><dd>${esc(o.fleet_name || '-')}</dd>
      <dt>Jadwal</dt><dd>${esc(tglPendek(o.trip_date))}, jam ${esc(o.trip_time || '-')} · ${esc(o.pax || '-')} peserta</dd>
      <dt>Titik jemput</dt><dd>${esc(o.pickup_note || '-')}</dd>
      <dt>Destinasi</dt><dd style="white-space:pre-line">${esc(destText(o))}</dd>
      <dt>Biaya</dt><dd>Armada ${rp(o.base_price)}${Number(o.cross_cost) > 0 ? ` + lintas ${rp(o.cross_cost)}` : ''}${Number(o.discount) > 0 ? ` − diskon ${rp(o.discount)}` : ''} = <b>${rp(o.total)}</b></dd>
      ${o.payment_mode === 'dp' ? `<dt>DP</dt><dd>Diterima ${rp(o.dp_amount)}${o.dp_percent_applied ? ` (${o.dp_percent_applied}%)` : ''} lewat Midtrans.<br>
        Tunai ditagih ke pelanggan: <b>${rp(Math.max(0, Number(o.total) - Number(o.dp_amount || 0)))}</b><br>
        Sisa transfer admin ke driver dari DP: <b>${rp(Math.max(0, Number(o.dp_amount || 0) - Number(o.admin_cut_amount || 0)))}</b></dd>` : ''}
      <dt>Potongan admin</dt><dd>${rp(o.admin_cut_amount)} (${esc(o.admin_cut_value)}${o.admin_cut_type === 'flat' ? ' Rp' : '%'})</dd>
      <dt>Pendapatan driver</dt><dd>${rp(o.driver_earning)}</dd>
      <dt>Sumber</dt><dd>${o.source === 'driver' ? 'Link/QR driver: ' + esc(driverName(o.driver_slug)) : o.source === 'manual' ? 'Trip custom (dibuat admin)' : 'Langsung dari web'}</dd>
      <dt>Pembayaran</dt><dd>${esc(o.midtrans_status || '-')} · ${esc(o.payment_type || '-')} · ${esc(waktu(o.paid_at))}</dd>
      <dt>Invoice dikirim</dt><dd>${esc(waktu(o.invoice_sent_at))}</dd>
      <dt>Surat jalan</dt><dd>${sjInfo}</dd>
    </dl>
    <div class="act">
      <div class="row2"><label>Status<select id="oStatus">${stOpts}</select></label><button class="btn" id="oSaveStatus" type="button">Simpan status</button></div>
      <div class="row2"><label>Driver bertugas<select id="oDriver">${drOpts}</select></label><button class="btn" id="oSaveDriver" type="button">Simpan driver</button></div>
      <div class="mbtns" style="justify-content:flex-start">
        ${invLink ? `<button class="btn ghost sm" type="button" data-copy="${esc(invLink)}">Salin link invoice</button><a class="btn ghost sm" href="${esc(invLink)}" target="_blank" rel="noopener" style="text-decoration:none">Buka invoice</a>` : ''}
        ${invLink ? `<button class="btn sm" type="button" id="oKirimInv">Kirim invoice ke pelanggan (WA)</button>` : ''}
        ${sjLink ? `<button class="btn ghost sm" type="button" data-copy="${esc(sjLink)}">Salin link surat</button><a class="btn ghost sm" href="${esc(sjLink)}" target="_blank" rel="noopener" style="text-decoration:none">Buka surat jalan</a>` : ''}
        ${sjChanged ? `<button class="btn sm" type="button" id="oRevisi">Terbitkan revisi</button>` : ''}
        ${waDriver ? `<a class="btn ghost sm" href="${esc(waDriver)}" target="_blank" rel="noopener" style="text-decoration:none">Kirim detail ke driver (WA)</a>` : ''}
        <button class="btn ghost sm" type="button" id="oClose">Tutup</button>
      </div>
    </div>`);
  $('#oClose').addEventListener('click', closeModal);
  $('#oSaveStatus').addEventListener('click', async () => {
    const st = $('#oStatus').value;
    if (st === o.status) { toast('Status tidak berubah'); return; }
    if ((st === 'cancelled' || st === 'expired') && PAID_SET.includes(o.status) &&
        !confirm('Pesanan ini sudah LUNAS. Mengubahnya menjadi batal TIDAK mengembalikan uang pelanggan (lakukan refund manual di dashboard Midtrans). Lanjutkan?')) return;
    const r = await sb.from('orders').update({ status: st }).eq('id', o.id);
    if (r.error) { toast(r.error.message, true); return; }
    toast('Status disimpan'); closeModal(); loadOrders();
  });
  $('#oSaveDriver').addEventListener('click', async () => {
    const v = $('#oDriver').value || null;
    const r = await sb.from('orders').update({ assigned_driver: v }).eq('id', o.id);
    if (r.error) { toast(r.error.message, true); return; }
    toast('Driver disimpan'); closeModal(); loadOrders();
  });
  if ($('#oKirimInv')) $('#oKirimInv').addEventListener('click', async () => {
    const ulang = o.invoice_sent_at ? ' Invoice ini sudah pernah dikirim, kirim lagi?' : '';
    if (!confirm(`Kirim link invoice${o.sj_no ? ' dan surat jalan' : ''} ke WhatsApp ${o.customer_name} (${o.customer_wa}) lewat sistem Tempera?${ulang}`)) return;
    const btn = $('#oKirimInv'); btn.disabled = true; btn.textContent = 'Mengirim…';
    const ses = await sb.auth.getSession(); const tok = ses.data && ses.data.session && ses.data.session.access_token;
    const r = await fetch(`${SB_URL}/functions/v1/kirim-invoice`, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SB_KEY, Authorization: `Bearer ${tok}` }, body: JSON.stringify({ id: o.id }) });
    const j = await r.json().catch(() => ({ ok: false, error: 'Balasan tidak terbaca' }));
    if (!j.ok) { btn.disabled = false; btn.textContent = 'Kirim invoice ke pelanggan (WA)'; toast(j.error || 'Gagal mengirim', true); return; }
    toast('Invoice terkirim ke WhatsApp pelanggan'); loadOrders();
  });
  if ($('#oRevisi')) $('#oRevisi').addEventListener('click', async () => {
    if (!confirm(`Terbitkan revisi baru surat jalan ${o.sj_no} dengan data pesanan saat ini? Revisi sebelumnya tidak berlaku lagi.`)) return;
    const r = await sb.rpc('issue_sj_revision', { p_order: o.id });
    if (r.error) { toast(r.error.message, true); return; }
    o.sj_rev = r.data.sj_rev;
    toast('Revisi diterbitkan. Link surat tidak berubah — cukup kirim ke driver bila ia belum pernah menerimanya.');
    loadOrders();       // sinkron daftar di belakang layar
    openOrder(o.id);    // buka ulang jendela yang sama, dengan tombol WA siap ditekan
  });
}
