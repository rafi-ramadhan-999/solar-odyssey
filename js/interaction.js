// ===== KETUK PLANET + KAMERA TERBANG =====
const panel = document.getElementById('panel');
const raycaster = new THREE.Raycaster();
const titik = new THREE.Vector2();

let fokus = null;
let aturFrame = 0;
let jarakTujuan = 85;
const posTmp = new THREE.Vector3();

function pilih(entri) {
  fokus = entri;
  aturFrame = 100;
  jarakTujuan = entri.jarakLihat;
  document.getElementById('pNama').textContent = entri.nama;
  document.getElementById('pJarak').textContent = 'Jarak dari Matahari: ' + entri.info.jarak;
  document.getElementById('pDiameter').textContent = 'Diameter: ' + entri.info.diameter;
  document.getElementById('pTahun').textContent = 'Lama setahun: ' + entri.info.tahun;
  document.getElementById('pFakta').textContent = entri.info.fakta;
  panel.style.display = 'block';
}

function lihatSemua() {
  fokus = null;
  aturFrame = 100;
  jarakTujuan = 110;
  panel.style.display = 'none';
}
document.getElementById('pTutup').addEventListener('click', lihatSemua);

let awalX = 0, awalY = 0, awalWaktu = 0;
renderer.domElement.addEventListener('pointerdown', (e) => {
  awalX = e.clientX; awalY = e.clientY; awalWaktu = performance.now();
});
renderer.domElement.addEventListener('pointerup', (e) => {
  const geser = Math.hypot(e.clientX - awalX, e.clientY - awalY);
  const lama = performance.now() - awalWaktu;
  if (geser > 8 || lama > 400) return;
  if (modeTaruh) return;   // sedang menaruh lubang hitam (lihat kacau.js)

  titik.x = (e.clientX / innerWidth) * 2 - 1;
  titik.y = -(e.clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(titik, camera);
  const kena = raycaster.intersectObjects(bendaKetuk, false);
  if (kena.length > 0) {
    const entri = kena[0].object.userData.entry;
    if (gameAktif) jawab(entri);
    else pilih(entri);
  }
});

// ===== KECEPATAN WAKTU =====
const btnKec = document.getElementById('btnKec');
const levelKec = [1, 3, 10, 0];
const labelKec = ['1×', '3×', '10×', '⏸'];
let idxKec = 0;
let kecepatan = 1;
btnKec.addEventListener('click', () => {
  idxKec = (idxKec + 1) % levelKec.length;
  kecepatan = levelKec[idxKec];
  btnKec.textContent = labelKec[idxKec];
});

