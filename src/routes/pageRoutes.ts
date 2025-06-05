// src/routes/pageRoutes.ts
import { Router } from 'express';
import * as PageController from '../controllers/pageController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

router.get('/', PageController.getHomePage);
router.get('/contact', PageController.getContactPage);
router.get('/journal', PageController.getJournalPage);
router.get('/news/:newsId', PageController.getNewsDetailPage);
router.get('/series/:seriesId', PageController.getSeriesInfoPage);
router.get('/series_gallery', PageController.getSeriesGalleryPage);
router.get('/profile', isAuthenticated, PageController.getProfilePage);

// ======= MUDANÇA AQUI =======
// Removida a rota '/my-lists' e adicionadas as duas novas rotas protegidas
router.get('/watchlist', isAuthenticated, PageController.getWatchlistPage);
router.get('/likelist', isAuthenticated, PageController.getLikelistPage);
// =============================

export default router;