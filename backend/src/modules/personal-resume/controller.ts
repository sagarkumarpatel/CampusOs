import { Request, Response } from 'express';
import { PersonalResumeService } from './service';
import { resumeSchema } from './schema';

const service = new PersonalResumeService();

export class PersonalResumeController {
  async getResume(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const resume = await service.getResume(userId);
      return res.json(resume ?? null);
    } catch (error: unknown) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async createResume(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const payload = resumeSchema.parse(req.body);
      const resume = await service.createResume(userId, payload.resumeLink);
      return res.status(201).json(resume);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: (error as any).errors });
      }
      if ((error instanceof Error ? error.message : 'Unknown error') === 'Resume already exists. Use PUT to update it.') {
        return res.status(409).json({ error: error instanceof Error ? error.message : 'Unknown error' });
      }
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async updateResume(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const id = req.params.id as string;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const payload = resumeSchema.parse(req.body);
      const resume = await service.updateResume(id, userId, payload.resumeLink);
      return res.json(resume);
    } catch (error: unknown) {
      if ((error instanceof Error ? error.message : 'Unknown error') === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      if ((error instanceof Error ? error.message : 'Unknown error') === 'Resume not found') {
        return res.status(404).json({ error: 'Resume not found' });
      }
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: (error as any).errors });
      }
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async deleteResume(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const id = req.params.id as string;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      await service.deleteResume(id, userId);
      return res.json({ message: 'Resume link deleted successfully' });
    } catch (error: unknown) {
      if ((error instanceof Error ? error.message : 'Unknown error') === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      if ((error instanceof Error ? error.message : 'Unknown error') === 'Resume not found') {
        return res.status(404).json({ error: 'Resume not found' });
      }
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
