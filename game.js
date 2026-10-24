'use strict';
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const keys = new Set();
let mouseFollowing = false;
let mousePosition = null;
function setMouseTarget() {
  if (!mousePosition || over || gameOverDelay > 0) return;
  const rect = canvas.getBoundingClientRect();
  const viewX = (mousePosition.x - rect.left - canvas.clientLeft) * canvas.width / canvas.clientWidth;
  const viewY = (mousePosition.y - rect.top - canvas.clientTop) * canvas.height / canvas.clientHeight;
  player.moveTarget = {
    x: Math.max(0, Math.min(MAP.width - player.size, viewX + camera.x - player.size / 2)),
    y: Math.max(0, Math.min(MAP.height - player.size, viewY + camera.y - player.size / 2))
  };
}
const gameOverWindow = document.getElementById('gameOverWindow');
const gameOverTitle = document.getElementById('gameOverTitle');
const restartButton = document.getElementById('restartButton');
canvas.width = MAP.visibleColumns * MAP.tileSize;
const SIZE = MAP.tileSize; // каарман да, моб да 1 клетка
let player, mobs, over, lastTime, gameOverDelay, playerSwing, camera;
function makeUnit(position, hp) {
  return { ...position, size: SIZE, maxHp: hp, hp, cooldown: 0, flash: 0, displayHp: hp, hitBase: hp, hitSum: 0, hitTimer: 0 };
}
function reset() {
  mouseFollowing = false; mousePosition = null;
  player = makeUnit(cellPosition(MAP.playerSpawn.col, MAP.playerSpawn.row), 100);
  initPlayerAnimation(player);
  mobs = MAP.mobSpawns.map(p => makeUnit(cellPosition(p.col, p.row), 30));
  camera = { x: 0, y: 0, width: canvas.width, height: canvas.height };
  over = false; gameOverDelay = 0; playerSwing = 0;
  gameOverWindow.hidden = true; keys.clear(); lastTime = performance.now();
}
function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function attack() {
  if (over || gameOverDelay > 0 || player.cooldown > 0) return;
  const target = mobs.find(m => m.hp > 0 && distance(player, m) <= MAP.tileSize * 1.55);
  if (!target) return;
  dealDamage(target, playerAttackDamage());
  player.cooldown = playerAttackCooldown(); playerSwing = 0.18;
  if (mobs.every(m => m.hp <= 0)) gameOverDelay = 1.3;
}
function update(dt) {
  updateHp(player, dt); for (const mob of mobs) updateHp(mob, dt);
  playerSwing = Math.max(0, playerSwing - dt);
  player.flash = Math.max(0, player.flash - dt);
  for (const mob of mobs) mob.flash = Math.max(0, mob.flash - dt);
  if (gameOverDelay > 0) {
    gameOverDelay -= dt;
    if (gameOverDelay <= 0) {
      over = true;
      gameOverTitle.textContent = player.hp > 0 ? 'ЖЕҢИШ!' : 'ЖЕҢИЛДИҢ!';
      gameOverWindow.hidden = false; restartButton.focus();
    }
  }
  if (over || gameOverDelay > 0) return;
  player.cooldown = Math.max(0, player.cooldown - dt);
  if (mouseFollowing) setMouseTarget();
  movePlayer(player, keys, dt);
  animatePlayer(player, keys, dt);
  attack(); // Жакын келген мобго автоматтык чабуул.
  for (const mob of mobs) {
    if (mob.hp <= 0) continue;
    mob.cooldown = Math.max(0, mob.cooldown - dt);
    moveMobTowards(mob, player, dt);
    if (distance(player, mob) <= MAP.tileSize * 1.52 && mob.cooldown <= 0) {
      const dead = dealDamage(player, mobAttackDamage());
      mob.cooldown = mobAttackCooldown();
      if (dead) { gameOverDelay = 1.3; break; }
    }
  }
}
function drawUnit(unit, color, label) {
  ctx.fillStyle = unit.flash > 0 ? '#ffffff' : color;
  ctx.fillRect(unit.x, unit.y, unit.size, unit.size);
  ctx.strokeStyle = '#17202a'; ctx.lineWidth = 2;
  ctx.strokeRect(unit.x, unit.y, unit.size, unit.size);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 24px Arial';
  ctx.fillText(label, unit.x + unit.size/2, unit.y + unit.size/2);
  drawHealth(unit, label);
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  camera.x = Math.max(0, Math.min(MAP.width - camera.width, player.x + SIZE/2 - camera.width/2));
  camera.y = Math.max(0, Math.min(MAP.height - camera.height, player.y + SIZE/2 - camera.height/2));
  ctx.save(); ctx.translate(-camera.x, -camera.y);
  drawMap(ctx, camera);
  if (player.moveTarget) {
    ctx.strokeStyle = '#28a745'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(player.moveTarget.x + SIZE/2, player.moveTarget.y + SIZE/2, 9, 0, Math.PI*2); ctx.stroke();
  }
  for (const mob of mobs) if (mob.hp > 0) drawUnit(mob, '#ed3434', 'М');
  if (!drawPlayerSprite(ctx, player)) drawUnit(player, '#1677ff', 'П');
  else drawHealth(player, 'П');
  if (playerSwing > 0) {
    ctx.strokeStyle = '#f3c84d'; ctx.lineWidth = 4;
    ctx.strokeRect(player.x-4, player.y-4, SIZE+8, SIZE+8);
  }
  ctx.restore();
  ctx.fillStyle = '#17202ae8'; ctx.fillRect(9, 8, 430, 48);
  ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.font = '15px Arial';
  ctx.fillText('Карта: 50×50  |  П: 3 клетка/с  |  М: 2 клетка/с', 18, 28);
  ctx.fillText('Мобдор: ' + mobs.filter(m => m.hp > 0).length + '  |  HP: ' + player.hp + '/100', 18, 47);
}
function frame(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now; update(dt); draw(); requestAnimationFrame(frame);
}
window.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();
  if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) e.preventDefault();
  keys.add(key); if (key === 'r') reset();
});
window.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
canvas.addEventListener('contextmenu', e => e.preventDefault());
canvas.addEventListener('pointerdown', e => {
  if (e.button !== 2 || over || gameOverDelay > 0) return;
  e.preventDefault(); mouseFollowing = true;
  mousePosition = { x: e.clientX, y: e.clientY };
  canvas.setPointerCapture(e.pointerId); setMouseTarget();
});
canvas.addEventListener('pointermove', e => {
  if (mouseFollowing) mousePosition = { x: e.clientX, y: e.clientY };
});
window.addEventListener('pointerup', e => {
  if (e.button === 2) { if (mouseFollowing) { mousePosition = { x:e.clientX, y:e.clientY }; setMouseTarget(); } mouseFollowing = false; }
});
canvas.addEventListener('pointercancel', () => { mouseFollowing = false; player.moveTarget = null; });
canvas.addEventListener('lostpointercapture', () => { mouseFollowing = false; });
window.addEventListener('blur', () => { keys.clear(); mouseFollowing = false; player.moveTarget = null; });
restartButton.addEventListener('click', reset);
reset(); requestAnimationFrame(frame);
