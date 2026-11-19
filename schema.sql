-- Per-user progress for the SIE Study Engine (Cloudflare D1). Safe to re-run.
CREATE TABLE IF NOT EXISTS progress (
  email   TEXT PRIMARY KEY,   -- lowercased; acts as the account key
  data    TEXT NOT NULL,      -- JSON {engine, mock}
  updated INTEGER NOT NULL,   -- ms since epoch (client clock); newest write wins
  created INTEGER NOT NULL
);
