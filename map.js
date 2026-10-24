'use strict';
// 50 x 50 клетка. Бир клетка = 50 пиксель.
const MAP = {
  columns: 50,
  rows: 50,
  tileSize: 50,
  visibleColumns: 12, // экрандын туурасында 12 клетка
  playerSpawn: { col: 46, row: 46 }, // төмөнкү оң жак
  mobSpawns: [
    { col: 8, row: 2 },
    { col: 20, row: 2 },
    { col: 32, row: 2 },
    { col: 44, row: 2 }
  ]
};
MAP.width = MAP.columns * MAP.tileSize;
MAP.height = MAP.rows * MAP.tileSize;
function cellPosition(col, row) {
  return { x: col * MAP.tileSize, y: row * MAP.tileSize };
}
function drawMap(ctx, view) {
  ctx.fillStyle = '#eaf3e5';
  ctx.fillRect(0, 0, MAP.width, MAP.height);
  const firstCol = Math.max(0, Math.floor(view.x / MAP.tileSize));
  const lastCol = Math.min(MAP.columns, Math.ceil((view.x + view.width) / MAP.tileSize));
  const firstRow = Math.max(0, Math.floor(view.y / MAP.tileSize));
  const lastRow = Math.min(MAP.rows, Math.ceil((view.y + view.height) / MAP.tileSize));
  for (let row = firstRow; row < lastRow; row++) {
    for (let col = firstCol; col < lastCol; col++) {
      if ((row + col) % 2 === 0) {
        ctx.fillStyle = '#e1eedc';
        ctx.fillRect(col * MAP.tileSize, row * MAP.tileSize, MAP.tileSize, MAP.tileSize);
      }
    }
  }
  ctx.beginPath();
  for (let col = firstCol; col <= lastCol; col++) {
    const x = col * MAP.tileSize;
    ctx.moveTo(x, firstRow * MAP.tileSize);
    ctx.lineTo(x, lastRow * MAP.tileSize);
  }
  for (let row = firstRow; row <= lastRow; row++) {
    const y = row * MAP.tileSize;
    ctx.moveTo(firstCol * MAP.tileSize, y);
    ctx.lineTo(lastCol * MAP.tileSize, y);
  }
  ctx.strokeStyle = '#b7c9b4';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#6b8d71';
  ctx.strokeRect(0, 0, MAP.width, MAP.height);
}
