'use strict';
// Бардык HP эсептөө жана HP тексти ушул файлда.
// Экинчи script катары game.js жүктөлөрдөн МУРУН кошулат.

function dealDamage(target, amount) {
  if (target.hp <= 0) return false;
  const actualDamage = Math.min(Math.max(0, amount), target.hp);
  if (!actualDamage) return false;
  if (target.hitTimer <= 0) {
    target.hitBase = target.hp;  // мисалы: 100
    target.hitSum = 0;
  }
  target.hp -= actualDamage;
  target.hitSum += actualDamage; // 100−10, 100−20, ...
  target.hitTimer = 1.4;
  target.flash = 0.18;
  return target.hp === 0;
}

function updateHp(unit, dt) {
  unit.hitTimer = Math.max(0, unit.hitTimer - dt);
  if (unit.hitTimer === 0) {
    unit.hitBase = unit.hp;
    unit.hitSum = 0;
  }
  const delta = unit.hp - unit.displayHp;
  unit.displayHp += Math.sign(delta) * Math.min(Math.abs(delta), 100 * dt);
}

function drawHealth(unit, label) {
  const x = unit.x, y = unit.y;
  const inCombat = unit.hitTimer > 0 && unit.hitSum > 0;
  const hpText = inCombat ? `${unit.hitBase}−${unit.hitSum}` : `${unit.hp}`;
  const fullText = `${label} ${hpText} хп`;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  // Текст квадраттын туурасынан АШПАЙТ жана жоон эмес.
  let fontSize = 16;
  do {
    ctx.font = `${fontSize}px Arial, sans-serif`;
    if (ctx.measureText(fullText).width <= unit.size - 4) break;
    fontSize--;
  } while (fontSize > 9);
  ctx.fillStyle = '#17202a';
  ctx.fillText(fullText, x + unit.size / 2, y - 25);

  // HP тилкеси да квадрат менен так бирдей тууралыкта.
  ctx.fillStyle = '#353d46';
  ctx.fillRect(x, y - 19, unit.size, 8);
  ctx.fillStyle = label === 'П' ? '#28a745' : '#e74c3c';
  ctx.fillRect(x, y - 19, unit.size * Math.max(0, unit.displayHp) / unit.maxHp, 8);
  ctx.restore();
}
