// ===== MODE MISI: TEBAK PLANET =====
const elGame = document.getElementById('game');
const gStat = document.getElementById('gStat');
const gClue = document.getElementById('gClue');
const gMsg = document.getElementById('gMsg');
const gLanjut = document.getElementById('gLanjut');
const hintEl = document.getElementById('hint');
const btnMain = document.getElementById('btnMain');

const WAKTU_SOAL = 20;
let gameAktif = false;
let soal = [];
let nomor = 0;
let skor = 0;
let sisa = WAKTU_SOAL;
let kesempatan = 2;
let menunggu = false;
let petunjuk = '';
let timerSoal = null;
let aksiLanjut = null;

function bunyi(frek, durasi = 0.15, jeda = 0) {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    ac.resume();
    const t = ac.currentTime + jeda;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = 'sine';
    o.frequency.value = frek;
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + durasi);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + durasi);
  } catch (e) {}
}

function acak(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function render() {
  gStat.textContent = 'Soal ' + (nomor + 1) + '/' + soal.length +
    '  •  Skor ' + skor + '  •  ⏱ ' + sisa;
  gClue.textContent = 'Planet apa yang punya ciri ini? "' + soal[nomor].info.fakta + '"' +
    (petunjuk ? '  ' + petunjuk : '');
}

function mulaiGame() {
  gameAktif = true;
  soal = acak(daftarEntri);
  nomor = 0;
  skor = 0;
  lihatSemua();
  hintEl.style.display = 'none';
  btnMain.style.display = 'none';
  elGame.style.display = 'block';
  soalBerikut();
}

function soalBerikut() {
  if (nomor >= soal.length) { tampilHasil(); return; }
  kesempatan = 2;
  menunggu = false;
  petunjuk = '';
  sisa = WAKTU_SOAL;
  gLanjut.style.display = 'none';
  gMsg.textContent = 'Ketuk planet yang tepat!';
  render();
  clearInterval(timerSoal);
  timerSoal = setInterval(() => {
    sisa--;
    if (sisa <= 0) {
      sisa = 0;
      render();
      selesaiSoal(false, 0, '⏰ Waktu habis! ');
    } else {
      render();
    }
  }, 1000);
}

function jawab(entri) {
  if (!gameAktif || menunggu) return;
  if (entri.nama === 'Matahari') {
    gMsg.textContent = 'Itu Matahari, bukan planet. Coba lagi!';
    return;
  }
  const benar = soal[nomor];
  if (entri === benar) {
    const poin = kesempatan === 2 ? 100 + sisa * 3 : 50;
    skor += poin;
    bunyi(660, 0.12); bunyi(880, 0.2, 0.12);
    selesaiSoal(true, poin, '');
  } else {
    kesempatan--;
    bunyi(150, 0.3);
    if (kesempatan > 0) {
      petunjuk = '💡 Petunjuk: jaraknya dari Matahari ' + benar.info.jarak + '.';
      gMsg.textContent = '❌ Salah, itu ' + entri.nama + '. Satu kesempatan lagi!';
      render();
    } else {
      selesaiSoal(false, 0, '');
    }
  }
}

function selesaiSoal(benar, poin, awalan) {
  menunggu = true;
  clearInterval(timerSoal);
  const jawaban = soal[nomor];
  gMsg.textContent = benar
    ? '✅ Benar! Itu ' + jawaban.nama + '. +' + poin
    : awalan + '❌ Jawabannya: ' + jawaban.nama;

  fokus = jawaban;
  aturFrame = 100;
  jarakTujuan = jawaban.jarakLihat + 2;

  render();
  gLanjut.textContent = (nomor + 1 >= soal.length) ? 'Lihat hasil' : 'Soal berikutnya';
  gLanjut.style.display = 'inline-block';
  aksiLanjut = () => {
    fokus = null;
    aturFrame = 100;
    jarakTujuan = 85;
    nomor++;
    soalBerikut();
  };
}

function tampilHasil() {
  gameAktif = false;
  clearInterval(timerSoal);
  let rekorLama = 0;
  try { rekorLama = Number(localStorage.getItem('tatasuryaRekor')) || 0; } catch (e) {}
  const rekorBaru = skor > rekorLama;
  try { if (rekorBaru) localStorage.setItem('tatasuryaRekor', String(skor)); } catch (e) {}

  let pangkat = 'Calon Kru';
  if (skor >= 1000) pangkat = 'Komandan Misi';
  else if (skor >= 700) pangkat = 'Astronot';
  else if (skor >= 400) pangkat = 'Kadet';

  gStat.textContent = 'Misi selesai!';
  gClue.textContent = 'Skor akhir: ' + skor + '  —  Pangkat: ' + pangkat;
  gMsg.textContent = rekorBaru ? '🎉 Rekor baru!' : 'Rekor terbaikmu: ' + rekorLama;
  gLanjut.textContent = 'Main lagi';
  gLanjut.style.display = 'inline-block';
  aksiLanjut = mulaiGame;
}

function keluarGame() {
  gameAktif = false;
  menunggu = false;
  clearInterval(timerSoal);
  elGame.style.display = 'none';
  hintEl.style.display = 'block';
  btnMain.style.display = 'block';
  lihatSemua();
}

btnMain.addEventListener('click', mulaiGame);
gLanjut.addEventListener('click', () => { if (aksiLanjut) aksiLanjut(); });
document.getElementById('gKeluar').addEventListener('click', keluarGame);

