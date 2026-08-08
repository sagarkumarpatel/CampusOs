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
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async createResume(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const payload = resumeSchema.parse(req.body);
      const resume = await service.createResume(userId, payload.resumeLink);
      return res.status(201).json(resume);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      if (error.message === 'Resume already exists. Use PUT to update it.') {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
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
    } catch (error: any) {
      if (error.message === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      if (error.message === 'Resume not found') {
        return res.status(404).json({ error: 'Resume not found' });
      }
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteResume(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const id = req.params.id as string;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      await service.deleteResume(id, userId);
      return res.json({ message: 'Resume link deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      if (error.message === 'Resume not found') {
        return res.status(404).json({ error: 'Resume not found' });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}
