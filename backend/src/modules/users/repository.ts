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
            role: true,
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
            role: true,
          },
        },
      },
    });
  }
}
