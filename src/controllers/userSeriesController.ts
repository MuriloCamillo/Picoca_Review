// src/controllers/userSeriesController.ts
import { Request, Response } from 'express';
import * as SeriesListModel from '../models/seriesListModel.js';

const handleToggleList = async (req: Request, res: Response, listType: SeriesListModel.ListType) => {
    const seriesId = req.params.seriesId;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado. Faça login para continuar.' });
    }
    if (!seriesId) {
        return res.status(400).json({ success: false, message: 'ID da série não fornecido.' });
    }

    try {
        const isInList = await SeriesListModel.isSeriesInUserList(userId, seriesId, listType);
        let messageAction = '';
        if (isInList) {
            await SeriesListModel.removeSeriesFromList(userId, seriesId, listType);
            messageAction = 'removida';
        } else {
            await SeriesListModel.addSeriesToList({ user_id: userId, series_id: seriesId, list_type: listType });
            messageAction = 'adicionada';
        }
        const friendlyListName = listType === 'watchlist' ? 'watchlist' : 'lista de séries que gostou';
        res.json({ 
            success: true, 
            message: `Série ${messageAction} da ${friendlyListName}.`, 
            action: messageAction === 'adicionada' ? 'added' : 'removed' 
        });

    } catch (error: any) {
        console.error(`Erro ao alternar ${listType}:`, error);
        // Tratar erro de UNIQUE constraint como uma tentativa de adicionar algo que já existe (após uma falha de deleção não percebida, por exemplo)
        if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE constraint failed')) {
            // Verifica se realmente está na lista, se não estiver, tenta adicionar
            const stillInList = await SeriesListModel.isSeriesInUserList(userId, seriesId, listType);
            if (!stillInList) {
                try {
                    await SeriesListModel.addSeriesToList({ user_id: userId, series_id: seriesId, list_type: listType });
                    const friendlyListName = listType === 'watchlist' ? 'watchlist' : 'lista de séries que gostou';
                    return res.json({ success: true, message: `Série adicionada à ${friendlyListName}.`, action: 'added' });
                } catch (addError) {
                     console.error(`Erro ao tentar adicionar novamente à ${listType}:`, addError);
                }
            } else {
                // Se deu erro de UNIQUE e JÁ ESTÁ na lista, pode ser um bug de estado. Informar que já está.
                 const friendlyListName = listType === 'watchlist' ? 'watchlist' : 'lista de séries que gostou';
                 return res.json({ success: true, message: `Série já está na ${friendlyListName}.`, action: 'added' });
            }
        }
        res.status(500).json({ success: false, message: `Erro ao atualizar ${listType}.` });
    }
};

export const toggleWatchlist = (req: Request, res: Response) => {
    handleToggleList(req, res, 'watchlist');
};

export const toggleLikelist = (req: Request, res: Response) => {
    handleToggleList(req, res, 'likelist');
};