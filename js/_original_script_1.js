
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
