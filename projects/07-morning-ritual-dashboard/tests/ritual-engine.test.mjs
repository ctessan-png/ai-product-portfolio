import test from "node:test";
import assert from "node:assert/strict";
import {
  buildStampSlots,
  getCompletionCount,
  getTodayKey,
  getWeekKey,
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

test("getWeekKey returns a stable ISO week key", () => {
  assert.equal(getWeekKey(new Date("2026-06-23T08:15:00")), "2026-W26");
});

test("getWeekKey keeps one week together and rolls over on Monday", () => {
  assert.equal(getWeekKey(new Date("2026-06-28T22:00:00")), "2026-W26");
  assert.equal(getWeekKey(new Date("2026-06-29T06:00:00")), "2026-W27");
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
