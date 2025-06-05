// src/controllers/seriesRatingController.ts
import { Request, Response } from 'express';
// CORREÇÃO: O import do model também deve ser relativo.
import * as SeriesRatingModel from '../models/seriesRatingModel.js';

export const handleRateSeries = async (req: Request, res: Response) => {
    const userId = req.session.user?.id;
    const seriesId = req.params.seriesId;
    const { rating } = req.body;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    }
    if (!seriesId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Dados inválidos.' });
    }

    try {
        await SeriesRatingModel.addOrUpdateRating(userId, seriesId, rating);

        const allRatings = await SeriesRatingModel.getRatingsForSeries(seriesId);
        const voteCount = allRatings.length;
        const averageRating = voteCount > 0 
            ? allRatings.reduce((sum, r) => sum + r.rating, 0) / voteCount 
            : 0;
        
        res.json({
            success: true,
            message: 'Avaliação registrada com sucesso!',
            averageRating: averageRating.toFixed(1),
            voteCount: voteCount
        });

    } catch (error) {
        console.error('Erro ao registrar avaliação:', error);
        res.status(500).json({ success: false, message: 'Erro interno ao salvar sua avaliação.' });
    }
};