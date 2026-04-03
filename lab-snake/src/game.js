const COLS = 20;
const ROWS = 20;
const CELL = 20; // px

export class Game {
  constructor(canvas, onScore) {
    this.ctx = canvas.getContext('2d');
    this.onScore = onScore;
    this.reset();
  }

  reset() {
    this.snake = [{ x: 10, y: 10 }];
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.food = this._spawnFood();
    this.score = 0;
    this.over = false;
    this.onScore(0);
  }

  setDir(dx, dy) {
    // 禁止反向
    if (dx === -this.dir.x && dy === -this.dir.y) return;
    this.nextDir = { x: dx, y: dy };
  }

  step() {
    if (this.over) return;

    this.dir = this.nextDir;
    const head = {
      x: this.snake[0].x + this.dir.x,
      y: this.snake[0].y + this.dir.y,
    };

    // 碰墙
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      this.over = true;
      return;
    }

    // 碰自身
    if (this.snake.some(s => s.x === head.x && s.y === head.y)) {
      this.over = true;
      return;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.onScore(this.score);
      this.food = this._spawnFood();
    } else {
      this.snake.pop();
    }
  }

  draw() {
    const { ctx } = this;
    ctx.clearRect(0, 0, COLS * CELL, ROWS * CELL);

    // 格子背景
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

    // 食物
    ctx.fillStyle = '#fed6e3';
    ctx.beginPath();
    ctx.arc(
      this.food.x * CELL + CELL / 2,
      this.food.y * CELL + CELL / 2,
      CELL / 2 - 2,
      0, Math.PI * 2
    );
    ctx.fill();

    // 蛇身
    this.snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? '#a8edea' : '#56cfe1';
      const pad = i === 0 ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(
        s.x * CELL + pad,
        s.y * CELL + pad,
        CELL - pad * 2,
        CELL - pad * 2,
        3
      );
      ctx.fill();
    });
  }

  _spawnFood() {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
    } while (this.snake && this.snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  }
}
