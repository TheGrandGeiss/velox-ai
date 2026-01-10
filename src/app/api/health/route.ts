import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    await prisma.$connect();
    return Response.json({ status: 'DB connected' });
  } catch (error: any) {
    return Response.json(
      {
        status: 'DB error',
        error: error.message,
        dbUrl: process.env.DATABASE_URL ? 'exists' : 'missing',
      },
      { status: 500 }
    );
  }
}
