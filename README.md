# Todo App

A dark-themed, pixel-perfect todo application built with vanilla JavaScript, Vite, and modern ES modules.

Refactored from a single-file `index.html` into a production-style modular architecture while preserving every pixel of the original UI/UX.

---

## Prerequisites

- **Node.js** >= 18 (for native ESM support and modern V8 features)
- **npm** >= 9
- **WSL Ubuntu** (recommended for Windows users)

---

## Setup

```bash
# Install dependencies
npm install
```

---

## Development

```bash
# Start the Vite development server
npm run dev
```

The dev server opens at `http://localhost:5173/` by default (Vite will print the exact URL).

**Important:** This project is configured to run inside **WSL Ubuntu**. Do not use PowerShell, CMD, or Windows Terminal profiles that launch PowerShell. Always execute commands through WSL Bash.

---

## Testing

```bash
# Run tests once (CI mode)
npm test

# Run tests in watch mode
npm run test:watch
```

Tests cover:
- **Reducers** — pure functions for adding, deleting, toggling, updating, and clearing tasks
- **Selectors** — filtering, sorting, and counting logic
- **Repository** — localStorage persistence and round-trip integrity

---

## Linting & Formatting

```bash
# Lint JavaScript with ESLint
npm run lint

# Format code with Prettier
npm run format
```

---

## Build

```bash
# Production build — outputs to `dist/`
npm run build
```

The `dist/` folder contains the fully bundled, minified application ready for deployment.

---

## Deployment

The app is a static SPA. Deploy the contents of the `dist/` folder to any static host:

- **Netlify / Vercel / Cloudflare Pages:** Drop `dist/` or point the build command to `npm run build`.
- **GitHub Pages:** Use a GitHub Action to build and deploy the `dist/` folder.
- **Nginx / Apache:** Serve `dist/` as a static directory with `index.html` as the fallback.

---

## Architecture

This project follows a **feature-based modular architecture**, a departure from the original single-file app that trades a little simplicity for maintainability, testability, and separation of concerns.

### Directory Structure

```
public/                    # (empty — Vite uses root-level index.html by convention)
index.html                # Application shell — minimal, no business logic
src/
  app/
    main.js               # Bootstrap: wires store, features, event listeners
    store.js              # Global state with pub/sub (observer pattern)
  features/
    tasks/                # Task domain (model, reducer, selectors, service, repository, controller, view)
    filters/              # Filter UI and event wiring
    progress/             # Progress bar and footer count
    sidebar/              # Sidebar workload indicator
  shared/                 # Cross-cutting utilities (DOM, storage, ID, validation)
  styles/                 # Modular CSS (tokens, base, layout, components, responsive)
  tests/
    features/tasks/       # Unit tests for reducers, selectors, repository
```

### Design Decisions

#### 1. Feature-Based Modules

We grouped every task-related concern — model, reducer, selectors, service, repository, controller, and view — into a single directory. This makes the `tasks` feature self-contained: you can reason about it, test it, and even extract it without hunting across the tree. Features that share nothing (filters, progress, sidebar) live in their own directories with minimal cross-imports.

#### 2. Observer-Pattern Store

The global store (`src/app/store.js`) holds the single source of truth and notifies subscribers whenever state changes. Subscribers (in practice, a single `render()` orchestrator) re-render the UI in response. Using an observer pattern instead of a framework like React means the app stays framework-agnostic and zero-dependency, yet still benefits from a clean reactive flow.

#### 3. Controller + Service Separation

The **controller** (`controller.js`) translates DOM events into intent ("add a task," "toggle this task"). The **service** (`service.js`) handles the orchestration: reads current state, calls the reducer, writes to the repository, and updates the store. This keeps the controller thin and defers business logic and side effects to a dedicated layer.

#### 4. Pure Reducers + Immutable Updates

All state mutations go through pure functions in the reducer (e.g., `addTask`, `toggleTask`). Each returns a *new* array, never mutating the input. This guarantees predictability and makes unit testing trivial: given an input state and action, assert the output state.

#### 5. Selectors Encapsulate Filtering & Sorting

`getFilteredTasks()` consolidates all filtering and sorting logic in one place. It spreads into a new array before sorting, fixing a mutation bug in the original app where `sort()` mutated the source array. Selectors are pure and deterministic.

#### 6. Validation Extracted to `shared/validation.js`

Inline validation (e.g., `if (!text) return`) lived in the controller. Moving it to `shared/validation.js` centralizes business rules and makes them reusable across features.

#### 7. All DOM Creation via `createElement` / `textContent`

The original app used `innerHTML` with hand-rolled attribute escaping. We replaced this entirely with `document.createElement`, `appendChild`, and `textContent` in `view.js` and `shared/dom.js`. This eliminates XSS risk without needing a templating library.

#### 8. Vite as Build Tool Only

Vite handles bundling and the dev server but the app contains zero framework code. The `base: './'` in `vite.config.js` ensures relative paths for easy deployment, and `outDir: 'dist'` targets a conventional output directory.

#### 9. `index.html` at Project Root

The target architecture spec'd `public/index.html`, but Vite's convention places the entry HTML at the project root. We followed Vite's convention instead of `public/`, since Vite automatically treats `index.html` as the entry point. The `public/` directory is reserved for static assets (favicon, etc.) that should be copied as-is during build.

---

## Original vs. Refactor: What Changed

| Concern | Original | After Refactor |
|---|---|---|
| Architecture | Single ~30 KB HTML file | Modular feature-based JS/CSS |
| State management | Global variables, direct mutation | Centralized `store.js` with pub/sub |
| Rendering | `innerHTML` + string concatenation | DOM API (`createElement`, `textContent`) |
| Filtering | Mutated source array with `.sort()` | New array, immutable sort |
| Testing | None | Unit tests for reducers, selectors, repository |
| Build tool | None (served directly) | Vite with dev / build / lint / test |
| UI/UX | — | **Unchanged — pixel-perfect identical** |

---

## License

MIT
