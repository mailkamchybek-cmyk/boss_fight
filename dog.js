'use strict';
const DOG_SKILL = { speed: 400, range: 600, cooldown: 1.5, frames: 5, fps: 12 };
const dogSprite = new Image();
dogSprite.src = 'dog-sprite.png';
let runningDogs = [];
let dogCooldown = 0;
function resetDogs() { runningDogs = []; dogCooldown = 0; }
function castDog() {
  if (over || gameOverDelay > 0 || player.hp <= 0 || dogCooldown > 0 || document.getElementById('shopDialog').open) return;
  const directions = [{x:0,y:1},{x:-1,y:0},{x:1,y:0},{x:0,y:-1}];
  const direction = directions[player.direction] || directions[0];
  runningDogs.push({
    x: player.x + player.size / 2 + direction.x * player.size,
    y: player.y + player.size / 2 + direction.y * player.size,
    dx: direction.x, dy: direction.y, age: 0, distance: 0
  });
  dogCooldown = DOG_SKILL.cooldown;
}
function updateDogs(dt) {
  dogCooldown = Math.max(0, dogCooldown - dt);
  for (const dog of runningDogs) {
    const step = Math.min(DOG_SKILL.speed * dt, DOG_SKILL.range - dog.distance);
    dog.x += dog.dx * step; dog.y += dog.dy * step;
    dog.age += dt; dog.distance += step;
  }
  runningDogs = runningDogs.filter(d => d.distance < DOG_SKILL.range && d.x >= 0 && d.x <= MAP.width && d.y >= 0 && d.y <= MAP.height);
}
function drawDogs(ctx) {
  if (!dogSprite.complete || !dogSprite.naturalWidth) return;
  const fw = dogSprite.naturalWidth / DOG_SKILL.frames;
  const sy = dogSprite.naturalHeight * 0.30;
  const sh = dogSprite.naturalHeight * 0.42;
  for (const dog of runningDogs) {
    const frame = Math.floor(dog.age * DOG_SKILL.fps) % DOG_SKILL.frames;
    ctx.save(); ctx.translate(dog.x, dog.y);
    if (dog.dx < 0) ctx.scale(-1, 1);
    else if (dog.dy) ctx.rotate(dog.dy > 0 ? Math.PI/2 : -Math.PI/2);
    // Ак фон картага аралашат, кара иттин силуэти гана көрүнөт.
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(dogSprite, frame * fw, sy, fw, sh, -35, -24.5, 70, 49);
    ctx.restore();
  }
}
function updateDogButton() {
  const button = document.getElementById('dogSkillButton');
  const label = document.getElementById('dogCooldown');
  if (!button) return;
  button.disabled = dogCooldown > 0 || player.hp <= 0 || over || gameOverDelay > 0;
  label.textContent = dogCooldown > 0 ? dogCooldown.toFixed(1) : 'Q';
}
document.getElementById('dogSkillButton').addEventListener('click', castDog);
