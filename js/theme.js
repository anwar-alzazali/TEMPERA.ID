/* [THEME.JS] - 100% dari file asli, tidak rubah design */

var LOGO_MAP={
    classic:'images/logo_classic_gold_transparent.png',
    sky:'images/logo_sky_blue_transparent.png',
    tropical:'images/logo_tropical_transparent.png',
    mountain:'images/logo_mountain_transparent.png',
    ocean:'images/logo_ocean_transparent.png',
    sunset:'images/logo_sunset_transparent.png',
    minimal:'images/logo_minimal_transparent.png',
    heritage:'images/logo_heritage_transparent.png'
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

