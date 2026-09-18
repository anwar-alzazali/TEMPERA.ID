/* [MAIN.JS] */

const WA_NUMBER = '6285174352575';

var TRANSLATIONS={id:{nav_home:"Beranda",nav_dest:"Paket Wisata",nav_fleet:"Sewa Mobil",nav_book:"Pesan Sekarang",hero_badge:"",hero_h1a:"Tempera",hero_h1b:"Private Trip Bandung",hero_desc:"Lembang • Ciwidey • Pangalengan • Dago",hero_cta1:"Jelajahi Paket",hero_cta2:"Lihat Armada",dest_title:"Paket Wisata Bandung Favorit 2025",dest_sub:"1 Wilayah Lebih Efisien & Hemat",fleet_title:"Armada Sewa Mobil Bandung",book_title:"Booking Sewa Mobil & Paket Wisata Bandung",step1:"Langkah 1: Pilih Wilayah Biar Hemat (Traveloka Style)",step2:"Langkah 2: Pilih Destinasi (Centang yang Mau Dikunjungi)",form_name:"Nama Lengkap *",form_armada:"Pilih Armada 12 Jam All-In *",form_date:"Tanggal *",form_time:"Jam Jemput",form_pax:"Jumlah Peserta *",form_note:"Catatan / Lokasi Jemput",summary:"Rincian Biaya",btn_wa:"Kirim Pesanan via WhatsApp"},en:{nav_home:"Home",nav_dest:"Tour Packages",nav_fleet:"Car Rental",nav_book:"Book Now",hero_badge:"",hero_h1a:"Tempera",hero_h1b:"Private Trip Bandung",hero_desc:"Lembang • Ciwidey • Pangalengan • Dago",hero_cta1:"Explore Packages",hero_cta2:"View Fleet",dest_title:"Favorite Bandung Tour Packages 2025",dest_sub:"1 Region More Efficient",fleet_title:"Bandung Car Rental Fleet",book_title:"Booking Bandung Car Rental & Tour",step1:"Step 1: Choose Region",step2:"Step 2: Choose Destinations",form_name:"Full Name *",form_armada:"Choose Fleet *",form_date:"Date *",form_time:"Pickup Time",form_pax:"Guests *",form_note:"Notes / Pickup",summary:"Price Summary",btn_wa:"Send via WhatsApp"},ms:{nav_home:"Laman Utama",nav_dest:"Pakej Pelancongan",nav_fleet:"Sewa Kereta",nav_book:"Tempah Sekarang",hero_badge:"",hero_h1a:"Tempera",hero_h1b:"Private Trip Bandung",hero_desc:"Lembang • Ciwidey • Pangalengan • Dago",hero_cta1:"Jelajahi Paket",hero_cta2:"Lihat Armada",dest_title:"Pakej Pelancongan Bandung 2025",dest_sub:"1 Wilayah Lebih Efisien",fleet_title:"Armada Sewa Kereta Bandung",book_title:"Tempahan Sewa Kereta Bandung",step1:"Langkah 1: Pilih Wilayah",step2:"Langkah 2: Pilih Destinasi",form_name:"Nama Penuh *",form_armada:"Pilih Armada *",form_date:"Tarikh *",form_time:"Masa Jemput",form_pax:"Bil. Peserta *",form_note:"Catatan / Lokasi",summary:"Ringkasan Harga",btn_wa:"Hantar via WhatsApp"}};
var currentLang=localStorage.getItem('tempera_lang')||'id';
function applyLanguage(lang){currentLang=lang;localStorage.setItem('tempera_lang',lang);const dict=TRANSLATIONS[lang];document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(dict[k])el.innerText=dict[k];});const flagMap={id:'🇮🇩',en:'🇬🇧',ms:'🇲🇾'};const labelMap={id:'ID',en:'EN',ms:'MY'};document.getElementById('currentLangFlag').innerText=flagMap[lang];document.getElementById('currentLang').innerText=labelMap[lang];document.querySelectorAll('#langMenu [data-lang]').forEach(b=>{const c=b.querySelector('.check');if(b.dataset.lang===lang){b.style.background='var(--bg-section-alt)';c.classList.remove('hidden')}else{b.style.background='transparent';c.classList.add('hidden')}});document.documentElement.lang=lang;}
function changeLanguage(lang){applyLanguage(lang);document.getElementById('langMenu').classList.add('hidden');}
const THEMES={classic:{name:'Classic Luxury',icon:'✨'},sky:{name:'Sky Blue Bright',icon:'☀'},tropical:{name:'Tropical Paradise',icon:'🌴'},mountain:{name:'Adventure Mountain',icon:'🏔'},ocean:{name:'Ocean Blue Explorer',icon:'🌊'},sunset:{name:'Sunset Wanderlust',icon:'🌅'},minimal:{name:'Minimalist',icon:'⚪'},heritage:{name:'Royal Heritage',icon:'👑'}};
const THEME_WEATHER={classic:{accent:'#E5B80B',light:'#FFF8DC',dark:'#0A0A0A'},sky:{accent:'#0EA5E9',light:'#E0F2FE',dark:'#0C4A6E'},tropical:{accent:'#06B6D4',light:'#CFFAFE',dark:'#164E63'},mountain:{accent:'#10B981',light:'#D1FAE5',dark:'#022C22'},ocean:{accent:'#2563EB',light:'#DBEAFE',dark:'#1E3A8A'},sunset:{accent:'#F97316',light:'#FFEDD5',dark:'#431407'},minimal:{accent:'#334155',light:'#F1F5F9',dark:'#0F172A'},heritage:{accent:'#7C3AED',light:'#EDE9FE',dark:'#1E1B4B'}};
function themeByTime(){const h=new Date().getHours();if(h>=5&&h<7)return'sunset';if(h>=7&&h<10)return'sky';if(h>=10&&h<13)return'tropical';if(h>=13&&h<15)return'mountain';if(h>=15&&h<17)return'minimal';if(h>=17&&h<19)return'heritage';if(h>=19&&h<22)return'sunset';return'classic';}
function getWeatherType(code){if(code===0) return 'sunny'; if([1,2].includes(code)) return 'partly'; if(code===3) return 'cloudy'; if([45,48].includes(code)) return 'fog'; if([51,53,55,56,57].includes(code)) return 'drizzle'; if([61,63,65,80,81,82].includes(code)) return 'rain'; if([95,96,99].includes(code)) return 'thunder'; return 'partly';}
function getWeatherIcon(code,isDay){const t=getWeatherType(code); if(t==='sunny') return isDay?'☀':'🌙'; if(t==='partly') return isDay?'🌤':'☁'; if(t==='cloudy') return '☁'; if(t==='fog') return '🌫'; if(t==='drizzle') return '🌦'; if(t==='rain') return '🌧'; if(t==='thunder') return '⛈'; return '⛅';}
function getWeatherDesc(code){const m={0:'Cerah',1:'Cerah Berawan',2:'Berawan Sebagian',3:'Mendung',45:'Berkabut',48:'Kabut Tebal',51:'Gerimis Ringan',53:'Gerimis',55:'Gerimis Lebat',61:'Hujan Ringan',63:'Hujan Sedang',65:'Hujan Lebat',80:'Hujan Ringan',81:'Hujan Sedang',82:'Hujan Lebat',95:'Petir',96:'Petir + Hujan',99:'Badai Petir'}; return m[code]||'Berawan';}
function renderMainLottie(code,isDay){
  const container=document.getElementById('weather-lottie-main'); if(!container) return;
  const emoji=getWeatherIcon(code,isDay);
  container.innerHTML=`<div class="text-[72px]">${emoji}</div>`;
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
function toggleMobileMenu(e){ if(e) e.stopPropagation(); const m=document.getElementById('mobileMenu'); const btn=document.getElementById('hamburgerBtn'); const nowOpen=m.classList.toggle('hidden')===false; if(btn) btn.setAttribute('aria-expanded', String(nowOpen)); }
function closeMobileMenu(){ document.getElementById('mobileMenu')?.classList.add('hidden'); }
function handlePesanSekarang(e){if(e)e.preventDefault();document.getElementById('pesan').scrollIntoView({behavior:'smooth'});}

// FIX: ARMADA DATA - semua image ada di folder images/
const ARMADA_DATA=[
{id:'calya',name:'Toyota Calya / Sigra',shortName:'Calya / Sigra',badge:'Ekonomis • 4 Nyaman',image:'calya-black-gold.jpg',images:['calya-black-gold.jpg','calya-white.jpg'],capacity:'4 Nyaman',capacityNum:4,capacityMax:6,baggage:'2 koper kabin kecil',maxInfo:'Max 6 tanpa bagasi',note:'⚠ Tidak muat 6 + koper besar',noteClass:'text-amber-600',price:550000,cardClass:'armada-card-uniform'},
{id:'avanza',name:'Toyota Avanza / Xenia New',shortName:'Avanza / Xenia New',badge:'Paling Laris • 5 Nyaman',image:'avanza-black-gold.jpg',images:['avanza-black-gold.jpg','avanza-white.jpg'],capacity:'5 Nyaman',capacityNum:5,capacityMax:6,baggage:'1 besar + 2 kecil',maxInfo:'Max 6 tanpa koper besar',note:'✅ Muat stroller lipat',noteClass:'text-emerald-600',price:650000,cardClass:'armada-card-uniform'},
{id:'xpander',name:'Mitsubishi Xpander',shortName:'Xpander',badge:'MPV Nyaman • 6 Nyaman',image:'xpander-black.jpg',images:['xpander-black.jpg','xpander-white.jpg'],capacity:'6 Nyaman',capacityNum:6,capacityMax:7,baggage:'1 besar + 2 kecil',maxInfo:'Max 7 tanpa bagasi besar',note:'✅ Kabin paling lega',noteClass:'text-emerald-600',price:800000,cardClass:'armada-card-uniform'},
{id:'innova',name:'Toyota Innova Reborn / Zenix',shortName:'Innova Reborn / Zenix',badge:'Best Seller • 6 Nyaman',image:'innova-black-gold.jpg',images:['innova-black-gold.jpg','innova-white.jpg'],capacity:'6 Nyaman',capacityNum:6,capacityMax:7,baggage:'2 besar + 2 kecil',maxInfo:'Max 7 tipe G tanpa bagasi besar',note:'✅ Rekomendasi luar kota',noteClass:'text-emerald-600',price:950000,cardClass:'armada-card-uniform'},
{id:'hiace',name:'Toyota Hiace Premio',shortName:'Hiace Premio',badge:'Premium • 11 Nyaman',image:'hiace-black-gold.jpg',images:['hiace-black-gold.jpg','hiace-white.jpg'],capacity:'11 Nyaman',capacityNum:11,capacityMax:14,baggage:'8-10 koper besar',maxInfo:'Max resmi 12, modif 14 tanpa bagasi besar',note:'ℹ 12 orang = lipat 2 kursi untuk koper',noteClass:'text-slate-500',price:1600000,cardClass:'armada-card-uniform'}
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
const card=document.createElement('div');card.className=`${unit.cardClass} rounded-[24px] overflow-hidden flex flex-col h-full theme-card border`;
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
  document.getElementById('resGrandTotal').innerText='Rp '+(base+cost+100000).toLocaleString('id-ID');
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
/* ================================================================= *
 * TEMPERA PRIVATE TRIP BANDUNG - FRONTEND & MIDTRANS INTEGRATION
 * ================================================================= */

const armadaData = [
  { id: 'avanza', name: 'Avanza New', capComfort: 5, capMax: 6, luggage: '3 Koper Sedang', price: 550000, desc: 'Paling diminati, lincah untuk jalur sempit' },
  { id: 'innova', name: 'Innova Reborn', capComfort: 6, capMax: 7, luggage: '4 Koper Sedang', price: 750000, desc: 'Kabin luas, suspensi empuk' },
  { id: 'zenix', name: 'Innova Zenix', capComfort: 6, capMax: 7, luggage: '4 Koper Sedang', price: 950000, desc: 'Hybrid modern, fitur premium' },
  { id: 'hiace', name: 'HiAce Premio', capComfort: 10, capMax: 14, luggage: '6 Koper Besar', price: 1500000, desc: 'Kapasitas besar untuk rombongan' }
];

const destinasiData = [
  { id: 'lembang_orchid', name: 'Orchid Forest Lembang', region: 'lembang', group: 'Utara' },
  { id: 'lembang_floating', name: 'Floating Market Lembang', region: 'lembang', group: 'Utara' },
  { id: 'lembang_dusun', name: 'Dusun Bambu', region: 'lembang', group: 'Utara' },
  { id: 'dago_tebing', name: 'Tebing Keraton', region: 'dago', group: 'Utara' },
  { id: 'ciwidey_kawah', name: 'Kawah Putih Ciwidey', region: 'ciwidey', group: 'Selatan' },
  { id: 'ciwidey_ranca', name: 'Ranca Upas', region: 'ciwidey', group: 'Selatan' },
  { id: 'pangalengan_nimo', name: 'Nimo Highland Pangalengan', region: 'pangalengan', group: 'Selatan' }
];

document.addEventListener('DOMContentLoaded', () => {
  initArmadaOptions();
  initDestinasiCheckboxes();
  calculateLive();
  fetchWeather();
});

function initArmadaOptions() {
  const select = document.getElementById('calcUnit');
  if (!select) return;
  select.innerHTML = '';

  armadaData.forEach((item) => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = `${item.name} (Nyaman ${item.capComfort} / Max ${item.capMax} org) - Rp ${item.price.toLocaleString('id-ID')}`;
    select.appendChild(opt);
  });
}

function selectArmada(id) {
  const select = document.getElementById('calcUnit');
  if (select) {
    select.value = id;
    calculateLive();
    checkCapacityLive();
    document.getElementById('pesan').scrollIntoView({ behavior: 'smooth' });
  }
}

function initDestinasiCheckboxes() {
  const wrapper = document.getElementById('destinasi-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = '';
  destinasiData.forEach(dest => {
    const isChecked = dest.region === 'lembang' ? 'checked' : '';
    wrapper.innerHTML += `
      <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:opacity-80" style="background:var(--bg-card);border-color:var(--border-soft)">
        <input type="checkbox" name="destinasi" value="${dest.id}" data-region="${dest.region}" ${isChecked} onchange="calculateLive()" class="w-4 h-4">
        <div class="flex-1 text-xs"><span class="font-bold" style="color:var(--text-primary)">${dest.name}</span><span class="block text-[10px] uppercase" style="color:var(--text-muted)">Wilayah ${dest.group}</span></div>
      </label>`;
  });
}

function focusRegion(region) {
  const checkboxes = document.querySelectorAll('input[name="destinasi"]');
  checkboxes.forEach(cb => {
    const r = cb.getAttribute('data-region');
    if (region === 'lembang') {
      cb.checked = (r === 'lembang' || r === 'dago');
    } else if (region === 'ciwidey') {
      cb.checked = (r === 'ciwidey' || r === 'pangalengan');
    }
  });
  calculateLive();
}

function calculateLive() {
  const unitSelect = document.getElementById('calcUnit');
  if (!unitSelect) return;
  const unitObj = armadaData.find(u => u.id === unitSelect.value) || armadaData[0];
  const checkboxes = document.querySelectorAll('input[name="destinasi"]:checked');
  let regionsSelected = new Set();
  let selectedNames = [];

  checkboxes.forEach(cb => {
    regionsSelected.add(cb.getAttribute('data-region'));
    selectedNames.push(cb.parentElement.querySelector('span.font-bold').textContent);
  });

  let crossCost = ((regionsSelected.has('lembang') || regionsSelected.has('dago')) && (regionsSelected.has('ciwidey') || regionsSelected.has('pangalengan'))) ? 150000 : 0;
  let totalPrice = unitObj.price + crossCost;
  let grandTotalEstimate = totalPrice + 100000;

  document.getElementById('resArmadaName').textContent = unitObj.name;
  document.getElementById('resArmadaCap').textContent = `Nyaman ${unitObj.capComfort} • Max ${unitObj.capMax} Org`;
  document.getElementById('resBasePrice').textContent = `Rp ${unitObj.price.toLocaleString('id-ID')}`;
  document.getElementById('resRegionCost').textContent = `Rp ${crossCost.toLocaleString('id-ID')}`;
  document.getElementById('resSelectedList').textContent = selectedNames.length > 0 ? selectedNames.join(', ') : 'Belum ada';
  document.getElementById('resTotalPrice').textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
  document.getElementById('resGrandTotal').textContent = `Rp ${grandTotalEstimate.toLocaleString('id-ID')}`;

  // Logika Peringatan Cross-Trip (Menampilkan HTML yang Anda kirimkan sebelumnya)
  const warn = document.getElementById('crossTripWarning');
  if (warn) {
    const hasNorth = regionsSelected.has('lembang') || regionsSelected.has('dago');
    const hasSouth = regionsSelected.has('ciwidey') || regionsSelected.has('pangalengan');
    
    if (hasNorth && hasSouth && checkboxes.length >= 3) {
      warn.classList.remove('hidden');
      document.getElementById('warningTitle').textContent = '⚠️ Peringatan Jalur Ekstrem (Utara + Selatan Sekaligus)';
      document.getElementById('warningDesc').textContent = 'Menggabungkan Lembang/Dago dengan Ciwidey/Pangalengan dalam 1 hari memiliki jarak tempuh yang sangat jauh.';
      
      const detailsContainer = document.getElementById('warningDetails');
      if (detailsContainer) {
        detailsContainer.innerHTML = `
          <div class="mt-4 grid grid-cols-3 gap-2 text-center">
            <div class="bg-zinc-800 rounded-xl p-2.5 border border-zinc-700"><div class="text-[9px] text-zinc-400">07:00</div><div class="text-[11px] font-bold mt-1">LEMBANG</div><div class="text-[9px] text-amber-300">Utara</div></div>
            <div class="bg-zinc-800 rounded-xl p-2.5 border border-zinc-700"><div class="text-[9px] text-zinc-400">11:30</div><div class="text-[11px] font-bold mt-1">CIWIDEY</div><div class="text-[9px] text-amber-300">Selatan Barat</div></div>
            <div class="bg-zinc-800 rounded-xl p-2.5 border-2 border-amber-400"><div class="text-[9px] text-amber-400">14:30</div><div class="text-[11px] font-bold mt-1">PANGALENGAN</div><div class="text-[9px] text-amber-300">Selatan Timur</div></div>
          </div>
          <div class="mt-4 rounded-xl bg-white text-black p-3">
            <div class="flex justify-between text-[11px]"><span class="text-zinc-500">Jarak total hari ini</span><span class="font-bold">~152 KM • 7-8 Jam di jalan</span></div>
            <div class="flex justify-between text-[11px] mt-1.5"><span class="text-zinc-500">Waktu foto-foto</span><span class="font-bold text-red-500">Sisa 2 jam doang 😥</span></div>
            <div class="mt-2 pt-2 border-t flex justify-between text-[12px] font-black"><span>+ Biaya 3 Penjuru (BBM + lembur driver)</span><span>Rp ${crossCost.toLocaleString('id-ID')}</span></div>
            <div class="mt-1 flex justify-between text-[13px] font-black"><span>Total</span><span>Rp ${totalPrice.toLocaleString('id-ID')}</span></div>
          </div>
          <p class="text-[11px] text-zinc-400 mt-3 leading-snug">Jujur, kalau dipaksain 1 hari bakal capek banget. Driver rekomen <b class="text-white">pecah jadi 2 hari</b> biar puas.</p>`;
      }
    } else {
      warn.classList.add('hidden');
    }
  }
}

function checkCapacityLive() {
  const paxInput = document.getElementById('formJumlah');
  if (!paxInput) return;
  const pax = parseInt(paxInput.value) || 0;
  const unitObj = armadaData.find(u => u.id === document.getElementById('calcUnit').value) || armadaData[0];
  const infoEl = document.getElementById('resCapacityInfo');
  const textEl = document.getElementById('resCapacityText');

  if (pax > unitObj.capMax) {
    infoEl.classList.remove('hidden');
    textEl.innerHTML = `<span style="color:#DC2626; font-weight:bold;">⚠️ Melebihi kapasitas max (${unitObj.capMax} org).</span>`;
  } else {
    infoEl.classList.add('hidden');
  }
}

/* ================================================================= *
 * FUNGSI UTAMA: INTEGRASI MIDTRANS SNAP (DENGAN TOMBOL KONFIRMASI & BAYAR)
 * ================================================================= */
async function handleFormSubmit(event) {
  event.preventDefault();
  
  const nama = document.getElementById('formNama').value.trim();
  const kontak = document.getElementById('formKontak').value.trim();
  const tanggal = document.getElementById('formTanggal').value;
  const jam = document.getElementById('formJam').value;
  const jumlah = document.getElementById('formJumlah').value;
  const catatan = document.getElementById('formCatatan').value.trim();
  const unitObj = armadaData.find(u => u.id === document.getElementById('calcUnit').value) || armadaData[0];

  const checkboxes = document.querySelectorAll('input[name="destinasi"]:checked');
  let regionsSelected = new Set();
  let destList = [];
  checkboxes.forEach(cb => {
    regionsSelected.add(cb.getAttribute('data-region'));
    destList.push(cb.parentElement.querySelector('span.font-bold').textContent);
  });

  let crossCost = ((regionsSelected.has('lembang') || regionsSelected.has('dago')) && (regionsSelected.has('ciwidey') || regionsSelected.has('pangalengan'))) ? 150000 : 0;
  let grossAmount = unitObj.price + crossCost;

  const orderPayload = {
    order_id: 'TRIP-' + Date.now(),
    gross_amount: grossAmount,
    customer_details: {
      first_name: nama,
      phone: kontak,
    },
    item_details: [{
      id: unitObj.id,
      price: grossAmount,
      quantity: 1,
      name: `Sewa ${unitObj.name} (12 Jam + Destinasi)`
    }],
    custom_field: {
      tanggal: tanggal,
      jam: jam,
      pax: jumlah,
      destinasi: destList.join(', '),
      catatan: catatan
    }
  };

  const submitBtn = document.getElementById('submitBtn');
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = 'Memproses Pembayaran...';
  submitBtn.disabled = true;

  try {
    // PENTING: Ganti URL di bawah dengan alamat file PHP back-end Anda (misal: https://tempera.id/create-transaction.php)
    const response = await fetch('https://wjmotidelqgcyyujacud.supabase.co/functions/v1/create_transaction_midtrans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    
    const data = await response.json();
    
    if (data.snap_token) {
      window.snap.pay(data.snap_token, {
        onSuccess: function(result){
          alert("Pembayaran Berhasil! Terima kasih telah memesan di Tempera.");
          let waMessage = `Halo Admin Tempera, saya sudah konfirmasi & bayar via Midtrans:\n\n` +
            `👤 *Nama:* ${nama}\n` +
            `📞 *Kontak:* ${kontak}\n` +
            `🚐 *Armada:* ${unitObj.name}\n` +
            `📅 *Tanggal:* ${tanggal} (${jam} WIB)\n` +
            `👥 *Peserta:* ${jumlah} Orang\n` +
            `💳 *Order ID:* ${result.order_id}`;
          window.open(`https://wa.me/6285174352575?text=${encodeURIComponent(waMessage)}`, '_blank');
        },
        onPending: function(result){
          alert("Menunggu pembayaran Anda diselesaikan.");
          console.log(result);
        },
        onError: function(result){
          alert("Pembayaran Gagal. Silakan coba lagi.");
          console.log(result);
        },
        onClose: function(){
          alert('Anda menutup popup pembayaran sebelum selesai.');
        }
      });
    } else {
      alert('Gagal mendapatkan token pembayaran dari server.');
    }
  } catch (error) {
    console.error('Midtrans Error:', error);
    alert('Terjadi kesalahan koneksi ke server pembayaran.');
  } finally {
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
  }
}

async function fetchWeather() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-6.9175&longitude=107.6191&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia%2FJakarta');
    const data = await res.json();
    if (data && data.current) {
      document.getElementById('weather-temp').textContent = Math.round(data.current.temperature_2m);
      document.getElementById('weather-humidity').textContent = `${data.current.relative_humidity_2m}%`;
      document.getElementById('weather-wind').textContent = `${data.current.wind_speed_10m} km/h`;
    }
  } catch (e) {
    console.error(e);
  }
}
