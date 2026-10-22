// In-memory state for the demo: a few notes and the time they were last synced
// with the (pretend) cloud. Restarting the server resets it.
export function createStore({ now = () => new Date() } = {}) {
  const state = {
    notes: [
      { id: 1, title: "Groceries", body: "Milk, bread, ġbejniet" },
      { id: 2, title: "Ideas", body: "Try the new settings page" },
    ],
    lastSyncedAt: null,
  };

  return {
    notes: () => state.notes.map((note) => ({ ...note })),
    status: () => ({ noteCount: state.notes.length, lastSyncedAt: state.lastSyncedAt }),
    sync() {
      state.lastSyncedAt = now().toISOString();
      return this.status();
    },
  };
}
