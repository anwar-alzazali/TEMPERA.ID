{"@context":"https://schema.org","@type":"TravelAgency","name":"Tempera - Teman Perjalanan Bandung","url":"https://tempera.id","description":"Private trip dan sewa mobil Bandung dengan driver expert","aggregateRating":{"@type":"AggregateRating","ratingValue":"4.9","reviewCount":"127"}}

tailwind.config={theme:{extend:{fontFamily:{serif:['Cormorant Garamond','serif'],sans:['Inter','sans-serif']}}}}


// ANTI KEDIP - SET TEMA SEBELUM RENDER - FINAL
(function(){
  try{
    const h=new Date().getHours();
    const isDay=h>=5&&h<19;
    const theme=isDay?'classic':'heritage';
    document.documentElement.setAttribute('data-theme',theme);
    if(isDay){
      document.documentElement.classList.add('is-night');
    } else {
      document.documentElement.classList.remove('is-night');
    }
  }catch(e){}
})();



const LOGO_MAP={
  classic:'logo_classic_gold_transparent.png',
  sky:'logo_sky_blue_transparent.png',
  tropical:'logo_tropical_transparent.png',
  mountain:'logo_mountain_transparent.png',
  ocean:'logo_ocean_transparent.png',
  sunset:'logo_sunset_transparent.png',
  minimal:'logo_minimal_transparent.png',
  heritage:'logo_heritage_transparent.png'
};
(function(){
  const originalSetTheme = window.setTheme;
  window.setTheme = function(k, forceBlack){
    // deteksi manual click
    const isManualBtn = typeof forceBlack === 'string' ? false : false;
    if(k && typeof forceBlack === 'boolean' && forceBlack===true && document.activeElement && document.activeElement.hasAttribute('data-theme-btn')){
      // ini dari tombol theme, jangan paksa hitam, biar user pilih
      userManuallyChangedTheme = true;
      originalSetTheme(k, null);
    } else {
      if(typeof forceBlack === 'boolean' && forceBlack===true && k===undefined){
        // manual
      }
      originalSetTheme(k, forceBlack);
    }
    const file = LOGO_MAP[k] || LOGO_MAP.classic;
    const mainLogo = document.getElementById('mainLogo');
    if(mainLogo) mainLogo.src = file;
    const footerLogo = document.getElementById('footerLogo');
    if(footerLogo) footerLogo.src = file;
    document.querySelectorAll('footer img').forEach(img => { img.src = file; });
  };
  // helper buat tombol manual
  window.setThemeManual = function(k){
    userManuallyChangedTheme = true;
    window.setTheme(k, null);
  };
})();



// FIXED renderArmada - ANTI HITAM - TESTED
function renderArmada(){
const cards=document.getElementById('armada-cards');
if(!cards) return;
cards.innerHTML='';
ARMADA_DATA.forEach(unit=>{
  // FIX PATH: support both root and images/ folder
  const firstImg = (unit.images && unit.images[0]) || unit.image;
  const imgPath = firstImg.startsWith('images/') ? firstImg : `images/${firstImg}`;
  const card=document.createElement('div');
  card.className=`${unit.span || 'armada-card-uniform'} rounded-[24px] overflow-hidden flex flex-col h-full theme-card border`;
  card.innerHTML=`
  <div class="h-48 bg-white relative overflow-hidden armada-img-container" style="background:#fff">
    <img src="${imgPath}" loading="lazy" alt="Sewa ${unit.name} Bandung" 
         class="w-full h-full object-contain p-2" style="opacity:1 !important; display:block !important;"
         onerror="this.src='${firstImg}'">
    <div class="absolute top-3 left-3 px-3 py-1 rounded-full z-10" style="background:var(--accent);color:white"><span class="text-[9px] font-bold uppercase">${unit.badge}</span></div>
    <div class="absolute top-3 right-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] px-2 py-1 rounded-full uppercase font-bold z-10">🟢 Ready</div>
  </div>
  <div class="p-6 flex flex-col flex-grow" style="background:var(--bg-card)">
    <h3 class="text-[15px] font-bold" style="color:var(--text-primary)">${unit.name}</h3>
    <p class="text-[10px] uppercase mb-3 font-bold" style="color:var(--accent)">${unit.capacity} • Max ${unit.capacityMax}</p>
    <ul class="text-[11px] space-y-2.5 mb-6 border-y py-4 flex-grow" style="color:var(--text-secondary);border-color:var(--border-soft)">
      <li>👥 <b style="color:var(--text-primary)">${unit.capacity}</b> + driver • Max ${unit.capacityMax}</li>
      <li>🧳 ${unit.baggage}</li>
      <li>💺 ${unit.maxInfo}</li>
      <li class="${unit.noteClass}">${unit.note}</li>
    </ul>
    <button type="button" onclick="selectUnitFromCard('${unit.id}')" class="block text-center w-full font-bold py-3 rounded-full text-[10px] mt-auto" style="background:var(--accent);color:white">Pilih Unit - ${formatPrice(unit.price)} / 12 Jam</button>
  </div>`;
  cards.appendChild(card);
});
}


// Disable old slider
function initInnerArmadaSliders(){ console.log('slider disabled - fixed version'); }
