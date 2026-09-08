import { Request, Response } from 'express';
import { ResourcesService } from './service';
import { getCloudinary } from '../../config/cloudinary';

export class ResourcesController {
  private service = new ResourcesService();

  async getAllResources(_req: Request, res: Response) {
    try {
      const resources = await this.service.getAllResources();
      return res.json(resources);
    } catch (error: unknown) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Core Subject Notes
  async createSubjectNote(req: Request, res: Response) {
    try {
      const note = await this.service.createSubjectNote(req.body);
      return res.status(201).json(note);
    } catch (error: unknown) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async updateSubjectNote(req: Request, res: Response) {
    try {
      const note = await this.service.updateSubjectNote(req.params['id'] as string, req.body);
      return res.json(note);
    } catch (error: unknown) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async deleteSubjectNote(req: Request, res: Response) {
    try {
      await this.service.deleteSubjectNote(req.params['id'] as string);
      return res.json({ message: 'Subject note resource deleted successfully' });
    } catch (error: unknown) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Previous Year Questions
  async createPrevYearQuestion(req: Request, res: Response) {
    try {
      const pq = await this.service.createPrevYearQuestion(req.body);
      return res.status(201).json(pq);
    } catch (error: unknown) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async updatePrevYearQuestion(req: Request, res: Response) {
    try {
      const pq = await this.service.updatePrevYearQuestion(req.params['id'] as string, req.body);
      return res.json(pq);
    } catch (error: unknown) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async deletePrevYearQuestion(req: Request, res: Response) {
    try {
      await this.service.deletePrevYearQuestion(req.params['id'] as string);
      return res.json({ message: 'Previous year question resource deleted successfully' });
    } catch (error: unknown) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Interview Notes
  async createInterviewNote(req: Request, res: Response) {
    try {
      const note = await this.service.createInterviewNote(req.body);
      return res.status(201).json(note);
    } catch (error: unknown) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async updateInterviewNote(req: Request, res: Response) {
    try {
      const note = await this.service.updateInterviewNote(req.params['id'] as string, req.body);
      return res.json(note);
    } catch (error: unknown) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async deleteInterviewNote(req: Request, res: Response) {
    try {
      await this.service.deleteInterviewNote(req.params['id'] as string);
      return res.json({ message: 'Interview note resource deleted successfully' });
    } catch (error: unknown) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Cheat Sheets
  async createCheatSheet(req: Request, res: Response) {
    try {
      const cs = await this.service.createCheatSheet(req.body);
      return res.status(201).json(cs);
    } catch (error: unknown) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async updateCheatSheet(req: Request, res: Response) {
    try {
      const cs = await this.service.updateCheatSheet(req.params['id'] as string, req.body);
      return res.json(cs);
    } catch (error: unknown) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async deleteCheatSheet(req: Request, res: Response) {
    try {
      await this.service.deleteCheatSheet(req.params['id'] as string);
      return res.json({ message: 'Cheat sheet resource deleted successfully' });
    } catch (error: unknown) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Cloudinary image upload for Cheat Sheets
  async uploadCheatSheetImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }

      // Convert buffer to base64 for Cloudinary upload
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      const cloudinary = getCloudinary();
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'campusos/resources',
      });

      return res.json({ imageUrl: result.secure_url });
    } catch (error: unknown) {
      console.error('Error in uploadCheatSheetImage:', error);
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Image upload failed' });
    }
  }
}
