// src/routes/authRoutes.ts
import { Router } from 'express';
import * as AuthController from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { uploadAvatar } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.get('/login', AuthController.getLoginPage);
router.post('/login', AuthController.handleLogin);
router.get('/signup', AuthController.getSignUpPage);
router.post('/signup', AuthController.handleSignUp);
router.post('/logout', AuthController.handleLogout);

router.post('/profile/update', isAuthenticated, AuthController.handleUpdateProfile);
router.post('/profile/change-password', isAuthenticated, AuthController.handleChangePassword);
router.post('/profile/avatar', isAuthenticated, uploadAvatar.single('avatarFile'), AuthController.handleUpdateAvatar);

export default router;