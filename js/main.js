function loop(){
  requestAnimationFrame(loop);
  const k = kecepatan;

  matahari.rotation.y += 0.002 * k;

  for (const p of planetPlanet) {
    if (p.bebas) { p.bola.rotation.y += p.putar * k; continue; }   // digerakkan kacau.js
    // Hukum Kepler: makin dekat Matahari, makin cepat
    const f = Math.pow(1 + p.e * Math.cos(p.sudut), 2) / Math.pow(1 - p.e * p.e, 1.5);
    p.sudut += p.orbit * f * k;
    const r = p.a * (1 - p.e * p.e) / (1 + p.e * Math.cos(p.sudut));
    p.badan.position.set(r * Math.cos(p.sudut), 0, -r * Math.sin(p.sudut));
    p.bola.rotation.y += p.putar * k;
  }
  awanBumi.rotation.y += 0.004 * k;
  orbitBulan.rotation.y += 0.03 * k;
  sabuk.rotation.y += 0.0008 * k;
  sabukKuiper.rotation.y += 0.0003 * k;
  updateKomet(k);
  updateKacau(k);
  updateTambahan(k);
  if (shipAktif) { updateKapal(); renderer.render(scene, camera); return; }

  if (fokus || aturFrame > 0) {
    if (fokus) fokus.planet.getWorldPosition(posTmp);
    else posTmp.set(0, 0, 0);

    const sebelum = controls.target.clone();
    controls.target.lerp(posTmp, 0.1);
    camera.position.add(controls.target.clone().sub(sebelum));

    if (aturFrame > 0) {
      const arah = camera.position.clone().sub(controls.target);
      const jarakNow = arah.length();
      const jarakBaru = THREE.MathUtils.lerp(jarakNow, jarakTujuan, 0.06);
      camera.position.copy(controls.target).add(arah.setLength(jarakBaru));
      aturFrame--;
    }
  }

  controls.update();
  renderer.render(scene, camera);
}
loop();
