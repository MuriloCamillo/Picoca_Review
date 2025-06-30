/**
 * @fileoverview Model para interações com a tabela `user_series_lists`.
 *
 * Este arquivo contém todas as funções para manipular os dados das listas de séries
 * dos usuários (Watchlist e Likelist) no banco de dados. Ele abstrai as queries SQL,
 * permitindo que os controladores realizem operações de forma segura e organizada.
 */
import db from '../config/database.js';
import sqlite3 from 'sqlite3'; // Usado para tipar 'this' no callback de db.run para acesso ao `lastID` e `changes`.

/**
 * Define os tipos de lista de séries que um usuário pode ter.
 */
export type ListType = 'watchlist' | 'likelist';

/**
 * Descreve a estrutura de uma entrada na tabela `user_series_lists`.
 */
export interface UserSeriesListItem {
    id?: number;
    user_id: number;
    series_id: string;
    list_type: ListType;
    added_at?: string;
}

/**
 * Adiciona uma série a uma lista específica de um usuário.
 * @param {UserSeriesListItem} item O objeto contendo user_id, series_id e list_type.
 * @returns {Promise<number>} Uma Promise que resolve com o ID da nova linha inserida.
 */
export const addSeriesToList = (item: UserSeriesListItem): Promise<number> => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO user_series_lists (user_id, series_id, list_type) VALUES (?, ?, ?)`;
        db.run(sql, [item.user_id, item.series_id, item.list_type], function (this: sqlite3.RunResult, err: Error | null) {
            if (err) return reject(err);
            // 'this.lastID' retorna o ID da linha que acabou de ser inserida.
            resolve(this.lastID);
        });
    });
};

/**
 * Remove uma série de uma lista específica de um usuário.
 * @param {number} userId O ID do usuário.
 * @param {string} seriesId O ID da série a ser removida.
 * @param {ListType} listType O tipo de lista ('watchlist' ou 'likelist').
 * @returns {Promise<number>} Uma Promise que resolve com o número de linhas afetadas (deve ser 1 em caso de sucesso).
 */
export const removeSeriesFromList = (userId: number, seriesId: string, listType: ListType): Promise<number> => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM user_series_lists WHERE user_id = ? AND series_id = ? AND list_type = ?`;
        db.run(sql, [userId, seriesId, listType], function (this: sqlite3.RunResult, err: Error | null) {
            if (err) return reject(err);
            // 'this.changes' retorna o número de linhas que foram deletadas.
            resolve(this.changes);
        });
    });
};

/**
 * Busca todas as entradas de listas (watchlist e likelist) para um usuário específico.
 * @param {number} userId O ID do usuário.
 * @returns {Promise<UserSeriesListItem[]>} Uma Promise que resolve com um array de objetos, cada um contendo series_id e list_type.
 */
export const getListsForUser = (userId: number): Promise<UserSeriesListItem[]> => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT series_id, list_type FROM user_series_lists WHERE user_id = ?`;
        db.all(sql, [userId], (err: Error | null, rows: UserSeriesListItem[]) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

/**
 * Verifica de forma eficiente se uma série específica já está na lista de um usuário.
 * @param {number} userId O ID do usuário.
 * @param {string} seriesId O ID da série a ser verificada.
 * @param {ListType} listType O tipo da lista a ser verificada.
 * @returns {Promise<boolean>} Uma Promise que resolve com `true` se a série estiver na lista, e `false` caso contrário.
 */
export const isSeriesInUserList = async (userId: number, seriesId: string, listType: ListType): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        // A query `SELECT 1 ... LIMIT 1` é otimizada para apenas verificar a existência,
        // sendo mais rápida do que selecionar todos os dados da linha.
        const sql = `SELECT 1 FROM user_series_lists WHERE user_id = ? AND series_id = ? AND list_type = ? LIMIT 1`;
        db.get(sql, [userId, seriesId, listType], (err: Error | null, row: any) => {
            if (err) return reject(err);
            // `!!row` converte a resposta para um booleano:
            // Se `row` for um objeto (encontrou), retorna true.
            // Se `row` for undefined (não encontrou), retorna false.
            resolve(!!row);
        });
    });
};