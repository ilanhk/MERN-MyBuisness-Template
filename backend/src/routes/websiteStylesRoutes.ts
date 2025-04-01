import express from 'express';
const router = express.Router();
import {
  createWebsiteStyles,
  getWebsiteStyles,
  getWebsiteStylesById,
  updateWebsiteStyles,
  deleteWebsiteStyles
} from '../controllers/websiteStylesController';
import { protect, employee } from '../middlewares/authMiddleware';
import checkObjectId from '../middlewares/checkObjectId';

router.route('/').get(getWebsiteStyles).post(createWebsiteStyles);
router
  .route('/:id')
  .get(checkObjectId, getWebsiteStylesById)
  .put(protect, employee, checkObjectId, updateWebsiteStyles)
  .delete(protect, employee, checkObjectId, deleteWebsiteStyles);

export default router;