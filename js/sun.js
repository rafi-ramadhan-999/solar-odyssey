// Matahari
const matMatahari = new THREE.MeshBasicMaterial({color:0xffcc33});
const matahari = new THREE.Mesh(new THREE.SphereGeometry(2, 48, 48), matMatahari);
scene.add(matahari);
pasangTekstur('2k_sun.jpg', matMatahari);

// Glow Matahari
const canvasGlow = document.createElement('canvas');
canvasGlow.width = canvasGlow.height = 256;
const ctx = canvasGlow.getContext('2d');
const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
grad.addColorStop(0.0, 'rgba(255,220,120,1)');
grad.addColorStop(0.3, 'rgba(255,170,60,0.5)');
grad.addColorStop(1.0, 'rgba(255,120,0,0)');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, 256, 256);
const glow = new THREE.Sprite(new THREE.SpriteMaterial({
  map: new THREE.CanvasTexture(canvasGlow),
  blending: THREE.AdditiveBlending,
  depthWrite: false
}));
glow.scale.set(13, 13, 1);
scene.add(glow);

