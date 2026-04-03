import { Game } from './game.js';

const canvas = document.getElementById('canvas');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('message');

const INTERVAL = 150; // ms per step

let game = new Game(canvas, score => { scoreEl.textContent = score; });
let lastTime = 0;
let running = false;

function loop(ts) {
  if (game.over) {
    messageEl.textContent = `游戏结束！得分 ${game.score}　按任意键重新开始`;
    game.draw();
    running = false;
    return;
  }

  if (ts - lastTime >= INTERVAL) {
    game.step();
    lastTime = ts;
  }

  game.draw();
  requestAnimationFrame(loop);
}

function start() {
  game.reset();
  messageEl.textContent = '方向键 / WASD 控制';
  lastTime = 0;
  if (!running) {
    running = true;
    requestAnimationFrame(loop);
  }
}

const KEY_MAP = {
  ArrowUp:    [0, -1], w: [0, -1], W: [0, -1],
  ArrowDown:  [0,  1], s: [0,  1], S: [0,  1],
  ArrowLeft:  [-1, 0], a: [-1, 0], A: [-1, 0],
  ArrowRight: [1,  0], d: [1,  0], D: [1,  0],
};

document.addEventListener('keydown', e => {
  if (game.over) {
    start();
    return;
  }
  const dir = KEY_MAP[e.key];
  if (dir) {
    e.preventDefault();
    game.setDir(dir[0], dir[1]);
  }
});

start();
