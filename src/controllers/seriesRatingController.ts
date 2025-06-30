/**
 * @fileoverview Controlador para o registro e atualização de avaliações de séries.
 *
 * Este arquivo lida com as requisições para avaliar uma série. Ele recebe
 * a nota do usuário, valida os dados, persiste a informação no banco de dados
 * através do Model, e retorna os dados atualizados de avaliação da série
 * (nova média, contagem de votos) para a interface do usuário.
 */
import { Request, Response } from 'express';
import * as SeriesRatingModel from '../models/seriesRatingModel.js';

/**
 * Processa a requisição de um usuário para avaliar uma série.
 * Esta função é assíncrona para aguardar as operações de banco de dados.
 * @param req O objeto de requisição do Express, contendo o ID do usuário (sessão), o ID da série (parâmetros) e a nota (corpo).
 * @param res O objeto de resposta do Express, usado para enviar a resposta JSON.
 */
export const handleRateSeries = async (req: Request, res: Response) => {
    // --- 1. Extração e Validação dos Dados ---
    const userId = req.session.user?.id;
    const seriesId = req.params.seriesId;
    const { rating } = req.body;

    // Valida se o usuário está autenticado. O middleware 'isAuthenticated' na rota já faz isso,
    // mas uma verificação dupla aqui é uma boa prática de segurança.
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    }
    // Valida se os dados necessários (seriesId, rating) foram fornecidos e se a nota está no intervalo correto (1-5).
    if (!seriesId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Dados de avaliação inválidos.' });
    }

    try {
        // --- 2. Interação com o Model ---
        // Adiciona ou atualiza a avaliação no banco de dados. O model lida com a lógica de INSERT/UPDATE (UPSERT).
        await SeriesRatingModel.addOrUpdateRating(userId, seriesId, rating);

        // --- 3. Cálculo dos Novos Dados de Avaliação ---
        // Após salvar a nova avaliação, busca todas as avaliações para recalcular a média.
        const allRatings = await SeriesRatingModel.getRatingsForSeries(seriesId);
        const voteCount = allRatings.length;
        const averageRating = voteCount > 0
            // Calcula a média somando todas as notas e dividindo pelo número de votos.
            ? allRatings.reduce((sum, r) => sum + r.rating, 0) / voteCount
            : 0;
        
        // --- 4. Envio da Resposta de Sucesso ---
        // Retorna uma resposta JSON para o cliente com os dados atualizados,
        // permitindo que a interface seja atualizada dinamicamente.
        res.json({
            success: true,
            message: 'Avaliação registrada com sucesso!',
            averageRating: averageRating.toFixed(1), // Formata a média para uma casa decimal.
            voteCount: voteCount
        });

    } catch (error) {
        // --- 5. Tratamento de Erros ---
        console.error('Erro ao registrar avaliação:', error);
        res.status(500).json({ success: false, message: 'Erro interno ao salvar sua avaliação.' });
    }
};