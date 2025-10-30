#!/usr/bin/env node

const { execSync } = require('node:child_process');

try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✅ Database migrations applied successfully');
} catch (error) {
  console.error('❌ Failed to run migrations', error);
  process.exit(1);
}
