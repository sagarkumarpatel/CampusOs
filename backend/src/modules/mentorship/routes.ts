import { Router } from 'express';
import { MentorshipController } from './controller';
import { authenticate, requireRole } from '../../middleware/auth';

const router = Router();
const controller = new MentorshipController();

router.get('/', authenticate, (req, res, next) => controller.getMentors(req, res, next));
router.get('/profile', authenticate, (req, res, next) => controller.getOwnProfile(req, res, next));
router.post('/profile', authenticate, requireRole(['MENTOR', 'PLACEMENT_COORDINATOR']), (req, res, next) => controller.setupProfile(req, res, next));
router.post('/:mentorId/request', authenticate, (req, res, next) => controller.sendRequest(req, res, next));
router.get('/requests', authenticate, (req, res, next) => controller.getMyRequests(req, res, next));
router.put('/requests/:requestId', authenticate, (req, res, next) => controller.handleRequest(req, res, next));

export default router;
