// src/routes/userSeriesRoutes.ts
import { Router } from 'express';
import * as UserSeriesController from '../controllers/userSeriesController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

router.use(isAuthenticated);

router.post('/series/:seriesId/watchlist', UserSeriesController.toggleWatchlist);

router.post('/series/:seriesId/likelist', UserSeriesController.toggleLikelist);

export default router;