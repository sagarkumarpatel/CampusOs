import { Request, Response } from 'express';
import { PlacementService } from './service';
import { updateProgressSchema } from './schema';

const service = new PlacementService();

export class PlacementController {
  async getCategories(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const overview = await service.getCategoriesOverview(userId);
      return res.json(overview);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getTopics(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const categoryId = req.params.categoryId as string;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (!categoryId) {
        return res.status(400).json({ error: 'Category ID is required' });
      }

      const topics = await service.getTopicsForCategory(categoryId, userId);
      return res.json(topics);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getOverallProgress(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const stats = await service.getOverallProgress(userId);
      return res.json(stats);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async updateProgress(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const topicId = req.params.topicId as string;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (!topicId) {
        return res.status(400).json({ error: 'Topic ID is required' });
      }

      const payload = updateProgressSchema.parse(req.body);
      
      const updated = await service.updateTopicProgress(
        userId,
        topicId,
        payload.status,
        payload.notes
      );

      return res.json(updated);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}
