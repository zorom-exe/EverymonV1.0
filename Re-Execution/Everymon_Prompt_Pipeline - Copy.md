# Everymon Prompt Pipeline

**Objective:** To rebuild Everymon by feeding these prompts sequentially to an AI coding agent.
**Prerequisite:** Ensure the `Agent_Rulebook.md` directives are active or included in your custom instructions.

---

## 0. The Context Setter (Run This First)
> "Act as a Senior Full-Stack Engineer specializing in Next.js, Supabase, and TypeScript. You are rebuilding the 'Everymon' project.
> **Critical Rules:**
> 1. `noImplicitAny` is strictly enforced.
> 2. No file > 200 lines (split logic immediately).
> 3. Neo-Brutalist design (thick borders, hard shadows).
> 4. Logic drives Visuals (never mock engine data).
> I will feed you tasks in phases. Do not hallucinate code for future phases. Focus only on the current prompt.
> Acknowledge if you understand."

---

## Phase 1: The Invisible Foundation

### Prompt 1.1: Environment & Types
> "Initialize a new Next.js 15 App Router project.
> 1. Configure `tsconfig.json` with `noImplicitAny: true` and strict mode.
> 2. Create a `tailwind.config.ts` with a 'brutal' color palette (primary: yellow-400, secondary: pink-500, border: black).
> 3. Create a `src/types/database.ts` file. I will paste the Supabase SQL definitions next, but for now, just set up the file structure."

### Prompt 1.2: Database Migration
> "Here are the requirements for the Supabase SQL Schema. Generate a migration file `supabase/migrations/001_init.sql` for:
> 1. `profiles` table (id references auth.users, username text unique, avatar_url text).
> 2. `matches` table (id uuid, host_id uuid, challenger_id uuid, state jsonb, status text enum['OPEN', 'IN_PROGRESS', 'FINISHED']).
> 3. `custom_pokemon` table (id uuid, owner_id uuid, name text, stats jsonb, moves jsonb).
> **Constraint:** Add a Postgres Trigger or RLS policy that prevents inserting into `custom_pokemon` if the user already has 6 rows.
> **Constraint:** Disable UPDATE policy for `custom_pokemon`. Users can only INSERT or DELETE."

---

## Phase 2: The Simulation Core

### Prompt 2.1: The Adapter
> "We are using `@pkmn/sim`. Create a file `src/lib/pokemon/adapter.ts`.
> Write a function `adaptCustomMon(data: CustomPokemonRow): Species`.
> This function must effectively 'lie' to the engine by creating a valid Species object (like valid stats, types, and movepool) based on the database row.
> **Constraint:** Do not use `any`. Use the proper types from `@pkmn/dex` and `@pkmn/types`."

### Prompt 2.2: The Battle Class (Logic Only)
> "Create `src/lib/battle/engine.ts`.
> Implement a `BattleSystem` class that wraps the `@pkmn/sim` Battle.
> 1. Constructor takes two teams.
> 2. `start()` initializes the engine.
> 3. `chooseMove(playerIndex, moveSlot)` executes a choice.
> 4. Expose a `getEvents()` method that returns the turn's log.
> **Test:** Write a simple script `scripts/test-battle.ts` that runs a turn and logs the damage. Prove that a Water-type move deals 2x damage to a Fire-type.
> **Constraint:** Include a Jest unit test `src/lib/battle/engine.test.ts` to verify this logic automatically (Rulebook Directive 7)."

---

## Phase 3: Multiplayer Networking

### Prompt 3.1: The Lobby Hook
> "Create a hook `useLobby.ts` using Supabase Realtime.
> 1. It should subscribe to the `matches` table.
> 2. Return a list of 'OPEN' matches.
> 3. Provide a `createMatch()` function that inserts a new row.
> 4. Provide a `joinMatch(matchId)` function that updates `challenger_id`.
> Keep this file under 200 lines. If needed, split the subscription logic from the action logic."

### Prompt 3.2: P2P Lockstep Signals
> "Implement `useMultiplayerBattle.ts`.
> This hook manages the Realtime Channel for a specific match.
> 1. `broadcastMove(move: string)`: Sends user input to the opponent.
> 2. `onMoveReceived(move: string)`: Feeds the opponent's move into the local `BattleSystem`.
> 3. After the turn, calculate a SHA-256 hash of the engine state and broadcast it.
> 4. If the received hash != local hash, set an error state 'DESYNC DETECTED'."

---

## Phase 4: The Visuals (Neo-Brutalist)

### Prompt 4.1: Atomic Components
> "Create `src/components/ui/BrutalButton.tsx` and `BrutalCard.tsx`.
> Style: 4px solid black border, 4px black hard shadow, sharp corners.
> Hover effect: Translate X/Y by 2px and reduce shadow to 2px (to simulate being pressed).
> Use Tailwind classes."

### Prompt 4.2: The Battle Canvas
> "Create `src/components/battle/BattleCanvas.tsx`.
> It should accept the current `BattleState` as a prop.
> Render two Pokemon sprites (Player/Enemy).
> Render two HP bars.
> **Constraint:** The HP bar width must correspond to `currentHP / maxHP` percentage. Ensure it is wrapped in your BrutalCard container."

### Prompt 4.3: Connecting the Logic
> "Update `src/app/battle/[id]/page.tsx`.
> 1. Use the `useMultiplayerBattle` hook to get the state.
> 2. Render the `BattleCanvas` with that state.
> 3. Render a `ControlPanel` with 4 move buttons (using `BrutalButton`).
> 4. When a button is clicked, call `broadcastMove`."

---

## Phase 5: Polish & Bots

### Prompt 5.1: Spectator Mode
> "Modify `useMultiplayerBattle`.
> If `user.id` is neither Host nor Challenger, enter Spectator Mode.
> Spectators do not emit moves. They only listen to the Host's state broadcasts.
> Update the UI to hide the Move Buttons for spectators."

### Prompt 5.2: Helper Bot
> "Create `src/lib/bot/SimpleBot.ts`.
> Implement a function `getBestMove(battle: Battle): string`.
> Logic: Scan all 4 moves. If one move is Type Effective (>1x) and kills the opponent, select it. Otherwise, choose random."

---

## Phase 6: Infrastructure & Launch (Ops)

### Prompt 6.1: Observability
> "Install `@sentry/nextjs` and `posthog-js`.
> 1. Initialize Sentry in `sentry.client.config.ts`, `server`, and `edge`.
> 2. Create a `AnalyticsProvider.tsx` client component that initializes PostHog.
> 3. Wrap the root `layout.tsx` with `<AnalyticsProvider>`."

### Prompt 6.2: Storage & Security
> "Create a Supabase Storage Policy script `supabase/migrations/002_storage.sql`.
> 1. Create bucket `pokemon-images`.
> 2. Policy: authenticated users can uploading (INSERT).
> 3. Policy: Public can download (SELECT).
> 4. **Constraint:** Use the 6-slot limit logic to prevent upload spam."
