const button = document.getElementById("sync");
const lastSynced = document.getElementById("last-synced");

// Shows when the notes were last synced, in the reader's locale, with the
// exact ISO timestamp kept on the <time> element for tooltips and assistive tech.
function showLastSynced(lastSyncedAt) {
  if (!lastSyncedAt) {
    lastSynced.textContent = "Never synced";
    return;
  }
  const time = document.createElement("time");
  time.dateTime = lastSyncedAt;
  time.title = lastSyncedAt;
  time.textContent = new Date(lastSyncedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  lastSynced.replaceChildren("Last synced ", time);
}

async function readStatus(request) {
  const response = await fetch(request.url, request.init);
  if (!response.ok) throw new Error(`${request.url} answered ${response.status}`);
  return response.json();
}

button.addEventListener("click", async () => {
  button.disabled = true;
  try {
    showLastSynced((await readStatus({ url: "/api/sync", init: { method: "POST" } })).lastSyncedAt);
  } catch {
    lastSynced.textContent = "Sync failed. Try again.";
  } finally {
    button.disabled = false;
  }
});

try {
  showLastSynced((await readStatus({ url: "/api/status" })).lastSyncedAt);
} catch {
  lastSynced.textContent = "Couldn't load the last sync time";
}
