import express from "express";
const router = express.Router();
import { protect, employee } from '../middlewares/authMiddleware';
import { uploadImage, uploadCsv } from "../controllers/uploadController";


router.route('/image').post(protect, employee, uploadImage);
router.route('/csv').post(protect, employee, uploadCsv);


export default router;