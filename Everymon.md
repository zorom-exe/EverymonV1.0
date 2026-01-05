# Everymon - Technical Bible & Handover

**Objective:** Build a robust, scalable Custom Pokémon Battle Simulator with Real-Time Multiplayer.
**Current Version:** V1.0 (Playable Prototype)

---

# 1. Core Philosophy (The "Re-Execution")
This project is a strict "second attempt" designed to avoid the pitfalls of the previous iteration.

## A. Strict Constraints
*   **Zero-Tolerance Typing:** `noImplicitAny` is mandatory. usage of `any` is forbidden unless strictly wrapping an untyped external library (like parts of `@pkmn/sim`).
*   **Engine First:** Logic drives visuals. The UI *consumes* events from the `@pkmn/sim` engine; it does not predict, mock, or fake them. If the Engine says "Miss", the UI shows "Miss".
*   **200-Line Limit:** No file may exceed 200 lines. This forces modularity (e.g., `useBattle` hook was extracted from `BattlePage`).

## B. The Architecture: Peer-to-Peer Lockstep
We do **not** have a central game server simulating the battle.
1.  **Client-Side Simulation:** Both Player 1 and Player 2 run their own instance of `@pkmn/sim` in the browser.
2.  **Deterministic Sync:** Both engines are initialized with the **SAME SEED** (fetched from DB).
3.  **Input Exchange:** Players send *commands* ("Move 1", "Switch 2") via Supabase Realtime, not *state* ("HP is 50").
4.  **Verification:** After every turn, clients exchange a **State Hash**. If they differ -> `CRITICAL DESYNC`.

---

# 2. Technical Implementation Details

## A. The "Seed" Journey (Deterministic RNG)
To ensure Player 1 and Player 2 roll the exact same Critical Hits and Damage ranges:
1.  **Creation:** When a lobby is created (`useLobby`), Postgres generates a random array of 4 numbers (via `004_add_lobby_seed.sql`).
2.  **Storage:** Saved in `public.lobbies` table column `seed` (type `numeric[]`).
3.  **Retrieval:** `BattlePage` fetches this row.
4.  **Injection:** Passed to `useBattle(seed)` -> `new BattleSystem(seed)`.
5.  **Execution:** `@pkmn/sim` uses this to initialize its internal `SFC32` PRNG.
6.  **Result:** `Math.random()` calls inside the engine return identical sequences on both machines.

## B. The Move Protocol (Indices vs Protocol)
*   **User Interface**: React uses **0-based indexing** (Array[0] is the first move).
*   **Engine Protocol**: `@pkmn/sim` uses **1-based indexing** or Strings (`move 1`, `switch 2`).
*   **The Trap**: We previously had a bug where clicking Move 1 sent `move 2`.
*   **The Fix**:
    *   `BattleControl.tsx`: Passes pure index `idx` (0, 1, 2, 3).
    *   `useBattle.ts`: Converts `idx` to `choice = 'move ' + (idx + 1)`.
    *   **Result**: Clicking the UI aligns perfectly with Engine logic.

## C. Desync Detection Mechanism
How do we know if the game broke?
1.  **Hash Generation**: `engine.generateHash()` creates a string: `${turn}:${log_length}:${last_log_line}`.
2.  **Broadcast**: `useBattle` calls `sendStateHash` after processing a turn.
3.  **Comparison**: `useMultiplayerBattle` listens for `sync_state`. The `useEffect` in `useBattle` compares `localHash === remoteHash`.
4.  **Failure State**: A red overlay "CRITICAL DESYNC" appears if they mismatch, alerting developers immediately.

---

# 3. File Structure & Responsibilities

### `src/lib/battle/engine.ts`
*   **Role**: Wrapper around `@pkmn/sim`.
*   **Key Methods**:
    *   `startBattle(p1, p2)`: Sets up teams and injects the Seed.
    *   `choose(player, choice)`: Feeds input to the engine.
    *   `updateQueue()`: Parses the raw Simulator Log (`|move|p1a...`) into structured Events for the UI.
    *   `generateHash()`: Creates the sync signature.

### `src/hooks/useBattle.ts`
*   **Role**: The Brain. Connects UI, Network, and Engine.
*   **Responsibilities**:
    *   Holds the `BattleSystem` instance (Ref/State).
    *   Manages `battleState` (reactive HP, Active Mon name) for the UI.
    *   Handles the "Waiting" logic (locking UI until opponent moves).
    *   **Crucial**: Converts UI clicks to Engine protocol strings.

### `src/hooks/useMultiplayerBattle.ts`
*   **Role**: The Network Layer.
*   **Responsibilities**:
    *   Subscribes to `battle:ROOM_CODE`.
    *   Exposes `sendMove(move)` and `lastReceivedMove`.
    *   Exposes `sendStateHash(hash)` and `lastReceivedHash`.

### `src/app/battle/page.tsx`
*   **Role**: The Orchestrator / View.
*   **Responsibilities**:
    *   Fetches User Role (P1/P2) and Seed.
    *   Renders `BattleCanvas` (Visuals) and `BattleControl` (Inputs).
    *   Toggles `SwitchMenu` and `TeamPreview` overlays.

---

# 4. Instructions for Next Agent

## Top Priority: Complex State Handlers (The "Nuance" States)
The current prototype handles the "Happy Path" (Move -> Damage -> Next Turn). It **DOES NOT** yet handle complex engine requests. The next agent **MUST** implement handlers for:

### A. Forced Switches (Fainting / U-Turn)
*   **Scenario**: Player A's Pokémon faints, or uses U-turn.
*   **Current Issue**: The UI hangs because the turn hasn't ended; the engine is waiting for `switch X`.
*   **Implementation**: Check `engine.battle.request.forceSwitch`. If true, hide Move Menu and **force open** Switch Menu.

### B. Move Availability (Disable / Encore)
*   **Scenario**: Player is holding Choice Band or is under Encore.
*   **Current Issue**: UI shows all moves as valid. Clicking invalid moves causes engine error.
*   **Implementation**: Map over `engine.p1.active[0].moves`. Read the `disabled` property. Pass this to `BattleControl` to gray out buttons.

### C. Trapping (Shadow Tag / Fire Spin)
*   **Scenario**: Player tries to switch while trapped.
*   **Current Issue**: Switch button is valid. Clicking it fails silently or errors.
*   **Implementation**: Check `engine.p1.active[0].trapped`. If true, disable the "Switch" button entirely.

### D. Multi-Turn Moves (Solar Beam)
*   **Scenario**: User is charging Solar Beam.
*   **Current Issue**: UI might re-enable buttons during the charge turn.
*   **Implementation**: Validate `request` object. If `request.wait` is true or no moves are available, keep UI locked.

### E. Team Preview Order
*   **Scenario**: The battle starts with 6 Pokémon. Players need to pick a lead and order.
*   **Current Issue**: Engine waits for `team 123456`. UI might just send `team 1` or skip.
*   **Implementation**: Implement a Drag-and-Drop UI phase before the main battle loop. Send the full permutation string.

### G. Mid-Turn Interrupts (Eject Button / Red Card)
*   **Scenario**: An item attempts to force a switch *immediately* after a hit, mid-turn.
*   **Current Issue**: UI is stuck in "Waiting" state because it thinks the turn is still processing.
*   **Implementation**: The `useBattle` loop must listen for `request` objects *continuously*. If a request arrives with `forceSwitch` mid-animation, pause the queue and show the Switch Menu.

### H. Resource Exhaustion (Struggle)
*   **Scenario**: All moves have 0 PP.
*   **Current Issue**: UI shows buttons but they error on click.
*   **Implementation**: Check `move.pp`. If all are 0, force the user to use "Struggle" (move 1, but special ID) or auto-send the Struggle command.

### I. Move Confirmation (Anti-Misclick)
*   **Scenario**: Player accidentally clicks "Fire Blast".
*   **Current Issue**: Implementation uses immediate-send, causing accidental plays.
*   **Implementation**: Instead of instant send, clicking a move should enter a "Selected" state (Visual highlight). A second "CONFIRM" button (or double-click) is required to actually commit the move. Once committed, it cannot be undone.

## Secondary Priorities

### Phase 2: Animation Implementation (Visuals)
*   Create `useBattleAnimations(queue)`.
*   Consume `engine.queue` linearly (Event -> Animation -> Wait -> Next Event).
*   **Block User Input** during playback.

### Phase 3: Win/Loss Logic
*   Listen for `type: 'win'` event.
*   Display "GAME OVER" screen.

---

# 5. Resolved Issues (Status Report)

The following issues were identified in previous sessions and have been **FIXED**:

1.  **[FIXED] Critical Syntax Error in `src/app/battle/page.tsx`**: Duplicate `refreshState` removed.
2.  **[FIXED] Type Safety Violations**: `@ts-ignore` removed. Engine types strictly defined.
3.  **[FIXED] Move Mismatch (Off-by-One)**: `BattleControl` now sends 0-based indices, `useBattle` converts to engine format.
4.  **[FIXED] Incomplete Engine Logic**: `BattleSystem` now correctly parses logs into an Event Queue.
5.  **[FIXED] Deterministic Sync**: Seed injected from DB to Engine. Desync Detection active.
6.  **[FIXED] Switching Logic**: `SwitchMenu` implemented and connected to Engine.

**Remaining Known Issues**:
*   **Supabase Config**: Local `.env` must be configured correctly or client builds fail.
*   **Mock Teams**: Still using `P1_TEAM_FULL` mock data. Needs DB integration.
