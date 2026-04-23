# IMPLEMENTATION_PHASE1.md

# Phase 1 Technical Implementation Blueprint: V1 Decisions Are Locked

## Purpose

This file is the surgical execution guide for Phase 1 from `IMPLEMENTATION_PLAN.md`: **V1 Decisions Are Locked**.

Phase 1 is a documentation and decision-locking phase. It must not create application source code, install dependencies, scaffold the app, or begin gameplay implementation. Its only job is to remove the unresolved product and technical decisions that block Phase 2 and later phases.

Current repository state at blueprint creation:

- `TODO.md` is empty.
- `DONE.md` is empty.
- The repository contains documentation only and no application source tree.
- `REQUIREMENTS.md` still contains unresolved decisions and open questions.
- Because no verified work is recorded in `DONE.md`, the next phase is treated as Phase 1.

If a reviewer determines that Phase 1 has already been completed elsewhere, stop before execution and update this blueprint or create the next phase blueprint instead.

## Source Documents

- `REQUIREMENTS.md`: authoritative product scope and acceptance criteria.
- `IMPLEMENTATION_PLAN.md`: phase order, Phase 1 checklist, downstream dependencies.
- `TODO.md`: currently empty, so Phase 1 checklist is sourced from the Phase 1 "Exact TODO.md entries" section in `IMPLEMENTATION_PLAN.md`.
- `DONE.md`: currently empty, so no prior phase is verified.
- `GEMINI.md`: project workflow rules.
- `AGENTS.md`: says not to edit `AGENTS.md`; project-specific context belongs in `GEMINI.md`.

## Online Reference Check

These references were checked on 2026-04-23 because tooling decisions can drift over time:

- [Vite static deployment guide](https://vite.dev/guide/static-deploy.html): confirms the local dev dependency assumption, `vite build`, `vite preview`, default `dist` output, and that preview is for local build review.
- [Vitest getting started guide](https://vitest.dev/guide/): confirms Vitest is added as a dev dependency, tests use `.test.` or `.spec.` naming by default, and `vitest run` is the one-shot command form. It currently notes Node >= 20.0.0 and Vite >= 6.0.0.
- [Playwright running tests guide](https://playwright.dev/docs/running-tests): confirms `npx playwright test` as the command-line entry point and browser project selection through `--project`.

Phase 1 should record the chosen stack and package manager in `REQUIREMENTS.md`; Phase 2 and Phase 9 should re-check official docs if exact install commands or version requirements matter during implementation.

## Recommended Decision Package

These are the proposed decisions to lock unless the reviewer or course requirements explicitly choose otherwise.

| Decision Area | Recommended V1 Decision | Rationale | Downstream Phases |
| --- | --- | --- | --- |
| App stack | Static single-page app using vanilla JavaScript modules, HTML, and CSS with Vite | Matches small static scope and avoids framework overhead | Phase 2 onward |
| Package manager | npm with committed `package-lock.json` once dependencies are installed | Aligns with Vite/Vitest docs and existing plan assumptions | Phase 2 |
| Unit test runner | Vitest, run through `npm test` as `vitest run` | One-shot test command fits review and CI-style checks | Phase 2 onward |
| End-to-end runner | Playwright, introduced later in Phase 9 | Browser smoke coverage belongs after the full UI exists | Phase 9 |
| Difficulty presets | Beginner 9x9 with 10 mines; Intermediate 16x16 with 40 mines; Expert 16x30 with 99 mines | Classic Minesweeper presets, exactly three levels | Phase 3, Phase 4, Phase 8 |
| Mine counter | Allow negative values when flags exceed mine count | Classic remaining-mines behavior and clear feedback for over-flagging | Phase 5 |
| Chord trigger | Simultaneous left and right mouse buttons on an already revealed numbered cell | Closest to original desktop Minesweeper controls | Phase 6 |
| Win/loss feedback | Compact in-place status text, no modal, board remains visible | Satisfies single-screen and compact feedback requirements | Phase 4, Phase 8 |
| Feedback copy | Win: `You cleared the board.` Loss: `Mine hit. Try again.` Initial/active text may be `Ready.` and `Playing.` | Short, readable, non-disruptive | Phase 4, Phase 7 |
| Visual direction | Mixed retro-modern: classic square grid and readable number colors with cleaner controls | Matches requirements without visual overbuild | Phase 8 |
| Deployment target | Local-only static build artifact for v1 unless the reviewer names a static host | Keeps release scope small and avoids unconfirmed host config | Phase 10 |

The implementer may ask the user to approve this package before editing documents if the project owner wants explicit confirmation. If no alternate decision is supplied, use this package to remove blockers.

## Architectural Design

### Documentation Data Model

Phase 1 does not add runtime code. It creates a stable documentation contract that later phases will implement. Use these structures when updating `REQUIREMENTS.md` and related docs.

```js
/**
 * Documentation-only schema for each locked Phase 1 decision.
 * Do not implement this as source code in Phase 1.
 */
type DecisionRecord = {
  id: string;
  title: string;
  status: 'approved' | 'recorded' | 'verified';
  decision: string;
  alternativesConsidered: string[];
  rationale: string;
  requirementRefs: string[];
  downstreamPhases: number[];
};
```

Required decision records:

```js
const REQUIRED_PHASE1_DECISIONS = [
  'stack-and-package-manager',
  'difficulty-presets',
  'mine-counter-behavior',
  'chord-trigger',
  'outcome-feedback',
  'visual-direction',
  'deployment-target'
];
```

### V1 Decision State Definitions

```js
type PhaseDecisionState =
  | 'unresolved'
  | 'proposed'
  | 'approved'
  | 'recorded-in-requirements'
  | 'verified-consistent';
```

Exit state for every Phase 1 decision: `verified-consistent`.

A decision is `verified-consistent` only when:

- the decision appears in `REQUIREMENTS.md`;
- any matching open question or unresolved-decision text is removed or marked resolved;
- `IMPLEMENTATION_PLAN.md` no longer contradicts the decision;
- the next phase entries in `TODO.md` do not depend on unresolved values;
- no application implementation files were created.

### Difficulty Preset Contract

Record this exact shape in prose or table form in `REQUIREMENTS.md`. Phase 3 will later translate it into `src/game/config.js`.

```js
type DifficultyId = 'beginner' | 'intermediate' | 'expert';

type DifficultyPreset = {
  id: DifficultyId;
  label: string;
  rows: number;
  columns: number;
  mines: number;
};

const DIFFICULTY_PRESETS = [
  { id: 'beginner', label: 'Beginner', rows: 9, columns: 9, mines: 10 },
  { id: 'intermediate', label: 'Intermediate', rows: 16, columns: 16, mines: 40 },
  { id: 'expert', label: 'Expert', rows: 16, columns: 30, mines: 99 }
];
```

Required invariants:

- Exactly three presets.
- Each `id` is stable and lowercase.
- Each `label` is player-visible.
- `rows`, `columns`, and `mines` are positive integers.
- `mines < rows * columns`.
- `mines <= rows * columns - 1` so first-click safety is always possible.
- No custom difficulty mode is introduced in v1.

### Gameplay Decision Contracts

These contracts should be recorded in `REQUIREMENTS.md` as requirements language, not implemented yet.

```js
type MineCounterMode = 'allow-negative';

type ChordTriggerMode = 'left-right-simultaneous';

type OutcomeStatus = 'ready' | 'playing' | 'won' | 'lost';

type OutcomeFeedbackCopy = {
  ready: 'Ready.';
  playing: 'Playing.';
  won: 'You cleared the board.';
  lost: 'Mine hit. Try again.';
};
```

Mine counter rule:

```js
remainingMineDisplay = mineCount - flagCount;
```

The display may be negative when `flagCount > mineCount`.

Chord trigger rule:

```js
type ChordEligibility = {
  targetCellIsRevealed: true;
  targetCellAdjacentMineCount: number; // must be > 0
  gesture: 'left-right-simultaneous';
};
```

The browser implementation in Phase 6 should treat a chord as a simultaneous primary and secondary mouse-button gesture on a cell that was already revealed and numbered before the chord action. Right-click context menu suppression is allowed on board cells to support this interaction.

### Future Function Signatures Locked By Phase 1

Do not create these functions in Phase 1. They are included to make the decisions concrete enough for later implementation.

```js
// Phase 3
export function getDifficultyPreset(id: DifficultyId): DifficultyPreset;

// Phase 5
export function getRemainingMineCount(
  mineCount: number,
  flagCount: number,
  mode: MineCounterMode
): number;

// Phase 6
export function isChordGesture(event: MouseEvent): boolean;
export function canChordCell(cell: {
  isRevealed: boolean;
  isMine: boolean;
  adjacentMines: number;
}): boolean;

// Phase 4 and Phase 7
export function getOutcomeMessage(status: OutcomeStatus): string;
```

Expected behavior from those future signatures:

- `getDifficultyPreset('expert')` returns 16 rows, 30 columns, and 99 mines.
- `getRemainingMineCount(10, 12, 'allow-negative')` returns `-2`.
- `isChordGesture(event)` returns true only for the approved left-right simultaneous gesture.
- `canChordCell(cell)` returns true only for revealed non-mine numbered cells.
- `getOutcomeMessage('won')` returns `You cleared the board.`

## File-Level Strategy

Phase 1 implementation should touch only documentation files. Do not add `package.json`, `index.html`, `src/`, `tests/`, or dependency lock files in this phase.

| File | Required Responsibility During Phase 1 |
| --- | --- |
| `REQUIREMENTS.md` | Lock the stack, package manager, presets, counter behavior, chord trigger, outcome feedback, visual direction, and deployment target. Remove or resolve matching unresolved decisions and open questions. |
| `IMPLEMENTATION_PLAN.md` | Update only if the locked decisions contradict current assumptions, blockers, expected files, or downstream phase notes. Keep phase order unchanged unless a decision requires replanning. |
| `TODO.md` | At the start of Phase 1, add Phase 1 checklist if needed. At the end, refresh it to contain only approved Phase 2 entries. |
| `DONE.md` | After review and verification, record only the completed and verified Phase 1 items. Do not pre-fill before checks pass. |
| `README.md` | Optional. Add only a short setup/stack note if it helps future contributors understand the chosen stack before Phase 2 creates scripts. |
| `GEMINI.md` | Do not edit unless the shared project workflow itself changes. Phase 1 product decisions do not require this. |
| `AGENTS.md` | Do not edit. It explicitly says not to adapt it. |
| `CLAUDE.md` | Do not edit. |
| `IMPLEMENTATION_PHASE1.md` | Planning artifact created before implementation. Update only if the reviewer asks for blueprint changes before Phase 1 starts. |

Recommended `REQUIREMENTS.md` update locations:

- Section 4, `Unresolved Decisions`: replace with resolved decisions or point to a new locked-decision section.
- Section 5, `Interaction Requirements`: add exact chord trigger wording.
- Section 6, `UI and Screen Requirements`: add exact compact outcome feedback treatment and visual direction.
- Section 7, `Functional Requirements`: add or clarify counter behavior where FR-27 and FR-28 are described.
- Section 9, `Acceptance Criteria`: ensure exact presets and counter behavior are testable.
- Section 11, `Open Questions`: remove resolved questions or rewrite as `No open v1 questions remain after Phase 1 decisions.`
- Section 12, `Recommended Scope Baseline`: align with locked deployment and tooling decisions if mentioned.

## Atomic Execution Steps

The high-level Phase 1 checklist is taken from `IMPLEMENTATION_PLAN.md` because `TODO.md` is currently empty.

### 1. Confirm the v1 stack and package manager in `REQUIREMENTS.md`

Plan:

- Use the recommended decision package unless the reviewer chooses differently: vanilla JavaScript modules, HTML, CSS, Vite, Vitest, Playwright later, npm.
- Keep the decision intentionally small: no frontend framework, no backend, no TypeScript unless explicitly approved, no router, no state library.
- Make the decision traceable to NFR-01, NFR-02, NFR-10, and NFR-12.

Act:

- In `REQUIREMENTS.md`, add a locked technical decision that states:
  - package manager is npm;
  - app foundation is Vite;
  - app source uses vanilla JavaScript modules, HTML, and CSS;
  - unit tests use Vitest;
  - browser smoke coverage may use Playwright in Phase 9;
  - no backend or frontend framework is in v1 scope.
- If `IMPLEMENTATION_PLAN.md` still calls the stack an assumption or blocker after this decision, update that wording to show it is locked.
- Do not create `package.json` or install dependencies in this phase.

Validate:

- `REQUIREMENTS.md` contains exactly one package manager decision.
- No open question remains asking what stack or package manager to use.
- `IMPLEMENTATION_PLAN.md` does not contradict the locked stack.
- `README.md`, if updated, does not document commands that do not exist yet.

### 2. Confirm the three difficulty preset names, dimensions, and mine counts in `REQUIREMENTS.md`

Plan:

- Use classic preset values:
  - Beginner: 9 rows x 9 columns, 10 mines.
  - Intermediate: 16 rows x 16 columns, 40 mines.
  - Expert: 16 rows x 30 columns, 99 mines.
- Lock stable IDs for future code: `beginner`, `intermediate`, `expert`.
- Verify each preset leaves at least one non-mine cell for first-click safety.

Act:

- Add a difficulty table to `REQUIREMENTS.md` with columns for ID, label, rows, columns, cells, mines, and safe cells.
- Update FR-02 and related acceptance criteria if needed so "three preset difficulty levels" means exactly these three.
- Remove the open question asking for exact board dimensions and mine counts.

Validate:

- The difficulty table contains exactly three rows.
- Safe-cell counts are correct:
  - Beginner: 81 cells, 10 mines, 71 safe cells.
  - Intermediate: 256 cells, 40 mines, 216 safe cells.
  - Expert: 480 cells, 99 mines, 381 safe cells.
- No custom difficulty, fourth preset, or placeholder value is introduced.
- Later phase references to "difficulty values" are no longer blockers unless the implementation plan intentionally keeps historical notes.

### 3. Confirm mine-counter behavior when placed flags exceed the mine count in `REQUIREMENTS.md`

Plan:

- Choose classic remaining-mine counter behavior: display `mineCount - flagCount`, allowing negative values.
- Make clear this is display behavior only. Placing extra flags does not create extra mines and does not by itself cause win or loss.
- Ensure Phase 5 can test this with simple arithmetic.

Act:

- Update `REQUIREMENTS.md` near FR-27 and FR-28 with the rule:
  - The mine counter displays remaining unflagged mines as `mine count minus placed flag count`.
  - The value may become negative when the player places more flags than there are mines.
- Remove the open question about negative-counter versus zero-floor behavior.
- If `IMPLEMENTATION_PLAN.md` still lists counter behavior as an unresolved Phase 1 blocker, update that note.

Validate:

- The requirement gives an example such as `10 mines - 12 flags = -2`.
- The rule does not imply that over-flagging is prevented.
- The rule does not imply that flags determine win state.
- Phase 5 exit criteria can be satisfied by testing positive, zero, and negative counter values.

### 4. Confirm browser chord trigger behavior in `REQUIREMENTS.md`

Plan:

- Choose simultaneous left and right mouse buttons on an already revealed numbered cell.
- Preserve right-click flagging for hidden cells.
- Record that the browser context menu may be suppressed on board cells so gameplay input works.
- Keep touch and mobile-specific chord patterns out of scope.

Act:

- Update `REQUIREMENTS.md` Section 5 with exact chord wording:
  - Chord is triggered by pressing primary and secondary mouse buttons together on an already revealed numbered cell.
  - Chord does not apply to hidden cells, flagged cells, unrevealed mines, or revealed zero cells.
  - Right-click alone still toggles flags on hidden cells.
  - Board cells may suppress the default browser context menu.
- Remove the open question asking for exact chord trigger behavior.
- If necessary, add a downstream implementation note for Phase 6 to avoid double-click or keyboard-only chord behavior unless separately approved.

Validate:

- The trigger is unambiguous for Chrome, Firefox, and Edge desktop testing.
- Requirements still say chord only applies to revealed numbered cells.
- No alternate gesture is added as a second product feature.
- The wording does not weaken FR-14 through FR-17.

### 5. Confirm compact win/loss feedback copy or visual treatment in `REQUIREMENTS.md`

Plan:

- Use compact inline status feedback that remains on the same screen as the board and controls.
- Choose exact copy now so Phase 4 and Phase 8 do not invent text independently.
- Keep messages short enough for a compact desktop toolbar/status area.

Act:

- Update `REQUIREMENTS.md` with:
  - Initial status copy: `Ready.`
  - Active status copy: `Playing.`
  - Win copy: `You cleared the board.`
  - Loss copy: `Mine hit. Try again.`
  - Feedback location: inline status area near the board controls, not a modal, route, alert, or replacement screen.
- Confirm the board, reset control, timer, mine counter, and difficulty selector remain visible after win or loss.
- Add or clarify the visual direction as mixed retro-modern if the unresolved visual-style question is still present.

Validate:

- Win and loss feedback is exact enough for unit or e2e assertions later.
- Requirements do not still say feedback representation is unresolved.
- The selected copy does not require animation, modal UI, audio, or navigation.
- UI acceptance criteria remain consistent with in-place feedback.

### 6. Confirm local-only or static-host deployment target in `REQUIREMENTS.md`

Plan:

- Choose local-only static release artifact for v1 unless the reviewer names a host.
- Keep Phase 10 ready to add a host-specific config only if the decision changes later.
- Avoid deployment configuration in Phase 1.

Act:

- Update `REQUIREMENTS.md` with:
  - v1 deployment target is local static build verification.
  - `npm run build` should produce a static artifact in Phase 2 and Phase 10.
  - `npm run preview` should be used to verify the production build locally once tooling exists.
  - no hosted deployment configuration is required for v1 unless requirements are later changed.
- If `IMPLEMENTATION_PLAN.md` mentions deployment as an unresolved blocker, update it to say local-only is locked.

Validate:

- Requirements clearly choose local-only or a named static host, not both.
- No `.github/workflows`, Netlify, Vercel, or other host config is introduced.
- Phase 10 remains scoped to verifying the static artifact and only adds host config if requirements change.

### 7. Refresh `TODO.md` with the approved Phase 2 entries before starting source implementation

Plan:

- After all Phase 1 decisions are recorded and verified, `TODO.md` should stop listing Phase 1 work and should list only Phase 2 execution items.
- Use the Phase 2 entries from `IMPLEMENTATION_PLAN.md` exactly unless a locked decision changes them.
- Do not move anything to `DONE.md` until Phase 1 review and checks pass.

Act:

- Replace `TODO.md` contents with:

```md
# Phase 2 - Static App Foundation Runs and Builds

- [ ] Add `package.json` with npm scripts for `test`, `build`, `preview`, and local development.
- [ ] Add Vite static app entry files in `index.html`, `src/main.js`, and `src/styles.css`.
- [ ] Add the initial `src/game/`, `src/ui/`, and `tests/unit/` structure without gameplay logic.
- [ ] Add a Vitest-backed unit-test command that runs successfully.
- [ ] Document setup, test, build, and preview commands in `README.md`.
- [ ] Verify `npm test`, `npm run build`, and `npm run preview` for the app shell.
- [ ] Refresh `TODO.md` with the approved Phase 3 entries before implementing game rules.
```

- After review, add Phase 1 completed items to `DONE.md` with verification evidence.

Validate:

- `TODO.md` contains Phase 2 entries only.
- `TODO.md` does not contain checked completed Phase 1 items.
- `DONE.md` contains Phase 1 items only after verification.
- The Phase 2 entries match the locked stack and package manager.

## Edge Case & Boundary Audit

- Empty `TODO.md`: Do not assume no work remains. Use `DONE.md` and `IMPLEMENTATION_PLAN.md` to identify the next phase.
- Stale unresolved text: If `REQUIREMENTS.md` still has `Unresolved Decisions` or open questions for Phase 1 topics, Phase 1 is not complete.
- Partial decision locking: Recording a difficulty table but leaving the open question in place creates conflicting project truth.
- Invalid preset geometry: Mine count must never equal or exceed total cells because first-click safety would become impossible.
- Preset sprawl: Do not add custom boards, additional levels, or "advanced" variants in Phase 1.
- Package manager mismatch: Do not record npm in requirements and later create `pnpm-lock.yaml` or `yarn.lock` without updating requirements.
- Tooling version drift: Vite, Vitest, and Playwright details should be checked again when installed, especially Node version requirements.
- Counter ambiguity: "Mine counter updates" is not precise enough. The document must state whether negative values are allowed.
- Over-flagging trap: Allowing negative counter values must not imply over-flagging is invalid or game-ending.
- Chord/context-menu conflict: Left-right chord requires later context-menu suppression on cells; right-click flagging must still work.
- Chord target ambiguity: Chord must be limited to cells that are already revealed and numbered before the chord gesture.
- Double-click temptation: If a later implementer uses double-click instead, they must update requirements first because double-click can accidentally chord newly revealed numbered cells.
- Feedback ambiguity: "Compact message" must include exact copy or a visual treatment precise enough for tests and review.
- Modal regression: Win/loss feedback must not replace the game screen or hide the board.
- Deployment ambiguity: "Static deploy later" is not a target. The requirement must say local-only or name the host.
- README overpromise: Do not document runnable commands in README before `package.json` exists unless clearly marked as planned.
- Source-code creep: Creating `src/`, `tests/`, or `package.json` belongs to Phase 2, not Phase 1.
- DONE.md inflation: Do not move an item to `DONE.md` until the documentation diff is reviewed and checks pass.
- Plan contradiction: If `IMPLEMENTATION_PLAN.md` still says a locked Phase 1 decision is unresolved, update the plan or document why it remains historical.

## Verification Protocol

### Manual Documentation Checks

1. Confirm `REQUIREMENTS.md` names the selected stack and package manager.
2. Confirm `REQUIREMENTS.md` contains exactly three difficulty presets with IDs, labels, rows, columns, and mines.
3. Confirm `REQUIREMENTS.md` states negative mine-counter behavior or the chosen alternative explicitly.
4. Confirm `REQUIREMENTS.md` states the exact chord trigger and its target restrictions.
5. Confirm `REQUIREMENTS.md` states exact compact win/loss feedback copy or treatment.
6. Confirm `REQUIREMENTS.md` states local-only or a named static-host deployment target.
7. Confirm the unresolved decision list and open questions no longer contain Phase 1 blockers.
8. Confirm `IMPLEMENTATION_PLAN.md` does not contradict any locked decision.
9. Confirm `TODO.md` contains only Phase 2 entries after Phase 1 is reviewed.
10. Confirm `DONE.md` contains only verified Phase 1 work and validation notes.
11. Confirm no application implementation files were added.

### Automated and Command Checks

Run these after Phase 1 document edits:

```sh
git diff --check
```

```sh
rg -n "TBD|to be decided|undecided|Exact difficulty values|Should the mine counter|What exact chord|What exact board dimensions" REQUIREMENTS.md IMPLEMENTATION_PLAN.md TODO.md README.md
```

```sh
rg -n "Phase 2 - Static App Foundation Runs and Builds" TODO.md
```

```sh
find . -maxdepth 2 -type d -name src -o -name tests
```

Expected results:

- `git diff --check` exits successfully.
- The unresolved-text search returns no active Phase 1 blockers, or every match is an intentional historical note that is clearly superseded.
- `TODO.md` contains the Phase 2 heading.
- No `src` or `tests` directory exists yet unless the reviewer explicitly changed Phase 1 scope.

Do not run `npm test`, `npm run build`, or `npm run preview` in Phase 1 unless Phase 2 tooling already exists through an approved prior change. The current repository has no `package.json`.

### Review Exit Checklist

- [ ] Stack and package manager are locked in `REQUIREMENTS.md`.
- [ ] Presets are locked in `REQUIREMENTS.md`.
- [ ] Mine-counter behavior is locked in `REQUIREMENTS.md`.
- [ ] Chord trigger is locked in `REQUIREMENTS.md`.
- [ ] Feedback copy or treatment is locked in `REQUIREMENTS.md`.
- [ ] Deployment target is locked in `REQUIREMENTS.md`.
- [ ] Visual direction is locked or explicitly deferred with no downstream blocker.
- [ ] `TODO.md` is refreshed to Phase 2.
- [ ] `DONE.md` records Phase 1 only after verification.
- [ ] `git diff --check` passes.
- [ ] No implementation files were created.

## Code Scaffolding Templates

These templates are for later phases. Do not create these files in Phase 1.

### Phase 2 `package.json` Script Shape

```json
{
  "scripts": {
    "dev": "vite",
    "test": "vitest run",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "<install in Phase 2>",
    "vitest": "<install in Phase 2>"
  }
}
```

### Phase 3 `src/game/config.js` Shape

```js
export const DIFFICULTY_PRESETS = Object.freeze({
  beginner: Object.freeze({
    id: 'beginner',
    label: 'Beginner',
    rows: 9,
    columns: 9,
    mines: 10
  }),
  intermediate: Object.freeze({
    id: 'intermediate',
    label: 'Intermediate',
    rows: 16,
    columns: 16,
    mines: 40
  }),
  expert: Object.freeze({
    id: 'expert',
    label: 'Expert',
    rows: 16,
    columns: 30,
    mines: 99
  })
});

export const MINE_COUNTER_MODE = 'allow-negative';
export const CHORD_TRIGGER_MODE = 'left-right-simultaneous';

export function getDifficultyPreset(id) {
  return DIFFICULTY_PRESETS[id] ?? null;
}
```

### Phase 4 Status Copy Shape

```js
export const OUTCOME_MESSAGES = Object.freeze({
  ready: 'Ready.',
  playing: 'Playing.',
  won: 'You cleared the board.',
  lost: 'Mine hit. Try again.'
});
```

### Phase 6 Chord Trigger Shape

```js
export function isChordMouseEvent(event) {
  return event.buttons === 3;
}
```

Later implementation must be more careful than this minimal shape: it must verify target cell state, prevent context-menu side effects, avoid duplicate flag toggles, and ignore chord attempts after win or loss.

## Phase 1 Completion Definition

Phase 1 is complete only when all of the following are true:

- Every Phase 1 decision is recorded in `REQUIREMENTS.md`.
- No Phase 1 blocker remains as an open question.
- `IMPLEMENTATION_PLAN.md` is consistent with the locked decisions.
- `TODO.md` has been refreshed with Phase 2 entries.
- `DONE.md` contains only reviewed and verified Phase 1 work.
- `git diff --check` passes.
- No application implementation has started.
