'use strict';
// МОБДУН ЧАБУУЛ ПАРАМЕТРЛЕРИ — ушул эки санды өзгөрт!
const MOB_ATTACK = {
  damage: 10,        // Мобдун бир соккусунун урону
  attackSpeed: 1     // Секундуна канча жолу урат (мисалы 2 = 2 сокку/сек)
};

function mobAttackDamage() {
  return Math.max(0, MOB_ATTACK.damage);
}

function mobAttackCooldown() {
  return 1 / Math.max(0.1, MOB_ATTACK.attackSpeed);
}
