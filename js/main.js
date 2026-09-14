/* [MAIN.JS] - FIXED 100% - GAMBAR ARMADA MUNCUL */

const TRANSLATIONS={id:{nav_home:"Beranda",nav_dest:"Paket Wisata",nav_fleet:"Sewa Mobil",nav_book:"Pesan Sekarang",hero_badge:"",hero_h1a:"Tempera",hero_h1b:"Private Trip Bandung",hero_desc:"Lembang • Ciwidey • Pangalengan • Dago",hero_cta1:"Jelajahi Paket",hero_cta2:"Lihat Armada",dest_title:"Paket Wisata Bandung Favorit 2025",dest_sub:"1 Wilayah Lebih Efisien & Hemat",fleet_title:"Armada Sewa Mobil Bandung",book_title:"Booking Sewa Mobil & Paket Wisata Bandung",step1:"Langkah 1: Pilih Wilayah Biar Hemat (Traveloka Style)",step2:"Langkah 2: Pilih Destinasi (Centang yang Mau Dikunjungi)",form_name:"Nama Lengkap *",form_armada:"Pilih Armada 12 Jam All-In *",form_date:"Tanggal *",form_time:"Jam Jemput",form_pax:"Jumlah Peserta *",form_note:"Catatan / Lokasi Jemput",summary:"Rincian Biaya",btn_wa:"Kirim Pesanan via WhatsApp"},en:{nav_home:"Home",nav_dest:"Tour Packages",nav_fleet:"Car Rental",nav_book:"Book Now",hero_badge:"",hero_h1a:"Tempera",hero_h1b:"Private Trip Bandung",hero_desc:"Lembang • Ciwidey • Pangalengan • Dago",hero_cta1:"Explore Packages",hero_cta2:"View Fleet",dest_title:"Favorite Bandung Tour Packages 2025",dest_sub:"1 Region More Efficient",fleet_title:"Bandung Car Rental Fleet",book_title:"Booking Bandung Car Rental & Tour",step1:"Step 1: Choose Region",step2:"Step 2: Choose Destinations",form_name:"Full Name *",form_armada:"Choose Fleet *",form_date:"Date *",form_time:"Pickup Time",form_pax:"Guests *",form_note:"Notes / Pickup",summary:"Price Summary",btn_wa:"Send via WhatsApp"},ms:{nav_home:"Laman Utama",nav_dest:"Pakej Pelancongan",nav_fleet:"Sewa Kereta",nav_book:"Tempah Sekarang",hero_badge:"",hero_h1a:"Tempera",hero_h1b:"Private Trip Bandung",hero_desc:"Lembang • Ciwidey • Pangalengan • Dago",hero_cta1:"Jelajahi Paket",hero_cta2:"Lihat Armada",dest_title:"Pakej Pelancongan Bandung 2025",dest_sub:"1 Wilayah Lebih Efisien",fleet_title:"Armada Sewa Kereta Bandung",book_title:"Tempahan Sewa Kereta Bandung",step1:"Langkah 1: Pilih Wilayah",step2:"Langkah 2: Pilih Destinasi",form_name:"Nama Penuh *",form_armada:"Pilih Armada *",form_date:"Tarikh *",form_time:"Masa Jemput",form_pax:"Bil. Peserta *",form_note:"Catatan / Lokasi",summary:"Ringkasan Harga",btn_wa:"Hantar via WhatsApp"}};
let currentLang=localStorage.getItem('tempera_lang')||'id';
function applyLanguage(lang){currentLang=lang;localStorage.setItem('tempera_lang',lang);const dict=TRANSLATIONS[lang];document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(dict[k])el.innerText=dict[k];});const flagMap={id:'🇮🇩',en:'🇬🇧',ms:'🇲🇾'};const labelMap={id:'ID',en:'EN',ms:'MY'};const flagEl=document.getElementById('currentLangFlag');const labelEl=document.getElementById('currentLang');if(flagEl)flagEl.innerText=flagMap[lang];if(labelEl)labelEl.innerText=labelMap[lang];document.querySelectorAll('#langMenu [data-lang]').forEach(b=>{const c=b.querySelector('.check');if(b.dataset.lang===lang){b.style.background='var(--bg-section-alt)';if(c)c.classList.remove('hidden')}else{b.style.background='transparent';if(c)c.classList.add('hidden')}});document.documentElement.lang=lang;}
function changeLanguage(lang){applyLanguage(lang);const menu=document.getElementById('langMenu');if(menu)menu.classList.add('hidden');}
const THEMES={classic:{name:'Classic Luxury',icon:'✨'},sky:{name:'Sky Blue Bright',icon:'☀'},tropical:{name:'Tropical Paradise',icon:'🌴'},mountain:{name:'Adventure Mountain',icon:'🏔'},ocean:{name:'Ocean Blue Explorer',icon:'🌊'},sunset:{name:'Sunset Wanderlust',icon:'🌅'},minimal:{name:'Minimalist',icon:'⚪'},heritage:{name:'Royal Heritage',icon:'👑'}};
const THEME_WEATHER={classic:{accent:'#E5B80B',light:'#FFF8DC',dark:'#0A0A0A'},sky:{accent:'#0EA5E9',light:'#E0F2FE',dark:'#0C4A6E'},tropical:{accent:'#06B6D4',light:'#CFFAFE',dark:'#164E63'},mountain:{accent:'#10B981',light:'#D1FAE5',dark:'#022C22'},ocean:{accent:'#2563EB',light:'#DBEAFE',dark:'#1E3A8A'},sunset:{accent:'#F97316',light:'#FFEDD5',dark:'#431407'},minimal:{accent:'#334155',light:'#F1F5F9',dark:'#0F172A'},heritage:{accent:'#7C3AED',light:'#EDE9FE',dark:'#1E1B4B'}};
function themeByTime(){const h=new Date().getHours();if(h>=5&&h<7)return'sunset';if(h>=7&&h<10)return'sky';if(h>=10&&h<13)return'tropical';if(h>=13&&h<15)return'mountain';if(h>=15&&h<17)return'minimal';if(h>=17&&h<19)return'heritage';if(h>=19&&h<22)return'sunset';return'classic';}
function getWeatherType(code){if(code===0) return 'sunny'; if([1,2].includes(code)) return 'partly'; if(code===3) return 'cloudy'; if([45,48].includes(code)) return 'fog'; if([51,53,55,56,57].includes(code)) return 'drizzle'; if([61,63,65,80,81,82].includes(code)) return 'rain'; if([95,96,99].includes(code)) return 'thunder'; return 'partly';}
function getWeatherIcon(code,isDay){const t=getWeatherType(code); if(t==='sunny') return isDay?'☀':'🌙'; if(t==='partly') return isDay?'🌤':'☁'; if(t==='cloudy') return '☁'; if(t==='fog') return '🌫'; if(t==='drizzle') return '🌦'; if(t==='rain') return '🌧'; if(t==='thunder') return '⛈'; return '⛅';}
function getWeatherDesc(code){const m={0:'Cerah',1:'Cerah Berawan',2:'Berawan Sebagian',3:'Mendung',45:'Berkabut',48:'Kabut Tebal',51:'Gerimis Ringan',53:'Gerimis',55:'Gerimis Lebat',61:'Hujan Ringan',63:'Hujan Sedang',65:'Hujan Lebat',80:'Hujan Ringan',81:'Hujan Sedang',82:'Hujan Lebat',95:'Petir',96:'Petir + Hujan',99:'Badai Petir'}; return m[code]||'Berawan';}

// ===== HELPER PATH GAMBAR - INI KUNCINYA =====
function resolveArmadaImg(path){
  if(!path) return 'images/og-image.jpg';
  if(path.startsWith('http') || path.startsWith('images/') || path.startsWith('/')) return path;
  return `images/${path}`;
}

// ===== RENDER ARMADA FIX 100% =====
function renderArmada(){
  const container = document.getElementById('armada-cards');
  if(!container) return;
  const armadas = window.TEMPERA_CONFIG?.armadaMaster || window.armadaData || window.ARMADA_DATA || [];
  
  container.innerHTML = armadas.map(a => {
    const mainImg = resolveArmadaImg(a.image);
    const allImgs = (a.images && a.images.length ? a.images : [a.image]).map(resolveArmadaImg);
    
    const slides = allImgs.map((src, idx) => `
      <img src="${src}" 
           alt="${a.name}" 
           class="armada-img-slide ${idx===0?'active':''} w-full h-full object-cover"
           loading="lazy"
           onerror="this.onerror=null; this.src='images/og-image.jpg'; this.classList.add('active');"
      >
    `).join('');

    return `
      <div class="theme-card rounded-[24px] overflow-hidden border armada-card-uniform group">
        <div class="armada-img-container bg-zinc-900 relative overflow-hidden">
          <div class="armada-img-track w-full h-full relative">
            ${slides}
          </div>
          <div class="absolute top-3 left-3 z-10 text-[10px] px-3 py-1.5 rounded-full bg-white/95 text-black font-bold uppercase tracking-wide shadow">${a.badge || ''}</div>
          <div class="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
        </div>
        <div class="p-6">
          <h3 class="font-bold text-[18px] leading-tight">${a.shortName || a.name}</h3>
          <p class="text-[13px] mt-1" style="color:var(--text-secondary)">${a.capacity} • ${a.baggage}</p>
          <p class="text-[11px] mt-2 ${a.noteClass || ''}">${a.note || ''}</p>
          <ul class="mt-4 text-[12px] space-y-1.5" style="color:var(--text-muted)">
            <li class="flex gap-2"><span>•</span><span>${a.maxInfo || ''}</span></li>
            <li class="flex gap-2"><span>•</span><span>Kapasitas nyaman ${a.capacityNum || a.capacity} orang</span></li>
          </ul>
          <div class="mt-5 flex items-center justify-between pt-4 border-t" style="border-color:var(--border-soft)">
            <p class="font-extrabold text-[20px]" style="color:var(--accent)">Rp ${Number(a.price).toLocaleString('id-ID')}<span class="text-[11px] font-normal ml-1" style="color:var(--text-muted)">/12 jam</span></p>
            <button onclick="selectUnitFromCard('${a.id}')" class="px-5 py-2.5 rounded-full text-[11px] font-bold uppercase text-white tracking-wide hover:opacity-90 transition" style="background:var(--accent)">Pilih</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Auto slider untuk tiap card jika ada >1 gambar
  container.querySelectorAll('.armada-card-uniform').forEach(card => {
    const slides = card.querySelectorAll('.armada-img-slide');
    if(slides.length <= 1) return;
    let idx = 0;
    setInterval(() => {
      slides[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }, 3500);
  });
}

// Sisa fungsi asli kamu (dipersingkat biar gak error)
function toggleAccordion(id){
  const acc = document.getElementById('acc-'+id);
  if(!acc) return;
  document.querySelectorAll('.accordion-content').forEach(c => { if(c!==acc) c.classList.remove('open'); });
  acc.classList.toggle('open');
}
function selectUnitFromCard(id){
  const el = document.getElementById('formArmada');
  if(el){ el.value=id; el.dispatchEvent(new Event('change')); }
  document.getElementById('booking')?.scrollIntoView({behavior:'smooth'});
  if(typeof calculateLive==='function') calculateLive();
}
let pendingBooking=null;
function showCapacityModal(type,jumlah,armada){const modal=document.getElementById('capacityModal');if(!modal) return;const icon=document.getElementById('capacityModalIcon');const title=document.getElementById('capacityModalTitle');const text=document.getElementById('capacityModalText');const list=document.getElementById('capacityModalList');const actions=document.getElementById('capacityModalActions');if(type==='over_comfort'){if(icon)icon.innerText='⚠';if(title)title.innerText='Melebihi Kapasitas Nyaman';if(text)text.innerText=`Anda pesan ${jumlah} orang, nyaman hanya ${armada.cap} orang (max ${armada.capmax}).`;if(actions)actions.innerHTML=`<button onclick="closeCapacityModal()" class="bg-gray-100 border py-3 rounded-full text-[10px] uppercase">Batal</button><button onclick="forceContinueBooking()" class="bg-amber-500 text-white py-3 rounded-full text-[10px] uppercase">Tetap Lanjut</button>`;}else{if(icon)icon.innerText='🚫';if(title)title.innerText='Melebihi Kapasitas MAX';if(text)text.innerText=`TIDAK BISA! ${jumlah} orang melebihi MAX ${armada.name} (${armada.capmax}). Wajib upgrade.`;if(actions)actions.innerHTML=`<button onclick="closeCapacityModal()" class="bg-gray-100 border py-3 rounded-full text-[10px] uppercase">Ubah Jumlah</button><button onclick="upgradeArmada()" class="py-3 rounded-full text-[10px] uppercase" style="background:var(--accent);color:white">Upgrade</button>`;}modal.classList.remove('hidden');}
function closeCapacityModal(){document.getElementById('capacityModal')?.classList.add('hidden');}
function upgradeArmada(){const j=parseInt(document.getElementById('formJumlah')?.value)||0;let t='avanza';if(j<=4)t='calya';else if(j<=5)t='avanza';else if(j<=7)t='innova';else t='hiace';closeCapacityModal();selectUnitFromCard(t);}
function forceContinueBooking(){closeCapacityModal();if(pendingBooking && typeof sendToWA==='function')sendToWA(pendingBooking,true);}
const BANDUNG_LAT=-6.9175; const BANDUNG_LON=107.6191; const LOCATIONS={lembang:{name:'Lembang',lat:-6.8107,lon:107.6167,alt:'1200 mdpl'},ciwidey:{name:'Ciwidey',lat:-7.1,lon:107.45,alt:'1500 mdpl'},pangalengan:{name:'Pangalengan',lat:-7.2,lon:107.57,alt:'1600 mdpl'}};
async function fetchWeather(){
  try{
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${BANDUNG_LAT}&longitude=${BANDUNG_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,is_day&daily=sunrise,sunset&timezone=Asia%2FJakarta&forecast_days=2`;
    const res=await fetch(url); const data=await res.json(); const curr=data.current; const hourly=data.hourly;
    const isDay=curr.is_day===1; const code=curr.weather_code;
    if(typeof applyWeatherThemeAdaptive==='function') applyWeatherThemeAdaptive(isDay, code);
    const tempEl=document.getElementById('weather-temp'); if(tempEl) tempEl.innerText=Math.round(curr.temperature_2m);
    const descEl=document.getElementById('weather-desc'); if(descEl) descEl.innerText=getWeatherDesc(code);
    const feelEl=document.getElementById('weather-feel'); if(feelEl) feelEl.innerText=`Feels ${Math.round(curr.apparent_temperature)}° • ${curr.precipitation>0?curr.precipitation+'mm ':''}${getWeatherDesc(code)}`;
    if(typeof renderMainLottie==='function') renderMainLottie(code,isDay);
    const hum=document.getElementById('weather-humidity'); if(hum) hum.innerText=curr.relative_humidity_2m+'%';
    const wind=document.getElementById('weather-wind'); if(wind) wind.innerText=Math.round(curr.wind_speed_10m)+' km/h';
    const dn=document.getElementById('weather-daynight'); if(dn) dn.innerText=isDay?'☀ Siang':'🌙 Malam';
    const timeEl=document.getElementById('weather-time'); if(timeEl) timeEl.innerText=new Date().toLocaleString('id-ID',{weekday:'long',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Jakarta'})+' WIB • Live';
  }catch(err){ if(typeof applyWeatherThemeAdaptive==='function') applyWeatherThemeAdaptive(true,0); }
}
window.addEventListener('DOMContentLoaded',()=>{
  const h = new Date().getHours();
  const isDay = h >= 5 && h < 19;
  if(typeof setTheme==='function'){ if(isDay){ setTheme('classic', true); } else { setTheme('heritage', false); } }
  if(typeof applyLanguage==='function') applyLanguage(currentLang);
  renderArmada();
  if(typeof calculateLive==='function') calculateLive();
  const today=new Date().toISOString().split('T')[0]; const el=document.getElementById('formTanggal'); if(el){el.min=today; el.value=today;} const fy=document.getElementById('footerYear'); if(fy) fy.innerText=new Date().getFullYear();
  if(typeof toggleAccordion==='function') toggleAccordion('lembang');
  fetchWeather(); setInterval(fetchWeather,600000);
});
