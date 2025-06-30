/**
 * @fileoverview Configura e inicializa a conexão com o banco de dados SQLite.
 *
 * Este script é responsável por:
 * 1. Definir os caminhos para o diretório de dados e o arquivo do banco de dados.
 * 2. Garantir que o diretório de dados exista antes de tentar criar o arquivo do banco.
 * 3. Estabelecer a conexão com o arquivo de banco de dados 'picocareview.sqlite'.
 * 4. Chamar a função de inicialização que cria todas as tabelas necessárias caso elas ainda não existam.
 * 5. Exportar a instância da conexão do banco de dados para ser usada em toda a aplicação (nos Models).
 */
import sqlite3raw from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// --- 1. Configuração de Caminhos ---

// Habilita o modo "verbose" do SQLite para obter mais informações de depuração.
const sqlite3 = sqlite3raw.verbose();

// Resolve os caminhos absolutos para a raiz do projeto e o diretório de dados.
// Isso garante que o script funcione independentemente de onde ele for executado.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
const dataDir = path.resolve(projectRoot, 'data');
const dbPath = path.resolve(dataDir, 'picocareview.sqlite');

// --- 2. Criação do Diretório de Dados ---

// Verifica se o diretório 'data/' existe. Se não, ele é criado.
if (!fs.existsSync(dataDir)) {
    try {
        fs.mkdirSync(dataDir, { recursive: true });
    } catch (error: any) {
        console.error("Erro crítico: Não foi possível criar o diretório 'data'. Saindo...", error.message);
        process.exit(1); // Encerra a aplicação se não for possível criar o diretório.
    }
}

// --- 3. Conexão com o Banco de Dados ---

// Cria uma nova instância do banco de dados. O arquivo será criado se não existir.
const db = new sqlite3.Database(dbPath, (err: Error | null) => {
    if (err) {
        console.error('Erro crítico: Não foi possível abrir o banco de dados SQLite. Saindo...', err.message);
        process.exit(1);
    } else {
        console.log('Conexão com o banco de dados SQLite estabelecida com sucesso.');
        // Após a conexão bem-sucedida, inicializa as tabelas.
        initializeUserTables();
    }
});

/**
 * Garante que todas as tabelas da aplicação existam no banco de dados.
 * Executa os comandos `CREATE TABLE IF NOT EXISTS` para cada tabela.
 */
function initializeUserTables() {
    db.serialize(() => {
        // Tabela de Usuários: Armazena informações de cadastro e perfil.
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

        // Tabela de Listas de Séries: Associa usuários a séries (watchlist/likelist).
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
           // Tabela de Avaliações: Armazena a nota que um usuário deu para uma série.
           db.run(`
            CREATE TABLE IF NOT EXISTS user_series_ratings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                series_id TEXT NOT NULL,
                rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
                rated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, series_id)
            )
        `, (err: Error | null) => {
            if (err) console.error("Erro ao criar tabela 'user_series_ratings':", err.message);
        });
}

// Exporta a instância 'db' para ser usada em outras partes da aplicação (principalmente nos Models).
export default db;