
window.TEMPERA_CONFIG = {
  induk: { domain: "tempera.id", brand: "Tempera", waCentral: "6281212345678", commissionPercent: 20, trackingEndpoint: "/api/track" },
  seo: { model: "sub-direktori", basePath: "/driver/" },
  armadaMaster: [
    {id:'calya',name:'Toyota Calya / Sigra',shortName:'Calya / Sigra',badge:'Ekonomis • 4 Nyaman',image:'images/calya-black-gold.jpg',images:['images/calya-black-gold.jpg','images/calya-white.jpg'],capacity:'4 Nyaman',capacityNum:4,capacityMax:6,baggage:'2 koper kabin kecil',maxInfo:'Max 6 tanpa bagasi',note:'⚠️ Tidak muat 6 + koper besar',noteClass:'text-amber-600',price:550000,span:'armada-card-uniform'},
    {id:'avanza',name:'Toyota Avanza / Xenia New',shortName:'Avanza / Xenia New',badge:'Paling Laris • 5 Nyaman',image:'images/avanza-black-gold.jpg',images:['images/avanza-black-gold.jpg','images/avanza-white.jpg'],capacity:'5 Nyaman',capacityNum:5,capacityMax:6,baggage:'1 besar + 2 kecil',maxInfo:'Max 6 tanpa koper besar',note:'✅ Muat stroller lipat',noteClass:'text-emerald-600',price:650000,span:'armada-card-uniform'},
    {id:'xpander',name:'Mitsubishi Xpander',shortName:'Xpander',badge:'MPV Nyaman • 6 Nyaman',image:'images/xpander-black.jpg',images:['images/xpander-black.jpg','images/xpander-white.jpg'],capacity:'6 Nyaman',capacityNum:6,capacityMax:7,baggage:'1 besar + 2 kecil',maxInfo:'Max 7 tanpa bagasi besar',note:'✅ Kabin paling lega',noteClass:'text-emerald-600',price:800000,span:'armada-card-uniform'},
    {id:'innova',name:'Toyota Innova Reborn / Zenix',shortName:'Innova Reborn / Zenix',badge:'Best Seller • 6 Nyaman',image:'images/innova-black-gold.jpg',images:['images/innova-black-gold.jpg','images/innova-white.jpg'],capacity:'6 Nyaman',capacityNum:6,capacityMax:7,baggage:'2 besar + 2 kecil',maxInfo:'Max 7 tipe G tanpa bagasi besar',note:'✅ Rekomendasi luar kota',noteClass:'text-emerald-600',price:950000,span:'armada-card-uniform'},
    {id:'hiace',name:'Toyota Hiace Premio',shortName:'Hiace Premio',badge:'Premium • 11 Nyaman',image:'images/hiace-black-gold.jpg',images:['images/hiace-black-gold.jpg','images/hiace-white.jpg'],capacity:'11 Nyaman',capacityNum:11,capacityMax:14,baggage:'8-10 koper besar',maxInfo:'Max resmi 12, modif 14 tanpa bagasi besar',note:'ℹ️ 12 orang = lipat 2 kursi untuk koper',noteClass:'text-slate-500',price:1600000,span:'armada-card-uniform'}
  ],
  drivers: [
    { slug: "udin", name: "Kang Udin", wa: "6281223456789", photo: "https://i.pravatar.cc/150?img=1", rating: 4.9, trips: 342, base: "Lembang", specialties: ["Anti Macet Dago","Foto Spot"], verified: true, active: true, motto: "Trip santai, anti capek.", armada: ["calya","avanza","xpander","innova","hiace"], priceModifier: 0 },
    { slug: "asep", name: "Kang Asep", wa: "6281323456790", photo: "https://i.pravatar.cc/150?img=2", rating: 4.8, trips: 210, base: "Ciwidey", specialties: ["Ciwidey Expert"], verified: true, active: true, motto: "Ciwidey itu rumah kedua.", armada: ["avanza","innova"], priceModifier: 0 },
    { slug: "deden", name: "Kang Deden", wa: "6281423456791", photo: "https://i.pravatar.cc/150?img=3", rating: 5.0, trips: 512, base: "Pangalengan", specialties: ["Hidden Gem"], verified: true, active: true, motto: "Bawa kamu ke tempat yang belum di-IG.", armada: ["innova","hiace"], priceModifier: 0 }
  ],
  seoTemplate: { title: "{driverName} - Private Trip Bandung | {base} Expert | Tempera", description: "Private trip bareng {driverName}" }
};
window.getDriverBySlug = (s) => window.TEMPERA_CONFIG.drivers.find(d => d.slug === s.toLowerCase());
window.getCurrentDriverSlug = () => { const m = window.location.pathname.match(/\/driver\/([^\/]+)/); return m ? m[1].toLowerCase() : null; };
window.armadaData = window.TEMPERA_CONFIG.armadaMaster;
window.ARMADA_DATA = window.TEMPERA_CONFIG.armadaMaster;
