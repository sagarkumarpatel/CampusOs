import { Router } from 'express';
import { MentorshipController } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new MentorshipController();

router.get('/', authenticate, (req, res) => controller.getMentors(req, res));
router.get('/profile', authenticate, (req, res) => controller.getOwnProfile(req, res));
router.post('/profile', authenticate, (req, res) => controller.setupProfile(req, res));
router.post('/:mentorId/request', authenticate, (req, res) => controller.sendRequest(req, res));
router.get('/requests', authenticate, (req, res) => controller.getMyRequests(req, res));
router.put('/requests/:requestId', authenticate, (req, res) => controller.handleRequest(req, res));

export default router;
