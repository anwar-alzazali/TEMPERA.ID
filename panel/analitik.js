/* ===== BLOK 133: tab ANALITIK di panel (dimuat sebagai berkas terpisah, SETELAH skrip utama panel) =====
   Hanya MEMBACA data yang sudah ada. Bagian yang datanya belum ada ditandai "belum tersedia". */
(function () {
  'use strict';
  const PAID = ['dp_paid', 'paid', 'confirmed', 'completed'];
  const HARI = 86400000;
  const sum = (a, k) => a.reduce((s, x) => s + (Number(x[k]) || 0), 0);
  const wib = (iso) => new Date(new Date(iso).getTime() + 7 * 3600000).toISOString().slice(0, 10);
  const ringkas = (v) => (v >= 1e6 ? (v / 1e6).toFixed(1).replace('.', ',') + ' jt' : v >= 1e3 ? Math.round(v / 1e3) + ' rb' : String(Math.round(v)));
  const persen = (a, b) => (b > 0 ? (100 * a / b).toFixed(1).replace('.', ',') + '%' : '-');
  const delta = (a, b) => (b > 0 ? ((a - b) / b * 100 >= 0 ? '+' : '') + ((a - b) / b * 100).toFixed(0) + '% dari periode lalu' : 'periode lalu: belum ada data');
  const NA = '<span class="small">belum tersedia</span>';
  let PER = '30';

  function rentang(per) {
    const now = Date.now(); let start = 0;
    if (per === '7') start = now - 7 * HARI; else if (per === '30') start = now - 30 * HARI;
    else if (per === 'bulan') { const d = new Date(now + 7 * 3600000); start = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) - 7 * 3600000; }
    const len = per === 'semua' ? 0 : now - start;
    return { start: new Date(start).toISOString(), prev: per === 'semua' ? null : new Date(start - len).toISOString() };
  }
  const coba = async (fn, cadangan) => { try { return await fn(); } catch (e) { console.warn('analitik:', e); return cadangan; } };
  const baris = async (q) => { const r = await q; if (r.error) throw new Error(r.error.message); return r.data || []; };
  const hitung = async (q) => { const r = await q; if (r.error) throw new Error(r.error.message); return r.count || 0; };

  async function muat(per) {
    const r = rentang(per), hariIni = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
    const [paid, dibuat, prev, funnel, armada, heat, recent] = await Promise.all([
      coba(() => baris(sb.from('orders').select('*').in('status', PAID).gte('paid_at', r.start).limit(3000)), []),
      coba(() => baris(sb.from('orders').select('*').gte('created_at', r.start).limit(3000)), []),
      coba(() => (r.prev ? baris(sb.from('orders').select('total,paid_at').in('status', PAID).gte('paid_at', r.prev).lt('paid_at', r.start).limit(3000)) : []), []),
      coba(() => baris(sb.from('v_funnel').select('*')), null),
      coba(() => baris(sb.from('fleet').select('id,short_name,sort_order').eq('is_active', true).order('sort_order')), []),
      coba(() => baris(sb.rpc('admin_ketersediaan', { p_dari: hariIni, p_hari: 14 })), null),
      coba(() => baris(sb.from('orders').select('*').order('created_at', { ascending: false }).limit(8)), [])]);
    const [inbox, balasan, perluAdmin, manualMenunggu, waGagal, ulasanMenunggu, pembayaran] = await Promise.all([
      coba(() => baris(sb.from('wa_inbox').select('sender,jenis,created_at').gte('created_at', r.start).limit(5000)), null),
      coba(() => baris(sb.from('wa_ai_balasan').select('nomor,message,diserahkan,token_in,token_out').gte('created_at', r.start).limit(5000)), null),
      coba(() => hitung(sb.from('wa_ai_sesi').select('nomor', { count: 'exact', head: true }).gt('diam_sampai', new Date().toISOString())), null),
      coba(() => hitung(sb.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending').eq('midtrans_status', 'manual')), null),
      coba(() => hitung(sb.from('wa_log').select('id', { count: 'exact', head: true }).eq('ok', false).is('resolved_at', null)), null),
      coba(() => hitung(sb.from('ulasan').select('id', { count: 'exact', head: true }).eq('status', 'menunggu')), null),
      coba(() => baris(sb.from('app_settings').select('value').eq('key', 'payment_gateway').limit(1)), null)]);
    return { r, paid, dibuat, prev, funnel, armada, heat, recent, inbox, balasan, perluAdmin, manualMenunggu, waGagal, ulasanMenunggu, pembayaran };
  }

  const kartu = (judul, isi, lebar) => `<section class="card" style="flex:${lebar || '1 1 300px'};min-width:0"><h2 style="font-size:15px;margin:0 0 10px">${esc(judul)}</h2>${isi}</section>`;
  const stat = (l, v, sub) => `<div class="stat"><div class="l">${esc(l)}</div><div class="v">${v}</div>${sub ? `<div class="small">${sub}</div>` : ''}</div>`;
  const batang = (label, nilai, maks, warna, teks) => `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600"><span>${esc(label)}</span><b>${esc(teks == null ? nilai : teks)}</b></div><div style="height:10px;border-radius:5px;background:var(--line);margin-top:4px"><div style="width:${maks > 0 ? Math.max(2, Math.round(100 * nilai / maks)) : 0}%;height:10px;border-radius:5px;background:${warna || 'var(--accent)'}"></div></div></div>`;

  function grafik(paid) {
    if (!paid.length) return '<div class="empty">Belum ada pesanan terbayar pada periode ini.</div>';
    const per = {}; paid.forEach((o) => { const d = wib(o.paid_at); const x = (per[d] = per[d] || { omzet: 0, n: 0 }); x.omzet += Number(o.total) || 0; x.n++; });
    const hari = Object.keys(per).sort();
    const maksO = Math.max(...hari.map((d) => per[d].omzet)), maksN = Math.max(...hari.map((d) => per[d].n));
    const X = (i) => (hari.length === 1 ? 336 : 56 + (560 * i) / (hari.length - 1));
    const yO = (v) => 200 - (150 * v) / (maksO || 1), yN = (v) => 200 - (150 * v) / (maksN || 1);
    const gO = hari.map((d, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${yO(per[d].omzet).toFixed(1)}`).join(' ');
    const gN = hari.map((d, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${yN(per[d].n).toFixed(1)}`).join(' ');
    const tgl = (d) => d.slice(8) + '/' + d.slice(5, 7);
    const label = [0, Math.floor((hari.length - 1) / 2), hari.length - 1].filter((v, i, a) => a.indexOf(v) === i);
    return `<svg viewBox="0 0 640 240" role="img" aria-label="Grafik omzet dan jumlah pesanan per hari" style="width:100%;height:auto;display:block">
      <g stroke="#e2e8f0">${[20, 80, 140, 200].map((y) => `<line x1="56" y1="${y}" x2="630" y2="${y}"/>`).join('')}</g>
      <g fill="#64748b" font-size="11" text-anchor="end"><text x="48" y="24">${ringkas(maksO)}</text><text x="48" y="84">${ringkas(maksO * 2 / 3)}</text><text x="48" y="144">${ringkas(maksO / 3)}</text><text x="48" y="204">0</text></g>
      <path d="${gO} L${X(hari.length - 1).toFixed(1)},200 L${X(0).toFixed(1)},200 Z" fill="#0891b2" fill-opacity=".12"/>
      <path d="${gO}" fill="none" stroke="#0891b2" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="${gN}" fill="none" stroke="#d97706" stroke-width="2" stroke-dasharray="5 4"/>
      <g fill="#64748b" font-size="11" text-anchor="middle">${label.map((i) => `<text x="${X(i).toFixed(1)}" y="224">${tgl(hari[i])}</text>`).join('')}</g></svg>
      <div class="small" style="margin-top:6px"><b style="color:#0891b2">━</b> omzet (maks ${rp(maksO)}) &nbsp; <b style="color:#d97706">╍</b> jumlah pesanan (maks ${maksN})</div>`;
  }

  function wilayah(dibuat) {
    const nama = { lembang: 'Lembang', dago: 'Kota Bandung & Dago', ciwidey: 'Ciwidey', pangalengan: 'Pangalengan' };
    const c = { lembang: 0, dago: 0, ciwidey: 0, pangalengan: 0, lintas: 0 };
    dibuat.forEach((o) => { const d = o.destinations || {}; const ada = Object.keys(nama).filter((k) => Array.isArray(d[k]) && d[k].length);
      ada.forEach((k) => { c[k]++; }); if (['lembang', 'ciwidey', 'pangalengan'].filter((k) => ada.includes(k)).length >= 2) c.lintas++; });
    const maks = Math.max(...Object.values(c), 0);
    return Object.keys(nama).map((k) => batang(nama[k], c[k], maks)).join('') + batang('Gabungan wilayah (biaya lintas)', c.lintas, maks, '#d97706');
  }

  function peringkat(paid, dibuat, funnel) {
    const m = {}; const baru = (s) => (m[s] = m[s] || { dibuat: 0, closing: 0, omzet: 0 });
    dibuat.forEach((o) => { if (o.driver_slug) baru(o.driver_slug).dibuat++; });
    paid.forEach((o) => { if (o.driver_slug) { const x = baru(o.driver_slug); x.closing++; x.omzet += Number(o.total) || 0; } });
    const f = {}; (funnel || []).forEach((x) => { f[x.sumber] = x; });
    const rows = Object.keys(m).sort((a, b) => m[b].omzet - m[a].omzet || m[b].closing - m[a].closing).slice(0, 10);
    if (!rows.length) return '<div class="empty">Belum ada pesanan lewat link atau QR driver pada periode ini.</div>';
    return `<div class="tablewrap"><table style="min-width:560px"><thead><tr><th>Pembawa</th><th class="num">Scan QR*</th><th class="num">Klik link*</th><th class="num">Dibuat</th><th class="num">Terbayar</th><th class="num">Omzet</th></tr></thead><tbody>
      ${rows.map((s) => `<tr><td><b>${esc(driverName(s))}</b> <span class="small">${esc(s)}</span></td><td class="num">${f[s] ? esc(f[s].scan) : '-'}</td><td class="num">${f[s] ? esc(f[s].visit) : '-'}</td><td class="num">${m[s].dibuat}</td><td class="num"><b>${m[s].closing}</b></td><td class="num">${rp(m[s].omzet)}</td></tr>`).join('')}</tbody></table></div>
      <div class="help" style="margin-top:6px">* Scan dan klik dihitung dari semua waktu (belum bisa difilter periode). Komisi sales: belum tersedia (fitur belum dibangun).</div>`;
  }

  function peta(armada, heat) {
    if (!heat || !armada.length) return '<div class="empty">Data ketersediaan belum bisa dimuat.</div>';
    const warna = ['#e2e8f0', '#7dd3e8', '#0e7490', '#475569'];
    const hari = [...new Set(heat.map((x) => x.tanggal))].sort();
    const kelas = (x) => (!x ? 0 : x.ditutup ? 3 : (x.unit != null && x.terpakai >= x.unit) ? 2 : x.terpakai > 0 ? 1 : 0);
    return `<div style="overflow-x:auto"><div style="min-width:520px">${armada.map((f) => `<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px"><div style="flex:0 0 110px;font-size:12px;font-weight:700">${esc(f.short_name)}</div>
      <div style="flex:1;display:grid;grid-template-columns:repeat(${hari.length},minmax(0,1fr));gap:3px">${hari.map((d) => { const x = heat.find((y) => y.tanggal === d && y.fleet_id === f.id); return `<div title="${esc(tglPendek(d))}" style="height:26px;border-radius:5px;background:${warna[kelas(x)]}"></div>`; }).join('')}</div></div>`).join('')}</div></div>
      <div class="small" style="margin-top:6px">Abu = kosong · biru muda = sebagian · biru tua = penuh · gelap = ditutup. Tanggal ${esc(tglPendek(hari[0]))} sampai ${esc(tglPendek(hari[hari.length - 1]))}.</div>`;
  }

  function chat(inbox, balasan, perluAdmin) {
    if (!inbox) return NA;
    const pel = new Set(inbox.filter((x) => x.jenis !== 'driver').map((x) => x.sender));
    const ai = balasan ? new Set(balasan.filter((x) => !String(x.message || '').startsWith('[Admin Tempera]')).map((x) => x.nomor)) : null;
    const adm = balasan ? new Set(balasan.filter((x) => String(x.message || '').startsWith('[Admin Tempera]')).map((x) => x.nomor)) : null;
    const serah = balasan ? new Set(balasan.filter((x) => x.diserahkan).map((x) => x.nomor)) : null;
    const tok = balasan ? sum(balasan, 'token_in') + sum(balasan, 'token_out') : 0;
    return `<div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr));margin:0">${stat('Nomor yang chat', pel.size)}${stat('Dilayani AI', ai ? ai.size : NA)}
      ${stat('Diserahkan ke admin', serah ? `${serah.size} <span class="small">(${persen(serah.size, ai ? ai.size : 0)})</span>` : NA)}${stat('Admin ikut membalas', adm ? adm.size : NA)}</div>
      <div class="small" style="margin-top:8px">Token AI pada periode ini: ${tok.toLocaleString('id-ID')}. Waktu balas rata-rata: belum tersedia.</div>`;
  }

  function tindakan(d) {
    const b = (l, n, w) => `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;min-height:40px;border-bottom:1px solid var(--line)"><span>${esc(l)}</span>${n == null ? NA : `<span class="badge ${n > 0 ? w : ''}">${n}</span>`}</div>`;
    return b('Pesanan manual menunggu bayar', d.manualMenunggu, 'b-pending') + b('Pelanggan menunggu admin (AI diam)', d.perluAdmin, 'b-cancelled') + b('WA gagal terkirim', d.waGagal, 'b-cancelled')
      + b('Ulasan menunggu diperiksa', d.ulasanMenunggu, 'b-confirmed') + `<div style="display:flex;justify-content:space-between;min-height:40px;align-items:center"><span>Mobil driver menunggu persetujuan</span>${NA}</div>`;
  }
  function kesehatan(d) {
    const gw = d.pembayaran && d.pembayaran[0] ? d.pembayaran[0].value : null;
    return `<div style="display:flex;justify-content:space-between;align-items:center;min-height:40px;border-bottom:1px solid var(--line)"><span>Pembayaran aktif</span><b>${gw ? esc(gw) : '-'}</b></div>
      <div style="display:flex;justify-content:space-between;align-items:center;min-height:40px;border-bottom:1px solid var(--line)"><span>Kredit API Claude</span><a href="https://console.anthropic.com/" target="_blank" rel="noopener">cek di Console</a></div>
      <div style="display:flex;justify-content:space-between;align-items:center;min-height:40px;border-bottom:1px solid var(--line)"><span>Kuota &amp; masa aktif Fonnte</span><a href="https://md.fonnte.com/" target="_blank" rel="noopener">cek di Fonnte</a></div>
      <div style="display:flex;justify-content:space-between;align-items:center;min-height:40px"><span>Cadangan terakhir</span>${NA}</div>`;
  }

  /* ---- bagian dari tab Laporan lama (digabung) ---- */
  function rincianPembawa(paid) {
    const m = {};
    paid.forEach((o) => { const k = earner(o) || '(belum ditentukan)'; const x = (m[k] = m[k] || { n: 0, omzet: 0, hasil: 0 }); x.n++; x.omzet += Number(o.total) || 0; x.hasil += Number(o.driver_earning) || 0; });
    const ks = Object.keys(m).sort((a, b) => m[b].omzet - m[a].omzet);
    if (!ks.length) return '<div class="empty">Belum ada data pada periode ini.</div>';
    return `<div class="tablewrap"><table><thead><tr><th>Pembawa pesanan</th><th class="num">Trip</th><th class="num">Omzet</th><th class="num">Pendapatan</th></tr></thead><tbody>
      ${ks.map((k) => `<tr><td>${esc(k === '(belum ditentukan)' ? k : driverName(k))}</td><td class="num">${m[k].n}</td><td class="num">${rp(m[k].omzet)}</td><td class="num">${rp(m[k].hasil)}</td></tr>`).join('')}</tbody></table></div>
      <div class="help" style="margin-top:8px">Pendapatan dicatat untuk yang membawa pesanan (pemilik link/QR). Bila driver itu melemparkan trip ke orang lain, pendapatan tetap di sini.</div>`;
  }
  function rincianSumber(funnel) {
    if (!funnel || !funnel.length) return '<div class="empty">Belum ada data.</div>';
    return `<div class="tablewrap"><table><thead><tr><th>Sumber</th><th class="num">Visit</th><th class="num">Scan</th><th class="num">Order dibuat</th><th class="num">Closing</th><th class="num">Omzet</th></tr></thead><tbody>
      ${funnel.map((x) => `<tr><td>${esc(x.sumber === 'direct' ? 'Langsung dari web' : driverName(x.sumber))}</td><td class="num">${esc(x.visit)}</td><td class="num">${esc(x.scan)}</td><td class="num">${esc(x.order_dibuat)}</td><td class="num">${esc(x.closing)}</td><td class="num">${rp(x.omzet)}</td></tr>`).join('')}</tbody></table></div>
      <div class="help" style="margin-top:8px">Visit = hanya berkunjung. Scan = lewat link/QR driver. Closing = pesanan yang sudah dibayar.</div>`;
  }

  VIEWS.analitik = async function () {
    $('#view').innerHTML = `<div class="bar" style="justify-content:space-between;align-items:center"><h2 style="margin:0">Analitik &amp; Laporan</h2>
      <select id="anPer" style="width:auto"><option value="7">7 hari terakhir</option><option value="30">30 hari terakhir</option><option value="bulan">Bulan ini</option><option value="semua">Semua waktu</option></select></div><div id="anIsi"><div class="empty">Memuat…</div></div>`;
    $('#anPer').value = PER; $('#anPer').addEventListener('change', (e) => { PER = e.target.value; VIEWS.analitik(); });
    const d = await muat(PER);
    const omzet = sum(d.paid, 'total'), omzetLalu = sum(d.prev, 'total');
    const aWilayah = d.dibuat.length;
    const f = d.funnel || []; const visit = sum(f, 'visit'), scan = sum(f, 'scan');
    const fl = [['Kunjungan (semua waktu)', visit], ['Lewat link atau QR driver', scan], ['Pesanan dibuat (periode ini)', d.dibuat.length], ['Terbayar (periode ini)', d.paid.length]];
    const fm = Math.max(...fl.map((x) => x[1]), 1);
    const langsung = d.dibuat.filter((o) => o.source !== 'driver').length, lewatDriver = d.dibuat.length - langsung;
    const adm = sum(d.paid, 'admin_cut_amount'), pel = sum(d.paid, 'driver_earning');
    $('#anIsi').innerHTML = `
      <div class="stats">${stat('Omzet', rp(omzet), esc(delta(omzet, omzetLalu)))}${stat('Pesanan terbayar', d.paid.length, esc(delta(d.paid.length, d.prev.length)))}
        ${stat('Rata-rata nilai pesanan', d.paid.length ? rp(omzet / d.paid.length) : '-')}${stat('Dibuat jadi terbayar', persen(d.paid.length, aWilayah), `dari ${aWilayah} pesanan dibuat`)}
        ${stat('Potongan admin', rp(adm), 'sebelum biaya gateway (belum dicatat)')}${stat('Pendapatan driver', rp(pel), 'bagian pelaksana trip')}${stat('Komisi sales', NA)}</div>
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px">${kartu('Omzet dan jumlah pesanan per hari', grafik(d.paid), '2 1 460px')}
        ${kartu('Corong', fl.map((x, i) => batang(x[0], x[1], fm, ['#0e7490', '#0891b2', '#22a7c6', '#b45309'][i])).join('') + '<div class="small">Pesanan lewat WA pribadi driver tidak tercatat.</div>')}</div>
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px">${kartu('Pesanan per wilayah (dibuat)', wilayah(d.dibuat))}
        ${kartu('Sumber pesanan (dibuat)', batang('Langsung dari situs', langsung, Math.max(langsung, lewatDriver)) + batang('Link atau QR driver', lewatDriver, Math.max(langsung, lewatDriver), '#6366f1') + '<div class="small">Chat WA: belum tercatat sebagai sumber.</div>')}
        ${kartu('Pembagian uang (terbayar)', batang('Pelaksana', pel, omzet, '#0e7490', rp(pel)) + batang('Admin (sebelum biaya gateway)', adm, omzet, '#d97706', rp(adm)) + '<div class="small">Komisi sales dan biaya gateway: belum dicatat.</div>')}</div>
      ${kartu('Pemakaian armada, 14 hari ke depan', peta(d.armada, d.heat), '1 1 100%')}
      <div style="height:12px"></div>${kartu('Papan peringkat pembawa pesanan', peringkat(d.paid, d.dibuat, d.funnel), '1 1 100%')}
      <div style="height:12px"></div>${kartu('Pendapatan per pembawa pesanan', rincianPembawa(d.paid), '1 1 100%')}
      <div style="height:12px"></div>${kartu('Kunjungan sampai terbayar per sumber (semua waktu)', rincianSumber(d.funnel), '1 1 100%')}
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin:12px 0">${kartu('Chat WhatsApp dan AI', chat(d.inbox, d.balasan, d.perluAdmin))}${kartu('Perlu tindakan', tindakan(d))}${kartu('Kesehatan sistem', kesehatan(d))}</div>
      ${kartu('Pesanan terbaru', d.recent.length ? `<div class="tablewrap"><table style="min-width:640px"><tbody>${d.recent.map((o) => `<tr><td><b>${esc(o.invoice_no || o.order_id)}</b></td><td>${esc(o.customer_name)}</td><td class="small">${esc(tglPendek(o.trip_date))}</td><td>${esc(o.fleet_name || '')}</td><td class="num">${rp(o.total)}</td><td>${badge(o.status)}</td><td class="small">${o.driver_slug ? esc(driverName(o.driver_slug)) : 'Langsung'}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty">Belum ada pesanan.</div>', '1 1 100%')}`;
  };

  NAVS.splice(Math.max(0, NAVS.findIndex((n) => n[0] === 'pesanan')) + 1, 0, ['analitik', 'Analitik & Laporan']);
  try { if ($('#shell') && !$('#shell').hidden) nav(location.hash.replace('#', '') || 'pesanan'); } catch (_e) { /* belum login */ }
})();
