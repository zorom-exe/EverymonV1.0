# The Vibe Coder's Handbook: Building Everymon

**Goal:** Build a complex app without writing complex code.
**Your Role:** Product Manager & QA Tester.
**The AI's Role:** The Intern who writes the code.

You do not need to understand what "useEffect" means. You just need to know if the effect was used correctly. This guide tells you exactly what to command and what to check.

---

## The Golden Rules of Vibe Coding

**1. One Chunk at a Time**
Never ask the AI to "Build the game." It will get confused and give you garbage.
Instead, ask for tiny, specific pieces. "Build the button," then "Make the button red," then "Make the red button click."

**2. Trust but Verify**
The AI will lie to you. It will say "I fixed it." You must open the app and check. If it is still broken, say "It is still broken."

**3. Be Strict About "Simulations"**
Before you ask for graphics, ask for text proof. If the AI cannot show you a battle in the text console, it definitely cannot show you one with graphics.

---

## Phase 1: The Setup (The Boring Part)

**Your Prompt:** "I want to start a new project. Set up Supabase with a 'matches' table and a 'profiles' table. Do not make any UI yet. Just get the database ready."

**What to Check:**
1.  Go to your Supabase Dashboard.
2.  Do you see a table called `matches`?
3.  Do you see a table called `profiles`?
4.  *If yes:* Success. Move on.
5.  *If no:* Tell the AI "You did not create the tables. Try again."

---

## Phase 2: The Logic (The Invisible Part)

**Your Prompt:** "Write a script that simulates a battle between a Fire Pokemon and a Water Pokemon. Run it in the console and show me the logs. I want to see correct type effectiveness."

**What to Check:**
1.  Look at the text output the AI gives you.
2.  Does it say "Super effective"?
3.  Does the Fire Pokemon take more damage?
4.  *Crucial:* If the math looks wrong, do NOT ask for graphics. Tell the AI "The math is wrong. Fix the damage formula."

---

## Phase 3: The Multiplayer (The Connection)

**Your Prompt:** "Create a simple page with a 'Join Lobby' button. When I open it in two different tabs, I want them to see each other."

**What to Check:**
1.  Open the app in Chrome.
2.  Open the app in an Incognito window (so you are a different user).
3.  Click "Join" on both.
4.  Do you see "Player 2 joined" on the first screen?
5.  *If yes:* You have multiplayer. This is the hardest part. Congratulations.

---

## Phase 4: The Visuals (The Fun Part)

**Your Prompt:** "Now let's style it. I want a Neo-Brutalist look. Thick black borders, bright yellow backgrounds, hard shadows. No round corners."

**What to Check:**
1.  Does it look bold and ugly-cool?
2.  Are the corners sharp?
3.  *If it looks like a generic corporate website:* Tell the AI "Too boring. Make the borders thicker. Make the colors brighter."

---

## Troubleshooting Guide

**Problem:** "The AI wrote a really long file and now it's confused."
**Solution:** Say "This file is too big. Split it into smaller files. Keep it under 200 lines."

**Problem:** "The game freezes when I attack."
**Solution:** Say "The animation is blocking the game logic. Separate the Event Queue."

**Problem:** "The AI says it fixed the bug but nothing changed."
**Solution:** Say "You are hallucinating. I just ran it and the bug is there. Look at the code again."
