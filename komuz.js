'use strict';
const KOMUZ_SKILL = { duration: 7, frames: 14 };
const komuzSprite = new Image();
komuzSprite.src = 'komuz-sprite.png';
let komuzRemaining = 0;
function resetKomuz() { komuzRemaining = 0; }
function isPlayingKomuz() { return komuzRemaining > 0 && player.hp > 0; }
function castKomuz() {
  if (over || gameOverDelay > 0 || player.hp <= 0 || komuzRemaining > 0 || document.getElementById('shopDialog').open) return;
  komuzRemaining = KOMUZ_SKILL.duration;
  keys.clear(); mouseFollowing = false; player.moveTarget = null;
  player.moveX = 0; player.moveY = 0; player.isWalking = false;
}
function updateKomuz(dt) {
  if (player.hp <= 0) { komuzRemaining = 0; return; }
  komuzRemaining = Math.max(0, komuzRemaining - dt);
}
function drawKomuz(ctx, unit) {
  if (!isPlayingKomuz() || !komuzSprite.complete || !komuzSprite.naturalWidth) return false;
  const elapsed = KOMUZ_SKILL.duration - komuzRemaining;
  const frame = Math.min(KOMUZ_SKILL.frames - 1, Math.floor(elapsed / KOMUZ_SKILL.duration * KOMUZ_SKILL.frames));
  const fw = komuzSprite.naturalWidth / KOMUZ_SKILL.frames;
  const sh = komuzSprite.naturalHeight;
  const height = unit.size, width = height * fw / sh;
  ctx.save(); ctx.globalCompositeOperation = 'multiply';
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(komuzSprite, frame * fw, 0, fw, sh, unit.x + (unit.size-width)/2, unit.y, width, height);
  ctx.restore(); return true;
}
function updateKomuzButton() {
  const button = document.getElementById('komuzSkillButton');
  button.disabled = komuzRemaining > 0 || over || player.hp <= 0 || gameOverDelay > 0;
  document.getElementById('komuzTimer').textContent = komuzRemaining > 0 ? komuzRemaining.toFixed(1) : 'W';
}
document.getElementById('komuzSkillButton').addEventListener('click', castKomuz);
