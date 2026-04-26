#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Fallbacks para build en Vercel (solo pruebas)
const DB_URL = process.env.favoritosdatabase_POSTGRES_PRISMA_URL ||
  'postgresql://neondb_owner:npg_XD60rlInmJuE@ep-icy-darkness-akvn4o13-pooler.c-3.us-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
const SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'favorcitos-secret-32chars-minimum!!';
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'https://ffaavvoorrcciittooss1.vercel.app';

// Escribir .env para que Prisma y Next.js lo lean
const envContent = [
  `favoritosdatabase_POSTGRES_PRISMA_URL=${DB_URL}`,
  `AUTH_SECRET=${SECRET}`,
  `NEXTAUTH_SECRET=${SECRET}`,
  `NEXTAUTH_URL=${NEXTAUTH_URL}`,
  `AUTH_URL=${NEXTAUTH_URL}`,
].join('\n');

const envPath = path.join(process.cwd(), '.env');
fs.writeFileSync(envPath, envContent);
