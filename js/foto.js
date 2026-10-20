// ===== FOTO PEMANDANGAN: ambil gambar simulasi, lihat pratinjau, unduh / bagikan =====
const btnFoto = document.getElementById('btnFoto');
const fotoModal = document.getElementById('fotoModal');
const fotoImg = document.getElementById('fotoImg');
const fotoUnduh = document.getElementById('fotoUnduh');
const fotoBagi = document.getElementById('fotoBagi');
let fotoUrl = null, fotoFile = null;

const kilat = document.createElement('div');
kilat.style.cssText = 'position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;transition:opacity .25s;z-index:30';
document.body.appendChild(kilat);

function ambilFoto() {
  // Render ulang lalu langsung salin, supaya kanvas WebGL belum terhapus
  renderer.render(scene, camera);
  const sumber = renderer.domElement;
  const cv = document.createElement('canvas');
  cv.width = sumber.width;
  cv.height = sumber.height;
  const cx = cv.getContext('2d');
  cx.drawImage(sumber, 0, 0);

  // Teks kecil di pojok kiri bawah: nama objek yang sedang difokuskan + tanggal
  const u = Math.max(14, Math.round(cv.width * 0.026));
  const tgl = new Date().toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'});
  cx.font = '600 ' + u + 'px system-ui, sans-serif';
  cx.textBaseline = 'bottom';
  cx.shadowColor = 'rgba(0,0,0,.85)';
  cx.shadowBlur = u * 0.3;
  cx.fillStyle = 'rgba(255,255,255,.85)';
  cx.fillText('Solar Odyssey • ' + (fokus ? fokus.nama : 'Tata Surya') + ' • ' + tgl, u, cv.height - u);

  kilat.style.opacity = 0.8;
  setTimeout(() => { kilat.style.opacity = 0; }, 120);
  sfxTok();

  cv.toBlob((blob) => {
    if (!blob) return;
    if (fotoUrl) URL.revokeObjectURL(fotoUrl);
    fotoUrl = URL.createObjectURL(blob);
    const nama = 'solar-odyssey-' + new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '') + '.png';
    fotoFile = new File([blob], nama, {type:'image/png'});
    fotoImg.src = fotoUrl;
    fotoUnduh.href = fotoUrl;
    fotoUnduh.download = nama;
    const bisaBagi = navigator.canShare && navigator.canShare({files:[fotoFile]});
    fotoBagi.style.display = bisaBagi ? 'inline-block' : 'none';
    fotoModal.style.display = 'flex';
  }, 'image/png');
}

btnFoto.addEventListener('click', ambilFoto);
document.getElementById('fotoTutup').addEventListener('click', () => { fotoModal.style.display = 'none'; });
fotoBagi.addEventListener('click', () => {
  navigator.share({files:[fotoFile], title:'Solar Odyssey'}).catch(() => {});
});
