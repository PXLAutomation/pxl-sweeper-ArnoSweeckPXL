# Phase 1 - V1 Decisions Are Locked

Completed on 2026-04-23.

- [x] Confirmed the v1 stack and package manager in `REQUIREMENTS.md`: npm, Vite, vanilla JavaScript modules, HTML, CSS, Vitest, and later Playwright.
- [x] Confirmed the three difficulty presets in `REQUIREMENTS.md`: Beginner 9x9 with 10 mines, Intermediate 16x16 with 40 mines, and Expert 16x30 with 99 mines.
- [x] Confirmed mine-counter behavior in `REQUIREMENTS.md`: display `mine count minus placed flag count`, allowing negative values.
- [x] Confirmed browser chord trigger behavior in `REQUIREMENTS.md`: simultaneous primary and secondary mouse buttons on an already revealed numbered cell.
- [x] Confirmed compact outcome feedback copy and treatment in `REQUIREMENTS.md`: inline `Ready.`, `Playing.`, `You cleared the board.`, and `Mine hit. Try again.` messages.
- [x] Confirmed local-only static build verification as the v1 deployment target in `REQUIREMENTS.md`.
- [x] Refreshed `TODO.md` with only the Phase 2 entries before source implementation.

Verification evidence:

- `git diff --check` passed.
- Phase 1 blocker-text search passed for placeholder language and the former Phase 1 question phrases.
- `TODO.md` contains `Phase 2 - Static App Foundation Runs and Builds` and only unchecked Phase 2 entries.
- The source scaffold check returned no `src` or `tests` directories, so no Phase 2 implementation files were created.
- `npm test`, `npm run build`, and `npm run preview` were not run because Phase 1 intentionally has no `package.json` or application code.

# Phase 2 - Static App Foundation Runs and Builds

Completed on 2026-04-23.

- [x] Added `package.json` with npm metadata, `type: "module"`, Node engines, and `dev`, `test`, `build`, and `preview` scripts.
- [x] Installed Vite and Vitest with npm and generated `package-lock.json`.
- [x] Added Vite static app entry files in `index.html`, `src/main.js`, and `src/styles.css`.
- [x] Added the initial `src/game/`, `src/ui/`, and `tests/unit/` structure without gameplay logic.
- [x] Added `src/ui/appShell.js` with the static Phase 2 shell state, markup helper, and mount helper.
- [x] Added Vitest unit coverage for app-shell markup and mount behavior.
- [x] Documented setup, development, test, build, and preview commands in `README.md`.
- [x] Refreshed `TODO.md` with only the approved Phase 3 entries before implementing game rules.

Verification evidence:

- Runtime preflight passed with `node v22.22.2` and `npm 10.9.7`.
- `npm install -D vite vitest` completed, installing Vite `8.0.10` and Vitest `4.1.5` with no reported vulnerabilities.
- `npm test` passed with 1 test file and 4 tests.
- `npm run build` passed and created the ignored `dist/` output.
- `npm run preview -- --host 127.0.0.1` served the built output at `http://127.0.0.1:4173/`.
- Headless Firefox smoke check at 1280x720 rendered the static shell with `PXL Sweeper` and `Ready.`.
- `dist/index.html` contains the document title `PXL Sweeper`.
- `src/game/` contains only an empty `.gitkeep` marker.
- Scope scan found no gameplay implementation terms in `src/` or `tests/`.
- `git diff --check` passed.
