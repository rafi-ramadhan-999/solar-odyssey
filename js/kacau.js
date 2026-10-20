// ===== ACAK-ACAK PLANET: GRAVITASI LIAR + LUBANG HITAM =====
// Saat aktif, planet lepas dari orbit "rel" dan digerakkan fisika gravitasi sungguhan (N-body).
const GM_S = 0.09;      // tarikan Matahari (disetel supaya Bumi ~ 1 putaran per 630 frame, sama seperti simulasi biasa)
const RS = 0.7;         // jari-jari lubang hitam
const N_JEJAK = 140;    // panjang jejak orbit

let bebas = false, gravLiar = false, modeTaruh = false, kuat = 1;
let fis = [], lubang = [], garisHilang = [];
const bidangOrbit = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const rcK = new THREE.Raycaster(), titikK = new THREE.Vector2(), hitK = new THREE.Vector3();

const btnKacau = document.getElementById('btnKacau');
const menuKacau = document.getElementById('menuKacau');
const bGrav = document.getElementById('bGrav');
const bLubang = document.getElementById('bLubang');
const bPulih = document.getElementById('bPulih');
const kKuat = document.getElementById('kKuat');
const kKuatLabel = document.getElementById('kKuatLabel');

function kabar(t) {
  pesan.textContent = t;
  pesan.style.opacity = 1;
  clearTimeout(pesan._t);
  pesan._t = setTimeout(() => { pesan.style.opacity = 0; }, 2200);
}
const nm = (f) => dataPlanet[f.i].nama;

// --- Jejak orbit ---
function buatJejak(warna, q) {
  const arr = new Float32Array(N_JEJAK * 3);
  for (let i = 0; i < N_JEJAK; i++) arr.set([q.x, q.y, q.z], i * 3);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  const l = new THREE.Line(g, new THREE.LineBasicMaterial({
    color: new THREE.Color(warna).offsetHSL(0, 0, 0.25), transparent: true, opacity: 0.6
  }));
  l.frustumCulled = false;
  scene.add(l);
  return {l, g, arr};
}
function geserJejak(j, x, y, z) {
  j.arr.copyWithin(0, 3);
  j.arr.set([x, y, z], (N_JEJAK - 1) * 3);
  j.g.attributes.position.needsUpdate = true;
}

// --- Lubang hitam: bola hitam + cakram panas berputar + cahaya ---
let texDisc = null;
function texturCakram() {
  if (texDisc) return texDisc;
  const cv = document.createElement('canvas');
  cv.width = 256; cv.height = 128;
  const cx = cv.getContext('2d');
  const g = cx.createLinearGradient(0, 0, 256, 0);   // sumbu x = jarak dari pusat
  g.addColorStop(0, 'rgba(255,250,220,1)');
  g.addColorStop(0.2, 'rgba(255,190,80,0.95)');
  g.addColorStop(0.6, 'rgba(255,100,20,0.6)');
  g.addColorStop(1, 'rgba(120,20,0,0)');
  cx.fillStyle = g;
  cx.fillRect(0, 0, 256, 128);
  cx.globalCompositeOperation = 'destination-out';   // goresan gelap (sumbu y = sudut) supaya putarannya kelihatan
  for (let i = 0; i < 70; i++) {
    const y = Math.random() * 128, h = 1 + Math.random() * 5;
    cx.fillStyle = 'rgba(0,0,0,' + (0.15 + Math.random() * 0.5) + ')';
    cx.fillRect(0, y, 256, h);
    cx.fillRect(0, y - 128, 256, h);
  }
  texDisc = new THREE.CanvasTexture(cv);
  return texDisc;
}
function buatLubangHitam(x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.add(new THREE.Mesh(new THREE.SphereGeometry(RS, 32, 32), new THREE.MeshBasicMaterial({color:0x000000})));

  const seg = 64, dalam = RS * 1.3, luar = RS * 4.5;
  const geo = new THREE.RingGeometry(dalam, luar, seg, 1);
  const pos = geo.attributes.position, uv = geo.attributes.uv, v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    uv.setXY(i, (v.length() - dalam) / (luar - dalam), (i % (seg + 1)) / seg);
  }
  const cakram = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
    map: texturCakram(), transparent: true, side: THREE.DoubleSide,
    depthWrite: false, blending: THREE.AdditiveBlending
  }));
  cakram.rotation.x = -Math.PI / 2;
  const spin = new THREE.Group();
  spin.add(cakram);
  const tilt = new THREE.Group();
  tilt.rotation.x = 0.25;
  tilt.add(spin);
  g.add(tilt);

  const cahaya = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glow.material.map, color: 0xff7a22, opacity: 0.8,
    blending: THREE.AdditiveBlending, depthWrite: false, transparent: true
  }));
  cahaya.scale.setScalar(RS * 9);
  g.add(cahaya);
  scene.add(g);
  return {x, z, g, spin};
}

// --- Aktifkan fisika bebas ---
function aktifkan() {
  if (bebas) return;
  bebas = true;
  scene.children.filter((o) => o.isLine).forEach((o) => { o.visible = false; garisHilang.push(o); });
  fis = planetPlanet.map((p, i) => {
    const q = p.badan.position, r = Math.hypot(q.x, q.z), th = Math.atan2(-q.z, q.x);
    const v = Math.sqrt(Math.max(0.001, GM_S * (2 / r - 1 / p.a)));   // kecepatan orbit elips (vis-viva)
    const u = dataPlanet[i].ukuran;
    p.bebas = true;
    return {p, i, rad:u, m:u * u * u, m0:u * u * u, tumbuh:1, hidup:true,
      x:q.x, y:q.y, z:q.z, vx:-Math.sin(th) * v, vy:0, vz:-Math.cos(th) * v, ax:0, ay:0, az:0,
      jejak:buatJejak(dataPlanet[i].warna, q)};
  });
  perbaruiTombol();
}

// Sentakan acak: ubah laju dan arah tiap planet sedikit
function acakKecepatan() {
  for (const f of fis) {
    if (!f.hidup) continue;
    const s = 0.85 + Math.random() * 0.3, t = (Math.random() - 0.5) * 0.7;
    const c = Math.cos(t), n = Math.sin(t), vx = f.vx * s, vz = f.vz * s;
    f.vx = vx * c - vz * n;
    f.vz = vx * n + vz * c;
    f.vy = (Math.random() - 0.5) * 0.03;
  }
}

// --- Fisika ---
function langkah(h) {
  const gmBH = 0.3 * kuat, cG = gravLiar ? 0.006 * kuat : 0;
  for (const f of fis) {
    if (!f.hidup) continue;
    let q = f.x * f.x + f.y * f.y + f.z * f.z + 0.25;
    let w = GM_S / (q * Math.sqrt(q));
    let ax = -f.x * w, ay = -f.y * w, az = -f.z * w;
    if (cG > 0) {   // planet saling menarik (massa diperbesar supaya efeknya kelihatan)
      for (const g of fis) {
        if (g === f || !g.hidup) continue;
        const dx = g.x - f.x, dy = g.y - f.y, dz = g.z - f.z;
        q = dx * dx + dy * dy + dz * dz + 0.04;
        w = cG * g.m / (q * Math.sqrt(q));
        ax += dx * w; ay += dy * w; az += dz * w;
      }
    }
    for (const L of lubang) {
      const dx = L.x - f.x, dy = -f.y, dz = L.z - f.z;
      q = dx * dx + dy * dy + dz * dz + 0.15;
      w = gmBH / (q * Math.sqrt(q));
      ax += dx * w; ay += dy * w; az += dz * w;
    }
    f.ax = ax; f.ay = ay; f.az = az;
  }
  for (const f of fis) {
    if (!f.hidup) continue;
    f.vx += f.ax * h; f.vy += f.ay * h; f.vz += f.az * h;
    f.x += f.vx * h; f.y += f.vy * h; f.z += f.vz * h;
  }
}

function mati(f, teks) {
  f.hidup = false;
  f.p.badan.visible = false;
  if (fokus && fokus.planet === f.p.badan) lihatSemua();
  kabar(teks);
}
function gabung(A, B) {
  const [besar, kecil] = A.m >= B.m ? [A, B] : [B, A];
  const M = besar.m + kecil.m;
  besar.vx = (besar.vx * besar.m + kecil.vx * kecil.m) / M;   // momentum dijaga
  besar.vy = (besar.vy * besar.m + kecil.vy * kecil.m) / M;
  besar.vz = (besar.vz * besar.m + kecil.vz * kecil.m) / M;
  besar.m = M;
  besar.tumbuh = Math.min(2.5, Math.cbrt(M / besar.m0));
  mati(kecil, '💥 ' + nm(besar) + ' menabrak ' + nm(kecil));
  sfxBoom(0.5);
}

function sesudah() {
  for (const f of fis) {
    if (!f.hidup) continue;
    const r = Math.sqrt(f.x * f.x + f.y * f.y + f.z * f.z);
    if (r < 2 + f.rad * f.tumbuh * 0.6) { mati(f, '🔥 ' + nm(f) + ' jatuh ke Matahari'); continue; }
    if (r > 250) { mati(f, '🚀 ' + nm(f) + ' terlempar keluar tata surya'); continue; }
    let s = 1;
    for (const L of lubang) {
      const d = Math.hypot(f.x - L.x, f.y, f.z - L.z);
      if (d < RS + 0.15) { mati(f, '🕳️ ' + nm(f) + ' tertelan lubang hitam'); sfxWhoosh(); break; }
      s = Math.min(s, Math.max(0.15, (d - RS) / 3));   // mengecil saat mendekati cakrawala
    }
    if (!f.hidup) continue;
    f.p.badan.position.set(f.x, f.y, f.z);
    f.p.badan.scale.setScalar(f.tumbuh * s);
    geserJejak(f.jejak, f.x, f.y, f.z);
  }
  for (let a = 0; a < fis.length; a++) {
    const A = fis[a];
    if (!A.hidup) continue;
    for (let b = a + 1; b < fis.length; b++) {
      const B = fis[b];
      if (!B.hidup) continue;
      if (Math.hypot(A.x - B.x, A.y - B.y, A.z - B.z) < (A.rad * A.tumbuh + B.rad * B.tumbuh) * 0.8) gabung(A, B);
    }
  }
}

function pulihkan() {
  menuKacau.style.display = 'none';
  if (!bebas) { modeTaruh = false; perbaruiTombol(); return; }
  for (const f of fis) {
    const p = f.p;
    p.bebas = false;
    if (f.hidup) p.sudut = Math.atan2(-f.z, f.x);   // lanjutkan orbit rel dari sudut sekarang
    p.badan.visible = true;
    p.badan.scale.setScalar(1);
    scene.remove(f.jejak.l);
    f.jejak.g.dispose();
    f.jejak.l.material.dispose();
  }
  for (const L of lubang) scene.remove(L.g);
  garisHilang.forEach((o) => { o.visible = true; });
  fis = []; lubang = []; garisHilang = [];
  bebas = false; gravLiar = false; modeTaruh = false;
  perbaruiTombol();
  kabar('♻️ Tata surya dipulihkan');
}

// --- Dipanggil tiap frame dari main.js ---
let uiLama = '';
function sinkronUI() {
  const kode = (gameAktif ? 1 : 0) + '' + (shipAktif ? 1 : 0);
  if (kode === uiLama) return;
  uiLama = kode;
  btnFoto.style.display = gameAktif ? 'none' : 'block';
  const tampil = !gameAktif && !shipAktif;
  btnKacau.style.display = tampil ? 'block' : 'none';
  if (!tampil) {
    menuKacau.style.display = 'none';
    if (modeTaruh) { modeTaruh = false; perbaruiTombol(); }
  }
}
function updateKacau(k) {
  sinkronUI();
  if (!bebas) return;
  if (gameAktif) { pulihkan(); return; }
  for (const L of lubang) L.spin.rotation.y += 0.05 * k;
  const n = Math.ceil(k / 0.25);   // langkah kecil supaya stabil saat waktu dipercepat
  const h = n ? k / n : 0;
  for (let s = 0; s < n; s++) langkah(h);
  sesudah();
}

// --- Tombol & menu ---
function perbaruiTombol() {
  bGrav.classList.toggle('aktif', gravLiar);
  bLubang.classList.toggle('aktif', modeTaruh);
  btnKacau.classList.toggle('aktif', bebas || modeTaruh);
}
btnKacau.addEventListener('click', () => {
  menuKacau.style.display = menuKacau.style.display === 'block' ? 'none' : 'block';
});
bGrav.addEventListener('click', () => {
  aktifkan();
  gravLiar = true;
  acakKecepatan();
  menuKacau.style.display = 'none';
  perbaruiTombol();
  kabar('🌀 Gravitasi liar aktif: planet saling tarik!');
});
bLubang.addEventListener('click', () => {
  modeTaruh = !modeTaruh;
  menuKacau.style.display = 'none';
  perbaruiTombol();
  if (modeTaruh) kabar('🕳️ Ketuk bidang orbit untuk menaruh lubang hitam');
});
bPulih.addEventListener('click', pulihkan);
kKuat.addEventListener('input', () => {
  kuat = +kKuat.value;
  kKuatLabel.textContent = 'Kekuatan: ' + kuat.toFixed(1) + '×';
});

// Ketuk layar untuk menaruh lubang hitam (interaction.js sudah diam saat modeTaruh aktif)
let dX = 0, dY = 0, dT = 0;
renderer.domElement.addEventListener('pointerdown', (e) => { dX = e.clientX; dY = e.clientY; dT = performance.now(); });
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!modeTaruh || shipAktif || gameAktif) return;
  if (Math.hypot(e.clientX - dX, e.clientY - dY) > 8 || performance.now() - dT > 400) return;
  titikK.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  rcK.setFromCamera(titikK, camera);
  if (!rcK.ray.intersectPlane(bidangOrbit, hitK) || hitK.length() > 110) {
    kabar('Ketuk lebih dekat ke bidang tata surya');
    return;
  }
  modeTaruh = false;
  if (lubang.length >= 3) { kabar('Maksimal 3 lubang hitam'); perbaruiTombol(); return; }
  aktifkan();
  lubang.push(buatLubangHitam(hitK.x, hitK.z));
  perbaruiTombol();
  sfxWhoosh();
  kabar('🕳️ Lubang hitam muncul!');
});
