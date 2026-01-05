# Developer Guide: Building "Everymon"

**Objective:** Build a robust, scalable Custom Pokémon Battle Simulator with Real-Time Multiplayer.
**Context:** You are building this from scratch. I have analyzed a previous prototype of this system and identified several critical pitfalls. This guide is designed to navigate you *around* those traps so you build a professional-grade application on the first try.

---

## 1. The Core Philosophy
The previous attempt failed because it prioritized "getting it to work" over "getting it right."
*   **Trap:** Hardcoding styles and logic in components.
*   **Trap:** Using `any` types to bypass complex engine errors.
*   **Trap:** "Hacking" the battle engine to force visuals instead of fixing the data.

**Your Rule:** **"Strict Types, Clean Data."** If the data is correct, the visuals will follow. Do not build the UI until the Engine is proven.

---

## 2. Technical Stack & Setup
Use **Next.js 15+ (App Router)** and **Supabase**.
*   **Crucial Step:** Before you write a single line of logic, enable `noImplicitAny` in your `tsconfig.json`. The previous project suffered greatly from loose typing in the battle logic, making bugs impossible to trace.
*   **Database:** Use Supabase. Run `supabase gen types typescript` immediately after creating your tables. Do *not* manually define TypeScript interfaces that might drift from your actual DB schema.

---

## 3. The Battle Engine (The Hard Part)
You will use `@pkmn/sim` for the logic. Here is where the previous attempt went wrong.

### The "Proxy" Trap
*   *Don't do this:* The old version tried to map custom Pokemon to "Pikachu" or "Charizard" internally to make the engine happy, then hacked the stats. This broke type effectiveness and move validation.
*   *Do this instead:* **Inject a Custom Dex.** The engine allows you to provide a `ModdedDex`. You must write an adapter that takes the user's JSON creation and feeds it into the engine as a legitimate Species. The engine should *know* that "MyCustomMon" exists and has Fire/Water typing.

### The Animation Sync Trap
*   *Don't do this:* Reading the engine's `state` and immediately rendering it in React. This causes the health bar to jump to 0 before the "It's super effective!" text appears.
*   *Do this instead:* **Event Sourcing.** The engine should produce a list of events (`["move", "text:It's super effective", "damage:50"]`). Your React UI should consume these events one by one, waiting for the animation to finish before processing the next event.

---

## 4. Multiplayer Architecture
We need a standard "Arcade Lobby" where anyone can challenge anyone.

### The "Trust" Trap
*   *Don't do this:* Allowing the client to say "I hit for 50 damage." Clients lie.
*   *Do this instead:* **P2P Lockstep.**
    1.  Both players generate a shared Random Seed.
    2.  Both players exchange *Moves* (Input), not Results.
    3.  Both players run the simulation locally.
    4.  Both players compare the final State Hash.
    *   *Why?* It's instant (no server lag) but secure enough to detect cheating (Desync).

---

## 5. UI Architecture ("Neo-Brutalist")
The design is high-contrast and bold.

### The "Tailwind Soup" Trap
*   *Don't do this:* Copy-pasting `className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ..."` on every button. The old code was unreadable.
*   *Do this instead:* **Atomic Components.**
    *   Create a `<Button variant="primary" />`.
    *   Create a `<Card variant="yellow" />`.
    *   Define your colors in `tailwind.config.ts` (e.g., `colors.brutal.red`).

### The "Mega-File" Trap
*   *Don't do this:* Creating a `dashboard/page.tsx` that is 500 lines long. It makes navigation impossible.
*   *Do this instead:* **The 200-Line Rule.** No file should exceed 200 lines of code. If it does, you *must* break it down into smaller, focused components or extract logic into hooks.
    *   *Example:* Extract `DashboardStats.tsx` and `SubmissionsList.tsx` from the main page.

---

## 6. Execution Roadmap

### Phase 1: The Invisible Foundation (Setup)
1.  **Initialize & Config:** Set up Next.js with `noImplicitAny: true`.
2.  **Database Migration:** Create `001_initial_schema.sql`.
    *   Define `profiles` (id, avatar, username).
    *   Define `lobbies` (code, host_id, state).
    *   Define `custom_pokemon` (jsonb stats).
3.  **Type Generation:** Run `supabase gen types` and create a `types/supabase.ts` barrel file.
4.  **Utilities:** Write `src/lib/supabase/server.ts` and `client.ts`.

### Phase 2: The Simulation Core (Engine)
1.  **Species Adapter:** Write `src/lib/pokemon/adapter.ts`.
    *   Function: `convertToSpecies(customMon) -> Species`.
2.  **Battle System Class:** Create `src/lib/battle/engine.ts`.
    *   Implement `startBattle(p1, p2)`.
    *   **Verification:** Write a test script `scripts/test-engine.ts`. Ensure a **Water/Flying** type correctly takes **4x damage** from an Electric move.
3.  **Event Queue:** Create `src/lib/battle/queue.ts`.
    *   Implement `addEvent()`, `getNextEvent()`.

### Phase 3: Networking & Data Flow
1.  **Lobby UI:** Build `src/app/lobby/page.tsx` (<200 lines).
2.  **Team Builder Logic (Strict):**
    *   Enforce **"Delete to Create"**. Check if user has 6 mons. If yes, disable "Create" button until one is deleted.
    *   **No Edit Button.** Only "Delete".
3.  **Room Subscription:** Create `useLobby(roomCode)` hook.
3.  **Lockstep Hook:** Create `useMultiplayerBattle.ts`.
    *   Implement `sendMove(moveId)`.
    *   Implement `onReceiveMove(payload)`.
    *   Implement `verifyHash(state)`.

### Phase 4: The Visual Layer (UI)
1.  **Design System:** Create `src/components/ui/Button.tsx`, `Card.tsx`, `Badge.tsx`.
2.  **Battle Canvas:** Build `src/components/battle/BattleArena.tsx`.
    *   Render Sprites based on current state.
3.  **Health Bars:** Build `src/components/battle/HPBar.tsx`.
    *   Animate changes when Event Queue processes damage.
4.  **Controls:** Build `src/components/battle/ControlPanel.tsx`.

### Phase 5: Polish & Launch
1.  **Spectator Mode:** Add readonly view to `BattleArena`.
2.  **Sound FX:** Add "hit" and "faint" sounds to Event Queue processor.
3.  **Bot Logic:** Create `src/lib/bot/heuristic.ts` for single player.

### Phase 6: Ops & Infrastructure
1.  **Observability:** Install Sentry & PostHog.
2.  **Storage:** Configure Supabase Bucket policies.
3.  **Deployment:** Deploy to Vercel and run final Lighthouse check.


---

**Final Advice:**
The previous dev built the UI first and tried to shoehorn the engine into it. You must do the opposite. Build a rock-solid engine adapter first, then drape the UI over it. Good luck.
