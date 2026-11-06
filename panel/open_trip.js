/* ===== Panel → Open Trip (6 Nov 2026, SQL 175). Muat SETELAH 10_login_nav.js.
   Admin membuat jadwal (tabel open_trip). Pelanggan memesan kursi di tempera.id/open-trip (fungsi pesan-open-trip).
   Kursi dikunci trigger a_kunci_kursi; pesanan masuk ke tabel orders (product_type='open_trip', product_id=id jadwal). ===== */
(function () {
  'use strict';
  NAVS.splice(1, 0, ['opentrip', 'Open Trip']);
  ICON.opentrip = '<path d="M3 17h18M5 17l1.5-5h11L19 17M8 12V8a4 4 0 0 1 8 0v4"/><circle cx="7.5" cy="19.5" r="1.5"/><circle cx="16.5" cy="19.5" r="1.5"/>';
  NAV_GRUP[0][1].splice(1, 0, 'opentrip');
  if (BNAV_ISI.pesanan) BNAV_ISI.pesanan.push('opentrip');

  const STATUS_OT = { draft: ['Draf (tersembunyi)', '#64748B'], buka: ['Dibuka', '#059669'], tutup: ['Ditutup (tampil, tidak bisa dipesan)', '#B45309'], batal: ['Dibatalkan', '#DC2626'], selesai: ['Selesai', '#0E7490'] };
  const BAYAR = ['dp_paid', 'paid', 'confirmed', 'completed'];
  const int = (v, d) => { const x = parseInt(String(v).replace(/[^0-9-]/g, ''), 10); return Number.isFinite(x) ? x : d; };
  const lencana = (s) => { const [l, c] = STATUS_OT[s] || [s, '#64748B']; return `<span style="display:inline-block;padding:2px 9px;border-radius:999px;font-size:11px;font-weight:700;color:#fff;background:${c}">${esc(l)}</span>`; };
  const tglId = (d) => d ? new Date(d + 'T00:00:00+07:00').toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }) : '-';
  const situs = () => (S.siteUrl || 'https://tempera.id');
  let TRIP = [], PESAN = [];
  const terbuka = new Set();

  VIEWS.opentrip = async function () {
    $('#view').innerHTML = `<h1>Open Trip</h1>
      <div class="help" style="margin:0 0 14px">Buat jadwal open trip (wisata, tahun baru, Lebaran). Status <b>Dibuka</b> tampil di <a href="${esc(situs())}/open-trip" target="_blank" rel="noopener">${esc(situs().replace(/^https?:\/\//, ''))}/open-trip</a> dan bisa dipesan per kursi (bayar lunas). <b>Draf</b> tidak tampil. Kursi yang sedang dibayar ditahan 30 menit. Teks jadwal terbuka untuk umum: jangan menulis data pribadi.</div>
      <div id="otMount"></div>`;
    const m = $('#otMount'); pasang(m); await muat();
  };

  async function muat() {
    const m = $('#otMount'); if (!m) return;
    const r = await sb.from('open_trip').select('*').order('tanggal', { ascending: false }).order('jam').limit(200);
    if (r.error) { m.innerHTML = `<div class="card"><div class="help">Belum bisa dimuat: ${esc(r.error.message)}. Jalankan SQL 175 di Supabase dulu.</div></div>`; return; }
    TRIP = r.data || [];
    const ids = TRIP.map((x) => String(x.id));
    PESAN = [];
    if (ids.length) {
      const o = await sb.from('orders').select('id,order_id,invoice_no,status,customer_name,customer_wa,pax,total,pickup_note,items,product_id,created_at,assigned_driver,invoice_token')
        .eq('product_type', 'open_trip').in('product_id', ids).order('created_at').limit(2000);
      PESAN = o.data || [];
    }
    const hariIni = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
    const akanDatang = TRIP.filter((x) => x.tanggal >= hariIni).sort((a, b) => (a.tanggal + a.jam).localeCompare(b.tanggal + b.jam));
    const lewat = TRIP.filter((x) => x.tanggal < hariIni);
    m.innerHTML = tambahHtml()
      + `<h2 style="margin-top:18px">Jadwal mendatang</h2>${akanDatang.map(itemHtml).join('') || '<div class="small" style="margin:8px 0">Belum ada jadwal mendatang.</div>'}`
      + (lewat.length ? `<h2 style="margin-top:22px">Sudah lewat</h2>${lewat.map(itemHtml).join('')}` : '');
  }

  const pesananTrip = (id) => PESAN.filter((o) => o.product_id === String(id));
  const lunas = (id) => pesananTrip(id).filter((o) => BAYAR.includes(o.status));
  const menunggu = (id) => pesananTrip(id).filter((o) => o.status === 'pending' && Date.now() - new Date(o.created_at).getTime() < 35 * 60e3);
  const kursiDari = (arr) => arr.reduce((s, o) => s + (o.pax || 1), 0);
  // Bagi pesanan lunas ke mobil: urut waktu pesan, satu pesanan tidak dipisah (first-fit). Hasil: [[order...], ...]
  function bagiMobil(r) {
    const k = Math.max(1, r.kursi_per_mobil || 4), mobil = [];
    lunas(r.id).forEach((o) => { const n = o.pax || 1; let m = mobil.find((x) => x.isi + n <= k); if (!m) { m = { isi: 0, daf: [] }; mobil.push(m); } m.isi += n; m.daf.push(o); });
    return mobil;
  }

  function fields(r) {
    const opsiStatus = Object.keys(STATUS_OT).map((k) => `<option value="${k}"${(r.status || 'draft') === k ? ' selected' : ''}>${esc(STATUS_OT[k][0])}</option>`).join('');
    const opsiDriver = '<option value="">(belum)</option>' + S.drivers.filter((d) => d.is_active !== false).map((d) => `<option value="${esc(d.slug)}"${r.driver_slug === d.slug ? ' selected' : ''}>${esc(d.name || d.slug)} (${esc(d.driver_code || d.slug)})</option>`).join('');
    return `<div class="fgrid" data-kf>
      <div class="full"><label>Judul (tampil di situs)<input data-f="judul" value="${esc(r.judul || '')}" maxlength="80" placeholder="mis. Open Trip Kawah Putih & Glamping Lakeside"></label></div>
      <div><label>Tujuan singkat<input data-f="tujuan" value="${esc(r.tujuan || '')}" maxlength="80" placeholder="mis. Ciwidey"></label></div>
      <div><label>Mobil (tampilan)<input data-f="armada" value="${esc(r.armada || '')}" maxlength="60" placeholder="mis. Toyota Hiace / Innova"></label></div>
      <div><label>Tanggal<input type="date" data-f="tanggal" value="${esc(r.tanggal || '')}"></label></div>
      <div><label>Jam berangkat<input type="time" data-f="jam" value="${esc(r.jam || '07:00')}"></label></div>
      <div class="full"><label class="chk"><input type="checkbox" data-f="jemput_rumah"${r.jemput_rumah ? ' checked' : ''}> Dijemput ke rumah (luar kota). Tanpa centang = titik kumpul</label></div>
      <div><label>Titik kumpul<input data-f="titik_kumpul" value="${esc(r.titik_kumpul || '')}" maxlength="120" placeholder="mis. Stasiun Bandung, pintu selatan"></label></div>
      <div><label>Area jemput (bila jemput ke rumah)<input data-f="area_jemput" value="${esc(r.area_jemput || '')}" maxlength="80" placeholder="mis. Kota Bandung & Cimahi"></label></div>
      <div><label>Kursi per mobil<input data-f="kursi_per_mobil" value="${esc(r.kursi_per_mobil ?? 4)}" inputmode="numeric" maxlength="2"></label></div>
      <div><label>Maksimal mobil (kosong = sebanyak peminat, sampai 15 mobil)<input data-f="maks_mobil" value="${esc(r.maks_mobil ?? '')}" inputmode="numeric" maxlength="2" placeholder="kosong = bebas"></label></div>
      <div><label>Harga per kursi (Rp)<input data-f="harga" value="${esc(r.harga ?? '')}" inputmode="numeric" maxlength="9" placeholder="mis. 250000"></label></div>
      <div><label>Minimal peserta per mobil agar berangkat<input data-f="min_berangkat" value="${esc(r.min_berangkat ?? 4)}" inputmode="numeric" maxlength="2"></label></div>
      <div><label>Pemesanan ditutup ... jam sebelum berangkat<input data-f="batas_jam" value="${esc(r.batas_jam ?? 12)}" inputmode="numeric" maxlength="3"></label></div>
      <div class="full"><label>Rencana perjalanan (satu baris satu kegiatan)<textarea data-f="itinerary" rows="4" maxlength="1500" placeholder="06.00 Kumpul di Stasiun Bandung&#10;08.30 Kawah Putih&#10;11.00 Situ Patenggang&#10;17.00 Kembali ke Stasiun Bandung">${esc(r.itinerary || '')}</textarea></label></div>
      <div><label>Termasuk<textarea data-f="termasuk" rows="3" maxlength="800" placeholder="Mobil + driver, BBM, tol, parkir, air mineral">${esc(r.termasuk || '')}</textarea></label></div>
      <div><label>Tidak termasuk<textarea data-f="tidak_termasuk" rows="3" maxlength="800" placeholder="Tiket masuk wisata, makan, pengeluaran pribadi">${esc(r.tidak_termasuk || '')}</textarea></label></div>
      <div class="full"><label>Catatan lain<textarea data-f="catatan" rows="2" maxlength="800">${esc(r.catatan || '')}</textarea></label></div>
      <div class="full"><label>Foto kartu (alamat https:// atau nama berkas di folder images, mis. kawah_putih_lebar.webp)<input data-f="foto_url" value="${esc(r.foto_url || '')}" maxlength="300"></label></div>
      <div><label>Status<select data-f="status">${opsiStatus}</select></label></div>
      <div><label>Driver<select data-f="driver_slug">${opsiDriver}</select></label></div>
    </div>`;
  }
  function pesertaHtml(r) {
    const daf = pesananTrip(r.id).filter((o) => BAYAR.includes(o.status) || o.status === 'pending');
    if (!daf.length) return '<div class="small" style="margin:6px 0">Belum ada pemesan.</div>';
    const baris = daf.map((o) => {
      const it = (o.items && o.items[0]) || {};
      const ket = [it.alamat ? 'Jemput: ' + it.alamat : '', it.peserta ? 'Peserta: ' + it.peserta : ''].filter(Boolean).join(' · ');
      const st = BAYAR.includes(o.status) ? '<b style="color:#059669">Lunas</b>' : (menunggu(r.id).includes(o) ? '<span style="color:#B45309">Sedang bayar</span>' : '<span style="color:#64748B">Kedaluwarsa</span>');
      return `<tr><td>${esc(o.customer_name)}</td><td><a href="https://wa.me/${esc(o.customer_wa)}" target="_blank" rel="noopener">${esc(o.customer_wa)}</a></td><td>${o.pax || 1}</td><td>${st}</td><td>${esc(o.invoice_no || o.order_id)}</td><td>${esc(ket)}</td></tr>`;
    }).join('');
    return `<div style="overflow-x:auto"><table><thead><tr><th>Nama</th><th>WhatsApp</th><th>Kursi</th><th>Status</th><th>Invoice</th><th>Keterangan</th></tr></thead><tbody>${baris}</tbody></table></div>`;
  }
  function itemHtml(r) {
    const k = kursiDari(lunas(r.id)), w = kursiDari(menunggu(r.id)), uang = lunas(r.id).reduce((s, o) => s + (o.total || 0), 0);
    const mb = bagiMobil(r), kp = r.kursi_per_mobil || 4, minM = r.min_berangkat || kp;
    const ringkasMobil = mb.map((m, i) => `Mobil ${i + 1}: ${m.isi}/${kp}${m.isi < minM ? ` <span style="color:#DC2626">(kurang ${minM - m.isi})</span>` : ' ✓'}`).join(' · ');
    return `<details class="card" data-oid="${r.id}" style="margin-bottom:10px"${terbuka.has(String(r.id)) ? ' open' : ''}>
      <summary style="cursor:pointer"><b>${esc(r.judul)}</b> ${lencana(r.status)}<br><span class="small">${esc(tglId(r.tanggal))} ${esc(r.jam)} · <b>${k}</b> kursi lunas${w ? ` (+${w} sedang bayar)` : ''} · ${rp(uang)}${r.maks_mobil ? ` · maks ${r.maks_mobil} mobil` : ''}${mb.length ? '<br>' + ringkasMobil : ''}</span></summary>
      <div style="margin-top:12px">
        <h3 style="margin:0 0 6px;font-size:14px">Pemesan</h3>${pesertaHtml(r)}
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 16px">
          <button class="btn ghost sm" type="button" data-ot-salin="${r.id}">Salin daftar peserta (untuk driver/grup WA)</button>
          <button class="btn ghost sm" type="button" data-ot-link="${r.id}">Salin link jadwal</button>
          <button class="btn ghost sm" type="button" data-ot-tugas="${r.id}">Tugaskan driver ke semua pesanan lunas</button>
          <button class="btn ghost sm" type="button" data-ot-duplikat="${r.id}">Duplikat ke tanggal lain</button>
        </div>
        <h3 style="margin:0 0 6px;font-size:14px">Ubah jadwal</h3>
        ${fields(r)}
        <button class="btn sm" type="button" data-ot-simpan="${r.id}">Simpan</button>
        ${pesananTrip(r.id).length ? '' : `<button class="btn ghost sm" type="button" data-ot-hapus="${r.id}">Hapus</button>`}
        <div class="help" style="margin-top:10px">Mengubah harga tidak mengubah pesanan yang sudah dibayar. Untuk membatalkan jadwal yang sudah ada pemesan: ubah status ke <b>Dibatalkan</b>, lalu kembalikan dana / pindahkan peserta lewat WhatsApp.</div>
      </div></details>`;
  }
  function tambahHtml() {
    return `<details class="card" data-baru style="margin-bottom:10px"><summary style="cursor:pointer"><b>+ Buat jadwal open trip</b></summary>
      <div style="margin-top:10px">${fields({ status: 'buka', kursi_per_mobil: 4, min_berangkat: 4, batas_jam: 12, jam: '06:00', termasuk: 'Mobil + driver, BBM, tol, parkir, air mineral', tidak_termasuk: 'Tiket masuk wisata, makan, pengeluaran pribadi' })}
      <button class="btn sm" type="button" data-ot-tambah>Buat jadwal</button></div></details>`;
  }
  const baca = (root) => { const o = {}; root.querySelectorAll('[data-f]').forEach((el) => { o[el.dataset.f] = el.type === 'checkbox' ? el.checked : el.value.trim(); }); return o; };
  function muatan(v) {
    const k = Math.max(1, int(v.kursi_per_mobil, 4)), mm = v.maks_mobil ? Math.max(1, int(v.maks_mobil, 1)) : null;
    return {
      kursi_per_mobil: k, maks_mobil: mm, kuota: Math.min(k * (mm || 15), 60),
      judul: v.judul, tujuan: v.tujuan || v.judul, tanggal: v.tanggal, jam: v.jam || '07:00', jemput_rumah: !!v.jemput_rumah,
      titik_kumpul: v.titik_kumpul || null, area_jemput: v.area_jemput || null, harga: int(v.harga, 0),
      min_berangkat: Math.max(0, int(v.min_berangkat, 0)), batas_jam: Math.max(0, int(v.batas_jam, 12)), armada: v.armada || null,
      itinerary: v.itinerary || null, termasuk: v.termasuk || null, tidak_termasuk: v.tidak_termasuk || null, catatan: v.catatan || null,
      foto_url: v.foto_url ? (/^https:\/\//i.test(v.foto_url) ? v.foto_url : 'images/' + v.foto_url.replace(/^\/*(images\/)?/, '')) : null,
      status: v.status || 'draft', driver_slug: v.driver_slug || null,
    };
  }
  function cek(v) {
    if (v.judul.length < 3) return 'Judul minimal 3 huruf';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v.tanggal)) return 'Isi tanggal';
    if (!/^\d{2}:\d{2}$/.test(v.jam)) return 'Isi jam berangkat';
    const k = int(v.kursi_per_mobil, 0); if (k < 1 || k > 20) return 'Kursi per mobil 1 sampai 20';
    if (v.maks_mobil && (int(v.maks_mobil, 0) < 1 || int(v.maks_mobil, 0) * k > 60)) return 'Maksimal mobil terlalu banyak (total kursi paling banyak 60)';
    if (int(v.harga, 0) < 1000) return 'Isi harga per kursi';
    if (!v.jemput_rumah && !v.titik_kumpul) return 'Isi titik kumpul, atau centang dijemput ke rumah';
    if (int(v.min_berangkat, 0) < 1 || int(v.min_berangkat, 0) > k) return 'Minimal peserta per mobil antara 1 dan kursi per mobil';
    return '';
  }
  async function salin(teks, pesan) { try { await navigator.clipboard.writeText(teks); toast(pesan || 'Disalin'); } catch (e) { prompt('Salin teks ini:', teks); } }

  function pasang(m) {
    m.addEventListener('toggle', (e) => { const d = e.target; if (d && d.dataset && d.dataset.oid) { if (d.open) terbuka.add(d.dataset.oid); else terbuka.delete(d.dataset.oid); } }, true);
    m.addEventListener('change', (e) => {
      if (e.target.dataset.f !== 'status' || e.target.value !== 'batal') return;
      const d = e.target.closest('details[data-oid]'); if (d && lunas(Number(d.dataset.oid)).length) toast('Jadwal ini sudah ada pemesan lunas: setelah disimpan, hubungi mereka untuk pengembalian dana / pindah jadwal.', true);
    });
    m.addEventListener('click', async (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const ds = b.dataset;
      if (ds.otSimpan || b.hasAttribute('data-ot-tambah')) {
        const v = baca(b.closest('details').querySelector('[data-kf]')), err = cek(v);
        if (err) { toast(err, true); return; }
        b.disabled = true;
        const r = ds.otSimpan ? await sb.from('open_trip').update(muatan(v)).eq('id', Number(ds.otSimpan)) : await sb.from('open_trip').insert(muatan(v)).select('id').single();
        b.disabled = false;
        if (r.error) { toast(r.error.message, true); return; }
        if (ds.otSimpan) terbuka.add(ds.otSimpan); else if (r.data) terbuka.add(String(r.data.id));
        toast(ds.otSimpan ? 'Jadwal tersimpan' : 'Jadwal dibuat'); await muat();
      } else if (ds.otHapus) {
        if (!confirm('Hapus jadwal ini? (Hanya bisa bila belum ada pemesan.)')) return;
        const r = await sb.from('open_trip').delete().eq('id', Number(ds.otHapus));
        if (r.error) { toast(r.error.message, true); return; }
        toast('Dihapus'); await muat();
      } else if (ds.otLink) {
        salin(`${situs()}/open-trip?id=${ds.otLink}`, 'Link jadwal disalin');
      } else if (ds.otSalin) {
        const r = TRIP.find((x) => x.id === Number(ds.otSalin)); const daf = lunas(r.id);
        const teks = `*${r.judul}*\n${tglId(r.tanggal)} jam ${r.jam}\n${r.jemput_rumah ? 'Jemput ke rumah' : 'Titik kumpul: ' + (r.titik_kumpul || '-')}\nPeserta lunas: ${kursiDari(daf)} kursi\n`
          + bagiMobil(r).map((m, j) => `\n*Mobil ${j + 1}* (${m.isi}/${r.kursi_per_mobil || 4})\n` + m.daf.map((o, i) => { const it = (o.items && o.items[0]) || {}; return `${i + 1}. ${o.customer_name} (${o.pax || 1} kursi) wa.me/${o.customer_wa}${it.alamat ? '\n   Jemput: ' + it.alamat : ''}${it.peserta ? '\n   Peserta: ' + it.peserta : ''}`; }).join('\n')).join('\n');
        salin(teks, 'Daftar peserta disalin');
      } else if (ds.otTugas) {
        const r = TRIP.find((x) => x.id === Number(ds.otTugas));
        const pilih = b.closest('details').querySelector('[data-f="driver_slug"]').value;
        if (!pilih) { toast('Pilih driver di kolom Driver dulu', true); return; }
        const daf = lunas(r.id).filter((o) => o.assigned_driver !== pilih);
        if (!daf.length) { toast('Tidak ada pesanan lunas yang perlu ditugaskan'); return; }
        if (!confirm(`Tugaskan ${pilih.toUpperCase()} ke ${daf.length} pesanan lunas? Surat jalan terbit otomatis. Tugas tidak dikirim per pesanan ke WA driver; kirim daftar peserta lewat tombol "Salin daftar peserta".`)) return;
        const u1 = await sb.from('open_trip').update({ driver_slug: pilih }).eq('id', r.id);
        const u2 = await sb.from('orders').update({ assigned_driver: pilih }).in('id', daf.map((o) => o.id));
        if (u1.error || u2.error) { toast((u1.error || u2.error).message, true); return; }
        terbuka.add(String(r.id)); toast('Driver ditugaskan'); await muat();
      } else if (ds.otDuplikat) {
        const r = TRIP.find((x) => x.id === Number(ds.otDuplikat));
        const tgl = prompt('Tanggal jadwal baru (TTTT-BB-HH):', r.tanggal); if (!tgl) return;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(tgl)) { toast('Format tanggal TTTT-BB-HH', true); return; }
        const salinan = Object.assign({}, r); ['id', 'created_at', 'updated_at', 'driver_slug'].forEach((k) => delete salinan[k]);
        salinan.tanggal = tgl; salinan.status = 'draft';
        const x = await sb.from('open_trip').insert(salinan).select('id').single();
        if (x.error) { toast(x.error.message, true); return; }
        terbuka.add(String(x.data.id)); toast('Jadwal diduplikat sebagai Draf. Periksa lalu ubah status ke Dibuka.'); await muat();
      }
    });
  }
})();
