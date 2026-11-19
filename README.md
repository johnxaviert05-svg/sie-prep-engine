# SIE Study Engine

Live at https://sie-prep-engine.pages.dev/ — Cloudflare Pages redeploys on every push to `main`.

- `dist/index.html` — the whole app (questions, practice, mock exams).
- `functions/api/progress.js` — saves each user's progress under their email (D1 database `sie-progress`).
- `schema.sql` — database table; run once with `npx wrangler@4 d1 execute sie-progress --remote --file schema.sql`.

The email is the account: no password. On the same browser users stay signed in; on a new device they
enter the same email to pick up their progress. Anyone who knows a user's email can load or change that
user's progress — fine for study progress, not for anything sensitive.

Local test: `npx wrangler@4 d1 execute sie-progress --local --file schema.sql && npx wrangler@4 pages dev dist`
