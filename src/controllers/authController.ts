// src/controllers/authController.ts
import { Request, Response } from 'express';
import * as UserModel from '../models/userModel.js';
import * as AuthService from '../services/authService.js';
import { UserSessionData } from '../types/express.js';

export const getLoginPage = (req: Request, res: Response) => {
    if (req.session.user) {
        return res.redirect('/profile');
    }
    res.render('login', {
        title: 'Login - Picoca Review',
        user: undefined,
        error: req.query.error,
        email: req.query.email || '' // Para repopular em caso de erro
    });
};

export const getSignUpPage = (req: Request, res: Response) => {
    if (req.session.user) {
        return res.redirect('/profile');
    }
    res.render('sign_up', {
        title: 'Registrar-se - Picoca Review',
        user: undefined,
        error: req.query.error,
        input: { // Para repopular campos
            firstName: req.query.firstName || '',
            lastName: req.query.lastName || '',
            username: req.query.username || '',
            email: req.query.email || ''
        }
    });
};

export const handleSignUp = async (req: Request, res: Response) => {
    const { firstName, lastName, username, email, password, passwordConfirm } = req.body;
    const queryParams = `&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;

    if (!firstName || !lastName || !username || !email || !password || !passwordConfirm) {
        return res.redirect(`/signup?error=Todos os campos são obrigatórios.${queryParams}`);
    }
    if (password !== passwordConfirm) {
        return res.redirect(`/signup?error=As senhas não coincidem.${queryParams}`);
    }
    if (password.length < 8) {
        return res.redirect(`/signup?error=A senha deve ter no mínimo 8 caracteres.${queryParams}`);
    }

    try {
        const existingEmail = await UserModel.findUserByEmail(email);
        if (existingEmail) {
            return res.redirect(`/signup?error=Este email já está em uso.${queryParams.replace(`&email=${encodeURIComponent(email)}`, '')}`);
        }
        const existingUsername = await UserModel.findUserByUsername(username);
        if (existingUsername) {
            return res.redirect(`/signup?error=Este nome de usuário já está em uso.${queryParams.replace(`&username=${encodeURIComponent(username)}`, '')}`);
        }

        const passwordHash = await AuthService.hashPassword(password);
        const newUser: UserModel.NewUser = { firstName, lastName, username, email, passwordHash };
        const userId = await UserModel.createUser(newUser);

        req.session.user = {
            id: userId,
            username: newUser.username,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName
        };
        req.session.save(err => {
            if (err) {
                console.error("Erro ao salvar sessão após signup:", err);
                return res.redirect(`/signup?error=Erro ao tentar logar após cadastro.${queryParams}`);
            }
            res.redirect('/profile?signup_success=true');
        });

    } catch (error: any) {
        console.error("Erro no cadastro:", error);
        let errorMessage = "Erro ao processar o cadastro.";
        if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes("users.email")) {
            errorMessage = "Este email já está em uso.";
        } else if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes("users.username")) {
            errorMessage = "Este nome de usuário já está em uso.";
        }
        res.redirect(`/signup?error=${encodeURIComponent(errorMessage)}${queryParams}`);
    }
};

export const handleLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.redirect(`/login?error=Email e senha são obrigatórios.&email=${encodeURIComponent(email)}`);
    }

    try {
        const userFromDb = await UserModel.findUserByEmail(email); // Renomeado para evitar conflito com req.session.user
        if (!userFromDb || !userFromDb.password) {
            return res.redirect(`/login?error=Email ou senha inválidos.&email=${encodeURIComponent(email)}`);
        }

        const passwordMatch = await AuthService.comparePassword(password, userFromDb.password);
        if (!passwordMatch) {
            return res.redirect(`/login?error=Email ou senha inválidos.&email=${encodeURIComponent(email)}`);
        }

        req.session.user = {
            id: userFromDb.id,
            username: userFromDb.username,
            email: userFromDb.email,
            firstName: userFromDb.firstName,
            lastName: userFromDb.lastName
        };
        req.session.save(err => {
            if (err) {
                console.error("Erro ao salvar sessão:", err);
                return res.redirect(`/login?error=Erro ao tentar logar.&email=${encodeURIComponent(email)}`);
            }
            const redirectTo = req.query.redirect as string || '/profile?login_success=true';
            res.redirect(redirectTo.includes('login_success=true') ? redirectTo : `${redirectTo}${redirectTo.includes('?') ? '&' : '?'}login_success=true`);
        });

    } catch (error) {
        console.error("Erro no login:", error);
        res.redirect(`/login?error=Erro interno no servidor.&email=${encodeURIComponent(email)}`);
    }
};

export const handleLogout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Erro ao fazer logout:", err);
            return res.redirect('/?logout_error=true');
        }
        res.clearCookie('connect.sid');
        res.redirect('/?logout_success=true');
    });
};