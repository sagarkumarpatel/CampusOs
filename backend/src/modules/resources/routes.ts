import { Router } from 'express';
import { ResourcesController } from './controller';
import { authenticate, requireRole } from '../../middleware/auth';
import multer from 'multer';

const router = Router();
const controller = new ResourcesController();
const upload = multer({ storage: multer.memoryStorage() });

// Public shared resources retrieval for all authenticated users
router.get('/', authenticate, (req, res) => controller.getAllResources(req, res));

// Placement Coordinator only resources modification routes
router.post('/subject-notes', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.createSubjectNote(req, res));
router.put('/subject-notes/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.updateSubjectNote(req, res));
router.delete('/subject-notes/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.deleteSubjectNote(req, res));

router.post('/previous-year-questions', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.createPrevYearQuestion(req, res));
router.put('/previous-year-questions/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.updatePrevYearQuestion(req, res));
router.delete('/previous-year-questions/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.deletePrevYearQuestion(req, res));

router.post('/interview-notes', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.createInterviewNote(req, res));
router.put('/interview-notes/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.updateInterviewNote(req, res));
router.delete('/interview-notes/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.deleteInterviewNote(req, res));

router.post('/cheat-sheets', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.createCheatSheet(req, res));
// Upload must be declared before /:id to avoid param shadowing
router.post('/cheat-sheets/upload', authenticate, requireRole(['PLACEMENT_COORDINATOR']), upload.single('image'), (req, res) => controller.uploadCheatSheetImage(req, res));
router.put('/cheat-sheets/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.updateCheatSheet(req, res));
router.delete('/cheat-sheets/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res) => controller.deleteCheatSheet(req, res));

export default router;
