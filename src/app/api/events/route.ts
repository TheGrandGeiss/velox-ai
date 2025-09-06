import { auth } from '@/lib/auth';
import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'unauthorized user' }, { status: 401 });
    }
    const events = await prisma.event.findMany({
      where: {
        profile: {
          userId: session?.user?.id,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'unexpected error found' },
      { status: 500 }
    );
  }
}
