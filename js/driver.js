
/* ===================== [DRIVER.JS] - ANTI-HAPUS BRANDING + TRACKING ===================== */
/* File ini JANGAN dihapus. Menjamin branding Tempera.id tidak bisa dihapus driver */
/* Design induk 100% sama, file ini hanya menambah proteksi */

(function(){
  const CONFIG = window.TEMPERA_CONFIG;
  if(!CONFIG) return;
  const slug = window.getCurrentDriverSlug();
  const driver = slug ? window.getDriverBySlug(slug) : null;

  function injectDriver(){
    if(!driver) return;
    // Ganti elemen yang ada data-driver-* tanpa merubah layout/design
    document.querySelectorAll("[data-driver-name]").forEach(el=>el.textContent=driver.name);
    document.querySelectorAll("[data-driver-photo]").forEach(el=>{ if(el.tagName==='IMG') el.src=driver.photo; });
    document.querySelectorAll("[data-driver-rating]").forEach(el=>el.textContent=driver.rating);
    document.querySelectorAll("[data-driver-trips]").forEach(el=>el.textContent=driver.trips+" trip");
    document.querySelectorAll("[data-driver-base]").forEach(el=>el.textContent=driver.base);
    document.querySelectorAll("[data-driver-motto]").forEach(el=>el.textContent=`"${driver.motto}"`);
    document.querySelectorAll("[data-driver-wa]").forEach(el=>{
      const msg=`Halo ${driver.name}, mau booking private trip via Tempera.id (ref: ${driver.slug})`;
      el.href=`https://wa.me/${CONFIG.induk.waCentral}?text=${encodeURIComponent(msg)}`;
    });
    document.querySelectorAll("[data-driver-verified]").forEach(el=>el.classList.remove("hidden"));
  }

  function enforceBranding(){
    const brandingHTML = `
      <div id="tempera-branding" class="tempera-branding" style="padding:12px 0;text-align:center;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-secondary);border-top:1px solid var(--border-soft);">
        <span>Powered by <a href="https://tempera.id" style="color:var(--accent);font-weight:700;text-decoration:none;">Tempera.id</a> - Teman Perjalanan • 
        <span data-driver-name style="color:var(--text-primary)">${driver ? driver.name : "Official"}</span> adalah mitra resmi</span>
        <span class="hidden" data-tempera-track="branding" data-driver="${driver ? driver.slug : "induk"}"></span>
      </div>`;
    function ensure(){
      let el=document.getElementById("tempera-branding");
      if(!el){
        const footer=document.querySelector("footer");
        if(footer) footer.insertAdjacentHTML("beforebegin", brandingHTML);
        else document.body.insertAdjacentHTML("beforeend", brandingHTML);
      } else if(!el.innerHTML.includes("tempera.id")){
        el.outerHTML=brandingHTML;
      }
    }
    ensure();
    setInterval(ensure, 2000);
    const obs=new MutationObserver(()=>ensure());
    obs.observe(document.body,{childList:true,subtree:true});
  }

  function track(){
    const base={driver_slug:driver?driver.slug:"induk",page:location.pathname,time:new Date().toISOString()};
    function send(ev,extra={}){
      const p={...base,event:ev,...extra};
      console.log("[Tempera Track]",p);
      try{
        const logs=JSON.parse(localStorage.getItem("tempera_logs")||"[]");
        logs.push(p);
        localStorage.setItem("tempera_logs",JSON.stringify(logs.slice(-100)));
      }catch(e){}
    }
    send("pageview");
    document.addEventListener("click",e=>{
      const wa=e.target.closest('a[href*="wa.me"]');
      if(wa) send("wa_click",{url:wa.href});
      const book=e.target.closest('[data-track="booking"]');
      if(book) send("booking_click",{armada:book.dataset.armada});
    });
  }

  document.addEventListener("DOMContentLoaded",()=>{
    injectDriver();
    enforceBranding();
    track();
    // Filter armada per driver tanpa rubah design card
    if(driver && driver.armada && window.armadaData){
      const master=window.TEMPERA_CONFIG.armadaMaster;
      window.armadaData=master.filter(a=>driver.armada.includes(a.id)).map(a=>({...a,price12:a.price12+(driver.priceModifier||0)}));
      if(window.renderArmada) window.renderArmada();
    }
  });
  window.TEMPERA_DRIVER={slug,driver};
})();
