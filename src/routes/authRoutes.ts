// src/routes/authRoutes.ts
import { Router } from 'express';
// Importa todas as exportações de authController.js como um objeto chamado AuthController
import * as AuthController from '../controllers/authController.js';

const router = Router();

router.get('/login', AuthController.getLoginPage);
router.post('/login', AuthController.handleLogin);
router.get('/signup', AuthController.getSignUpPage);
router.post('/signup', AuthController.handleSignUp);
router.post('/logout', AuthController.handleLogout); // Recomenda-se POST para logout por segurança

export default router;