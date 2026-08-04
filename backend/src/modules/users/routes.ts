import { Router } from 'express';
import { UserController } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new UserController();

router.get('/profile', authenticate, (req, res) => controller.getProfile(req, res));
router.put('/profile', authenticate, (req, res) => controller.updateProfile(req, res));

export default router;
