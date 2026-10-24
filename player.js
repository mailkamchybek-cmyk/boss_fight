'use strict';
const PLAYER_SETTINGS = {
  moveSpeed: 3 // клетка / секунда. Мисалы, 5 = 5 клетка/сек
};
function movePlayer(unit, pressedKeys, deltaTime) {
  const x = Number(pressedKeys.has('d') || pressedKeys.has('arrowright')) - Number(pressedKeys.has('a') || pressedKeys.has('arrowleft'));
  const y = Number(pressedKeys.has('s') || pressedKeys.has('arrowdown')) - Number(pressedKeys.has('w') || pressedKeys.has('arrowup'));
  const length = Math.hypot(x, y) || 1;
  const speed = PLAYER_SETTINGS.moveSpeed * MAP.tileSize; // клетка/сек -> px/сек
  unit.x = Math.max(0, Math.min(MAP.width - unit.size, unit.x + x / length * speed * deltaTime));
  unit.y = Math.max(0, Math.min(MAP.height - unit.size, unit.y + y / length * speed * deltaTime));
}
