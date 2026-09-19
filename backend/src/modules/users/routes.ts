import { Router } from 'express';
import { UserController } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new UserController();

router.get('/profile', authenticate, (req, res, next) => controller.getProfile(req, res, next));
router.put('/profile', authenticate, (req, res, next) => controller.updateProfile(req, res, next));

import { requireRole } from '../../middleware/auth';

router.get('/', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.findAll(req, res, next));
router.post('/:id/mentor', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.assignMentorRole(req, res, next));
router.delete('/:id/mentor', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.removeMentorRole(req, res, next));
router.put('/password', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.updatePassword(req, res, next));

export default router;
