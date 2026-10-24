'use strict';
const gameArea = document.querySelector('.game-box');
const fullscreenButton = document.getElementById('fullscreenButton');
function resizeGame() {
  const width = Math.max(1, Math.round(gameArea.clientWidth));
  const height = Math.max(1, Math.round(gameArea.clientHeight));
  if (canvas.width === width && canvas.height === height) return;
  canvas.width = width; canvas.height = height;
  camera.width = width; camera.height = height;
  camera.x = Math.max(0, Math.min(MAP.width-width, player.x + SIZE/2-width/2));
  camera.y = Math.max(0, Math.min(MAP.height-height, player.y + SIZE/2-height/2));
}
new ResizeObserver(resizeGame).observe(gameArea);
window.addEventListener('resize', resizeGame);
document.addEventListener('fullscreenchange', () => {
  fullscreenButton.textContent = document.fullscreenElement ? 'Кичирейтүү ⤡' : 'Толук экран ⛶';
  resizeGame();
});
fullscreenButton.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    fullscreenButton.textContent = 'Толук экран үчүн F11';
  }
});
resizeGame();
