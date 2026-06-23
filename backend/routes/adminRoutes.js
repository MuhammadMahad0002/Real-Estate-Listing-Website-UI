import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import {
  getVisitAgents,
  updateVisitAgent,
  deactivateVisitAgent,
  getCustomers,
  getVisits,
  assignVisitAgent,
  getDashboardStats,
} from '../controllers/adminController.js';
import { createVisitAgent } from '../controllers/authController.js';

const router = express.Router();

// All routes require admin role
router.use(protect, authorizeRoles('admin'));

router.get('/visit-agents', getVisitAgents);
router.post('/visit-agents', createVisitAgent);
router.put('/visit-agents/:id', updateVisitAgent);
router.delete('/visit-agents/:id', deactivateVisitAgent);

router.get('/customers', getCustomers);

router.get('/visits', getVisits);
router.put('/visits/:id/assign', assignVisitAgent);

router.get('/dashboard-stats', getDashboardStats);

export default router;
