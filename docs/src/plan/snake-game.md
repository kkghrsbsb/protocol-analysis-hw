# 贪吃蛇小游戏方案

## 功能目标

在 `lab-snake/` 目录下实现一个贪吃蛇网页游戏，使用与作业相同的 Vite 构建方案，产物为可双击打开的 `dist/index.html`。

目录名前缀 `lab-` 用于区分课程作业（`hw` 前缀）与个人创意项目，表示这是自发完成的实验性内容。

---

## 动机

课程作业统一使用 `hw1/`、`hw2/` 命名。个人创意项目需要一个不同的命名约定，避免与作业目录混淆，同时沿用相同的构建规范，保持仓库一致性。

---

## 方案设计

### 目录结构

```
protocol-analysis-hw/
├── hw1/                    # 课程作业
├── lab-snake/              # 个人创意项目：贪吃蛇
│   ├── src/
│   │   ├── main.js         # 游戏入口
│   │   ├── game.js         # 游戏核心逻辑
│   │   └── style.css       # 样式
│   ├── index.html          # Vite HTML 入口
│   ├── vite.config.js      # Vite 配置（内联插件，产出单文件）
│   └── package.json
└── docs/
```

### 构建命令（与 hw1 完全一致）

```bash
cd lab-snake

npm install

# 开发预览（Vite 热更新）
npm run dev

# 生产构建 —— 产出 dist/index.html（全量内联，可双击打开）
npm run build:html
```

### 命名约定

| 前缀 | 含义 | 示例 |
|------|------|------|
| `hw` | 课程作业 | `hw1/`, `hw2/` |
| `lab` | 个人创意 / 实验项目 | `lab-snake/`, `lab-clock/` |

---

## 游戏功能设计

- 画布：Canvas 2D，固定尺寸（如 400×400）
- 控制：方向键 / WASD
- 规则：标准贪吃蛇，吃食物长大，碰墙或碰自身结束
- UI：分数显示、游戏结束提示、按任意键重开
- 无外部游戏库，纯 Canvas 绘制

---

## 受影响的文件

| 文件 | 操作 |
|------|------|
| `lab-snake/index.html` | 新建 |
| `lab-snake/src/main.js` | 新建 |
| `lab-snake/src/game.js` | 新建 |
| `lab-snake/src/style.css` | 新建 |
| `lab-snake/vite.config.js` | 新建 |
| `lab-snake/package.json` | 新建 |
| `lab-snake/dist/index.html` | 构建产物 |
| `docs/src/README.md` | 补充 lab- 命名约定及 lab-snake 条目 |
| `docs/src/SUMMARY.md` | 本文档已更新 |

---

## 潜在风险与边界情况

- `lab-snake/dist/` 是构建产物，可按需加入 `.gitignore`，也可作为可分发成品提交。
- `vite.config.js` 需配置 `vite-plugin-singlefile`（或等效内联插件），与 hw1 保持一致。
- Canvas 游戏循环使用 `requestAnimationFrame`，无需任何 npm 游戏依赖。

---

## 实施步骤

1. 创建 `lab-snake/` 目录及文件结构
2. 编写 `package.json`，依赖 `vite` 和 `vite-plugin-singlefile`，配置 `dev` / `build:html` 脚本
3. 编写 `vite.config.js`，启用 singlefile 插件
4. 编写 `index.html`（Vite 入口）
5. 编写 `src/game.js`（游戏核心逻辑：蛇、食物、碰撞、计分）
6. 编写 `src/main.js`（初始化、事件绑定、游戏循环）
7. 编写 `src/style.css`
8. 运行 `npm run dev` 验证热更新，`npm run build:html` 验证产物可双击打开
9. 更新 `docs/src/README.md`，补充 `lab-` 命名约定和 lab-snake 条目
