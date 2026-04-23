# IMPLEMENTATION_PHASE2.md

# Phase 2 Technical Implementation Blueprint: Static App Foundation Runs and Builds

## Purpose

This file is the surgical execution guide for Phase 2 from `IMPLEMENTATION_PLAN.md`: **Static App Foundation Runs and Builds**.

Phase 2 must create the runnable static app foundation and nothing more. It should add npm/Vite/Vitest tooling, a minimal visible app shell, initial source/test folders, and command documentation. It must not implement Minesweeper gameplay rules, board generation, reveal behavior, flagging, chord interaction, timer logic, difficulty switching, win/loss mechanics, or end-state rendering.

Current repository state at blueprint creation:

- `DONE.md` records Phase 1 as completed on 2026-04-23.
- `TODO.md` contains only Phase 2 entries.
- `REQUIREMENTS.md` locks the v1 stack as npm, Vite, vanilla JavaScript modules, HTML, CSS, Vitest, later Playwright, and local-only static build verification.
- The repository contains documentation only; there is no `package.json`, `package-lock.json`, `index.html`, `vite.config.js`, `src/`, or `tests/` tree yet.
- `.gitignore` already ignores `node_modules/`, `dist/`, `coverage/`, `.vscode/`, and `*.log`.
- Local tool check at blueprint creation found `node v18.19.1` and `npm 9.2.0`.

The local Node version is a known Phase 2 execution risk. Current Vite documentation requires a newer Node line than `v18.19.1`; the implementer must resolve that before dependency installation or script verification.

## Source Documents

- `REQUIREMENTS.md`: authoritative product scope and locked Phase 1 decisions.
- `IMPLEMENTATION_PLAN.md`: phase order, Phase 2 scope, exit criteria, and Phase 3 handoff entries.
- `TODO.md`: active Phase 2 checklist.
- `DONE.md`: verified Phase 1 completion evidence.
- `GEMINI.md`: project workflow rules.
- `AGENTS.md`: says not to edit `AGENTS.md`; project-specific context belongs in `GEMINI.md`.
- `IMPLEMENTATION_PHASE1.md`: prior blueprint and decision context.

## Online Reference Check

These primary references were checked on 2026-04-23 because Phase 2 depends on current Vite/Vitest setup behavior:

- [Vite Getting Started](https://vite.dev/guide/): current Vite docs show `v8.0.9`, document `npm install -D vite`, default scripts such as `dev`, `build`, and `preview`, and state that Vite requires Node `20.19+` or `22.12+`.
- [Vite Static Deploy](https://vite.dev/guide/static-deploy.html): confirms `npm run build` produces `dist` by default and `npm run preview` serves the built output locally.
- [Vitest Getting Started](https://vitest.dev/guide/): current Vitest docs show `v4.1.5`, document `npm install -D vitest`, require Vite `>=6.0.0` and Node `>=20.0.0`, and confirm tests use `.test.` or `.spec.` filenames by default.
- [Vitest CLI](https://vitest.dev/guide/cli.html): confirms `vitest run` is the single-run, non-watch command form.

Implementation implication:

- Prefer current Vite/Vitest through `npm install -D vite vitest` after the Node runtime has been upgraded to a compatible version.
- Do not silently pin old Vite/Vitest versions to support Node 18 unless the project owner explicitly changes `REQUIREMENTS.md` or the phase plan.
- Record the Node requirement in `README.md` and, if implemented, in `package.json` `engines`.

## Phase 2 Scope Boundary

### In Scope

- Add npm metadata and repeatable scripts.
- Add Vite entry files that load a static single-page shell.
- Add Vitest configuration and at least one tiny non-gameplay unit test so `npm test` passes.
- Add trackable `src/game/`, `src/ui/`, and `tests/unit/` structure.
- Add a minimal app shell that proves the page root, CSS import, and module loading work.
- Document setup, test, build, and preview commands in `README.md`.
- Verify `npm test`, `npm run build`, and `npm run preview`.
- Refresh `TODO.md` with Phase 3 entries only after Phase 2 implementation has passed review/verification.
- Update `DONE.md` only after Phase 2 checks are actually complete.

### Out of Scope

- Difficulty configuration.
- Board/cell data model.
- Mine placement.
- First-click safety.
- Reveal, flood reveal, win, loss, frozen end-state, flag, chord, timer, counter, or reset behavior.
- Real game board rendering.
- Playwright or end-to-end tests.
- Hosted deployment configuration.
- Frameworks, routers, state libraries, CSS preprocessors, TypeScript migration, or component libraries.
- Any change to `AGENTS.md`.

## Architectural Design

Phase 2 is an infrastructure phase, so the architecture should stay deliberately thin. The goal is to establish stable project seams for later phases without prematurely designing gameplay.

### Runtime Entry Structure

```txt
index.html
  -> /src/main.js
       -> /src/styles.css
       -> src/ui/appShell.js
```

`index.html` owns the single Vite HTML entry point. `src/main.js` owns bootstrapping. `src/ui/appShell.js` owns the minimal non-gameplay shell markup. No game module should be imported by `src/main.js` in Phase 2.

### App Shell State

Use one tiny shell-state object only to keep Phase 2 testable. This is not the future game state model.

```js
/**
 * Phase 2 shell-only state.
 * This is not the Minesweeper game state.
 */
export const APP_SHELL_STATE = Object.freeze({
  appName: 'PXL Sweeper',
  statusMessage: 'Ready.',
});
```

Required invariants:

- `appName` is exactly `PXL Sweeper`.
- `statusMessage` is exactly `Ready.`, matching the locked initial status copy in `REQUIREMENTS.md`.
- The shell state has no board dimensions, mine count, flags, timer value, difficulty id, or game status beyond the static initial copy.
- The shell is static; it must not respond to gameplay input.

### DOM Mounting Contract

Use a small mounting function so the app can fail clearly if the root element is missing.

```js
/**
 * Mounts the non-gameplay Phase 2 app shell into the provided root element.
 *
 * @param {HTMLElement | null} root
 * @param {{ appName: string, statusMessage: string }} shellState
 * @throws {Error} when root is null or undefined
 * @returns {void}
 */
export function mountAppShell(root, shellState = APP_SHELL_STATE) {}
```

Expected behavior:

- If `root` is missing, throw `Error('App root #app was not found.')`.
- If `root` exists, replace its contents with the static shell.
- The rendered shell should contain one `main` landmark, one `h1`, and one inline status element.
- The status element should use `role="status"` so later phases have a natural place for outcome feedback.

### Markup Generation Contract

Keep this helper small enough that it remains obviously a shell, not a rendering system.

```js
/**
 * Returns static shell markup for Phase 2 only.
 *
 * @param {{ appName: string, statusMessage: string }} shellState
 * @returns {string}
 */
export function createAppShellMarkup(shellState = APP_SHELL_STATE) {}
```

Expected markup shape:

```html
<main class="app-shell" aria-labelledby="app-title">
  <section class="app-shell__masthead">
    <p class="app-shell__eyebrow">Static app foundation</p>
    <h1 id="app-title">PXL Sweeper</h1>
    <p class="app-shell__status" role="status">Ready.</p>
  </section>
</main>
```

Implementation note:

- The visible phrase `Static app foundation` is acceptable for Phase 2 as a temporary shell marker, but Phase 4/8 should remove implementation-descriptive placeholder copy when the actual game interface exists.
- If the reviewer wants no visible placeholder copy, use only `PXL Sweeper` and `Ready.`.

### CSS Foundation Contract

`src/styles.css` should prove styling is wired without becoming the final design system.

Required CSS responsibilities:

- Set `box-sizing: border-box`.
- Set readable base font and colors.
- Center or comfortably place the static app shell on the page.
- Avoid image assets, generated SVGs, decorative orbs, animated backgrounds, or heavy theme decisions.
- Avoid final gameplay cell styles; those belong to later phases.
- Keep colors restrained but not a one-note palette.

Suggested selectors:

```css
:root {}
*,
*::before,
*::after {}
body {}
button,
input,
select,
textarea {}
.app-shell {}
.app-shell__masthead {}
.app-shell__eyebrow {}
.app-shell__status {}
```

### Test Harness Contract

Vitest should be introduced as a one-shot unit test command. Phase 2 does not need DOM APIs or `jsdom`.

```js
// package.json
{
  "scripts": {
    "test": "vitest run"
  }
}
```

Test file naming:

```txt
tests/unit/app-shell.test.js
```

Minimum test responsibilities:

- `createAppShellMarkup()` contains `PXL Sweeper`.
- `createAppShellMarkup()` contains `Ready.`.
- `mountAppShell()` writes shell markup into a simple fake root object.
- `mountAppShell(null)` throws the expected root error.

No test should import or assert gameplay behavior in Phase 2.

### Package Metadata Contract

`package.json` should be intentionally small.

Required fields:

```json
{
  "name": "pxl-sweeper",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "test": "vitest run",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "...",
    "vitest": "..."
  }
}
```

Recommended field:

```json
{
  "engines": {
    "node": "^20.19.0 || >=22.12.0"
  }
}
```

Notes:

- `package-lock.json` must be generated by npm, not handwritten.
- Do not add runtime dependencies.
- Do not add Playwright in Phase 2.
- Do not add lint/format tooling unless the project plan is updated to include it.

## File-Level Strategy

Phase 2 implementation should touch exactly the files below unless a preflight blocker requires a documented plan change.

| File | Phase 2 Responsibility |
| --- | --- |
| `package.json` | Define npm project metadata, `type: "module"`, required scripts, dev dependencies, and optionally `engines` for the current Vite/Vitest Node requirement. |
| `package-lock.json` | Capture exact dependency resolution from `npm install`; must be generated by npm. |
| `vite.config.js` | Configure Vite/Vitest minimally through `defineConfig`; keep default app root and default build output. |
| `index.html` | Provide the single-page HTML entry point with `<div id="app"></div>` and `<script type="module" src="/src/main.js"></script>`. |
| `src/main.js` | Import CSS and mount the static Phase 2 shell into `#app`. |
| `src/styles.css` | Provide minimal global and shell styling proving CSS bundling works. |
| `src/ui/appShell.js` | Provide static shell state, markup creation, and mount helper. No gameplay UI. |
| `src/game/.gitkeep` | Track the future game-rule folder without implementing game logic. |
| `tests/unit/app-shell.test.js` | Provide a small Vitest test file that proves the harness runs and the shell helper behaves. |
| `README.md` | Replace the Phase 1 placeholder with setup, Node, install, test, build, dev, and preview instructions. |
| `TODO.md` | At the end of verified Phase 2 work, replace Phase 2 entries with approved Phase 3 entries. Do not refresh early. |
| `DONE.md` | After checks pass, record Phase 2 completion and verification evidence. Do not pre-fill. |

Files that should not be touched:

| File | Reason |
| --- | --- |
| `AGENTS.md` | Explicitly says not to adapt it. |
| `GEMINI.md` | Workflow rules are already sufficient. |
| `REQUIREMENTS.md` | Phase 1 has already locked the decisions needed for Phase 2. Touch only if the project owner changes stack/version requirements. |
| `IMPLEMENTATION_PLAN.md` | Phase order and scope already match Phase 2. Touch only if Node/tooling decisions force replanning. |
| `.gitignore` | Already excludes Phase 2 generated artifacts. |
| `IMPLEMENTATION_PHASE1.md` | Historical blueprint; do not modify. |

## Atomic Execution Steps

The high-level checklist below comes directly from the active `TODO.md`.

### 1. Add `package.json` with npm scripts for `test`, `build`, `preview`, and local development.

Plan:

- Confirm the runtime before installing dependencies:
  - `node --version`
  - `npm --version`
- Compare Node against the current Vite/Vitest requirement from the online reference check.
- If Node is still `v18.19.1`, stop Phase 2 implementation and ask the user to upgrade Node or explicitly approve a requirements change for older tool versions.
- Once Node is compatible, create minimal npm metadata with no runtime dependencies.
- Use npm as locked in `REQUIREMENTS.md`.
- Use `dev`, `test`, `build`, and `preview` scripts exactly:
  - `dev`: `vite`
  - `test`: `vitest run`
  - `build`: `vite build`
  - `preview`: `vite preview`

Act:

- Create `package.json` with project metadata and scripts.
- Add `vite` and `vitest` as dev dependencies through npm:

```sh
npm install -D vite vitest
```

- Let npm generate `package-lock.json`.
- If using `engines`, set:

```json
"engines": {
  "node": "^20.19.0 || >=22.12.0"
}
```

Validate:

- `package.json` contains all required scripts.
- `package-lock.json` exists and was generated by npm.
- `node_modules/` exists locally but remains ignored by Git.
- `git status --short` shows `package.json` and `package-lock.json`, not `node_modules/`.
- `npm run` lists `dev`, `test`, `build`, and `preview`.
- No application/gameplay code was created during this step except package metadata.

### 2. Add Vite static app entry files in `index.html`, `src/main.js`, and `src/styles.css`.

Plan:

- Create a single-page Vite app root.
- Keep `index.html` semantic and small.
- Use `src/main.js` only for bootstrapping, CSS import, and shell mount.
- Use `src/styles.css` only for minimal layout/readability.
- Do not create a landing page, marketing content, or real game controls in Phase 2.

Act:

- Create `index.html` with:
  - `<!doctype html>`
  - `<html lang="en">`
  - `<meta charset="UTF-8">`
  - responsive viewport meta
  - `<title>PXL Sweeper</title>`
  - `<div id="app"></div>`
  - module script to `/src/main.js`
- Create `src/main.js`:
  - `import './styles.css';`
  - `import { mountAppShell } from './ui/appShell.js';`
  - `mountAppShell(document.querySelector('#app'));`
- Create `src/styles.css` with small shell styling.

Validate:

- `npm run build` resolves `/src/main.js` from `index.html`.
- Browser preview shows `PXL Sweeper` and `Ready.`.
- DevTools console has no module, MIME type, or missing-root errors.
- No board, mines, flags, timer, counter, difficulty selector, reset behavior, or gameplay action handlers exist yet.

### 3. Add the initial `src/game/`, `src/ui/`, and `tests/unit/` structure without gameplay logic.

Plan:

- Track the future source structure in Git.
- Use `src/ui/appShell.js` as the only real source module beyond `src/main.js`.
- Use `src/game/.gitkeep` to avoid fake game code.
- Use `tests/unit/app-shell.test.js` as the harness proof.
- Avoid placeholder game APIs such as `createBoard`, `revealCell`, `flagCell`, `placeMines`, or `getNeighbors`.

Act:

- Create directories:
  - `src/game/`
  - `src/ui/`
  - `tests/unit/`
- Add:
  - `src/game/.gitkeep`
  - `src/ui/appShell.js`
  - `tests/unit/app-shell.test.js`

Validate:

- `rg --files src tests` shows the expected structure.
- `src/game/` contains only `.gitkeep`.
- `src/ui/appShell.js` contains shell-only code.
- No file under `src/` contains gameplay implementation terms used as function names.
- `git status --short` does not show untracked generated output such as `dist/`.

### 4. Add a Vitest-backed unit-test command that runs successfully.

Plan:

- Configure Vitest through `vite.config.js` so one config file can support Vite and unit tests.
- Keep the test environment as `node`; do not add `jsdom`.
- Add a meaningful but tiny test for the shell helper.
- Ensure `npm test` runs once and exits.

Act:

- Create `vite.config.js`:

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.js'],
  },
});
```

- Create `tests/unit/app-shell.test.js` with tests for:
  - default markup contains app name;
  - default markup contains `Ready.`;
  - mounting writes markup into a root object;
  - mounting without a root throws.

Validate:

- `npm test` passes.
- `npm test` does not enter watch mode.
- Test output reports at least one passing test file.
- The test does not require browser APIs, snapshots, or external services.
- If `npm test` fails because no tests are found, add or fix the Phase 2 shell test rather than using a pass-with-no-tests workaround.

### 5. Document setup, test, build, and preview commands in `README.md`.

Plan:

- Replace the current Phase 1 placeholder README with practical Phase 2 instructions.
- Mention the required Node line from current Vite/Vitest docs.
- Document npm install and all scripts.
- Keep documentation concise; no gameplay rules or implementation roadmap details beyond what users need to run the shell.

Act:

- Update `README.md` to include:
  - project summary;
  - prerequisites;
  - install command;
  - local dev command;
  - unit test command;
  - build command;
  - preview command;
  - note that Phase 2 shell contains no gameplay yet.

Recommended command block:

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

Validate:

- Every README command exists in `package.json`.
- README Node requirement matches `package.json` `engines` if `engines` is added.
- README does not claim gameplay is implemented.
- README does not document Playwright, deployment hosting, custom boards, or future features as current behavior.

### 6. Verify `npm test`, `npm run build`, and `npm run preview` for the app shell.

Plan:

- Run checks in the same order a reviewer can repeat.
- Keep `npm run preview` running only long enough for manual smoke review, then stop it.
- Use the default Vite preview URL unless the port is occupied.
- If a port is occupied, pass `-- --port <free-port>` and document the actual URL in `DONE.md`.

Act:

Run:

```sh
npm test
npm run build
npm run preview
```

Manual preview:

- Open the printed local preview URL.
- Confirm the page loads from the built `dist` output.
- Confirm the page title is `PXL Sweeper`.
- Confirm the visible shell includes `PXL Sweeper` and `Ready.`.
- Confirm there are no console errors.
- Stop the preview process after the check.

Validate:

- `npm test` exits successfully.
- `npm run build` exits successfully and creates ignored `dist/`.
- `npm run preview` serves the build.
- Manual smoke check passes.
- `git diff --check` passes.
- `git status --short` shows only intentional tracked-file changes, not `node_modules/` or `dist/`.

### 7. Refresh `TODO.md` with the approved Phase 3 entries before implementing game rules.

Plan:

- Refresh `TODO.md` only after Phase 2 implementation, verification, and review are complete.
- Use the exact Phase 3 entries from `IMPLEMENTATION_PLAN.md`.
- Update `DONE.md` with Phase 2 evidence before moving on.
- Do not start Phase 3 game-rule implementation in the same change unless the user explicitly approves after review.

Act:

- Replace `TODO.md` content with:

```md
# Phase 3 - Core Game Rules Are Tested in Isolation

- [ ] Add difficulty configuration in `src/game/config.js` using the Phase 1 preset decisions.
- [ ] Add board and cell creation logic with deterministic test hooks.
- [ ] Add first-click-safe mine placement and adjacency calculation.
- [ ] Add reveal behavior for hidden safe cells, numbered cells, zero cells, and mines.
- [ ] Add flood reveal behavior for connected zero cells and bordering numbered cells.
- [ ] Add win, loss, and frozen end-state handling in the game model.
- [ ] Add unit tests for configuration, board generation, reveal rules, flood reveal, win, loss, and frozen states.
- [ ] Verify `npm test` and `npm run build` after the pure game-rule implementation.
- [ ] Refresh `TODO.md` with the approved Phase 4 entries before connecting the UI.
```

- Append a Phase 2 section to `DONE.md` only after verification has passed.

Validate:

- `TODO.md` contains exactly one active phase: Phase 3.
- `TODO.md` has no remaining Phase 2 unchecked entries.
- `DONE.md` records concrete Phase 2 verification evidence.
- `git diff --check` still passes.
- No Phase 3 files such as `src/game/config.js` or rule tests have been created yet.

## Edge Case & Boundary Audit

### Tooling and Environment

- **Node too old:** Current local `node v18.19.1` is below current Vite/Vitest requirements. Dependency install or scripts may fail. Resolve Node before implementation or deliberately replan.
- **npm lock mismatch:** `package-lock.json` must be generated by npm in this repo. Do not hand-edit it.
- **Watch-mode trap:** `vitest` without `run` can enter watch mode. `npm test` must use `vitest run`.
- **No-tests failure:** Vitest may fail when no tests are found. Add the shell unit test instead of suppressing the failure.
- **Preview before build:** `vite preview` serves `dist`; it is not a dev server substitute. Run `npm run build` before preview.
- **Port collision:** Vite dev usually uses `5173`; preview usually uses `4173`. If occupied, use a different port and document it.
- **Generated artifacts:** `node_modules/` and `dist/` should never be committed. `.gitignore` already covers them.
- **Network restriction:** Installing dependencies requires network access. If installation fails due to sandbox/network restrictions, request escalation rather than working around npm.

### Scope Control

- **Accidental gameplay:** Do not add difficulty data, board arrays, cell objects, mine counts, reveal handlers, right-click handlers, or timers.
- **Fake APIs:** Avoid placeholder functions that look like real game APIs. They create contracts before Phase 3 design.
- **Framework creep:** Do not add React, Vue, Svelte, Lit, router packages, state libraries, or CSS frameworks.
- **E2E creep:** Do not add Playwright in Phase 2. It is planned for Phase 9.
- **Deployment creep:** Do not add GitHub Pages, Netlify, Render, Firebase, or CI deployment config. v1 deployment target is local-only static build verification.
- **Docs overclaiming:** README must say the shell runs; it must not claim the game is playable.

### Browser and Vite Boundaries

- **Root mismatch:** `src/main.js` should throw a clear error if `#app` is missing.
- **Module path mismatch:** `index.html` must use `/src/main.js`, not a relative path that breaks under Vite root assumptions.
- **CSS import missing:** If `src/main.js` forgets `import './styles.css';`, build may pass but styling proof is lost.
- **Base-path overconfiguration:** Do not set `base` in `vite.config.js` for Phase 2 because deployment is local-only and Vite defaults are sufficient.
- **Asset overuse:** Do not add images, fonts, SVG hero art, or generated bitmap assets for the foundation shell.

### UX and Presentation

- **Placeholder permanence:** Any visible "foundation" wording is temporary and must be removed when the actual UI lands.
- **Landing-page drift:** The shell should be a minimal app root, not a marketing page.
- **Poor desktop readability:** Even the shell should be readable at common desktop sizes.
- **Color overcommit:** Avoid building a final palette before gameplay states exist.
- **Accessibility regression:** Keep one `main` landmark, a real `h1`, and a `role="status"` element for the initial status copy.

### Documentation Workflow

- **Early TODO refresh:** Do not replace `TODO.md` with Phase 3 until Phase 2 is verified.
- **Premature DONE entry:** Do not update `DONE.md` before checks pass.
- **Wrong file edit:** Do not edit `AGENTS.md`; use `GEMINI.md` only if workflow rules change.
- **Requirements drift:** If Node/tooling compatibility forces a stack/version decision, update `REQUIREMENTS.md` and `IMPLEMENTATION_PLAN.md` only after project-owner approval.

## Verification Protocol

### Preflight

- [ ] `git status --short` is reviewed before edits.
- [ ] `node --version` is compatible with current Vite/Vitest requirements.
- [ ] `npm --version` is recorded for review context.
- [ ] `REQUIREMENTS.md` still locks npm, Vite, vanilla JS modules, HTML, CSS, and Vitest.
- [ ] `TODO.md` still contains Phase 2 entries.

### Automated Checks

- [ ] `npm install` completes and creates `package-lock.json`.
- [ ] `npm test` passes with `vitest run`.
- [ ] `npm run build` passes and writes `dist/`.
- [ ] `npm run preview` starts successfully after build.
- [ ] `git diff --check` passes.
- [ ] `git status --short` contains only intended tracked-file changes and no generated artifacts.

### Manual UX Checks

- [ ] Preview URL loads in a desktop browser.
- [ ] The document title is `PXL Sweeper`.
- [ ] The visible shell contains `PXL Sweeper`.
- [ ] The inline status text is `Ready.`.
- [ ] The page stays on a single screen and does not navigate.
- [ ] No modal, alert, route change, or replacement screen appears.
- [ ] Browser console shows no errors on load.
- [ ] The shell is readable at a typical desktop browser size.
- [ ] No gameplay affordance appears functional yet.

### Unit Test Cases

`tests/unit/app-shell.test.js` should cover:

- [ ] `createAppShellMarkup()` renders the app name.
- [ ] `createAppShellMarkup()` renders the locked initial status text.
- [ ] `mountAppShell(fakeRoot)` writes markup into `fakeRoot.innerHTML`.
- [ ] `mountAppShell(null)` throws `App root #app was not found.`.

### Exit Criteria

Phase 2 can be moved to `DONE.md` only when:

- `package.json` contains `dev`, `test`, `build`, and `preview`.
- `package-lock.json` exists.
- `index.html`, `src/main.js`, and `src/styles.css` load a visible shell.
- `src/game/`, `src/ui/`, and `tests/unit/` are present in tracked files.
- `npm test` passes.
- `npm run build` passes.
- `npm run preview` has been manually smoke-tested.
- `README.md` documents the actual setup and command flow.
- `TODO.md` is refreshed to Phase 3 after verification.
- No gameplay logic has been implemented.

## Code Scaffolding

The snippets below are implementation templates. They should be copied or adapted during Phase 2 implementation, not executed as part of this blueprint.

### `package.json`

```json
{
  "name": "pxl-sweeper",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": "^20.19.0 || >=22.12.0"
  },
  "scripts": {
    "dev": "vite",
    "test": "vitest run",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^8.0.9",
    "vitest": "^4.1.5"
  }
}
```

Scaffolding note:

- If `npm install -D vite vitest` resolves newer compatible versions, accept npm's generated versions unless there is a concrete reason to pin.
- If the npm registry resolves different versions than shown above, trust `package-lock.json` as the exact installed truth.

### `vite.config.js`

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.js'],
  },
});
```

### `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PXL Sweeper</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### `src/main.js`

```js
import './styles.css';
import { mountAppShell } from './ui/appShell.js';

mountAppShell(document.querySelector('#app'));
```

### `src/ui/appShell.js`

```js
export const APP_SHELL_STATE = Object.freeze({
  appName: 'PXL Sweeper',
  statusMessage: 'Ready.',
});

export function createAppShellMarkup(shellState = APP_SHELL_STATE) {
  return `
    <main class="app-shell" aria-labelledby="app-title">
      <section class="app-shell__masthead">
        <p class="app-shell__eyebrow">Static app foundation</p>
        <h1 id="app-title">${shellState.appName}</h1>
        <p class="app-shell__status" role="status">${shellState.statusMessage}</p>
      </section>
    </main>
  `;
}

export function mountAppShell(root, shellState = APP_SHELL_STATE) {
  if (!root) {
    throw new Error('App root #app was not found.');
  }

  root.innerHTML = createAppShellMarkup(shellState);
}
```

### `src/styles.css`

```css
:root {
  color: #1d2329;
  background: #f5f7f8;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
}

button,
input,
select,
textarea {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
}

.app-shell__masthead {
  width: min(100%, 520px);
  padding: 32px;
  border: 1px solid #b8c1c8;
  background: #ffffff;
  box-shadow: 0 16px 36px rgb(29 35 41 / 10%);
}

.app-shell__eyebrow {
  margin: 0 0 8px;
  color: #4f6675;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
}

.app-shell h1 {
  margin: 0;
  font-size: 2.25rem;
  line-height: 1.1;
}

.app-shell__status {
  margin: 16px 0 0;
  color: #264f36;
  font-weight: 700;
}
```

CSS note:

- This is deliberately temporary. Phase 8 owns final desktop presentation and accessibility review.
- Keep border radius at `0` here to leave room for the later classic square-grid direction.

### `tests/unit/app-shell.test.js`

```js
import { describe, expect, it } from 'vitest';
import { createAppShellMarkup, mountAppShell } from '../../src/ui/appShell.js';

describe('app shell', () => {
  it('renders the app name', () => {
    expect(createAppShellMarkup()).toContain('PXL Sweeper');
  });

  it('renders the locked initial status copy', () => {
    expect(createAppShellMarkup()).toContain('Ready.');
  });

  it('mounts shell markup into the app root', () => {
    const root = { innerHTML: '' };

    mountAppShell(root);

    expect(root.innerHTML).toContain('app-shell');
  });

  it('throws when the app root is missing', () => {
    expect(() => mountAppShell(null)).toThrow('App root #app was not found.');
  });
});
```

### `src/game/.gitkeep`

```txt
```

This file should stay empty. It exists only so Git tracks the future game module directory before Phase 3.

### `README.md`

````md
# pxl-sweeper

PXL Sweeper is a desktop-first, static Minesweeper-style browser game.

## Prerequisites

- Node.js compatible with the current Vite/Vitest toolchain: `^20.19.0 || >=22.12.0`
- npm

## Setup

```sh
npm install
```

## Development

```sh
npm run dev
```

## Test

```sh
npm test
```

## Build

```sh
npm run build
```

## Preview the Build

```sh
npm run preview
```

Phase 2 provides the static app shell and tooling foundation. Gameplay implementation begins in Phase 3.
````

## Review Checklist Before Implementation Starts

- [ ] Reviewer accepts that Phase 2 may require upgrading local Node from `v18.19.1`.
- [ ] Reviewer accepts current Vite/Vitest unless a specific version pin is requested.
- [ ] Reviewer accepts the minimal shell approach and no gameplay implementation.
- [ ] Reviewer accepts `src/ui/appShell.js` as a small testable shell module.
- [ ] Reviewer accepts using `src/game/.gitkeep` to track the empty game folder.
- [ ] Reviewer accepts that `TODO.md` and `DONE.md` should be updated only after Phase 2 verification, not during this blueprint-only step.
