/* [MAIN.JS] - FIXED 100% - GAMBAR ARMADA MUNCUL */

/* [MAIN.JS] - FIXED 100% - GAMBAR ARMADA MUNCUL */

var TRANSLATIONS={id:{nav_home:"Beranda",nav_dest:"Paket Wisata",nav_fleet:"Sewa Mobil",nav_book:"Pesan Sekarang",hero_badge:"",hero_h1a:"Tempera",hero_h1b:"Private Trip Bandung",hero_desc:"Lembang • Ciwidey • Pangalengan • Dago",hero_cta1:"Jelajahi Paket",hero_cta2:"Lihat Armada",dest_title:"Paket Wisata Bandung Favorit 2025",dest_sub:"1 Wilayah Lebih Efisien & Hemat",fleet_title:"Armada Sewa Mobil Bandung",book_title:"Booking Sewa Mobil & Paket Wisata Bandung",step1:"Langkah 1: Pilih Wilayah Biar Hemat (Traveloka Style)",step2:"Langkah 2: Pilih Destinasi (Centang yang Mau Dikunjungi)",form_name:"Nama Lengkap *",form_armada:"Pilih Armada 12 Jam All-In *",form_date:"Tanggal *",form_time:"Jam Jemput",form_pax:"Jumlah Peserta *",form_note:"Catatan / Lokasi Jemput",summary:"Rincian Biaya",btn_wa:"Kirim Pesanan via WhatsApp"},en:{nav_home:"Home",nav_dest:"Tour Packages",nav_fleet:"Car Rental",nav_book:"Book Now",hero_badge:"",hero_h1a:"Tempera",hero_h1b:"Private Trip Bandung",hero_desc:"Lembang • Ciwidey • Pangalengan • Dago",hero_cta1:"Explore Packages",hero_cta2:"View Fleet",dest_title:"Favorite Bandung Tour Packages 2025",dest_sub:"1 Region More Efficient",fleet_title:"Bandung Car Rental Fleet",book_title:"Booking Bandung Car Rental & Tour",step1:"Step 1: Choose Region",step2:"Step 2: Choose Destinations",form_name:"Full Name *",form_armada:"Choose Fleet *",form_date:"Date *",form_time:"Pickup Time",form_pax:"Guests *",form_note:"Notes / Pickup",summary:"Price Summary",btn_wa:"Send via WhatsApp"},ms:{nav_home:"Laman Utama",nav_dest:"Pakej Pelancongan",nav_fleet:"Sewa Kereta",nav_book:"Tempah Sekarang",hero_badge:"",hero_h1a:"Tempera",hero_h1b:"Private Trip Bandung",hero_desc:"Lembang • Ciwidey • Pangalengan • Dago",hero_cta1:"Jelajahi Paket",hero_cta2:"Lihat Armada",dest_title:"Pakej Pelancongan Bandung 2025",dest_sub:"1 Wilayah Lebih Efisien",fleet_title:"Armada Sewa Kereta Bandung",book_title:"Tempahan Sewa Kereta Bandung",step1:"Langkah 1: Pilih Wilayah",step2:"Langkah 2: Pilih Destinasi",form_name:"Nama Penuh *",form_armada:"Pilih Armada *",form_date:"Tarikh *",form_time:"Masa Jemput",form_pax:"Bil. Peserta *",form_note:"Catatan / Lokasi",summary:"Ringkasan Harga",btn_wa:"Hantar via WhatsApp"}};
var currentLang=localStorage.getItem('tempera_lang')||'id';
function applyLanguage(lang){currentLang=lang;localStorage.setItem('tempera_lang',lang);const dict=TRANSLATIONS[lang];document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(dict[k])el.innerText=dict[k];});const flagMap={id:'🇮🇩',en:'🇬🇧',ms:'🇲🇾'};const labelMap={id:'ID',en:'EN',ms:'MY'};document.getElementById('currentLangFlag').innerText=flagMap[lang];document.getElementById('currentLang').innerText=labelMap[lang];document.querySelectorAll('#langMenu [data-lang]').forEach(b=>{const c=b.querySelector('.check');if(b.dataset.lang===lang){b.style.background='var(--bg-section-alt)';c.classList.remove('hidden')}else{b.style.background='transparent';c.classList.add('hidden')}});document.documentElement.lang=lang;}
function changeLanguage(lang){applyLanguage(lang);document.getElementById('langMenu').classList.add('hidden');}
const THEMES={classic:{name:'Classic Luxury',icon:'✨'},sky:{name:'Sky Blue Bright',icon:'☀'},tropical:{name:'Tropical Paradise',icon:'🌴'},mountain:{name:'Adventure Mountain',icon:'🏔'},ocean:{name:'Ocean Blue Explorer',icon:'🌊'},sunset:{name:'Sunset Wanderlust',icon:'🌅'},minimal:{name:'Minimalist',icon:'⚪'},heritage:{name:'Royal Heritage',icon:'👑'}};
const THEME_WEATHER={classic:{accent:'#E5B80B',light:'#FFF8DC',dark:'#0A0A0A'},sky:{accent:'#0EA5E9',light:'#E0F2FE',dark:'#0C4A6E'},tropical:{accent:'#06B6D4',light:'#CFFAFE',dark:'#164E63'},mountain:{accent:'#10B981',light:'#D1FAE5',dark:'#022C22'},ocean:{accent:'#2563EB',light:'#DBEAFE',dark:'#1E3A8A'},sunset:{accent:'#F97316',light:'#FFEDD5',dark:'#431407'},minimal:{accent:'#334155',light:'#F1F5F9',dark:'#0F172A'},heritage:{accent:'#7C3AED',light:'#EDE9FE',dark:'#1E1B4B'}};
const LOTTIE_MAP = {
  sunny: '',
  partly_cloudy_day: '',
  cloudy: '',
  fog: '',
  drizzle: '',
  rain: '',
  thunder: ''
};
function themeByTime(){const h=new Date().getHours();if(h>=5&&h<7)return'sunset';if(h>=7&&h<10)return'sky';if(h>=10&&h<13)return'tropical';if(h>=13&&h<15)return'mountain';if(h>=15&&h<17)return'minimal';if(h>=17&&h<19)return'heritage';if(h>=19&&h<22)return'sunset';return'classic';}
function getWeatherType(code){if(code===0) return 'sunny'; if([1,2].includes(code)) return 'partly'; if(code===3) return 'cloudy'; if([45,48].includes(code)) return 'fog'; if([51,53,55,56,57].includes(code)) return 'drizzle'; if([61,63,65,80,81,82].includes(code)) return 'rain'; if([95,96,99].includes(code)) return 'thunder'; return 'partly';}
function getWeatherIcon(code,isDay){const t=getWeatherType(code); if(t==='sunny') return isDay?'☀':'🌙'; if(t==='partly') return isDay?'🌤':'☁'; if(t==='cloudy') return '☁'; if(t==='fog') return '🌫'; if(t==='drizzle') return '🌦'; if(t==='rain') return '🌧'; if(t==='thunder') return '⛈'; return '⛅';}
function getWeatherDesc(code){const m={0:'Cerah',1:'Cerah Berawan',2:'Berawan Sebagian',3:'Mendung',45:'Berkabut',48:'Kabut Tebal',51:'Gerimis Ringan',53:'Gerimis',55:'Gerimis Lebat',61:'Hujan Ringan',63:'Hujan Sedang',65:'Hujan Lebat',80:'Hujan Ringan',81:'Hujan Sedang',82:'Hujan Lebat',95:'Petir',96:'Petir + Hujan',99:'Badai Petir'}; return m[code]||'Berawan';}
let lottieMain=null;
function renderMainLottie(code,isDay){
  const container=document.getElementById('weather-lottie-main'); const emoji=getWeatherIcon(code,isDay);
  const type=getWeatherType(code); const key=type==='sunny'?'sunny':type==='thunder'?'thunder':type==='rain'?'rain':type==='drizzle'?'drizzle':type==='fog'?'fog':type==='cloudy'?'cloudy':'partly_cloudy_day';
  const url=LOTTIE_MAP[key]; container.innerHTML=`<div class="text-[72px]">${emoji}</div>`;
  if(typeof lottie==='undefined'||!url) return;
  try{ if(lottieMain){lottieMain.destroy();} const anim=lottie.loadAnimation({container:container,renderer:'svg',loop:true,autoplay:true,path:url}); lottieMain=anim; anim.addEventListener('data_failed',()=>{container.innerHTML=`<div class="text-[72px]">${emoji}</div>`;}); }catch(e){}
}
function renderWeatherFX(type, themeKey){
  const fx=document.getElementById('weather-fx'); if(!fx) return; fx.innerHTML=''; const theme=THEME_WEATHER[themeKey]||THEME_WEATHER.classic; fx.style.color=theme.accent;
  if(type==='rain'){ for(let i=0;i<45;i++){const d=document.createElement('div'); d.className='rain-drop'; d.style.left=Math.random()*100+'%'; d.style.animationDuration=(0.6+Math.random()*0.8)+'s'; d.style.animationDelay=Math.random()*2+'s'; fx.appendChild(d);} }
  else if(type==='drizzle'){ for(let i=0;i<25;i++){const d=document.createElement('div'); d.className='drizzle-drop'; d.style.left=Math.random()*100+'%'; d.style.animationDuration=(1+Math.random())+'s'; fx.appendChild(d);} }
  else if(type==='thunder'){ for(let i=0;i<35;i++){const d=document.createElement('div'); d.className='rain-drop'; d.style.left=Math.random()*100+'%'; d.style.animationDuration=(0.5+Math.random()*0.5)+'s'; d.style.height='22px'; fx.appendChild(d);} const fl=document.createElement('div'); fl.className='thunder-flash'; fx.appendChild(fl); }
  else if(type==='fog'){ for(let i=0;i<3;i++){const f=document.createElement('div'); f.className='fog-layer'; f.style.top=(20+i*30)+'%'; f.style.animationDuration=(10+i*4)+'s'; fx.appendChild(f);} }
  else if(type==='cloudy'){ for(let i=0;i<6;i++){const c=document.createElement('div'); c.className='cloud-dot'; c.style.width=(40+Math.random()*60)+'px'; c.style.height=(20+Math.random()*20)+'px'; c.style.left=Math.random()*80+'%'; c.style.top=Math.random()*70+'%'; fx.appendChild(c);} }
  else if(type==='sunny'){ for(let i=0;i<12;i++){const r=document.createElement('div'); r.className='sun-ray'; r.style.transform=`translate(-50%,-100%) rotate(${i*30}deg)`; fx.appendChild(r);} }
}
function applyWeatherThemeAdaptive(isDay, code){
  window.lastWeatherIsDay=isDay; window.lastWeatherCode=code;
  const themeKey=document.documentElement.getAttribute('data-theme')||'classic';
  const theme=THEME_WEATHER[themeKey]||THEME_WEATHER.classic;
  const type=getWeatherType(code);
  const card=document.getElementById('weather-main-card');
  const orb=document.getElementById('weather-glow-orb');
  if(!card) return;
  let bg='', border='', shadow='';
  if(isDay){
    if(type==='sunny'){ bg=`linear-gradient(135deg, ${theme.light} 0%, white 40%, ${theme.accent}22 100%)`; border=`${theme.accent}66`; shadow=`0 0 60px ${theme.accent}30`; }
    else if(type==='partly'||type==='cloudy'){ bg=`linear-gradient(135deg, white 0%, ${theme.light} 90%)`; border=`${theme.accent}44`; shadow=`0 0 40px ${theme.accent}18`; }
    else if(type==='fog'){ bg=`linear-gradient(135deg, #F8FAFC 0%, ${theme.light} 100%)`; border=`${theme.accent}66`; }
    else if(type==='drizzle'||type==='rain'){ bg=`linear-gradient(135deg, ${theme.light} 0%, #E0F2FE 60%, #BFDBFE 100%)`; border=`${theme.accent}77`; shadow=`0 0 50px ${theme.accent}28`; }
    else if(type==='thunder'){ bg=`linear-gradient(135deg, #1E293B 0%, ${theme.dark} 100%)`; border=`${theme.accent}AA`; shadow=`0 0 70px ${theme.accent}45`; }
  }else{
    bg=`radial-gradient(circle at 85% 15%, ${theme.accent}35 0%, transparent 50%), linear-gradient(135deg, ${theme.dark}E6 0%, rgba(0,0,0,0.75) 100%)`;
    border=`${theme.accent}55`;
    shadow=`0 0 60px ${theme.accent}30, inset 0 1px 0 rgba(255,255,255,0.1)`;
    card.style.backdropFilter='blur(24px)';
    card.style.webkitBackdropFilter='blur(24px)';
  }
  if(isDay){
    card.style.backdropFilter='blur(24px)';
    card.style.webkitBackdropFilter='blur(24px)';
  }
  card.style.background=bg; card.style.borderColor=border; card.style.boxShadow=shadow;
  if(orb){ orb.style.background=`radial-gradient(circle, ${theme.accent}50 0%, transparent 70%)`; }
  const primaryIds=['weather-location','weather-temp','weather-degree','weather-humidity','weather-wind','weather-daynight','weather-desc'];
  primaryIds.forEach(id=>{
    const el=document.getElementById(id);
    if(!el) return;
    if(isDay){ el.style.removeProperty('color'); }
    else{ el.style.color='#FFFFFF'; }
  });
  ['lembang','ciwidey','pangalengan'].forEach(k=>{
    const el=document.getElementById('card-'+k);
    if(!el) return;
    const nameEl=el.querySelector('p.font-bold');
    if(nameEl){
      if(isDay){ nameEl.style.removeProperty('color'); }
      else{ nameEl.style.color='#FFFFFF'; }
    }
  });
  renderWeatherFX(type, themeKey);
}
let userManuallyChangedTheme = false;
function isNightNow(){const h=new Date().getHours();return h>=19||h<5;}
function setTheme(themeKey, forceBlack=null){
  const theme=THEMES[themeKey]||THEMES.classic;
  document.documentElement.setAttribute('data-theme',themeKey);
  localStorage.setItem('tempera_theme_black',themeKey);
  document.getElementById('currentThemeIcon').innerText=theme.icon;
  document.getElementById('currentThemeName').innerText=theme.name;
  document.querySelectorAll('.theme-option').forEach(btn=>{
    if(btn.dataset.themeBtn===themeKey){btn.style.background='var(--bg-section-alt)';btn.style.borderColor='var(--border-color)';}
    else{btn.style.background='transparent';btn.style.borderColor='transparent';}
  });
  document.getElementById('themeMenu').classList.add('hidden');
  if(forceBlack===true){document.documentElement.classList.add('is-night');}
  else if(forceBlack===false){document.documentElement.classList.remove('is-night');}
  else{if(isNightNow()){document.documentElement.classList.add('is-night');}else{document.documentElement.classList.remove('is-night');}}
  if(window.lastWeatherIsDay!==undefined){applyWeatherThemeAdaptive(window.lastWeatherIsDay, window.lastWeatherCode||0);}
}
function toggleThemeMenu(e){e.stopPropagation();document.getElementById('themeMenu').classList.toggle('hidden');document.getElementById('langMenu').classList.add('hidden');}
function toggleDropdown(e){e.stopPropagation();document.getElementById('langMenu').classList.toggle('hidden');document.getElementById('themeMenu').classList.add('hidden');}
window.addEventListener('click',()=>{document.getElementById('langMenu')?.classList.add('hidden');document.getElementById('themeMenu')?.classList.add('hidden'); document.getElementById('mobileMenu')?.classList.add('hidden');});
function toggleMobileMenu(e){ if(e) e.stopPropagation(); const m=document.getElementById('mobileMenu'); m.classList.toggle('hidden'); }
function closeMobileMenu(){ document.getElementById('mobileMenu')?.classList.add('hidden'); }
function handlePesanSekarang(e){if(e)e.preventDefault();document.getElementById('pesan').scrollIntoView({behavior:'smooth'});}

// FIX: ARMADA DATA - semua image ada di folder images/
const ARMADA_DATA=[
{id:'calya',name:'Toyota Calya / Sigra',shortName:'Calya / Sigra',badge:'Ekonomis • 4 Nyaman',image:'calya-black-gold.jpg',images:['calya-black-gold.jpg','calya-white.jpg'],capacity:'4 Nyaman',capacityNum:4,capacityMax:6,baggage:'2 koper kabin kecil',maxInfo:'Max 6 tanpa bagasi',note:'⚠ Tidak muat 6 + koper besar',noteClass:'text-amber-600',price:550000,span:'armada-card-uniform'},
{id:'avanza',name:'Toyota Avanza / Xenia New',shortName:'Avanza / Xenia New',badge:'Paling Laris • 5 Nyaman',image:'avanza-black-gold.jpg',images:['avanza-black-gold.jpg','avanza-white.jpg'],capacity:'5 Nyaman',capacityNum:5,capacityMax:6,baggage:'1 besar + 2 kecil',maxInfo:'Max 6 tanpa koper besar',note:'✅ Muat stroller lipat',noteClass:'text-emerald-600',price:650000,span:'armada-card-uniform'},
{id:'xpander',name:'Mitsubishi Xpander',shortName:'Xpander',badge:'MPV Nyaman • 6 Nyaman',image:'innova-black-gold.jpg',images:['xpander-black.jpg','xpander-white.jpg'],capacity:'6 Nyaman',capacityNum:6,capacityMax:7,baggage:'1 besar + 2 kecil',maxInfo:'Max 7 tanpa bagasi besar',note:'✅ Kabin paling lega',noteClass:'text-emerald-600',price:800000,span:'armada-card-uniform'},
{id:'innova',name:'Toyota Innova Reborn / Zenix',shortName:'Innova Reborn / Zenix',badge:'Best Seller • 6 Nyaman',image:'innova-black-gold.jpg',images:['innova-black-gold.jpg','innova-white.jpg'],capacity:'6 Nyaman',capacityNum:6,capacityMax:7,baggage:'2 besar + 2 kecil',maxInfo:'Max 7 tipe G tanpa bagasi besar',note:'✅ Rekomendasi luar kota',noteClass:'text-emerald-600',price:950000,span:'armada-card-uniform'},
{id:'hiace',name:'Toyota Hiace Premio',shortName:'Hiace Premio',badge:'Premium • 11 Nyaman',image:'hiace-black-gold.jpg',images:['hiace-black-gold.jpg','hiace-white.jpg'],capacity:'11 Nyaman',capacityNum:11,capacityMax:14,baggage:'8-10 koper besar',maxInfo:'Max resmi 12, modif 14 tanpa bagasi besar',note:'ℹ 12 orang = lipat 2 kursi untuk koper',noteClass:'text-slate-500',price:1600000,span:'armada-card-uniform'}
];

const DESTINASI_DATA={lembang:["Tangkuban Perahu","Floating Market","Farmhouse Susu Lembang","Orchid Forest Cikole","Dusun Bambu","The Great Asia Africa","Lembang Park & Zoo","De Ranch Lembang","Grafika Cikole","Maribaya & The Lodge","Fairy Garden","Kebun Strawberry Lembang"],dago:["Tebing Keraton","Dago Dreampark","Tahura Djuanda","Punclut & Cakrawala","Lawangwangi & Dago Tea House","Bukit Bintang","Gedung Sate, Braga & Alun-alun","Trans Studio Bandung"],ciwidey:["Kawah Putih","Ranca Upas & Rusa","Situ Patenggang","Glamping Lakeside Rancabali","Kawah Rengganis","Barusen Hills","Ciwidey Valley","Kebun Teh Rancabali","Pinisi Resto & Danau"],pangalengan:["Nimo Highland","Situ Cileunca & Rafting","Wayang Windu Panenjoan","Pineus Tilu","Sunrise Point Cukul","Kebun Teh Malabar","Riung Gunung","Situ Cipanunjang"]};
function formatPrice(p){return 'Rp '+p.toLocaleString('id-ID');}
function getSelectedArmada(){const s=document.getElementById('calcUnit');if(!s||!s.value||s.selectedIndex<=0)return null;const o=s.options[s.selectedIndex];return{id:o.dataset.id,name:o.dataset.name,cap:parseInt(o.dataset.cap)||0,capmax:parseInt(o.dataset.capmax)||0,price:parseInt(o.value)||0};}
function selectUnitFromCard(id){const s=document.getElementById('calcUnit');for(let i=0;i<s.options.length;i++){if(s.options[i].dataset.id===id){s.selectedIndex=i;break;}}calculateLive();checkCapacityLive();document.getElementById('pesan').scrollIntoView({behavior:'smooth'});}
function initInnerArmadaSliders(){document.querySelectorAll('.armada-img-container').forEach(c=>{const slides=c.querySelectorAll('.armada-img-slide');const dots=c.querySelectorAll('.armada-img-dot');if(slides.length<=1) return;let idx=0;const show=(i)=>{slides.forEach((s,j)=>s.classList.toggle('active',j===i));dots.forEach((d,j)=>{d.style.background=j===i?'var(--accent)':'var(--border-soft)';});};setInterval(()=>{idx=(idx+1)%slides.length;show(idx);},4000);});}

function renderArmada(){
const cards=document.getElementById('armada-cards');const tbody=document.getElementById('armada-harga-body');const sel=document.getElementById('calcUnit');const destWrapper=document.getElementById('destinasi-wrapper');
cards.innerHTML='';tbody.innerHTML='';sel.innerHTML='';destWrapper.innerHTML='';
const groupIcons={lembang:'🌲 Lembang (12 Destinasi)',dago:'🌃 Dago & Kota (8 Destinasi)',ciwidey:'⛰ Ciwidey (9 Destinasi)',pangalengan:'☕ Pangalengan (8 Destinasi)'};
Object.keys(DESTINASI_DATA).forEach(g=>{
  const w=document.createElement('div');w.className='rounded-xl border overflow-hidden shadow-sm';w.style.background='var(--bg-section-alt)';w.style.borderColor='var(--border-soft)';
  w.innerHTML=`<button type="button" onclick="toggleAccordion('${g}')" class="w-full flex items-center justify-between p-4 text-sm font-semibold" style="color:var(--text-primary)"><span>${groupIcons[g]}</span><div class="flex items-center gap-2"><span id="count-${g}" class="text-[10px] px-2 py-1 rounded-full font-bold" style="background:var(--accent-glow);color:var(--accent)">0 dipilih</span>▾</div></button><div id="acc-${g}" class="accordion-content"><div class="p-4 pt-0"><div class="flex justify-between items-center mb-3 pb-2 border-b" style="border-color:var(--border-soft)"><span class="text-[11px]" style="color:var(--text-muted)">Pilih destinasi yang ingin dikunjungi</span><button type="button" onclick="selectAllInGroup('${g}',true)" class="text-[11px] font-bold" style="color:var(--accent)">Pilih Semua</button></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs" id="dest-${g}"></div><div class="mt-3 flex justify-end"><button type="button" onclick="selectAllInGroup('${g}',false)" class="text-[10px]" style="color:var(--text-muted)">Hapus Semua</button></div></div></div>`;
  destWrapper.appendChild(w);
  const cont=w.querySelector(`#dest-${g}`);
  cont.innerHTML=DESTINASI_DATA[g].map(v=>`<label class="dest-item flex gap-2 items-center cursor-pointer"><input type="checkbox" name="destinasi" data-group="${g}" value="${v}" class="dest-checkbox w-4 h-4 rounded"><span style="color:var(--text-secondary)">${v}</span></label>`).join('');
});
document.querySelectorAll('input[name="destinasi"]').forEach(cb=>cb.addEventListener('change',calculateLive));
const placeholder = document.createElement('option');
placeholder.value = "";
placeholder.textContent = "— Pilih Armada Dulu —";
placeholder.disabled = true;
placeholder.selected = true;
sel.appendChild(placeholder);
ARMADA_DATA.forEach(unit=>{
const card=document.createElement('div');card.className=`${unit.span} rounded-[24px] overflow-hidden flex flex-col h-full theme-card border`;
// FIX UTAMA DISINI: pakai images/ di depan
card.innerHTML=`<div class="h-48 bg-black relative overflow-hidden armada-img-container"><div class="armada-img-track relative w-full h-full">${(unit.images||[unit.image]).map((img,i)=>`<div class="armada-img-slide ${i===0?'active':''}"><img src="images/${img}" loading="lazy" alt="Sewa ${unit.name} Bandung" class="w-full h-full object-contain p-2"></div>`).join('')}</div><div class="absolute top-3 left-3 px-3 py-1 rounded-full z-10" style="background:var(--accent);color:white"><span class="text-[9px] font-bold uppercase">${unit.badge}</span></div><div class="absolute top-3 right-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] px-2 py-1 rounded-full uppercase font-bold z-10">🟢 Ready</div><div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">${(unit.images||[unit.image]).map((_,i)=>`<div class="w-1.5 h-1.5 rounded-full armada-img-dot" style="background:${i===0?'var(--accent)':'var(--border-soft)'}"></div>`).join('')}</div></div><div class="p-6 flex flex-col flex-grow" style="background:var(--bg-card)"><h3 class="text-[15px] font-bold" style="color:var(--text-primary)">${unit.name}</h3><p class="text-[10px] uppercase mb-3 font-bold" style="color:var(--accent)">${unit.capacity} • Max ${unit.capacityMax}</p><ul class="text-[11px] space-y-2.5 mb-6 border-y py-4 flex-grow" style="color:var(--text-secondary);border-color:var(--border-soft)"><li>👥 <b style="color:var(--text-primary)">${unit.capacity}</b> + driver • Max ${unit.capacityMax}</li><li>🧳 ${unit.baggage}</li><li>💺 ${unit.maxInfo}</li><li class="${unit.noteClass}">${unit.note}</li></ul><button type="button" onclick="selectUnitFromCard('${unit.id}')" class="block text-center w-full font-bold py-3 rounded-full text-[10px] mt-auto" style="background:var(--accent);color:white">Pilih Unit - ${formatPrice(unit.price)} / 12 Jam</button></div>`;
cards.appendChild(card);
const tr=document.createElement('tr');tr.innerHTML=`<td class="py-5 px-6 font-bold text-[13px]">${unit.name}</td><td class="py-5 px-6 text-center"><b>${unit.capacityNum}</b> / Max ${unit.capacityMax}</td><td class="py-5 px-6 text-xs">${unit.baggage}</td><td class="py-5 px-6 font-bold text-right" style="color:var(--accent)">${formatPrice(unit.price)}</td><td class="py-5 px-6 text-center"><button onclick="selectUnitFromCard('${unit.id}')" class="border text-[10px] px-4 py-1.5 rounded-full" style="background:var(--bg-card);border-color:var(--border-color)">Pilih</button></td>`;tbody.appendChild(tr);
const opt=document.createElement('option');opt.value=unit.price;opt.dataset.id=unit.id;opt.dataset.name=unit.shortName;opt.dataset.cap=unit.capacityNum;opt.dataset.capmax=unit.capacityMax;opt.textContent=`${unit.name} - ${formatPrice(unit.price)} / 12 Jam`;sel.appendChild(opt);
});
setTimeout(initInnerArmadaSliders,200);
}
function toggleAccordion(g){const c=document.getElementById('acc-'+g);const isOpen=c.classList.contains('open');document.querySelectorAll('.accordion-content').forEach(x=>x.classList.remove('open'));if(!isOpen)c.classList.add('open');}
function focusRegion(r){toggleAccordion(r);document.getElementById('acc-'+r)?.scrollIntoView({behavior:'smooth',block:'center'});}
function selectAllInGroup(g, checked){document.querySelectorAll(`input[name="destinasi"][data-group="${g}"]`).forEach(cb=>cb.checked=checked);calculateLive();}
function checkCapacityLive(){const j=parseInt(document.getElementById('formJumlah').value)||0;const info=document.getElementById('resCapacityInfo');const txt=document.getElementById('resCapacityText');if(j<=0||!info||!txt){if(info)info.classList.add('hidden');return false;}const armada=getSelectedArmada();if(!armada){info.classList.add('hidden');return false;}info.classList.remove('hidden');if(j<=armada.cap){txt.innerHTML=`<span style="color:#059669">✅ ${j} orang muat nyaman di ${armada.name}</span>`;return false;}else if(j<=armada.capmax){txt.innerHTML=`<span style="color:#D97706">⚠ ${j} orang melebihi nyaman (${armada.cap}) tapi masih max ${armada.capmax}</span>`;return 'over_comfort';}else{txt.innerHTML=`<span style="color:#DC2626">🚫 ${j} orang melebihi MAX ${armada.capmax}</span>`;return 'over_max';}}

function calculateLive(){
const sel=document.getElementById('calcUnit');
const base=parseInt(sel.value)||0;
const hasArmada = sel.value && sel.selectedIndex>0;
const l=document.querySelectorAll('input[name="destinasi"][data-group="lembang"]:checked');const d=document.querySelectorAll('input[name="destinasi"][data-group="dago"]:checked');const c=document.querySelectorAll('input[name="destinasi"][data-group="ciwidey"]:checked');const p=document.querySelectorAll('input[name="destinasi"][data-group="pangalengan"]:checked');
document.getElementById('count-lembang').innerText=`${l.length} dipilih`;document.getElementById('count-dago').innerText=`${d.length} dipilih`;document.getElementById('count-ciwidey').innerText=`${c.length} dipilih`;document.getElementById('count-pangalengan').innerText=`${p.length} dipilih`;
const hasUtara=l.length>0||d.length>0;const hasCiwidey=c.length>0;const hasPangalengan=p.length>0;
let regionCount=0;if(hasUtara)regionCount++;if(hasCiwidey)regionCount++;if(hasPangalengan)regionCount++;
// LOGIKA BARU BIAYA CROSS - FAIR
let cost=0;let labelCost="";let crossType="none";
if(regionCount===2){
  if(hasCiwidey && hasPangalengan){
    cost=400000; labelCost=" (Beda Lembah Selatan)"; crossType="beda_lembah";
  } else {
    cost=400000; labelCost=" (Lintas Utara-Selatan)"; crossType="utara_selatan";
  }
} else if(regionCount===3){
  cost=800000; labelCost=" (3 Penjuru)"; crossType="tiga_penjuru";
}
const armada=getSelectedArmada();
if(!hasArmada){
  document.getElementById('resArmadaName').innerText='Belum dipilih';
  document.getElementById('resArmadaCap').innerText='Pilih armada di atas';
  document.getElementById('resBasePrice').innerText='Rp 0';
  document.getElementById('resRegionCost').innerText='Rp 0';
  document.getElementById('resTotalPrice').innerText='Rp 0';
  document.getElementById('resGrandTotal').innerText='Rp 0';
  document.getElementById('mobileArmadaName').innerText='Belum dipilih';
  document.getElementById('mobileTotalPrice').innerText='Rp 0';
  document.getElementById('mobileStickyBar').classList.add('hidden');
} else {
  document.getElementById('resArmadaName').innerText=armada?armada.name:'Avanza';
  document.getElementById('resArmadaCap').innerText=armada?`${armada.cap} Nyaman • Max ${armada.capmax}`:'5 Nyaman • Max 6';
  document.getElementById('resBasePrice').innerText='Rp '+base.toLocaleString('id-ID');
  document.getElementById('resRegionCost').innerText='Rp '+cost.toLocaleString('id-ID');
  document.getElementById('resRegionLabel').innerText=labelCost;
  document.getElementById('resTotalPrice').innerText='Rp '+(base+cost).toLocaleString('id-ID');
  document.getElementById('resGrandTotal').innerText='Rp '+(base+cost).toLocaleString('id-ID');
  document.getElementById('mobileArmadaName').innerText=armada?armada.name:'Avanza';
  document.getElementById('mobileTotalPrice').innerText='Rp '+(base+cost).toLocaleString('id-ID');
  document.getElementById('mobileStickyBar').classList.remove('hidden');
}
const listEl=document.getElementById('resSelectedList');const all=document.querySelectorAll('input[name="destinasi"]:checked');if(all.length==0)listEl.innerText='Belum ada';else{let g={};all.forEach(cb=>{if(!g[cb.dataset.group])g[cb.dataset.group]=[];g[cb.dataset.group].push(cb.value);});let t='';for(let k in g){t+=`${k.toUpperCase()}: ${g[k].join(', ')} | `;}listEl.innerText=t.slice(0,-3);}
const warn=document.getElementById('crossTripWarning');

if(regionCount>=2){
  warn.classList.remove('hidden');
  // RENDER WARINING SESUAI TIPE
  if(crossType==="beda_lembah"){
    warn.className="rounded-[20px] border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-5 mt-4";
    warn.innerHTML=`
      <div class="flex gap-3">
        <div class="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold shrink-0">!</div>
        <div class="flex-1">
          <div class="flex items-center gap-2 flex-wrap"><p class="text-[11px] font-black tracking-[0.12em] text-amber-800 uppercase">Sama-Sama Selatan, Tapi Beda Lembah</p><span class="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-white">62 KM MEMUTAR</span></div>
          <p class="mt-2 text-[13px] font-semibold leading-snug text-zinc-800">Ciwidey itu <b>Selatan Barat</b>, Pangalengan itu <b>Selatan Timur</b>. Gak ada jalan tembus langsung.</p>
          <div class="mt-3 bg-white rounded-xl border border-amber-200 p-3 flex items-center justify-between">
            <div class="text-center"><div class="text-[9px] text-zinc-400">CIWIDEY</div><div class="font-bold text-[11px]">Kawah Putih</div></div>
            <div class="flex-1 px-2 text-center"><div class="text-[9px] text-zinc-400">harus muter via</div><div class="text-[10px] font-bold text-amber-600">Banjaran - 62 KM • 2 Jam</div><div class="h-0.5 bg-amber-200 my-1 border-dashed border-t"></div></div>
            <div class="text-center"><div class="text-[9px] text-zinc-400">PANGALENGAN</div><div class="font-bold text-[11px]">Wayang Windu</div></div>
          </div>
          <div class="mt-3 rounded-xl bg-white/90 p-3 border border-amber-200">
            <div class="flex justify-between text-[11px]"><span class="text-zinc-500">Paket dasar</span><span class="font-semibold">Rp ${base.toLocaleString('id-ID')}</span></div>
            <div class="flex justify-between text-[11px] mt-1"><span class="text-amber-700 font-medium">+ Beda Lembah (BBM + waktu)</span><span class="font-bold text-amber-700">Rp ${cost.toLocaleString('id-ID')}</span></div>
            <div class="mt-2 flex justify-between border-t pt-2 text-[13px] font-black"><span>Total</span><span>Rp ${(base+cost).toLocaleString('id-ID')}</span></div>
          </div>
          <div class="mt-3 flex gap-2"><button onclick="selectAllInGroup('pangalengan',false)" class="px-3 py-1.5 bg-white border rounded-full text-[10px] font-bold">Pilih Ciwidey aja (Hemat)</button><button onclick="selectAllInGroup('ciwidey',false)" class="px-3 py-1.5 bg-white border rounded-full text-[10px] font-bold">Pilih Pangalengan aja</button></div>
        </div>
      </div>`;
  } else if(crossType==="utara_selatan"){
    warn.className="rounded-[20px] border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 p-5 mt-4";
    warn.innerHTML=`
      <div class="flex gap-3">
        <div class="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold shrink-0">!</div>
        <div class="flex-1">
          <p class="text-[11px] font-black tracking-[0.12em] text-orange-800 uppercase">Rute Berlawanan Arah - Utara vs Selatan</p>
          <p class="mt-2 text-[13px] font-semibold text-zinc-800">Lembang itu <b>Utara</b>, Ciwidey/Pangalengan itu <b>Selatan</b>. Harus lewat tengah kota Bandung, macet 2x.</p>
          <div class="mt-3 bg-white rounded-xl border border-orange-200 p-3 text-center">
            <div class="flex items-center justify-center gap-2 text-[11px] font-bold"><span>LEMBANG (Utara)</span><span class="text-orange-500">↔ 65KM ↕</span><span>CIWIDEY (Selatan)</span></div>
            <div class="text-[10px] text-zinc-500 mt-1">Total muter ~90KM • 3-4 Jam di jalan kalau 1 hari</div>
          </div>
          <div class="mt-3 rounded-xl bg-white/90 p-3 border border-orange-200"><div class="flex justify-between text-[11px] mt-1"><span class="text-orange-700 font-medium">+ Lintas Utara-Selatan</span><span class="font-bold text-orange-700">Rp ${cost.toLocaleString('id-ID')}</span></div><div class="mt-2 flex justify-between border-t pt-2 text-[13px] font-black"><span>Total</span><span>Rp ${(base+cost).toLocaleString('id-ID')}</span></div></div>
          <div class="mt-3"><button onclick="if(confirm('Jadikan 2 hari? Hari 1 Lembang, Hari 2 Ciwidey+Pangalengan')){alert('Chat admin untuk paket 2D1N!')}" class="w-full bg-zinc-900 text-white rounded-full py-2.5 text-[11px] font-bold">💡 Mending jadi 2 hari? (Lebih santai, driver rekomen)</button></div>
        </div>
      </div>`;
  } else if(crossType==="tiga_penjuru"){
    warn.className="rounded-[20px] border-2 border-zinc-900 bg-zinc-900 text-white p-5 mt-4";
    warn.innerHTML=`
      <div class="flex flex-col">
        <div class="flex items-center gap-2"><span class="bg-amber-400 text-black text-[10px] font-black px-2.5 py-1 rounded-full">3 PENJURU BANDUNG</span><span class="text-[10px] text-zinc-400">UTARA • SELATAN BARAT • SELATAN TIMUR</span></div>
        <p class="mt-3 text-[15px] font-bold leading-tight">Wah, kamu mau muterin Bandung 1 hari penuh! 🔥</p>
        <div class="mt-4 grid grid-cols-3 gap-2 text-center">
          <div class="bg-zinc-800 rounded-xl p-2.5 border border-zinc-700"><div class="text-[9px] text-zinc-400">07:00</div><div class="text-[11px] font-bold mt-1">LEMBANG</div><div class="text-[9px] text-amber-300">Utara</div></div>
          <div class="bg-zinc-800 rounded-xl p-2.5 border border-zinc-700"><div class="text-[9px] text-zinc-400">11:30</div><div class="text-[11px] font-bold mt-1">CIWIDEY</div><div class="text-[9px] text-amber-300">Selatan Barat</div></div>
          <div class="bg-zinc-800 rounded-xl p-2.5 border-2 border-amber-400"><div class="text-[9px] text-amber-400">14:30</div><div class="text-[11px] font-bold mt-1">PANGALENGAN</div><div class="text-[9px] text-amber-300">Selatan Timur</div></div>
        </div>
        <div class="mt-4 rounded-xl bg-white text-black p-3">
          <div class="flex justify-between text-[11px]"><span class="text-zinc-500">Jarak total hari ini</span><span class="font-bold">~152 KM • 7-8 Jam di jalan</span></div>
          <div class="flex justify-between text-[11px] mt-1.5"><span class="text-zinc-500">Waktu foto-foto</span><span class="font-bold text-red-500">Sisa 2 jam doang 😥</span></div>
          <div class="mt-2 pt-2 border-t flex justify-between text-[12px] font-black"><span>+ Biaya 3 Penjuru (BBM + lembur driver)</span><span>Rp ${cost.toLocaleString('id-ID')}</span></div>
          <div class="mt-1 flex justify-between text-[13px] font-black"><span>Total</span><span>Rp ${(base+cost).toLocaleString('id-ID')}</span></div>
        </div>
        <p class="text-[11px] text-zinc-400 mt-3 leading-snug">Jujur, kalau dipaksain 1 hari bakal capek banget. Driver rekomen <b class="text-white">pecah jadi 2 hari</b> biar puas.</p>
        <div class="mt-4 grid grid-cols-1 gap-2">
          <button onclick="window.open('https://wa.me/6285174352575?text=Halo%20mau%20paket%202%20hari%20Lembang%20%2B%20Ciwidey%20Pangalengan','_blank')" class="w-full bg-amber-400 text-black rounded-full py-3 text-[12px] font-black">💡 MAU DIBIKIN 2 HARI AJA? (Lebih santai)</button>
          <div class="grid grid-cols-2 gap-2"><button onclick="selectAllInGroup('lembang',false);selectAllInGroup('dago',false)" class="bg-zinc-800 border border-zinc-700 rounded-full py-2.5 text-[11px] font-bold">Pilih 2 wilayah aja</button><button class="bg-white text-black rounded-full py-2.5 text-[11px] font-black">Tetap 3 wilayah + Rp ${cost.toLocaleString('id-ID')}</button></div>
        </div>
      </div>`;
  }
} else {
  warn.classList.add('hidden');
}
}

function normalizeWA(input){let num=input.replace(/[^0-9]/g,'');if(num.startsWith('0'))num='62'+num.substring(1);if(num.startsWith('8'))num='62'+num;return num;}
let pendingBooking=null;
function handleFormSubmit(e){e.preventDefault();const nama=document.getElementById('formNama').value.trim();const kontakRaw=document.getElementById('formKontak').value.trim();const kontak=normalizeWA(kontakRaw);if(!kontak){alert('Nomor WA tidak valid');return;}const sel=document.getElementById('calcUnit');if(!sel.value){alert('Pilih armada dulu!'); sel.focus(); return;}const hargaDasar=parseInt(sel.value);const jumlah=parseInt(document.getElementById('formJumlah').value)||0;const tanggal=document.getElementById('formTanggal').value,jam=document.getElementById('formJam').value,catatan=document.getElementById('formCatatan').value;const checked=document.querySelectorAll('input[name="destinasi"]:checked');if(checked.length==0){alert('Pilih minimal satu destinasi!');return;}const armada=getSelectedArmada();if(jumlah>armada.capmax){showCapacityModal('over_max',jumlah,armada);return;}let by={lembang:[],dago:[],ciwidey:[],pangalengan:[]};checked.forEach(cb=>{by[cb.dataset.group].push(cb.value);});const hasUtara=by.lembang.length>0||by.dago.length>0;const hasCiwidey=by.ciwidey.length>0;const hasPangalengan=by.pangalengan.length>0;let regionCount=0;if(hasUtara)regionCount++;if(hasCiwidey)regionCount++;if(hasPangalengan)regionCount++;let biaya=0;if(regionCount===2)biaya=400000; else if(regionCount===3)biaya=800000; else biaya=0;pendingBooking={nama,kontak,hargaDasar,jumlah,tanggal,jam,catatan,by,regionCount,biaya,armada};if(jumlah>armada.cap&&jumlah<=armada.capmax){showCapacityModal('over_comfort',jumlah,armada);return;}if(regionCount>=2){if(!confirm(`${regionCount} WILAYAH = BIAYA CROSS Rp ${biaya.toLocaleString('id-ID')}. Tetap lanjut?`))return;}sendToWA(pendingBooking,false);}
function sendToWA(data,forced){let ruteTeks='';if(data.by.lembang.length)ruteTeks+=`\n- Lembang: ${data.by.lembang.join(', ')}`;if(data.by.dago.length)ruteTeks+=`\n- Dago: ${data.by.dago.join(', ')}`;if(data.by.ciwidey.length)ruteTeks+=`\n- Ciwidey: ${data.by.ciwidey.join(', ')}`;if(data.by.pangalengan.length)ruteTeks+=`\n- Pangalengan: ${data.by.pangalengan.join(', ')}`;let msg=`Halo Admin Tempera, saya ingin memesan:\n\n* NAMA: ${data.nama}\n* KONTAK: ${data.kontak}\n* ARMADA: ${data.armada.name}\n* DESTINASI:${ruteTeks}\n\nRINCIAN:\n- Armada: Rp ${data.hargaDasar.toLocaleString('id-ID')}${data.biaya>0?`\n- Cross: Rp ${data.biaya.toLocaleString('id-ID')}`:''}\nTOTAL: Rp ${(data.hargaDasar+data.biaya).toLocaleString('id-ID')}\nGRAND TOTAL ± Rp ${(data.hargaDasar+data.biaya+100000).toLocaleString('id-ID')}\n\n* PESERTA: ${data.jumlah}\n* TANGGAL: ${data.tanggal}\n* JAM: ${data.jam}\n* CATATAN: ${data.catatan}`;window.open(`https://wa.me/6285174352575?text=${encodeURIComponent(msg)}`,'_blank');}
function showCapacityModal(type,jumlah,armada){const modal=document.getElementById('capacityModal');const icon=document.getElementById('capacityModalIcon');const title=document.getElementById('capacityModalTitle');const text=document.getElementById('capacityModalText');const list=document.getElementById('capacityModalList');const actions=document.getElementById('capacityModalActions');if(type==='over_comfort'){icon.innerText='⚠';title.innerText='Melebihi Kapasitas Nyaman';text.innerText=`Anda pesan ${jumlah} orang, nyaman hanya ${armada.cap} orang (max ${armada.capmax}).`;actions.innerHTML=`<button onclick="closeCapacityModal()" class="bg-gray-100 border py-3 rounded-full text-[10px] uppercase">Batal</button><button onclick="forceContinueBooking()" class="bg-amber-500 text-white py-3 rounded-full text-[10px] uppercase">Tetap Lanjut</button>`;}else{icon.innerText='🚫';title.innerText='Melebihi Kapasitas MAX';text.innerText=`TIDAK BISA! ${jumlah} orang melebihi MAX ${armada.name} (${armada.capmax}). Wajib upgrade.`;actions.innerHTML=`<button onclick="closeCapacityModal()" class="bg-gray-100 border py-3 rounded-full text-[10px] uppercase">Ubah Jumlah</button><button onclick="upgradeArmada()" class="py-3 rounded-full text-[10px] uppercase" style="background:var(--accent);color:white">Upgrade</button>`;}modal.classList.remove('hidden');}
function closeCapacityModal(){document.getElementById('capacityModal').classList.add('hidden');}
function upgradeArmada(){const j=parseInt(document.getElementById('formJumlah').value)||0;let t='avanza';if(j<=4)t='calya';else if(j<=5)t='avanza';else if(j<=7)t='innova';else t='hiace';closeCapacityModal();selectUnitFromCard(t);}
function forceContinueBooking(){closeCapacityModal();if(pendingBooking)sendToWA(pendingBooking,true);}
const BANDUNG_LAT=-6.9175; const BANDUNG_LON=107.6191; const LOCATIONS={lembang:{name:'Lembang',lat:-6.8107,lon:107.6167,alt:'1200 mdpl'},ciwidey:{name:'Ciwidey',lat:-7.1,lon:107.45,alt:'1500 mdpl'},pangalengan:{name:'Pangalengan',lat:-7.2,lon:107.57,alt:'1600 mdpl'}};
async function fetchWeather(){
  try{
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${BANDUNG_LAT}&longitude=${BANDUNG_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,is_day&daily=sunrise,sunset&timezone=Asia%2FJakarta&forecast_days=2`;
    const res=await fetch(url); const data=await res.json(); const curr=data.current; const hourly=data.hourly;
    const isDay=curr.is_day===1; const code=curr.weather_code;
    applyWeatherThemeAdaptive(isDay, code);
    document.getElementById('weather-temp').innerText=Math.round(curr.temperature_2m);
    document.getElementById('weather-desc').innerText=getWeatherDesc(code);
    document.getElementById('weather-feel').innerText=`Feels ${Math.round(curr.apparent_temperature)}° • ${curr.precipitation>0?curr.precipitation+'mm ':''}${getWeatherDesc(code)}`;
    renderMainLottie(code,isDay);
    document.getElementById('weather-humidity').innerText=curr.relative_humidity_2m+'%';
    document.getElementById('weather-wind').innerText=Math.round(curr.wind_speed_10m)+' km/h';
    document.getElementById('weather-daynight').innerText=isDay?'☀ Siang':'🌙 Malam';
    document.getElementById('weather-time').innerText=new Date().toLocaleString('id-ID',{weekday:'long',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Jakarta'})+' WIB • Live';
    const hourlyContainer=document.getElementById('weather-hourly'); hourlyContainer.innerHTML=''; let startIdx=0; for(let i=0;i<data.hourly.time.length;i++){ if(new Date(data.hourly.time[i])>=new Date()){startIdx=i;break;} }
    for(let i=startIdx;i<Math.min(startIdx+12,data.hourly.time.length);i++){
      const icon=getWeatherIcon(hourly.weather_code[i],hourly.is_day[i]===1); const temp=Math.round(hourly.temperature_2m[i]); const hourLabel=new Date(data.hourly.time[i]).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Jakarta'});
      const el=document.createElement('div'); el.className='min-w-[68px] rounded-2xl p-2.5 text-center border'; el.style.background='var(--bg-card)'; el.style.borderColor='var(--border-soft)';
      el.innerHTML=`<p class="text-[10px]" style="color:var(--text-muted)">${i===startIdx?'Now':hourLabel}</p><div class="text-[18px] my-1">${icon}</div><p class="text-[12px] font-bold">${temp}°</p>`; hourlyContainer.appendChild(el);
    }
    Object.keys(LOCATIONS).forEach(async key=>{
      try{const loc=LOCATIONS[key]; const u=`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,weather_code,is_day&timezone=Asia%2FJakarta`; const r=await fetch(u); const d=await r.json(); const card=document.getElementById('card-'+key); if(!card) return; const ic=getWeatherIcon(d.current.weather_code,d.current.is_day===1); card.innerHTML=`<div><p class="font-bold text-[13px]">${loc.name}</p><p class="text-[10px]" style="color:var(--text-muted)">${loc.alt} • ${getWeatherDesc(d.current.weather_code)}</p></div><div class="text-right"><div class="text-[22px]">${ic}</div><p class="font-bold text-[16px]">${Math.round(d.current.temperature_2m)}°</p></div>`;}catch(e){}
    });
  }catch(err){ applyWeatherThemeAdaptive(true,0); document.getElementById('weather-temp').innerText='24'; renderMainLottie(0,true); }
}
window.addEventListener('DOMContentLoaded',()=>{
  const h = new Date().getHours();
  const isDay = h >= 5 && h < 19;
  if(isDay){ setTheme('classic', true); } else { setTheme('heritage', false); }
  setTimeout(()=>{ if(!userManuallyChangedTheme){ if(isDay){ setTheme(themeByTime(), null); } else { setTheme(themeByTime(), true); } } }, 30 * 1000);
  setInterval(()=>{ if(!userManuallyChangedTheme){ setTheme(themeByTime(), null); } }, 3600000);
  applyLanguage(currentLang); renderArmada(); calculateLive();
  const today=new Date().toISOString().split('T')[0]; const el=document.getElementById('formTanggal'); if(el){el.min=today; el.value=today;} document.getElementById('footerYear').innerText=new Date().getFullYear();
  toggleAccordion('lembang'); fetchWeather(); setInterval(fetchWeather,600000);
});
