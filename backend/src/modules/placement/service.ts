import { PlacementRepository } from './repository';
import { TopicStatus } from '@prisma/client';

const repository = new PlacementRepository();

export class PlacementService {
  async getCategoriesOverview(userId: string) {
    const categories = await repository.getCategories();
    const userProgress = await repository.getUserProgressOverview(userId);

    // Group progress by topicId for easy lookup
    const progressMap = new Map(userProgress.map((p) => [p.topicId, p.status]));

    // Fetch all topics to check their category link
    const allTopics = await prisma?.preparationTopic.findMany({
      select: { id: true, categoryId: true },
    }) || [];

    const categoryStats = categories.map((cat) => {
      const catTopics = allTopics.filter((t) => t.categoryId === cat.id);
      const totalTopics = catTopics.length;
      
      const completedTopics = catTopics.filter(
        (t) => progressMap.get(t.id) === TopicStatus.COMPLETED
      ).length;

      const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

      return {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        totalTopics,
        completedTopics,
        progressPercent,
      };
    });

    return categoryStats;
  }

  async getTopicsForCategory(categoryId: string, userId: string) {
    const topics = await repository.getTopicsByCategory(categoryId, userId);
    
    return topics.map((topic) => {
      const progressEntry = topic.progress[0];
      return {
        id: topic.id,
        title: topic.title,
        difficulty: topic.difficulty,
        resourceUrl: topic.resourceUrl,
        status: progressEntry ? progressEntry.status : TopicStatus.NOT_STARTED,
        notes: progressEntry ? progressEntry.notes : null,
      };
    });
  }

  async updateTopicProgress(userId: string, topicId: string, status: TopicStatus, notes?: string) {
    return repository.upsertProgress(userId, topicId, status, notes);
  }

  async getOverallProgress(userId: string) {
    const allTopicsCount = await prisma?.preparationTopic.count() || 0;
    const completedCount = await prisma?.preparationProgress.count({
      where: {
        userId,
        status: TopicStatus.COMPLETED,
      },
    }) || 0;

    const progressPercent = allTopicsCount > 0 ? Math.round((completedCount / allTopicsCount) * 100) : 0;

    return {
      totalTopics: allTopicsCount,
      completedTopics: completedCount,
      progressPercent,
    };
  }
}

// Access prisma inside helper safely
import prisma from '../../config/prisma';
