import express from "express";
const router = express.Router();
import { protect, admin } from '../middlewares/authMiddleware';
import { generate2fa, verify2fa } from '../controllers/2faController';

router.route('/generate').get(protect, generate2fa);
router.route('/verify').post(protect, verify2fa);


export default router;