// src/config/database.ts
import sqlite3raw from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Derivar __filename e __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlite3 = sqlite3raw.verbose();

// Caminho para o diretório raiz do projeto
// __dirname aqui é src/config/, então subimos dois níveis
const projectRoot = path.resolve(__dirname, '..', '..'); 
const dataDir = path.resolve(projectRoot, 'data');
const dbPath = path.resolve(dataDir, 'picocareview.sqlite');

// Cria o diretório 'data' se ele não existir
if (!fs.existsSync(dataDir)) {
    try {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log("Diretório 'data' criado em:", dataDir);
    } catch (error: any) {
        console.error("Erro ao criar diretório 'data':", error.message);
        process.exit(1); // Sai se não conseguir criar o diretório do BD
    }
}

const db = new sqlite3.Database(dbPath, (err: Error | null) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados SQLite:', err.message);
        process.exit(1); // Sai se não conseguir conectar ao BD
    } else {
        console.log('Conectado ao banco de dados SQLite em:', dbPath);
        initializeUserTables(); // Chama a função para criar apenas as tabelas do usuário
    }
});

function initializeUserTables() {
    db.serialize(() => {
        // Tabela de Usuários
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err: Error | null) => {
            if (err) {
                console.error("Erro ao criar tabela 'users':", err.message);
            } else {
                console.log("Tabela 'users' verificada/criada.");
            }
        });

        // Tabela de Listas de Séries do Usuário
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
            if (err) {
                console.error("Erro ao criar tabela 'user_series_lists':", err.message);
            } else {
                console.log("Tabela 'user_series_lists' verificada/criada.");
            }
        });

        // A TABELA 'sessions' NÃO É MAIS CRIADA AQUI.
        // A biblioteca connect-sqlite3 irá criá-la automaticamente com o esquema que ela espera,
        // que inclui uma coluna 'expire' (sem 'd').
    });
    console.log("Inicialização das tabelas de usuário programada.");
}

// Verificação para execução manual do script (opcional)
if (typeof require !== 'undefined' && require.main === module) {
     console.log("Este script agora apenas conecta e inicializa tabelas de usuário se chamado diretamente.");
}

export default db;