# Agent Directives: The Everymon Protocol

**Target Audience:** AI Agents & Developers.
**Purpose:** This file defines the **Non-Negotiable Constraints** for this project. If you are generating code for Everymon, you **MUST** follow these rules.

---

## Directive 1: Zero-Tolerance Typing
**Rule:** `noImplicitAny` is ENABLED. You are **forbidden** from using `any` or `@ts-ignore` to bypass type errors.
*   **Why:** The previous codebase collapsed because the Battle Engine's complex types were ignored.
*   **Action:** If you don't know a type, **find it**. Inspect the `@pkmn/sim` definitions or generate Supabase types using the CLI. Do not guess.

## Directive 2: The 200-Line Limit
**Rule:** No single file may exceed **200 lines** of code.
*   **Why:** Large files (like the old `dashboard/page.tsx`) become unreadable and impossible to refactor.
*   **Action:** If a component grows too large:
    1.  Extract sub-components (e.g., `Header.tsx`, `StatsCard.tsx`).
    2.  Extract logic hooks (e.g., `useBattleLogic.ts`).
    3.  Extract constants to `config/`.

## Directive 3: Engine First, Visuals Second
**Rule:** visuals are a *consumer* of logic, not the *driver*.
*   **Why:** React renders are unpredictable. Tying game logic to `useEffect` causes bugs.
*   **Action:**
    1.  Wait for the Engine to emit an **Event** (e.g., `damage_dealt`).
    2.  Wait for the Animation Queue to process that event.
    3.  *Then* update the HP Bar width.

## Directive 4: Neo-Brutalist Aesthetic
**Rule:** This is not a "Bootstrap" or "Material UI" project.
*   **Style Guide:**
    *   **Borders:** Thick (2px-4px), solid black (`border-black`).
    *   **Shadows:** Hard offset, no blur (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`).
    *   **Colors:** High saturation (Yellow, Pink, Cyan). No soft pastels.
*   **Action:** Do not write raw Tailwind for these repeatedly. Use the `<Button variant="brutal" />` and `<Card />` components.

## Directive 5: Integrity Over Hacks
**Rule:** Never "Mock" the engine to fit the UI.
*   **Why:** If you hardcode "Pikachu" when the user made a "Custom Fire Mon", Type Effectiveness will be wrong forever.
*   **Action:** You must use the `ModdedDex` adapter to teach the engine about the new Pokemon. If the Engine rejects it, **fix the Adapter**, do not fake the data.

## Directive 6: Multiplayer Protocol
**Rule:** Peer-to-Peer Lockstep is the standard.
*   **Action:**
    *   Never trust a client's "Result" (e.g., "I won").
    *   Always verify the "Hash" of the state.
    *   If hashes mismatch, trigger a **Desync Error**. Do not try to "auto-correct" or guess who is right.
## Directive 7: Automated Testing Mandate
**Rule:** Every new feature must include unit tests with at least 80% coverage.
*   **Why:** Prevent regressions and ensure reliability.
*   **Action:** Write tests using Jest, run `npm test` in CI, enforce coverage thresholds.

## Directive 8: Documentation First
**Rule:** All public APIs and complex functions must have JSDoc comments.
*   **Why:** Improves maintainability and onboarding.
*   **Action:** Use ESLint plugin `eslint-plugin-jsdoc` and enforce via linting.

## Directive 9: Performance Budget
**Rule:** UI components must render within 50 ms on a typical device.
*   **Why:** Keeps the experience snappy.
*   **Action:** Profile with Chrome DevTools, optimize heavy renders, memoize where appropriate.

## Directive 10: Accessibility Baseline
**Rule:** All interactive elements must be keyboard‑navigable and have appropriate ARIA labels.
*   **Why:** Inclusive design for all users.
*   **Action:** Run `axe-core` audits, fix violations before merge.

---
**Summary:**
1.  **Strict Types.**
2.  **Small Files.**
3.  **Engine Truth.**
4.  **Brutalist Style.**
5.  **No Hacks.**
6.  **Automated Testing.**
7.  **Documentation First.**
8.  **Performance Budget.**
9.  **Accessibility Baseline.**
10. **Immutable Content.**

*If you violate these rules, the refactor will fail.*
