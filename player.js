'use strict';
const PLAYER_SETTINGS = {
  moveSpeed: 3 // клетка / секунда. Мисалы, 5 = 5 клетка/сек
};
function movePlayer(unit, pressedKeys, deltaTime) {
  let x = Number(pressedKeys.has('d') || pressedKeys.has('arrowright')) - Number(pressedKeys.has('a') || pressedKeys.has('arrowleft'));
  let y = Number(pressedKeys.has('s') || pressedKeys.has('arrowdown')) - Number(pressedKeys.has('arrowup'));
  if (x || y) unit.moveTarget = null;
  let maxStep = Infinity;
  if (!x && !y && unit.moveTarget) {
    x = unit.moveTarget.x - unit.x;
    y = unit.moveTarget.y - unit.y;
    maxStep = Math.hypot(x, y);
    if (maxStep < 0.01) { unit.moveTarget = null; x = 0; y = 0; }
  }
  const beforeX = unit.x, beforeY = unit.y;
  const length = Math.hypot(x, y) || 1;
  const speed = PLAYER_SETTINGS.moveSpeed * MAP.tileSize; // клетка/сек -> px/сек
  const step = Math.min(speed * deltaTime, maxStep);
  unit.x = Math.max(0, Math.min(MAP.width - unit.size, unit.x + x / length * step));
  unit.y = Math.max(0, Math.min(MAP.height - unit.size, unit.y + y / length * step));
  unit.moveX = unit.x - beforeX;
  unit.moveY = unit.y - beforeY;
  if (unit.moveTarget && Math.hypot(unit.moveTarget.x-unit.x, unit.moveTarget.y-unit.y) < 0.01) unit.moveTarget = null;
}
