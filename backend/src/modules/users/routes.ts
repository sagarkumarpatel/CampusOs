import { Router } from 'express';
import { UserController } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new UserController();

router.get('/profile', authenticate, (req, res) => controller.getProfile(req, res));
router.put('/profile', authenticate, (req, res) => controller.updateProfile(req, res));

import { requireRole } from '../../middleware/auth';

router.get('/', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.findAll(req, res));
router.post('/:id/mentor', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.assignMentorRole(req, res));
router.delete('/:id/mentor', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.removeMentorRole(req, res));
router.put('/password', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.updatePassword(req, res));

export default router;
