# Everymon Launch Kit: The Missing Pieces

**Observation:** You have the Code (`Re-Execution`), the Rules (`Rulebook`), and the Management (`Vibe Guide`).
**The Gap:** A game needs more than code. It needs **Heart (Assets)**, **Home (Infrastructure)**, and **Law (Governance)**.

---

## 1. The Asset Pipeline (Creative)
You cannot code a "Roar" sound. You need files.

### 1.1. Visual Assets
*   **Sprites:** You need a source for Gen 9 sprites.
    *   *Solution:* Use **PokeAPI** for official mons.
    *   *Challenge:* User Custom Mons. Users will want to upload images.
    *   *Requirement:* **Supabase Storage** bucket (`pokemon-images`).
    *   *Process:* Implement an Image Cropper in the UI to force square aspect ratios (essential for the Brutalist layout).
*   **Icons:**
    *   *Solution:* `lucide-react` for UI icons. `pokemon-font` for Type symbols.

### 1.2. Audio Assets
*   **Sound FX:** "Hit", "Super Effective", "Faint", "Button Click".
    *   *Source:* OpenGameArt.org (CC0 license).
    *   *Requirement:* `useSound` hook in React to play these without lag.
*   **Music:** A "Battle Theme" and "Lobby Theme".
    *   *Vibe:* Lo-fi Hip Hop or High-Energy Synthwave (matches Neo-Brutalism).

---

## 2. Infrastructure & Ops (The Engine Room)

### 2.1. Hosting Strategy
*   **Frontend:** **Vercel** (Free Tier is fine to start).
*   **Backend:** **Supabase** (Free Tier limits: 500MB database, 1GB storage).
    *   *Warning:* Realtime Quotas. If you get popular, 200 concurrent connections might fill up fast. Have a plan to upgrade to Pro ($25/mo).

### 2.2. Observability (Seeing the Bugs)
*   **Error Tracking:** **Sentry**.
    *   **Is it Free?** Yes. The "Developer" plan gives you 5,000 errors/month for free. This is plenty for development.
*   **Analytics:** **PostHog**.
    *   **Is it Free?** Yes. Generous free tier (1,000,000 events/month). Perfect for tracking which Custom Mons are winning the most.

---

## 3. Governance & Safety (The Sheriff)
You are allowing users to upload content. This is dangerous.

### 3.1. Content Moderation (Strategy: Human Review)
*   **The Plan:** Users usually upload content to a "Pending" state. Admins review via a Dashboard. Only "Approved" content is public.
*   **Is it Secure?** It is secure for the *public* (they won't see bad stuff), but risky for the *project*.
*   **Vulnerability Report & Fixes:**
    1.  **Queue Flooding:**
        *   *Risk:* Bots spamming uploads.
        *   *Fix:* **Slot Limit.** Users must be logged in. Each user has a **Strict Limit of 6** Custom Mon slots. To upload a new one, they must delete an old one. This makes spamming impossible.
    2.  **The "Sleeper" Edit:**
        *   *Risk:* Editing an approved image to something bad.
        *   *Fix:* **No Edits.** once a submission is "Approved", it is locked. Users cannot edit it. They must delete and re-submit (sending it back to the bottom of the queue).
    3.  **Reviewer Safety:** The Admin (you) *must* see the bad images to ban them. This exposes you to NSFW/illegal content.
        *   *Fix:* CSS Blur filter on the Admin Dashboard by default. Click to reveal.

### 3.2. IP & Legal (The Elephant in the Room)
*   **Risk:** You are using Pokémon data/mechanics. Nintendo is litigious.
*   **Defense:**
    1.  **Non-Commercial:** Do not charge money. No subscriptions. No ads.
    2.  **Disclaimer:** "This is a fan project. Not affiliated with Nintendo/Game Freak." prominent in the footer.
    3.  **Open Source:** Keeping the code public often helps frame it as "Educational/Research".

---

## 4. Community Loop
*   **Feedback:** A simple "Report Bug" button in the Dashboard that sends an entry to a `feedback` table.
*   **Discord:** You need a place for people to arrange matches and complain about balance.

---

**Checklist:**
- [ ] Setup Supabase Storage for images.
- [ ] Find 5 clean Sound FX files.
- [ ] Register for Sentry (Free).
- [ ] Add NSFW filter API key.
- [ ] Add "Disclaimer" to `layout.tsx`.
