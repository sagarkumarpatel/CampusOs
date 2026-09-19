import { Router } from 'express';
import { DsaController } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new DsaController();

router.get('/dashboard', authenticate, (req, res, next) => controller.getDashboard(req, res, next));
router.get('/categories', authenticate, (req, res, next) => controller.getCategories(req, res, next));
router.get('/categories/:id/problems', authenticate, (req, res, next) => controller.getProblems(req, res, next));
router.post('/problems', authenticate, (req, res, next) => controller.createProblem(req, res, next));
router.put('/problems/:id', authenticate, (req, res, next) => controller.updateProblem(req, res, next));
router.delete('/problems/:id', authenticate, (req, res, next) => controller.deleteProblem(req, res, next));
router.patch('/problems/:id/status', authenticate, (req, res, next) => controller.updateStatus(req, res, next));

export default router;
