import prisma from '../../config/prisma';
import { TopicStatus } from '@prisma/client';

export class PlacementRepository {
  async getCategories() {
    return prisma.preparationCategory.findMany({
      include: {
        _count: {
          select: { topics: true },
        },
      },
    });
  }

  async getTopicsByCategory(categoryId: string, userId: string) {
    return prisma.preparationTopic.findMany({
      where: { categoryId },
      include: {
        progress: {
          where: { userId },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getUserProgressOverview(userId: string) {
    return prisma.preparationProgress.findMany({
      where: { userId },
    });
  }

  async upsertProgress(userId: string, topicId: string, status: TopicStatus, notes?: string) {
    return prisma.preparationProgress.upsert({
      where: {
        userId_topicId: {
          userId,
          topicId,
        },
      },
      update: {
        status,
        notes,
      },
      create: {
        userId,
        topicId,
        status,
        notes,
      },
    });
  }
}
