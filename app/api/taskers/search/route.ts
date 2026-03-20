import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get('categoria');
    const ciudad = searchParams.get('ciudad');

    const users = await prisma.user.findMany({
      where: {
        role: 'TASKER',
        ...(ciudad ? { city: { contains: ciudad } } : {}),
      },
      include: {
        taskerProfile: true,
      },
    });

    let taskers = users;
    if (categoria) {
      taskers = users.filter((u) => {
        try {
          const services = JSON.parse(u.taskerProfile?.services || '[]');
          return Array.isArray(services) ? services.includes(categoria) : false;
        } catch {
          return false;
        }
      });
    }

    return NextResponse.json({
      taskers: taskers.map((t) => ({
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
        city: t.city,
        taskerProfile: t.taskerProfile,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al buscar' }, { status: 500 });
  }
}
