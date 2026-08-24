import { Router } from 'express';
import multer from 'multer';
import { EventsController } from './controller';
import { authenticate, requireRole } from '../../middleware/auth';

const router = Router();
const controller = new EventsController();

// Multer memory storage configuration for receiving banner file buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Student & Manager public/discovery routes
router.get('/', authenticate, (req, res) => controller.getEvents(req, res));
router.get('/upcoming', authenticate, (req, res) => controller.getUpcomingEvents(req, res));
router.get('/past', authenticate, (req, res) => controller.getPastEvents(req, res));
router.get('/:id', authenticate, (req, res) => controller.getEventById(req, res));

// Event Manager only routes
router.post('/', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.createEvent(req, res));
router.delete('/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.deleteEvent(req, res));
router.post('/upload', authenticate, requireRole(['PLACEMENT_COORDINATOR']), upload.single('banner'), (req, res) => controller.uploadBanner(req, res));

export default router;
