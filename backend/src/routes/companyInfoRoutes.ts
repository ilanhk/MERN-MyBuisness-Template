import express from 'express';
const router = express.Router();
import { 
  createCompanyInfo,
  updateCompanyInfo,
  getCompanyInfo,
  getCompanyInfoById,
  deleteCompanyInfo 
} from '../controllers/companyInfoController';
import { protect, employee } from '../middlewares/authMiddleware';
import checkObjectId from '../middlewares/checkObjectId';

router.route('/').get(getCompanyInfo).post(createCompanyInfo);
router
  .route('/:id')
  .get(checkObjectId, getCompanyInfoById)
  .put(protect, employee, checkObjectId, updateCompanyInfo)
  .delete(protect, employee, checkObjectId, deleteCompanyInfo);

export default router;