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
    } catch (error: unknown) {
      return res.status(404).json({ error: error instanceof Error ? error.message : 'Unknown error' });
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
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: (error as any).errors });
      }
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async findAll(_req: Request, res: Response) {
    try {
      const users = await userService.findAll();
      return res.json(users);
    } catch (error: unknown) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async assignMentorRole(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const user = await userService.assignMentorRole(id);
      return res.json(user);
    } catch (error: unknown) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async removeMentorRole(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const user = await userService.removeMentorRole(id);
      return res.json(user);
    } catch (error: unknown) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      const { password } = req.body;
      if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
      
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      
      await userService.updatePassword(userId, hash);
      return res.json({ message: 'Password updated successfully' });
    } catch (error: unknown) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
