import express from "express";
const router = express.Router();
import { protect, employee } from '../middlewares/authMiddleware';
import { addClickedProduct, addWebVistor } from "../controllers/analyticsController";


router.route('/product').post(protect, employee, addClickedProduct);
router.route('/traffic').post(protect, employee, addWebVistor);


export default router;