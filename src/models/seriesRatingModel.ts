// src/models/seriesRatingModel.ts
import db from '../config/database.js';

export interface SeriesRating {
    id?: number;
    user_id: number;
    series_id: string;
    rating: number;
    rated_at?: string;
}

/**
 * Adiciona ou atualiza a avaliação de um usuário para uma série.
 * Usa o recurso 'UPSERT' do SQLite para inserir ou atualizar em caso de conflito.
 */
export const addOrUpdateRating = (userId: number, seriesId: string, rating: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO user_series_ratings (user_id, series_id, rating, rated_at) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, series_id) DO UPDATE SET
                rating = excluded.rating,
                rated_at = CURRENT_TIMESTAMP;
        `;
        db.run(sql, [userId, seriesId, rating], (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};

/**
 * Pega a avaliação específica de um usuário para uma série.
 */
export const getUserRatingForSeries = (userId: number, seriesId: string): Promise<number | null> => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT rating FROM user_series_ratings WHERE user_id = ? AND series_id = ?`;
        db.get(sql, [userId, seriesId], (err, row: { rating: number }) => {
            if (err) return reject(err);
            resolve(row ? row.rating : null);
        });
    });
};

/**
 * Pega todas as avaliações para uma determinada série.
 */
export const getRatingsForSeries = (seriesId: string): Promise<SeriesRating[]> => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT rating FROM user_series_ratings WHERE series_id = ?`;
        db.all(sql, [seriesId], (err, rows: SeriesRating[]) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};