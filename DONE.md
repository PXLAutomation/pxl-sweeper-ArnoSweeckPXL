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
