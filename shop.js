'use strict';
const shopButton = document.getElementById('shopButton');
const shopDialog = document.getElementById('shopDialog');
const shopClose = document.getElementById('shopClose');
function closeShop() { if (shopDialog.open) shopDialog.close(); }
function toggleShop() {
  if (shopDialog.open) { closeShop(); return; }
  keys.clear(); mouseFollowing = false; player.moveTarget = null;
  shopDialog.showModal(); shopButton.setAttribute('aria-expanded', 'true');
  shopClose.focus();
}
shopButton.addEventListener('click', toggleShop);
shopClose.addEventListener('click', closeShop);
shopDialog.addEventListener('close', () => {
  shopButton.setAttribute('aria-expanded', 'false');
  lastTime = performance.now(); shopButton.focus();
});
shopDialog.addEventListener('click', e => {
  if (e.target !== shopDialog) return;
  const r = shopDialog.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeShop();
});
window.addEventListener('keydown', e => {
  if (e.code !== 'Digit1' && e.code !== 'Numpad1' && e.key !== '1') return;
  if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;
  e.preventDefault(); toggleShop();
});
