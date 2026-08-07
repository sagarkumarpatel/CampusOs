import { Router } from 'express';
import { DsaController } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new DsaController();

router.get('/dashboard', authenticate, (req, res) => controller.getDashboard(req, res));
router.get('/categories', authenticate, (req, res) => controller.getCategories(req, res));
router.get('/categories/:id/problems', authenticate, (req, res) => controller.getProblems(req, res));
router.post('/problems', authenticate, (req, res) => controller.createProblem(req, res));
router.put('/problems/:id', authenticate, (req, res) => controller.updateProblem(req, res));
router.delete('/problems/:id', authenticate, (req, res) => controller.deleteProblem(req, res));
router.patch('/problems/:id/status', authenticate, (req, res) => controller.updateStatus(req, res));

export default router;
