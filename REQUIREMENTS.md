# REQUIREMENTS

## 1. Product Summary

This project is a small, single-page web application that recreates the core gameplay of classic Minesweeper. The game is intended to remain close to the original experience while keeping scope, interface complexity, and implementation overhead low.

The player interacts with a grid of hidden cells, attempting to reveal all non-mine cells without revealing a mine. The game is designed as a desktop-first, static single-screen experience with classic mouse-based controls, a timer, a mine counter, a reset control, and three preset difficulty levels.

The intended player experience is familiar, focused, readable, replayable, and faithful to the original Minesweeper formula without unnecessary additional systems.

## 2. Product Goals

- Deliver a faithful Minesweeper-style game experience in a small one-page web app.
- Preserve the core identity and decision-making of classic Minesweeper.
- Keep the interface on a single static screen without navigation to separate pages.
- Maintain simple scope and avoid feature creep.
- Support replayable puzzle gameplay through preset difficulty levels.
- Provide desktop-first controls that closely match the original interaction model.
- Include a small number of justified usability improvements where they reduce frustration without changing the core game.

## 3. Non-Goals / Out of Scope

The following are explicitly out of scope for v1:

- Story mode
- Campaign mode
- Progression systems
- Experience, levels, unlocks, currencies, or rewards
- Multiplayer or online play
- User accounts, profiles, or cloud saves
- Multi-page flows or screen navigation
- Power-ups or special abilities
- Alternate tile types or special mechanics
- Procedural modes beyond standard random mine placement
- Guaranteed logically solvable boards without guessing
- Animated-heavy redesigns
- Custom skins or theme systems
- Map editor or custom board editor
- Mobile-first redesign
- Full touch interaction support
- Accessibility beyond a practical basic level
- Sound effects or music
- Hint systems
- Undo or rewind systems
- Daily challenge systems
- Achievements or statistics beyond what is explicitly required
- Social sharing features
- Save/load game state across sessions

## 4. Core Gameplay Requirements

### Mandatory Requirements

- The game shall use a rectangular grid of hidden cells.
- The game shall support three preset difficulty levels.
- Each new game shall place mines randomly on the board according to the selected difficulty.
- The player shall reveal cells using the primary mouse action.
- The player shall place and remove flags using the secondary mouse action.
- Revealed non-mine cells shall display the number of adjacent mines when at least one adjacent mine exists.
- Revealed cells with zero adjacent mines shall trigger automatic flood reveal of connected zero-value cells and their bordering numbered cells.
- Revealing a mine shall immediately end the game as a loss.
- The player shall win when all non-mine cells have been revealed.
- The first reveal action shall never reveal a mine.
- The board shall remain on the same screen after win or loss.
- After win or loss, the board shall stop accepting gameplay interactions.
- After loss, all mines shall be shown and incorrectly flagged cells shall be identifiable.
- After win or loss, a compact win/loss message shall appear on the same screen.
- A reset control shall allow the player to start a new game.

### Optional Requirements

These may be included only if they remain small in scope and do not alter the core experience:

- Visual styling that partially references classic Windows Minesweeper while using a cleaner modern presentation
- Hover feedback on interactive cells
- Keyboard shortcut for reset

### Locked V1 Decisions

Phase 1 locks the following decisions for v1. Later implementation phases must treat these as requirements unless this document is deliberately changed.

| Decision Area | Locked V1 Decision |
| --- | --- |
| App stack | Static single-page app using vanilla JavaScript modules, HTML, and CSS with Vite. |
| Package manager | npm, with `package-lock.json` committed once dependencies are installed. |
| Unit test runner | Vitest, exposed through `npm test` as a one-shot test command. |
| End-to-end runner | Playwright, introduced later for browser smoke coverage. |
| Deployment target | Local-only static build verification for v1; no hosted deployment configuration is required unless requirements change. |
| Visual direction | Mixed retro-modern presentation: classic square grid and readable number colors with cleaner modern controls. |

The v1 difficulty presets are exactly:

| ID | Label | Rows | Columns | Cells | Mines | Safe Cells |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `beginner` | Beginner | 9 | 9 | 81 | 10 | 71 |
| `intermediate` | Intermediate | 16 | 16 | 256 | 40 | 216 |
| `expert` | Expert | 16 | 30 | 480 | 99 | 381 |

The mine counter displays remaining unflagged mines as `mine count minus placed flag count`. The value may become negative when placed flags exceed the mine count, such as `10 mines - 12 flags = -2`. Over-flagging does not create mines, prevent play, or determine win/loss state.

Compact outcome feedback uses these exact messages in an inline status area near the game controls:

| Status | Message |
| --- | --- |
| Initial | `Ready.` |
| Active | `Playing.` |
| Win | `You cleared the board.` |
| Loss | `Mine hit. Try again.` |

Outcome feedback shall not use a modal, route change, alert, or replacement screen. The board, reset control, timer, mine counter, and difficulty selector remain visible after win or loss.

## 5. Interaction Requirements

- The game shall be desktop-first.
- The primary input method shall be mouse interaction.
- Left click shall reveal a hidden cell.
- Right click shall place a flag on a hidden cell.
- Right click on a flagged cell shall remove the flag.
- Chord interaction shall be supported.
- Chord interaction shall be triggered by pressing the primary and secondary mouse buttons together on an already revealed numbered cell.
- Chord interaction shall only apply to already revealed numbered cells.
- Chord interaction shall not apply to hidden cells, flagged cells, unrevealed mines, or revealed zero cells.
- When chord is triggered on a revealed numbered cell, the game shall reveal all adjacent non-flagged hidden cells if the number of adjacent flags equals the displayed number.
- If the adjacent flags are incorrect during chord interaction and one or more adjacent unrevealed cells contain mines, the game shall end in a loss.
- Board cells may suppress the default browser context menu so right-click flagging and chord interaction work reliably.
- After a win or loss, reveal, flag, and chord actions shall no longer change the board state.
- A reset control shall be available without leaving the current screen.
- Touch input is not required for v1.
- Mobile-specific interaction patterns are not required for v1.

### Locked Interaction Decision

The supported desktop controls are left click reveal, right click flag or unflag on hidden cells, and simultaneous left-right chord on revealed numbered cells. Double-click, keyboard-only chord, touch chord, and mobile-specific chord patterns are out of scope for v1 unless requirements are changed first.

## 6. UI and Screen Requirements

- The product shall be presented as a single-page, single-screen game interface.
- The game shall not require page navigation during normal play.
- The screen shall include a visible game board.
- The screen shall include a visible timer.
- The screen shall include a visible mine counter.
- The screen shall include a visible reset control.
- The screen shall include a visible method to select one of three preset difficulties.
- Win and loss feedback shall appear on the same screen without replacing the game with a separate page.
- Initial, active, win, and loss statuses shall use the locked copy from Section 4.
- Status feedback shall appear inline near the board controls, not in a modal or alert.
- The board and essential controls shall remain visible after win or loss.
- The layout shall be designed primarily for desktop use.
- The layout shall remain readable at typical desktop browser sizes.
- The UI may blend classic and modern styling, but gameplay readability shall take priority over decorative styling.

### Locked UI Decision

The v1 interface shall use a mixed retro-modern style: classic square cells, clear mine/flag/number states, and a restrained modern control area. Full pixel-perfect retro recreation, theme systems, and animated-heavy redesigns remain out of scope.

## 7. Functional Requirements

- **FR-01:** The system shall display a rectangular game board composed of hidden cells.
- **FR-02:** The system shall support exactly three preset difficulty levels selectable by the player: Beginner, Intermediate, and Expert using the locked dimensions and mine counts from Section 4.
- **FR-03:** The system shall start a new game using the selected difficulty when the game is first loaded or when the player resets.
- **FR-04:** The system shall generate a mine layout randomly for each new game.
- **FR-05:** The system shall ensure that the first revealed cell is not a mine.
- **FR-06:** The system shall assign each non-mine cell a value representing the number of adjacent mines in the eight surrounding positions.
- **FR-07:** The system shall reveal a hidden cell when the player performs the primary reveal action on that cell.
- **FR-08:** The system shall end the game in a loss if the player reveals a mine.
- **FR-09:** The system shall display the numeric adjacency value for a revealed non-mine cell when that value is greater than zero.
- **FR-10:** The system shall automatically reveal connected zero-value cells and their bordering numbered cells when a zero-value cell is revealed.
- **FR-11:** The system shall allow the player to place a flag on a hidden cell using the secondary action.
- **FR-12:** The system shall allow the player to remove a flag from a flagged cell using the secondary action.
- **FR-13:** The system shall prevent a flagged cell from being revealed by a normal reveal action until the flag is removed.
- **FR-14:** The system shall support chord interaction on revealed numbered cells.
- **FR-15:** The system shall reveal all adjacent non-flagged hidden cells when chord interaction is triggered on a revealed numbered cell whose adjacent flag count matches its displayed number.
- **FR-16:** The system shall not reveal adjacent cells during chord interaction when the number of adjacent flags does not match the displayed number.
- **FR-17:** The system shall end the game in a loss if chord interaction reveals a mine.
- **FR-18:** The system shall declare the game won when all non-mine cells have been revealed.
- **FR-19:** The system shall display a visible win message when the player wins.
- **FR-20:** The system shall display a visible loss message when the player loses.
- **FR-21:** The system shall freeze board interaction after a win or loss.
- **FR-22:** The system shall reveal all mine locations when the player loses.
- **FR-23:** The system shall visually identify incorrectly flagged cells when the player loses.
- **FR-24:** The system shall display a timer during active play.
- **FR-25:** The system shall start the timer when gameplay begins.
- **FR-26:** The system shall stop the timer when the game ends.
- **FR-27:** The system shall display a mine counter during play.
- **FR-28:** The mine counter shall update when flags are placed or removed, displaying `mine count minus placed flag count` and allowing negative values.
- **FR-29:** The system shall provide a reset control that starts a new game without reloading to a different page.
- **FR-30:** The system shall keep the entire gameplay experience within a single page.
- **FR-31:** The system shall preserve gameplay clarity across all supported difficulty presets.
- **FR-32:** The system shall present all essential game elements on the main screen without requiring modal navigation or secondary screens.

## 8. Non-Functional Requirements

- **NFR-01:** The game shall load and become interactive without requiring a backend service.
- **NFR-02:** The game shall run entirely in a standard desktop web browser.
- **NFR-03:** The game shall be usable in the current major versions of Chrome, Firefox, and Edge.
- **NFR-04:** The interface shall remain readable and usable at common desktop resolutions.
- **NFR-05:** Cell state changes shall be visually clear and distinguishable.
- **NFR-06:** Numbered cells shall be visually distinguishable from one another.
- **NFR-07:** The game logic shall produce consistent rule behavior for reveal, flag, flood reveal, win, and loss conditions.
- **NFR-08:** A new game shall begin quickly enough that reset feels immediate in normal desktop browser use.
- **NFR-09:** The UI shall avoid unnecessary visual clutter and unrelated controls.
- **NFR-10:** The game shall not require account creation, installation, or external services to play.
- **NFR-11:** Basic accessibility shall be considered through readable contrast and clear state differentiation, but full accessibility compliance is not required for v1.
- **NFR-12:** The application shall maintain low overall complexity appropriate for a small solo or student project.

## 9. Acceptance Criteria

### Product-Level Acceptance Criteria

- The product runs as a one-page web app.
- The game is fully playable without navigating to another page.
- The game presents a Minesweeper-style board with hidden cells, mines, flags, and numbered reveals.
- The game supports exactly three preset difficulty levels.
- The three presets are Beginner 9x9 with 10 mines, Intermediate 16x16 with 40 mines, and Expert 16x30 with 99 mines.
- The first revealed cell is never a mine.
- Left click reveals cells.
- Right click places and removes flags.
- Chord interaction is available through simultaneous left and right mouse buttons on revealed numbered cells.
- Revealing a mine causes an immediate loss.
- Revealing all non-mine cells causes a win.
- Zero-value cells trigger correct flood reveal behavior.
- A timer is visible and functions during active play.
- A mine counter is visible and updates during play, including negative values when flags exceed mine count.
- A reset control starts a new game on the same screen.
- After losing, mines are shown and incorrect flags are identifiable.
- After winning or losing, the compact outcome message appears on the same screen using `You cleared the board.` or `Mine hit. Try again.`.
- After winning or losing, board interactions no longer affect the game state.

### Gameplay Acceptance Criteria

- Given a new game, when the player reveals the first cell, that cell is always safe.
- Given a hidden non-mine cell with a non-zero adjacency count, when revealed, the correct number is shown.
- Given a hidden zero-value cell, when revealed, all connected zero-value cells and bordering numbered cells are revealed.
- Given a hidden cell, when the player right-clicks it, the cell becomes flagged.
- Given a flagged cell, when the player right-clicks it again, the flag is removed.
- Given a revealed numbered cell with matching adjacent flag count, when the player presses the primary and secondary mouse buttons together on that cell, all adjacent non-flagged hidden cells are revealed.
- Given a revealed numbered cell without matching adjacent flag count, chord interaction reveals nothing.
- Given the player places more flags than the selected preset's mine count, the mine counter displays a negative remaining value.
- Given a mine cell is revealed, the game ends immediately in a loss.
- Given all non-mine cells have been revealed, the game ends immediately in a win.

### UI Acceptance Criteria

- The board, timer, mine counter, difficulty controls, and reset control are visible on the main screen.
- Win/loss feedback does not replace the game with a separate page.
- Win/loss feedback uses the locked inline messages and leaves the board and controls visible.
- The interface remains readable on a standard desktop browser window.

## 10. Assumptions

- The game is intended for desktop-first use.
- v1 does not need dedicated mobile or touch-friendly interaction design.
- Random mine placement is acceptable even if some boards require guessing.
- A first-click safety rule is acceptable as a small usability improvement and does not violate project intent.
- The project values gameplay faithfulness over visual perfection.
- Chord interaction is part of the intended “close to original” experience.
- The application is expected to be self-contained and not depend on user authentication or backend data.
- v1 release verification targets the local static build artifact, not a hosted deployment.

## 11. Open Questions

No open v1 questions remain after the Phase 1 decisions.

## 12. Recommended Scope Baseline

The recommended MVP is:

- One single-page desktop-first web app
- One static game screen
- Three preset difficulties
- Random mine placement
- First click guaranteed safe
- Left click reveal
- Right click flag/unflag
- Chord interaction enabled
- Timer
- Mine counter
- Reset control
- In-place win/loss feedback
- Mine reveal and wrong-flag indication on loss
- No extra systems beyond the classic core loop

This baseline is complete enough to feel like a real Minesweeper clone and restrained enough to avoid the usual tragedy where a tiny project gets bloated because someone thought “just one more feature” was harmless.

## 13. Glossary

- **Board:** The full rectangular grid of cells used for a single game.
- **Cell:** One square position on the board that may contain a mine or a safe value.
- **Mine:** A hidden losing cell. Revealing it ends the game in a loss.
- **Reveal:** The action of uncovering a hidden cell.
- **Flag:** A player marker placed on a hidden cell to indicate a suspected mine.
- **Adjacent cells:** The up to eight surrounding cells directly next to a given cell, including diagonals.
- **Numbered cell:** A revealed non-mine cell showing how many adjacent mines surround it.
- **Zero-value cell:** A revealed non-mine cell with no adjacent mines.
- **Flood reveal:** The automatic reveal of connected zero-value cells and their bordering numbered cells.
- **Chord:** An action performed on a revealed numbered cell that reveals adjacent non-flagged hidden cells when the number of adjacent flags matches the displayed number.
- **Difficulty preset:** A predefined board configuration containing a fixed board size and mine count.
- **Reset:** The action that starts a new game without leaving the current page.

## Project Setup Requirements

- The project shall include a `package.json` file in the repository root.
- The `package.json` file shall define the project's runnable commands in a consistent way.
- The `package.json` file shall include at least a `test` script so the same test command can be run every time.
- If the project uses ES module imports in JavaScript, `package.json` shall set `"type": "module"`.
- The project shall remain compatible with a plain JavaScript, static-site workflow.
- The v1 project shall use npm, Vite, vanilla JavaScript modules, HTML, CSS, and Vitest as locked in Section 4.
- Browser smoke coverage shall use Playwright when end-to-end coverage is introduced.
- Deployment verification shall be local-only for v1: `npm run build` creates the static artifact and `npm run preview` verifies it locally once Phase 2 adds those scripts.
