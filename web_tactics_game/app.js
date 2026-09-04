// app.js - 简单的网格战棋原型
const GRID_SIZE = 8;
const TILE = 64; // 每个格子像素大小
const CANVAS_SIZE = GRID_SIZE * TILE;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const infoEl = document.getElementById('info');

let turn = 'player'; // 'player' or 'enemy'
let selectedUnit = null;

// 简单单位示例：己方和敌方
let units = [
  { id: 1, x: 1, y: 6, team: 'player', hp: 10 },
  { id: 2, x: 6, y: 1, team: 'enemy', hp: 10 }
];

function drawGrid() {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#262626' : '#1c1c1c';
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.strokeStyle = '#2f2f2f';
      ctx.strokeRect(x * TILE, y * TILE, TILE, TILE);
    }
  }
}

function drawUnits() {
  for (const u of units) {
    const cx = u.x * TILE + TILE / 2;
    const cy = u.y * TILE + TILE / 2;
    // 队伍颜色
    ctx.fillStyle = u.team === 'player' ? '#4caf50' : '#e74c3c';
    ctx.beginPath();
    ctx.arc(cx, cy, TILE * 0.36, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // HP 文本
    ctx.fillStyle = '#fff';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(u.hp, cx, cy);

    // 选中高亮
    if (selectedUnit && selectedUnit.id === u.id) {
      ctx.strokeStyle = '#ffd54f';
      ctx.lineWidth = 4;
      ctx.strokeRect(u.x * TILE + 6, u.y * TILE + 6, TILE - 12, TILE - 12);
      ctx.lineWidth = 1;
    }
  }
}

function render() {
  drawGrid();
  drawUnits();
}

function unitAt(x, y) {
  return units.find(u => u.x === x && u.y === y);
}

function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function onCanvasClick(e) {
  if (turn !== 'player') return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const cx = Math.floor(mx / TILE);
  const cy = Math.floor(my / TILE);

  const clicked = unitAt(cx, cy);
  if (selectedUnit) {
    // 如果点到己方单位则切换选择
    if (clicked && clicked.team === 'player') {
      selectedUnit = clicked;
      render();
      return;
    }
    // 尝试移动到空格或敌方格子（攻击）
    const dist = Math.abs(selectedUnit.x - cx) + Math.abs(selectedUnit.y - cy);
    if (dist === 0) return; // 点击自己不动
    if (dist <= 1) {
      const target = unitAt(cx, cy);
      if (!target) {
        // 移动
        selectedUnit.x = cx;
        selectedUnit.y = cy;
        endPlayerTurn();
      } else if (target.team === 'enemy') {
        // 简单攻击：扣血
        target.hp -= 5;
        if (target.hp <= 0) {
          units = units.filter(u => u.id !== target.id);
        }
        endPlayerTurn();
      }
      render();
      return;
    } else {
      // 点击太远，取消选择
      selectedUnit = null;
      render();
      return;
    }
  } else {
    // 未选中单位，点击己方单位选中
    if (clicked && clicked.team === 'player') {
      selectedUnit = clicked;
      render();
      return;
    }
  }
}

function endPlayerTurn() {
  selectedUnit = null;
  turn = 'enemy';
  infoEl.textContent = '回合：敌方';
  setTimeout(enemyMove, 500);
}

function enemyMove() {
  // 非复杂 AI：敌方随机移动或向最近己方单位靠近并尝试攻击
  const enemies = units.filter(u => u.team === 'enemy');
  const players = units.filter(u => u.team === 'player');
  if (players.length === 0 || enemies.length === 0) {
    finishCheck();
    return;
  }
  for (const e of enemies) {
    // 找最近玩家
    let nearest = players[0];
    let bestDist = manhattan(e, nearest);
    for (const p of players) {
      const d = manhattan(e, p);
      if (d < bestDist) { nearest = p; bestDist = d; }
    }
    if (bestDist <= 1) {
      // 攻击
      nearest.hp -= 3;
      if (nearest.hp <= 0) units = units.filter(u => u.id !== nearest.id);
    } else {
      // 向目标移动一步（简单朝向移动）
      const dx = Math.sign(nearest.x - e.x);
      const dy = Math.sign(nearest.y - e.y);
      const nx = e.x + (dx !== 0 ? dx : 0);
      const ny = e.y + (dx === 0 && dy !== 0 ? dy : 0);
      // 优先水平移动，如果被占则尝试垂直
      if (!unitAt(nx, e.y) && nx >=0 && nx < GRID_SIZE) {
        e.x = nx;
      } else if (!unitAt(e.x, e.y + dy) && (e.y + dy) >=0 && (e.y + dy) < GRID_SIZE) {
        e.y = e.y + dy;
      } else {
        // 随机移动（尝试空格）
        const candidates = [];
        const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
        for (const d of dirs) {
          const tx = e.x + d[0], ty = e.y + d[1];
          if (tx >=0 && tx < GRID_SIZE && ty >=0 && ty < GRID_SIZE && !unitAt(tx, ty)) candidates.push([tx,ty]);
        }
        if (candidates.length) {
          const c = candidates[Math.floor(Math.random() * candidates.length)];
          e.x = c[0]; e.y = c[1];
        }
      }
    }
  }
  turn = 'player';
  infoEl.textContent = '回合：玩家';
  render();
  finishCheck();
}

function finishCheck() {
  const players = units.filter(u => u.team === 'player');
  const enemies = units.filter(u => u.team === 'enemy');
  if (players.length === 0) {
    infoEl.textContent = '已败北 - 敌方获胜';
  } else if (enemies.length === 0) {
    infoEl.textContent = '胜利 - 玩家获胜';
  }
}

canvas.addEventListener('click', onCanvasClick);

// 初始化并渲染
render();
