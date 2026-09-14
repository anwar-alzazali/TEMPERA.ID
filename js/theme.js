/* [THEME.JS] - 100% dari file asli, tidak rubah design */

/* FIXED - anti double declare */
if (typeof window.LOGO_MAP === 'undefined') {
/* [THEME.JS] - 100% dari file asli, tidak rubah design */

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


} else {
  // LOGO_MAP already exists from inline script, just ensure override
  window.LOGO_MAP = window.LOGO_MAP || {
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

;
}

// Safe re-define of setTheme wrapper only once
if (!window.__tempera_theme_wrapper_applied) {
  window.__tempera_theme_wrapper_applied = true;
  (function(){
    const originalSetTheme = window.setTheme;
    if (!originalSetTheme) return;
    const LOGO_MAP = window.LOGO_MAP;
    window.setTheme = function(k, forceBlack){
      if(k && typeof forceBlack === 'boolean' && forceBlack===true && document.activeElement && document.activeElement.hasAttribute('data-theme-btn')){
        window.userManuallyChangedTheme = true;
        originalSetTheme(k, null);
      } else {
        originalSetTheme(k, forceBlack);
      }
      const file = LOGO_MAP[k] || LOGO_MAP.classic;
      const mainLogo = document.getElementById('mainLogo');
      if(mainLogo) mainLogo.src = file;
      const footerLogo = document.getElementById('footerLogo');
      if(footerLogo) footerLogo.src = file;
      document.querySelectorAll('footer img').forEach(img => { if(img.id!=='mainLogo' && img.id!=='footerLogo') img.src = file; });
    };
    window.setThemeManual = function(k){
      window.userManuallyChangedTheme = true;
      window.setTheme(k, null);
    };
  })();
}

