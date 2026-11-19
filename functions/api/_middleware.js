// Progress API. The email is the account key — no password, by design: anyone
// who knows a user's email can load or overwrite that user's study progress.
export async function onRequest({ env, next }) {
  if (!env.DB) return json({ error: "sync not configured" }, 503);
  return next();
}

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
