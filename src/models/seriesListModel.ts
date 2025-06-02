// src/models/seriesListModel.ts
import db from '../config/database.js';
import sqlite3 from 'sqlite3'; // Para tipar 'this' no callback do db.run


export type ListType = 'watchlist' | 'likelist';

export interface UserSeriesListItem {
    id?: number;
    user_id: number;
    series_id: string;
    list_type: ListType;
    added_at?: string;
}

export const addSeriesToList = (item: UserSeriesListItem): Promise<number> => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO user_series_lists (user_id, series_id, list_type) VALUES (?, ?, ?)`;
        db.run(sql, [item.user_id, item.series_id, item.list_type], function (this: sqlite3.RunResult, err: Error | null) {
            if (err) return reject(err);
            resolve(this.lastID);
        });
    });
};

export const removeSeriesFromList = (userId: number, seriesId: string, listType: ListType): Promise<number> => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM user_series_lists WHERE user_id = ? AND series_id = ? AND list_type = ?`;
        db.run(sql, [userId, seriesId, listType], function (this: sqlite3.RunResult, err: Error | null) {
            if (err) return reject(err);
            resolve(this.changes);
        });
    });
};

export const getListsForUser = (userId: number): Promise<UserSeriesListItem[]> => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT series_id, list_type FROM user_series_lists WHERE user_id = ?`;
        db.all(sql, [userId], (err: Error | null, rows: UserSeriesListItem[]) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

export const isSeriesInUserList = async (userId: number, seriesId: string, listType: ListType): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT 1 FROM user_series_lists WHERE user_id = ? AND series_id = ? AND list_type = ? LIMIT 1`;
        db.get(sql, [userId, seriesId, listType], (err: Error | null, row: any) => {
            if (err) return reject(err);
            resolve(!!row);
        });
    });
};