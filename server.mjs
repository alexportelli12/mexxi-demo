// A dependency-free server: static files from public/ and a small JSON API.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createStore } from "./lib/store.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "public");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript" };

export function createApp(store = createStore()) {
  return createServer(async (request, response) => {
    const url = new URL(request.url, "http://localhost");
    const json = (status, body) => {
      response.writeHead(status, { "content-type": "application/json" });
      response.end(JSON.stringify(body));
    };
    if (url.pathname === "/api/notes" && request.method === "GET") return json(200, store.notes());
    if (url.pathname === "/api/status" && request.method === "GET") return json(200, store.status());
    if (url.pathname === "/api/sync" && request.method === "POST") return json(200, store.sync());
    if (url.pathname.startsWith("/api/")) return json(404, { error: "not found" });

    const file = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
    const resolved = path.join(root, path.normalize(file));
    if (!resolved.startsWith(root)) return json(400, { error: "bad path" });
    try {
      const body = await readFile(resolved);
      response.writeHead(200, { "content-type": types[path.extname(resolved)] ?? "application/octet-stream" });
      response.end(body);
    } catch {
      response.writeHead(404, { "content-type": "text/plain" });
      response.end("Not found");
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 3000);
  createApp().listen(port, () => console.log(`mexxi-demo on http://localhost:${port}`));
}
