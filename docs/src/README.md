# protocol-analysis-hw 项目说明

《互联网协议分析》课程作业仓库。每次作业是一个独立的子目录，统一使用 Node.js + Vite 构建，产出无依赖的单文件 HTML，可直接双击打开。

---

## 仓库结构

```
protocol-analysis-hw/
├── hw1/                  # 作业一：协议基础（待创建）
│   ├── src/              # 源码
│   ├── dist/             # 构建产物（index.html 单文件）
│   └── package.json
├── docs/
│   ├── src/              # mdBook 源文件（当前目录）
│   │   ├── README.md     # 本文件，项目主入口
│   │   ├── SUMMARY.md    # mdBook 目录
│   │   ├── reqs/         # 各次作业的原始要求
│   │   ├── plan/         # 功能设计方案
│   │   ├── review/       # 代码审查记录
│   │   └── explain/      # 变更说明
│   └── book/             # mdBook 编译输出（勿手动修改）
├── CLAUDE.md             # AI 协作规范
└── README.md             # 仓库根目录简介
```

---

## 作业列表

| 目录 | 标题 | 状态 |
|------|------|------|
| `hw1/` | 作业一：协议基础（Wireshark 抓包分析） | 待开始 |

---

## 构建规范

每个作业子目录均为独立 Node 项目，遵循统一约定：

```bash
# 进入作业目录
cd hw1

# 安装依赖
npm install

# 开发预览（Vite 热更新）
npm run dev

# 生产构建 —— 产出 dist/index.html（全量内联，可双击打开）
npm run build:html
```

**构建约束：**
- `dist/index.html` 必须是完全自包含的单文件，所有 JS / CSS 内联，无外部依赖。
- 无需服务器或 Node 运行时即可打开，可直接打包提交。

---

## 作业一要求概述

详见 [作业一原文](./reqs/hw1.md)，核心任务：

1. 使用 Wireshark 抓包，过滤 TCP / IP / ICMP / 地址等维度的报文。
2. 通过协议解析提取各层字段，填写到表格（可借助工具辅助进制转换）。
3. 将实验过程写入报告，完成总结与收获。
4. 将代码和作品打包上传。

---

## AI 协作规范（摘要）

- **功能开发前**：先在 `docs/src/plan/` 写方案，确认后再改代码。
- **代码审查时**：先在 `docs/src/review/` 写审查报告，确认后再改代码。
- **变更说明时**：在 `docs/src/explain/` 记录改动内容。
- **提交信息**：使用 Conventional Commits，中文 subject。
- **新建/删除/移动文档**：同步更新 `docs/src/SUMMARY.md`。

完整规范见 [CLAUDE.md 备份](./reference/CLAUDE_backup.md)。
