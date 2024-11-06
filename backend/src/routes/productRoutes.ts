import express from "express";
const router = express.Router();
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct,
    deleteProduct,
} from '../controllers/productController';
import { protect, admin , employee } from '../middlewares/authMiddleware';
import checkObjectId from "../middlewares/checkObjectId"; // use it to all routes that have '/:id'


router.route('/').get(getProducts).post(protect, employee, createProduct); // we are linking '/api/products' to this file. So we will change it to '/'
router.route('/:id').get( checkObjectId, getProductById).put(protect, employee, checkObjectId, updateProduct).delete(protect, employee, checkObjectId, deleteProduct);


export default router;