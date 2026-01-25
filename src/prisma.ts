// 1. Import from your CUSTOM path, not '@prisma/client'
import { PrismaClient } from '../src/generated/client';

export const runtime = 'nodejs';

// 2. Standard Singleton for Next.js & Auth.js v5 compatibility
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
