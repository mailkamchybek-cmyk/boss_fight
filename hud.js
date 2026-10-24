'use strict';
const hud = Object.fromEntries(['heroName','heroHp','heroMana','hpFill','manaFill','xpFill','xpText','heroDamage','heroArmor','heroStrength','heroAgility','heroIntelligence','heroSpeed','heroPoints','heroStatus','minimap','heroPortrait'].map(id => [id, document.getElementById(id)]));
function updateHud() {
  updateDogButton();
  updateKomuzButton();
  if (!hud.heroName || !player) return;
  const start = totalXpForLevel(player.level), next = totalXpForLevel(player.level + 1);
  hud.heroName.textContent = 'Каарман · Level ' + player.level;
  hud.heroHp.textContent = Math.ceil(player.hp) + ' / ' + player.maxHp;
  hud.heroMana.textContent = Math.floor(player.mana) + ' / ' + player.maxMana;
  hud.hpFill.style.width = Math.max(0, player.hp / player.maxHp * 100) + '%';
  hud.manaFill.style.width = Math.max(0, player.mana / player.maxMana * 100) + '%';
  hud.xpFill.style.width = (player.xp-start)/(next-start)*100 + '%';
  hud.xpText.textContent = 'EXP ' + (player.xp-start) + ' / ' + (next-start);
  hud.heroDamage.textContent = playerAttackDamage(player);
  hud.heroArmor.textContent = player.armor.toFixed(1);
  hud.heroStrength.textContent = player.strength;
  hud.heroAgility.textContent = player.agility;
  hud.heroIntelligence.textContent = player.intelligence;
  hud.heroSpeed.textContent = (1/playerAttackCooldown(player)).toFixed(2) + '/сек';
  hud.heroPoints.textContent = player.skillPoints;
  hud.heroStatus.textContent = player.hp <= 0 ? 'Жеңилүү' : isPlayingKomuz() ? 'Комуз · ' + komuzRemaining.toFixed(1) + ' сек' : player.levelFlash > 0 ? 'LEVEL UP!' : waveTimer > 0 ? 'Толкун ' + (wave+1) + ': ' + Math.ceil(waveTimer) + ' сек' : 'Толкун ' + wave + ' · Мобдор ' + mobs.filter(m=>m.hp>0).length;
  const mini = hud.minimap.getContext('2d'), w = hud.minimap.width, h = hud.minimap.height;
  mini.fillStyle = '#18271c'; mini.fillRect(0,0,w,h);
  mini.strokeStyle = '#2c4232'; mini.lineWidth = 1;
  for (let n=1;n<5;n++) { mini.beginPath(); mini.moveTo(n*w/5,0);mini.lineTo(n*w/5,h);mini.moveTo(0,n*h/5);mini.lineTo(w,n*h/5);mini.stroke(); }
  mini.strokeStyle = '#c0c9b8'; mini.strokeRect(camera.x/MAP.width*w,camera.y/MAP.height*h,camera.width/MAP.width*w,camera.height/MAP.height*h);
  for (const mob of mobs) if (mob.hp>0) {mini.fillStyle='#f3493d';mini.fillRect((mob.x+mob.size/2)/MAP.width*w-2,(mob.y+mob.size/2)/MAP.height*h-2,4,4);}
  mini.fillStyle='#80ff8e';mini.beginPath();mini.arc((player.x+player.size/2)/MAP.width*w,(player.y+player.size/2)/MAP.height*h,3,0,Math.PI*2);mini.fill();
  const portrait=hud.heroPortrait.getContext('2d');
  portrait.clearRect(0,0,80,96);portrait.imageSmoothingEnabled=false;
  if(playerSpriteImage.complete && playerSpriteImage.naturalWidth) portrait.drawImage(playerSpriteImage,playerSpriteImage.naturalWidth/3,0,playerSpriteImage.naturalWidth/3,playerSpriteImage.naturalHeight/4,4,0,72,96);
}
