import express from "express";
const router = express.Router();
import { uploadFile } from "../controllers/uploadController";
import { upload } from '../utils/uploads';

router.route('/file').post(upload.single("file"), uploadFile);


export default router;