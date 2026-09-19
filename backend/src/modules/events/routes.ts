import { Router } from 'express';
import { uploadImage } from '../../utils/upload';
import { EventsController } from './controller';
import { authenticate, requireRole } from '../../middleware/auth';

const router = Router();
const controller = new EventsController();

// Student & Manager public/discovery routes
router.get('/', authenticate, (req, res, next) => controller.getAll(req, res, next));
router.get('/upcoming', authenticate, (req, res, next) => controller.getUpcomingEvents(req, res, next));
router.get('/past', authenticate, (req, res, next) => controller.getPastEvents(req, res, next));
router.get('/:id', authenticate, (req, res, next) => controller.getEventById(req, res, next));

// Event Manager only routes
router.post('/', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.createEvent(req, res, next));
router.delete('/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.deleteEvent(req, res, next));
router.post('/upload', authenticate, requireRole(['PLACEMENT_COORDINATOR']), uploadImage.single('banner'), (req, res, next) => controller.uploadBanner(req, res, next));

export default router;
