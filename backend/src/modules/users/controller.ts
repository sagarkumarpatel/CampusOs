import { Request, Response } from 'express';
import { UserService } from './service';
import { z } from 'zod';

const userService = new UserService();

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  college: z.string().optional(),
  graduationYear: z.number().int().min(1900).max(2100).optional(),
  resumeUrl: z.string().url().optional().or(z.literal('')),
});

export class UserController {
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const profile = await userService.getProfile(userId);
      return res.json(profile);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const payload = updateProfileSchema.parse(req.body);
      const profile = await userService.updateProfile(userId, payload);
      return res.json(profile);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}
