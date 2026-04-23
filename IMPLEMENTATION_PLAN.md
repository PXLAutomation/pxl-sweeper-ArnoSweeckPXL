# Overview

PXL Sweeper is a small desktop-first, single-page Minesweeper-style browser game. The authoritative product scope is `REQUIREMENTS.md`; `GEMINI.md` defines the project workflow rules for keeping `IMPLEMENTATION_PLAN.md`, `TODO.md`, and `DONE.md` in sync.

The delivery goal is a complete v1 static web app with:

- exactly three preset difficulty levels;
- random mine placement with first-click safety;
- left-click reveal, right-click flagging, and chord interaction;
- correct adjacency numbers, flood reveal, win, loss, and frozen end states;
- visible timer, mine counter, difficulty selector, reset control, and compact in-place outcome message;
- loss-state mine reveal and incorrect-flag indication;
- repeatable test, build, preview, and review checks.

The current repository contains project documentation but no application source code. The plan therefore starts with a short decision phase and a separate tooling phase before implementing gameplay slices.

# Assumptions

- Project name: PXL Sweeper.
- Project type: static, desktop-first, single-page browser game.
- Primary project truth: `REQUIREMENTS.md`.
- Deployment target: local-only static build artifact verification for v1.
- Risk tolerance: medium, because classic Minesweeper has compact UI scope but non-trivial rule interactions around first-click safety, flood reveal, chord behavior, and end-state freezing.
- Review cadence: one phase should fit one focused review cycle, and each `TODO.md` entry must be independently reviewable.
- Implementation stack: vanilla JavaScript modules, HTML, and CSS using npm scripts and Vite for development/build, Vitest for unit tests, and Playwright for later end-to-end validation.
- The Vite build decision follows the current Vite static deployment documentation, where `npm run build` produces a `dist` output and `npm run preview` locally serves the built result: https://vite.dev/guide/static-deploy.html.
- The unit-test decision follows the current Vitest documentation, where `package.json` can expose a `test` script backed by Vitest and `vitest run` can be used for one-shot CI-style runs: https://vitest.dev/guide/.
- The end-to-end-test decision follows the current Playwright documentation, where tests can be run from the command line with `npx playwright test`: https://playwright.dev/docs/running-tests.
- No backend, authentication, persistence, story mode, multiplayer, audio, achievements, custom board editor, or mobile-first redesign is in scope for v1.
- Phase 1 locks the preset values, negative mine-counter behavior, final win/loss copy, visual direction, browser chord trigger, stack, package manager, and local-only deployment target in `REQUIREMENTS.md`.

# Delivery strategy

The plan uses a hybrid strategy.

The project starts with layered foundation work because there is no source code yet: decisions, package scripts, build tooling, and pure game-rule modules must exist before meaningful vertical slices can be reviewed. After that foundation, the work switches to thin vertical gameplay slices that connect rules to UI one capability at a time.

This fits the project type because Minesweeper has rule-heavy state transitions that are easiest to test in isolated JavaScript modules, while the product only feels reviewable once each rule is connected to the single-screen game interface. It also fits the review cadence because each phase has one primary outcome, a concrete file set, and a strict gate before related work can move from `TODO.md` to `DONE.md`.

# Phase list

- Phase 1: V1 Decisions Are Locked
- Phase 2: Static App Foundation Runs and Builds
- Phase 3: Core Game Rules Are Tested in Isolation
- Phase 4: Primary Reveal Loop Is Playable on Screen
- Phase 5: Flagging and Mine Counter Are Playable
- Phase 6: Chord Interaction Is Correct and Isolated
- Phase 7: Timer and End-State Controls Are Complete
- Phase 8: Desktop Presentation and Basic Accessibility Are Reviewable
- Phase 9: End-to-End Smoke Coverage Protects the Full Game
- Phase 10: Static Release Artifact Is Verifiable
- Phase 11: Final Stabilization and Documentation Are Complete

# Detailed phases

## Phase 1: V1 Decisions Are Locked

### Goal

Resolve the product and technical decisions that would otherwise block implementation sequencing.

### Scope

- Confirm the final stack for v1.
- Confirm package manager and required npm scripts.
- Confirm the three difficulty preset names, board dimensions, and mine counts.
- Confirm whether the mine counter may go negative or stops at zero.
- Confirm the chord trigger behavior for desktop browsers.
- Confirm the compact win/loss feedback treatment.
- Confirm whether deployment is local-only or a named static host.
- Record any requirement changes in `REQUIREMENTS.md`.
- Refresh `TODO.md` with only the Phase 2 entries before implementation starts.

### Expected files to change

- `REQUIREMENTS.md`
- `IMPLEMENTATION_PLAN.md`
- `TODO.md`
- `DONE.md`
- `README.md` if setup or deployment decisions need a brief note

### Dependencies

- Upstream dependency: current `REQUIREMENTS.md` must remain the source of product truth.
- Intra-project dependency: `GEMINI.md` workflow rules must be followed.
- This phase has no earlier phase dependency.
- Phase 1 decision targets: exact difficulty values, chord trigger semantics, mine-counter behavior, stack choice, and deployment target must be decided before later phases can proceed safely.

### Risks

- Medium risk: leaving decisions open can cause rework in model tests, UI layout, or deployment setup.
- Main failure modes are starting implementation with placeholder difficulty values, adding a stack that is too complex for the course context, or deferring chord behavior until after UI code has already shaped input handling.

### Tests and checks to run

- Manual documentation review of `REQUIREMENTS.md`, `IMPLEMENTATION_PLAN.md`, and `TODO.md`.
- `git diff --check`
- No application build is expected in this phase because no app code should be implemented yet.

### Review check before moving work to `DONE.md`

- Confirm the phase outcome matches the stated goal and scope.
- Confirm every changed requirement is traceable to `REQUIREMENTS.md`.
- Confirm no application implementation code was started.
- Review code concerns as not applicable unless tooling or source files were accidentally added.
- Review regression risk by checking whether decisions contradict existing acceptance criteria.
- Confirm documentation updates are complete and consistent across `REQUIREMENTS.md`, `IMPLEMENTATION_PLAN.md`, and `TODO.md`.
- Confirm scope creep did not add non-goal features.
- Confirm unfinished follow-up work has been written back to `TODO.md`.

### Exact `TODO.md` entries to refresh from this phase

- `Phase 1 - V1 Decisions Are Locked`
- [ ] Confirm the v1 stack and package manager in `REQUIREMENTS.md`.
- [ ] Confirm the three difficulty preset names, dimensions, and mine counts in `REQUIREMENTS.md`.
- [ ] Confirm mine-counter behavior when placed flags exceed the mine count in `REQUIREMENTS.md`.
- [ ] Confirm browser chord trigger behavior in `REQUIREMENTS.md`.
- [ ] Confirm compact win/loss feedback copy or visual treatment in `REQUIREMENTS.md`.
- [ ] Confirm local-only or static-host deployment target in `REQUIREMENTS.md`.
- [ ] Refresh `TODO.md` with the approved Phase 2 entries before starting source implementation.

### Exit criteria for moving items to `DONE.md`

- The stack/package-manager item can move only when `REQUIREMENTS.md` names the chosen stack and package manager.
- The difficulty item can move only when all three presets have names, dimensions, and mine counts recorded.
- The mine-counter item can move only when negative-counter or zero-floor behavior is explicitly recorded.
- The chord trigger item can move only when the desktop browser input trigger is explicitly recorded.
- The win/loss feedback item can move only when the accepted copy or visual treatment is recorded.
- The deployment-target item can move only when local-only or the specific static host is recorded.
- The `TODO.md` refresh item can move only when Phase 2 entries are present and no Phase 1 implementation entries remain open.
- No Phase 1 item may move to `DONE.md` unless the documentation review is complete and `git diff --check` passes.

## Phase 2: Static App Foundation Runs and Builds

### Goal

Create the runnable static app foundation with repeatable npm scripts, build output, and unit-test harness.

### Scope

- Add npm project metadata and scripts.
- Add Vite-based static app entry points.
- Add Vitest configuration or script support for one-shot unit tests.
- Add a minimal app shell with a visible page root but no gameplay implementation beyond non-functional placeholders.
- Add initial project structure for source, styles, and tests.
- Document local setup, test, build, and preview commands.
- Refresh `TODO.md` with Phase 3 entries after this phase is reviewed.

### Expected files to change

- `package.json`
- `package-lock.json`
- `vite.config.js`
- `index.html`
- `src/main.js`
- `src/styles.css`
- `src/game/`
- `src/ui/`
- `tests/unit/`
- `README.md`
- `TODO.md`
- `DONE.md`

### Dependencies

- Depends on Phase 1 completion.
- Upstream dependency: Node.js and npm must be available in the development environment.
- Intra-project dependency: confirmed stack and package-manager decision must exist.
- Blocker: if Vite is rejected in Phase 1, this phase must be rewritten before starting.

### Risks

- Low to medium risk: tooling can become heavier than the course project needs.
- Main failure modes are adding unnecessary frameworks, missing the required `test` script, or creating a build that cannot be served as a static site.

### Tests and checks to run

- `npm install`
- `npm test`
- `npm run build`
- `npm run preview`
- Manual smoke check that the previewed static app loads the shell page.
- `git diff --check`

### Review check before moving work to `DONE.md`

- Confirm the phase outcome matches the stated goal and scope.
- Review package scripts for simplicity and repeatability.
- Confirm requirement traceability to the project setup requirements in `REQUIREMENTS.md`.
- Review regression risk by checking that no gameplay behavior was partially implemented without tests.
- Confirm `README.md` documents setup, test, build, and preview commands.
- Confirm scope creep did not introduce a frontend framework, backend service, or unrelated tooling.
- Confirm unfinished follow-up work has been written back to `TODO.md`.

### Exact `TODO.md` entries to refresh from this phase

- `Phase 2 - Static App Foundation Runs and Builds`
- [ ] Add `package.json` with npm scripts for `test`, `build`, `preview`, and local development.
- [ ] Add Vite static app entry files in `index.html`, `src/main.js`, and `src/styles.css`.
- [ ] Add the initial `src/game/`, `src/ui/`, and `tests/unit/` structure without gameplay logic.
- [ ] Add a Vitest-backed unit-test command that runs successfully.
- [ ] Document setup, test, build, and preview commands in `README.md`.
- [ ] Verify `npm test`, `npm run build`, and `npm run preview` for the app shell.
- [ ] Refresh `TODO.md` with the approved Phase 3 entries before implementing game rules.

### Exit criteria for moving items to `DONE.md`

- The package script item can move only when `package.json` contains the required scripts and they are reviewable.
- The app entry item can move only when `index.html`, `src/main.js`, and `src/styles.css` load a visible shell.
- The folder-structure item can move only when source and unit-test folders exist without unreviewed gameplay code.
- The Vitest item can move only when `npm test` completes successfully.
- The README item can move only when command documentation matches the actual scripts.
- The verification item can move only when `npm test`, `npm run build`, and a manual `npm run preview` smoke check pass.
- The `TODO.md` refresh item can move only when Phase 3 entries are present.

## Phase 3: Core Game Rules Are Tested in Isolation

### Goal

Implement and test the pure Minesweeper game rules without depending on DOM rendering.

### Scope

- Define difficulty configuration from Phase 1 decisions.
- Model board cells, mine placement, adjacency values, revealed state, flagged state, and game status.
- Implement first-click-safe mine generation.
- Implement normal reveal behavior, including mine loss.
- Implement zero-value flood reveal and bordering numbered-cell reveal.
- Implement win detection when all non-mine cells are revealed.
- Freeze model changes after win or loss.
- Add deterministic unit-test helpers for known board layouts.
- Refresh `TODO.md` with Phase 4 entries after this phase is reviewed.

### Expected files to change

- `src/game/config.js`
- `src/game/board.js`
- `src/game/state.js`
- `src/game/actions.js`
- `src/game/selectors.js`
- `tests/unit/game-config.test.js`
- `tests/unit/board-generation.test.js`
- `tests/unit/reveal-rules.test.js`
- `tests/unit/flood-reveal.test.js`
- `tests/unit/win-loss.test.js`
- `TODO.md`
- `DONE.md`

### Dependencies

- Depends on Phase 2 completion.
- Depends on Phase 1 difficulty and rule decisions.
- Upstream dependency: Vitest must be available through npm scripts.
- Intra-project dependency: app source structure must exist.
- Blocker: this phase cannot start if `REQUIREMENTS.md` no longer locks difficulty values or first-click safety expectations.

### Risks

- Medium risk: game-rule bugs can be subtle and later become harder to isolate through UI testing.
- Main failure modes are off-by-one adjacency errors, flood reveal revealing too much or too little, unsafe first click, premature win detection, and state mutation after game end.

### Tests and checks to run

- `npm test`
- `npm run build`
- Unit tests covering difficulty config, mine placement, first-click safety, adjacency counts, normal reveal, flood reveal, loss, win, and frozen end states.
- `git diff --check`

### Review check before moving work to `DONE.md`

- Confirm the phase outcome matches the stated goal and scope.
- Review code for small, pure, testable game modules with no DOM coupling.
- Confirm requirement traceability to FR-01 through FR-10, FR-18, and FR-21.
- Review regression risk around first-click safety, flood reveal, win/loss status, and state immutability.
- Confirm docs are updated if any rule decision changed.
- Confirm scope creep did not add UI features, persistence, custom boards, or non-required mechanics.
- Confirm unfinished follow-up work has been written back to `TODO.md`.

### Exact `TODO.md` entries to refresh from this phase

- `Phase 3 - Core Game Rules Are Tested in Isolation`
- [ ] Add difficulty configuration in `src/game/config.js` using the Phase 1 preset decisions.
- [ ] Add board and cell creation logic with deterministic test hooks.
- [ ] Add first-click-safe mine placement and adjacency calculation.
- [ ] Add reveal behavior for hidden safe cells, numbered cells, zero cells, and mines.
- [ ] Add flood reveal behavior for connected zero cells and bordering numbered cells.
- [ ] Add win, loss, and frozen end-state handling in the game model.
- [ ] Add unit tests for configuration, board generation, reveal rules, flood reveal, win, loss, and frozen states.
- [ ] Verify `npm test` and `npm run build` after the pure game-rule implementation.
- [ ] Refresh `TODO.md` with the approved Phase 4 entries before connecting the UI.

### Exit criteria for moving items to `DONE.md`

- The difficulty item can move only when config values match `REQUIREMENTS.md` and have unit coverage.
- The board/cell item can move only when board construction is present and deterministic test hooks are covered.
- The first-click item can move only when tests prove the first revealed cell cannot be a mine.
- The reveal item can move only when safe, numbered, zero, and mine reveal cases are tested.
- The flood item can move only when connected zero and bordering numbered behavior is tested.
- The win/loss item can move only when tests prove correct status transitions and frozen state after game end.
- The unit-test item can move only when all listed rule areas have passing tests.
- The verification item can move only when `npm test` and `npm run build` pass.
- The `TODO.md` refresh item can move only when Phase 4 entries are present.

## Phase 4: Primary Reveal Loop Is Playable on Screen

### Goal

Connect the pure game model to the single-screen UI so the player can start games, select difficulty, reveal cells, reset, and see win/loss status.

### Scope

- Render the board for the selected difficulty.
- Render hidden, revealed, mine, and numbered cell states.
- Connect left-click reveal to the game model.
- Show compact in-place win/loss feedback.
- Freeze board interactions after win or loss at the UI layer.
- Add reset behavior that starts a new game without navigation.
- Add difficulty selection that starts or prepares a new board according to the Phase 1 decision.
- Keep right-click flagging, chord interaction, timer behavior, and final visual styling out of this phase except for placeholders needed for layout.
- Refresh `TODO.md` with Phase 5 entries after this phase is reviewed.

### Expected files to change

- `index.html`
- `src/main.js`
- `src/styles.css`
- `src/ui/renderBoard.js`
- `src/ui/controller.js`
- `src/ui/statusView.js`
- `src/game/actions.js` if UI integration reveals small model gaps
- `tests/unit/ui-controller.test.js`
- `tests/unit/render-board.test.js`
- `README.md` if interaction notes are needed
- `TODO.md`
- `DONE.md`

### Dependencies

- Depends on Phase 3 completion.
- Upstream dependency: browser DOM APIs available through the app runtime and test environment.
- Intra-project dependency: pure game model must expose stable actions/selectors for UI integration.
- Blocker: if `REQUIREMENTS.md` no longer locks win/loss feedback treatment, the status display part must wait.

### Risks

- Medium risk: UI code can accidentally duplicate or bypass tested game rules.
- Main failure modes are mismatched DOM state, double reveal events, difficulty changes preserving stale board state, and post-game clicks still changing the UI.

### Tests and checks to run

- `npm test`
- `npm run build`
- Manual browser smoke test with `npm run preview`: select each difficulty, reveal cells, trigger reset, observe loss/win status on controlled or test-friendly boards if available.
- Manual UX check that the board, difficulty selector, reset control, mine counter placeholder, and timer placeholder remain visible on one screen.
- `git diff --check`

### Review check before moving work to `DONE.md`

- Confirm the phase outcome matches the stated goal and scope.
- Review code for clear separation between model state and DOM rendering.
- Confirm requirement traceability to FR-01, FR-02, FR-03, FR-07, FR-08, FR-09, FR-18, FR-19, FR-20, FR-21, FR-29, FR-30, FR-31, and FR-32.
- Review regression risk around reset, difficulty switching, and frozen UI after end state.
- Confirm documentation is updated if the visible interaction behavior differs from `REQUIREMENTS.md`.
- Confirm scope creep did not add flagging, chord, persistence, mobile gestures, or styling work beyond layout placeholders.
- Confirm unfinished follow-up work has been written back to `TODO.md`.

### Exact `TODO.md` entries to refresh from this phase

- `Phase 4 - Primary Reveal Loop Is Playable on Screen`
- [ ] Render the selected difficulty board from the game model.
- [ ] Render hidden, revealed, numbered, and mine cell states from model state.
- [ ] Connect left-click reveal to the game model without duplicating rule logic in UI code.
- [ ] Show compact in-place win and loss feedback after model end states.
- [ ] Freeze UI gameplay interactions after win or loss.
- [ ] Add reset control behavior that starts a new game on the same screen.
- [ ] Add difficulty selection behavior using the approved presets.
- [ ] Verify `npm test`, `npm run build`, and a manual preview smoke test for reveal, reset, difficulty selection, and end-state feedback.
- [ ] Refresh `TODO.md` with the approved Phase 5 entries before implementing flagging.

### Exit criteria for moving items to `DONE.md`

- The board-render item can move only when the UI displays the selected preset dimensions from model state.
- The cell-state item can move only when hidden, revealed, numbered, and mine states are visually distinguishable.
- The left-click item can move only when reveal actions pass through the game model and are covered by tests or manual smoke evidence.
- The feedback item can move only when win and loss states show in-place messages without navigation.
- The freeze item can move only when post-game reveal attempts do not change model or DOM state.
- The reset item can move only when reset starts a new same-screen game.
- The difficulty item can move only when each preset can be selected and produces the correct board shape.
- The verification item can move only when listed checks pass.
- The `TODO.md` refresh item can move only when Phase 5 entries are present.

## Phase 5: Flagging and Mine Counter Are Playable

### Goal

Add right-click flagging and a correct mine counter to the playable board.

### Scope

- Implement flag and unflag actions in the game model if not already present.
- Prevent normal reveal of flagged cells.
- Connect right-click/context-menu handling to flag and unflag hidden cells.
- Update the visible mine counter according to the Phase 1 counter decision.
- Show all mines after loss.
- Identify incorrectly flagged cells after loss.
- Preserve frozen interactions after win or loss.
- Refresh `TODO.md` with Phase 6 entries after this phase is reviewed.

### Expected files to change

- `src/game/actions.js`
- `src/game/selectors.js`
- `src/ui/controller.js`
- `src/ui/renderBoard.js`
- `src/ui/counterView.js`
- `src/styles.css`
- `tests/unit/flag-rules.test.js`
- `tests/unit/counter-view.test.js`
- `tests/unit/loss-reveal.test.js`
- `TODO.md`
- `DONE.md`

### Dependencies

- Depends on Phase 4 completion.
- Depends on Phase 1 mine-counter behavior decision.
- Upstream dependency: browser right-click context menu must be suppressible for board cells.
- Intra-project dependency: UI rendering must already update from model state.
- Blocker: counter behavior must be explicitly decided before counter implementation starts.

### Risks

- Medium risk: flag state affects reveal prevention, mine counter accuracy, loss rendering, and chord behavior in the next phase.
- Main failure modes are browser context menu interfering with gameplay, flagged cells revealing on left click, incorrect counter math, and wrong-flag markers being ambiguous.

### Tests and checks to run

- `npm test`
- `npm run build`
- Manual browser smoke test with `npm run preview`: right-click flag, right-click unflag, left-click flagged cell, place extra flags if allowed, lose with wrong flags visible.
- Manual UX check that flagged, wrong-flag, and mine states are visually distinguishable.
- `git diff --check`

### Review check before moving work to `DONE.md`

- Confirm the phase outcome matches the stated goal and scope.
- Review code for event handling that does not leak browser context-menu behavior onto cells.
- Confirm requirement traceability to FR-11, FR-12, FR-13, FR-22, FR-23, FR-27, and FR-28.
- Review regression risk around reveal prevention, loss rendering, and frozen end states.
- Confirm documentation is updated if right-click or counter behavior needed clarification.
- Confirm scope creep did not add chord behavior, statistics, persistence, or custom flag modes.
- Confirm unfinished follow-up work has been written back to `TODO.md`.

### Exact `TODO.md` entries to refresh from this phase

- `Phase 5 - Flagging and Mine Counter Are Playable`
- [ ] Add model support for placing and removing flags on hidden cells.
- [ ] Prevent normal reveal actions from revealing flagged cells.
- [ ] Connect right-click cell interaction to flag and unflag behavior.
- [ ] Render flagged cells clearly on the board.
- [ ] Update the mine counter when flags are placed or removed.
- [ ] Reveal all mines after a loss.
- [ ] Identify incorrectly flagged cells after a loss.
- [ ] Verify `npm test`, `npm run build`, and a manual preview smoke test for flagging, counter updates, loss mine reveal, and wrong-flag display.
- [ ] Refresh `TODO.md` with the approved Phase 6 entries before implementing chord interaction.

### Exit criteria for moving items to `DONE.md`

- The model flag item can move only when unit tests cover flag and unflag transitions.
- The reveal-prevention item can move only when tests prove flagged cells are not revealed by normal reveal.
- The right-click item can move only when browser smoke testing confirms right-click toggles flags without opening the context menu on cells.
- The render item can move only when flagged cells are visibly distinct.
- The counter item can move only when counter behavior matches the Phase 1 decision and is tested.
- The mine-reveal item can move only when loss state displays all mines.
- The wrong-flag item can move only when incorrect flags are visually identifiable after loss.
- The verification item can move only when listed checks pass.
- The `TODO.md` refresh item can move only when Phase 6 entries are present.

## Phase 6: Chord Interaction Is Correct and Isolated

### Goal

Implement chord interaction for revealed numbered cells according to the confirmed desktop trigger behavior.

### Scope

- Add model-level chord action for revealed numbered cells.
- Require adjacent flag count to match the displayed number before revealing neighboring hidden cells.
- Reveal adjacent non-flagged hidden cells when chord conditions are met.
- Do nothing when adjacent flag count does not match.
- End in loss if chord reveals a mine.
- Connect the confirmed browser trigger to the UI.
- Preserve end-state freezing.
- Refresh `TODO.md` with Phase 7 entries after this phase is reviewed.

### Expected files to change

- `src/game/actions.js`
- `src/game/selectors.js`
- `src/ui/controller.js`
- `src/ui/renderBoard.js`
- `src/styles.css` if chord hover or active state needs visible feedback
- `tests/unit/chord-rules.test.js`
- `tests/unit/ui-controller.test.js`
- `README.md` if the chord trigger needs user-facing documentation
- `TODO.md`
- `DONE.md`

### Dependencies

- Depends on Phase 5 completion.
- Depends on Phase 1 chord trigger decision.
- Upstream dependency: the browser input approach must work reliably in Chrome, Firefox, and Edge for desktop use.
- Intra-project dependency: flags and mine reveal behavior must already be correct.
- Blocker: this phase cannot start if `REQUIREMENTS.md` no longer locks chord trigger semantics.

### Risks

- High risk compared with other features because chord behavior combines revealed cells, numbers, flags, hidden neighbors, mines, and loss conditions.
- Main failure modes are revealing neighbors when flag count does not match, ignoring incorrect flags that should cause loss, triggering chord unintentionally, or allowing chord after game end.

### Tests and checks to run

- `npm test`
- `npm run build`
- Unit tests for matching flag count, mismatched flag count, safe chord reveal, mine-revealing chord loss, revealed-number-only restriction, and frozen end state.
- Manual browser smoke test with `npm run preview`: trigger chord with correct flags, trigger chord with insufficient flags, trigger chord with incorrect flags that reveal a mine, and attempt chord after win/loss.
- `git diff --check`

### Review check before moving work to `DONE.md`

- Confirm the phase outcome matches the stated goal and scope.
- Review model code carefully for all chord preconditions before any reveal cascade occurs.
- Confirm requirement traceability to FR-14, FR-15, FR-16, and FR-17.
- Review regression risk around flag count, mine loss, flood reveal interaction, and post-game freezing.
- Confirm docs are updated if the trigger behavior is not obvious from the UI.
- Confirm scope creep did not add hints, auto-solve, accessibility shortcuts beyond scope, or extra interaction modes.
- Confirm unfinished follow-up work has been written back to `TODO.md`.

### Exact `TODO.md` entries to refresh from this phase

- `Phase 6 - Chord Interaction Is Correct and Isolated`
- [ ] Add model-level chord action for revealed numbered cells only.
- [ ] Require matching adjacent flag count before chord reveals neighboring cells.
- [ ] Reveal adjacent non-flagged hidden cells when chord conditions are satisfied.
- [ ] Leave the board unchanged when chord flag count does not match the revealed number.
- [ ] End the game in a loss when chord reveals a mine.
- [ ] Connect the approved desktop browser chord trigger in the UI.
- [ ] Add unit tests for all chord success, no-op, loss, restriction, and frozen-state cases.
- [ ] Verify `npm test`, `npm run build`, and a manual preview smoke test for chord behavior.
- [ ] Refresh `TODO.md` with the approved Phase 7 entries before implementing timer completion work.

### Exit criteria for moving items to `DONE.md`

- The model chord item can move only when chord is unavailable for hidden, flagged, mine, and zero cells unless requirements explicitly allow otherwise.
- The matching-count item can move only when tests prove the adjacent flag count gate.
- The reveal-neighbor item can move only when tests prove only adjacent non-flagged hidden cells are revealed.
- The no-op item can move only when mismatched flag count leaves board state unchanged.
- The chord-loss item can move only when tests prove a mine revealed through chord causes loss.
- The UI trigger item can move only when manual browser testing confirms the approved trigger works.
- The unit-test item can move only when all chord test categories pass.
- The verification item can move only when listed checks pass.
- The `TODO.md` refresh item can move only when Phase 7 entries are present.

## Phase 7: Timer and End-State Controls Are Complete

### Goal

Complete the active-play timer and final reset/end-state control behavior.

### Scope

- Start the timer when gameplay begins according to the first interaction rule.
- Stop the timer on win or loss.
- Reset timer value when a new game starts.
- Keep timer visible before, during, and after play.
- Confirm reset control works after win, loss, and in-progress games.
- Add optional reset keyboard shortcut only if Phase 1 or `REQUIREMENTS.md` keeps it in scope.
- Refresh `TODO.md` with Phase 8 entries after this phase is reviewed.

### Expected files to change

- `src/ui/timer.js`
- `src/ui/controller.js`
- `src/ui/statusView.js`
- `src/ui/renderBoard.js` if reset state rendering needs adjustment
- `src/styles.css`
- `tests/unit/timer.test.js`
- `tests/unit/reset-flow.test.js`
- `README.md` if reset shortcut is implemented
- `TODO.md`
- `DONE.md`

### Dependencies

- Depends on Phase 6 completion.
- Upstream dependency: browser timer APIs must be wrapped so tests can use fake timers or deterministic clock control.
- Intra-project dependency: win, loss, reset, difficulty selection, flagging, and chord behavior must already be connected.
- Blocker: optional reset shortcut must not be implemented unless it remains explicitly allowed and small in scope.

### Risks

- Medium risk: timer behavior can create flaky tests and subtle end-state bugs.
- Main failure modes are timer starting too early, continuing after game end, not resetting between games, or creating multiple intervals after repeated resets.

### Tests and checks to run

- `npm test`
- `npm run build`
- Unit tests with fake timers or deterministic timer control.
- Manual browser smoke test with `npm run preview`: timer starts on first gameplay action, stops on win/loss, resets on reset, and does not duplicate intervals.
- `git diff --check`

### Review check before moving work to `DONE.md`

- Confirm the phase outcome matches the stated goal and scope.
- Review timer lifecycle code for interval cleanup and deterministic tests.
- Confirm requirement traceability to FR-24, FR-25, FR-26, and FR-29.
- Review regression risk around reset, difficulty changes, and end-state freezing.
- Confirm docs are updated if a reset keyboard shortcut is included.
- Confirm scope creep did not add statistics, best times, persistence, or extra shortcuts.
- Confirm unfinished follow-up work has been written back to `TODO.md`.

### Exact `TODO.md` entries to refresh from this phase

- `Phase 7 - Timer and End-State Controls Are Complete`
- [ ] Add timer lifecycle code that starts when gameplay begins.
- [ ] Stop the timer when the game reaches win or loss state.
- [ ] Reset the timer whenever a new game starts.
- [ ] Keep the timer visible before, during, and after play.
- [ ] Verify reset control behavior for in-progress, won, and lost games.
- [ ] Add the optional reset keyboard shortcut only if it remains approved in `REQUIREMENTS.md`.
- [ ] Add unit tests for timer start, stop, reset, and interval cleanup behavior.
- [ ] Verify `npm test`, `npm run build`, and a manual preview smoke test for timer and reset behavior.
- [ ] Refresh `TODO.md` with the approved Phase 8 entries before final visual presentation work.

### Exit criteria for moving items to `DONE.md`

- The timer-start item can move only when tests or manual evidence show the timer starts on the approved gameplay trigger.
- The timer-stop item can move only when win and loss both stop the timer.
- The timer-reset item can move only when new games reset displayed and internal timer state.
- The visibility item can move only when the timer remains visible in all lifecycle states.
- The reset-control item can move only when reset works during active play, after win, and after loss.
- The shortcut item can move only when `REQUIREMENTS.md` explicitly allows it and the shortcut is tested or manually verified.
- The timer-test item can move only when lifecycle and cleanup tests pass.
- The verification item can move only when listed checks pass.
- The `TODO.md` refresh item can move only when Phase 8 entries are present.

## Phase 8: Desktop Presentation and Basic Accessibility Are Reviewable

### Goal

Bring the single-screen game presentation to a readable desktop-ready v1 standard without changing core gameplay.

### Scope

- Apply the approved retro-modern visual direction.
- Make cell states visually clear: hidden, hover, revealed, numbered values, flagged, mine, wrong flag, win, and loss.
- Keep board, timer, mine counter, difficulty controls, reset control, and outcome message visible on the main screen.
- Ensure layout remains readable at common desktop browser sizes.
- Add basic accessibility considerations through contrast, focus visibility for controls, semantic labels where practical, and clear state differentiation.
- Avoid mobile-first redesign or touch-specific interaction work.
- Refresh `TODO.md` with Phase 9 entries after this phase is reviewed.

### Expected files to change

- `index.html`
- `src/styles.css`
- `src/ui/renderBoard.js`
- `src/ui/statusView.js`
- `src/ui/counterView.js`
- `src/ui/timer.js`
- `tests/unit/render-board.test.js` if markup semantics change
- `README.md` if visual or accessibility notes are needed
- `TODO.md`
- `DONE.md`

### Dependencies

- Depends on Phase 7 completion.
- Depends on Phase 1 visual style and feedback decisions.
- Upstream dependency: target desktop browsers are current major Chrome, Firefox, and Edge.
- Intra-project dependency: all core gameplay UI states must already exist.
- Blocker: if `REQUIREMENTS.md` no longer locks the visual direction, decide it before editing CSS.

### Risks

- Medium risk: presentation work can accidentally change gameplay hit targets, obscure state, or create layout issues for larger boards.
- Main failure modes are unreadable number colors, controls moving off-screen on expert board size, state colors relying only on subtle differences, and hover/focus styles shifting cell dimensions.

### Tests and checks to run

- `npm test`
- `npm run build`
- Manual browser smoke test with `npm run preview`.
- Manual UX checks at common desktop widths, including a large preset board.
- Manual accessibility checks for readable contrast, visible focus states on controls, semantic button/select labels, and no incoherent overlap.
- `git diff --check`

### Review check before moving work to `DONE.md`

- Confirm the phase outcome matches the stated goal and scope.
- Review CSS and markup for stable board dimensions and clear state mapping.
- Confirm requirement traceability to UI acceptance criteria and NFR-04, NFR-05, NFR-06, NFR-09, and NFR-11.
- Review regression risk by replaying reveal, flag, chord, reset, timer, win, and loss flows after styling.
- Confirm documentation is updated if visual states need explanation for reviewers.
- Confirm scope creep did not add themes, animations beyond small feedback, sound, mobile-specific UI, or non-required settings.
- Confirm unfinished follow-up work has been written back to `TODO.md`.

### Exact `TODO.md` entries to refresh from this phase

- `Phase 8 - Desktop Presentation and Basic Accessibility Are Reviewable`
- [ ] Apply the approved retro-modern visual direction in `src/styles.css`.
- [ ] Style hidden, hover, revealed, numbered, flagged, mine, wrong-flag, win, and loss states clearly.
- [ ] Keep board, timer, mine counter, difficulty controls, reset control, and outcome message visible on the main screen.
- [ ] Verify the layout at common desktop browser sizes, including the largest preset board.
- [ ] Add practical semantic labels, focus visibility, contrast, and state differentiation improvements.
- [ ] Verify `npm test`, `npm run build`, manual preview smoke testing, manual UX checks, and manual accessibility checks.
- [ ] Refresh `TODO.md` with the approved Phase 9 entries before adding end-to-end smoke coverage.

### Exit criteria for moving items to `DONE.md`

- The visual-direction item can move only when the applied CSS matches the Phase 1 decision.
- The state-style item can move only when every required cell and outcome state is visually distinguishable.
- The visibility item can move only when all essential UI elements remain visible on the main screen.
- The desktop-layout item can move only when common desktop sizes and the largest board have been manually checked.
- The accessibility item can move only when focus, contrast, labels, and state differentiation checks are complete.
- The verification item can move only when all listed checks pass.
- The `TODO.md` refresh item can move only when Phase 9 entries are present.

## Phase 9: End-to-End Smoke Coverage Protects the Full Game

### Goal

Add browser-level smoke tests that verify the complete playable v1 flows.

### Scope

- Add Playwright configuration and npm script if Phase 1 approved Playwright.
- Add end-to-end tests for initial load, difficulty selection, reveal, flag/unflag, reset, timer start, loss feedback, and frozen end-state behavior.
- Add deterministic test hooks only if they do not leak into player-facing behavior.
- Add at least one controlled win-path test if the app can expose a test-safe board setup without adding product scope.
- Document how to run end-to-end tests.
- Refresh `TODO.md` with Phase 10 entries after this phase is reviewed.

### Expected files to change

- `package.json`
- `package-lock.json`
- `playwright.config.js`
- `tests/e2e/minesweeper.spec.js`
- `tests/e2e/fixtures/` if deterministic boards need fixture data
- `src/game/` files only if test-safe hooks are needed
- `src/ui/` files only if stable selectors need adjustment
- `README.md`
- `TODO.md`
- `DONE.md`

### Dependencies

- Depends on Phase 8 completion.
- Upstream dependency: Playwright browser dependencies must be installable in the development environment or CI.
- Intra-project dependency: the full UI must already be playable and styled.
- Blocker: if Playwright is rejected in Phase 1, replace this phase with equivalent manual and unit-level smoke validation before implementation starts.

### Risks

- Medium risk: end-to-end tests can become flaky if they depend on random boards or real-time timer seconds.
- Main failure modes are relying on uncontrolled random mine placement, unstable selectors, timing-sensitive assertions, and adding test hooks that change production behavior.

### Tests and checks to run

- `npm test`
- `npm run build`
- `npm run test:e2e` or `npx playwright test`
- Manual browser smoke test with `npm run preview` after end-to-end tests pass.
- `git diff --check`

### Review check before moving work to `DONE.md`

- Confirm the phase outcome matches the stated goal and scope.
- Review test selectors and fixtures for stability and no product behavior leakage.
- Confirm requirement traceability to product-level acceptance criteria and core gameplay acceptance criteria.
- Review regression risk around randomness, timers, and end states.
- Confirm `README.md` documents the end-to-end test command.
- Confirm scope creep did not add hidden gameplay features just to make tests easier.
- Confirm unfinished follow-up work has been written back to `TODO.md`.

### Exact `TODO.md` entries to refresh from this phase

- `Phase 9 - End-to-End Smoke Coverage Protects the Full Game`
- [ ] Add Playwright configuration and an end-to-end test npm script if Playwright remains approved.
- [ ] Add an end-to-end smoke test for initial app load and visible essential controls.
- [ ] Add an end-to-end smoke test for difficulty selection and reset.
- [ ] Add an end-to-end smoke test for reveal, flag, unflag, and timer start behavior.
- [ ] Add an end-to-end smoke test for loss feedback, mine reveal, wrong-flag display, and frozen interaction.
- [ ] Add a controlled win-path smoke test if it can be done without product-scope leakage.
- [ ] Document the end-to-end test command in `README.md`.
- [ ] Verify `npm test`, `npm run build`, `npm run test:e2e` or `npx playwright test`, and manual preview smoke testing.
- [ ] Refresh `TODO.md` with the approved Phase 10 entries before release verification.

### Exit criteria for moving items to `DONE.md`

- The Playwright-config item can move only when the configured command runs locally.
- The initial-load item can move only when the test verifies board, timer, mine counter, difficulty controls, reset control, and status area presence.
- The difficulty/reset item can move only when the test proves preset switching and same-screen reset behavior.
- The reveal/flag/timer item can move only when the test verifies these interactions through the browser.
- The loss/frozen item can move only when the test verifies loss feedback, mines, wrong flags, and blocked post-loss interaction.
- The win-path item can move only when it is deterministic and does not alter player-facing scope.
- The README item can move only when documented commands match package scripts.
- The verification item can move only when listed checks pass.
- The `TODO.md` refresh item can move only when Phase 10 entries are present.

## Phase 10: Static Release Artifact Is Verifiable

### Goal

Prepare and verify the static release artifact for the confirmed deployment target.

### Scope

- Confirm production build output is generated in the expected folder.
- Preview the built artifact locally.
- Add static-host deployment configuration only if Phase 1 confirmed a static host.
- Keep cloud-specific or app-store-specific deployment out of scope unless Phase 1 changed the deployment target.
- Document release build and preview steps.
- Refresh `TODO.md` with Phase 11 entries after this phase is reviewed.

### Expected files to change

- `package.json`
- `vite.config.js`
- `.github/workflows/deploy.yml` only if GitHub Pages is selected
- `netlify.toml` only if Netlify is selected
- `vercel.json` only if Vercel needs explicit configuration
- `public/` or `src/assets/` only if final static assets are required
- `README.md`
- `TODO.md`
- `DONE.md`

### Dependencies

- Depends on Phase 9 completion.
- Depends on Phase 1 deployment target decision.
- Upstream dependency: selected static host requirements, if any.
- Intra-project dependency: all v1 functionality and smoke coverage must be complete before release configuration.
- Blocker: deployment configuration cannot be added until the target is confirmed.

### Risks

- Low to medium risk: static builds are simple, but incorrect base paths or output directories can break hosted deployment.
- Main failure modes are missing build assets, wrong Vite `base`, unverified preview output, or adding deployment files for an unconfirmed platform.

### Tests and checks to run

- `npm test`
- `npm run build`
- `npm run preview`
- `npm run test:e2e` or `npx playwright test` if end-to-end tests exist.
- Manual production-preview smoke test for load, reveal, flag, chord, timer, reset, win/loss feedback, and largest board layout.
- Deployment verification command or dashboard check if a static host is configured.
- `git diff --check`

### Review check before moving work to `DONE.md`

- Confirm the phase outcome matches the stated goal and scope.
- Review deployment or release files for the confirmed target only.
- Confirm requirement traceability to NFR-01, NFR-02, NFR-10, and project setup requirements.
- Review regression risk around production build paths and hosted static asset loading.
- Confirm `README.md` has accurate release, build, preview, and deployment instructions.
- Confirm scope creep did not add backend infrastructure, SSR, cloud functions, accounts, or unrequested hosting platforms.
- Confirm unfinished follow-up work has been written back to `TODO.md`.

### Exact `TODO.md` entries to refresh from this phase

- `Phase 10 - Static Release Artifact Is Verifiable`
- [ ] Verify the production build output is generated by `npm run build`.
- [ ] Verify the built app with `npm run preview`.
- [ ] Add deployment configuration only for the Phase 1 confirmed static host.
- [ ] Document release build, preview, and deployment steps in `README.md`.
- [ ] Run full release checks: `npm test`, `npm run build`, production preview smoke test, and `npm run test:e2e` or `npx playwright test` if available.
- [ ] Complete deployment verification if a static host is in scope.
- [ ] Refresh `TODO.md` with the approved Phase 11 entries before final stabilization.

### Exit criteria for moving items to `DONE.md`

- The build-output item can move only when `npm run build` succeeds and the expected output folder exists.
- The preview item can move only when the built app loads through `npm run preview`.
- The deployment-config item can move only when the config matches the confirmed host and has been reviewed.
- The README item can move only when documented release steps match actual commands.
- The release-check item can move only when all required checks pass.
- The deployment-verification item can move only when the hosted or local release target has been verified, or when `REQUIREMENTS.md` explicitly says local-only.
- The `TODO.md` refresh item can move only when Phase 11 entries are present.

## Phase 11: Final Stabilization and Documentation Are Complete

### Goal

Complete final validation, requirement traceability, documentation cleanup, and `TODO.md` to `DONE.md` reconciliation for v1.

### Scope

- Run the full test, build, preview, and end-to-end validation set.
- Review all acceptance criteria in `REQUIREMENTS.md` against implemented behavior.
- Confirm all non-goals remain out of scope.
- Update `README.md` with final usage and verification instructions.
- Update `REQUIREMENTS.md` only if accepted scope or acceptance criteria changed during delivery.
- Ensure `TODO.md` contains no completed items and only legitimate future follow-up if any.
- Ensure `DONE.md` contains only reviewed and verified work.
- Prepare a final review summary.

### Expected files to change

- `README.md`
- `REQUIREMENTS.md` only if accepted scope changed
- `IMPLEMENTATION_PLAN.md` only if the final phase ordering or gates changed
- `TODO.md`
- `DONE.md`
- Any test files that need small stabilization fixes: `tests/unit/*.test.js`, `tests/e2e/*.spec.js`
- Any source files that need small bug fixes found during stabilization: `src/game/*.js`, `src/ui/*.js`, `src/styles.css`

### Dependencies

- Depends on Phase 10 completion.
- Upstream dependency: all selected tools and deployment target checks must be runnable.
- Intra-project dependency: every planned v1 feature phase must be reviewed or explicitly deferred in `TODO.md`.
- Blocker: unresolved acceptance criteria failures must be fixed in the responsible earlier phase area before final completion.

### Risks

- Medium risk: final stabilization can expose hidden incomplete work that should not be hidden as polish.
- Main failure modes are moving unverified work to `DONE.md`, leaving stale `TODO.md` entries, skipping acceptance traceability, or accepting flaky tests as good enough.

### Tests and checks to run

- `npm test`
- `npm run build`
- `npm run preview`
- `npm run test:e2e` or `npx playwright test` if end-to-end tests exist.
- Manual acceptance pass against `REQUIREMENTS.md`.
- Manual desktop UX pass in Chrome, Firefox, and Edge if available.
- Manual production-preview or deployment smoke test.
- `git diff --check`

### Review check before moving work to `DONE.md`

- Confirm the phase outcome matches the stated goal and scope.
- Review any final code changes as bug fixes only, not new feature work.
- Confirm requirement traceability for all product-level, gameplay, and UI acceptance criteria.
- Review regression risk by running the full validation set after any final fix.
- Confirm `README.md`, `TODO.md`, `DONE.md`, and `REQUIREMENTS.md` are current.
- Confirm scope creep did not add out-of-scope systems or leave undocumented future work.
- Confirm unfinished follow-up work has been written back to `TODO.md`.

### Exact `TODO.md` entries to refresh from this phase

- `Phase 11 - Final Stabilization and Documentation Are Complete`
- [ ] Run the full validation set: `npm test`, `npm run build`, production preview, and `npm run test:e2e` or `npx playwright test` if available.
- [ ] Complete a manual acceptance pass against every product-level, gameplay, and UI acceptance criterion in `REQUIREMENTS.md`.
- [ ] Complete a manual desktop UX pass in Chrome, Firefox, and Edge if available.
- [ ] Update `README.md` with final setup, play, test, build, preview, and deployment instructions.
- [ ] Update `REQUIREMENTS.md` only for accepted scope or acceptance-criteria changes discovered during delivery.
- [ ] Move only reviewed and verified completed work to `DONE.md`.
- [ ] Leave only legitimate unfinished follow-up work in `TODO.md`, with no completed items remaining there.
- [ ] Prepare a final review summary with validation evidence and any remaining known limitations.

### Exit criteria for moving items to `DONE.md`

- The full-validation item can move only when all configured automated checks and production-preview checks pass.
- The acceptance-pass item can move only when each relevant `REQUIREMENTS.md` acceptance criterion is checked against the app.
- The desktop-UX item can move only when target browser checks are completed or unavailable browsers are explicitly noted.
- The README item can move only when instructions match the final scripts and deployment target.
- The requirements-update item can move only when requirements are either confirmed unchanged or updated for accepted scope changes.
- The `DONE.md` item can move only when each completed item has review and validation evidence.
- The `TODO.md` item can move only when completed work has been removed and remaining entries are true follow-ups.
- The final-summary item can move only when it includes validation evidence and known limitations, if any.

# Dependency notes

- Phase 1 is the gate for all product and technical decisions.
- Phase 2 must complete before source implementation because later phases depend on stable scripts and file structure.
- Phase 3 must complete before UI work because UI slices should consume tested model behavior instead of duplicating rules.
- Phase 5 must complete before Phase 6 because chord behavior depends on flags and mine/loss rendering.
- Phase 8 must wait until gameplay UI states exist so styling can verify real states instead of mock states.
- Phase 9 should wait until the full game is playable to avoid brittle end-to-end tests against partial behavior.
- Phase 10 should wait until automated and manual smoke coverage is in place.
- Phase 11 must remain last and may not be used to hide unfinished core gameplay work.
- Styling and documentation can be split into smaller review chunks only after their dependent gameplay phase is complete and only if the file changes remain independent.
- Deployment configuration is parallelizable only with final documentation after Phase 9, and only if the selected deployment files do not overlap with active gameplay fixes.

# Review policy

Each phase should fit one focused review cycle. As a rule of thumb, a reviewable phase should have one primary outcome, a small set of related files, passing checks, and `TODO.md` entries that can be verified independently.

A phase must be split before implementation starts if it:

- mixes unrelated deliverables such as tooling plus gameplay, or gameplay plus deployment;
- cannot be reviewed without scanning broad source, test, docs, and config changes at once;
- changes more than one risky subsystem such as game rules, input handling, timer lifecycle, deployment, or test infrastructure;
- contains `TODO.md` entries that cannot be individually verified;
- requires decisions that are not already captured as blockers.

Oversized phases are not allowed to proceed unchanged. If a phase grows during implementation, stop, update `IMPLEMENTATION_PLAN.md`, refresh `TODO.md`, and review the split before continuing.

Before any item moves to `DONE.md`, the reviewer must confirm:

- the implemented outcome matches the phase goal and scope;
- relevant checks passed;
- requirement traceability is clear;
- regression risk was considered;
- documentation is current;
- no accidental scope creep was introduced;
- unfinished follow-up work is recorded in `TODO.md`.

# Definition of done for the plan

The overall project is complete when:

- all mandatory v1 requirements in `REQUIREMENTS.md` are implemented or explicitly revised through an accepted requirements update;
- the game runs as a single-page static browser app with no backend dependency;
- exactly three difficulty presets are available;
- reveal, flag, chord, first-click safety, adjacency numbers, flood reveal, win, loss, frozen end states, mine reveal, and wrong-flag display work as specified;
- timer, mine counter, difficulty selector, reset control, board, and in-place outcome message are visible on the main screen;
- the app remains readable and usable at common desktop browser sizes;
- `npm test` passes;
- `npm run build` succeeds;
- production preview through `npm run preview` has been smoke-tested;
- end-to-end checks pass if Playwright or equivalent e2e coverage is added;
- deployment verification is complete for the confirmed target, or local-only release is explicitly documented;
- `README.md` contains final setup, play, test, build, preview, and deployment instructions;
- `TODO.md` contains only legitimate future follow-up work, if any;
- `DONE.md` contains only reviewed and verified completed work;
- final review confirms no out-of-scope systems were added.

# Phase 1 locked decisions

Phase 1 records these decisions in `REQUIREMENTS.md`:

- V1 uses npm, Vite, vanilla JavaScript modules, HTML, CSS, Vitest, and later Playwright for end-to-end smoke coverage.
- V1 has exactly three presets: Beginner 9x9 with 10 mines, Intermediate 16x16 with 40 mines, and Expert 16x30 with 99 mines.
- The mine counter displays `mine count minus placed flag count` and may go negative.
- The desktop chord trigger is simultaneous primary and secondary mouse buttons on an already revealed numbered cell.
- Compact status copy is `Ready.`, `Playing.`, `You cleared the board.`, and `Mine hit. Try again.`.
- The visual direction is mixed retro-modern.
- The v1 deployment target is local-only static build verification.

# Open questions

Non-blocking unknowns that must be resolved before their dependent phase:

- Should the optional reset keyboard shortcut be included, or left out for v1 simplicity?
- Which desktop browsers are available for final manual verification on the development machine?
- Should deterministic test hooks be exposed only in test builds, or can fixed board fixtures be tested entirely at the model level?
