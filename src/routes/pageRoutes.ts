// src/routes/pageRoutes.ts
import { Router } from 'express';
import * as PageController from '../controllers/pageController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js'; // Para proteger a rota do perfil

const router = Router();

router.get('/', PageController.getHomePage);
router.get('/contact', PageController.getContactPage);
router.get('/journal', PageController.getJournalPage);
// Para news_default, o ID virá como query param ?id= ou como parâmetro de rota
// Exemplo com parâmetro de rota:
router.get('/news/:newsId', PageController.getNewsDetailPage); // Se for por query: '/news_default' e pega req.query.id

// Para series_info_default, o ID virá como query param ?id= ou como parâmetro de rota
// Exemplo com parâmetro de rota:
router.get('/series/:seriesId', PageController.getSeriesInfoPage); // Se for por query: '/series_info_default' e pega req.query.id

router.get('/series_gallery', PageController.getSeriesGalleryPage);
router.get('/profile', isAuthenticated, PageController.getProfilePage); // Rota de perfil protegida

// As rotas de autenticação serão separadas
// router.get('/login', PageController.getLoginPage); // Movido para authRoutes
// router.get('/sign_up', PageController.getSignUpPage); // Movido para authRoutes


// Adicione outras rotas de página conforme necessário

export default router;