# CLAUDE.md

## Documentation Entry
- Default to using `docs/src/README.md` as the first entry point for understanding this project.
- Before making assumptions about project structure, script purpose, workflows, or safety notes, read `docs/src/README.md` first.
- When a task changes project structure, script usage, run commands, or risk/safety guidance, update `docs/src/README.md` to keep it in sync with the repository.
- When creating, deleting, renaming, or moving Markdown documents under `docs/src/`, always update `docs/src/SUMMARY.md` in the same task so the mdBook table of contents stays accurate.
- When the user explicitly asks for a change, decision, convention, or detail to be documented, record it in `docs/src/README.md`.
- When making a change that seems important for future understanding of the repository, proactively update `docs/src/README.md` even if the user did not separately remind you.

## Documentation Paths
# Overrides the default paths used by /mdplan, /mdreview, /mdexplain skills.
- Plan documents go in `docs/src/plan/`
- Review documents go in `docs/src/review/`
- Change summary documents go in `docs/src/explain/`
- Always update `docs/src/SUMMARY.md` after creating any document under `docs/src/`

---

## Build Convention

- `npm run dev` — Vite dev server for live preview.
- `npm run build:html` — produces a single self-contained `dist/index.html` with all JS and CSS inlined. The output must open correctly by double-clicking, with no server or Node runtime required.
- Each assignment is an independent Node project with its own `package.json`. All assignments share this same build convention.
