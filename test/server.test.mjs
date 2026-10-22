import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../server.mjs";

test("the API reports status and syncs", async (t) => {
  const app = createApp().listen(0);
  t.after(() => app.close());
  const base = `http://localhost:${app.address().port}`;
  assert.equal((await (await fetch(`${base}/api/status`)).json()).lastSyncedAt, null);
  const synced = await (await fetch(`${base}/api/sync`, { method: "POST" })).json();
  assert.match(synced.lastSyncedAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal((await fetch(`${base}/settings.html`)).status, 200);
});
