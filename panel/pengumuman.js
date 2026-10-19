/* ===== BLOK 166: panel -> Pengaturan -> "Pengumuman untuk dashboard driver" (berkas terpisah; muat SETELAH 154). Butuh SQL 165. =====
   Admin menulis pengumuman (judul, isi, tombol + tautan, jadwal tampil). Kartunya di dashboard driver (mitra.html) menyusul. */
(function () {
  'use strict';
  const sebelumnya = VIEWS.pengaturan;
  VIEWS.pengaturan = async function () {
    await sebelumnya();
    const lama = $('#pgMount'); if (lama) lama.remove();
    const box = document.createElement('div'); box.id = 'pgMount'; $('#view').appendChild(box);
    pasang(box);
    await muat();
  };
  let DATA = [];
  const terbuka = new Set();
  const int = (v, d) => { const x = parseInt(v, 10); return Number.isFinite(x) ? x : d; };
  const keLokal = (iso) => { if (!iso) return ''; const d = new Date(iso); if (Number.isNaN(d.getTime())) return ''; const p = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };
  const keIso = (v) => { if (!v) return null; const d = new Date(v); return Number.isNaN(d.getTime()) ? null : d.toISOString(); };
  const tgl = (iso) => iso ? new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
  function status(r) {
    const n = Date.now();
    if (!r.aktif) return ['Tersembunyi', '#64748B'];
    if (r.mulai && new Date(r.mulai).getTime() > n) return ['Terjadwal', '#0E7490'];
    if (r.selesai && new Date(r.selesai).getTime() < n) return ['Berakhir', '#B45309'];
    return ['Tampil', '#059669'];
  }
  const lencana = (r) => { const [t, c] = status(r); return `<span style="display:inline-block;padding:2px 9px;border-radius:999px;font-size:11px;font-weight:700;color:#fff;background:${c}">${t}</span>`; };

  async function muat() {
    const m = $('#pgMount'); if (!m) return;
    const r = await sb.from('pengumuman_mitra').select('*').order('urut', { ascending: true }).order('id', { ascending: false });
    if (r.error) { m.innerHTML = `<h2 style="margin-top:24px">Pengumuman untuk dashboard driver</h2><div class="card"><div class="help">Belum bisa dimuat: ${esc(r.error.message)}. Jalankan SQL 165 di Supabase dulu.</div></div>`; return; }
    DATA = r.data || [];
    m.innerHTML = `<h2 style="margin-top:24px">Pengumuman untuk dashboard driver</h2>
      <div class="help" style="margin-bottom:10px">Pengumuman yang tampil sebagai kartu di dashboard driver, sama untuk semua driver. Pakai <b>Tampil</b> untuk menyembunyikan tanpa menghapus, dan <b>jadwal</b> untuk mengatur kapan mulai dan berhenti. Isinya <b>terbuka untuk umum</b>: jangan menulis data pribadi atau rahasia di sini. Tombol hanya menerima tautan <b>https://</b>. Kartunya muncul di dashboard setelah halaman <code>mitra.html</code> diperbarui.</div>
      ${tambahHtml()}${DATA.map(itemHtml).join('') || '<div class="small" style="margin:8px 0">Belum ada pengumuman.</div>'}`;
    m.querySelectorAll('details[data-pid],details[data-baru]').forEach(segar);
  }

  function pratinjau(v) {
    const tb = v.tombol_teks && v.tombol_url ? `<div style="margin-top:8px"><span style="display:inline-block;padding:7px 14px;border-radius:999px;background:var(--accent,#0E7490);color:#fff;font-size:12px;font-weight:700">${esc(v.tombol_teks)}</span></div>` : '';
    return `<div style="border:1px solid #cbd5e1;border-radius:12px;padding:12px;margin:8px 0;background:#fff;color:#0f172a"><div style="font-size:11px;font-weight:700;color:#64748B;margin-bottom:2px">PRATINJAU KARTU</div><b style="font-size:14px">${esc(v.judul || 'Judul pengumuman')}</b><div style="font-size:13px;margin-top:4px;white-space:pre-line;color:#334155">${esc(v.isi || 'Isi pengumuman…')}</div>${tb}</div>`;
  }
  function fields(r) {
    return `<div class="fgrid" data-kf>
      <div class="full"><label>Judul<input data-f="judul" value="${esc(r.judul || '')}" maxlength="80" placeholder="mis. Mau punya website sendiri?"></label></div>
      <div class="full"><label>Isi<textarea data-f="isi" rows="3" maxlength="600" placeholder="Kalimat singkat yang menarik">${esc(r.isi || '')}</textarea></label></div>
      <div><label>Teks tombol (opsional)<input data-f="tombol_teks" value="${esc(r.tombol_teks || '')}" maxlength="30" placeholder="mis. Lihat selengkapnya"></label></div>
      <div><label>Tautan tombol (https://)<input data-f="tombol_url" value="${esc(r.tombol_url || '')}" maxlength="300" placeholder="https://nganterin.id/?dari=tmp"></label></div>
      <div><label>Mulai tampil (kosong = langsung)<input type="datetime-local" data-f="mulai" value="${esc(keLokal(r.mulai))}"></label></div>
      <div><label>Berhenti tampil (kosong = tanpa batas)<input type="datetime-local" data-f="selesai" value="${esc(keLokal(r.selesai))}"></label></div>
      <div><label>Urutan (kecil = di atas)<input data-f="urut" value="${esc(r.urut == null ? 100 : r.urut)}" inputmode="numeric" maxlength="4"></label></div>
      <div><label class="chk"><input type="checkbox" data-f="aktif"${r.aktif === false ? '' : ' checked'}> Tampil</label></div>
    </div><div data-pre></div>`;
  }
  function itemHtml(r) {
    const jad = (r.mulai || r.selesai) ? ` · ${r.mulai ? 'mulai ' + esc(tgl(r.mulai)) : ''}${r.mulai && r.selesai ? ', ' : ''}${r.selesai ? 'sampai ' + esc(tgl(r.selesai)) : ''}` : '';
    return `<details class="card" data-pid="${esc(r.id)}" style="margin-bottom:10px"${terbuka.has(String(r.id)) ? ' open' : ''}>
      <summary style="cursor:pointer"><b>${esc(r.judul)}</b> ${lencana(r)} <span class="small">${jad}</span></summary>
      <div style="margin-top:10px">${fields(r)}
      <button class="btn sm" type="button" data-pg-simpan="${esc(r.id)}">Simpan</button> <button class="btn ghost sm" type="button" data-pg-hapus="${esc(r.id)}">Hapus</button></div></details>`;
  }
  function tambahHtml() {
    return `<details class="card" data-baru style="margin-bottom:10px"><summary style="cursor:pointer"><b>+ Tambah pengumuman</b></summary>
      <div style="margin-top:10px">${fields({})}<button class="btn sm" type="button" data-pg-tambah>Buat pengumuman</button></div></details>`;
  }
  const baca = (root) => { const o = {}; root.querySelectorAll('[data-f]').forEach((el) => { o[el.dataset.f] = el.type === 'checkbox' ? el.checked : el.value.trim(); }); return o; };
  function segar(d) { const k = d.querySelector('[data-kf]'), p = d.querySelector('[data-pre]'); if (k && p) p.innerHTML = pratinjau(baca(k)); }
  function cek(v) {
    if (v.judul.length < 2) return 'Judul minimal 2 huruf';
    if (v.isi.length < 2) return 'Isi minimal 2 huruf';
    if (!!v.tombol_teks !== !!v.tombol_url) return 'Teks tombol dan tautan harus diisi keduanya, atau dikosongkan keduanya';
    if (v.tombol_url && !/^https:\/\/[^\s"'<>]+$/i.test(v.tombol_url)) return 'Tautan tombol harus berawalan https:// dan tanpa spasi';
    const m = keIso(v.mulai), s = keIso(v.selesai);
    if (m && s && new Date(s) <= new Date(m)) return 'Waktu berhenti harus sesudah waktu mulai';
    return '';
  }
  const muatan = (v) => ({ judul: v.judul, isi: v.isi, tombol_teks: v.tombol_teks || null, tombol_url: v.tombol_url || null, mulai: keIso(v.mulai), selesai: keIso(v.selesai), urut: int(v.urut, 100), aktif: !!v.aktif });

  function pasang(m) {
    m.addEventListener('toggle', (e) => { const d = e.target; if (d && d.dataset && d.dataset.pid) { if (d.open) terbuka.add(d.dataset.pid); else terbuka.delete(d.dataset.pid); } }, true);
    m.addEventListener('input', (e) => { const d = e.target.closest('details'); if (d) segar(d); });
    m.addEventListener('click', async (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.pgSimpan) {
        const id = Number(b.dataset.pgSimpan), v = baca(b.closest('details').querySelector('[data-kf]')), err = cek(v);
        if (err) { toast(err, true); return; }
        const r = await sb.from('pengumuman_mitra').update(muatan(v)).eq('id', id);
        if (r.error) { toast(r.error.message, true); return; }
        toast('Pengumuman tersimpan'); terbuka.add(String(id)); await muat();
      } else if (b.dataset.pgHapus) {
        const id = Number(b.dataset.pgHapus);
        if (!confirm('Hapus pengumuman ini? Untuk sekadar menyembunyikan, hilangkan centang Tampil lalu Simpan.')) return;
        const r = await sb.from('pengumuman_mitra').delete().eq('id', id);
        if (r.error) { toast(r.error.message, true); return; }
        toast('Dihapus'); await muat();
      } else if (b.hasAttribute('data-pg-tambah')) {
        const v = baca(b.closest('details').querySelector('[data-kf]')), err = cek(v);
        if (err) { toast(err, true); return; }
        const r = await sb.from('pengumuman_mitra').insert(muatan(v));
        if (r.error) { toast(r.error.message, true); return; }
        toast('Pengumuman dibuat'); await muat();
      }
    });
  }
})();
