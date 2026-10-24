'use strict';
// ПЕРСОНАЖДЫН СОГУШ ПАРАМЕТРЛЕРИ — ушул эки санды өзгөрт!
const PLAYER_ATTACK = {
  damage: 30,      // Бир соккудагы урон. Мисалы: 50
  attackSpeed: 2.86 // Секундуна канча жолу урат. Мисалы: 5
};

function playerAttackCooldown() {
  return 1 / Math.max(0.1, PLAYER_ATTACK.attackSpeed);
}

function playerAttackDamage() {
  return Math.max(0, PLAYER_ATTACK.damage);
}
