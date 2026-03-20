#!/usr/bin/env node
const path = require('path');
process.chdir(path.resolve(__dirname, '..'));
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
}
require('child_process').execSync('npx prisma generate', { stdio: 'inherit' });
