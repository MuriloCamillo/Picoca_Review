/**
 * @fileoverview Model para interações com a tabela `user_series_ratings`.
 *
 * Este arquivo contém todas as funções para manipular os dados de avaliações
 * que os usuários dão para as séries. Ele abstrai as queries SQL, permitindo que
 * os controladores registrem e busquem avaliações de forma organizada.
 */
import db from '../config/database.js';

/**
 * Descreve a estrutura de uma entrada na tabela `user_series_ratings`.
 */
export interface SeriesRating {
    id?: number;            // ID único da avaliação.
    user_id: number;        // ID do usuário que fez a avaliação.
    series_id: string;      // ID da série que foi avaliada.
    rating: number;         // A nota (de 1 a 5) dada pelo usuário.
    rated_at?: string;      // Timestamp de quando a avaliação foi feita.
}

/**
 * Adiciona uma nova avaliação ou atualiza uma existente para um usuário e uma série.
 * Utiliza a cláusula `ON CONFLICT` do SQLite, que é uma
 * forma eficiente de inserir um novo registro ou, se ele já existir (conflito na
 * chave UNIQUE `user_id`, `series_id`), atualizar o registro existente em uma única operação.
 *
 * @param {number} userId O ID do usuário que está avaliando.
 * @param {string} seriesId O ID da série que está sendo avaliada.
 * @param {number} rating A nota (1-5) que o usuário deu.
 * @returns {Promise<void>} Uma Promise que é resolvida quando a operação é concluída.
 */
export const addOrUpdateRating = (userId: number, seriesId: string, rating: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        const sql = `
            -- Tenta inserir uma nova avaliação.
            INSERT INTO user_series_ratings (user_id, series_id, rating, rated_at) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            -- Se um registro com a mesma combinação de 'user_id' e 'series_id' já existir...
            ON CONFLICT(user_id, series_id) DO UPDATE SET
                -- ...atualiza a nota e o timestamp do registro existente.
                -- 'excluded.rating' refere-se ao valor de 'rating' que teria sido inserido se não houvesse conflito.
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
 * Busca a avaliação específica que um usuário deu para uma determinada série.
 * @param {number} userId O ID do usuário.
 * @param {string} seriesId O ID da série.
 * @returns {Promise<number | null>} Uma Promise que resolve com a nota (1-5) se encontrada, ou `null` se o usuário ainda não avaliou a série.
 */
export const getUserRatingForSeries = (userId: number, seriesId: string): Promise<number | null> => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT rating FROM user_series_ratings WHERE user_id = ? AND series_id = ?`;
        // Usa db.get pois esperamos no máximo uma linha de resultado.
        db.get(sql, [userId, seriesId], (err, row: { rating: number }) => {
            if (err) return reject(err);
            // Se uma linha for encontrada, retorna a nota; caso contrário, retorna null.
            resolve(row ? row.rating : null);
        });
    });
};

/**
 * Busca todas as avaliações (notas) para uma determinada série.
 * Usado para calcular a média de avaliação da comunidade.
 * @param {string} seriesId O ID da série.
 * @returns {Promise<SeriesRating[]>} Uma Promise que resolve com um array de objetos, cada um contendo uma propriedade 'rating'.
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