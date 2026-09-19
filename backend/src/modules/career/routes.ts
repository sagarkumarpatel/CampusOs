import { Router } from 'express';
import { CareerController } from './controller';
import { authenticate, requireRole } from '../../middleware/auth';
import { uploadImage } from '../../utils/upload';

const router = Router();
const controller = new CareerController();

// Public opportunities list for all authenticated users
router.get('/', authenticate, (req, res, next) => controller.getOpportunities(req, res, next));

// Registration toggle actions (accessible by any authenticated user)
router.post('/:id/register', authenticate, (req, res, next) => controller.registerOpportunity(req, res, next));
router.delete('/:id/register', authenticate, (req, res, next) => controller.unregisterOpportunity(req, res, next));

// Placement Coordinator only management routes
router.post('/', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.createOpportunity(req, res, next));
router.post('/upload', authenticate, requireRole(['PLACEMENT_COORDINATOR']), uploadImage.single('banner'), (req, res, next) => controller.uploadBanner(req, res, next));
router.put('/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.updateOpportunity(req, res, next));
router.delete('/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.deleteOpportunity(req, res, next));
router.get('/:id/download', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.downloadRegisteredEmails(req, res, next));

export default router;
