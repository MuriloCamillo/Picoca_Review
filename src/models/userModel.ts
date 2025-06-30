/**
 * @fileoverview Model para interações com a tabela `users`.
 *
 * Este arquivo contém todas as funções para realizar operações CRUD (Create, Read,
 * Update, Delete) na tabela de usuários do banco de dados. Ele define as interfaces
 * para os dados do usuário e abstrai todas as queries SQL.
 */
import db from '../config/database.js';
import { UserSessionData } from '../types/express.js';
import sqlite3 from 'sqlite3';

/**
 * Descreve a estrutura de dados necessária para criar um novo usuário.
 * Contém apenas os campos essenciais para o registro inicial.
 */
export interface NewUser {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    passwordHash: string; 
    avatarUrl?: string;
    country?: string;
    bio?: string;
}

/**
 * Descreve a estrutura completa de um usuário como ela existe no banco de dados.
 * Estende a `UserSessionData` para incluir todos os campos da tabela `users`.
 */
export interface UserDB extends UserSessionData {
    lastName: string;
    password?: string;   // O hash da senha.
    createdAt?: string;  // Timestamp de criação.
    updatedAt?: string;  // Timestamp da última atualização.
}

/**
 * Descreve a estrutura de dados para a atualização de um perfil de usuário.
 * Todos os campos são opcionais, permitindo atualizações parciais.
 */
export interface UserProfileUpdateData {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    country?: string;
    bio?: string;
}

/**
 * Insere um novo usuário no banco de dados.
 * @param {NewUser} newUser O objeto com os dados do novo usuário.
 * @returns {Promise<number>} Uma Promise que resolve com o ID do usuário recém-criado.
 */
export const createUser = (newUser: NewUser): Promise<number> => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO users (firstName, lastName, username, email, password, avatarUrl, country, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(sql, [
            newUser.firstName, 
            newUser.lastName, 
            newUser.username, 
            newUser.email, 
            newUser.passwordHash, 
            newUser.avatarUrl || null, // Garante que o valor seja NULL se a string for vazia/undefined.
            newUser.country || null,
            newUser.bio || null
        ], function (this: sqlite3.RunResult, err: Error | null) {
            if (err) return reject(err);
            resolve(this.lastID);
        });
    });
};

/**
 * Encontra um usuário pelo seu endereço de e-mail.
 * A busca é case-insensitive (não diferencia maiúsculas de minúsculas).
 * @param {string} email O e-mail a ser buscado.
 * @returns {Promise<UserDB | null>} Uma Promise que resolve com o objeto do usuário se encontrado, ou `null` caso contrário.
 */
export const findUserByEmail = (email: string): Promise<UserDB | null> => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, firstName, lastName, username, email, password, avatarUrl, country, bio FROM users WHERE email = ? COLLATE NOCASE`;
        db.get(sql, [email], (err: Error | null, row: UserDB) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
};

/**
 * Encontra um usuário pelo seu nome de usuário (username).
 * A busca é case-insensitive.
 * @param {string} username O nome de usuário a ser buscado.
 * @returns {Promise<UserDB | null>} Uma Promise que resolve com o objeto do usuário se encontrado, ou `null` caso contrário.
 */
export const findUserByUsername = (username: string): Promise<UserDB | null> => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, firstName, lastName, username, email, password, avatarUrl, country, bio FROM users WHERE username = ? COLLATE NOCASE`;
        db.get(sql, [username], (err: Error | null, row: UserDB) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
};

/**
 * Encontra um usuário pelo seu ID único.
 * @param {number} id O ID do usuário a ser buscado.
 * @returns {Promise<UserDB | null>} Uma Promise que resolve com o objeto do usuário se encontrado, ou `null` caso contrário.
 */
export const findUserById = (id: number): Promise<UserDB | null> => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, firstName, lastName, username, email, password, avatarUrl, country, bio FROM users WHERE id = ?`;
        db.get(sql, [id], (err: Error | null, row: UserDB) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
};

/**
 * Atualiza os dados de um usuário existente.
 * Esta função constrói a query SQL dinamicamente com base nos campos fornecidos no objeto `data`.
 * @param {number} userId O ID do usuário a ser atualizado.
 * @param {UserProfileUpdateData} data Um objeto contendo apenas os campos a serem alterados.
 * @returns {Promise<number>} Uma Promise que resolve com o número de linhas afetadas.
 */
export const updateUser = (userId: number, data: UserProfileUpdateData): Promise<number> => {
    return new Promise((resolve, reject) => {
        const fields = [];
        const values = [];

        // Constrói dinamicamente os arrays de campos e valores para a query SQL.
        if (data.firstName) { fields.push("firstName = ?"); values.push(data.firstName); }
        if (data.lastName) { fields.push("lastName = ?"); values.push(data.lastName); }
        if (data.username) { fields.push("username = ?"); values.push(data.username); }
        if (data.email) { fields.push("email = ?"); values.push(data.email); }
        // Permite que country e bio sejam atualizados para uma string vazia (ou nulo).
        if (data.country !== undefined) { fields.push("country = ?"); values.push(data.country); }
        if (data.bio !== undefined) { fields.push("bio = ?"); values.push(data.bio); }

        // Se nenhum dado foi fornecido para atualização, retorna sem fazer nada.
        if (fields.length === 0) return resolve(0);

        // Atualiza o timestamp da última modificação.
        fields.push("updatedAt = CURRENT_TIMESTAMP");
        const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
        values.push(userId);

        db.run(sql, values, function (this: sqlite3.RunResult, err: Error | null) {
            if (err) return reject(err);
            resolve(this.changes);
        });
    });
};

/**
 * Atualiza a senha de um usuário específico.
 * @param {number} userId O ID do usuário.
 * @param {string} passwordHash O novo hash de senha a ser salvo.
 * @returns {Promise<number>} Uma Promise que resolve com o número de linhas afetadas.
 */
export const updateUserPassword = (userId: number, passwordHash: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
        db.run(sql, [passwordHash, userId], function (this: sqlite3.RunResult, err: Error | null) {
            if (err) return reject(err);
            resolve(this.changes);
        });
    });
};

/**
 * Atualiza o caminho do avatar de um usuário específico.
 * @param {number} userId O ID do usuário.
 * @param {string} avatarUrl O novo caminho para a imagem do avatar.
 * @returns {Promise<number>} Uma Promise que resolve com o número de linhas afetadas.
 */
export const updateUserAvatar = (userId: number, avatarUrl: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE users SET avatarUrl = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
        db.run(sql, [avatarUrl, userId], function (this: sqlite3.RunResult, err: Error | null) {
            if (err) return reject(err);
            resolve(this.changes);
        });
    });
};