// DATA PLANET
// e = eksentrisitas orbit (0 = lingkaran), miring = kemiringan poros (derajat)
const dataPlanet = [
  {nama:'Merkurius', ukuran:0.30, jarak:5,   e:0.206, miring:0.03,  warna:0xa8a29e, orbit:0.0200, putar:0.004, tekstur:'2k_mercury.jpg',
   info:{jarak:'57,9 juta km', diameter:'4.879 km', tahun:'88 hari',
         fakta:'Siang hari sekitar 430°C, malam hari turun sampe sekitar -180°C.'}},
  {nama:'Venus',     ukuran:0.60, jarak:7,   e:0.007, miring:177.4, warna:0xe8c27a, orbit:0.0150, putar:0.002, tekstur:'2k_venus_surface.jpg',
   atmosfer:[0xffd9a0, 0.30],
   info:{jarak:'108 juta km', diameter:'12.104 km', tahun:'225 hari',
         fakta:'Planet terpanas (sekitar 465°C) dan berputar berlawanan arah dgn kebanyakan planet.'}},
  {nama:'Bumi',      ukuran:0.65, jarak:9.5, e:0.017, miring:23.4,  warna:0x2a6fdb, orbit:0.0100, putar:0.020, tekstur:'2k_earth_daymap.jpg',
   atmosfer:[0x4aa3ff, 0.35],
   info:{jarak:'149,6 juta km', diameter:'12.756 km', tahun:'365 hari',
         fakta:'Satu-satunya tempat yg sejauh ini diketahui memiliki kehidupan.'}},
  {nama:'Mars',      ukuran:0.40, jarak:12,  e:0.093, miring:25.2,  warna:0xc1440e, orbit:0.0080, putar:0.018, tekstur:'2k_mars.jpg',
   atmosfer:[0xff8a5c, 0.12],
   info:{jarak:'227,9 juta km', diameter:'6.779 km', tahun:'687 hari',
         fakta:'Punya Olympus Mons, gunung berapi setinggi sekitar 22 km, hampir 2,5 kali Everest.'}},
  {nama:'Jupiter',   ukuran:1.40, jarak:17,  e:0.049, miring:3.1,   warna:0xd9a066, orbit:0.0043, putar:0.040, tekstur:'2k_jupiter.jpg',
   info:{jarak:'778 juta km', diameter:'139.820 km', tahun:'11,9 tahun',
         fakta:'Bintik Merah Raksasanya adalah badai yg sudah berlangsung ratusan tahun.'}},
  {nama:'Saturnus',  ukuran:1.20, jarak:22,  e:0.057, miring:26.7,  warna:0xe3d09a, orbit:0.0032, putar:0.038, tekstur:'2k_saturn.jpg', cincin:true,
   info:{jarak:'1,43 miliar km', diameter:'116.460 km', tahun:'29,5 tahun',
         fakta:'Kerapatannya lebih kecil dari air. Cincinnya tersusun dari es dan batu.'}},
  {nama:'Uranus',    ukuran:0.90, jarak:27,  e:0.046, miring:97.8,  warna:0x8fd3e0, orbit:0.0022, putar:0.030, tekstur:'2k_uranus.jpg',
   atmosfer:[0x9fe8f0, 0.20],
   info:{jarak:'2,87 miliar km', diameter:'50.724 km', tahun:'84 tahun',
         fakta:'Berputar dgn poros miring sekitar 98°, seperti menggelinding di orbitnya.'}},
  {nama:'Neptunus',  ukuran:0.90, jarak:31,  e:0.009, miring:28.3,  warna:0x3b5bdb, orbit:0.0018, putar:0.032, tekstur:'2k_neptune.jpg',
   atmosfer:[0x4466ff, 0.20],
   info:{jarak:'4,5 miliar km', diameter:'49.244 km', tahun:'165 tahun',
         fakta:'Anginnya yang tercepat di tata surya, lebih dari 2.000 km/jam.'}},
  {nama:'Pluto',     ukuran:0.18, jarak:37,  e:0.25,  miring:122.5, warna:0xb8a08a, orbit:0.0014, putar:0.010, tekstur:null, kerdil:true,
   info:{jarak:'5,9 miliar km', diameter:'2.377 km', tahun:'248 tahun',
         fakta:'Sejak 2006 digolongkan planet kerdil. Bulannya, Charon, berukuran sekitar separuh Pluto.'}},
  {nama:'Ceres',    ukuran:0.12, jarak:14.8, e:0.08, miring:4,    warna:0x8a8782, orbit:0.0050, putar:0.020, tekstur:null, kerdil:true,
   info:{jarak:'414 juta km', diameter:'940 km', tahun:'4,6 tahun',
         fakta:'Planet kerdil terdekat. Berada di sabuk asteroid dan menampung sekitar 1/3 massa sabuk itu.'}},
  {nama:'Haumea',   ukuran:0.15, jarak:41,   e:0.19, miring:28,   warna:0xd9d4cc, orbit:0.0012, putar:0.060, tekstur:null, kerdil:true,
   info:{jarak:'6,5 miliar km', diameter:'sekitar 1.560 km', tahun:'285 tahun',
         fakta:'Berbentuk lonjong seperti telur karna berputar sangat cepat, 1 putaran kurang dari 4 jam.'}},
  {nama:'Makemake', ukuran:0.15, jarak:44,   e:0.16, miring:0,    warna:0xc9a27c, orbit:0.0011, putar:0.020, tekstur:null, kerdil:true,
   info:{jarak:'6,8 miliar km', diameter:'sekitar 1.430 km', tahun:'305 tahun',
         fakta:'Ditemukan tahun 2005 dan dinamai dewa penciptaan suku Rapa Nui di Pulau Paskah.'}},
  {nama:'Eris',     ukuran:0.18, jarak:50,   e:0.44, miring:0,    warna:0xe6e2dc, orbit:0.0008, putar:0.020, tekstur:null, kerdil:true,
   info:{jarak:'10,1 miliar km', diameter:'2.326 km', tahun:'559 tahun',
         fakta:'Penemuannya tahun 2005 memicu perdebatan yg berujung pada Pluto digolongkan planet kerdil.'}},
     {nama:'Planet Nine', ukuran:0.95, jarak:74, e:0.30,
   miring:20, warna:0x111827, orbit:0.00025,
   putar:0.012, tekstur:null, hipotetis:true, atmosfer:[0x5577aa, 0.25], 
   info:{
     jarak:'Sangat jauh di luar Neptunus (representasi simulasi)',
     diameter:'Blm diketahui',
     tahun:'Diperkirakan 10.000–20.000 tahun',
     fakta:'Planet hipotetis yg blm ditemukan. Sejumlah model memperkirakan massanya sekitar 5–10 x massa Bumi. Ukuran dan orbitnya dlm simulasi disederhanakan, bukan skala astronomi sebenarnya.' }},
];

const planetPlanet = [];
// Cincin tipis: r = kelipatan radius planet, lebar dalam satuan dunia
const cincinTipis = {
  Jupiter:  {r:[1.55, 1.75],           lebar:0.03,  warna:0xb8a58f, opa:0.35},
  Uranus:   {r:[1.45, 1.6, 1.75, 1.9], lebar:0.06,  warna:0xd8eef2, opa:0.7},
  Neptunus: {r:[1.5, 1.8, 2.1],        lebar:0.035, warna:0x9bb0ff, opa:0.45}
};
const bendaKetuk = [];
const daftarEntri = []; // planet saja (tanpa Matahari dan Pluto), dipakai untuk soal game
let orbitBulan, awanBumi;

function buatHit(parent, radius, entry) {
  const hit = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 12, 12),
    new THREE.MeshBasicMaterial({visible:false})
  );
  hit.userData.entry = entry;
  parent.add(hit);
  bendaKetuk.push(hit);
}

const entriMatahari = {
  nama:'Matahari', planet:matahari, jarakLihat:10,
  info:{jarak:'-', diameter:'1,39 juta km', tahun:'Berputar sekitar 25 hari',
        fakta:'Berisi sekitar 99,8% seluruh massa tata surya.'}
};
buatHit(matahari, 2.1, entriMatahari);

for (const d of dataPlanet) {
  // badan = titik tempat planet berada (digeser tiap frame sepanjang elips)
  const badan = new THREE.Group();
  scene.add(badan);

  // miring = grup yang dimiringkan, jadi poros putar planet ikut miring
  const miring = new THREE.Group();
  miring.rotation.z = THREE.MathUtils.degToRad(d.miring);
  badan.add(miring);

  const mat = new THREE.MeshStandardMaterial({color:d.warna});
  const bola = new THREE.Mesh(new THREE.SphereGeometry(d.ukuran, 48, 48), mat);
  miring.add(bola);
  if (d.tekstur) pasangTekstur(d.tekstur, mat);

  
if (d.hipotetis) {
  const cv = document.createElement('canvas');
  cv.width = 1024;
  cv.height = 512;

  const cx = cv.getContext('2d');

  // Dasar permukaan biru gelap dan abu-abu
  const grad = cx.createLinearGradient(0, 0, 0, cv.height);
  grad.addColorStop(0, '#111a2b');
  grad.addColorStop(0.25, '#35445a');
  grad.addColorStop(0.5, '#182438');
  grad.addColorStop(0.72, '#29374b');
  grad.addColorStop(1, '#090f1c');

  cx.fillStyle = grad;
  cx.fillRect(0, 0, cv.width, cv.height);

// Pita awan dingin yang bergelombang
// Menggantikan pola oval agar tidak menyerupai kawah

const pitaWarna = [
  'rgba(155,190,220,0.055)',
  'rgba(100,140,180,0.07)',
  'rgba(5,12,28,0.09)',
  'rgba(180,205,230,0.04)',
  'rgba(30,55,85,0.08)'
];

for (let i = 0; i < 100; i++) {
  const y = Math.random() * cv.height;
  const amplitudo = 2 + Math.random() * 12;
  const frekuensi = 0.004 + Math.random() * 0.009;
  const fase = Math.random() * Math.PI * 2;
  const lebar = 2 + Math.random() * 14;

  cx.beginPath();

  for (let x = 0; x <= cv.width; x += 6) {
    const gelombang =
      Math.sin(x * frekuensi + fase) * amplitudo +
      Math.sin(x * frekuensi * 0.37 + fase * 1.6)
      * amplitudo * 0.5;

    const yy = y + gelombang;

    if (x === 0) cx.moveTo(x, yy);
    else cx.lineTo(x, yy);
  }

  cx.strokeStyle =
    pitaWarna[Math.floor(Math.random() * pitaWarna.length)];
  cx.lineWidth = lebar;
  cx.lineCap = 'round';
  cx.stroke();
}

// Kabut tipis menyelimuti pita awan
cx.save();
cx.filter = 'blur(7px)';

for (let i = 0; i < 24; i++) {
  const y = Math.random() * cv.height;
  const gradAwan = cx.createLinearGradient(
    0, y - 16, 0, y + 16
  );

  gradAwan.addColorStop(0, 'rgba(130,170,205,0)');
  gradAwan.addColorStop(0.5, 'rgba(130,170,205,0.10)');
  gradAwan.addColorStop(1, 'rgba(130,170,205,0)');

  cx.fillStyle = gradAwan;
  cx.fillRect(0, y - 16, cv.width, 32);
}

cx.restore();
  
  // Terapkan tekstur ke bola Three.js
  const tex = new THREE.CanvasTexture(cv);
  tex.encoding = THREE.sRGBEncoding;

  mat.map = tex;
  mat.color.set(0xffffff);
  mat.roughness = 0.95;
  mat.metalness = 0;
  mat.needsUpdate = true;
}


  const entri = {nama:d.nama, planet:badan, jarakLihat:d.ukuran * 4 + 2, info:d.info};
  if (!d.kerdil && !d.hipotetis)  daftarEntri.push(entri);
  buatHit(badan, Math.max(d.ukuran * 1.8, 0.9), entri);

  scene.add(garisOrbit(d.jarak, d.e));

  if (d.atmosfer) {
    badan.add(buatAtmosfer(d.ukuran * 1.18, d.atmosfer[0], d.atmosfer[1]));
  }

  if (d.cincin) {
    const cincin = buatCincin(d.ukuran * 1.35, d.ukuran * 2.3);
    cincin.rotation.x = Math.PI / 2;  // rebahkan sejajar garis khatulistiwa planet
    miring.add(cincin);
  }

  const ct = cincinTipis[d.nama];
  if (ct) {
    for (const r of ct.r) {
      const c = new THREE.Mesh(
        new THREE.RingGeometry(d.ukuran * r, d.ukuran * r + ct.lebar, 128),
        new THREE.MeshBasicMaterial({color:ct.warna, transparent:true, opacity:ct.opa, side:THREE.DoubleSide, depthWrite:false})
      );
      c.rotation.x = Math.PI / 2;
      miring.add(c);   // ikut miring bersama poros planet
    }
  }

  if (d.nama === 'Bumi') {
    const matAwan = new THREE.MeshBasicMaterial({
      transparent:true, opacity:0, depthWrite:false, blending:THREE.AdditiveBlending
    });
    awanBumi = new THREE.Mesh(new THREE.SphereGeometry(d.ukuran * 1.02, 48, 48), matAwan);
    miring.add(awanBumi);
    pasangTekstur('2k_earth_clouds.jpg', matAwan, {opacity:0.6});

    // Bulan menempel di badan (bukan di bola), jadi tidak ikut terseret putaran Bumi
    orbitBulan = new THREE.Object3D();
    badan.add(orbitBulan);
    const matBulan = new THREE.MeshStandardMaterial({color:0xaaaaaa});
    const bulan = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), matBulan);
    bulan.position.x = 1.3;
    orbitBulan.add(bulan);
    pasangTekstur('2k_moon.jpg', matBulan);
  }

  planetPlanet.push({
    badan, bola, a:d.jarak, e:d.e,
    sudut: Math.random() * Math.PI * 2,   // posisi awal acak
    orbit:d.orbit, putar:d.putar
  });
}

// Sabuk asteroid (antara Mars dan Jupiter)
const sabuk = new THREE.Group();
scene.add(sabuk);
const posSabuk = [];
for (let i = 0; i < 2500; i++) {
  const t = Math.random() * Math.PI * 2;
  const r = 13.8 + Math.random() * 2.0;
  posSabuk.push(r * Math.cos(t), (Math.random() - 0.5) * 0.5, -r * Math.sin(t));
}
const geoSabuk = new THREE.BufferGeometry();
geoSabuk.setAttribute('position', new THREE.Float32BufferAttribute(posSabuk, 3));
sabuk.add(new THREE.Points(
  geoSabuk,
  new THREE.PointsMaterial({color:0xa09a90, size:1.5, sizeAttenuation:false})
));

