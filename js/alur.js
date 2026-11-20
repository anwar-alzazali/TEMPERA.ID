/* [ALUR.JS] Desain v2 tahap 2b (20 Nov 2026): alur pesan SATU JALUR layar penuh.
   Mau ke mana (wilayah + tempat) → Berapa orang + mobil → Kapan → Data & bayar.
   Layar ini hanya pengendali: ia mengisi kolom formulir lama yang disembunyikan (#travelForm: kotak centang destinasi,
   calcUnit, formJumlah, formTanggal, formJam, formCatatan, formNama, formKontak, formSetuju, paymentMode),
   lalu memanggil handleFormSubmitMidtrans. Hitungan harga & pembayaran tetap di main.js / server. */
const ALUR={buka:false,l:1,w:null,sibuk:false};
const ALUR_W=['lembang','ciwidey','pangalengan','dago'];
const aEl=(id)=>document.getElementById(id);

function alurCb(g){ return [...document.querySelectorAll(`input[name="destinasi"][data-group="${g}"]`)]; }
function alurDipilih(g){ return alurCb(g).filter(c=>c.checked); }
function alurTebakWilayah(){
  const o=OUTER.find(g=>alurDipilih(g).length); if(o) return o;
  return alurDipilih('dago').length?'dago':null;
}
function alurNamaW(g){ return g==='dago'?t('al_w_dago'):(REGION_NAME[g]||g); }
function alurFotoW(g){
  const cs=DEST_CARDS.filter(c=>c.secs&&c.secs[0]&&c.secs[0].g===g);
  const c=g==='dago'?(cs.find(c=>c.id==='kota'||/kota/i.test(c.judul||''))||cs[0]):cs[0];
  return c&&c.img?kartuFotoUrl(c.img):'';
}
function alurPax(){ return parseInt(aEl('formJumlah')?.value)||0; }
function alurSiap(l){
  if(l===1) return !!ALUR.w&&alurDipilih(ALUR.w).length>0;
  if(l===2) return alurPax()>0&&!!getSelectedArmada();
  if(l===3){ const a=getSelectedArmada(); const jm=pickupMs(aEl('formTanggal')?.value||'',aEl('formJam')?.value||''); return Number.isFinite(jm)&&jm>=batasMs()&&!(a&&PENUH.has(a.id)); }
  return true;
}
function alurOtomatis(){ ALUR.w=ALUR.w||alurTebakWilayah(); return !alurSiap(1)?1:(!alurSiap(2)?2:3); }
function alurTotal(){ const a=getSelectedArmada(); return a?a.price+getRegionInfo().cost:0; }

/* ---------- buka / tutup + tombol kembali HP ---------- */
function bukaAlur(langkah){
  if(PAYMODE==='midtrans') muatSnap();
  if(!sudahMulaiBooking){ sudahMulaiBooking=true; lacak('mulai_booking',{lokasi:'alur'}); }
  const l=langkah||alurOtomatis();
  if(!aEl('formJumlah').value) aEl('formJumlah').value=2;
  if(ALUR.buka){ alurKe(l); return; }
  ALUR.buka=true; ALUR.w=ALUR.w||alurTebakWilayah();
  let ov=aEl('alur');
  if(!ov){
    ov=document.createElement('div'); ov.id='alur'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    ov.innerHTML='<div class="al-panel"><header class="al-head"><div class="al-atas"><button type="button" class="al-kiri"></button><b class="al-judul"></b><span class="al-no"></span></div><div class="al-prog"><i></i><i></i><i></i><i></i></div></header><div class="al-isi"></div><footer class="al-bar"><div class="al-ring"><span class="al-r1"></span><b class="al-r2"></b></div><button type="button" class="al-lanjut"></button></footer></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',alurKlik); ov.addEventListener('input',alurInput); ov.addEventListener('change',alurInput);
    ov.addEventListener('click',(e)=>{ if(e.target===ov) tutupAlur(); });
  }
  ov.setAttribute('aria-label',t('al_judul'));
  ALUR.l=1; try{ history.pushState({alur:1},''); }catch(e){}
  for(let i=2;i<=l;i++){ try{ history.pushState({alur:i},''); }catch(e){} }   // langkah yang sudah terisi tetap bisa dimundurkan
  ALUR.l=l;
  document.documentElement.classList.add('al-kunci');
  ov.hidden=false; requestAnimationFrame(()=>ov.classList.add('open'));
  renderAlur();
}
// Riwayat browser selalu sedalam nomor langkah: maju = pushState, mundur = history.go (tombol kembali HP ikut benar)
function alurKe(l){
  if(l===ALUR.l) return;
  if(l<ALUR.l){ try{ history.go(l-ALUR.l); return; }catch(e){} }
  ALUR.l=l; try{ history.pushState({alur:l},''); }catch(e){} renderAlur(true);
}
function tutupAlur(viaPop){
  if(!ALUR.buka) return; ALUR.buka=false;
  const ov=aEl('alur'); if(ov){ ov.classList.remove('open'); setTimeout(()=>{ if(!ALUR.buka) ov.hidden=true; },REDUCE?0:250); }
  document.documentElement.classList.remove('al-kunci');
  if(viaPop!==true){ try{ const s=history.state; if(s&&s.alur) history.go(-s.alur); }catch(e){} }
}
window.addEventListener('popstate',()=>{
  if(!ALUR.buka) return;
  if(document.getElementById('tSheet')||document.getElementById('crossPopup')) return;
  const s=history.state;
  if(s&&s.alur){ ALUR.l=s.alur; renderAlur(true); } else tutupAlur(true);
});
// Semua tombol/tautan "Pesan" di beranda membuka alur ini
document.addEventListener('click',(e)=>{
  const a=e.target.closest&&e.target.closest('a[href="#pesan"],a[href="/#pesan"],[data-buka-alur]');
  if(!a) return; e.preventDefault(); e.stopImmediatePropagation(); closeMobileMenu(); bukaAlur();
},true);

/* ---------- tampilan ---------- */
const chipA=(on,attr,teks)=>`<button type="button" class="al-chip${on?' on':''}" ${attr} aria-pressed="${on}">${esc(teks)}</button>`;
function alurL1(){
  const tile=ALUR_W.map(g=>{ const f=alurFotoW(g), on=ALUR.w===g;
    return `<button type="button" class="al-w${on?' on':''}" data-w="${g}" aria-pressed="${on}"><span class="al-wf"${f?` style="background-image:url('${esc(f)}')"`:''}></span><b>${esc(alurNamaW(g))}</b><small>${esc(t('al_a_'+g))}</small></button>`; }).join('');
  let h=`<section class="al-sek"><h1 class="al-h1">${esc(t('al_t1'))}</h1><p class="al-sub">${esc(t('al_s1'))}</p><div class="al-wgrid">${tile}</div></section>`;
  if(!ALUR.w) return h;
  const g=ALUR.w, cbs=alurCb(g), bebasV=RUTE_BEBAS[g];
  const item=cbs.filter(c=>c.value!==bebasV), n=item.filter(c=>c.checked).length;
  const bebasCb=cbs.find(c=>c.value===bebasV);
  const kartu=DEST_CARDS.filter(c=>c.secs&&c.secs[0]&&c.secs[0].g===g);
  const daftar=(cards,grp)=>cards.map(c=>{
    const judul=cards.length>1?`<p class="al-sh">${esc(c.judul?kartuJudul(c):t(c.title))}</p>`:'';
    return judul+c.secs.map(sc=>`${sc.h?`<p class="al-sh2">${esc(t(sc.h))}</p>`:''}<div class="al-chips">${sc.items.map(v=>{ const cb=alurCb(grp).find(x=>x.value===v); return cb?chipA(cb.checked,`data-cb="${esc(grp)}|${esc(v)}"`,v):''; }).join('')}</div>`).join('');
  }).join('');
  h+=`<section class="al-sek"><div class="al-row"><h2 class="al-h2">${esc(t('al_tempat',{w:alurNamaW(g)}))}</h2><span class="al-hit${n>5?' warn':''}">${n?esc(t('al_dipilih',{n})):''}</span></div><p class="al-sub">${esc(t('al_tempat_s'))}</p>${daftar(kartu,g)}`;
  if(bebasCb) h+=`<button type="button" class="al-bebas${bebasCb.checked?' on':''}" data-cb="${esc(g)}|${esc(bebasV)}" aria-pressed="${bebasCb.checked}">${esc(t('al_bebas'))}</button>`;
  h+='</section>';
  if(g!=='dago'){
    const nk=alurDipilih('dago').length;
    h+=`<details class="al-mampir"${nk?' open':''}><summary><b>${esc(t('al_mampir'))}</b>${nk?` <span class="al-hit">${esc(t('al_dipilih',{n:nk}))}</span>`:''}<small>${esc(t('al_mampir_s'))}</small></summary>${daftar(DEST_CARDS.filter(c=>c.secs&&c.secs[0]&&c.secs[0].g==='dago'),'dago')}</details>`;
  }
  return h;
}
function alurL2(){
  const pax=alurPax(), a=getSelectedArmada();
  const urut=ARMADA_DATA.slice().sort((x,y)=>x.price-y.price);
  const pas=urut.find(u=>pax<=u.capacityNum)||urut.find(u=>pax<=u.capacityMax);
  const mobil=urut.map(u=>{ const muat=pax<=u.capacityMax, on=a&&a.id===u.id, img=(u.images||[])[0], k=kursTeks(u.price);
    return `<button type="button" class="al-car${on?' on':''}" data-car="${esc(u.id)}"${muat?'':' disabled'}>${img?`<img src="${esc(imgSrc(img))}" alt="" loading="lazy">`:'<span class="al-noimg"></span>'}<span class="al-cn">${pas&&pas.id===u.id&&muat?`<em>${esc(t('al_pas'))}</em>`:''}<b>${esc(u.name)}</b><small>${esc(muat?t('al_muat',{n:u.capacityNum,m:u.capacityMax}):t('al_tak_muat',{n:pax}))}</small></span><span class="al-cp"><b>${esc(formatPrice(u.price))}</b>${k?`<small>${esc(k)}</small>`:''}</span></button>`; }).join('');
  return `<section class="al-sek"><h1 class="al-h1">${esc(t('al_t2'))}</h1><div class="al-pax"><div><b>${esc(t('al_pax'))}</b><small>${esc(t('al_pax_s'))}</small></div><div class="al-step"><button type="button" data-pax="-1" aria-label="-">−</button><b aria-live="polite">${pax}</b><button type="button" data-pax="1" aria-label="+">+</button></div></div></section>
  <section class="al-sek"><h2 class="al-h2">${esc(t('al_mobil'))}</h2><p class="al-sub">${esc(t('al_mobil_s'))}</p><div class="al-cars">${mobil}</div></section>`;
}
function alurL3(){
  const tg=aEl('formTanggal'), jm=aEl('formJam'), a=getSelectedArmada();
  const min=tg.min||tanggalWIB(0), hari=[];
  for(let i=0;i<7;i++){ const d=new Date(Date.parse(min+'T00:00:00+07:00')+i*86400000+7*3600000).toISOString().slice(0,10); hari.push(d); }
  const loc=wxLocale(), fmt=(d,o)=>new Date(d+'T12:00:00+07:00').toLocaleDateString(loc,Object.assign({timeZone:'Asia/Jakarta'},o));
  const lain=!hari.includes(tg.value);
  const tgl=hari.map(d=>`<button type="button" class="al-tgl${tg.value===d?' on':''}" data-tgl="${d}"><small>${esc(fmt(d,{weekday:'short'}))}</small><b>${esc(fmt(d,{day:'numeric'}))}</b><small>${esc(fmt(d,{month:'short'}))}</small></button>`).join('');
  const jam=[...jm.options].map(o=>{ const v=o.value||o.textContent; return `<button type="button" class="al-chip${jm.value===v?' on':''}" data-jam="${esc(v)}"${o.disabled?' disabled':''}>${esc(v)}</button>`; }).join('');
  const m=/^(\d{2}):(\d{2})$/.exec(jm.value||''); const sel=m?String((+m[1]+12)%24).padStart(2,'0')+':'+m[2]+((+m[1]+12)>=24?t('dur_nextday'):''):'';
  const penuh=a&&PENUH.has(a.id);
  return `<section class="al-sek"><h1 class="al-h1">${esc(t('al_t3'))}</h1><div class="al-tgls">${tgl}</div>
  <label class="al-lain${lain?' on':''}"><span>${esc(t('al_tgl_lain'))}</span><input type="date" data-tgl-lain min="${esc(min)}" value="${esc(tg.value)}"></label>
  ${penuh?`<div class="al-warn">${esc(t('al_penuh',{car:a.name}))} <button type="button" data-ke="2">${esc(t('al_ganti_mobil'))}</button></div>`:''}
  <h2 class="al-h2" style="margin-top:20px">${esc(t('al_jam'))}</h2><div class="al-chips">${jam}</div>
  ${sel?`<p class="al-sub">${esc(t('al_selesai',{j:sel}))}</p>`:''}
  <label class="al-fld"><span>${esc(t('al_jemput'))}</span><input type="text" data-isi="formCatatan" maxlength="300" placeholder="${esc(t('al_jemput_ph'))}" value="${esc(aEl('formCatatan')?.value||'')}"></label></section>`;
}
function alurL4(){
  const a=getSelectedArmada(), tot=alurTotal(), dp=PAYMENT_MODE==='dp';
  const rute=[...document.querySelectorAll('input[name="destinasi"]:checked')].map(c=>c.value);
  const tg=aEl('formTanggal').value, jm=aEl('formJam').value;
  const tglT=tg?new Date(tg+'T12:00:00+07:00').toLocaleDateString(wxLocale(),{timeZone:'Asia/Jakarta',weekday:'long',day:'numeric',month:'long'}):'';
  const cost=getRegionInfo().cost, k=kursTeks(tot);
  return `<section class="al-sek"><h1 class="al-h1">${esc(t('al_t4'))}</h1>
  <label class="al-fld"><span>${esc(t('al_nama'))}</span><input type="text" data-isi="formNama" autocomplete="name" placeholder="${esc(t('al_nama_ph'))}" value="${esc(aEl('formNama').value)}"></label>
  <label class="al-fld"><span>${esc(t('al_wa'))} <small>${esc(t('al_wa_s'))}</small></span><input type="tel" data-isi="formKontak" autocomplete="tel" inputmode="tel" placeholder="${esc(aEl('formKontak').placeholder||'0812…')}" value="${esc(aEl('formKontak').value)}"></label>
  <div class="al-pm"><button type="button" class="${dp?'':'on'}" data-pm="lunas"><b>${esc(t('al_lunas'))}</b><small>${esc(t('al_lunas_s'))}</small></button><button type="button" class="${dp?'on':''}" data-pm="dp"><b>${esc(t('al_dp',{p:DP_PERCENT}))}</b><small>${esc(t('al_dp_s'))}</small></button></div></section>
  <section class="al-ringkas"><b>${esc(alurNamaW(ALUR.w))} · ${esc(tglT)}, ${esc(jm)}</b><span>${esc(t('al_rute'))}: ${esc(rute.join(', '))}</span><span>${esc(a?a.name:'')} · ${esc(t('al_orang',{n:alurPax()}))}</span>${cost?`<span>${esc(t('sum_cross'))} ${esc(formatPrice(cost))}</span>`:''}<hr><div class="al-tot"><span>${esc(t('al_total'))}</span><b>${esc(formatPrice(tot))}</b></div>${k?`<small class="al-kurs">${esc(k)}</small>`:''}${dp?`<small>${esc(t('pm_prev_dp',{dp:formatPrice(Math.round(tot*DP_PERCENT/100)),rest:formatPrice(tot-Math.round(tot*DP_PERCENT/100))}))}</small>`:''}</section>
  <label class="al-setuju"><input type="checkbox" data-setuju${aEl('formSetuju').checked?' checked':''}><span>${t('terms_html')}</span></label>`;
}
function renderAlur(gulirAtas){
  const ov=aEl('alur'); if(!ov||!ALUR.buka) return;
  const l=ALUR.l, isi=ov.querySelector('.al-isi'), y=isi.scrollTop;
  ov.querySelector('.al-kiri').textContent=l===1?'✕':'←';
  ov.querySelector('.al-kiri').setAttribute('aria-label',l===1?t('al_tutup'):t('lk_back'));
  ov.querySelector('.al-judul').textContent=t('al_judul');
  ov.querySelector('.al-no').textContent=t('al_langkah',{n:l});
  ov.querySelectorAll('.al-prog i').forEach((el,i)=>el.classList.toggle('on',i<l));
  isi.innerHTML=[alurL1,alurL2,alurL3,alurL4][l-1]();
  if(gulirAtas) isi.scrollTop=0; else isi.scrollTop=y;
  // bar bawah
  const a=getSelectedArmada(), w=ALUR.w, r1=ov.querySelector('.al-r1'), r2=ov.querySelector('.al-r2'), btn=ov.querySelector('.al-lanjut');
  r2.classList.remove('warn');
  if(l===1){
    const n=w?alurDipilih(w).filter(c=>c.value!==RUTE_BEBAS[w]).length+(w!=='dago'?alurDipilih('dago').length:0):0, bebas=w&&alurDipilih(w).some(c=>c.value===RUTE_BEBAS[w]);
    r1.textContent=w?alurNamaW(w):'';
    r2.textContent=!w?t('al_bar_belum'):(n?t('al_bar_n',{n}):(bebas?t('al_bar_bebas'):t('al_bar_tempat')));
    if(w&&!n&&!bebas) r2.classList.add('warn');
  } else if(l===2){ r1.textContent=alurNamaW(w)+' · '+t('al_orang',{n:alurPax()}); r2.textContent=a?formatPrice(alurTotal()):t('al_mobil'); }
  else { r1.textContent=alurNamaW(w)+' · '+(a?a.name:''); r2.textContent=(l===4&&PAYMENT_MODE==='dp')?t('al_dp',{p:DP_PERCENT})+' '+formatPrice(Math.round(alurTotal()*DP_PERCENT/100)):formatPrice(alurTotal()); }
  const siap=alurSiap(l);
  btn.textContent=ALUR.sibuk?t('processing'):(l===4?t('al_bayar',{rp:formatPrice(PAYMENT_MODE==='dp'?Math.round(alurTotal()*DP_PERCENT/100):alurTotal())}):t('lk_next'));
  btn.classList.toggle('mati',!siap||ALUR.sibuk); btn.setAttribute('aria-disabled',String(!siap||ALUR.sibuk));
  let aman=ov.querySelector('.al-aman'); if(l===4){ if(!aman){ aman=document.createElement('p'); aman.className='al-aman'; ov.querySelector('.al-bar').after(aman); } aman.textContent=t('al_aman'); } else if(aman) aman.remove();
}

/* ---------- interaksi ---------- */
function alurSetCb(g,v,nyala){
  const cb=alurCb(g).find(c=>c.value===v); if(!cb) return;
  cb.checked=nyala;
  if(nyala&&RUTE_BEBAS[g]){   // 'atur bareng driver' dan tempat satuan tidak dipilih bersamaan
    alurCb(g).forEach(c=>{ if(v===RUTE_BEBAS[g]?c.value!==v:c.value===RUTE_BEBAS[g]) c.checked=false; });
  }
}
async function alurKlik(e){
  const b=e.target.closest('button,[data-w]'); if(!b||b.disabled) return;
  if(b.classList.contains('al-kiri')){ if(ALUR.l===1) tutupAlur(); else history.back(); return; }
  if(b.dataset.w){ const g=b.dataset.w;
    if(ALUR.w!==g){ OUTER.forEach(o=>{ if(o!==g) alurCb(o).forEach(c=>c.checked=false); }); ALUR.w=g; calculateLive(); }
    renderAlur(); setTimeout(()=>aEl('alur').querySelector('.al-sek:nth-child(2)')?.scrollIntoView({behavior:'smooth',block:'start'}),50); return; }
  if(b.dataset.cb){ const i=b.dataset.cb.indexOf('|'), g=b.dataset.cb.slice(0,i), v=b.dataset.cb.slice(i+1); const cb=alurCb(g).find(c=>c.value===v); if(cb){ alurSetCb(g,v,!cb.checked); calculateLive(); renderAlur(); } return; }
  if(b.dataset.pax){ const el=aEl('formJumlah'); el.value=Math.max(1,Math.min(40,alurPax()+Number(b.dataset.pax))); const a=getSelectedArmada(); if(a&&alurPax()>a.capmax){ aEl('calcUnit').selectedIndex=0; } calculateLive(); renderAlur(); return; }
  if(b.dataset.car){ selectUnitById(b.dataset.car); calculateLive(); renderAlur(); return; }
  if(b.dataset.tgl){ alurTanggal(b.dataset.tgl); return; }
  if(b.dataset.jam){ aEl('formJam').value=b.dataset.jam; updateDurasi(); renderAlur(); return; }
  if(b.dataset.pm){ const r=document.querySelector(`input[name="paymentMode"][value="${b.dataset.pm}"]`); if(r){ r.checked=true; r.dispatchEvent(new Event('change',{bubbles:true})); } else PAYMENT_MODE=b.dataset.pm; renderAlur(); return; }
  if(b.dataset.ke){ alurKe(Number(b.dataset.ke)); return; }
  if(b.classList.contains('al-lanjut')){
    if(ALUR.sibuk) return;
    if(!alurSiap(ALUR.l)){
      if(ALUR.l===3){ const jm=pickupMs(aEl('formTanggal').value,aEl('formJam').value); if(Number.isFinite(jm)&&jm<batasMs()) await notify(BOOKING_MIN_HOURS>0?t('err_min',{n:BOOKING_MIN_HOURS}):t('err_past')); }
      return;
    }
    if(ALUR.l<4){ alurKe(ALUR.l+1); return; }
    await alurBayar();
  }
}
function alurTanggal(d){
  const el=aEl('formTanggal'); if(!d||(el.min&&d<el.min)) return;
  el.value=d; tglDiubahPelanggan=true; updateBatasWaktu(); renderAlur();
}
function alurInput(e){
  const el=e.target;
  if(el.dataset.isi){ const f=aEl(el.dataset.isi); if(f){ f.value=el.value; f.dispatchEvent(new Event('input',{bubbles:true})); } return; }
  if(el.hasAttribute('data-tgl-lain')&&e.type==='change'){ alurTanggal(el.value); return; }
  if(el.hasAttribute('data-setuju')){ aEl('formSetuju').checked=el.checked; }
}
async function alurBayar(){
  const nama=aEl('formNama').value.trim(), wa=normalizeWA(aEl('formKontak').value||'');
  if(!nama||wa.length<10||wa.length>15){ await notify(t('al_err_data')); aEl('alur').querySelector(nama?'[data-isi="formKontak"]':'[data-isi="formNama"]')?.focus(); return; }
  if(!aEl('formSetuju').checked){ await notify(t('err_terms')); aEl('alur').querySelector('[data-setuju]')?.focus(); return; }
  ALUR.sibuk=true; renderAlur();
  try{ await handleFormSubmitMidtrans({preventDefault(){}}); }
  finally{ ALUR.sibuk=false; renderAlur(); }
}
// Data dari server berubah (mobil, destinasi, ketersediaan tanggal) → gambar ulang bila alur terbuka
setInterval(()=>{ if(!ALUR.buka) return; const sig=[ARMADA_DATA.length,DEST_CARDS.length,[...PENUH].join(','),aEl('formTanggal')?.value].join('|'); if(sig!==ALUR.sig){ const ada=ALUR.sig!=null; ALUR.sig=sig; if(ada) renderAlur(); } },700);
