// src/app.ts
import express from 'express';
import path from 'path';
import session, { Store, CookieOptions } from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import pageRoutes from './routes/pageRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userSeriesRoutes from './routes/userSeriesRoutes.js';
import { UserSessionData } from './types/express.js';
import seriesRatingRoutes from './routes/seriesRatingRoutes.js';

const app = express();
const SQLiteStoreFactory = connectSqlite3(session);
const projectRoot = path.resolve(__dirname, '..');

app.set('view engine', 'ejs');
app.set('views', path.join(projectRoot, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(projectRoot, 'public')));

const cookieOptions: CookieOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' // Adicionado para segurança
};
if (process.env.NODE_ENV !== 'production') {
    cookieOptions.secure = false;
}

app.use(session({
    store: new SQLiteStoreFactory({
        db: 'picocareview.sqlite',
        dir: path.join(projectRoot, 'data'),
        table: 'sessions',
        concurrentDB: "true"
    }) as Store,
    secret: process.env.SESSION_SECRET || 'um_segredo_bem_longo_e_aleatorio_para_proteger_as_sessoes_do_picoca_review_123!@#_MUDE_ISSO_AGORA_EM_PRODUCAO',
    resave: false,
    saveUninitialized: false, // Alterado para false para melhor prática, salva apenas se modificada.
                             // Pode ser true se houver problemas com sessões não persistindo imediatamente.
    cookie: cookieOptions
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user as UserSessionData | undefined;
    res.locals.login_success = req.query.login_success;
    res.locals.signup_success = req.query.signup_success;
    res.locals.logout_success = req.query.logout_success;
    res.locals.logout_error = req.query.logout_error;
    res.locals.success = req.query.success;
    res.locals.error = req.query.error as string | undefined;

    res.locals.error_profile = req.query.error_profile;
    res.locals.success_profile = req.query.success_profile;
    res.locals.error_password = req.query.error_password;
    res.locals.success_password = req.query.success_password;
    res.locals.error_avatar = req.query.error_avatar;
    res.locals.success_avatar = req.query.success_avatar;

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
    res.locals.currentPath = req.path;
    res.locals.originalUrl = req.originalUrl;
    res.locals.seriesId = req.params.seriesId; // Para navbar active class em series_info
    res.locals.newsId = req.params.newsId;     // Para navbar active class em news_default
    next();
});

app.use('/', pageRoutes);
app.use('/', authRoutes);
app.use('/user', userSeriesRoutes);
app.use('/user', seriesRatingRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof multer.MulterError) {
        let message = 'Erro no upload do arquivo.';
        if (err.code === 'LIMIT_FILE_SIZE') message = 'Arquivo muito grande. O tamanho máximo é 2MB.';
        else if (err.code === 'LIMIT_UNEXPECTED_FILE') message = 'Tipo de arquivo não esperado ou campo inválido.';
        return res.redirect(`/profile?error_avatar=${encodeURIComponent(message)}#avatar`);
    } else if (err && err.message && err.message.includes('Apenas imagens')) { // Erro do fileFilter
         return res.redirect(`/profile?error_avatar=${encodeURIComponent(err.message)}#avatar`);
    }
    // Outros erros passam para o próximo tratador
    next(err);
});

app.use((req, res, next) => {
    const user = req.session?.user;
    res.status(404).render('error', {
        title: 'Página Não Encontrada (404)',
        message: 'Oops! A página que você está procurando não existe em nosso universo.',
        user, status: 404
    });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("ERRO GLOBAL:", err.stack || err);
    const status = err.status || 500;
    const user = req.session?.user;
    if (!res.headersSent) {
        res.status(status).render('error', {
            title: `Erro ${status}`,
            message: err.expose ? err.message : 'Ocorreu um erro inesperado.', // Expor apenas se seguro
            user, status,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

export default app;