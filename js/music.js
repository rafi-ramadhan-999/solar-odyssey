// ===== MUSIK LATAR =====
const btnMusik = document.getElementById('btnMusik');
let musikNyala = false;
let fileMusik = null;
let ac = null, master = null, genAktif = false, timerAkord = null;

const akordList = [
  [110.00, 164.81, 220.00, 261.63, 329.63],
  [87.31, 130.81, 174.61, 220.00, 261.63],
  [130.81, 196.00, 261.63, 329.63, 392.00],
  [98.00, 146.83, 196.00, 246.94, 293.66]
];
let indexAkord = 0;

function mainkanAkord(frekuensiList, tujuan) {
  const t0 = ac.currentTime;
  const lama = 10;
  for (const f of frekuensiList) {
    for (const geser of [-4, 4]) {
      const osc = ac.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = f;
      osc.detune.value = geser;

      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 900;

      const g = ac.createGain();
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.05, t0 + 3.5);
      g.gain.linearRampToValueAtTime(0.05, t0 + lama - 4);
      g.gain.linearRampToValueAtTime(0, t0 + lama);

      osc.connect(filter); filter.connect(g); g.connect(tujuan);
      osc.start(t0);
      osc.stop(t0 + lama + 0.1);
    }
  }
}

function mulaiGenerative() {
  if (genAktif) return;
  genAktif = true;
  ac = ac || new (window.AudioContext || window.webkitAudioContext)();
  ac.resume();

  master = ac.createGain();
  master.gain.value = 0;
  master.gain.linearRampToValueAtTime(0.6, ac.currentTime + 4);
  master.connect(ac.destination);

  const delay = ac.createDelay(1);
  delay.delayTime.value = 0.42;
  const umpan = ac.createGain(); umpan.gain.value = 0.5;
  const lpGema = ac.createBiquadFilter(); lpGema.type = 'lowpass'; lpGema.frequency.value = 1500;
  delay.connect(umpan); umpan.connect(lpGema); lpGema.connect(delay);
  const basah = ac.createGain(); basah.gain.value = 0.6;
  delay.connect(basah); basah.connect(master);

  const bus = ac.createGain();
  bus.connect(master);
  bus.connect(delay);

  const drone = ac.createOscillator();
  drone.type = 'sine';
  drone.frequency.value = 55;
  const gDrone = ac.createGain();
  gDrone.gain.value = 0.12;
  drone.connect(gDrone); gDrone.connect(master);
  drone.start();
  master._drone = drone;

  mainkanAkord(akordList[indexAkord], bus);
  timerAkord = setInterval(() => {
    indexAkord = (indexAkord + 1) % akordList.length;
    mainkanAkord(akordList[indexAkord], bus);
  }, 8000);
}

function hentikanGenerative() {
  if (!genAktif) return;
  genAktif = false;
  clearInterval(timerAkord);
  const drone = master._drone;
  master.gain.setTargetAtTime(0, ac.currentTime, 0.4);
  setTimeout(() => { try { drone.stop(); } catch (e) {} }, 2000);
}

function nyalakanMusik() {
  if (!fileMusik) {
    fileMusik = new Audio('musik/latar.mp3');
    fileMusik.loop = true;
    fileMusik.volume = 0.6;
    fileMusik.addEventListener('error', () => {
      fileMusik.gagal = true;
      if (musikNyala) mulaiGenerative();
    });
  }
  if (fileMusik.gagal) {
    mulaiGenerative();
  } else {
    fileMusik.play().catch(() => {
      fileMusik.gagal = true;
      if (musikNyala) mulaiGenerative();
    });
  }
}

function matikanMusik() {
  if (fileMusik) fileMusik.pause();
  hentikanGenerative();
}

btnMusik.addEventListener('click', () => {
  musikNyala = !musikNyala;
  btnMusik.textContent = musikNyala ? '🔊' : '🔇';
  if (musikNyala) nyalakanMusik(); else matikanMusik();
});

document.addEventListener('visibilitychange', () => {
  if (!musikNyala) return;
  if (document.hidden) {
    if (fileMusik && !fileMusik.gagal) fileMusik.pause();
    if (ac) ac.suspend();
  } else {
    if (fileMusik && !fileMusik.gagal) fileMusik.play().catch(() => {});
    if (ac) ac.resume();
  }
});

