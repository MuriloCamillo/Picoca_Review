// src/models/userModel.ts
import db from '../config/database.js';
import { UserSessionData } from '../types/express.js';
import sqlite3 from 'sqlite3';

export interface NewUser {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    passwordHash: string;
    avatarUrl?: string;
    country?: string; // Adicionado
    bio?: string;     // Adicionado
}

// UserSessionData já inclui country e bio como opcionais
export interface UserDB extends UserSessionData {
    lastName: string; // firstName já está em UserSessionData
    password?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserProfileUpdateData {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    country?: string; // Adicionado
    bio?: string;     // Adicionado
}

export const createUser = (newUser: NewUser): Promise<number> => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO users (firstName, lastName, username, email, password, avatarUrl, country, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(sql, [
            newUser.firstName, 
            newUser.lastName, 
            newUser.username, 
            newUser.email, 
            newUser.passwordHash, 
            newUser.avatarUrl || null,
            newUser.country || null, // Adicionado
            newUser.bio || null      // Adicionado
        ], function (this: sqlite3.RunResult, err: Error | null) {
            if (err) return reject(err);
            resolve(this.lastID);
        });
    });
};

export const findUserByEmail = (email: string): Promise<UserDB | null> => {
    return new Promise((resolve, reject) => {
        // Selecionar country e bio
        const sql = `SELECT id, firstName, lastName, username, email, password, avatarUrl, country, bio FROM users WHERE email = ? COLLATE NOCASE`;
        db.get(sql, [email], (err: Error | null, row: UserDB) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
};

export const findUserByUsername = (username: string): Promise<UserDB | null> => {
    return new Promise((resolve, reject) => {
        // Selecionar country e bio
        const sql = `SELECT id, firstName, lastName, username, email, password, avatarUrl, country, bio FROM users WHERE username = ? COLLATE NOCASE`;
        db.get(sql, [username], (err: Error | null, row: UserDB) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
};

export const findUserById = (id: number): Promise<UserDB | null> => {
    return new Promise((resolve, reject) => {
        // Selecionar country e bio
        const sql = `SELECT id, firstName, lastName, username, email, password, avatarUrl, country, bio FROM users WHERE id = ?`;
        db.get(sql, [id], (err: Error | null, row: UserDB) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
};

export const updateUser = (userId: number, data: UserProfileUpdateData): Promise<number> => {
    return new Promise((resolve, reject) => {
        const fields = [];
        const values = [];
        if (data.firstName) { fields.push("firstName = ?"); values.push(data.firstName); }
        if (data.lastName) { fields.push("lastName = ?"); values.push(data.lastName); }
        if (data.username) { fields.push("username = ?"); values.push(data.username); }
        if (data.email) { fields.push("email = ?"); values.push(data.email); }
        // Adicionar country e bio
        if (data.country !== undefined) { fields.push("country = ?"); values.push(data.country); } // Permitir string vazia
        if (data.bio !== undefined) { fields.push("bio = ?"); values.push(data.bio); }         // Permitir string vazia


        if (fields.length === 0) return resolve(0);

        fields.push("updatedAt = CURRENT_TIMESTAMP");
        const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
        values.push(userId);

        db.run(sql, values, function (this: sqlite3.RunResult, err: Error | null) {
            if (err) return reject(err);
            resolve(this.changes);
        });
    });
};

export const updateUserPassword = (userId: number, passwordHash: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
        db.run(sql, [passwordHash, userId], function (this: sqlite3.RunResult, err: Error | null) {
            if (err) return reject(err);
            resolve(this.changes);
        });
    });
};

export const updateUserAvatar = (userId: number, avatarUrl: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE users SET avatarUrl = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
        db.run(sql, [avatarUrl, userId], function (this: sqlite3.RunResult, err: Error | null) {
            if (err) return reject(err);
            resolve(this.changes);
        });
    });
};