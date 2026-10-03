/* ===== BLOK 148: panel -> detail pesanan MANUAL menampilkan nominal + KODE UNIK (berkas terpisah; muat SETELAH 125, 133, 134) =====
   Membungkus openOrder (yang sudah dibungkus blok 125): kotak "Pembayaran manual - menunggu" dibuat ulang dengan nominal = dasar + orders.kode_unik. */
(function () {
  'use strict';
  const sebelumnya = openOrder;
  openOrder = async function (id) {
    await sebelumnya(id);
    try {
      const o = ORDERS.find((x) => x.id === id);
      if (!o || o.status !== 'pending' || o.midtrans_status !== 'manual') return;
      const box0 = $('#oBayarManual') && $('#oBayarManual').parentElement; if (!box0) return;
      let kode = Number(o.kode_unik);
      if (!Number.isFinite(kode)) {
        const r = await sb.from('orders').select('kode_unik').eq('order_id', o.order_id).limit(1);
        kode = Number(r.data && r.data[0] && r.data[0].kode_unik) || 0;
      }
      if (!(kode > 0)) return;   // tanpa kode unik: kotak lama sudah benar
      const isDP = o.payment_mode === 'dp', dasar = Number(isDP ? o.dp_amount : o.total), jumlah = dasar + kode;
      const box = document.createElement('div');
      box.style.cssText = box0.style.cssText;
      box.innerHTML = `<b>Pembayaran manual — menunggu</b><div class="small" style="margin:4px 0 8px">Cek mutasi rekening / GoPay Merchant. Harus masuk: <b>${rp(jumlah)}</b> (${isDP ? 'DP' : 'lunas'}) = ${rp(dasar)} + kode unik ${kode}.</div><button class="btn" type="button" id="oBayarManual">✅ Tandai ${isDP ? 'DP diterima' : 'Lunas'} (${rp(jumlah)})</button>`;
      box0.replaceWith(box);
      const kirimTandai = async (paksa) => {
        const ses = await sb.auth.getSession(); const tok = ses.data && ses.data.session && ses.data.session.access_token;
        const r = await fetch(`${SB_URL}/functions/v1/bayar-manual`, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SB_KEY, Authorization: `Bearer ${tok}` }, body: JSON.stringify({ order_id: o.order_id, paksa: !!paksa }) });
        return r.json().catch(() => ({ ok: false, error: 'Balasan tidak terbaca' }));
      };
      $('#oBayarManual').addEventListener('click', async (e) => {
        if (!confirm(`Pastikan ${rp(jumlah)} sudah masuk di mutasi (termasuk kode unik ${kode}).\n\nTandai ${isDP ? 'DP diterima' : 'LUNAS'} sekarang? Konfirmasi WA akan dikirim ke pelanggan dan driver, invoice terbit.`)) return;
        e.target.disabled = true;
        let j = await kirimTandai(false);
        if (j.penuh && confirm(j.error + '\n\nTetap tandai (abaikan armada penuh)?')) j = await kirimTandai(true);
        if (!j.ok) { e.target.disabled = false; toast(j.error || 'Gagal menandai', true); return; }
        toast(j.sudah ? 'Sudah diproses sebelumnya' : 'Ditandai. Konfirmasi dikirim.'); closeModal(); loadOrders();
      });
    } catch (e) { console.warn('kode unik panel:', e); }
  };
})();
