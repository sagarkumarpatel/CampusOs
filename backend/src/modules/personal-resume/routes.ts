import { Router } from 'express';
import { PersonalResumeController } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new PersonalResumeController();

router.get('/', authenticate, (req, res) => controller.getResume(req, res));
router.post('/', authenticate, (req, res) => controller.createResume(req, res));
router.put('/:id', authenticate, (req, res) => controller.updateResume(req, res));
router.delete('/:id', authenticate, (req, res) => controller.deleteResume(req, res));

export default router;
