'use strict';
// Биринчи деңгээлдеги HP жана Damage мурдагы оюндан сакталат.
const HERO_GROWTH = { strength: 3, agility: 2, intelligence: 1, baseMana: 100 };
function totalXpForLevel(level) { return 50 * (level * level + level - 2); }
function mobExperience(level) { return (5 * level * level + 15 * level + 30) / 2; }
function initProgression(unit) {
  unit.level = 1; unit.xp = 0; unit.skillPoints = 0;
  unit.strength = 10; unit.agility = 10; unit.intelligence = 10;
  unit.armor = 0; unit.hpRegen = 0; unit.manaRegen = 0;
  unit.damageBonus = 0; unit.attackSpeedBonus = 0;
  unit.maxMana = HERO_GROWTH.baseMana; unit.mana = unit.maxMana;
  unit.levelFlash = 0;
}
function awardExperience(unit, mob) {
  if (mob.xpAwarded || mob.hp > 0) return;
  mob.xpAwarded = true;
  unit.xp += mobExperience(mob.level || 1);
  while (unit.xp >= totalXpForLevel(unit.level + 1)) {
    unit.level++; unit.skillPoints++;
    unit.strength += HERO_GROWTH.strength;
    unit.agility += HERO_GROWTH.agility;
    unit.intelligence += HERO_GROWTH.intelligence;
    const gainedHp = 25 * HERO_GROWTH.strength;
    unit.maxHp += gainedHp; unit.hp += gainedHp;
    unit.maxMana += 15 * HERO_GROWTH.intelligence;
    unit.mana += 15 * HERO_GROWTH.intelligence;
    const levels = unit.level - 1;
    unit.armor = 0.30 * HERO_GROWTH.agility * levels;
    unit.hpRegen = 0.05 * HERO_GROWTH.strength * levels;
    unit.manaRegen = 0.05 * HERO_GROWTH.intelligence * levels;
    unit.damageBonus = HERO_GROWTH.strength * levels;
    unit.attackSpeedBonus = 0.02 * HERO_GROWTH.agility * levels;
    unit.levelFlash = 2;
  }
}
function updateRegeneration(unit, dt) {
  if (unit.hp <= 0) return;
  unit.hp = Math.min(unit.maxHp, unit.hp + unit.hpRegen * dt);
  unit.mana = Math.min(unit.maxMana, unit.mana + unit.manaRegen * dt);
  unit.levelFlash = Math.max(0, unit.levelFlash - dt);
}
