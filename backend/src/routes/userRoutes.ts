import express from "express";
const router = express.Router();
import { 
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    updateUser,
    forgotPassword,
    resetPassword,
    deleteUser,
    refreshUser
 } from '../controllers/userController';
import { protect, admin, superAdmin, refresh } from '../middlewares/authMiddleware';


router.route('/').post(registerUser).get(protect, admin, getUsers); 

router.route('/refresh').get(refresh, refreshUser);

router.post('/logout', logoutUser);

router.post('/login', loginUser);

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

router.route('/forgot-password').post(protect, forgotPassword);

router.route('/reset-password').post(protect, resetPassword);

router.route('/:id').delete(protect, superAdmin, deleteUser).get(getUserById).put(protect, admin, updateUser);



export default router;