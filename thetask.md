# thetask.md — Migrate the Vanilla-JS/Vite Todo App → Next.js (App Router, TypeScript)

> This file is the single source of truth for the migration commissioned in `tasks.md`.
> It contains: Context · confirmed decisions · the full architecture · the 4 answer-steps requested by `tasks.md` (folder structure, package.json, code, safe-move/dev) · an end-to-end parity checklist · and the 5-agent fan-out map (who does what).
> **Standing rule (from `context.md`):** never change anything that affects the app's visual design or UI/UX — layout, styling, spacing, colors, typography, animations/transitions, DOM structure that affects appearance — unless explicitly told to.

---

## Context

`tasks.md` commissions a Principal Frontend Architect to **completely remove Vite and rebuild this application from the ground up using Next.js**, under three hard constraints:

1. **Pixel-Perfect UI/UX** — visuals must stay 100% identical (no "improvements").
2. **Feature Parity** — no lost functionality, behaviors, listeners, state, or logic.
3. **Code Quality** — clean, modular, typed, idiomatic React.

The current app (`/home/jarvis/projects/aitodo`) is a dark-themed todo SPA: vanilla JS + Vite, an observer-pattern store (`src/app/store.js`), a feature-based architecture (`src/features/{tasks,filters,progress,sidebar}`), pure reducers/selectors/repository, and modular vanilla CSS (`src/styles/`). `context.md` reinforces the pixel-perfect rule and lists features that must keep working: add/delete/toggle/edit task, edit priority, filter all/active/completed, clear completed, progress bar, sidebar indicator, localStorage persistence.

**Confirmed decisions (user-approved):**

- **Language: TypeScript** — strict `.tsx/.ts`, `tsconfig.json`, `@types/*`.
- **CSS strategy: Global vanilla CSS (verbatim)** — every existing CSS file copied unchanged, imported in the root layout in the exact order `src/app/main.js` imports them.

**Outcome:** a clean, production-ready **Next.js 15 / React 19 / App Router** repo at `/home/jarvis/projects/aitodo` with **zero Vite remnants**, identical UI/UX, full feature parity, and **preserved unit tests**.

---

## Key Architecture Decisions

1. **Language: TypeScript.** Strict `.tsx/.ts`, a `tsconfig.json`, `@types/*`. Pure logic ports with types; the three Vitest suites become `.ts`.
<!-- FIXED: Inconsistency #5 — modular CSS imported directly in app/layout.tsx in the original order (not via @import in globals.css); the original used ordered JS imports, never CSS @import -->
2. **CSS: Global vanilla CSS, verbatim.** Every existing CSS file is copied unchanged under `styles/` and imported **directly in `app/layout.tsx`** **in the exact order** `src/app/main.js` imports them (the original used ordered JS `import`s, never CSS `@import`): `tokens → base → layout → components/{sidebar, progress, input, filters, tasks, sections, responsive}`. `app/globals.css` stays minimal (no appearance-affecting rules) and is imported alongside the modular CSS. Identical selectors, `:root` vars, media queries → guaranteed pixel-perfect. No CSS Modules / Tailwind → zero rewrite risk to the parity constraint.
3. **State: React Context + `useReducer`, reusing the pure logic.** The pub/sub `store.js` is replaced by a `TodoProvider` + `useTodos()` hook. `model/reducer/selectors/repository/validation/id/storage` port **verbatim** (add types only). The controller+service layers collapse into typed action creators in the hook — `tasks.md` explicitly asks for idiomatic React (`useState`/`useEffect`/`useRef`).
4. **Client-only todo tree (`dynamic(..., { ssr:false })`).** The original was a Vite SPA with `localStorage` available on first paint. To avoid SSR→client hydration mismatch and an empty-state flash, `app/page.tsx` (server) renders a dynamically-imported, **`ssr:false`** `<TodoApp/>`. The HTML shell (`html`/`body`/`globals.css`) still server-renders — reproducing the original SPA's runtime exactly.
5. **Rewrite in place** at `/home/jarvis/projects/aitodo`. "Remove Vite" + working dir = the project dir becomes the Next app. The repo is **not git-managed**, so a manual `cp` backup is part of the safe-move step (no `git stash`).
6. **Tests preserved.** The 3 Vitest suites (reducer, selectors, repository — pure, framework-agnostic) migrate to `.ts` against `lib/`; `jsdom` env for the repository test. Vitest stays (works fine alongside Next).
7. **SVGs as inline React components.** There are **no image/SVG asset files** (`public/` and `design ideas/` are empty); all icons are built via DOM APIs in `src/shared/dom.js`. They become tiny inline-SVG components preserving `viewBox`/`path`/`stroke` exactly. No `<Image>` needed; nothing to move to `/public`.
8. **Preserve `data-*` attributes that CSS depends on.** The `priority-pill` CSS keys on `[data-priority="…"]`, so pills render `data-priority={p}`. The filter/action delegation chains become React handlers; `data-filter`/`data-action`/`data-id` are no longer strictly required (kept harmlessly for fidelity).

---

## `tasks.md` Step 1 — Target Folder Structure

```
aitodo/
  package.json              # Next 15 / React 19 / TS / Vitest deps (Step 2)
  next.config.mjs
  tsconfig.json
  next-env.d.ts             # auto-generated by next
  <!-- FIXED: Inconsistency #6 — .eslintrc.json replaced by flat eslint.config.mjs (ESLint 9) -->
  eslint.config.mjs        # flat config: next/core-web-vitals + next/typescript (ESLint 9)
  .prettierrc               # KEEP existing
  .gitignore                # add: .next/, node_modules/, *.tsbuildinfo
  README.md                 # rewritten for Next.js (Step 4)
  app/
    <!-- FIXED: Inconsistency #5 — layout.tsx imports globals.css (minimal) + the modular CSS from @/styles in the ORIGINAL order (no @import chain) -->
    layout.tsx              # <html lang="en"><body> + import globals.css (minimal) + modular CSS from @/styles (ORIGINAL order)
    page.tsx                # server comp: dynamic(() => import('@/components/TodoApp'), { ssr:false })
    <!-- FIXED: Inconsistency #5 — globals.css kept minimal; modular CSS lives in top-level styles/ and is imported by layout.tsx -->
    globals.css             # minimal (no rules) — modular CSS imported directly in layout.tsx
  styles/
    tokens.css
    base.css
    layout.css
    components/
      sidebar.css
      progress.css
      input.css
      filters.css
      tasks.css
      sections.css
      responsive.css
  components/
    TodoApp.tsx             # "use client" — wraps <TodoProvider> + composes the screen
    Header.tsx              # static: h1 "TODO" + subtitle
    TodoInput.tsx           # "use client" — input + priority pills (H/M/L) + Add button
    Filters.tsx             # "use client" — All/Active/Completed + Clear completed
    TaskList.tsx            # "use client" — section headers + items, OR <EmptyState/>
    EmptyState.tsx          # static
    TaskItemView.tsx        # "use client" — dot + checkbox + text + actions (view mode)
    EditRow.tsx             # "use client" — edit input + inline priority pills (edit mode)
    <!-- FIXED: Inconsistency #4 — Checkbox relabeled "use client" → static (presentational; rendered inside the "use client" TaskItemView; no hooks/handlers) -->
    Checkbox.tsx            # static — div.checkbox + checkmark SVG
    SectionHeader.tsx       # static — HIGH/MEDIUM/LOW divider
    TaskActions.tsx         # "use client" — edit + delete icon buttons
    ProgressSection.tsx     # "use client" — bar + percent + fraction (null when no tasks)
    Footer.tsx              # "use client" — "N items left" (null when no tasks)
    SidebarIndicator.tsx     # "use client" — fixed indicator w/ inline color+glow
    icons/
      CheckboxIcon.tsx      # inline <svg viewBox="0 0 10 10"> checkmark
      EditIcon.tsx          # inline <svg viewBox="0 0 15 15"> pencil
      DeleteIcon.tsx        # inline <svg viewBox="0 0 15 15"> trash
  lib/
    types.ts                # Priority, Filter, Task, TodoState, PRIORITIES
    model.ts                # createTask + PRIORITY_ORDER (verbatim, typed)
    reducer.ts              # addTask/deleteTask/toggleTask/updateTask/clearCompleted (verbatim, typed)
    selectors.ts            # getFilteredTasks/activeCount/completedCount (verbatim, typed)
    repository.ts           # loadTasks/saveTasks (verbatim, typed, SSR-safe guard)
    validation.ts           # isValidTaskText/isValidPriority (verbatim, typed)
    id.ts                   # generateId (verbatim)
    storage.ts              # getItem/setItem (verbatim, SSR-safe guard)
    <!-- FIXED: Inconsistency #3 — useTodos.tsx stays in lib/; it's the sole React-coupled entry there, replaces store/controller/service, and needs no 'use client' (only imported by the "use client" TodoApp) -->
    useTodos.tsx            # TodoProvider + useTodos() Context (replaces store/controller/service); sole React-coupled entry in lib/; no 'use client' (used only by TodoApp)
  tests/
    reducer.test.ts         # ported from src/tests/features/tasks/reducer.test.js
    selectors.test.ts       # ported from src/tests/features/tasks/selectors.test.js
    repository.test.ts      # ported from src/tests/features/tasks/repository.test.js
  vitest.config.ts          # environment: 'jsdom'
```

<!-- FIXED: Inconsistency #6 — removals also include the legacy .eslintrc.cjs (replaced by flat eslint.config.mjs) -->
**Removals (Vite/legacy artifacts):** `vite.config.js`, `vitest.config.js`, root `index.html`, `dist/`, the old `.eslintrc.cjs` (replaced by flat `eslint.config.mjs`), and the old `src/` tree once its logic is ported into `lib/` + `components/`.

**Composition inside `TodoApp`** (matches original `buildApp()` order): `SidebarIndicator`, then `<main className="app">` → `Header`, `TodoInput`, `Filters`, `TaskList` (returns `<EmptyState/>` when the filtered list is empty), `ProgressSection`, `Footer`. `ProgressSection` and `Footer` render `null` when `totalCount === 0`.

---

## `tasks.md` Step 2 — `package.json` (Next.js deps)

<!-- FIXED: Inconsistency #8 — `next` and `eslint-config-next` pinned to `~15.1.0` (same minor); the two are version-coupled and must stay in lockstep -->
<!-- FIXED: Inconsistency #6 — `lint` script is `eslint .` (flat config); added `@eslint/eslintrc` devDep for the FlatCompat-based flat config -->

```json
{
  "name": "todo-app",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "format": "prettier --write ."
  },
  "dependencies": {
    "next": "~15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.17.0",
    "@eslint/eslintrc": "^3.2.0",
    "eslint-config-next": "~15.1.0",
    "prettier": "^3.4.0",
    "vitest": "^2.1.0",
    "jsdom": "^25.0.0"
  }
}
```

**Supporting config (all written during foundation, before fan-out):**

- `next.config.mjs` → `{ reactStrictMode: true }`
<!-- FIXED: Inconsistency #2 — no `vitest/globals` `types` entry: the ported suites keep explicit `import { describe, it, expect, … } from 'vitest'` (as in the originals), so they don't rely on globals; adding `types` would also narrow which @types/* auto-load -->
- `tsconfig.json` → Next default with `"paths": { "@/*": ["./*"] }`, `"strict": true` (no `vitest/globals` `types` entry — the ported suites use explicit imports, not globals)
<!-- FIXED: Inconsistency #6 — .eslintrc.json → flat eslint.config.mjs (ESLint 9, via @eslint/eslintrc FlatCompat); `next lint` is removed in Next 16, so lint runs `eslint .` -->
- `eslint.config.mjs` → flat config (ESLint 9): uses `@eslint/eslintrc`'s `FlatCompat` to extend `next/core-web-vitals` + `next/typescript` (the canonical `create-next-app` 15.1 output). `next lint` is removed in Next 16, so `npm run lint` runs `eslint .`:
  ```js
  import { dirname } from 'path';
  import { fileURLToPath } from 'url';
  import { FlatCompat } from '@eslint/eslintrc';
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const compat = new FlatCompat({ baseDirectory: __dirname });
  const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ];
  export default eslintConfig;
  ```
<!-- FIXED: Inconsistency #2 — `globals: true` retained only to mirror the original vitest.config.js; the ported suites use explicit `import { describe, it, expect, … } from 'vitest'`, NOT globals -->
- `vitest.config.ts` → `{ test: { environment: 'jsdom', globals: true } }` (`globals: true` mirrors the original `vitest.config.js`; the ported suites still use explicit `import { describe, … } from 'vitest'`, so they don't depend on the globals)
- `.prettierrc` → **kept** (matches existing singleQuote / printWidth 100 / tabWidth 2)

---

## `tasks.md` Step 3 — How the vanilla HTML/JS converts to React/Next.js

### 3a. Pure logic → `lib/` (verbatim, typed)

`model.ts`, `reducer.ts`, `selectors.ts`, `repository.ts`, `validation.ts`, `id.ts`, `storage.ts` are **direct ports** of `src/features/tasks/{model,reducer,selectors,repository}.js` + `src/shared/{id,storage,validation}.js`. Only additions: TS types and `typeof window !== 'undefined'` guards in `repository/storage` for SSR safety. **No behavior change.**

### 3b. `store.js` + `controller.js` + `service.js` → `lib/useTodos.tsx`
<!-- FIXED: Inconsistency #3 — useTodos.tsx is the only React-coupled module in lib/; it carries no 'use client' (imported solely by the "use client" TodoApp, so it inherits the client boundary — per Next.js 'use client' docs, the directive marks the boundary, not every client module) -->
- This file is the **only** React-coupled module in `lib/` (Context + `useReducer`/`useContext`/`useEffect`); it carries no `'use client'` directive, because it's imported solely by the `"use client"` `TodoApp.tsx` and therefore inherits the client boundary (the directive marks the client-server boundary, not every client module — per the Next.js `'use client'` docs).
- `useReducer` over a typed reducer (mirrors `controller/service` semantics). State: `{ tasks, currentFilter, editingId, selectedPriority }`.
- `useEffect` persists `tasks` → `localStorage` (`STORAGE_KEY = 'todo_tasks'`) on every change (replaces `saveTasks` calls scattered through `service`).
- `editingId`/`currentFilter`/`selectedPriority` live in the same reducer.
- Action creators exposed via Context (they replace `controller` + `service`):
  - `addTask(text)` — guards `isValidTaskText`, generates id, dispatch `add`, persist via effect.
  - `removeTask(id)`, `toggleTask(id)`, `clearCompleted()` — dispatch + persist.
  - `startEdit(id)` → `editingId = id`; `cancelEdit()` → `editingId = null`.
  - `commitEdit(id, text, priority)` — **preserves the original `service.updateTask` rule:** if text is empty after trim → `removeTask(id)` instead of update; else update text+priority and clear `editingId`.
  - `setFilter(f)`, `setSelectedPriority(p)`.
- Derived values exposed: `filteredTasks` (`getFilteredTasks`), `activeCount`, `completedCount`, `totalCount`, `filterSections` (`currentFilter === 'all' || 'active'`).

### 3c. Skeleton → JSX (`main.js buildApp()` → components)

`buildApp()`'s `createElement` tree becomes JSX. All components use the **same classNames**, so the verbatim CSS applies unchanged:

| Vanilla | React | Behavior to preserve |
|---|---|---|
| `renderTasks` rebuild + `emptyState`/`taskList` display toggle | `TaskList` returns `<ul>…` or `<EmptyState/>` when `filteredTasks.length===0` | filtered-empty → empty state |
| Section headers (`HIGH/MED/LOW`) interleaved when `filterSections` && priority changes | `TaskList` pushes `<SectionHeader priority>` before the first item of each priority group | only in `all`/`active` |
| `buildViewMode` (dot, checkbox, text, actions) | `TaskItemView` | dbl-click text → edit; checkbox → toggle; edit/delete buttons |
| `buildEditMode` (edit input + priority pills) | `EditRow` (local `text`/`priority` state) | Enter→commit, Esc→cancel, blur→commit; focus + caret at end on mount (`useRef`+`useEffect`) |
| `buildCheckboxSVG/EditIconSVG/DeleteIconSVG` (DOM SVG nodes) | `icons/*Icon.tsx` inline SVG | identical `viewBox`/`path`/`stroke` attrs |
| Checkbox `display:none` unless `.checked` (CSS-driven) | `Checkbox` always renders `<CheckboxIcon/>`; CSS hides unless checked | identical checked/unchecked look |
| `renderFilters` (active class + clear disabled) | `Filters` (conditional `.active` class; `disabled={!hasCompleted}`) | filter switching, disabled style |
| `renderProgress` (bar width %, `.complete`, percent, fraction, footer count, visibility by **total**) | `ProgressSection` + `Footer` (render `null` when `totalCount===0`) | 8-bit step bar + scanlines (CSS), "N items left" |
| `renderSidebar` inline `backgroundColor`+`boxShadow` ladder by active count | `SidebarIndicator` (inline style) | 0=gray,1=green,2=orange,3=red,4=dark-red,5+=purple; 2s CSS transition preserved via `.sidebar-indicator` class |
| Input row (input + H/M/L pills w/ M default + Add button) | `TodoInput` (local text state; reads `selectedPriority`) | Enter→add, click pill selects priority, Add→add |

`app/page.tsx`:
```tsx
import dynamic from 'next/dynamic';
const TodoApp = dynamic(() => import('@/components/TodoApp'), { ssr: false });
export default function Page() { return <TodoApp />; }
```

<!-- FIXED: Inconsistency #5 — layout.tsx imports globals.css (minimal) then the modular CSS from @/styles in the original order (no @import chain; the original used ordered JS imports) -->
`app/layout.tsx`: `<html lang="en"><body>{children}</body></html>` + `import './globals.css'` (minimal) then the modular CSS from `@/styles` **in the original order** (`tokens → base → layout → components/{sidebar, progress, input, filters, tasks, sections, responsive}`); `metadata = { title: 'Todo' }` (matches the original `<title>Todo</title>`).

<!-- FIXED: Inconsistency #5 — removed the ambiguous "@import (or paste)"; the modular CSS is imported directly in layout.tsx, and globals.css is minimal (the original never used CSS @import — only ordered JS imports) -->
`app/globals.css`: kept minimal — the modular CSS is imported directly in `app/layout.tsx` **in the exact original order** (the original used ordered JS `import`s, never CSS `@import`) → identical cascade.

---

## `tasks.md` Step 4 — Safe move & local dev (also written into README)

<!-- FIXED: Inconsistency #7 — added a pre-check GATE; this block is destructive and must run ONLY after all Next.js files (app/, components/, lib/, styles/, package.json, eslint.config.mjs, tsconfig.json, next.config.mjs, vitest.config.ts) exist -->
```bash
# ⛔ GATE: run this ENTIRE block ONLY AFTER the foundation + fan-out steps have
# written all Next.js files (app/, components/, lib/, styles/, package.json,
# eslint.config.mjs, tsconfig.json, next.config.mjs, vitest.config.ts). The `rm`
# below destroys the original files; running it before the new tree exists is
# unrecoverable except via the step-0 backup.
# 0. Backup (repo is NOT git-managed)
cd /home/jarvis/projects && cp -r aitodo aitodo.backup-$(date +%s)

# 1. Remove Vite artifacts
cd aitodo
rm -f vite.config.js vitest.config.js index.html package.json package-lock.json .eslintrc.cjs   # also remove the legacy eslintrc (Inconsistency #6 — now flat eslint.config.mjs)
rm -rf dist node_modules

# 2. Install Next.js deps (new package.json from Step 2)
npm install

# 3. Dev server
npm run dev        # → http://localhost:3000

# 4. Verify parity
npm test           # Vitest suite (reducers/selectors/repository)
npm run build      # production build → .next/
npm run start      # serve the production build
npm run lint       # eslint . (flat config; next lint removed in Next 16)
```

Old `src/` is deleted **after** its logic is ported into `lib/` + `components/`. The existing `localStorage` key (`todo_tasks`) is untouched → users keep their tasks across the migration.

---

## Verification — end-to-end parity checklist

After the build, manually exercise every behavior against the original Vite app:

- Add task (button + Enter); reject empty text.
- Priority pills (H/M/L) in the input row — M is default; selection drives new task priority.
- Toggle complete (checkbox + strike-through); delete; clear-completed (disabled when none completed).
- Double-click text → edit; Enter commits, Escape cancels, blur commits; clearing text on commit deletes the task; edit-mode priority pills change priority.
- Filters all/active/completed switch correctly; section headers show only in all/active.
- Empty state when the **filtered** list is empty; progress bar + footer hide only when **total** is 0; "N items left" singular/plural.
- Sidebar indicator color/glow + 2s transition across active counts 0→5+.
- Reload → `localStorage` persists (same key). Responsive `<600px` layout (wrapped input row, pill/add order, slimmer sidebar).
- `npm test` green; `npm run build` succeeds; `npm run dev` shows identical UI at `:3000`.

---

## Execution — Subagent Fan-out (max 5)

### Foundation (done by me, sequentially, BEFORE fan-out)

I write the shared/config/single-owner files first so the 5 agents can fan out against a stable contract:
<!-- FIXED: Inconsistency #6 — .eslintrc.json → eslint.config.mjs in the foundation file list -->
<!-- FIXED: Inconsistency #5 — styles/ (verbatim CSS copies, in the original import order) added to the foundation single-owner writes -->
`package.json`, `tsconfig.json`, `next.config.mjs`, `vitest.config.ts`, `eslint.config.mjs`, `.gitignore`, `app/layout.tsx`, `app/globals.css`, `styles/` (verbatim CSS copies, in the original import order), `lib/types.ts`.
These are shared / config / single-owner — no parallel conflict.

### Then 5 subagents IN PARALLEL — each owns a disjoint file set

Agent prompts include the shared contract (below) and the pixel-perfect non-negotiables. No file overlaps → safe concurrency.

#### Agent 1 — Pure logic + tests
**Files:** `lib/model.ts`, `lib/reducer.ts`, `lib/selectors.ts`, `lib/repository.ts`, `lib/validation.ts`, `lib/id.ts`, `lib/storage.ts`, `tests/reducer.test.ts`, `tests/selectors.test.ts`, `tests/repository.test.ts`.
<!-- FIXED: Inconsistency #2 — Agent 1 must keep the explicit vitest imports; the suites must NOT rely on globals -->
**What:** Verbatim ports of `src/features/tasks/{model,reducer,selectors,repository}.js` + `src/shared/{id,validation,storage}.js` — add TS types + SSR guards (`typeof window !== 'undefined'`) in `repository/storage`. Port the 3 Vitest suites to `.ts` against `lib/`, **preserving every original assertion** (reducer immutability/prepend, selector sort/filter/non-mutation, repository parse + round-trip) and **keeping the explicit `import { describe, it, expect, … } from 'vitest'`** as in the originals (`src/tests/features/tasks/*.test.js`) — the suites must NOT rely on vitest globals. `vitest.config.ts` already set to `jsdom`. No behavior change.

#### Agent 2 — Store + page wiring
**Files:** `lib/useTodos.tsx`, `components/TodoApp.tsx`, `app/page.tsx`.
**What:** `TodoProvider` (React Context) + `useReducer` over the typed state `{ tasks, currentFilter, editingId, selectedPriority }`; `useEffect` persists `tasks` to `localStorage` key `todo_tasks` (SSR-guarded) — replaces the scattered `saveTasks` calls. Expose typed action creators + derived values via `useTodos()` per the shared contract. **Rule to preserve:** `commitEdit` with empty trimmed text deletes the task instead of updating (mirrors `service.updateTask`). `TodoApp` ("use client") wraps `<TodoProvider>` and composes the screen in `buildApp()` order (SidebarIndicator → main.app → Header/TodoInput/Filters/TaskList/ProgressSection/Footer). `page.tsx` server-renders `dynamic(() => import('@/components/TodoApp'), { ssr:false })`.

#### Agent 3 — Form / chrome components
**Files:** `components/Header.tsx`, `components/TodoInput.tsx`, `components/Filters.tsx`, `components/ProgressSection.tsx`, `components/Footer.tsx`, `components/SidebarIndicator.tsx`, `components/EmptyState.tsx`.
**What:** Build these from the original `buildApp()` + the feature `view.js` renderers, keeping identical classNames. `Header` static (h1 "TODO" + subtitle "Fuck your procrastination"). `TodoInput` local text state + H/M/L pills (M default, `data-priority` attribute) + Add button; Enter / Add → `addTask`. `Filters` conditional `.active` class + Clear-completed `disabled={!hasCompleted}` + handlers. `ProgressSection` renders `null` when `totalCount===0`, else bar fill width `${pct}%` + `.complete` at 100% + percent + `${done}/${total}` fraction. `Footer` renders `null` when `totalCount===0`, else "1 item left" / "N items left". `SidebarIndicator` inline `backgroundColor`+`boxShadow` ladder (0 gray, 1 green, 2 orange, 3 red, 4 dark-red, 5+ purple) — the 2s transition is CSS via `.sidebar-indicator`. `EmptyState` static.

#### Agent 4 — List / item / icons
**Files:** `components/TaskList.tsx`, `components/SectionHeader.tsx`, `components/TaskItemView.tsx`, `components/EditRow.tsx`, `components/Checkbox.tsx`, `components/TaskActions.tsx`, `components/icons/CheckboxIcon.tsx`, `components/icons/EditIcon.tsx`, `components/icons/DeleteIcon.tsx`.
**What:** `TaskList` maps `filteredTasks`; inserts `<SectionHeader>` before the first item of each priority group ONLY when `filterSections` (`all`/`active`); returns `<EmptyState/>` when the filtered list is empty (gating on filtered, not total). `TaskItemView` dot + checkbox + text + actions; dbl-click text → `startEdit`; checkbox → `toggleTask`; buttons → edit/delete. `EditRow` local `text`/`priority` state, focuses input + caret at end on mount (`useRef`+`useEffect`), Enter→commit, Esc→cancel, blur→commit (with the small `setTimeout`/blur-guard the original used). `Checkbox` always renders `<CheckboxIcon/>`; CSS drives checked/unchecked. The 3 `icons/*Icon.tsx` are inline SVGs matching `src/shared/dom.js` `viewBox`/`path`/`stroke` exactly (10×10 check; 15×15 pencil; 15×15 trash).

#### Agent 5 — Docs + cleanup
<!-- FIXED: Inconsistency #6 — Agent 5 also deletes the legacy .eslintrc.cjs (now flat eslint.config.mjs) -->
**Files:** `README.md`, `.gitignore` (finalize), and the **safe-move guide** contributed to `thetask.md` (target-agnostic doc content). Also handles (deletions only, after the others are done) removing Vite/legacy artifacts `vite.config.js`, `vitest.config.js`, `dist/`, root `index.html`, the old `.eslintrc.cjs`, and the old `src/` tree.
**What:** Rewrite `README.md` for Next.js: prerequisites (Node ≥ 18 / WSL note preserved), setup (`npm install`), dev/build/start/lint/test/format scripts, the architecture overview mapped to the new `app/` + `components/` + `lib/` tree, the "What changed" table updated for the Next migration, and the explicit Step 4 safe-move instructions. Add `.next/`, `node_modules/`, `*.tsbuildinfo`, `next-env.d.ts` to `.gitignore`.

### Shared contract (embedded in every agent prompt)

<!-- FIXED: Inconsistency #3 — useTodos.tsx carries no 'use client' (imported only by the "use client" TodoApp; the directive marks the client boundary, not every client module) -->

```ts
// lib/types.ts (I write)
export type Priority = 'high' | 'medium' | 'low';
export type Filter = 'all' | 'active' | 'completed';
export interface Task { id: string; text: string; completed: boolean; priority: Priority; }
export interface TodoState { tasks: Task[]; currentFilter: Filter; editingId: string | null; selectedPriority: Priority; }
export const PRIORITIES: Priority[] = ['high', 'medium', 'low'];

// lib/useTodos.tsx (Agent 2)  — no 'use client' (imported only by the "use client" TodoApp)
interface TodoContextValue {
  tasks: Task[]; currentFilter: Filter; editingId: string | null; selectedPriority: Priority;
  filteredTasks: Task[]; activeCount: number; completedCount: number; totalCount: number;
  filterSections: boolean;
  addTask(text): void; removeTask(id): void; toggleTask(id): void;
  startEdit(id): void; commitEdit(id, text, priority): void; cancelEdit(): void;
  setFilter(f): void; clearCompleted(): void; setSelectedPriority(p): void;
}
export const TodoProvider; export function useTodos(): TodoContextValue;
```

### Pixel-perfect non-negotiables (every component agent)

- Identical classNames; `data-priority` on priority pills (CSS dependency on `[data-priority="…"]`).
- Section headers only in `all`/`active` (`filterSections`).
- `ProgressSection` / `Footer` gate on **total** tasks (`null` when `totalCount === 0`).
- `EmptyState` gates on **filtered** tasks.
- Preserve input-row, edit-row, checkbox, sidebar, progress 8-bit styles by reusing the verbatim CSS — **no new classes, no overrides**.

### Integration + verification (done by me, after fan-out)

`npm install` → `npm run dev` → `npm test` → `npm run build`; fix any seam (import paths, `@/*` aliases, contract mismatches); final UI/UX eyeball vs. the original Vite app across the parity checklist. If a follow-up fix is needed, it stays within the 5-agent budget.

---

## Execution order (summary)

1. **Foundation (me, sequential):** config + layout + globals.css + types.
2. **Fan-out (5 agents, parallel):** logic+tests · store+wiring · form/chrome · list/items/icons · docs+cleanup.
3. **Integrate + verify (me):** install, dev, test, build, parity checklist.

Result: clean Next.js app at `/home/jarvis/projects/aitodo`, pixel-perfect to the original, full feature parity, tests green, zero Vite remnants.
