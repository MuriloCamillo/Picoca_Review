/**
 * @fileoverview Arquivo principal de configuração da aplicação Express.
 *
 * Este arquivo é o coração do servidor. Ele é responsável por:
 * - Inicializar a instância do Express.
 * - Configurar o template engine (EJS).
 * - Definir e aplicar todos os middlewares globais, como:
 * - Parsers para JSON e dados de formulário.
 * - Servidor de arquivos estáticos.
 * - Gerenciamento de sessões de usuário com armazenamento em SQLite.
 * - Disponibilização de dados globais para todas as views (res.locals).
 * - Registrar os roteadores para as diferentes partes da aplicação.
 * - Configurar os middlewares de tratamento de erros (erros de upload, 404, 500).
 */
import express from 'express';
import path from 'path';
import session, { Store, CookieOptions } from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';

// Importa os dados estáticos que serão disponibilizados globalmente.
import seriesData from './data/seriesData.js';
import newsData from './data/newsData.js';

// --- 1. Importação de Módulos e Roteadores ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import pageRoutes from './routes/pageRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userSeriesRoutes from './routes/userSeriesRoutes.js';
import { UserSessionData } from './types/express.js';
import seriesRatingRoutes from './routes/seriesRatingRoutes.js';

// --- 2. Inicialização e Configuração do Express ---
const app = express();
const SQLiteStoreFactory = connectSqlite3(session);
const projectRoot = path.resolve(__dirname, '..');

// Configura o EJS como o motor de templates.
app.set('view engine', 'ejs');
app.set('views', path.join(projectRoot, 'views'));

// --- 3. Middlewares Essenciais ---

// Middleware para interpretar o corpo de requisições com formato JSON.
app.use(express.json());
// Middleware para interpretar o corpo de requisições de formulários (URL-encoded).
app.use(express.urlencoded({ extended: true }));
// Middleware para servir arquivos estáticos (CSS, JS, imagens) da pasta 'public'.
app.use(express.static(path.join(projectRoot, 'public')));

// --- 4. Configuração de Sessão ---
const cookieOptions: CookieOptions = {
    maxAge: 24 * 60 * 60 * 1000, // Duração do cookie: 24 horas.
    httpOnly: true,             // Previne acesso ao cookie via JavaScript no cliente.
    secure: process.env.NODE_ENV === 'production', // Usa cookies seguros (HTTPS) apenas em produção.
    sameSite: 'lax'             // Proteção contra ataques CSRF.
};
if (process.env.NODE_ENV !== 'production') {
    cookieOptions.secure = false;
}

// Configura o middleware de sessão, usando 'connect-sqlite3' para persistir as sessões no banco de dados.
app.use(session({
    store: new SQLiteStoreFactory({
        db: 'picocareview.sqlite',
        dir: path.join(projectRoot, 'data'),
        table: 'sessions',
        concurrentDB: "true"
    }) as Store,
    secret: process.env.SESSION_SECRET || 'um_segredo_bem_longo_e_aleatorio_para_proteger_as_sessoes_do_picoca_review_123!@#_MUDE_ISSO_AGORA_EM_PRODUCAO',
    resave: false,               // Não salva a sessão se não for modificada.
    saveUninitialized: false,    // Não cria sessão para usuários não autenticados.
    cookie: cookieOptions
}));

// --- 5. Middleware de Variáveis Locais (res.locals) ---
// Este middleware torna variáveis disponíveis em TODOS os templates EJS renderizados.
app.use((req, res, next) => {
    // Informações do usuário logado.
    res.locals.user = req.session.user as UserSessionData | undefined;
    
    // Flags de feedback (sucesso/erro) lidas da query string da URL.
    res.locals.login_success = req.query.login_success;
    res.locals.signup_success = req.query.signup_success;
    res.locals.logout_success = req.query.logout_success;
    res.locals.logout_error = req.query.logout_error;
    res.locals.success = req.query.success;
    res.locals.error = req.query.error as string | undefined;

    // Flags específicas para o formulário de perfil.
    res.locals.error_profile = req.query.error_profile;
    res.locals.success_profile = req.query.success_profile;
    res.locals.error_password = req.query.error_password;
    res.locals.success_password = req.query.success_password;
    res.locals.error_avatar = req.query.error_avatar;
    res.locals.success_avatar = req.query.success_avatar;

    // Disponibiliza os dados de séries e notícias para todos os templates.
    res.locals.seriesData = seriesData;
    res.locals.newsData = newsData;

    // Repopula formulários de login/cadastro em caso de erro.
    if (req.path === '/signup' && req.method === 'GET') {
        res.locals.input = {
            firstName: req.query.firstName || '',
            lastName: req.query.lastName || '',
            username: req.query.username || '',
            email: req.query.email || ''
        };
    }
    if (req.path === '/login' && req.method === 'GET') {
        res.locals.email = req.query.email || '';
    }

    // Variáveis úteis para a UI, como destacar o link ativo na navbar.
    res.locals.currentPath = req.path;
    res.locals.originalUrl = req.originalUrl;
    res.locals.seriesId = req.params.seriesId;
    res.locals.newsId = req.params.newsId;
    
    next(); // Passa para o próximo middleware (roteadores).
});

// --- 6. Registro dos Roteadores ---
app.use('/', pageRoutes);
app.use('/', authRoutes);
app.use('/user', userSeriesRoutes);
app.use('/user', seriesRatingRoutes);

// --- 7. Middlewares de Tratamento de Erros ---
// A ordem dos tratadores de erro é importante.

// Tratador de erros específico para o Multer (upload de arquivos).
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof multer.MulterError) {
        let message = 'Erro no upload do arquivo.';
        if (err.code === 'LIMIT_FILE_SIZE') message = 'Arquivo muito grande. O tamanho máximo é 2MB.';
        else if (err.code === 'LIMIT_UNEXPECTED_FILE') message = 'Tipo de arquivo não esperado ou campo inválido.';
        return res.redirect(`/profile?error_avatar=${encodeURIComponent(message)}#avatar`);
    } else if (err && err.message && err.message.includes('Apenas imagens')) {
       return res.redirect(`/profile?error_avatar=${encodeURIComponent(err.message)}#avatar`);
    }
    // Se não for um erro do Multer, passa para o próximo tratador.
    next(err);
});

// Tratador de erro 404 (Not Found).
// Este middleware é alcançado se nenhuma rota anterior corresponder à requisição.
app.use((req, res, next) => {
    const user = req.session?.user;
    res.status(404).render('error', {
        title: 'Página Não Encontrada (404)',
        message: 'Oops! A página que você está procurando não existe em nosso universo.',
        user, status: 404
    });
});

// Tratador de erro global (catch-all).
// Captura quaisquer outros erros que ocorrerem na aplicação.
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("ERRO GLOBAL:", err.stack || err);
    const status = err.status || 500;
    const user = req.session?.user;
    if (!res.headersSent) {
        res.status(status).render('error', {
            title: `Erro ${status}`,
            message: err.expose ? err.message : 'Ocorreu um erro inesperado.',
            user, status,
            // Mostra o stack trace do erro apenas em ambiente de desenvolvimento.
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

export default app;