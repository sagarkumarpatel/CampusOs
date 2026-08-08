import { Request, Response } from 'express';
import { SubjectNotesService } from './service';
import { subjectNoteSchema } from './schema';

const service = new SubjectNotesService();

export class SubjectNotesController {
  async getNotes(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const notes = await service.getNotes(userId);
      return res.json(notes);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async addOrUpdateNote(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const payload = subjectNoteSchema.parse(req.body);
      const note = await service.addOrUpdateNote(userId, payload.subject, payload.notesLink);
      return res.json(note);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async updateNote(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const id = req.params.id as string;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const payload = subjectNoteSchema.parse(req.body);
      const updatedNote = await service.updateNote(id, userId, payload.subject, payload.notesLink);
      return res.json(updatedNote);
    } catch (error: any) {
      if (error.message === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteNote(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const id = req.params.id as string;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await service.deleteNote(id, userId);
      return res.json({ message: 'Subject note deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}
