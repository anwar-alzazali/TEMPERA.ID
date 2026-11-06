// Bangun ulang css/tailwind.css setiap kali kelas Tailwind di index.html / js/main.js berubah:
//   npx tailwindcss@3.4.17 -c alat/tailwind.config.js -i alat/tailwind.src.css -o css/tailwind.css --minify
module.exports = {
  content: ['./index.html', './js/main.js'],
  theme: { extend: { fontFamily: { serif: ['Cormorant Garamond', 'serif'], sans: ['Inter', 'sans-serif'] } } },
};
