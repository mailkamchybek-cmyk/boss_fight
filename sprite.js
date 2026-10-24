'use strict';
// Sprite: 3 кадр × 4 багыт (ылдый, сол, оң, өйдө).
const PLAYER_SPRITE = {
  src: 'player_sprite.png',
  frameWidth: 64,
  frameHeight: 64,
  framesPerDirection: 3,
  walkFramesPerSecond: 8, // Жүрүш анимациясынын ылдамдыгы
};
const playerSpriteImage = new Image();
playerSpriteImage.src = PLAYER_SPRITE.src;
function initPlayerAnimation(unit) {
  unit.direction = 0; // 0 = ылдый, 1 = сол, 2 = оң, 3 = өйдө
  unit.walkTime = 0;
  unit.isWalking = false;
}
function animatePlayer(unit, keys, dt) {
  const left = keys.has('a') || keys.has('arrowleft');
  const right = keys.has('d') || keys.has('arrowright');
  const up = keys.has('w') || keys.has('arrowup');
  const down = keys.has('s') || keys.has('arrowdown');
  const dx = Number(right) - Number(left);
  const dy = Number(down) - Number(up);
  unit.isWalking = dx !== 0 || dy !== 0;
  if (!unit.isWalking) { unit.walkTime = 0; return; }
  // Негизги огуна жараша караган багыты
  if (Math.abs(dx) >= Math.abs(dy) && dx !== 0) unit.direction = dx < 0 ? 1 : 2;
  else if (dy !== 0) unit.direction = dy < 0 ? 3 : 0;
  unit.walkTime += dt;
}
function drawPlayerSprite(ctx, unit) {
  if (!playerSpriteImage.complete || !playerSpriteImage.naturalWidth) return false;
  const frame = unit.isWalking
    ? Math.floor(unit.walkTime * PLAYER_SPRITE.walkFramesPerSecond) % PLAYER_SPRITE.framesPerDirection
    : 1;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(playerSpriteImage,
    frame * PLAYER_SPRITE.frameWidth,
    unit.direction * PLAYER_SPRITE.frameHeight,
    PLAYER_SPRITE.frameWidth, PLAYER_SPRITE.frameHeight,
    unit.x, unit.y, unit.size, unit.size);
  ctx.imageSmoothingEnabled = true;
  return true;
}
