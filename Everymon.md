# Everymon - Project Overview

**Objective:** Build a robust, scalable Custom Pokémon Battle Simulator with Real-Time Multiplayer.

## Core Philosophy (The "Re-Execution")
This project is a strict "second attempt" designed to avoid the pitfalls of the previous iteration.
*   **Strict Types:** `noImplicitAny` is mandatory. No `any` types allowed.
*   **Engine First:** Logic drives visuals. The UI consumes events from the `@pkmn/sim` engine; it does not predict or mock them.
*   **Neo-Brutalist Design:** Bold, high-contrast, "ugly-cool" aesthetic. Sharp black borders, hard shadows.
*   **Code Quality:** Strict 200-line limit per file to prevent "God Classes".

## Technical Stack
*   **Frontend:** Next.js 15+ (App Router)
*   **Backend:** Supabase (Postgres, Realtime)
*   **Battle Engine:** `@pkmn/sim` (with a custom `ModdedDex` adapter)
*   **Multiplayer:** Peer-to-Peer Lockstep architecture (to prevent server lag and verified state integrity).

## Key Components
### 1. Battle Engine
*   Uses `@pkmn/sim` internally.
*   Custom Pokemon are injected via an adapter.
*   State is managed via Event Sourcing (Engine -> Event Queue -> UI Animation).
*   **Deterministic Sync:** Initialized with a shared `seed` from the database.
*   **Desync Detection:** Broadcasts state hashes after every turn to verify integrity.

### 2. Multiplayer
*   **Lobby:** Standard "Arcade" style.
*   **Sync:** Lockstep protocol. Players exchange *moves*, not state. Both sides simulate locally; if hashes mismatch, a Critical Desync error is flagged.

### 3. User Interface
*   **Design System:** Atomic components (`Button`, `Card`, `Badge`) with Neo-Brutalist styling.
*   **Visuals:** Animations are strictly coupled to the Event Queue.

## Documentation & Rules
*   **`Agent_Rulebook.md`:** Non-negotiable coding constraints (Types, File Size, Tests).
*   **`Rulebook.md`:** Game rules (6v6 Singles, Level 50, Custom Mon limits).
*   **`Vibe_Coding_Guide.md`:** Guide for the user to "drive" the development process.
*   **`Everymon Re-Execution.md`:** The master "Developer Guide" and Roadmap.

---

# Handover Status Report (Latest)

**Current State**: Full 6v6 Multiplayer Battle with Deterministic Sync.

## Completed Modules

### 1. Phase 1: Foundation
*   [x] **Environment**: Next.js 15, Turbopack, Strict TypeScript.
*   [x] **Database**: Supabase migrations applied (`profiles`, `lobbies`, `custom_pokemon`) with seed support.
*   [x] **Connectivity**: `createClient` utility hardened.

### 2. Phase 2: Battle Engine (`src/lib/battle`)
*   [x] **Core**: `BattleSystem` class wraps `@pkmn/sim`.
*   [x] **Sync Logic**: Added `generateHash()` and `seed` support for deterministic replay.
*   [x] **Team Preview**: Engine supports team preview phase and lead selection.

### 3. Phase 3: Multiplayer (`src/hooks`)
*   [x] **Lobby**: `useLobby` manages Room Creation and Joining.
*   [x] **Sync**: `useMultiplayerBattle` uses Supabase Broadcast Channels.
*   [x] **Verification**: Implemented State Hash exchange.

### 4. Phase 4: Visuals (`src/app/battle`, `src/components`)
*   [x] **Battle Page**: Refactored to use `useBattle` hook (Logic separated from View).
*   [x] **Team Preview**: UI for selecting lead Pokemon.
*   [x] **Switching**: `SwitchMenu` component integrated for mid-battle switching.
*   [x] **Move Selection**: Fixed off-by-one indexing error.

## Recent Fixes & Features (Session Summary)

### 1. Move Selection Fix
**Issue**: Clicking Move 1 resulted in Move 2 being used (off-by-one error).
**Fix**: Updated `BattleControl` to send 0-based index and `useBattle` to interpret it correctly before passing to the 1-based engine.

### 2. Switching Implementation
**Feature**: Players can now switch Pokémon during battle.
**Implementation**:
*   Created `SwitchMenu` component (pop-up modal).
*   Added `submitSwitch` to `useBattle`.
*   Integrated with `BattlePage` to toggle menu visibility.

### 3. Usage of `StandardMon` and Mock Teams
**Strategy**: To test 6v6 battles immediately without waiting for user data entry, we implemented:
*   `StandardMon` interface (strict typing for Pokemon sets).
*   `mockTeams.ts`: Two full competitive 6v6 teams (Charizard, Blastoise, Gengar, etc.) with valid moves/abilities/items.
*   The Engine uses these mocks by default until the DB adapter is fully re-integrated.

### 4. Deterministic Seed Sync
**Issue**: Random events (Crits, Damage Rolls) were desynchronized between players.
**Fix**:
*   Added `seed` column (numeric array) to `lobbies` table.
*   Passed this seed to `BattleSystem` constructor.
*   Updated `@pkmn/sim` initialization to use this seed for its PRNG.
*   **Result**: Both players now roll the exact same random numbers for every turn.

### 5. Desync Detection
**Feature**: Auto-detection of game state divergence.
**Implementation**:
*   Engine generates a simple hash (`Turn:LogLength:LastLogLine`).
*   Client broadcasts this hash after every move.
*   Opponent compares received hash with local hash.
*   If mismatch -> `CRITICAL DESYNC` error shown.

## Next Steps for Next Agent
1.  **Visuals (Animation Queue)**: The engine works, but visuals are instant. Connect `BattleEventQueue` to a React animation player to show HP bars draining and text typing out.
2.  **Win/Loss Logic**: Handle the `win` event and display a Game Over screen with a "Back to Lobby" button.
3.  **Database Integration**: Replace `mockTeams` with real data fetched from `custom_pokemon` using the `ModdedDex` adapter (once data entry is done).
