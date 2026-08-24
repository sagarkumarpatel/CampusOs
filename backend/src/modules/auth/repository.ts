import prisma from '../../config/prisma';
import { Role } from '@prisma/client';

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  async createUser(email: string, passwordHash: string, role: Role, firstName: string, lastName: string) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role,
        },
      });

      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
        },
      });

      return { ...user, profile };
    });
  }

  async createRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteRefreshToken(token: string) {
    return prisma.refreshToken.deleteMany({
      where: { token },
    });
  }

  async deleteUserRefreshTokens(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async findPlacementCoordinator() {
    return prisma.user.findFirst({
      where: { role: Role.PLACEMENT_COORDINATOR },
    });
  }
}
