import { afterAll } from 'vitest';
import prisma from '../src/config/prisma';
import dotenv from 'dotenv';
import path from 'path';

// Override environment before anything else loads
dotenv.config({ path: path.resolve(__dirname, '../.env.test'), override: true });

afterAll(async () => {
  await prisma.$disconnect();
});
