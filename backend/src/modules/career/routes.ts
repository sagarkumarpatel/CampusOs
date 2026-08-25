import { Router } from 'express';
import { CareerController } from './controller';
import { authenticate, requireRole } from '../../middleware/auth';
import multer from 'multer';

const router = Router();
const controller = new CareerController();
const upload = multer({ storage: multer.memoryStorage() });

// Public opportunities list for all authenticated users
router.get('/', authenticate, (req, res) => controller.getOpportunities(req, res));

// Registration toggle actions (accessible by any authenticated user)
router.post('/:id/register', authenticate, (req, res) => controller.registerOpportunity(req, res));
router.delete('/:id/register', authenticate, (req, res) => controller.unregisterOpportunity(req, res));

// Placement Coordinator only management routes
router.post('/', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.createOpportunity(req, res));
router.post('/upload', authenticate, requireRole(['PLACEMENT_COORDINATOR']), upload.single('banner'), (req, res) => controller.uploadBanner(req, res));
router.put('/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.updateOpportunity(req, res));
router.delete('/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.deleteOpportunity(req, res));
router.get('/:id/download', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.downloadRegisteredEmails(req, res));

export default router;
