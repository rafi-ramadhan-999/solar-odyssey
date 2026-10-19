// ===== SABUK KUIPER (di luar Neptunus) =====
function buatSabukTitik(r1, r2, n, warna, tebal) {
  const g = new THREE.Group();
  const p = [];
  for (let i = 0; i < n; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = r1 + Math.random() * (r2 - r1);
    p.push(r * Math.cos(t), (Math.random() - 0.5) * tebal, -r * Math.sin(t));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  g.add(new THREE.Points(geo, new THREE.PointsMaterial({color:warna, size:1.3, sizeAttenuation:false})));
  scene.add(g);
  return g;
}
const sabukKuiper = buatSabukTitik(34, 48, 3000, 0x8fa3b8, 3);

// ===== KOMET (orbit sangat lonjong) =====
const A_KOMET = 26, E_KOMET = 0.88;   // terdekat sekitar 3, terjauh sekitar 49
const kometOrbit = new THREE.Group();
kometOrbit.rotation.set(0.3, 0.9, 0); // orbitnya dimiringkan
scene.add(kometOrbit);
kometOrbit.add(garisOrbit(A_KOMET, E_KOMET));
const komet = new THREE.Group();
kometOrbit.add(komet);
komet.add(new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({color:0x998f85})));
const coma = new THREE.Sprite(new THREE.SpriteMaterial({
  map: glow.material.map, color:0x9fd8ff, blending:THREE.AdditiveBlending, depthWrite:false
}));
coma.scale.set(1.4, 1.4, 1);
komet.add(coma);
const ekor = new THREE.Mesh(
  new THREE.ConeGeometry(0.28, 1, 16, 1, true).translate(0, -0.5, 0),  // ujung runcing di inti
  new THREE.MeshBasicMaterial({color:0x9fd8ff, transparent:true, opacity:0.35,
    blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide})
);
komet.add(ekor);
let sudutK = 2.0;
const entriKomet = {nama:'Komet (mirip Halley)', planet:komet, jarakLihat:4,
  info:{jarak:'88 juta km (terdekat) sampai 5,2 miliar km (terjauh)', diameter:'inti sekitar 11 km', tahun:'sekitar 76 tahun',
    fakta:'Ekornya selalu menjauhi Matahari karena didorong angin surya, bukan mengikuti arah geraknya.'}};
buatHit(komet, 0.9, entriKomet);

function updateKomet(k) {
  const f = Math.pow(1 + E_KOMET * Math.cos(sudutK), 2) / Math.pow(1 - E_KOMET * E_KOMET, 1.5);
  sudutK += 0.0012 * f * k;   // Kepler: ngebut dekat Matahari, merayap di kejauhan
  const r = A_KOMET * (1 - E_KOMET * E_KOMET) / (1 + E_KOMET * Math.cos(sudutK));
  komet.position.set(r * Math.cos(sudutK), 0, -r * Math.sin(sudutK));
  ekor.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), komet.position.clone().normalize());
  ekor.scale.set(1, THREE.MathUtils.clamp(70 / r, 1.2, 14), 1);   // makin dekat Matahari, makin panjang
  ekor.material.opacity = THREE.MathUtils.clamp(10 / r, 0.08, 0.5);
}

