// src/config/database.ts
import sqlite3raw from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sqlite3 = sqlite3raw.verbose();
const projectRoot = path.resolve(__dirname, '..', '..');
const dataDir = path.resolve(projectRoot, 'data');
const dbPath = path.resolve(dataDir, 'picocareview.sqlite');

if (!fs.existsSync(dataDir)) {
    try {
        fs.mkdirSync(dataDir, { recursive: true });
    } catch (error: any) {
        console.error("Erro ao criar diretório 'data':", error.message);
        process.exit(1);
    }
}

const db = new sqlite3.Database(dbPath, (err: Error | null) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados SQLite:', err.message);
        process.exit(1);
    } else {
        initializeUserTables();
    }
});

function initializeUserTables() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                avatarUrl TEXT,
                country TEXT, 
                bio TEXT,     
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err: Error | null) => {
            if (err) console.error("Erro ao criar tabela 'users':", err.message);
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS user_series_lists (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                series_id TEXT NOT NULL,
                list_type TEXT NOT NULL CHECK(list_type IN ('watchlist', 'likelist')),
                added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, series_id, list_type)
            )
        `, (err: Error | null) => {
            if (err) console.error("Erro ao criar tabela 'user_series_lists':", err.message);
        });
    });
}
export default db;