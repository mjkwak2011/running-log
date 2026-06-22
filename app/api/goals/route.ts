import { NextRequest, NextResponse } from 'next/server';
import client from '../../../lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  const result = await client.execute('SELECT * FROM running_goals ORDER BY updated_at DESC LIMIT 1');
  return NextResponse.json(result.rows[0] ?? null);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { weekly_distance, monthly_distance, target_race, target_race_time, target_race_date } = body;

  await client.execute('DELETE FROM running_goals');

  const id = randomUUID();
  const now = new Date().toISOString();
  await client.execute({
    sql: `INSERT INTO running_goals (id, weekly_distance, monthly_distance, target_race, target_race_time, target_race_date, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      weekly_distance ?? null,
      monthly_distance ?? null,
      target_race ?? null,
      target_race_time ?? null,
      target_race_date ?? null,
      now,
      now,
    ],
  });

  return NextResponse.json({ id, weekly_distance, monthly_distance, target_race, target_race_time, target_race_date, created_at: now, updated_at: now });
}
