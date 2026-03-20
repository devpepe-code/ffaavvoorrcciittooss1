#!/usr/bin/env node
// Set DATABASE_URL for Prisma generate if not set (Vercel build)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
}
