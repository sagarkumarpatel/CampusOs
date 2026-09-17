import { execSync } from 'child_process';
import path from 'path';

export default async function globalSetup() {
  console.log('Pushing schema to test database...');
  try {
    execSync('npx dotenv -e .env.test -- npx prisma db push --skip-generate --accept-data-loss', { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
  } catch (error) {
    console.error('Failed to push database schema', error);
    throw error;
  }
}
