import jwt from 'jsonwebtoken';
import prisma from '../../src/config/prisma';
import bcrypt from 'bcryptjs';

export async function createTestUser(override: any = {}) {
  const email = override.email || `test-${Date.now()}-${Math.random()}@example.com`;
  const password = override.password || 'password123';
  const role = override.role || 'STUDENT';
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const { password: _p, role: _r, ...safeOverride } = override;

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      roles: [role],
      profile: {
        create: {
          firstName: 'Test',
          lastName: 'User'
        }
      },
      ...safeOverride,
    },
  });
  
  return { user, password };
}

export function generateToken(userId: string, role = 'STUDENT') {
  return jwt.sign({ userId, email: 'test@example.com', roles: [role] }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  });
}
