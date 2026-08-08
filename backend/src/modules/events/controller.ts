import { Request, Response } from 'express';
import { EventsService } from './service';
import { createEventSchema } from './schema';
import { getCloudinary } from '../../config/cloudinary';

const service = new EventsService();

export class EventsController {
  async getEvents(req: Request, res: Response) {
    try {
      const events = await service.getEvents();
      return res.json(events);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getUpcomingEvents(req: Request, res: Response) {
    try {
      const events = await service.getUpcomingEvents();
      return res.json(events);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getPastEvents(req: Request, res: Response) {
    try {
      const events = await service.getPastEvents();
      return res.json(events);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getEventById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const event = await service.getEventById(id);
      return res.json(event);
    } catch (error: any) {
      if (error.message === 'Event not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      // Check Zod payload
      const payload = createEventSchema.parse(req.body);
      const event = await service.createEvent(userId, payload);
      return res.status(201).json(event);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const role = req.user?.role;
      const id = req.params.id as string;
      if (!userId || !role) return res.status(401).json({ error: 'Unauthorized' });

      await service.deleteEvent(id, userId, role);
      return res.json({ message: 'Event deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Forbidden: Only Event Managers can delete events') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Event not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  // File upload to Cloudinary helper endpoint
  async uploadBanner(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }

      // Convert buffer to base64 for Cloudinary upload
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      // getCloudinary() reads env vars at call-time (after dotenv.config() has run)
      const cloudinary = getCloudinary();
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'campusos/events',
      });

      return res.json({ bannerImageUrl: result.secure_url });
    } catch (error: any) {
      console.error('Error in uploadBanner:', error);
      return res.status(500).json({ error: error.message || 'Image upload failed' });
    }
  }
}
