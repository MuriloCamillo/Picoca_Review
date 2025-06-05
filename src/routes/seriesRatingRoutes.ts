// src/routes/seriesRatingRoutes.ts
import { Router } from 'express';
// CORREÇÃO: Voltamos a usar caminhos relativos que o Node.js entende em tempo de execução.
import * as SeriesRatingController from '../controllers/seriesRatingController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

// Todas as rotas de avaliação exigem autenticação
router.use(isAuthenticated);

// Rota para um usuário avaliar uma série
router.post('/series/:seriesId/rate', SeriesRatingController.handleRateSeries);

export default router;