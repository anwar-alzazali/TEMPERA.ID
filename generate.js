
const fs = require('fs');
const path = require('path');
const drivers = [
  {slug:'budi', name:'Kang Budi', base:'Dago'},
  {slug:'cecep', name:'Kang Cecep', base:'Cihampelas'},
  // generate 100 dari list nama Bandung
];
const names = ["eko","jajang","dadang","entis","ujang","asep","deden","udin","budi","cecep","agus","asep2","yayat","eman","dudung","asep3","asep4","dadan","dadang2","cece"];
for(let i=4;i<=100;i++){
  const slug = `driver${i}`;
  const dir = path.join(__dirname, 'driver', slug);
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true});
  const template = fs.readFileSync(path.join(__dirname, 'driver', '_template', 'index.html'), 'utf8');
  const html = template.replace(/{{DRIVER_NAME}}/g, `Driver ${i}`).replace(/{{SLUG}}/g, slug);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  // dashboard
  const dashTemplate = fs.readFileSync(path.join(__dirname, 'driver', 'udin', 'dashboard.html'), 'utf8');
  if(dashTemplate) fs.writeFileSync(path.join(dir, 'dashboard.html'), dashTemplate.replace(/udin/g, slug));
}
console.log("Generated 100 drivers");
