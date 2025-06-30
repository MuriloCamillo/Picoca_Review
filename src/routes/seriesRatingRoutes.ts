// src/routes/seriesRatingRoutes.ts
import { Router } from 'express';

import * as SeriesRatingController from '../controllers/seriesRatingController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

router.use(isAuthenticated);

router.post('/series/:seriesId/rate', SeriesRatingController.handleRateSeries);

export default router;