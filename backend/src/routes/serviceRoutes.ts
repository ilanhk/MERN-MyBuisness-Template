import express from 'express';
const router = express.Router();
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/serviceController';
import { protect, admin } from '../middlewares/authMiddleware';
import checkObjectId from '../middlewares/checkObjectId';

router.route('/').get(getServices).post(protect, admin, createService);
router
  .route('/:id')
  .get(checkObjectId, getServiceById)
  .put(protect, admin, checkObjectId, updateService)
  .delete(protect, admin, checkObjectId, deleteService);

export default router;
