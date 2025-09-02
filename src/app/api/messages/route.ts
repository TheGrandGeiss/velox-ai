import { auth } from '@/lib/auth';

import { prisma } from '@/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    console.log('Session in GET:', session);

    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const chat = await prisma.message.findMany({
      where: {
        profile: {
          userId: session?.user?.id,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(
      {
        data: chat,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    console.log('Session in POST:', session);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!req) {
      return NextResponse.json(
        { error: 'No request provided' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { role, content } = body;

    // Validate input
    if (!role || !content) {
      return NextResponse.json(
        {
          error: 'Missing required fields: role and content are required',
        },
        { status: 400 }
      );
    }

    if (!['user', 'ai'].includes(role)) {
      return NextResponse.json(
        {
          error: 'Invalid role. Must be either "user" or "ai"',
        },
        { status: 400 }
      );
    }

    if (typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        {
          error: 'Content must be a non-empty string',
        },
        { status: 400 }
      );
    }

    const userProfile = await prisma.profile.findUnique({
      where: {
        userId: session.user?.id,
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        {
          error: 'User profile not found',
        },
        { status: 404 }
      );
    }

    const createdMessage = await prisma.message.create({
      data: {
        role,
        content: content.trim(),
        profile: {
          connect: {
            id: userProfile.id,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: createdMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
