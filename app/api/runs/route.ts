import { NextRequest, NextResponse } from 'next/server';
import client from '../../../lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  const result = await client.execute('SELECT * FROM runs ORDER BY date DESC, created_at DESC');
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const { date, distance, duration, notes } = await req.json();
  const id = randomUUID();
  const created_at = new Date().toISOString();
  await client.execute({
    sql: 'INSERT INTO runs (id, date, distance, duration, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    args: [id, date, distance, duration, notes || '', created_at],
  });
  return NextResponse.json({ id, date, distance, duration, notes: notes || '', created_at });
}
