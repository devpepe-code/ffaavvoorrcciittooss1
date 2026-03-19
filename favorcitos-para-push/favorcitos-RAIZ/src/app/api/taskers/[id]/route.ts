import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id, role: 'TASKER' },
      include: { taskerProfile: true },
    });
    if (!user) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      taskerProfile: user.taskerProfile,
    });
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
