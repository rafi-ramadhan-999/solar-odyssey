// ===== ALAT BANTU REALISME =====

// Garis orbit berbentuk elips (Matahari ada di salah satu titik fokus)
function garisOrbit(a, e) {
  const pts = [];
  for (let i = 0; i <= 180; i++) {
    const t = i / 180 * Math.PI * 2;
    const r = a * (1 - e*e) / (1 + e * Math.cos(t));
    pts.push(new THREE.Vector3(r * Math.cos(t), 0, -r * Math.sin(t)));
  }
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({color:0xffffff, transparent:true, opacity:0.2})
  );
}

// Atmosfer: bola sedikit lebih besar yang hanya menyala di tepinya
function buatAtmosfer(radius, warna, kuat) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 48, 48),
    new THREE.ShaderMaterial({
      uniforms: {c:{value:new THREE.Color(warna)}, k:{value:kuat}},
      vertexShader:
        'varying vec3 vN;' +
        'void main(){ vN = normalize(normalMatrix * normal);' +
        'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader:
        'uniform vec3 c; uniform float k; varying vec3 vN;' +
        'void main(){ float i = pow(max(0.0, 0.75 - dot(vN, vec3(0.0, 0.0, 1.0))), 4.0);' +
        'gl_FragColor = vec4(c, 1.0) * i * k; }',
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    })
  );
}

// Cincin bergradasi dengan celah gelap (celah Cassini)
function buatCincin(dalam, luar) {
  const geo = new THREE.RingGeometry(dalam, luar, 96, 1);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {   // petakan UV menurut jarak dari pusat
    v.fromBufferAttribute(pos, i);
    uv.setXY(i, (v.length() - dalam) / (luar - dalam), 0.5);
  }
  const cv = document.createElement('canvas');
  cv.width = 256; cv.height = 4;
  const cx = cv.getContext('2d');
  const g = cx.createLinearGradient(0, 0, 256, 0);
  g.addColorStop(0.00, 'rgba(180,160,120,0)');
  g.addColorStop(0.08, 'rgba(200,180,140,0.55)');
  g.addColorStop(0.30, 'rgba(225,205,160,0.85)');
  g.addColorStop(0.55, 'rgba(215,195,150,0.80)');
  g.addColorStop(0.60, 'rgba(60,50,40,0.08)');
  g.addColorStop(0.66, 'rgba(60,50,40,0.08)');
  g.addColorStop(0.68, 'rgba(210,190,145,0.75)');
  g.addColorStop(0.95, 'rgba(190,170,130,0.50)');
  g.addColorStop(1.00, 'rgba(180,160,120,0)');
  cx.fillStyle = g;
  cx.fillRect(0, 0, 256, 4);
  return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(cv),
    transparent: true, side: THREE.DoubleSide, depthWrite: false
  }));
}

