import express from 'express';
import path from 'path';
import session, { Store, CookieOptions } from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Derivar __filename e __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import pageRoutes from './routes/pageRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userSeriesRoutes from './routes/userSeriesRoutes.js';
import { UserSessionData } from './types/express.js';

const app = express();
const SQLiteStoreFactory = connectSqlite3(session);

// __dirname aqui é src/, então subimos um nível para a raiz do projeto
const projectRoot = path.resolve(__dirname, '..'); 

app.set('view engine', 'ejs');
app.set('views', path.join(projectRoot, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(projectRoot, 'public')));

// Define as opções do cookie de forma explícita
const cookieOptions: CookieOptions = {
    maxAge: 24 * 60 * 60 * 1000, // 1 dia
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Será false em desenvolvimento se NODE_ENV não for 'production'
    // sameSite: 'lax' // Considerar adicionar para segurança adicional
};
// Garante que 'secure' seja false em desenvolvimento se não estiver explicitamente configurado
if (process.env.NODE_ENV !== 'production') {
    cookieOptions.secure = false;
}

app.use(session({
    store: new SQLiteStoreFactory({
        db: 'picocareview.sqlite', // Nome do arquivo do BD que connect-sqlite3 usará
        dir: path.join(projectRoot, 'data'), // Diretório onde o BD de sessões será salvo/encontrado
        table: 'sessions', // Nome da tabela de sessões que connect-sqlite3 criará/usará
        concurrentDB: "true" // Mantido como string conforme tipagem
    }) as Store, // Asserção de tipo para compatibilidade
    secret: 'um_segredo_bem_longo_e_aleatorio_para_proteger_as_sessoes_do_picoca_review_123!@#_MUDE_ISSO_AGORA', // MUDE ESTE SEGREDO PARA ALGO FORTE E ÚNICO!
    resave: false, // Não salva a sessão se não foi modificada
    saveUninitialized: true, // IMPORTANTE: Salva sessões novas mesmo que vazias. Ajuda a evitar o erro 'expires'.
                             // Para produção, considere reavaliar e testar com 'false' se não houver problemas.
    cookie: cookieOptions
}));

// Middleware para expor dados da sessão e query params de notificação para todas as views
app.use((req, res, next) => {
    res.locals.user = req.session.user as UserSessionData | undefined;
    res.locals.login_success = req.query.login_success;
    res.locals.signup_success = req.query.signup_success;
    res.locals.logout_success = req.query.logout_success;
    res.locals.logout_error = req.query.logout_error;
    
    if (req.query.error) {
        res.locals.error = req.query.error as string;
    }
    // Para repopular formulários em caso de erro de validação no backend
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
    // Para passar a URL atual para o EJS (útil para o link de login na página de detalhes da série)
    res.locals.currentPath = req.path;
    res.locals.originalUrl = req.originalUrl;


    next();
});

// Rotas
app.use('/', pageRoutes);
app.use('/', authRoutes); // Lida com /login, /signup, /logout
app.use('/user', userSeriesRoutes); // Rotas como /user/series/:seriesId/watchlist

// Tratador de erro 404 (deve ser após todas as rotas principais)
app.use((req, res, next) => {
    const user = (req.session && req.session.user) ? req.session.user : undefined;
    res.status(404).render('error', {
        title: 'Página Não Encontrada (404)',
        message: 'Oops! A página que você está procurando não existe em nosso universo.',
        user: user,
        status: 404
    });
});

// Tratador de erros global (deve ser o último middleware)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("ERRO GLOBAL DETECTADO:", err); // Mantém o log do erro global
    const status = err.status || 500;
    const sessionUser = (req.session && req.session.user) ? req.session.user : undefined;
    res.status(status).render('error', {
        title: `Erro ${status} no Servidor`,
        message: err.message || 'Ocorreu um erro inesperado em nossos sistemas.',
        user: sessionUser,
        status: status,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

export default app;