/* v2 (154): + pilihan "Teks pembayaran di situs" (manual | midtrans; butuh SQL 161).
   ===== BLOK 154: panel -> Pengaturan -> "Destinasi & Kartu" (berkas terpisah; muat SETELAH 148). Butuh SQL 153 dan unggahGambar dari blok 125. =====
   Admin mengatur: nama kartu (+Melayu), label, foto kartu, urutan, tampil/sembunyi; destinasi di tiap kartu (tambah, ubah, urut, sembunyikan, hapus). */
(function () {
  'use strict';
  const GRUP = { lembang: 'Lembang', dago: 'Kota Bandung & Dago (titik 0, bebas digabung)', ciwidey: 'Ciwidey', pangalengan: 'Pangalengan' };
  const BAGIAN = { '': '(tanpa subjudul)', wisata: 'Wisata', kuliner: 'Kuliner & oleh-oleh' };
  const fotoSrc = (v) => { v = String(v || '').trim(); if (!v) return ''; if (/^https:\/\/[^\s"'<>()]+$/i.test(v)) return v; return /^[a-z0-9_.\-\/]+$/i.test(v) ? 'images/' + v.replace(/^\/+/, '') : ''; };
  let KARTU = [], ITEM = [];
  const terbuka = new Set();
  const opsi = (map, pilih) => Object.keys(map).map((k) => `<option value="${esc(k)}"${k === pilih ? ' selected' : ''}>${esc(map[k])}</option>`).join('');
  const int = (v, d) => { const x = parseInt(v, 10); return Number.isFinite(x) ? x : d; };
  const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 24);
 
  const sebelumnya = VIEWS.pengaturan;
  VIEWS.pengaturan = async function () {
    await sebelumnya();
    const lama = $('#dsMount'); if (lama) lama.remove();
    const box = document.createElement('div'); box.id = 'dsMount'; $('#view').appendChild(box);
    pasangEvent(box);
    await muat();
  };
 
  async function muat() {
    const m = $('#dsMount'); if (!m) return;
    const [k, i] = await Promise.all([
      sb.from('destinasi_kartu').select('*').order('urut').order('id'),
      sb.from('destinasi_item').select('*').order('urut').order('id')]);
    if (k.error || i.error) { m.innerHTML = `<h2 style="margin-top:22px">Destinasi &amp; Kartu</h2><div class="card"><div class="help">Belum bisa dimuat: ${esc((k.error || i.error).message)}. Jalankan SQL 153 di Supabase dulu.</div></div>`; return; }
    KARTU = k.data || []; ITEM = i.data || [];
    const tp = await sb.from('app_settings').select('value').eq('key', 'teks_pembayaran').maybeSingle();
    const tpAda = !tp.error && tp.data;
    const tpNilai = tpAda && String(tp.data.value).trim().toLowerCase() === 'midtrans' ? 'midtrans' : 'manual';
    const kartuBayar = `<h2 style="margin-top:24px">Teks pembayaran di situs</h2>
      <div class="card" style="margin-bottom:10px"><div class="help" style="margin-bottom:8px">Mengatur tulisan <b>tanda kepercayaan</b> di atas tombol bayar dan dua FAQ pembayaran. Ganti ke <b>Midtrans</b> saat Midtrans sudah aktif. Ini hanya mengubah <b>tulisan</b> di situs; cara bayar yang sebenarnya tetap ditentukan oleh pengaturan <code>payment_gateway</code>.</div>
      ${tpAda ? `<select id="dsTeksBayar"><option value="manual"${tpNilai === 'manual' ? ' selected' : ''}>Transfer manual (rekening resmi, konfirmasi lewat WhatsApp)</option><option value="midtrans"${tpNilai === 'midtrans' ? ' selected' : ''}>Midtrans (QRIS, transfer bank, e-wallet)</option></select>` : '<div class="help">Pengaturan belum ada. Jalankan SQL 161 di Supabase dulu, lalu buka halaman ini lagi.</div>'}</div>`;
    m.innerHTML = `${kartuBayar}<h2 style="margin-top:24px">Destinasi &amp; Kartu</h2>
      <div class="help" style="margin-bottom:10px">Mengatur kartu di bagian <b>Pilih Destinasi</b> situs. Buka satu kartu untuk mengubah nama, foto, dan isinya. Pakai <b>Tampil</b> (hilangkan centang) untuk menyembunyikan tanpa menghapus. Biaya lintas mengikuti <b>wilayah</b> kartu (Lembang, Ciwidey, Pangalengan); wilayah baru di luar itu belum bisa ditambah dari sini. Destinasi baru otomatis dikenali asisten WA.</div>
      ${KARTU.map(kartuHtml).join('')}${tambahKartuHtml()}`;
  }
 
  function kartuHtml(k) {
    const items = ITEM.filter((x) => x.kartu_id === k.id);
    const f = fotoSrc(k.foto);
    return `<details class="card" data-kid="${esc(k.id)}" style="margin-bottom:10px"${terbuka.has(k.id) ? ' open' : ''}>
      <summary style="cursor:pointer"><b>${esc(k.judul)}</b> <span class="badge ${k.aktif ? 'b-paid' : 'b-pending'}">${k.aktif ? 'Tampil' : 'Tersembunyi'}</span> <span class="small">${items.length} destinasi · wilayah ${esc(GRUP[k.grup] || k.grup)}</span></summary>
      <div class="fgrid" data-kf style="margin-top:10px">
        <div><label>Nama kartu<input data-f="judul" value="${esc(k.judul)}" maxlength="40"></label></div>
        <div><label>Nama kartu (Melayu)<input data-f="judul_ms" value="${esc(k.judul_ms || '')}" maxlength="40"></label></div>
        <div><label>Label di foto<input data-f="tag" value="${esc(k.tag || '')}" maxlength="30" placeholder="mis. Bandung Utara"></label></div>
        <div><label>Label di foto (Melayu)<input data-f="tag_ms" value="${esc(k.tag_ms || '')}" maxlength="30"></label></div>
        <div><label>Urutan kartu<input data-f="urut" value="${esc(k.urut)}" inputmode="numeric" maxlength="4"></label></div>
        <div><label class="chk"><input type="checkbox" data-f="aktif"${k.aktif ? ' checked' : ''}> Tampil di situs</label></div>
        <div class="full"><label>Foto kartu</label>
          <div>${f ? `<img src="${esc(f)}" alt="" style="width:96px;height:64px;object-fit:cover;border-radius:8px;display:block;margin-bottom:6px">` : '<div class="small">Belum ada foto</div>'}</div>
          <input data-f="foto" value="${esc(k.foto || '')}" placeholder="nama berkas di images/ atau alamat https" maxlength="300">
          <input type="file" accept="image/*" data-ds-foto style="margin-top:6px"><div class="help" data-ds-st>Unggah dari HP: otomatis dikecilkan (lebar maks 1000) dan langsung dipakai.</div></div>
      </div>
      <button class="btn sm" type="button" data-ds-sk="${esc(k.id)}">Simpan kartu</button>
      <h3 style="margin:16px 0 6px;font-size:13px">Destinasi di kartu ini</h3>
      ${items.map(itemHtml).join('') || '<div class="small">Belum ada destinasi.</div>'}
      <div class="card" style="margin-top:10px;padding:10px"><div class="fgrid">
        <div class="full"><label>Tambah destinasi<input data-n="nama" placeholder="Nama tempat (tanpa tanda |)" maxlength="80"></label></div>
        <div><label>Subjudul<select data-n="bagian">${opsi(BAGIAN, '')}</select></label></div>
      </div><button class="btn sm" type="button" data-ds-ai="${esc(k.id)}">+ Tambah</button></div>
    </details>`;
  }
  function itemHtml(x) {
    return `<div class="card" data-iid="${esc(x.id)}" style="margin-bottom:6px;padding:8px"><div class="fgrid">
      <div class="full"><input data-f="nama" value="${esc(x.nama)}" maxlength="80" aria-label="Nama destinasi"></div>
      <div><select data-f="bagian" aria-label="Subjudul">${opsi(BAGIAN, x.bagian || '')}</select></div>
      <div><input data-f="urut" value="${esc(x.urut)}" inputmode="numeric" maxlength="4" aria-label="Urutan"></div>
      <div><label class="chk"><input type="checkbox" data-f="aktif"${x.aktif ? ' checked' : ''}> Tampil</label></div></div>
      <button class="btn sm" type="button" data-ds-si="${esc(x.id)}">Simpan</button> <button class="btn ghost sm" type="button" data-ds-di="${esc(x.id)}">Hapus</button></div>`;
  }
  function tambahKartuHtml() {
    return `<details class="card" style="margin-bottom:10px"><summary style="cursor:pointer"><b>+ Tambah kartu baru</b></summary>
      <div class="fgrid" style="margin-top:10px">
        <div><label>Nama kartu<input id="dsNewJudul" maxlength="40" placeholder="mis. Subang"></label></div>
        <div><label>Wilayah (menentukan biaya lintas)<select id="dsNewGrup">${opsi(GRUP, 'lembang')}</select></label></div>
      </div><div class="help">Foto dan label diisi setelah kartu dibuat.</div>
      <button class="btn sm" type="button" data-ds-ak>Buat kartu</button></details>`;
  }
 
  const baca = (root) => { const o = {}; root.querySelectorAll('[data-f]').forEach((el) => { o[el.dataset.f] = el.type === 'checkbox' ? el.checked : el.value.trim(); }); return o; };
  const gagal = (e) => { toast(e.message || String(e), true); };
  async function simpan(promise, pesan, tetapBuka) {
    const r = await promise; if (r.error) { gagal(r.error); return false; }
    toast(pesan); if (tetapBuka) terbuka.add(tetapBuka); await muat(); return true;
  }
 
  function pasangEvent(m) {
    m.addEventListener('toggle', (e) => { const d = e.target; if (d && d.dataset && d.dataset.kid) { if (d.open) terbuka.add(d.dataset.kid); else terbuka.delete(d.dataset.kid); } }, true);
    m.addEventListener('click', async (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.dsSk) {
        const id = b.dataset.dsSk, v = baca(b.closest('details').querySelector('[data-kf]'));   // hanya kolom kartu, bukan kolom destinasi di dalamnya
        if (v.judul.length < 2) { toast('Nama kartu minimal 2 huruf', true); return; }
        await simpan(sb.from('destinasi_kartu').update({ judul: v.judul, judul_ms: v.judul_ms || null, tag: v.tag || null, tag_ms: v.tag_ms || null, foto: v.foto || null, urut: int(v.urut, 100), aktif: !!v.aktif }).eq('id', id), 'Kartu tersimpan', id);
      } else if (b.dataset.dsSi) {
        const row = b.closest('[data-iid]'), v = baca(row), kid = row.closest('details').dataset.kid;
        if (v.nama.length < 2 || v.nama.includes('|')) { toast('Nama minimal 2 huruf dan tanpa tanda |', true); return; }
        await simpan(sb.from('destinasi_item').update({ nama: v.nama, bagian: v.bagian || null, urut: int(v.urut, 100), aktif: !!v.aktif }).eq('id', Number(b.dataset.dsSi)), 'Destinasi tersimpan', kid);
      } else if (b.dataset.dsDi) {
        const row = b.closest('[data-iid]'), kid = row.closest('details').dataset.kid, nama = row.querySelector('[data-f="nama"]').value;
        if (!confirm(`Hapus "${nama}"?\nPesanan lama tidak terpengaruh. Kalau hanya ingin menyembunyikan, hilangkan centang Tampil lalu Simpan.`)) return;
        await simpan(sb.from('destinasi_item').delete().eq('id', Number(b.dataset.dsDi)), 'Dihapus', kid);
      } else if (b.dataset.dsAi) {
        const kid = b.dataset.dsAi, box = b.parentElement;
        const nama = box.querySelector('[data-n="nama"]').value.trim(), bagian = box.querySelector('[data-n="bagian"]').value;
        if (nama.length < 2 || nama.includes('|')) { toast('Nama minimal 2 huruf dan tanpa tanda |', true); return; }
        const maks = ITEM.filter((x) => x.kartu_id === kid).reduce((a, x) => Math.max(a, Number(x.urut) || 0), 0);
        await simpan(sb.from('destinasi_item').insert({ kartu_id: kid, nama, bagian: bagian || null, urut: maks + 10 }), 'Destinasi ditambahkan', kid);
      } else if (b.hasAttribute('data-ds-ak')) {
        const judul = $('#dsNewJudul').value.trim(), grup = $('#dsNewGrup').value;
        let id = slug(judul); if (judul.length < 2 || id.length < 2) { toast('Isi nama kartu (minimal 2 huruf)', true); return; }
        if (KARTU.some((x) => x.id === id)) id = (id + '_' + (KARTU.length + 1)).slice(0, 24);
        const maks = KARTU.reduce((a, x) => Math.max(a, Number(x.urut) || 0), 0);
        await simpan(sb.from('destinasi_kartu').insert({ id, grup, judul, tag: null, urut: maks + 10, aktif: false }), 'Kartu dibuat (masih tersembunyi: isi destinasi, lalu centang Tampil)', id);
      }
    });
    m.addEventListener('change', async (e) => {
      const sel = e.target.closest('#dsTeksBayar');
      if (sel) {
        const r = await sb.from('app_settings').update({ value: sel.value }).eq('key', 'teks_pembayaran');
        if (r.error) gagal(r.error); else toast('Teks pembayaran tersimpan: ' + sel.value);
        return;
      }
      const fi = e.target.closest('input[data-ds-foto]'); if (!fi) return;
      const f = fi.files[0]; if (!f) return;
      const d = fi.closest('details'), st = d.querySelector('[data-ds-st]'), inp = d.querySelector('input[data-f="foto"]'); st.textContent = 'Memproses…';
      try {
        const url = await unggahGambar(f, { lebar: 1000, folder: 'destinasi' });
        inp.value = url;
        const r = await sb.from('destinasi_kartu').update({ foto: url }).eq('id', d.dataset.kid);
        if (r.error) throw new Error(r.error.message);
        st.textContent = 'Terunggah dan tersimpan.'; toast('Foto kartu tersimpan');
      } catch (er) { st.textContent = 'Gagal: ' + er.message; }
      fi.value = '';
    });
  }
})();
 
