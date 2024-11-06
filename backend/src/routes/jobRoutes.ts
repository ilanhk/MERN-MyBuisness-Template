import express from 'express';
const router = express.Router();
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from '../controllers/jobController';
import { protect, employee } from '../middlewares/authMiddleware';
import checkObjectId from '../middlewares/checkObjectId';

router.route('/').get(getJobs).post(protect, employee, createJob);
router
  .route('/:id')
  .get(checkObjectId, getJobById)
  .put(protect, employee, checkObjectId, updateJob)
  .delete(protect, employee, checkObjectId, deleteJob);

export default router;
