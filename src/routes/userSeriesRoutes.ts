// src/routes/userSeriesRoutes.ts
import { Router } from 'express';
import * as UserSeriesController from '../controllers/userSeriesController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

// Todas essas rotas exigem autenticação
router.use(isAuthenticated);

router.post('/series/:seriesId/watchlist', UserSeriesController.toggleWatchlist);
// router.delete('/series/:seriesId/watchlist', UserSeriesController.removeFromWatchlist); // O toggle faz as duas coisas

router.post('/series/:seriesId/likelist', UserSeriesController.toggleLikelist);
// router.delete('/series/:seriesId/likelist', UserSeriesController.removeFromLikelist); // O toggle faz as duas coisas

export default router;