# CLAUDE.md

---

## Documentation Entry

- Default to using `docs/src/README.md` as the first entry point for understanding this project.
- Before making assumptions about project structure, script purpose, workflows, or safety notes, read `docs/src/README.md` first.
- When a task changes project structure, script usage, run commands, or risk/safety guidance, update `docs/src/README.md` to keep it in sync with the repository.
- When creating, deleting, renaming, or moving Markdown documents under `docs/src/`, always update `docs/src/SUMMARY.md` in the same task so the mdBook table of contents stays accurate.
- When the user explicitly asks for a change, decision, convention, or detail to be documented, record it in `docs/src/README.md`.
- When making a change that seems important for future understanding of the repository, proactively update `docs/src/README.md` even if the user did not separately remind you.

---

## Git Commit

- When the user asks for commit text, generate a Git commit message instead of committing.
- Use Conventional Commits format: `feat:` `fix:` `refactor:` `docs:` `chore:` `test:`
- Subject format: `<type>(<scope>): <summary>`
- The subject must be concise, specific, and written in Chinese.
- Do not use vague subjects such as `update`, `fix bugs`, `misc changes`.
- For non-trivial changes, also generate a commit body in Chinese explaining: what changed, why it changed, any important notes or risks.
- If the change is trivial, the body may be omitted.

**Standard prompt:**

```
基于当前 diff，生成一个可直接提交的 git commit message。
要求：中文、Conventional Commits、包含 subject，必要时附 body，不要编造测试结果。
```

---

## Feature Request Workflow

- When the user proposes a new feature, do not change code immediately.
- First clarify the intended behavior, affected modules, expected inputs and outputs, and possible risks or tradeoffs.
- Before making any code changes, create a plan document under `docs/src/plan/` and update `docs/src/SUMMARY.md`.
- The plan document should explain: feature goal, current problem or motivation, proposed design, files or modules likely to be affected, possible risks and edge cases, implementation steps.
- After writing the plan document, stop and wait for user confirmation before editing code.

**Standard prompt:**

```
先不要改代码。请先把这个功能的实现方案整理成 docs/src/plan/ 下的一篇 Markdown 文档，写完后停止，等待我确认。
```

---

## Code Review Workflow

- When the user asks for a code review, do not change code immediately.
- Inspect the relevant code, related modules, and existing behavior.
- Identify problems such as logic bugs, fragile assumptions, missing validation, poor structure, unclear naming, dead code, performance issues, and maintainability risks.
- Before making any code changes, create a review document under `docs/src/review/` and update `docs/src/SUMMARY.md`.
- After writing the review document, stop and wait for user confirmation before editing code.

**Standard prompt:**

```
先不要改代码，先帮我审查这部分实现。
阅读相关文件后，把审查结果和修改建议写到 docs/src/review/ 下，并更新 docs/src/SUMMARY.md。
写完后停止，等我确认。
```

---

## Change Summary Workflow

- When the user asks to explain code or summarize changes, create an explanation document under `docs/src/explain/` and update `docs/src/SUMMARY.md`.
- Explain: what changed, why it changed, what was affected, any risks or compatibility concerns.
- After writing, stop unless the user explicitly asks to continue.

**Standard prompt:**

```
先不要改代码，先帮我总结这次改动。
阅读相关变更文件后，把改动总结写到 docs/src/explain/ 下，并更新 docs/src/SUMMARY.md。
写完后停止。
```

**After implementation:**

```
开始实施，并且改完帮我总结这次改动。
阅读相关变更文件后，把改动总结写到 docs/src/explain/ 下，并更新 docs/src/SUMMARY.md。
写完后停止。
```

---

## Build Convention

- `npm run dev` — Vite dev server for live preview.
- `npm run build:html` — produces a single self-contained `dist/index.html` with all JS and CSS inlined. The output must open correctly by double-clicking, with no server or Node runtime required.
- Each assignment is an independent Node project with its own `package.json`. All assignments share this same build convention.
