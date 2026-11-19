// GET  /api/progress?email=x          -> {exists, t, data}
// POST /api/progress {email, t, data} -> saved only if t is newer than what's stored
import { json } from "./_middleware.js";

const MAX_BODY = 1_000_000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanEmail(e) {
  e = String(e || "").trim().toLowerCase();
  return e.length <= 254 && EMAIL.test(e) ? e : null;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const email = cleanEmail(url.searchParams.get("email"));
  if (!email) return json({ error: "bad email" }, 400);
  const row = await env.DB.prepare("SELECT data, updated FROM progress WHERE email = ?1").bind(email).first();
  if (!row) return json({ exists: false });
  return json({ exists: true, t: row.updated, data: JSON.parse(row.data) });
}

export async function onRequestPost({ request, env }) {
  const text = await request.text();
  if (text.length > MAX_BODY) return json({ error: "too large" }, 413);
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: "bad json" }, 400);
  }
  const email = cleanEmail(body.email);
  if (!email) return json({ error: "bad email" }, 400);
  if (!Number.isFinite(body.t) || !body.data || typeof body.data !== "object") return json({ error: "bad body" }, 400);

  const res = await env.DB.prepare(
    `INSERT INTO progress (email, data, updated, created) VALUES (?1, ?2, ?3, ?4)
     ON CONFLICT(email) DO UPDATE SET data = excluded.data, updated = excluded.updated
     WHERE excluded.updated > progress.updated`
  ).bind(email, JSON.stringify(body.data), Math.floor(body.t), Date.now()).run();
  return json({ saved: res.meta.changes > 0 });
}
