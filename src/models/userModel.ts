// src/models/userModel.ts
import db from '../config/database.js';
import { UserSessionData } from '../types/express.js';
import sqlite3 from 'sqlite3'; // Para tipar 'this' no callback do db.run

export interface NewUser {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    passwordHash: string;
}

export interface UserDB extends UserSessionData {
    lastName: string; // UserSessionData pode não ter lastName, mas a tabela users tem
    password?: string; // Hash da senha, apenas para uso interno do modelo/serviço
    createdAt?: string;
    updatedAt?: string;
}

export const createUser = (newUser: NewUser): Promise<number> => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO users (firstName, lastName, username, email, password) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [newUser.firstName, newUser.lastName, newUser.username, newUser.email, newUser.passwordHash], function (this: sqlite3.RunResult, err: Error | null) {
            if (err) return reject(err);
            resolve(this.lastID);
        });
    });
};

export const findUserByEmail = (email: string): Promise<UserDB | null> => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, firstName, lastName, username, email, password FROM users WHERE email = ?`;
        db.get(sql, [email], (err: Error | null, row: UserDB) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
};

export const findUserByUsername = (username: string): Promise<UserDB | null> => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, firstName, lastName, username, email, password FROM users WHERE username = ?`;
        db.get(sql, [username], (err: Error | null, row: UserDB) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
};

export const findUserById = (id: number): Promise<UserSessionData | null> => { // Retorna apenas dados seguros para sessão/view
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, firstName, lastName, username, email FROM users WHERE id = ?`;
        db.get(sql, [id], (err: Error | null, row: UserSessionData) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
};