import { Request, Response } from 'express';
import { CareerService } from './service';
import { getCloudinary } from '../../config/cloudinary';

export class CareerController {
  private service = new CareerService();

  async getOpportunities(req: Request, res: Response) {
    try {
      const userId = req.user?.userId || '';
      const opportunities = await this.service.getOpportunities(userId);
      return res.json(opportunities);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async createOpportunity(req: Request, res: Response) {
    try {
      const createdById = req.user?.userId || '';
      const opportunity = await this.service.createOpportunity(req.body, createdById);
      return res.status(201).json(opportunity);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateOpportunity(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string;
      const opportunity = await this.service.updateOpportunity(id, req.body);
      return res.json(opportunity);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deleteOpportunity(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string;
      await this.service.deleteOpportunity(id);
      return res.json({ message: 'Opportunity deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async registerOpportunity(req: Request, res: Response) {
    try {
      const opportunityId = req.params['id'] as string;
      const userId = req.user?.userId || '';
      const email = req.user?.email || '';

      const result = await this.service.registerOpportunity(opportunityId, userId, email);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async unregisterOpportunity(req: Request, res: Response) {
    try {
      const opportunityId = req.params['id'] as string;
      const userId = req.user?.userId || '';

      const result = await this.service.unregisterOpportunity(opportunityId, userId);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async downloadRegisteredEmails(req: Request, res: Response) {
    try {
      const opportunityId = req.params['id'] as string;
      const { csvContent, filename } = await this.service.downloadRegisteredEmails(opportunityId);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(csvContent);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async uploadBanner(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No banner image file uploaded' });
      }

      // Convert buffer to base64 for Cloudinary upload
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      const cloudinary = getCloudinary();
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'campusos/career',
      });

      return res.json({ imageUrl: result.secure_url });
    } catch (error: any) {
      console.error('Error in uploadBanner:', error);
      return res.status(500).json({ error: error.message || 'Image upload failed' });
    }
  }
}
