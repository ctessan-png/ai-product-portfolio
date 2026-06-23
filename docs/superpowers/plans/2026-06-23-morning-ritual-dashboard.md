# Morning Ritual Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first Morning Ritual dashboard web app with journal prompts, tarot pull, meditation picker, morning checklist, and punch-card style stamp trackers.

**Architecture:** Create a distinct portfolio project at `projects/07-morning-ritual-dashboard/`. Keep business logic in focused ES modules so it can be tested with Node’s built-in test runner, then wire those modules into a static HTML/CSS/JS mobile web dashboard.

**Tech Stack:** HTML, CSS, vanilla JavaScript ES modules, Node.js built-in `node:test`, browser `localStorage`, GitHub portfolio documentation.

## Global Constraints

- Phase one is a mobile-first static web dashboard inside the portfolio.
- Phase one must not build a native iPhone app.
- No login, accounts, cloud sync, backend, or external APIs.
- No real podcast, meditation, or tarot API integrations.
- No lock-step gating; every activity stays available from the start.
- Tarot must be framed as reflective journaling support, not predictive fortune-telling.
- Use the provided punch-card style tokens as the visual foundation.
- Core dashboard must work without network access except optional fonts.
- Persist local state in browser `localStorage`.
- Respect reduced-motion preferences.
- Use `projects/07-morning-ritual-dashboard/` as the implementation location.

---

## File Structure

- Create `projects/07-morning-ritual-dashboard/README.md`: explains purpose, use, features, and portfolio value.
- Create `projects/07-morning-ritual-dashboard/index.html`: mobile-first dashboard markup.
- Create `projects/07-morning-ritual-dashboard/styles.css`: punch-card visual system and responsive layout.
- Create `projects/07-morning-ritual-dashboard/src/data.mjs`: local prompt, tarot, meditation, podcast, task, and joy activity data.
- Create `projects/07-morning-ritual-dashboard/src/ritual-engine.mjs`: pure functions for selection, dates, completion counts, and stamp state.
- Create `projects/07-morning-ritual-dashboard/src/storage.mjs`: safe `localStorage` adapter with in-memory fallback.
- Create `projects/07-morning-ritual-dashboard/src/app.mjs`: DOM rendering and event wiring.
- Create `projects/07-morning-ritual-dashboard/tests/ritual-engine.test.mjs`: Node tests for pure logic.
- Create `projects/07-morning-ritual-dashboard/tests/storage.test.mjs`: Node tests for persistence fallback.
- Modify `README.md`: add the new project to the project list.
- Modify `portfolio-overview.md`: mention the Morning Ritual dashboard as the build phase after research.

---

### Task 1: Add Tested Ritual Data And Selection Logic

**Files:**
- Create: `projects/07-morning-ritual-dashboard/src/data.mjs`
- Create: `projects/07-morning-ritual-dashboard/src/ritual-engine.mjs`
- Create: `projects/07-morning-ritual-dashboard/tests/ritual-engine.test.mjs`

**Interfaces:**
- Produces: `journalPrompts`, `tarotCards`, `meditations`, `podcasts`, `morningTasks`, `weeklyJoyActivities`
- Produces: `getTodayKey(date: Date): string`
- Produces: `pickByIndex(items: Array<object>, index: number): object`
- Produces: `getCompletionCount(completed: Record<string, boolean>): number`
- Produces: `toggleCompletion(completed: Record<string, boolean>, id: string): Record<string, boolean>`
- Produces: `buildStampSlots(items: Array<{ id: string }>, completed: Record<string, boolean>): Array<{ id: string, stamped: boolean }>`

- [ ] **Step 1: Write the failing ritual engine tests**

Create `projects/07-morning-ritual-dashboard/tests/ritual-engine.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  buildStampSlots,
  getCompletionCount,
  getTodayKey,
  pickByIndex,
  toggleCompletion
} from "../src/ritual-engine.mjs";
import {
  journalPrompts,
  meditations,
  morningTasks,
  podcasts,
  tarotCards,
  weeklyJoyActivities
} from "../src/data.mjs";

test("data lists include the first-version ritual content", () => {
  assert.ok(journalPrompts.length >= 10);
  assert.ok(tarotCards.length >= 12);
  assert.ok(meditations.some((meditation) => meditation.durationMinutes === 5));
  assert.ok(meditations.some((meditation) => meditation.durationMinutes === 10));
  assert.ok(podcasts.length >= 5);
  assert.deepEqual(
    morningTasks.map((task) => task.label),
    [
      "No app opening",
      "Gua sha / face routine",
      "Vibration plate",
      "Journal",
      "Meditate",
      "Red light during meditation",
      "Walk dog",
      "Skin again"
    ]
  );
  assert.ok(weeklyJoyActivities.length >= 7);
});

test("getTodayKey returns a stable local date key", () => {
  assert.equal(getTodayKey(new Date("2026-06-23T08:15:00")), "2026-06-23");
});

test("pickByIndex wraps large indexes safely", () => {
  const items = [{ id: "a" }, { id: "b" }, { id: "c" }];
  assert.deepEqual(pickByIndex(items, 4), { id: "b" });
});

test("pickByIndex throws for an empty list", () => {
  assert.throws(() => pickByIndex([], 0), /Cannot pick from an empty list/);
});

test("toggleCompletion flips one item without mutating the original object", () => {
  const original = { journal: true };
  const next = toggleCompletion(original, "meditate");
  assert.deepEqual(original, { journal: true });
  assert.deepEqual(next, { journal: true, meditate: true });
  assert.deepEqual(toggleCompletion(next, "journal"), { journal: false, meditate: true });
});

test("getCompletionCount counts only true values", () => {
  assert.equal(getCompletionCount({ journal: true, meditate: false, walk: true }), 2);
});

test("buildStampSlots maps completion state to visual stamp state", () => {
  const slots = buildStampSlots([{ id: "journal" }, { id: "walk" }], { journal: true });
  assert.deepEqual(slots, [
    { id: "journal", stamped: true },
    { id: "walk", stamped: false }
  ]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test projects/07-morning-ritual-dashboard/tests/ritual-engine.test.mjs
```

Expected: FAIL with module-not-found errors for `src/ritual-engine.mjs` and `src/data.mjs`.

- [ ] **Step 3: Add local dashboard data**

Create `projects/07-morning-ritual-dashboard/src/data.mjs`:

```js
export const journalPrompts = [
  { id: "ground-1", category: "grounding", text: "What would make this morning feel protected and spacious?" },
  { id: "ground-2", category: "grounding", text: "What do I want to give my attention to before the world asks for it?" },
  { id: "trust-1", category: "self-trust", text: "Where can I trust myself more today?" },
  { id: "trust-2", category: "self-trust", text: "What choice would feel like I am on my own side?" },
  { id: "body-1", category: "body check-in", text: "What is my body asking for before I start doing?" },
  { id: "body-2", category: "body check-in", text: "Where can I soften, unclench, or slow down?" },
  { id: "gratitude-1", category: "gratitude", text: "What small thing already feels supportive this morning?" },
  { id: "clarity-1", category: "clarity", text: "What is the one thing I want to carry into the day?" },
  { id: "apps-1", category: "app protection", text: "What am I protecting by not opening apps first?" },
  { id: "weekly-1", category: "weekly reflection", text: "What non-work joy do I want to make room for this week?" }
];

export const tarotCards = [
  { id: "fool", name: "The Fool", meaning: "Begin with openness.", reflection: "Where can I let the morning be simple instead of perfect?" },
  { id: "magician", name: "The Magician", meaning: "Use what is already available.", reflection: "What tool or habit is already here to support me?" },
  { id: "high-priestess", name: "The High Priestess", meaning: "Listen before acting.", reflection: "What do I know before I check outside noise?" },
  { id: "empress", name: "The Empress", meaning: "Care is productive.", reflection: "How can I treat care as part of the work?" },
  { id: "strength", name: "Strength", meaning: "Softness can be discipline.", reflection: "What would gentle consistency look like today?" },
  { id: "hermit", name: "The Hermit", meaning: "Return to your own signal.", reflection: "What do I hear when the phone is quiet?" },
  { id: "temperance", name: "Temperance", meaning: "Balance comes from small adjustments.", reflection: "What needs a lighter touch this morning?" },
  { id: "star", name: "The Star", meaning: "Hope can be practical.", reflection: "What would help me feel restored before I begin?" },
  { id: "sun", name: "The Sun", meaning: "Let the good be obvious.", reflection: "What is one bright thing I do not want to miss?" },
  { id: "world", name: "The World", meaning: "Completion can be peaceful.", reflection: "What would make this routine feel complete enough?" },
  { id: "ace-cups", name: "Ace of Cups", meaning: "Begin with emotional honesty.", reflection: "What feeling wants acknowledgment first?" },
  { id: "six-swords", name: "Six of Swords", meaning: "Move gently from noise to calm.", reflection: "What am I leaving outside this ritual?" }
];

export const meditations = [
  { id: "body-scan-5", title: "Body scan", durationMinutes: 5, instruction: "Notice forehead, jaw, shoulders, ribs, hips, legs, and feet. Let each place soften." },
  { id: "breath-reset-5", title: "Breath reset", durationMinutes: 5, instruction: "Inhale for four, exhale for six. Let the longer exhale set the pace." },
  { id: "self-trust-5", title: "Self-trust", durationMinutes: 5, instruction: "Repeat: I can begin before I know everything." },
  { id: "calm-focus-10", title: "Calm focus", durationMinutes: 10, instruction: "Choose one word for the day. Return to it each time your mind wanders." },
  { id: "gratitude-10", title: "Gratitude", durationMinutes: 10, instruction: "Name five quiet supports already present in your morning." }
];

export const podcasts = [
  { id: "soft-start", title: "Soft Start Walk", mood: "gentle", note: "A quiet choice for easing into the day." },
  { id: "curious-walk", title: "Curious Walk", mood: "learning", note: "A thoughtful episode for a dog walk with light focus." },
  { id: "business-brain", title: "Business Brain", mood: "strategy", note: "A work-adjacent pick that still feels energizing." },
  { id: "creative-reset", title: "Creative Reset", mood: "creative", note: "A good match when you want ideas without scrolling." },
  { id: "no-input", title: "No-input walk", mood: "quiet", note: "Skip audio and let the walk be the meditation." }
];

export const morningTasks = [
  { id: "no-apps", label: "No app opening" },
  { id: "gua-sha", label: "Gua sha / face routine" },
  { id: "vibration-plate", label: "Vibration plate" },
  { id: "journal", label: "Journal" },
  { id: "meditate", label: "Meditate" },
  { id: "red-light", label: "Red light during meditation" },
  { id: "walk-dog", label: "Walk dog" },
  { id: "skin-again", label: "Skin again" }
];

export const weeklyJoyActivities = [
  { id: "friend", label: "Friend time" },
  { id: "outside", label: "Outside time" },
  { id: "creative", label: "Creative hour" },
  { id: "movement", label: "Movement" },
  { id: "home", label: "Home reset" },
  { id: "learning", label: "Learning" },
  { id: "rest", label: "Rest" }
];
```

- [ ] **Step 4: Add pure ritual logic**

Create `projects/07-morning-ritual-dashboard/src/ritual-engine.mjs`:

```js
export function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function pickByIndex(items, index) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cannot pick from an empty list");
  }

  const safeIndex = Math.abs(index) % items.length;
  return items[safeIndex];
}

export function toggleCompletion(completed, id) {
  return {
    ...completed,
    [id]: !completed[id]
  };
}

export function getCompletionCount(completed) {
  return Object.values(completed).filter(Boolean).length;
}

export function buildStampSlots(items, completed) {
  return items.map((item) => ({
    id: item.id,
    stamped: Boolean(completed[item.id])
  }));
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run:

```bash
node --test projects/07-morning-ritual-dashboard/tests/ritual-engine.test.mjs
```

Expected: PASS for 7 tests.

- [ ] **Step 6: Commit**

```bash
git add projects/07-morning-ritual-dashboard/src/data.mjs projects/07-morning-ritual-dashboard/src/ritual-engine.mjs projects/07-morning-ritual-dashboard/tests/ritual-engine.test.mjs
git commit -m "Add morning ritual data model"
```

---

### Task 2: Add Tested Local Storage Adapter

**Files:**
- Create: `projects/07-morning-ritual-dashboard/src/storage.mjs`
- Create: `projects/07-morning-ritual-dashboard/tests/storage.test.mjs`

**Interfaces:**
- Consumes: browser-compatible storage object with `getItem`, `setItem`, `removeItem`
- Produces: `createMemoryStorage(): StorageLike`
- Produces: `loadJson(storage: StorageLike, key: string, fallback: unknown): unknown`
- Produces: `saveJson(storage: StorageLike, key: string, value: unknown): boolean`
- Produces: `removeJson(storage: StorageLike, key: string): void`

- [ ] **Step 1: Write failing storage tests**

Create `projects/07-morning-ritual-dashboard/tests/storage.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createMemoryStorage, loadJson, removeJson, saveJson } from "../src/storage.mjs";

test("saveJson and loadJson round-trip objects", () => {
  const storage = createMemoryStorage();
  assert.equal(saveJson(storage, "ritual", { journal: true }), true);
  assert.deepEqual(loadJson(storage, "ritual", {}), { journal: true });
});

test("loadJson returns fallback when key is missing", () => {
  const storage = createMemoryStorage();
  assert.deepEqual(loadJson(storage, "missing", { ready: false }), { ready: false });
});

test("loadJson returns fallback when stored JSON is invalid", () => {
  const storage = createMemoryStorage();
  storage.setItem("broken", "{bad json");
  assert.deepEqual(loadJson(storage, "broken", []), []);
});

test("saveJson returns false when storage throws", () => {
  const brokenStorage = {
    getItem() {
      return null;
    },
    setItem() {
      throw new Error("blocked");
    },
    removeItem() {}
  };

  assert.equal(saveJson(brokenStorage, "ritual", { done: true }), false);
});

test("removeJson removes saved values", () => {
  const storage = createMemoryStorage();
  saveJson(storage, "ritual", { done: true });
  removeJson(storage, "ritual");
  assert.deepEqual(loadJson(storage, "ritual", null), null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test projects/07-morning-ritual-dashboard/tests/storage.test.mjs
```

Expected: FAIL with module-not-found error for `src/storage.mjs`.

- [ ] **Step 3: Add storage adapter**

Create `projects/07-morning-ritual-dashboard/src/storage.mjs`:

```js
export function createMemoryStorage() {
  const values = new Map();

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    }
  };
}

export function loadJson(storage, key, fallback) {
  try {
    const value = storage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function saveJson(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeJson(storage, key) {
  try {
    storage.removeItem(key);
  } catch {
    // The dashboard can continue with in-memory state if persistence is unavailable.
  }
}
```

- [ ] **Step 4: Run storage tests**

Run:

```bash
node --test projects/07-morning-ritual-dashboard/tests/storage.test.mjs
```

Expected: PASS for 5 tests.

- [ ] **Step 5: Run all current project tests**

Run:

```bash
node --test projects/07-morning-ritual-dashboard/tests/*.test.mjs
```

Expected: PASS for 12 tests.

- [ ] **Step 6: Commit**

```bash
git add projects/07-morning-ritual-dashboard/src/storage.mjs projects/07-morning-ritual-dashboard/tests/storage.test.mjs
git commit -m "Add morning ritual storage adapter"
```

---

### Task 3: Build The Mobile-First Static Shell

**Files:**
- Create: `projects/07-morning-ritual-dashboard/index.html`
- Create: `projects/07-morning-ritual-dashboard/styles.css`
- Create: `projects/07-morning-ritual-dashboard/README.md`

**Interfaces:**
- Consumes: browser modules that Task 4 will load from `src/app.mjs`
- Produces: DOM nodes with ids used by Task 4: `today-label`, `intention-text`, `prompt-text`, `prompt-category`, `new-prompt`, `shuffle-tarot`, `pull-tarot`, `tarot-result`, `meditation-options`, `podcast-options`, `morning-task-list`, `morning-stamps`, `joy-stamps`, `reset-ritual`

- [ ] **Step 1: Create the HTML shell**

Create `projects/07-morning-ritual-dashboard/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Morning Ritual Dashboard</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <main class="phone-shell" aria-label="Morning ritual dashboard">
      <section class="hero-card">
        <p class="eyebrow" id="today-label">Morning ritual</p>
        <h1>Before the apps, come back to yourself.</h1>
        <p id="intention-text" class="hand-note">Open this first. Let the phone be a ritual surface, not a rabbit hole.</p>
      </section>

      <section class="ritual-grid" aria-label="Morning ritual cards">
        <article class="card journal-card">
          <div class="card-heading">
            <p class="eyebrow">Journal</p>
            <button id="new-prompt" type="button">New prompt</button>
          </div>
          <p id="prompt-category" class="tag">grounding</p>
          <p id="prompt-text" class="prompt-text">What would make this morning feel protected and spacious?</p>
        </article>

        <article class="card tarot-card">
          <div class="card-heading">
            <p class="eyebrow">Tarot reflection</p>
            <div class="button-row">
              <button id="shuffle-tarot" type="button">Shuffle</button>
              <button id="pull-tarot" type="button">Pull</button>
            </div>
          </div>
          <div id="tarot-result" class="tarot-result" aria-live="polite">
            <p class="tarot-name">Ready to pull</p>
            <p>Shuffle, pull one card, and use it as a reflection question.</p>
          </div>
        </article>

        <article class="card">
          <p class="eyebrow">Meditation</p>
          <h2>Pick 5 or 10 minutes</h2>
          <div id="meditation-options" class="choice-list"></div>
        </article>

        <article class="card">
          <p class="eyebrow">Walk companion</p>
          <h2>Podcast pick</h2>
          <div id="podcast-options" class="choice-list"></div>
        </article>
      </section>

      <section class="card checklist-card">
        <div class="card-heading">
          <div>
            <p class="eyebrow">Morning tasks</p>
            <h2>Keep it on this screen</h2>
          </div>
          <button id="reset-ritual" type="button">Reset</button>
        </div>
        <div id="morning-task-list" class="task-list"></div>
      </section>

      <section class="card stamp-card">
        <p class="eyebrow">Stamp card</p>
        <h2>Morning ritual punches</h2>
        <div id="morning-stamps" class="stamp-grid" aria-label="Morning ritual stamps"></div>
      </section>

      <section class="card stamp-card joy-card">
        <p class="eyebrow">Weekly joy</p>
        <h2>Non-work activity stamps</h2>
        <div id="joy-stamps" class="stamp-grid" aria-label="Weekly joy stamps"></div>
      </section>
    </main>

    <script type="module" src="src/app.mjs"></script>
  </body>
</html>
```

- [ ] **Step 2: Create the mobile-first CSS**

Create `projects/07-morning-ritual-dashboard/styles.css`:

```css
:root {
  --pc-cream: #fff8e8;
  --pc-vanilla: #fff2cf;
  --pc-blush: #f8c9d8;
  --pc-petal: #f6dff6;
  --pc-lilac: #cfd5ff;
  --pc-periwinkle: #8f9af8;
  --pc-sky: #bfdcf7;
  --pc-mint: #bfe9c8;
  --pc-sage: #8bc283;
  --pc-butter: #f6da64;
  --pc-coral: #ff7e67;
  --pc-tomato: #e3544b;
  --pc-berry: #9f2f57;
  --pc-ink: #262220;
  --pc-paper: #fffdf7;
  --pc-shadow: rgba(106, 74, 59, 0.14);
  --pc-shadow-strong: rgba(106, 74, 59, 0.22);
  --pc-line: rgba(80, 53, 45, 0.16);
  --pc-radius-xl: 32px;
  --pc-radius-lg: 24px;
  --pc-radius-md: 18px;
  --pc-radius-sm: 14px;
  --pc-radius-pill: 999px;
  --pc-border: 2px;
  --pc-space-1: 6px;
  --pc-space-2: 10px;
  --pc-space-3: 14px;
  --pc-space-4: 18px;
  --pc-space-5: 24px;
  --pc-space-6: 32px;
  --pc-title: "DM Serif Display", Georgia, serif;
  --pc-body: Nunito, "Trebuchet MS", sans-serif;
  --pc-accent: Caveat, "Bradley Hand", cursive;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  color: var(--pc-ink);
  background:
    radial-gradient(circle at 12% 8%, var(--pc-petal), transparent 28%),
    radial-gradient(circle at 88% 18%, var(--pc-sky), transparent 24%),
    linear-gradient(180deg, var(--pc-cream), var(--pc-vanilla));
  font-family: var(--pc-body);
}

button {
  min-height: 42px;
  border: var(--pc-border) solid var(--pc-line);
  border-radius: var(--pc-radius-pill);
  background: var(--pc-paper);
  color: var(--pc-ink);
  font: 800 0.9rem var(--pc-body);
  cursor: pointer;
  box-shadow: 0 8px 18px var(--pc-shadow);
}

button:focus-visible,
.task-button:focus-visible {
  outline: 3px solid var(--pc-periwinkle);
  outline-offset: 3px;
}

.phone-shell {
  width: min(430px, 100%);
  margin: 0 auto;
  padding: 18px 14px 32px;
}

.hero-card,
.card {
  border: var(--pc-border) solid var(--pc-line);
  border-radius: var(--pc-radius-xl);
  background: rgba(255, 253, 247, 0.92);
  box-shadow: 0 18px 42px var(--pc-shadow);
}

.hero-card {
  padding: 26px 22px;
  background: linear-gradient(145deg, var(--pc-paper), var(--pc-petal));
}

.hero-card h1,
.card h2 {
  margin: 0;
  font-family: var(--pc-title);
  font-weight: 400;
  line-height: 1;
}

.hero-card h1 {
  max-width: 11ch;
  font-size: 3rem;
}

.card h2 {
  font-size: 1.55rem;
}

.eyebrow,
.tag {
  margin: 0;
  color: var(--pc-berry);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hand-note {
  margin: 18px 0 0;
  font: 700 1.5rem var(--pc-accent);
}

.ritual-grid {
  display: grid;
  gap: 14px;
  margin-top: 14px;
}

.card {
  margin-top: 14px;
  padding: 18px;
}

.ritual-grid .card {
  margin-top: 0;
}

.card-heading {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

.button-row {
  display: flex;
  gap: 8px;
}

.button-row button {
  padding: 0 14px;
}

.journal-card {
  background: linear-gradient(145deg, var(--pc-paper), var(--pc-blush));
}

.tarot-card {
  background: linear-gradient(145deg, var(--pc-paper), var(--pc-lilac));
}

.prompt-text,
.tarot-result p {
  margin: 14px 0 0;
  font-size: 1.05rem;
}

.tarot-name {
  font-family: var(--pc-title);
  font-size: 1.6rem;
}

.choice-list,
.task-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.choice,
.task-button {
  display: block;
  width: 100%;
  border: var(--pc-border) solid var(--pc-line);
  border-radius: var(--pc-radius-md);
  background: var(--pc-paper);
  padding: 12px;
  text-align: left;
}

.choice[aria-pressed="true"],
.task-button[aria-pressed="true"] {
  background: var(--pc-mint);
  border-color: var(--pc-sage);
}

.stamp-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 16px;
}

.stamp {
  display: grid;
  min-height: 72px;
  place-items: center;
  border: 2px dashed rgba(80, 53, 45, 0.28);
  border-radius: var(--pc-radius-md);
  background: var(--pc-vanilla);
  color: rgba(38, 34, 32, 0.62);
  font: 800 0.76rem var(--pc-body);
  text-align: center;
}

.stamp.is-stamped {
  border-style: solid;
  background: var(--pc-butter);
  color: var(--pc-ink);
  box-shadow: inset 0 0 0 4px rgba(255, 253, 247, 0.56);
}

@media (min-width: 780px) {
  .phone-shell {
    width: min(920px, calc(100% - 48px));
  }

  .ritual-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: no-preference) {
  button,
  .choice,
  .task-button,
  .stamp {
    transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
  }

  button:hover,
  .choice:hover,
  .task-button:hover {
    transform: translateY(-1px);
  }
}
```

- [ ] **Step 3: Create the project README**

Create `projects/07-morning-ritual-dashboard/README.md`:

```markdown
# Morning Ritual Dashboard

## Objective

This project builds a mobile-first Morning Ritual dashboard designed to help start the day without opening multiple distracting apps.

## Core Features

- Journal prompt library
- Tarot reflection pull
- 5-10 minute meditation picker
- Podcast pick for a dog walk
- Morning routine checklist
- Morning ritual stamp card
- Weekly joy stamp card for non-work activities

## Routine Supported

- No app opening
- Gua sha / face routine
- Vibration plate
- Journal
- Meditate
- Red light during meditation
- Walk dog
- Skin again

## Design Direction

The visual style uses a soft punch-card aesthetic with cream paper, pastel accents, rounded cards, warm shadows, and playful stamp states.

## Portfolio Value

This project shows how personal routines can become product concepts. It combines AI-assisted ideation, mobile-first UX design, local state management, and reflective product thinking.

## How To Run

Open `index.html` in a browser, or run a local static server from this folder:

```bash
python3 -m http.server 8765
```

Then visit `http://127.0.0.1:8765/`.
```

- [ ] **Step 4: Open the static shell locally**

Run:

```bash
python3 -m http.server 8765
```

Expected: server starts from `projects/07-morning-ritual-dashboard/`.

Open `http://127.0.0.1:8765/`.

Expected: the dashboard shell loads with empty dynamic sections because `src/app.mjs` does not exist yet.

Stop the server after checking:

```bash
lsof -ti tcp:8765 | xargs kill
```

- [ ] **Step 5: Commit**

```bash
git add projects/07-morning-ritual-dashboard/index.html projects/07-morning-ritual-dashboard/styles.css projects/07-morning-ritual-dashboard/README.md
git commit -m "Add morning ritual dashboard shell"
```

---

### Task 4: Wire Browser Interactions And Persistence

**Files:**
- Create: `projects/07-morning-ritual-dashboard/src/app.mjs`
- Modify: `projects/07-morning-ritual-dashboard/styles.css`

**Interfaces:**
- Consumes: `data.mjs`, `ritual-engine.mjs`, `storage.mjs`
- Produces: visible journal prompt draw, tarot shuffle/pull, meditation choice, podcast choice, checklist toggle, morning stamps, weekly joy stamps, and reset behavior

- [ ] **Step 1: Confirm logic tests still pass before wiring UI**

Run:

```bash
node --test projects/07-morning-ritual-dashboard/tests/*.test.mjs
```

Expected: PASS for 12 tests.

- [ ] **Step 2: Add browser app wiring**

Create `projects/07-morning-ritual-dashboard/src/app.mjs`:

```js
import {
  journalPrompts,
  meditations,
  morningTasks,
  podcasts,
  tarotCards,
  weeklyJoyActivities
} from "./data.mjs";
import {
  buildStampSlots,
  getCompletionCount,
  getTodayKey,
  pickByIndex,
  toggleCompletion
} from "./ritual-engine.mjs";
import { createMemoryStorage, loadJson, removeJson, saveJson } from "./storage.mjs";

const storage = safeStorage();
const todayKey = getTodayKey();
const stateKey = `morning-ritual:${todayKey}`;
const weeklyKey = "morning-ritual:weekly-joy";

const defaultState = {
  promptIndex: 0,
  tarotIndex: null,
  tarotShuffleCount: 0,
  meditationId: meditations[0].id,
  podcastId: podcasts[0].id,
  completedTasks: {}
};

let state = {
  ...defaultState,
  ...loadJson(storage, stateKey, defaultState)
};

let weeklyState = loadJson(storage, weeklyKey, {});

const elements = {
  todayLabel: document.querySelector("#today-label"),
  promptCategory: document.querySelector("#prompt-category"),
  promptText: document.querySelector("#prompt-text"),
  newPrompt: document.querySelector("#new-prompt"),
  shuffleTarot: document.querySelector("#shuffle-tarot"),
  pullTarot: document.querySelector("#pull-tarot"),
  tarotResult: document.querySelector("#tarot-result"),
  meditationOptions: document.querySelector("#meditation-options"),
  podcastOptions: document.querySelector("#podcast-options"),
  morningTaskList: document.querySelector("#morning-task-list"),
  morningStamps: document.querySelector("#morning-stamps"),
  joyStamps: document.querySelector("#joy-stamps"),
  resetRitual: document.querySelector("#reset-ritual")
};

function safeStorage() {
  try {
    const testKey = "__morning_ritual_test__";
    window.localStorage.setItem(testKey, "ok");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return createMemoryStorage();
  }
}

function persist() {
  saveJson(storage, stateKey, state);
  saveJson(storage, weeklyKey, weeklyState);
}

function renderPrompt() {
  const prompt = pickByIndex(journalPrompts, state.promptIndex);
  elements.promptCategory.textContent = prompt.category;
  elements.promptText.textContent = prompt.text;
}

function renderTarot() {
  if (state.tarotIndex === null) {
    elements.tarotResult.innerHTML = `
      <p class="tarot-name">Ready to pull</p>
      <p>Shuffle, pull one card, and use it as a reflection question.</p>
    `;
    return;
  }

  const card = pickByIndex(tarotCards, state.tarotIndex);
  elements.tarotResult.innerHTML = `
    <p class="tarot-name">${card.name}</p>
    <p><strong>${card.meaning}</strong></p>
    <p>${card.reflection}</p>
  `;
}

function renderChoices(container, items, selectedId, onSelect) {
  container.innerHTML = "";

  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.setAttribute("aria-pressed", String(item.id === selectedId));
    button.textContent = formatChoiceLabel(item);
    button.addEventListener("click", () => onSelect(item.id));
    container.append(button);
  });
}

function formatChoiceLabel(item) {
  if ("durationMinutes" in item) {
    return `${item.durationMinutes} min · ${item.title}`;
  }

  if ("mood" in item) {
    return `${item.title} · ${item.mood}`;
  }

  return item.label;
}

function renderTasks() {
  elements.morningTaskList.innerHTML = "";

  morningTasks.forEach((task) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "task-button";
    button.setAttribute("aria-pressed", String(Boolean(state.completedTasks[task.id])));
    button.textContent = task.label;
    button.addEventListener("click", () => {
      state.completedTasks = toggleCompletion(state.completedTasks, task.id);
      persist();
      render();
    });
    elements.morningTaskList.append(button);
  });
}

function renderStampGrid(container, items, completed, onToggle) {
  container.innerHTML = "";

  buildStampSlots(items, completed).forEach((slot) => {
    const item = items.find((candidate) => candidate.id === slot.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = slot.stamped ? "stamp is-stamped" : "stamp";
    button.setAttribute("aria-pressed", String(slot.stamped));
    button.textContent = slot.stamped ? `${item.label} ✓` : item.label;
    button.addEventListener("click", () => onToggle(item.id));
    container.append(button);
  });
}

function render() {
  elements.todayLabel.textContent = `Morning ritual · ${todayKey}`;
  renderPrompt();
  renderTarot();
  renderChoices(elements.meditationOptions, meditations, state.meditationId, (id) => {
    state.meditationId = id;
    persist();
    render();
  });
  renderChoices(elements.podcastOptions, podcasts, state.podcastId, (id) => {
    state.podcastId = id;
    persist();
    render();
  });
  renderTasks();
  renderStampGrid(elements.morningStamps, morningTasks, state.completedTasks, (id) => {
    state.completedTasks = toggleCompletion(state.completedTasks, id);
    persist();
    render();
  });
  renderStampGrid(elements.joyStamps, weeklyJoyActivities, weeklyState, (id) => {
    weeklyState = toggleCompletion(weeklyState, id);
    persist();
    render();
  });

  document.documentElement.style.setProperty("--completion-count", getCompletionCount(state.completedTasks));
}

elements.newPrompt.addEventListener("click", () => {
  state.promptIndex += 1;
  persist();
  render();
});

elements.shuffleTarot.addEventListener("click", () => {
  state.tarotShuffleCount += 1;
  state.tarotIndex = null;
  elements.tarotResult.classList.add("is-shuffling");
  window.setTimeout(() => {
    elements.tarotResult.classList.remove("is-shuffling");
    persist();
    render();
  }, 300);
});

elements.pullTarot.addEventListener("click", () => {
  state.tarotIndex = state.tarotShuffleCount + new Date().getSeconds();
  persist();
  render();
});

elements.resetRitual.addEventListener("click", () => {
  state = { ...defaultState, completedTasks: {} };
  weeklyState = {};
  removeJson(storage, stateKey);
  removeJson(storage, weeklyKey);
  render();
});

render();
```

- [ ] **Step 3: Add shuffle motion styles**

Append to `projects/07-morning-ritual-dashboard/styles.css`:

```css
.tarot-result.is-shuffling {
  animation: shuffle-card 300ms ease;
}

@keyframes shuffle-card {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  35% {
    transform: translateX(-6px) rotate(-1deg);
  }
  70% {
    transform: translateX(6px) rotate(1deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 4: Run logic tests**

Run:

```bash
node --test projects/07-morning-ritual-dashboard/tests/*.test.mjs
```

Expected: PASS for 12 tests.

- [ ] **Step 5: Run local dashboard smoke test**

Run:

```bash
python3 -m http.server 8765
```

From `projects/07-morning-ritual-dashboard/`, open `http://127.0.0.1:8765/`.

Expected:

- New prompt button changes prompt text.
- Shuffle briefly animates tarot result.
- Pull shows a tarot card name, meaning, and reflection.
- Meditation buttons toggle selected state.
- Podcast buttons toggle selected state.
- Morning task buttons toggle selected state.
- Morning stamps mirror morning task completion.
- Weekly joy stamps toggle independently.
- Reset clears selections and stamps.

Stop the server:

```bash
lsof -ti tcp:8765 | xargs kill
```

- [ ] **Step 6: Commit**

```bash
git add projects/07-morning-ritual-dashboard/src/app.mjs projects/07-morning-ritual-dashboard/styles.css
git commit -m "Wire morning ritual dashboard interactions"
```

---

### Task 5: Link Project Into Portfolio Documentation

**Files:**
- Modify: `README.md`
- Modify: `portfolio-overview.md`

**Interfaces:**
- Consumes: completed project folder at `projects/07-morning-ritual-dashboard/`
- Produces: portfolio navigation that explains the build phase after research

- [ ] **Step 1: Update main README project structure**

Modify the `projects/` tree in `README.md` so it includes:

```text
│   ├── 05-personal-hobby-widgets/
│   ├── 06-iphone-widget-research/
│   └── 07-morning-ritual-dashboard/
```

- [ ] **Step 2: Update main README featured projects table**

Add this row to the Featured Projects table in `README.md`:

```markdown
| Morning Ritual Dashboard | Mobile-first personal ritual app | Journal prompts, tarot pull, meditation picker, checklist, stamp cards |
```

- [ ] **Step 3: Update main README review order**

Add this item before `git-workflow.md` in the “How To Review This Portfolio” list:

```markdown
7. Review `projects/07-morning-ritual-dashboard/` for the mobile-first ritual dashboard build.
```

Renumber the final Git workflow item to `8`.

- [ ] **Step 4: Update portfolio overview**

Add this paragraph to `portfolio-overview.md` after the paragraph about `projects/06-iphone-widget-research/`:

```markdown
The `projects/07-morning-ritual-dashboard/` section turns the research into a working mobile-first artifact. It shows how a personal morning routine can become a product concept with local data, interaction design, state persistence, and a playful stamp-card mechanic.
```

- [ ] **Step 5: Commit documentation updates**

```bash
git add README.md portfolio-overview.md
git commit -m "Document morning ritual dashboard project"
```

---

### Task 6: Final Validation And GitHub Push

**Files:**
- Validate: all files under `projects/07-morning-ritual-dashboard/`
- Validate: `README.md`
- Validate: `portfolio-overview.md`

**Interfaces:**
- Consumes: all previous tasks
- Produces: pushed GitHub repository with complete phase-one dashboard

- [ ] **Step 1: Run all dashboard tests**

```bash
node --test projects/07-morning-ritual-dashboard/tests/*.test.mjs
```

Expected: PASS for 12 tests.

- [ ] **Step 2: Validate local server response**

Run from `projects/07-morning-ritual-dashboard/`:

```bash
python3 -m http.server 8765
```

In another terminal:

```bash
curl -I http://127.0.0.1:8765/
```

Expected: `HTTP/1.0 200 OK`.

Stop the server:

```bash
lsof -ti tcp:8765 | xargs kill
```

- [ ] **Step 3: Check git status**

```bash
git status --short
```

Expected: no output.

- [ ] **Step 4: Push to GitHub**

```bash
git push
```

Expected: `main -> main`.

- [ ] **Step 5: Verify remote**

```bash
git log --oneline --decorate -5
gh repo view ctessan-png/ai-product-portfolio --json url,defaultBranchRef,visibility
```

Expected:

- latest local commit appears on `main`
- repository URL is `https://github.com/ctessan-png/ai-product-portfolio`
- default branch is `main`
- visibility is `PUBLIC`

---

## Self-Review

### Spec Coverage

- Mobile-first dashboard: Task 3 and Task 4.
- Journal prompt library: Task 1 data and Task 4 interaction.
- Tarot shuffle/pull: Task 1 data and Task 4 interaction.
- 5-10 minute meditation picker: Task 1 data and Task 4 interaction.
- Morning checklist with actual routine: Task 1 data and Task 4 interaction.
- Stamp cards: Task 1 logic and Task 4 interaction.
- Local persistence: Task 2 and Task 4.
- Punch-card visual style: Task 3 CSS and Task 4 stamp states.
- Documentation and portfolio integration: Task 5.
- Final validation and push: Task 6.

### Placeholder Scan

No implementation steps use incomplete placeholder language or missing function names.

### Type Consistency

Function names and data structures are consistent across tasks:

- `toggleCompletion`, `getCompletionCount`, and `buildStampSlots` are defined in Task 1 and consumed in Task 4.
- `createMemoryStorage`, `loadJson`, `saveJson`, and `removeJson` are defined in Task 2 and consumed in Task 4.
- DOM ids produced in Task 3 are consumed exactly in Task 4.
