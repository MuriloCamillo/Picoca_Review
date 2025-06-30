/**
 * @fileoverview Controlador para as interações do usuário com suas listas de séries (Watchlist e Likelist).
 *
 * Este arquivo contém a lógica para adicionar ou remover uma série das listas
 * pessoais de um usuário. Ele foi projetado com uma função reutilizável (`handleToggleList`)
 * para gerenciar ambas as listas, 'watchlist' e 'likelist'.
 */
import { Request, Response } from 'express';
import * as SeriesListModel from '../models/seriesListModel.js';

/**
 * Manipula a lógica de "toggle" (adicionar/remover) para uma lista de séries específica.
 * Verifica se a série já está na lista do usuário e realiza a ação oposta.
 * @param {Request} req O objeto de requisição do Express.
 * @param {Response} res O objeto de resposta do Express.
 * @param {SeriesListModel.ListType} listType O tipo de lista a ser manipulada ('watchlist' ou 'likelist').
 */
const handleToggleList = async (req: Request, res: Response, listType: SeriesListModel.ListType) => {
    // --- 1. Extração e Validação de Dados ---
    const seriesId = req.params.seriesId;
    const userId = req.session.user?.id;

    // Validação de autenticação e dos parâmetros da requisição.
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado. Faça login para continuar.' });
    }
    if (!seriesId) {
        return res.status(400).json({ success: false, message: 'ID da série não fornecido.' });
    }

    try {
        // --- 2. Lógica de Adicionar/Remover ---
        // Verifica o estado atual da série na lista do usuário.
        const isInList = await SeriesListModel.isSeriesInUserList(userId, seriesId, listType);
        let messageAction = '';

        if (isInList) {
            // Se a série já está na lista, remove.
            await SeriesListModel.removeSeriesFromList(userId, seriesId, listType);
            messageAction = 'removida';
        } else {
            // Se a série não está na lista, adiciona.
            await SeriesListModel.addSeriesToList({ user_id: userId, series_id: seriesId, list_type: listType });
            messageAction = 'adicionada';
        }

        // --- 3. Resposta de Sucesso ---
        // Envia uma resposta JSON para o cliente com o status da operação.
        // O campo 'action' é crucial para o frontend saber como atualizar a interface.
        const friendlyListName = listType === 'watchlist' ? 'watchlist' : 'lista de séries que gostou';
        res.json({ 
            success: true, 
            message: `Série ${messageAction} da ${friendlyListName}.`, 
            action: messageAction === 'adicionada' ? 'added' : 'removed' 
        });

    } catch (error: any) {
        // --- 4. Tratamento de Erros ---
        console.error(`Erro ao alternar ${listType}:`, error);

        // Tratamento de erro específico para 'UNIQUE constraint'.
        // Isso pode ocorrer em condições de corrida (race conditions) ou se o estado do cliente
        // estiver dessincronizado com o servidor.
        if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE constraint failed')) {
            // Confirma novamente se o item está na lista.
            const stillInList = await SeriesListModel.isSeriesInUserList(userId, seriesId, listType);
            if (!stillInList) {
                // Se o erro ocorreu mas o item não está na lista (raro), tenta adicionar novamente.
                try {
                    await SeriesListModel.addSeriesToList({ user_id: userId, series_id: seriesId, list_type: listType });
                    const friendlyListName = listType === 'watchlist' ? 'watchlist' : 'lista de séries que gostou';
                    return res.json({ success: true, message: `Série adicionada à ${friendlyListName}.`, action: 'added' });
                } catch (addError) {
                     console.error(`Erro ao tentar adicionar novamente à ${listType}:`, addError);
                }
            } else {
                // Se o erro de UNIQUE ocorreu e o item JÁ ESTÁ na lista, o estado do cliente estava errado.
                // Informa ao cliente o estado correto (já adicionado).
                 const friendlyListName = listType === 'watchlist' ? 'watchlist' : 'lista de séries que gostou';
                 return res.json({ success: true, message: `Série já está na ${friendlyListName}.`, action: 'added' });
            }
        }
        // Para todos os outros erros, retorna um erro genérico do servidor.
        res.status(500).json({ success: false, message: `Erro ao atualizar ${listType}.` });
    }
};

/**
 * Controlador para adicionar/remover uma série da Watchlist.
 * Simplesmente chama o manipulador genérico com o tipo 'watchlist'.
 */
export const toggleWatchlist = (req: Request, res: Response) => {
    handleToggleList(req, res, 'watchlist');
};

/**
 * Controlador para adicionar/remover uma série da Likelist.
 * Simplesmente chama o manipulador genérico com o tipo 'likelist'.
 */
export const toggleLikelist = (req: Request, res: Response) => {
    handleToggleList(req, res, 'likelist');
};