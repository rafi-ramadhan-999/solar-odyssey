const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0, 78, 78);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 1.5;
controls.maxDistance = 160;

// Bintang
const posisiBintang = [];
for (let i = 0; i < 2000; i++) {
  const arah = new THREE.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5
  ).normalize().multiplyScalar(300);
  posisiBintang.push(arah.x, arah.y, arah.z);
}
const geoBintang = new THREE.BufferGeometry();
geoBintang.setAttribute('position', new THREE.Float32BufferAttribute(posisiBintang, 3));
scene.add(new THREE.Points(
  geoBintang,
  new THREE.PointsMaterial({color:0xffffff, size:1.2, sizeAttenuation:false})
));

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// Cahaya
scene.add(new THREE.AmbientLight(0xffffff, 0.2));
scene.add(new THREE.PointLight(0xffffff, 2));

// Pemuat tekstur
// Urutan sumber: folder "tekstur/", folder yang sama dengan HTML, lalu server resmi Solar System Scope.
// Tekstur oleh Solar System Scope (https://www.solarsystemscope.com/textures/), lisensi CC BY 4.0.
const loader = new THREE.TextureLoader();
const URL_TEKSTUR_ONLINE = 'https://www.solarsystemscope.com/textures/download/';
function pasangTekstur(file, material, opsi = {}) {
  const sumber = ['tekstur/' + file, file, URL_TEKSTUR_ONLINE + file];
  let indeksSumber = 0;

  function cobaMuat() {
    if (indeksSumber >= sumber.length) {
      console.error('Tekstur gagal dimuat: ' + file + '. Periksa koneksi internet atau letakkan file di folder "tekstur".');
      return;
    }
    const url = sumber[indeksSumber++];
    loader.load(url, (tex) => {
      tex.encoding = THREE.sRGBEncoding;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      material.map = tex;
      material.color.set(0xffffff);
      if (opsi.opacity !== undefined) material.opacity = opsi.opacity;
      material.needsUpdate = true;
    }, undefined, () => {
      cobaMuat();
    });
  }
  cobaMuat();
}

