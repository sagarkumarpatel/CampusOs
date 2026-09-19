import { Router } from 'express';
import { AuthController } from './controller';

const router = Router();
const controller = new AuthController();

router.post('/register', (req, res, next) => controller.register(req, res, next).catch(next));
router.post('/login', (req, res, next) => controller.login(req, res, next).catch(next));
router.post('/refresh', (req, res, next) => controller.refresh(req, res, next).catch(next));
router.post('/logout', (req, res, next) => controller.logout(req, res, next));
router.post('/google', (req, res, next) => controller.googleLogin(req, res, next).catch(next));

export default router;
