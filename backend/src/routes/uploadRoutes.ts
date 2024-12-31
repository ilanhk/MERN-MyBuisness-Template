import express from "express";
const router = express.Router();
import { protect, employee } from '../middlewares/authMiddleware';
import { uploadFile } from "../controllers/uploadController";
import { upload } from '../utils/uploads';

router.route('/file').post(upload.single("file"), uploadFile);
// router.route('/image').post(protect, employee, uploadImage);
// router.route('/csv').post(protect, employee, uploadCsv);


export default router;