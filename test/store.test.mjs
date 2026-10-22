import { test } from "node:test";
import assert from "node:assert/strict";
import { createStore } from "../lib/store.mjs";

test("a new store has never synced", () => {
  assert.equal(createStore().status().lastSyncedAt, null);
});

test("sync records when it happened", () => {
  const store = createStore({ now: () => new Date("2026-10-22T09:30:00Z") });
  assert.equal(store.sync().lastSyncedAt, "2026-10-22T09:30:00.000Z");
});
