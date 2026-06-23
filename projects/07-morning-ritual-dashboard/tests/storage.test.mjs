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
