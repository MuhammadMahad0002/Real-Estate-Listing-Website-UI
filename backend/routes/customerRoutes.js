import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { scheduleVisit, getMyVisits } from '../controllers/customerController.js';

const router = express.Router();

router.use(protect, authorizeRoles('customer'));

router.post('/schedule-visit', scheduleVisit);
router.get('/my-visits', getMyVisits);

export default router;
