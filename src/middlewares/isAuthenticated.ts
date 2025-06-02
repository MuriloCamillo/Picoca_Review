// src/middlewares/isAuthenticated.ts
import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        return next();
    }
    // Guarda a URL original para redirecionar após o login
    const originalUrl = req.originalUrl || '/';
    res.redirect(`/login?redirect=${encodeURIComponent(originalUrl)}&error=${encodeURIComponent('Você precisa estar logado para acessar esta página.')}`);
};