// How the Settings page words the last sync. Kept free of the DOM so it can be
// tested in Node.
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function describeLastSync(lastSyncedAt, now = new Date()) {
  if (!lastSyncedAt) return "Not synced yet";
  const at = new Date(lastSyncedAt);
  if (Number.isNaN(at.getTime())) return "Last sync time unavailable";
  const elapsed = Math.max(0, now - at);
  if (elapsed < MINUTE) return "Last synced just now";
  if (elapsed < HOUR) return `Last synced ${plural(Math.floor(elapsed / MINUTE), "minute")} ago`;
  if (elapsed < DAY) return `Last synced ${plural(Math.floor(elapsed / HOUR), "hour")} ago`;
  return `Last synced ${plural(Math.floor(elapsed / DAY), "day")} ago`;
}

const plural = (count, unit) => `${count} ${unit}${count === 1 ? "" : "s"}`;
