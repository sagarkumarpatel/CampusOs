import { Request, Response } from 'express';
import { DsaService } from './service';
import { problemSchema, statusSchema } from './schema';

const service = new DsaService();

export class DsaController {
  async getDashboard(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const stats = await service.getDsaDashboard(userId);
      return res.json(stats);
    } catch (error: unknown) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const categories = await service.getCategoriesList(userId);
      return res.json(categories);
    } catch (error: unknown) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async getProblems(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const categoryId = req.params.id as string;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const problems = await service.getCategoryProblems(categoryId, userId);
      return res.json(problems);
    } catch (error: unknown) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async createProblem(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const payload = problemSchema.parse(req.body);
      const newProblem = await service.addProblem(
        userId,
        payload.categoryId,
        payload.problemName,
        payload.problemLink,
        payload.difficulty
      );

      return res.status(201).json(newProblem);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: (error as any).errors });
      }
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async updateProblem(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const problemId = req.params.id as string;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const payload = problemSchema.parse(req.body);
      const updatedProblem = await service.updateProblem(
        problemId,
        userId,
        payload.categoryId,
        payload.problemName,
        payload.problemLink,
        payload.difficulty
      );

      return res.json(updatedProblem);
    } catch (error: unknown) {
      if ((error instanceof Error ? error.message : 'Unknown error') === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: (error as any).errors });
      }
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async deleteProblem(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const problemId = req.params.id as string;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await service.deleteProblem(problemId, userId);
      return res.json({ message: 'Problem deleted successfully' });
    } catch (error: unknown) {
      if ((error instanceof Error ? error.message : 'Unknown error') === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const problemId = req.params.id as string;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const payload = statusSchema.parse(req.body);
      const updatedStatus = await service.updateProblemStatus(
        userId,
        problemId,
        payload.completed
      );

      return res.json(updatedStatus);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: (error as any).errors });
      }
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
