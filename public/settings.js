import { describeLastSync } from "/sync-time.js";

const button = document.getElementById("sync");
const time = document.querySelector("#last-sync time");
const announcement = document.getElementById("sync-status");
const error = document.getElementById("sync-error");
// undefined until the status loads; null means the notes have never synced.
let lastSyncedAt;
let statusUnavailable = false;
// A sync that finishes before the first status load must win over it.
let syncedThisVisit = false;

function showLastSync() {
  if (lastSyncedAt === undefined && !statusUnavailable) return;
  const text = statusUnavailable ? "Last sync time unavailable" : describeLastSync(lastSyncedAt);
  // The periodic refresh rewrites the same words most of the time; leave the
  // node alone then.
  if (time.textContent !== text) time.textContent = text;
  const at = lastSyncedAt ? new Date(lastSyncedAt) : null;
  if (at && !Number.isNaN(at.getTime()) && !statusUnavailable) {
    time.dateTime = lastSyncedAt;
    time.title = at.toLocaleString();
  } else {
    time.removeAttribute("datetime");
    time.removeAttribute("title");
  }
}

async function loadStatus() {
  try {
    const response = await fetch("/api/status");
    if (!response.ok) throw new Error(`status ${response.status}`);
    const status = await response.json();
    if (syncedThisVisit) return;
    lastSyncedAt = status.lastSyncedAt;
  } catch {
    if (syncedThisVisit) return;
    statusUnavailable = true;
  }
  showLastSync();
}

button.addEventListener("click", async () => {
  button.disabled = true;
  button.textContent = "Syncing…";
  error.hidden = true;
  announcement.textContent = "";
  try {
    const response = await fetch("/api/sync", { method: "POST" });
    if (!response.ok) throw new Error(`sync ${response.status}`);
    ({ lastSyncedAt } = await response.json());
    syncedThisVisit = true;
    statusUnavailable = false;
    showLastSync();
    // Only a sync the user asked for is announced, not the clock ticking on.
    announcement.textContent = "Notes synced.";
  } catch {
    error.hidden = false;
  } finally {
    button.disabled = false;
    button.textContent = "Sync now";
  }
});

// Keep "2 minutes ago" honest while the page stays open.
setInterval(showLastSync, 30_000);
loadStatus();
