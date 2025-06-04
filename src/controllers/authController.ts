// src/controllers/authController.ts
import { Request, Response } from 'express';
import * as UserModel from '../models/userModel.js';
import * as AuthService from '../services/authService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename_authCtrl = fileURLToPath(import.meta.url);
const __dirname_authCtrl = path.dirname(__filename_authCtrl);
const projectRootPath = path.resolve(__dirname_authCtrl, '..', '..');

export const getLoginPage = (req: Request, res: Response) => {
    if (req.session.user) {
        return res.redirect('/profile');
    }
    res.render('login', {
        title: 'Login - Picoca Review',
        user: undefined,
        error: req.query.error,
        success: req.query.success,
        email: req.query.email || ''
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
        input: {
            firstName: req.query.firstName || '',
            lastName: req.query.lastName || '',
            username: req.query.username || '',
            email: req.query.email || ''
            // country e bio não são campos no formulário de signup original
        }
    });
};

export const handleSignUp = async (req: Request, res: Response) => {
    // country e bio não vêm do signup, então serão nulos/undefined inicialmente
    const { firstName, lastName, username, email, password, passwordConfirm } = req.body;
    const queryParams = `&firstName=<span class="math-inline">\{encodeURIComponent\(firstName\)\}&lastName\=</span>{encodeURIComponent(lastName)}&username=<span class="math-inline">\{encodeURIComponent\(username\)\}&email\=</span>{encodeURIComponent(email)}`;

    if (!firstName || !lastName || !username || !email || !password || !passwordConfirm) {
        return res.redirect(`/signup?error=Todos os campos são obrigatórios.${queryParams}`);
    }
    // ... (outras validações de signup) ...
    if (password !== passwordConfirm) {
        return res.redirect(`/signup?error=As senhas não coincidem.${queryParams}`);
    }
    if (password.length < 8) {
        return res.redirect(`/signup?error=A senha deve ter no mínimo 8 caracteres.${queryParams}`);
    }

    try {
        const lowerEmail = email.toLowerCase();
        const lowerUsername = username.toLowerCase();

        const existingEmail = await UserModel.findUserByEmail(lowerEmail);
        if (existingEmail) {
            return res.redirect(`/signup?error=Este email já está em uso.${queryParams.replace(`&email=${encodeURIComponent(email)}`, '')}`);
        }
        const existingUsername = await UserModel.findUserByUsername(lowerUsername);
        if (existingUsername) {
            return res.redirect(`/signup?error=Este nome de usuário já está em uso.${queryParams.replace(`&username=${encodeURIComponent(username)}`, '')}`);
        }

        const passwordHash = await AuthService.hashPassword(password);
        // country e bio serão undefined aqui, resultando em NULL no DB
        const newUser: UserModel.NewUser = { firstName, lastName, username: lowerUsername, email: lowerEmail, passwordHash };
        const userId = await UserModel.createUser(newUser);
        const userFromDb = await UserModel.findUserById(userId);

        if (!userFromDb) return res.redirect(`/login?error=Erro ao buscar usuário após cadastro.`);

        req.session.user = {
            id: userFromDb.id,
            username: userFromDb.username,
            email: userFromDb.email,
            firstName: userFromDb.firstName,
            lastName: userFromDb.lastName,
            avatarUrl: userFromDb.avatarUrl,
            country: userFromDb.country, // Adicionado
            bio: userFromDb.bio          // Adicionado
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
        if (error.code === 'SQLITE_CONSTRAINT') {
            errorMessage = error.message.includes("users.email") ? "Este email já está em uso." : "Este nome de usuário já está em uso.";
        }
        res.redirect(`/signup?error=<span class="math-inline">\{encodeURIComponent\(errorMessage\)\}</span>{queryParams}`);
    }
};

export const handleLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.redirect(`/login?error=Email e senha são obrigatórios.&email=${encodeURIComponent(email)}`);
    }
    try {
        const userFromDb = await UserModel.findUserByEmail(email.toLowerCase());
        if (!userFromDb || !userFromDb.password) {
            return res.redirect(`/login?error=Email ou senha inválidos.&email=${encodeURIComponent(email)}`);
        }
        const passwordMatch = await AuthService.comparePassword(password, userFromDb.password);
        if (!passwordMatch) {
            return res.redirect(`/login?error=Email ou senha inválidos.&email=${encodeURIComponent(email)}`);
        }
        req.session.user = { // Carrega todos os dados para a sessão
            id: userFromDb.id,
            username: userFromDb.username,
            email: userFromDb.email,
            firstName: userFromDb.firstName,
            lastName: userFromDb.lastName,
            avatarUrl: userFromDb.avatarUrl,
            country: userFromDb.country, // Adicionado
            bio: userFromDb.bio          // Adicionado
        };
        req.session.save(err => {
            if (err) {
                console.error("Erro ao salvar sessão:", err);
                return res.redirect(`/login?error=Erro ao tentar logar.&email=${encodeURIComponent(email)}`);
            }
            const redirectTo = req.query.redirect as string || '/profile';
            const successQueryParam = redirectTo.includes('login_success=true') ? '' : (redirectTo.includes('?') ? '&' : '?') + 'login_success=true';
            res.redirect(redirectTo + successQueryParam);
        });
    } catch (error) {
        console.error("Erro no login:", error);
        res.redirect(`/login?error=Erro interno no servidor.&email=${encodeURIComponent(email)}`);
    }
};

export const handleLogout = (req: Request, res: Response) => { // Mesma lógica
    req.session.destroy((err) => {
        if (err) {
            console.error("Erro ao fazer logout:", err);
            return res.redirect('/?logout_error=true');
        }
        res.clearCookie('connect.sid');
        res.redirect('/?logout_success=true');
    });
};

export const handleUpdateProfile = async (req: Request, res: Response) => {
    const userId = req.session.user?.id;
    if (!userId) return res.redirect('/login?error=Sessão expirada.');

    const { firstName, lastName, username, email, country, bio } = req.body; // Adicionar country e bio
    const currentSessionUser = req.session.user;

    // Validação simples de campos obrigatórios (Nome, Sobrenome, Usuário, Email)
    if (!firstName || !lastName || !username || !email ) {
         return res.redirect('/profile?error_profile=Campos Nome, Sobrenome, Usuário e Email são obrigatórios.#profile-content-pane');
    }

    const updates: UserModel.UserProfileUpdateData = {};
    if (firstName.trim() !== currentSessionUser?.firstName) updates.firstName = firstName.trim();
    if (lastName.trim() !== currentSessionUser?.lastName) updates.lastName = lastName.trim();
    // Country e Bio podem ser strings vazias, então verificamos se são diferentes da sessão
    if (country !== currentSessionUser?.country) updates.country = country;
    if (bio !== currentSessionUser?.bio) updates.bio = bio;


    try {
        const newUsernameLower = username.trim().toLowerCase();
        if (newUsernameLower !== currentSessionUser?.username.toLowerCase()) {
            const existingUsername = await UserModel.findUserByUsername(newUsernameLower);
            if (existingUsername && existingUsername.id !== userId) {
                return res.redirect('/profile?error_profile=Este nome de usuário já está em uso.#profile-content-pane');
            }
            updates.username = newUsernameLower;
        }

        const newEmailLower = email.trim().toLowerCase();
        if (newEmailLower !== currentSessionUser?.email.toLowerCase()) {
            const existingEmail = await UserModel.findUserByEmail(newEmailLower);
            if (existingEmail && existingEmail.id !== userId) {
                return res.redirect('/profile?error_profile=Este email já está em uso.#profile-content-pane');
            }
            updates.email = newEmailLower;
        }

        if (Object.keys(updates).length > 0) {
            await UserModel.updateUser(userId, updates);
        }

        if(req.session.user){ 
            if(updates.firstName) req.session.user.firstName = updates.firstName;
            if(updates.lastName) req.session.user.lastName = updates.lastName;
            if(updates.username) req.session.user.username = updates.username;
            if(updates.email) req.session.user.email = updates.email;
            if(updates.country !== undefined) req.session.user.country = updates.country; // Adicionado
            if(updates.bio !== undefined) req.session.user.bio = updates.bio;             // Adicionado
            req.session.save();
        }
        res.redirect('/profile?success_profile=Perfil atualizado com sucesso!#profile-content-pane');
    } catch (error: any) {
        console.error("Erro ao atualizar perfil:", error);
        res.redirect('/profile?error_profile=Erro ao atualizar o perfil.#profile-content-pane');
    }
};

export const handleChangePassword = async (req: Request, res: Response) => { // Mesma lógica
    const userId = req.session.user?.id;
    if (!userId) return res.redirect('/login?error=Sessão expirada.');

    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.redirect('/profile?error_password=Todos os campos de senha são obrigatórios.#password-content-pane');
    }
    if (newPassword !== confirmNewPassword) {
        return res.redirect('/profile?error_password=As novas senhas não coincidem.#password-content-pane');
    }
    if (newPassword.length < 8) {
        return res.redirect('/profile?error_password=A nova senha deve ter no mínimo 8 caracteres.#password-content-pane');
    }

    try {
        const user = await UserModel.findUserById(userId);
        if (!user || !user.password) {
            return res.redirect('/profile?error_password=Usuário não encontrado.#password-content-pane');
        }
        const isMatch = await AuthService.comparePassword(currentPassword, user.password);
        if (!isMatch) {
            return res.redirect('/profile?error_password=Senha atual incorreta.#password-content-pane');
        }
        const newPasswordHash = await AuthService.hashPassword(newPassword);
        await UserModel.updateUserPassword(userId, newPasswordHash);
        res.redirect('/profile?success_password=Senha alterada com sucesso!#password-content-pane');
    } catch (error) {
        console.error("Erro ao alterar senha:", error);
        res.redirect('/profile?error_password=Erro ao alterar a senha.#password-content-pane');
    }
};

export const handleUpdateAvatar = async (req: Request, res: Response) => { // Mesma lógica
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).redirect('/login?error=Usuário não autenticado.');

    if (!req.file) { 
        return res.redirect('/profile?error_avatar=Nenhum arquivo de imagem foi enviado.#avatar-content-pane');
    }

    try {
        const avatarPath = `/assets/img/avatars/${req.file.filename}`;
        const currentUser = await UserModel.findUserById(userId);
        const defaultAvatarPath = '/assets/img/avatars/default_avatar.png'; 

        if (currentUser?.avatarUrl && currentUser.avatarUrl !== avatarPath && currentUser.avatarUrl !== defaultAvatarPath) {
            const oldAvatarPhysicalPath = path.join(projectRootPath, 'public', currentUser.avatarUrl);
             if (fs.existsSync(oldAvatarPhysicalPath)) {
                fs.unlink(oldAvatarPhysicalPath, (err) => {
                    if (err) console.error("Erro ao deletar avatar antigo:", oldAvatarPhysicalPath, err);
                });
            }
        }

        await UserModel.updateUserAvatar(userId, avatarPath);
        if (req.session.user) {
            req.session.user.avatarUrl = avatarPath;
            req.session.save();
        }
        res.redirect('/profile?success_avatar=Avatar atualizado com sucesso!#avatar-content-pane');
    } catch (error: any) {
        console.error("Erro ao atualizar avatar no DB:", error);
        const tempFilePath = path.join(projectRootPath, 'public', 'assets', 'img', 'avatars', req.file.filename);
        if (fs.existsSync(tempFilePath)) {
            fs.unlink(tempFilePath, (err) => {
                if(err) console.error("Erro ao deletar arquivo de avatar temporário após falha no DB:", err);
            });
        }
        res.redirect(`/profile?error_avatar=${encodeURIComponent(error.message || 'Erro ao salvar o avatar.')}#avatar-content-pane`);
    }
};