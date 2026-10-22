import { test } from "node:test";
import assert from "node:assert/strict";
import { describeLastSync } from "../public/sync-time.js";

const now = new Date("2026-10-22T12:00:00Z");
const ago = (ms) => new Date(now - ms).toISOString();

test("a store that never synced says so", () => {
  assert.equal(describeLastSync(null, now), "Not synced yet");
});

test("the last sync reads in the largest whole unit", () => {
  assert.equal(describeLastSync(ago(5_000), now), "Last synced just now");
  assert.equal(describeLastSync(ago(60_000), now), "Last synced 1 minute ago");
  assert.equal(describeLastSync(ago(45 * 60_000), now), "Last synced 45 minutes ago");
  assert.equal(describeLastSync(ago(3 * 3_600_000), now), "Last synced 3 hours ago");
  assert.equal(describeLastSync(ago(2 * 86_400_000), now), "Last synced 2 days ago");
});

test("an unreadable timestamp is not shown as a time", () => {
  assert.equal(describeLastSync("yesterday-ish", now), "Last sync time unavailable");
});

test("a clock slightly ahead of the device still reads as just now", () => {
  assert.equal(describeLastSync(ago(-10_000), now), "Last synced just now");
});
