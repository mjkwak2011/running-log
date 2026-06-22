import { NextRequest, NextResponse } from 'next/server';
import client from '../../../../lib/db';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await client.execute({ sql: 'DELETE FROM runs WHERE id = ?', args: [params.id] });
  return NextResponse.json({ success: true });
}
