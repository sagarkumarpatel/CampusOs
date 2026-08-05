import { Request, Response } from 'express';
import { MentorshipService } from './service';
import { createMentorProfileSchema, requestMentorshipSchema, updateRequestStatusSchema } from './schema';
import { RequestStatus } from '@prisma/client';

const service = new MentorshipService();

export class MentorshipController {
  async getMentors(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const list = await service.getMentorsList(userId);
      return res.json(list);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getOwnProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const profile = await service.getOwnMentorProfile(userId);
      return res.json(profile);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async setupProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const payload = createMentorProfileSchema.parse(req.body);
      const profile = await service.setupMentorProfile(userId, payload);
      
      return res.json(profile);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async sendRequest(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const mentorId = req.params.mentorId as string;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (!mentorId) {
        return res.status(400).json({ error: 'Mentor ID is required' });
      }

      const payload = requestMentorshipSchema.parse(req.body);
      const request = await service.sendMentorshipRequest(userId, mentorId, payload.message);

      return res.status(201).json(request);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  async getMyRequests(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const lists = await service.getUserRequests(userId);
      return res.json(lists);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async handleRequest(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const requestId = req.params.requestId as string;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (!requestId) {
        return res.status(400).json({ error: 'Request ID is required' });
      }

      const payload = updateRequestStatusSchema.parse(req.body);
      
      const updated = await service.handleRequestStatus(
        userId,
        requestId,
        payload.status as RequestStatus
      );

      return res.json(updated);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}
