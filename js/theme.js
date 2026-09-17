/* [THEME.JS] - patch logo ikut tema, tanpa ubah tampilan */

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
  // Guard: theme.js wajib dimuat SETELAH main.js. Kalau CDN/main.js gagal load, jangan diam-diam mati.
  if(typeof window.setTheme !== 'function'){
    console.error('theme.js dimuat sebelum main.js, atau main.js gagal load. Sistem tema tidak aktif.');
    return;
  }

  const originalSetTheme = window.setTheme;

  window.setTheme = function(k, forceBlack){
    originalSetTheme(k, forceBlack);
    const file = LOGO_MAP[k] || LOGO_MAP.classic;
    const mainLogo = document.getElementById('mainLogo');
    if(mainLogo){
      mainLogo.onerror = function(){ this.onerror = null; this.src = LOGO_MAP.classic; };
      mainLogo.src = file;
    }
    const footerLogo = document.getElementById('footerLogo');
    if(footerLogo){
      footerLogo.onerror = function(){ this.onerror = null; this.src = LOGO_MAP.classic; };
      footerLogo.src = file;
    }
  };

  // Dipanggil dari tombol tema manual di navbar (data-theme-btn)
  window.setThemeManual = function(k){
    userManuallyChangedTheme = true;
    try{ localStorage.setItem('tempera_theme_manual', k); }catch(e){}
    window.setTheme(k, null);
  };
})();
