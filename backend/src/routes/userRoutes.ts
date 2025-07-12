import express from "express";
const router = express.Router();
import { 
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    createNewUser,
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

router.route('/profile').get(protect, getUserProfile).put(protect, admin, updateUserProfile);

router.route('/forgot-password').post(forgotPassword);

router.route('/reset-password').post(resetPassword);

router.route('/:id').delete(protect, admin, deleteUser).get(protect, getUserById).put(protect, admin, updateUser);

router.post('/create', protect, admin, createNewUser);

export default router;