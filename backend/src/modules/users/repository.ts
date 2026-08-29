import prisma from '../../config/prisma';

export class UserRepository {
  async getProfile(userId: string) {
    return prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            roles: true,
          },
        },
      },
    });
  }

  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
      bio?: string;
      skills?: string[];
      college?: string;
      graduationYear?: number;
      resumeUrl?: string;
    }
  ) {
    return prisma.profile.update({
      where: { userId },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            roles: true,
          },
        },
      },
    });
  }

  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        roles: true,
        createdAt: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updateRoles(userId: string, roles: any[]) {
    return prisma.user.update({
      where: { id: userId },
      data: { roles },
      select: {
        id: true,
        email: true,
        roles: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updatePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}
