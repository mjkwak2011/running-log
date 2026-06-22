import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_URL!,
  authToken: process.env.TURSO_TOKEN!,
});

export async function initializeDatabase() {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS runs (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      distance REAL NOT NULL,
      duration INTEGER NOT NULL,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS running_goals (
      id TEXT PRIMARY KEY,
      weekly_distance REAL,
      monthly_distance REAL,
      target_race TEXT,
      target_race_time INTEGER,
      target_race_date TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

export default client;
