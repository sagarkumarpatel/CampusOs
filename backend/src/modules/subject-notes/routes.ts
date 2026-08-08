import { Router } from 'express';
import { SubjectNotesController } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new SubjectNotesController();

router.get('/', authenticate, (req, res) => controller.getNotes(req, res));
router.post('/', authenticate, (req, res) => controller.addOrUpdateNote(req, res));
router.put('/:id', authenticate, (req, res) => controller.updateNote(req, res));
router.delete('/:id', authenticate, (req, res) => controller.deleteNote(req, res));

export default router;
