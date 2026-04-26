import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { role } = await req.json();
  if (role !== 'CLIENTE' && role !== 'TASKER') {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const userId = (session.user as { id: string }).id;
  await prisma.user.update({ where: { id: userId }, data: { role } });

  return NextResponse.json({ ok: true });
}
