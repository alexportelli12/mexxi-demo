# mexxi-demo

A tiny notes app used to compare two pull requests for the same request, one
made by a plain agent run and one made through [mexxi](https://github.com/alexportelli12/mexxi).
Nothing here is real: the "cloud sync" only records a timestamp in memory.

```bash
npm start          # http://localhost:3000, or PORT=4000 npm start
npm run verify     # static checks and tests
```

## What's in it

- `/` lists the notes, and `/settings.html` holds the appearance and cloud
  sync settings.
- `GET /api/notes` returns the notes.
- `GET /api/status` returns the note count and when they were last synced.
- `POST /api/sync` records a sync now and returns the new status.

State lives in memory, so restarting the server resets it.

The two demo pull requests are labelled `demo`.
