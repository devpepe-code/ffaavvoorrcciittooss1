#!/usr/bin/env node
const path = require('path');
// Ensure we're in project root (where package.json is)
process.chdir(path.resolve(__dirname, '..'));
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
}
const { execSync } = require('child_process');
execSync('npx prisma generate', { stdio: 'inherit' });
execSync('npx next build', { stdio: 'inherit' });
