import { Router } from 'express';
import { ResourcesController } from './controller';
import { authenticate, requireRole } from '../../middleware/auth';
import multer from 'multer';

const router = Router();
const controller = new ResourcesController();
const upload = multer({ storage: multer.memoryStorage() });

// Public shared resources retrieval for all authenticated users
router.get('/', authenticate, (req, res, next) => controller.getAllResources(req, res, next));

// Placement Coordinator only resources modification routes
router.post('/subject-notes', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.createSubjectNote(req, res, next));
router.put('/subject-notes/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.updateSubjectNote(req, res, next));
router.delete('/subject-notes/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.deleteSubjectNote(req, res, next));

router.post('/previous-year-questions', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.createPrevYearQuestion(req, res, next));
router.put('/previous-year-questions/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.updatePrevYearQuestion(req, res, next));
router.delete('/previous-year-questions/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.deletePrevYearQuestion(req, res, next));

router.post('/interview-notes', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.createInterviewNote(req, res, next));
router.put('/interview-notes/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.updateInterviewNote(req, res, next));
router.delete('/interview-notes/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.deleteInterviewNote(req, res, next));

router.post('/cheat-sheets', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.createCheatSheet(req, res, next));
// Upload must be declared before /:id to avoid param shadowing
router.post('/cheat-sheets/upload', authenticate, requireRole(['PLACEMENT_COORDINATOR']), upload.single('image'), (req, res, next) => controller.uploadCheatSheetImage(req, res, next));
router.put('/cheat-sheets/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.updateCheatSheet(req, res, next));
router.delete('/cheat-sheets/:id', authenticate, requireRole(['PLACEMENT_COORDINATOR']), (req, res, next) => controller.deleteCheatSheet(req, res, next));

export default router;
