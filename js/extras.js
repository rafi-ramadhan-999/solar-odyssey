// ===== TAMBAHAN: ASTEROID, KOMET, SATELIT, TABRAKAN, SUARA =====
const _v = new THREE.Vector3(), _w = new THREE.Vector3();
const _ab = new THREE.Vector3(), _ac = new THREE.Vector3();

// --- Asteroid: batu individual di sabuk (3 bernama bisa diketuk) ---
const batuan = [];
const geoBatu = [0, 1, 2].map((i) => {
  const g = new THREE.IcosahedronGeometry(1, 1), p = g.attributes.position;
  for (let j = 0; j < p.count; j++) {
    const x = p.getX(j), y = p.getY(j), z = p.getZ(j);
    const s = 0.75 + 0.3 * Math.abs(Math.sin(x * 3.1 + y * 4.7 + z * 5.3 + i * 11));
    p.setXYZ(j, x * s, y * s, z * s);   // bentuk tak beraturan, tanpa retakan
  }
  g.computeVertexNormals();
  return g;
});
function buatBatu(nama, r, jarak, info) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(geoBatu[Math.floor(Math.random() * 3)], new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x8a8178).offsetHSL(0, 0, (Math.random() - 0.5) * 0.15),
    flatShading: true, roughness: 1
  }));
  m.scale.setScalar(r);
  g.add(m);
  scene.add(g);
  batuan.push({g, m, r, jarak, y:(Math.random() - 0.5) * 0.7, sudut:Math.random() * Math.PI * 2,
    w:0.0045 + Math.random() * 0.0015, tx:Math.random() * 0.02, ty:Math.random() * 0.02});
  if (info) buatHit(g, 0.45, {nama, planet:g, jarakLihat:r * 5 + 1.5, info});
}
buatBatu('Vesta', 0.10, 14.2, {jarak:'353 juta km', diameter:'sekitar 525 km', tahun:'3,6 tahun',
  fakta:'Asteroid paling terang, kadang terlihat dengan mata telanjang. Dikunjungi wahana Dawn pada 2011–2012.'});
buatBatu('Pallas', 0.10, 15.1, {jarak:'414 juta km', diameter:'sekitar 512 km', tahun:'4,6 tahun',
  fakta:'Orbitnya miring sekitar 34° dari bidang planet-planet, jadi ia melintas di atas dan di bawah sabuk.'});
buatBatu('Hygiea', 0.09, 15.7, {jarak:'470 juta km', diameter:'sekitar 430 km', tahun:'5,6 tahun',
  fakta:'Asteroid terbesar keempat dan bentuknya hampir bulat, sehingga diusulkan jadi planet kerdil.'});
for (let i = 0; i < 40; i++) buatBatu('', 0.03 + Math.random() * 0.06, 13.8 + Math.random() * 2.0, null);

// --- Komet tambahan ---
const komets = [];
function buatKomet(nama, a, e, rot, sudut, laju, info) {
  const orb = new THREE.Group();
  orb.rotation.set(rot[0], rot[1], rot[2]);
  scene.add(orb);
  orb.add(garisOrbit(a, e));
  const g = new THREE.Group();
  orb.add(g);
  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshStandardMaterial({color:0x998f85})));
  const cm = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glow.material.map, color:0x9fd8ff, blending:THREE.AdditiveBlending, depthWrite:false
  }));
  cm.scale.set(1.2, 1.2, 1);
  g.add(cm);
  const tail = new THREE.Mesh(
    new THREE.ConeGeometry(0.24, 1, 16, 1, true).translate(0, -0.5, 0),
    new THREE.MeshBasicMaterial({color:0x9fd8ff, transparent:true, opacity:0.35,
      blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide})
  );
  g.add(tail);
  buatHit(g, 0.9, {nama, planet:g, jarakLihat:4, info});
  komets.push({g, tail, a, e, sudut, laju});
}
buatKomet('Komet Encke', 15, 0.78, [-0.4, 2.2, 0], 1.0, 0.0030,
  {jarak:'49 juta km (terdekat) sampai 614 juta km (terjauh)', diameter:'inti sekitar 5 km', tahun:'sekitar 3,3 tahun',
   fakta:'Salah satu komet dengan periode orbit terpendek, kembali ke dekat Matahari tiap 3,3 tahun.'});
buatKomet('Komet Hale–Bopp', 40, 0.93, [0.9, -0.5, 0], 2.6, 0.0006,
  {jarak:'137 juta km (terdekat, 1997) sampai sekitar 55 miliar km', diameter:'inti puluhan km', tahun:'sekitar 2.500 tahun',
   fakta:'Terlihat dengan mata telanjang sekitar 18 bulan pada 1996–1997, rekor terlama untuk sebuah komet.'});

// --- Satelit buatan yang mengorbit Bumi ---
const badanBumi = planetPlanet[dataPlanet.findIndex((d) => d.nama === 'Bumi')].badan;
const satelit = [];
function buatSatelit(nama, r, miringDeg, w, info) {
  const tilt = new THREE.Group();
  tilt.rotation.x = THREE.MathUtils.degToRad(miringDeg);
  badanBumi.add(tilt);
  const spin = new THREE.Group();
  tilt.add(spin);
  const s = new THREE.Group();
  s.position.x = r;
  spin.add(s);
  s.add(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.09),
    new THREE.MeshStandardMaterial({color:0xcccccc, metalness:0.6, roughness:0.4})));
  s.add(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.005, 0.07),
    new THREE.MeshStandardMaterial({color:0x2a4a9a, metalness:0.3, roughness:0.5})));
  buatHit(s, 0.3, {nama, planet:s, jarakLihat:1.2, info});
  satelit.push({spin, s, w});
}
buatSatelit('Stasiun Luar Angkasa (ISS)', 0.95, 51.6, 0.05,
  {jarak:'sama dengan Bumi (149,6 juta km); mengorbit sekitar 420 km di atas Bumi', diameter:'panjang sekitar 109 m',
   tahun:'satu putaran Bumi sekitar 93 menit',
   fakta:'Dihuni astronaut tanpa putus sejak November 2000, melaju sekitar 28.000 km/jam.'});
buatSatelit('Teleskop Hubble', 1.02, 28.5, 0.045,
  {jarak:'sama dengan Bumi (149,6 juta km); mengorbit sekitar 540 km di atas Bumi', diameter:'panjang sekitar 13 m',
   tahun:'satu putaran Bumi sekitar 95 menit',
   fakta:'Diluncurkan 1990 dan memotret galaksi yang cahayanya menempuh perjalanan lebih dari 13 miliar tahun.'});
// Gugus satelit komunikasi (titik-titik kecil)
const konstelasi = new THREE.Group();
const kTilt = new THREE.Group();
kTilt.rotation.x = THREE.MathUtils.degToRad(53);
badanBumi.add(kTilt);
kTilt.add(konstelasi);
const pk = [];
for (let i = 0; i < 14; i++) { const t = i / 14 * Math.PI * 2; pk.push(1.08 * Math.cos(t), 0, -1.08 * Math.sin(t)); }
const gk = new THREE.BufferGeometry();
gk.setAttribute('position', new THREE.Float32BufferAttribute(pk, 3));
konstelasi.add(new THREE.Points(gk, new THREE.PointsMaterial({color:0xcfe3ff, size:3, sizeAttenuation:false})));

// --- Efek suara (hanya bunyi kalau tombol 🔊 menyala) ---
let sfx = null, nodeMesin = null, bufNoise = null;
function siapSuara() {
  ac = ac || new (window.AudioContext || window.webkitAudioContext)();
  ac.resume();
  if (sfx) return;
  sfx = ac.createGain();
  sfx.gain.value = 0.8;
  sfx.connect(ac.destination);
  const len = ac.sampleRate * 2;
  bufNoise = ac.createBuffer(1, len, ac.sampleRate);
  const d = bufNoise.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = bufNoise; src.loop = true;
  const lp = ac.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = 150;
  const g = ac.createGain();
  g.gain.value = 0;
  src.connect(lp); lp.connect(g); g.connect(sfx);
  src.start();
  nodeMesin = {lp, g};   // dengung mesin: makin cepat makin keras
}
document.getElementById('btnMusik').addEventListener('click', () => { if (musikNyala) siapSuara(); });
document.getElementById('btnKapal').addEventListener('click', () => { if (musikNyala) siapSuara(); });

function bisaBunyi() { return musikNyala && ac && sfx && ac.state === 'running'; }
function noiseBurst(dur, f0, f1, vol) {
  const s = ac.createBufferSource(), lp = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime;
  s.buffer = bufNoise;
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(f0, t);
  lp.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  s.connect(lp); lp.connect(g); g.connect(sfx);
  s.start(t); s.stop(t + dur);
}
function nada(f0, f1, dur, vol, tipe) {
  const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
  o.type = tipe;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g); g.connect(sfx);
  o.start(t); o.stop(t + dur);
}
function sfxBoom(v) { if (!bisaBunyi()) return; noiseBurst(0.9, 1200, 60, 0.5 + v * 0.5); nada(90, 35, 0.7, 0.6, 'sine'); }
function sfxTok() { if (!bisaBunyi()) return; noiseBurst(0.15, 900, 200, 0.4); nada(200, 90, 0.12, 0.3, 'triangle'); }
function sfxWhoosh() { if (!bisaBunyi()) return; noiseBurst(1.2, 300, 3000, 0.3); }
function sfxBip() { if (!bisaBunyi()) return; nada(1400, 1400, 0.1, 0.15, 'sine'); setTimeout(() => { if (bisaBunyi()) nada(1400, 1400, 0.1, 0.15, 'sine'); }, 180); }

// --- Tabrakan pesawat ---
const kapalLalu = new THREE.Vector3();
let jeda = 0, jedaTok = 0, jedaWhoosh = 0, jedaBip = 0;
const flash = document.createElement('div');
flash.style.cssText = 'position:fixed;inset:0;background:#ff3b2a;opacity:0;pointer-events:none;transition:opacity .35s';
document.body.appendChild(flash);
const pesan = document.createElement('div');
pesan.style.cssText = 'position:fixed;top:92px;left:0;right:0;text-align:center;color:#ffd98a;font-size:16px;opacity:0;pointer-events:none;transition:opacity .4s';
document.body.appendChild(pesan);

function dampak(nama, v) {
  flash.style.opacity = Math.min(0.8, 0.3 + v * 0.5);
  setTimeout(() => { flash.style.opacity = 0; }, 120);
  pesan.textContent = '💥 Tabrakan dengan ' + nama + '!';
  pesan.style.opacity = 1;
  clearTimeout(pesan._t);
  pesan._t = setTimeout(() => { pesan.style.opacity = 0; }, 1500);
  sfxBoom(v);
}

// Cek lintasan pesawat (bukan hanya posisi akhir) supaya tidak tembus planet saat ngebut
function tabrakBola(nama, c, r) {
  const kp = kapal.position;
  _ab.copy(kp).sub(kapalLalu);
  const pj = _ab.lengthSq();
  const t = pj > 0 ? THREE.MathUtils.clamp(_ac.copy(c).sub(kapalLalu).dot(_ab) / pj, 0, 1) : 1;
  _v.copy(kapalLalu).addScaledVector(_ab, t);
  if (_v.distanceTo(c) >= r) return;
  const v = laju;
  _w.copy(kapalLalu).sub(c);
  if (_w.lengthSq() < 1e-6) _w.set(0, 1, 0);
  kp.copy(c).addScaledVector(_w.normalize(), r);   // dorong ke permukaan
  laju *= 0.2;
  if (jeda <= 0 && v > 0.08) { jeda = 40; dampak(nama, v); }
}

function updateTambahan(k) {
  for (const b of batuan) {
    b.sudut += b.w * k;
    b.g.position.set(b.jarak * Math.cos(b.sudut), b.y, -b.jarak * Math.sin(b.sudut));
    b.m.rotation.x += b.tx * k;
    b.m.rotation.y += b.ty * k;
  }
  for (const c of komets) {
    const f = Math.pow(1 + c.e * Math.cos(c.sudut), 2) / Math.pow(1 - c.e * c.e, 1.5);
    c.sudut += c.laju * f * k;
    const r = c.a * (1 - c.e * c.e) / (1 + c.e * Math.cos(c.sudut));
    c.g.position.set(r * Math.cos(c.sudut), 0, -r * Math.sin(c.sudut));
    c.tail.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), c.g.position.clone().normalize());
    c.tail.scale.set(1, THREE.MathUtils.clamp(70 / r, 1.2, 14), 1);
    c.tail.material.opacity = THREE.MathUtils.clamp(10 / r, 0.08, 0.5);
  }
  for (const s of satelit) s.spin.rotation.y += s.w * k;
  konstelasi.rotation.y += 0.04 * k;

  if (nodeMesin && ac) {   // dengung mesin mengikuti laju
    const hidup = shipAktif && musikNyala;
    nodeMesin.g.gain.setTargetAtTime(hidup ? laju * 0.25 : 0, ac.currentTime, 0.1);
    nodeMesin.lp.frequency.setTargetAtTime(150 + laju * 600, ac.currentTime, 0.1);
  }

  if (!shipAktif) { kapalLalu.copy(kapal.position); return; }
  if (jeda > 0) jeda--;
  if (jedaTok > 0) jedaTok--;
  if (jedaWhoosh > 0) jedaWhoosh--;
  if (jedaBip > 0) jedaBip--;
  const kp = kapal.position;

  tabrakBola('Matahari', _w.set(0, 0, 0).clone(), 2.65);
  planetPlanet.forEach((p, i) => tabrakBola(dataPlanet[i].nama, p.badan.position, dataPlanet[i].ukuran + 0.12));

  for (const b of batuan) {   // asteroid: terpental pelan
    const d = kp.distanceTo(b.g.position), r = b.r + 0.1;
    if (d < r) {
      _v.copy(kp).sub(b.g.position).normalize();
      kp.copy(b.g.position).addScaledVector(_v, r);
      if (laju > 0.05 && jedaTok <= 0) { jedaTok = 15; sfxTok(); }
      laju *= 0.6;
    }
  }

  if (jedaWhoosh <= 0) {   // melintas dekat komet
    for (const g of [komet, ...komets.map((c) => c.g)]) {
      g.getWorldPosition(_w);
      if (kp.distanceTo(_w) < 2.2) { sfxWhoosh(); jedaWhoosh = 180; break; }
    }
  }
  if (jedaBip <= 0) {      // melintas dekat satelit
    for (const s of satelit) {
      s.s.getWorldPosition(_w);
      if (kp.distanceTo(_w) < 1.0) { sfxBip(); jedaBip = 60; break; }
    }
  }
  kapalLalu.copy(kp);
}
  
