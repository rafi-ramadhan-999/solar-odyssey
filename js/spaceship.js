// ===== PESAWAT =====
const kapal = new THREE.Group();
const bahan = new THREE.MeshStandardMaterial({color:0xdddddd, metalness:0.5, roughness:0.4});
kapal.add(new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.6, 12).rotateX(-Math.PI / 2), bahan)); // hidung ke -Z
const sayap = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.02, 0.22), bahan);
sayap.position.z = 0.1;
kapal.add(sayap);
const mesin = new THREE.Sprite(new THREE.SpriteMaterial({
  map: glow.material.map, color:0xff8844, blending:THREE.AdditiveBlending, depthWrite:false
}));
mesin.position.z = 0.35;
kapal.add(mesin);
kapal.scale.setScalar(0.6);
kapal.visible = false;
scene.add(kapal);

let shipAktif = false, laju = 0, sx = 0, sy = 0, gas = false, rem = false;
let boost = false, auto = false, jarakKam = 2.2;
const kapalUI = document.getElementById('kapalUI');
const btnKapal = document.getElementById('btnKapal');
const elLaju = document.getElementById('laju');
const stick = document.getElementById('stick');
const knob = document.getElementById('knob');

function geserStick(e) {
  const r = stick.getBoundingClientRect();
  let dx = e.clientX - (r.left + r.width / 2);
  let dy = e.clientY - (r.top + r.height / 2);
  const m = Math.hypot(dx, dy), R = r.width * 0.32;
  if (m > R) { dx *= R / m; dy *= R / m; }
  sx = dx / R; sy = -dy / R;   // sy positif = dorong ke atas = hidung naik
  knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
}
function lepasStick() { sx = 0; sy = 0; knob.style.transform = 'translate(0,0)'; }
stick.addEventListener('pointerdown', (e) => { stick.setPointerCapture(e.pointerId); geserStick(e); });
stick.addEventListener('pointermove', (e) => { if (stick.hasPointerCapture(e.pointerId)) geserStick(e); });
stick.addEventListener('pointerup', lepasStick);
stick.addEventListener('pointercancel', lepasStick);

function tahan(id, set) {
  const el = document.getElementById(id);
  el.addEventListener('pointerdown', (e) => { el.setPointerCapture(e.pointerId); set(true); });
  ['pointerup', 'pointercancel'].forEach((t) => el.addEventListener(t, () => set(false)));
}
tahan('gas', (v) => gas = v);
tahan('rem', (v) => rem = v);
tahan('boost', (v) => boost = v);
const KAMERA = [2.2, 3.5, 5.5];
let idxKam = 0;
document.getElementById('auto').addEventListener('click', (e) => { auto = !auto; e.currentTarget.classList.toggle('aktif', auto); });
document.getElementById('kamera').addEventListener('click', () => { idxKam = (idxKam + 1) % KAMERA.length; jarakKam = KAMERA[idxKam]; });
document.getElementById('lurus').addEventListener('click', () => {
  const d = new THREE.Vector3(0, 0, -1).applyQuaternion(kapal.quaternion);
  kapal.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(), d, new THREE.Vector3(0, 1, 0)));
});

// Saat terbang, ketukan di layar tidak boleh membuka panel info
renderer.domElement.addEventListener('pointerup', (e) => { if (shipAktif) e.stopImmediatePropagation(); });

btnKapal.addEventListener('click', () => {
  if (gameAktif) return;   // tidak bisa terbang saat misi kuis
  shipAktif = !shipAktif;
  if (shipAktif) {
    lihatSemua();
    aturFrame = 0;
    controls.enabled = false;
    kapal.position.set(0, 4, 40);
    kapal.rotation.set(-0.1, 0, 0);
    laju = 0;
    kapal.visible = true;
    camera.position.copy(kapal.position).add(new THREE.Vector3(0, 0.5, 2.2));
    btnKapal.textContent = '✖';
    kapalUI.style.display = 'block';
    document.getElementById('hint').style.display = 'none';
    document.getElementById('btnMain').style.display = 'none';
  } else {
    kapal.visible = false;
    controls.enabled = true;
    camera.up.set(0, 1, 0);
    camera.position.set(0, 60, 60);
    controls.target.set(0, 0, 0);
    lihatSemua();
    btnKapal.textContent = '🚀';
    kapalUI.style.display = 'none';
    document.getElementById('hint').style.display = 'block';
    document.getElementById('btnMain').style.display = 'block';
  }
});

function updateKapal() {
  kapal.rotateY(-sx * 0.03);   // belok kiri-kanan
  kapal.rotateX(sy * 0.025);   // hidung naik-turun
 const maks = boost ? 3.0 : 1.0;
  if (laju > maks) laju = Math.max(maks, laju - 0.03);   // turun pelan setelah BOOST dilepas
  else if (gas || boost) laju = Math.min(maks, laju + (boost ? 0.03 : 0.01));
  if (rem) laju = Math.max(laju - 0.04, 0);
  if (!auto) laju *= 0.998;   // AUTO: laju dikunci, tidak melambat sendiri
  const depan = new THREE.Vector3(0, 0, -1).applyQuaternion(kapal.quaternion);
  kapal.position.addScaledVector(depan, laju);

  const dM = kapal.position.length();
  if (dM < 2.6) { kapal.position.setLength(2.6); laju *= 0.5; }   // jangan menembus Matahari
  if (dM > 120) kapal.position.setLength(120);                    // batas wilayah terbang

  // Kamera mengejar dari belakang
  const atas = new THREE.Vector3(0, 1, 0).applyQuaternion(kapal.quaternion);
  const target = new THREE.Vector3(0, jarakKam * 0.25, jarakKam).applyQuaternion(kapal.quaternion).add(kapal.position);
  camera.position.lerp(target, 0.2);
  camera.up.copy(atas);
  camera.lookAt(kapal.position.clone().addScaledVector(depan, 3).addScaledVector(atas, jarakKam * 0.35));

  mesin.scale.setScalar(0.3 + laju * 1.2);
  elLaju.textContent = 'Laju ' + Math.round(laju * 100) + '%';
}

