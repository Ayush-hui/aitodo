# Project Context — Todo App (Vanilla JS / Vite)

> ⚠️ **Standing rule — read before any refactor or coding task:** When asked to refactor or write/modify code, never change anything that affects the app's visual design or UI/UX — layout, styling, spacing, colors, typography, animations/transitions, or any DOM structure that affects appearance — **unless explicitly told to.** Default to architecture, logic, and tooling changes only. This applies to every future request, not just the original refactor.

## 1. What this project is

A todo app, refactored from a single `index.html` into a modular, production-style vanilla-JS frontend built with Vite. No frameworks.

```
public/index.html        — minimal shell only
src/app/                 — bootstrap, app wiring (store, main.js)
src/features/tasks/      — model, reducer, selectors, service, repository, controller, view
src/features/filters/    — filter view logic
src/features/progress/   — progress view logic
src/features/sidebar/    — sidebar view logic
src/shared/              — DOM helpers, storage helpers, validation, id generation
src/styles/              — tokens, base, layout, components, responsive
src/tests/               — unit tests
```

Features that must keep working exactly as-is: add/delete/toggle/edit task, edit priority, filter all/active/completed, clear completed, progress bar, sidebar indicator, localStorage persistence.

## 2. Current status

- Architecture refactor is implemented and complete.
- Local dev environment is confirmed working (Node/npm installed and verified manually; `npm run dev` runs fine).
- UI/UX has been visually checked against the original app and confirmed identical — no further visual comparison needed.

