/* [ALUR.JS] Desain v2 (20 Nov 2026): halaman pemesanan layar penuh, 3 langkah.
   (1) Rencana: wilayah + tempat, jumlah peserta (wajib, mencolok), mobil (geser foto, yang terpilih di tengah + daftar nama)
   (2) Jadwal: tanggal, jam, lokasi jemput   (3) Data & bayar.
   Pilihan di beranda (tempat yang diketuk, mobil yang dipilih) otomatis sudah terpilih di sini karena keduanya memakai
   kolom yang sama. Layar ini hanya MENGISI formulir lama yang disembunyikan (#formLama: kotak centang destinasi,
   calcUnit, formJumlah, formTanggal, formJam, formCatatan, formNama, formKontak, formSetuju, paymentMode) lalu memanggil
   handleFormSubmitMidtrans. Harga & pembayaran tetap di main.js / server.
   Tombol Lanjut/Bayar selalu aktif: bila ada yang kurang, layar kembali ke kolom itu dan menandainya merah. */
const ALUR={buka:false,l:1,w:null,sibuk:false,err:null};
const ALUR_W=['lembang','ciwidey','pangalengan','dago'];
const aEl=(id)=>document.getElementById(id);

function alurCb(g){ return [...document.querySelectorAll(`input[name="destinasi"][data-group="${g}"]`)]; }
function alurDipilih(g){ return alurCb(g).filter(c=>c.checked); }
function alurTebakWilayah(){
  const o=OUTER.find(g=>alurDipilih(g).length); if(o) return o;
  return alurDipilih('dago').length?'dago':null;
}
function alurNamaW(g){ return g==='dago'?t('al_w_dago'):(REGION_NAME[g]||g); }
function alurKartu(g){ return DEST_CARDS.filter(c=>c.secs&&c.secs[0]&&c.secs[0].g===g); }
function alurFotoW(g){
  const cs=alurKartu(g);
  const c=g==='dago'?(cs.find(c=>c.id==='kota'||/kota/i.test(c.judul||''))||cs[0]):cs[0];
  return c&&c.img?kartuFotoUrl(c.img):'';
}
function alurPax(){ return parseInt(aEl('formJumlah')?.value)||0; }
function alurTotal(){ const a=getSelectedArmada(); return a?a.price+getRegionInfo().cost:0; }
function alurBayarSekarang(){ const tot=alurTotal(); return PAYMENT_MODE==='dp'?Math.round(tot*DP_PERCENT/100):tot; }
// Kekurangan pertama di langkah l (null = lengkap): {l, k (kolom), m (kunci pesan), v}
function alurKurang(l){
  if(l===1){
    if(!ALUR.w||!alurDipilih(ALUR.w).length) return {l:1,k:'tempat',m:'al_err_tempat'};
    if(alurPax()<=0) return {l:1,k:'pax',m:'al_err_pax'};
    const a=getSelectedArmada(); if(!a||alurPax()>a.capmax) return {l:1,k:'mobil',m:'al_err_mobil'};
  }
  if(l===2){
    const a=getSelectedArmada(); if(a&&PENUH.has(a.id)) return {l:2,k:'tgl',m:'al_penuh',v:{car:a.name}};
    const jm=pickupMs(aEl('formTanggal')?.value||'',aEl('formJam')?.value||'');
    if(!Number.isFinite(jm)) return {l:2,k:'tgl',m:'al_err_jadwal'};
    if(jm<batasMs()) return {l:2,k:'jam',m:BOOKING_MIN_HOURS>0?'err_min':'err_past',v:{n:BOOKING_MIN_HOURS}};
  }
  if(l===3){
    if(!aEl('formNama').value.trim()) return {l:3,k:'nama',m:'al_err_data'};
    const wa=normalizeWA(aEl('formKontak').value||''); if(wa.length<10||wa.length>15) return {l:3,k:'wa',m:'al_err_data'};
    if(!aEl('formSetuju').checked) return {l:3,k:'setuju',m:'err_terms'};
  }
  return null;
}

/* ---------- buka / tutup + tombol kembali HP ---------- */
function bukaAlur(){
  if(PAYMODE==='midtrans') muatSnap();
  if(!sudahMulaiBooking){ sudahMulaiBooking=true; lacak('mulai_booking',{lokasi:'alur'}); }
  if(ALUR.buka){ alurKe(1); return; }
  ALUR.buka=true; ALUR.err=null; ALUR.w=alurTebakWilayah()||ALUR.w; ALUR.gulirMobil=true;
  let ov=aEl('alur');
  if(!ov){
    ov=document.createElement('div'); ov.id='alur'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    ov.innerHTML='<div class="al-panel"><header class="al-head"><div class="al-atas"><button type="button" class="al-kiri"></button><b class="al-judul"></b><span class="al-no"></span></div><div class="al-prog"><i></i><i></i><i></i></div></header><div class="al-isi"></div><footer class="al-bar"><div class="al-ring"><span class="al-r1"></span><b class="al-r2"></b></div><button type="button" class="al-lanjut"></button></footer></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',alurKlik); ov.addEventListener('input',alurInput); ov.addEventListener('change',alurInput);
    ov.addEventListener('click',(e)=>{ if(e.target===ov) tutupAlur(); });
  }
  ov.setAttribute('aria-label',t('al_judul'));
  ALUR.l=1; try{ history.pushState({alur:1},''); }catch(e){}
  document.documentElement.classList.add('al-kunci');
  ov.hidden=false; requestAnimationFrame(()=>ov.classList.add('open'));
  renderAlur(true);
}
// Riwayat browser selalu sedalam nomor langkah: maju = pushState, mundur = history.go (tombol kembali HP ikut benar)
function alurKe(l,err){
  ALUR.err=err||null;
  if(l===ALUR.l){ renderAlur(); alurSorotErr(); return; }
  if(l<ALUR.l){ ALUR.tundaErr=ALUR.err; try{ history.go(l-ALUR.l); return; }catch(e){} }
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
  if(s&&s.alur){ ALUR.l=s.alur; ALUR.err=ALUR.tundaErr||null; ALUR.tundaErr=null; ALUR.gulirMobil=true; renderAlur(!ALUR.err); alurSorotErr(); } else tutupAlur(true);
});
// Semua tombol/tautan "Pesan" di beranda membuka halaman pemesanan
document.addEventListener('click',(e)=>{
  const a=e.target.closest&&e.target.closest('a[href="#pesan"],a[href="/#pesan"],[data-buka-alur]');
  if(!a) return; e.preventDefault(); e.stopImmediatePropagation(); closeMobileMenu(); bukaAlur();
},true);

/* ---------- tampilan ---------- */
const chipA=(on,attr,teks)=>`<button type="button" class="al-chip${on?' on':''}" ${attr} aria-pressed="${on}">${esc(teks)}</button>`;
const errCls=(k)=>ALUR.err&&ALUR.err.k===k?' al-err':'';
const errMsg=(k)=>ALUR.err&&ALUR.err.k===k?`<p class="al-errmsg" role="alert">${esc(t(ALUR.err.m,ALUR.err.v||{}))}</p>`:'';
function alurDaftar(cards,grp){
  const rk=n=>{ const i=DEST_POPULER.indexOf(n); return i<0?1e9:i; };
  return cards.map(c=>{
    const judul=cards.length>1?`<p class="al-sh">${esc(c.judul?kartuJudul(c):t(c.title))}</p>`:'';
    return judul+c.secs.map(sc=>{
      const urut=sc.items.map((n,i)=>[n,i]).sort((a,b)=>rk(a[0])-rk(b[0])||a[1]-b[1]).map(x=>x[0]);
      const chip=v=>{ const cb=alurCb(grp).find(x=>x.value===v); return cb?chipA(cb.checked,`data-cb="${esc(grp)}|${esc(v)}"`,v):''; };
      const atas=urut.slice(0,8), sisa=urut.slice(8), nSisa=sisa.filter(v=>alurCb(grp).some(x=>x.value===v&&x.checked)).length;
      return `${sc.h?`<p class="al-sh2">${esc(t(sc.h))}</p>`:''}<div class="al-chips">${atas.map(chip).join('')}</div>`+
        (sisa.length?`<details class="al-lagi"${nSisa?' open':''}><summary>${esc(t('dest_all',{n:sisa.length}))}</summary><div class="al-chips">${sisa.map(chip).join('')}</div></details>`:'');
    }).join('');
  }).join('');
}
function alurL1(){
  const tile=ALUR_W.map(g=>{ const f=alurFotoW(g), on=ALUR.w===g;
    return `<button type="button" class="al-w${on?' on':''}" data-w="${g}" aria-pressed="${on}"><span class="al-wf"${f?` style="background-image:url('${esc(f)}')"`:''}></span><b>${esc(g==='dago'?'Kota Bandung':alurNamaW(g))}</b></button>`; }).join('');
  let h=`<section class="al-sek${errCls('tempat')}" id="alSekTempat"><h1 class="al-h1">${esc(t('al_t1'))}</h1><p class="al-sub">${esc(t('al_s1'))}</p><div class="al-wgrid">${tile}</div>`;
  if(ALUR.w){
    const g=ALUR.w, bebasV=RUTE_BEBAS[g], bebasCb=alurCb(g).find(c=>c.value===bebasV);
    const n=alurDipilih(g).filter(c=>c.value!==bebasV).length;
    h+=`<div class="al-row" style="margin-top:18px"><h2 class="al-h2">${esc(t('al_tempat',{w:alurNamaW(g)}))}</h2><span class="al-hit${n>5?' warn':''}">${n?esc(t('al_dipilih',{n})):''}</span></div><p class="al-sub">${esc(t('al_tempat_s'))}</p>${alurDaftar(alurKartu(g),g)}`;
    if(bebasCb) h+=`<button type="button" class="al-bebas${bebasCb.checked?' on':''}" data-cb="${esc(g)}|${esc(bebasV)}" aria-pressed="${bebasCb.checked}">${esc(t('al_bebas'))}</button>`;
    if(g!=='dago'){
      const nk=alurDipilih('dago').length;
      h+=`<details class="al-mampir"${nk?' open':''}><summary><b>${esc(t('al_mampir'))}</b>${nk?` <span class="al-hit">${esc(t('al_dipilih',{n:nk}))}</span>`:''}<small>${esc(t('al_mampir_s'))}</small></summary>${alurDaftar(alurKartu('dago'),'dago')}</details>`;
    }
  }
  h+=errMsg('tempat')+'</section>';
  // Peserta: wajib & mencolok, mulai kosong
  const pax=alurPax();
  h+=`<section class="al-sek"><div class="al-pax${pax?'':' kosong'}${errCls('pax')}" id="alSekPax"><div><b>${esc(t('al_t2'))} <span class="al-wjb">${esc(t('al_wajib'))}</span></b><small>${esc(t('al_pax_s'))}</small></div><div class="al-step"><button type="button" data-pax="-1" aria-label="−"${pax<=1?' disabled':''}>−</button><b aria-live="polite">${pax||'–'}</b><button type="button" data-pax="1" aria-label="+">+</button></div></div>${errMsg('pax')}</section>`;
  // Mobil: geser foto + daftar nama
  const a=getSelectedArmada(), urut=ARMADA_DATA.slice().sort((x,y)=>x.price-y.price);
  const pas=pax?(urut.find(u=>pax<=u.capacityNum)||urut.find(u=>pax<=u.capacityMax)):null;
  const kar=urut.map(u=>{ const muat=!pax||pax<=u.capacityMax, on=a&&a.id===u.id, img=(u.images||[])[0];
    return `<button type="button" class="al-ci${on?' on':''}${muat?'':' tak'}" data-car="${esc(u.id)}" aria-pressed="${!!on}">${img?`<img src="${esc(imgSrc(img))}" alt="" loading="lazy">`:'<span class="al-noimg"></span>'}<b>${esc(u.shortName||u.name)}</b><small>${esc(formatPrice(u.price))}</small>${pas&&pas.id===u.id?`<em>${esc(t('al_pas'))}</em>`:''}</button>`; }).join('');
  const opsi=`<option value="">${esc(t('al_mobil_pilih'))}</option>`+urut.map(u=>{ const muat=!pax||pax<=u.capacityMax; return `<option value="${esc(u.id)}"${a&&a.id===u.id?' selected':''}${muat?'':' disabled'}>${esc(u.name)} · ${esc(formatPrice(u.price))}${muat?'':' ('+esc(t('al_tak_muat',{n:pax}))+')'}</option>`; }).join('');
  const det=a?`${esc(t('al_muat',{n:a.cap,m:a.capmax}))} · <b>${esc(formatPrice(a.price))}</b>${kursTeks(a.price)?' <small>'+esc(kursTeks(a.price))+'</small>':''}`:esc(t('al_geser'));
  h+=`<section class="al-sek${errCls('mobil')}" id="alSekMobil"><h2 class="al-h2">${esc(t('al_mobil'))}</h2><p class="al-sub">${esc(t('al_mobil_s'))}</p>
  <div class="al-kar" tabindex="0" aria-label="${esc(t('al_mobil'))}">${kar}</div>
  <select class="al-sel" data-sel-mobil aria-label="${esc(t('al_mobil'))}">${opsi}</select><p class="al-det">${det}</p>${errMsg('mobil')}</section>`;
  return h;
}
function alurL2(){
  const tg=aEl('formTanggal'), jm=aEl('formJam'), a=getSelectedArmada();
  const min=tg.min||tanggalWIB(0), hari=[];
  for(let i=0;i<7;i++) hari.push(new Date(Date.parse(min+'T00:00:00+07:00')+i*86400000+7*3600000).toISOString().slice(0,10));
  const loc=wxLocale(), fmt=(d,o)=>new Date(d+'T12:00:00+07:00').toLocaleDateString(loc,Object.assign({timeZone:'Asia/Jakarta'},o));
  const lain=!hari.includes(tg.value);
  const tgl=hari.map(d=>`<button type="button" class="al-tgl${tg.value===d?' on':''}" data-tgl="${d}"><small>${esc(fmt(d,{weekday:'short'}))}</small><b>${esc(fmt(d,{day:'numeric'}))}</b><small>${esc(fmt(d,{month:'short'}))}</small></button>`).join('');
  const jam=[...jm.options].map(o=>{ const v=o.value||o.textContent; return `<button type="button" class="al-chip${jm.value===v?' on':''}" data-jam="${esc(v)}"${o.disabled?' disabled':''}>${esc(v)}</button>`; }).join('');
  const m=/^(\d{2}):(\d{2})$/.exec(jm.value||''); const sel=m?String((+m[1]+12)%24).padStart(2,'0')+':'+m[2]+((+m[1]+12)>=24?t('dur_nextday'):''):'';
  const penuh=a&&PENUH.has(a.id);
  return `<section class="al-sek${errCls('tgl')}"><h1 class="al-h1">${esc(t('al_t3'))}</h1><div class="al-tgls">${tgl}</div>
  <label class="al-lain${lain?' on':''}"><span>${esc(t('al_tgl_lain'))}</span><input type="date" data-tgl-lain min="${esc(min)}" value="${esc(tg.value)}"></label>
  ${penuh?`<div class="al-warn">${esc(t('al_penuh',{car:a.name}))} <button type="button" data-ke="1">${esc(t('al_ganti_mobil'))}</button></div>`:errMsg('tgl')}</section>
  <section class="al-sek${errCls('jam')}"><h2 class="al-h2">${esc(t('al_jam'))}</h2><div class="al-chips" style="margin-top:10px">${jam}</div>
  ${sel?`<p class="al-sub">${esc(t('al_selesai',{j:sel}))}</p>`:''}${errMsg('jam')}
  <label class="al-fld"><span>${esc(t('al_jemput'))}</span><input type="text" data-isi="formCatatan" maxlength="300" placeholder="${esc(t('al_jemput_ph'))}" value="${esc(aEl('formCatatan')?.value||'')}"></label></section>`;
}
function alurL3(){
  const a=getSelectedArmada(), tot=alurTotal(), dp=PAYMENT_MODE==='dp';
  const rute=[...document.querySelectorAll('input[name="destinasi"]:checked')].map(c=>c.value);
  const tg=aEl('formTanggal').value, jm=aEl('formJam').value;
  const tglT=tg?new Date(tg+'T12:00:00+07:00').toLocaleDateString(wxLocale(),{timeZone:'Asia/Jakarta',weekday:'long',day:'numeric',month:'long'}):'';
  const cost=getRegionInfo().cost, k=kursTeks(tot);
  return `<section class="al-sek"><h1 class="al-h1">${esc(t('al_t4'))}</h1>
  <label class="al-fld${errCls('nama')}"><span>${esc(t('al_nama'))}</span><input type="text" data-isi="formNama" autocomplete="name" placeholder="${esc(t('al_nama_ph'))}" value="${esc(aEl('formNama').value)}"></label>${errMsg('nama')}
  <label class="al-fld${errCls('wa')}"><span>${esc(t('al_wa'))} <small>${esc(t('al_wa_s'))}</small></span><input type="tel" data-isi="formKontak" autocomplete="tel" inputmode="tel" placeholder="${esc(aEl('formKontak').placeholder||'0812…')}" value="${esc(aEl('formKontak').value)}"></label>${errMsg('wa')}
  <div class="al-pm"><button type="button" class="${dp?'':'on'}" data-pm="lunas"><b>${esc(t('al_lunas'))}</b><small>${esc(t('al_lunas_s'))}</small></button><button type="button" class="${dp?'on':''}" data-pm="dp"><b>${esc(t('al_dp',{p:DP_PERCENT}))}</b><small>${esc(t('al_dp_s'))}</small></button></div></section>
  <section class="al-ringkas"><b>${esc(alurNamaW(ALUR.w))} · ${esc(tglT)}, ${esc(jm)}</b><span>${esc(t('al_rute'))}: ${esc(rute.join(', '))}</span><span>${esc(a?a.name:'')} · ${esc(t('al_orang',{n:alurPax()}))}</span>${cost?`<span>${esc(t('sum_cross'))} ${esc(formatPrice(cost))}</span>`:''}<hr><div class="al-tot"><span>${esc(t('al_total'))}</span><b>${esc(formatPrice(tot))}</b></div>${k?`<small class="al-kurs">${esc(k)}</small>`:''}${dp?`<small>${esc(t('pm_prev_dp',{dp:formatPrice(Math.round(tot*DP_PERCENT/100)),rest:formatPrice(tot-Math.round(tot*DP_PERCENT/100))}))}</small>`:''}</section>
  <label class="al-setuju${errCls('setuju')}"><input type="checkbox" data-setuju${aEl('formSetuju').checked?' checked':''}><span>${t('terms_html')}</span></label>${errMsg('setuju')}`;
}
function renderAlur(gulirAtas){
  const ov=aEl('alur'); if(!ov||!ALUR.buka) return;
  const l=ALUR.l, isi=ov.querySelector('.al-isi'), y=isi.scrollTop;
  const kar0=isi.querySelector('.al-kar'), kx=kar0?kar0.scrollLeft:null;
  ov.querySelector('.al-kiri').textContent=l===1?'✕':'←';
  ov.querySelector('.al-kiri').setAttribute('aria-label',l===1?t('al_tutup'):t('lk_back'));
  ov.querySelector('.al-judul').textContent=t('al_judul');
  ov.querySelector('.al-no').textContent=t('al_langkah',{n:l});
  ov.querySelectorAll('.al-prog i').forEach((el,i)=>el.classList.toggle('on',i<l));
  isi.innerHTML=[alurL1,alurL2,alurL3][l-1]();
  isi.scrollTop=gulirAtas?0:y;
  if(l===1) alurPasangKar(kx);
  alurRenderBar();
}
function alurRenderBar(){
  const ov=aEl('alur'); if(!ov) return;
  const l=ALUR.l, a=getSelectedArmada(), w=ALUR.w, r1=ov.querySelector('.al-r1'), r2=ov.querySelector('.al-r2'), btn=ov.querySelector('.al-lanjut');
  const nTempat=w?alurDipilih(w).filter(c=>c.value!==RUTE_BEBAS[w]).length+(w!=='dago'?alurDipilih('dago').length:0):0;
  r1.textContent=[w?alurNamaW(w):'', nTempat?t('al_dipilih',{n:nTempat}):'', alurPax()?t('al_orang',{n:alurPax()}):''].filter(Boolean).join(' · ')||t('al_bar_belum');
  r2.textContent=a?(a.name+' · '+(l===3&&PAYMENT_MODE==='dp'?t('al_dp',{p:DP_PERCENT})+' '+formatPrice(alurBayarSekarang()):formatPrice(alurTotal()))):t('al_mobil_pilih');
  btn.textContent=ALUR.sibuk?t('processing'):(l===3?t('al_bayar',{rp:formatPrice(alurBayarSekarang())}):t('lk_next'));
  btn.classList.toggle('mati',ALUR.sibuk);
  let aman=ov.querySelector('.al-aman'); if(l===3){ if(!aman){ aman=document.createElement('p'); aman.className='al-aman'; ov.querySelector('.al-bar').after(aman); } aman.textContent=t('al_aman'); } else if(aman) aman.remove();
}
function alurSorotErr(){
  const el=aEl('alur')?.querySelector('.al-err'); if(!el) return;
  setTimeout(()=>{ try{ el.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'center'}); }catch(e){} el.classList.remove('goyang'); void el.offsetWidth; el.classList.add('goyang'); const f=el.querySelector('input'); if(f&&f.type!=='checkbox') try{ f.focus({preventScroll:true}); }catch(e){} },60);
}

/* ---------- geser mobil: yang terpilih selalu di tengah & menyala ---------- */
function alurPasangKar(kx){
  const kar=aEl('alur').querySelector('.al-kar'); if(!kar) return;
  const on=kar.querySelector('.al-ci.on');
  if(on&&ALUR.gulirMobil){ ALUR.gulirMobil=false; requestAnimationFrame(()=>{ kar.scrollLeft=on.offsetLeft-(kar.clientWidth-on.offsetWidth)/2; }); }
  else if(kx!=null) kar.scrollLeft=kx;
  let tm=null, sentuh=false;
  const mulai=()=>{ sentuh=true; };
  kar.addEventListener('pointerdown',mulai,{passive:true}); kar.addEventListener('touchstart',mulai,{passive:true}); kar.addEventListener('wheel',mulai,{passive:true});
  kar.addEventListener('scroll',()=>{ if(!sentuh) return; clearTimeout(tm); tm=setTimeout(()=>{
    sentuh=false;
    const tengah=kar.scrollLeft+kar.clientWidth/2; let dekat=null, jarak=1e9;
    kar.querySelectorAll('.al-ci').forEach(b=>{ const d=Math.abs(b.offsetLeft+b.offsetWidth/2-tengah); if(d<jarak){ jarak=d; dekat=b; } });
    if(dekat&&!dekat.classList.contains('tak')&&!dekat.classList.contains('on')) alurPilihMobil(dekat.dataset.car,false);
  },160); },{passive:true});
}
function alurPilihMobil(id,pusatkan){
  selectUnitById(id); calculateLive(); if(typeof tandaiMobilBeranda==='function') tandaiMobilBeranda();
  if(ALUR.err&&ALUR.err.k==='mobil') ALUR.err=null;
  ALUR.gulirMobil=pusatkan!==false;
  if(pusatkan===false){   // dari geseran: perbarui tanpa menggambar ulang supaya geseran tidak tersentak
    const ov=aEl('alur'); const a=getSelectedArmada();
    ov.querySelectorAll('.al-ci').forEach(b=>{ const s=b.dataset.car===id; b.classList.toggle('on',s); b.setAttribute('aria-pressed',String(s)); });
    const sel=ov.querySelector('[data-sel-mobil]'); if(sel) sel.value=id;
    const det=ov.querySelector('.al-det'); if(det&&a) det.innerHTML=`${esc(t('al_muat',{n:a.cap,m:a.capmax}))} · <b>${esc(formatPrice(a.price))}</b>${kursTeks(a.price)?' <small>'+esc(kursTeks(a.price))+'</small>':''}`;
    ov.querySelector('#alSekMobil')?.classList.remove('al-err'); ov.querySelector('#alSekMobil .al-errmsg')?.remove();
    alurRenderBar(); return;
  }
  renderAlur();
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
  const b=e.target.closest('button'); if(!b||b.disabled) return;
  if(b.classList.contains('al-kiri')){ if(ALUR.l===1) tutupAlur(); else history.back(); return; }
  if(b.dataset.w){ const g=b.dataset.w;
    if(ALUR.w!==g){ OUTER.forEach(o=>{ if(o!==g) alurCb(o).forEach(c=>c.checked=false); }); ALUR.w=g; calculateLive(); }
    if(ALUR.err&&ALUR.err.k==='tempat') ALUR.err=null;
    renderAlur(); return; }
  if(b.dataset.cb){ const i=b.dataset.cb.indexOf('|'), g=b.dataset.cb.slice(0,i), v=b.dataset.cb.slice(i+1); const cb=alurCb(g).find(c=>c.value===v);
    if(cb){ alurSetCb(g,v,!cb.checked); calculateLive(); if(ALUR.err&&ALUR.err.k==='tempat') ALUR.err=null; renderAlur(); } return; }
  if(b.dataset.pax){
    const el=aEl('formJumlah'); el.value=Math.max(1,Math.min(40,alurPax()+Number(b.dataset.pax)));
    const a=getSelectedArmada(); if(a&&alurPax()>a.capmax) aEl('calcUnit').selectedIndex=0;
    if(ALUR.err&&ALUR.err.k==='pax') ALUR.err=null;
    calculateLive(); renderAlur(); return; }
  if(b.dataset.car){ if(b.classList.contains('tak')){ notify(t('al_tak_muat',{n:alurPax()})); return; } alurPilihMobil(b.dataset.car,true); return; }
  if(b.dataset.tgl){ alurTanggal(b.dataset.tgl); return; }
  if(b.dataset.jam){ aEl('formJam').value=b.dataset.jam; updateDurasi(); if(ALUR.err&&ALUR.err.k==='jam') ALUR.err=null; renderAlur(); return; }
  if(b.dataset.pm){ const r=document.querySelector(`input[name="paymentMode"][value="${b.dataset.pm}"]`); if(r){ r.checked=true; r.dispatchEvent(new Event('change',{bubbles:true})); } else PAYMENT_MODE=b.dataset.pm; renderAlur(); return; }
  if(b.dataset.ke){ alurKe(Number(b.dataset.ke)); return; }
  if(b.classList.contains('al-lanjut')){
    if(ALUR.sibuk) return;
    // cek semua langkah sampai langkah ini; kekurangan pertama → kembali ke kolomnya
    for(let i=1;i<=ALUR.l;i++){ const k=alurKurang(i); if(k){ alurKe(k.l,k); return; } }
    if(ALUR.l<3){ alurKe(ALUR.l+1); return; }
    await alurBayar();
  }
}
function alurTanggal(d){
  const el=aEl('formTanggal'); if(!d||(el.min&&d<el.min)) return;
  el.value=d; tglDiubahPelanggan=true; updateBatasWaktu();
  if(ALUR.err&&(ALUR.err.k==='tgl'||ALUR.err.k==='jam')) ALUR.err=null;
  renderAlur();
}
function alurInput(e){
  const el=e.target;
  if(el.dataset.isi){ const f=aEl(el.dataset.isi); if(f){ f.value=el.value; f.dispatchEvent(new Event('input',{bubbles:true})); }
    const k={formNama:'nama',formKontak:'wa'}[el.dataset.isi];
    if(k&&ALUR.err&&ALUR.err.k===k){ ALUR.err=null; const fld=el.closest('.al-fld'); fld?.classList.remove('al-err'); const m=fld?.nextElementSibling; if(m&&m.classList.contains('al-errmsg')) m.remove(); }
    return; }
  if(el.hasAttribute('data-sel-mobil')&&e.type==='change'){ if(el.value) alurPilihMobil(el.value,true); return; }
  if(el.hasAttribute('data-tgl-lain')&&e.type==='change'){ alurTanggal(el.value); return; }
  if(el.hasAttribute('data-setuju')){ aEl('formSetuju').checked=el.checked; if(el.checked&&ALUR.err&&ALUR.err.k==='setuju'){ ALUR.err=null; renderAlur(); } }
}
async function alurBayar(){
  const k=alurKurang(3); if(k){ alurKe(3,k); return; }
  ALUR.sibuk=true; alurRenderBar();
  try{ await handleFormSubmitMidtrans({preventDefault(){}}); }
  finally{ ALUR.sibuk=false; alurRenderBar(); }
}
// Data dari server berubah (mobil, destinasi, ketersediaan tanggal) → gambar ulang bila halaman pemesanan terbuka
setInterval(()=>{ if(!ALUR.buka) return; const sig=[ARMADA_DATA.length,DEST_CARDS.length,[...PENUH].join(','),aEl('formTanggal')?.value].join('|'); if(sig!==ALUR.sig){ const ada=ALUR.sig!=null; ALUR.sig=sig; if(ada) renderAlur(); } },700);
