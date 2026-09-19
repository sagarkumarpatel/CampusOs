import { Router } from 'express';
import { SubjectNotesController } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new SubjectNotesController();

router.get('/', authenticate, (req, res, next) => controller.getNotes(req, res, next));
router.post('/', authenticate, (req, res, next) => controller.addOrUpdateNote(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.updateNote(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.deleteNote(req, res, next));

export default router;
