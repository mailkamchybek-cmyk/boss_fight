'use strict';
const MOB_SETTINGS = {
  moveSpeed: 2 // клетка / секунда
};
function moveMobTowards(mob, player, deltaTime) {
  const dx = player.x - mob.x;
  const dy = player.y - mob.y;
  const distance = Math.hypot(dx, dy);
  const stopAt = MAP.tileSize; // жанаша келгенде токтойт
  if (distance <= stopAt) return;
  const step = Math.min(MOB_SETTINGS.moveSpeed * MAP.tileSize * deltaTime, distance - stopAt);
  mob.x = Math.max(0, Math.min(MAP.width - mob.size, mob.x + dx / distance * step));
  mob.y = Math.max(0, Math.min(MAP.height - mob.size, mob.y + dy / distance * step));
}
