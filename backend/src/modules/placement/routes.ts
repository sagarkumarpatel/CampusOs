import { Router } from 'express';
import { PlacementController } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new PlacementController();

router.get('/categories', authenticate, (req, res) => controller.getCategories(req, res));
router.get('/categories/:categoryId/topics', authenticate, (req, res) => controller.getTopics(req, res));
router.get('/progress', authenticate, (req, res) => controller.getOverallProgress(req, res));
router.put('/progress/:topicId', authenticate, (req, res) => controller.updateProgress(req, res));

export default router;
