import { Router } from 'express';
import { PersonalResumeController } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new PersonalResumeController();

router.get('/', authenticate, (req, res, next) => controller.getResume(req, res, next));
router.post('/', authenticate, (req, res, next) => controller.createResume(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.updateResume(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.deleteResume(req, res, next));

export default router;
