import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { getMyVisits, updateVisitStatus } from '../controllers/visitAgentController.js';

const router = express.Router();

router.use(protect, authorizeRoles('visitAgent'));

router.get('/my-visits', getMyVisits);
router.put('/visits/:id/status', updateVisitStatus);

export default router;
