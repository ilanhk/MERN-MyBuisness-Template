import express from "express";
const router = express.Router();
import { uploadFile, uploadCsvFile } from "../controllers/uploadController";
import { upload } from '../utils/uploads';

router.route('/file').post(upload.single("file"), uploadFile);
router.route('/csv').post(upload.single("file"), uploadCsvFile);


export default router;