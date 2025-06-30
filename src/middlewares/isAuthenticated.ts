/**
 * @fileoverview Middleware do Express para verificar se um usuário está autenticado.
 *
 * Este middleware é usado para proteger rotas que exigem autenticação. Ele verifica
 * se há informações de usuário na sessão atual. Se houver, permite que a
 * requisição continue. Caso contrário, redireciona o usuário para a página de login,
 * anexando a URL original como um parâmetro de redirecionamento para uma melhor
 * experiência do usuário.
 */
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware que verifica a presença do usuário na sessão.
 * @param {Request} req O objeto de requisição do Express.
 * @param {Response} res O objeto de resposta do Express.
 * @param {NextFunction} next A função de callback para passar o controle para o próximo middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    // 1. Verifica se o objeto `user` existe na sessão (`req.session`).
    // Se existir, significa que o usuário está logado.
    if (req.session.user) {
        // O usuário está autenticado, então permite que a requisição prossiga para o próximo
        // manipulador de rota ou middleware na pilha.
        return next();
    }

    // 2. Se o usuário não estiver na sessão, ele não está autenticado.
    
    // Guarda a URL que o usuário estava tentando acessar originalmente.
    // Isso permite que, após o login, o sistema o redirecione de volta para onde ele parou.
    const originalUrl = req.originalUrl || '/';
    
    // Redireciona o usuário para a página de login, passando dois parâmetros de consulta:
    // - `redirect`: A URL original, para que o sistema saiba para onde voltar.
    // - `error`: Uma mensagem informando por que ele foi redirecionado.
    res.redirect(`/login?redirect=${encodeURIComponent(originalUrl)}&error=${encodeURIComponent('Você precisa estar logado para acessar esta página.')}`);
};