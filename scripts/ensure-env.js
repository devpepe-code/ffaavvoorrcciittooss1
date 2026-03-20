#!/usr/bin/env node
// Fallbacks para build en Vercel (solo pruebas - cambiar en producción)
const DB_URL = 'postgresql://neondb_owner:npg_XD60rlInmJuE@ep-icy-darkness-akvn4o13-pooler.c-3.us-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
if (!process.env.favoritosdatabase_POSTGRES_PRISMA_URL) {
  process.env.favoritosdatabase_POSTGRES_PRISMA_URL = DB_URL;
}
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = 'favorcitos-test-secret-cambiar-en-produccion';
}
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = 'https://ffaavvoorrcciittooss1.vercel.app';
}
