/**
 * @fileoverview Controlador para todas as rotas de autenticação e gerenciamento de perfil de usuário.
 *
 * Este arquivo contém a lógica para:
 * - Exibir as páginas de Login e Cadastro (GET).
 * - Processar os dados dos formulários de Login e Cadastro (POST).
 * - Realizar o Logout do usuário.
 * - Processar as atualizações de dados do perfil, senha e avatar do usuário.
 */
import { Request, Response } from 'express';
import * as UserModel from '../models/userModel.js';
import * as AuthService from '../services/authService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para resolver o caminho raiz do projeto.
const __filename_authCtrl = fileURLToPath(import.meta.url);
const __dirname_authCtrl = path.dirname(__filename_authCtrl);
const projectRootPath = path.resolve(__dirname_authCtrl, '..', '..');

/**
 * Renderiza a página de login.
 * Se o usuário já estiver logado, redireciona para a página de perfil.
 */
export const getLoginPage = (req: Request, res: Response) => {
    if (req.session.user) {
        return res.redirect('/profile');
    }
    // Passa para o EJS possíveis mensagens de erro/sucesso e o e-mail preenchido anteriormente.
    res.render('login', {
        title: 'Login - Picoca Review',
        user: undefined,
        error: req.query.error,
        success: req.query.success,
        email: req.query.email || ''
    });
};

/**
 * Renderiza a página de cadastro.
 * Se o usuário já estiver logado, redireciona para a página de perfil.
 */
export const getSignUpPage = (req: Request, res: Response) => {
    if (req.session.user) {
        return res.redirect('/profile');
    }
    // Passa para o EJS possíveis mensagens de erro e os dados já inseridos para repopular o formulário.
    res.render('sign_up', {
        title: 'Registrar-se - Picoca Review',
        user: undefined,
        error: req.query.error,
        input: {
            firstName: req.query.firstName || '',
            lastName: req.query.lastName || '',
            username: req.query.username || '',
            email: req.query.email || ''
        }
    });
};

/**
 * Processa a submissão do formulário de cadastro.
 * Realiza validações, cria o novo usuário no banco de dados e inicia a sessão.
 */
export const handleSignUp = async (req: Request, res: Response) => {
    const { firstName, lastName, username, email, password, passwordConfirm } = req.body;
    // Prepara os parâmetros para repopular o formulário em caso de erro no redirecionamento.
    const queryParams = `&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;

    // 1. Validação dos dados de entrada.
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
        const lowerEmail = email.toLowerCase();
        const lowerUsername = username.toLowerCase();

        // 2. Verifica se o e-mail ou username já existem no banco de dados.
        const existingEmail = await UserModel.findUserByEmail(lowerEmail);
        if (existingEmail) {
            return res.redirect(`/signup?error=Este email já está em uso.${queryParams.replace(`&email=${encodeURIComponent(email)}`, '')}`);
        }
        const existingUsername = await UserModel.findUserByUsername(lowerUsername);
        if (existingUsername) {
            return res.redirect(`/signup?error=Este nome de usuário já está em uso.${queryParams.replace(`&username=${encodeURIComponent(username)}`, '')}`);
        }

        // 3. Cria o usuário e inicia a sessão.
        const passwordHash = await AuthService.hashPassword(password);
        const newUser: UserModel.NewUser = { firstName, lastName, username: lowerUsername, email: lowerEmail, passwordHash };
        const userId = await UserModel.createUser(newUser);
        const userFromDb = await UserModel.findUserById(userId);

        if (!userFromDb) return res.redirect(`/login?error=Erro ao buscar usuário após cadastro.`);

        // 4. Salva os dados do novo usuário na sessão.
        req.session.user = { id: userFromDb.id, username: userFromDb.username, email: userFromDb.email, firstName: userFromDb.firstName, lastName: userFromDb.lastName, avatarUrl: userFromDb.avatarUrl, country: userFromDb.country, bio: userFromDb.bio };
        req.session.save(err => {
            if (err) {
                console.error("Erro ao salvar sessão após signup:", err);
                return res.redirect(`/signup?error=Erro ao tentar logar após cadastro.${queryParams}`);
            }
            // Redireciona para o perfil com uma mensagem de sucesso.
            res.redirect('/profile?signup_success=true');
        });
    } catch (error: any) {
        console.error("Erro no cadastro:", error);
        let errorMessage = "Erro ao processar o cadastro.";
        // Trata erros de constraint do SQLite para fornecer feedback mais específico.
        if (error.code === 'SQLITE_CONSTRAINT') {
            errorMessage = error.message.includes("users.email") ? "Este email já está em uso." : "Este nome de usuário já está em uso.";
        }
        res.redirect(`/signup?error=${encodeURIComponent(errorMessage)}${queryParams}`);
    }
};

/**
 * Processa a submissão do formulário de login.
 * Verifica as credenciais, e se válidas, inicia a sessão do usuário.
 */
export const handleLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.redirect(`/login?error=Email e senha são obrigatórios.&email=${encodeURIComponent(email)}`);
    }
    try {
        // 1. Busca o usuário pelo e-mail (case-insensitive).
        const userFromDb = await UserModel.findUserByEmail(email.toLowerCase());
        if (!userFromDb || !userFromDb.password) {
            return res.redirect(`/login?error=Email ou senha inválidos.&email=${encodeURIComponent(email)}`);
        }
        // 2. Compara a senha fornecida com o hash armazenado no banco.
        const passwordMatch = await AuthService.comparePassword(password, userFromDb.password);
        if (!passwordMatch) {
            return res.redirect(`/login?error=Email ou senha inválidos.&email=${encodeURIComponent(email)}`);
        }
        // 3. Salva os dados do usuário na sessão.
        req.session.user = { id: userFromDb.id, username: userFromDb.username, email: userFromDb.email, firstName: userFromDb.firstName, lastName: userFromDb.lastName, avatarUrl: userFromDb.avatarUrl, country: userFromDb.country, bio: userFromDb.bio };
        req.session.save(err => {
            if (err) {
                console.error("Erro ao salvar sessão:", err);
                return res.redirect(`/login?error=Erro ao tentar logar.&email=${encodeURIComponent(email)}`);
            }
            // Redireciona para a página original que o usuário tentou acessar, ou para o perfil.
            const redirectTo = req.query.redirect as string || '/profile';
            const successQueryParam = redirectTo.includes('login_success=true') ? '' : (redirectTo.includes('?') ? '&' : '?') + 'login_success=true';
            res.redirect(redirectTo + successQueryParam);
        });
    } catch (error) {
        console.error("Erro no login:", error);
        res.redirect(`/login?error=Erro interno no servidor.&email=${encodeURIComponent(email)}`);
    }
};

/**
 * Destrói a sessão do usuário (logout).
 */
export const handleLogout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Erro ao fazer logout:", err);
            return res.redirect('/?logout_error=true');
        }
        // Limpa o cookie da sessão do navegador.
        res.clearCookie('connect.sid');
        res.redirect('/?logout_success=true');
    });
};

/**
 * Processa a atualização dos dados do perfil do usuário.
 */
export const handleUpdateProfile = async (req: Request, res: Response) => {
    const userId = req.session.user?.id;
    if (!userId) return res.redirect('/login?error=Sessão expirada.');

    const { firstName, lastName, username, email, country, bio } = req.body;
    const currentSessionUser = req.session.user;

    if (!firstName || !lastName || !username || !email ) {
         return res.redirect('/profile?error_profile=Campos Nome, Sobrenome, Usuário e Email são obrigatórios.#profile-content-pane');
    }

    // Cria um objeto contendo apenas os campos que foram realmente alterados.
    const updates: UserModel.UserProfileUpdateData = {};
    if (firstName.trim() !== currentSessionUser?.firstName) updates.firstName = firstName.trim();
    if (lastName.trim() !== currentSessionUser?.lastName) updates.lastName = lastName.trim();
    if (country !== currentSessionUser?.country) updates.country = country;
    if (bio !== currentSessionUser?.bio) updates.bio = bio;

    try {
        // Verifica se o novo username ou email já estão em uso por outro usuário.
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

        // Se houver alguma alteração, atualiza no banco de dados.
        if (Object.keys(updates).length > 0) {
            await UserModel.updateUser(userId, updates);
        }

        // Atualiza os dados na sessão ativa para refletir as mudanças imediatamente.
        if(req.session.user){ 
            Object.assign(req.session.user, updates);
            req.session.save();
        }
        // Redireciona de volta para a aba de perfil com mensagem de sucesso.
        res.redirect('/profile?success_profile=Perfil atualizado com sucesso!#profile-content-pane');
    } catch (error: any) {
        console.error("Erro ao atualizar perfil:", error);
        res.redirect('/profile?error_profile=Erro ao atualizar o perfil.#profile-content-pane');
    }
};

/**
 * Processa a alteração de senha do usuário.
 */
export const handleChangePassword = async (req: Request, res: Response) => {
    const userId = req.session.user?.id;
    if (!userId) return res.redirect('/login?error=Sessão expirada.');

    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    
    // 1. Validação dos campos.
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
        // 2. Verifica se a senha atual fornecida está correta.
        const user = await UserModel.findUserById(userId);
        if (!user || !user.password) {
            return res.redirect('/profile?error_password=Usuário não encontrado.#password-content-pane');
        }
        const isMatch = await AuthService.comparePassword(currentPassword, user.password);
        if (!isMatch) {
            return res.redirect('/profile?error_password=Senha atual incorreta.#password-content-pane');
        }
        
        // 3. Se a senha atual estiver correta, gera o hash da nova senha e a atualiza no banco.
        const newPasswordHash = await AuthService.hashPassword(newPassword);
        await UserModel.updateUserPassword(userId, newPasswordHash);
        res.redirect('/profile?success_password=Senha alterada com sucesso!#password-content-pane');
    } catch (error) {
        console.error("Erro ao alterar senha:", error);
        res.redirect('/profile?error_password=Erro ao alterar a senha.#password-content-pane');
    }
};

/**
 * Processa o upload e a atualização do avatar do usuário.
 */
export const handleUpdateAvatar = async (req: Request, res: Response) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).redirect('/login?error=Usuário não autenticado.');

    // O middleware 'uploadAvatar' já processou o arquivo neste ponto.
    if (!req.file) { 
        return res.redirect('/profile?error_avatar=Nenhum arquivo de imagem foi enviado.#avatar-content-pane');
    }

    try {
        const avatarPath = `/assets/img/avatars/${req.file.filename}`;
        const currentUser = await UserModel.findUserById(userId);
        const defaultAvatarPath = '/assets/img/avatars/default_avatar.png'; 

        // 1. Deleta o avatar antigo do sistema de arquivos para não acumular lixo.
        // Não deleta o avatar padrão.
        if (currentUser?.avatarUrl && currentUser.avatarUrl !== avatarPath && currentUser.avatarUrl !== defaultAvatarPath) {
            const oldAvatarPhysicalPath = path.join(projectRootPath, 'public', currentUser.avatarUrl);
             if (fs.existsSync(oldAvatarPhysicalPath)) {
                fs.unlink(oldAvatarPhysicalPath, (err) => {
                    if (err) console.error("Erro ao deletar avatar antigo:", oldAvatarPhysicalPath, err);
                });
            }
        }

        // 2. Atualiza o caminho do novo avatar no banco de dados.
        await UserModel.updateUserAvatar(userId, avatarPath);
        
        // 3. Atualiza o caminho do avatar na sessão ativa.
        if (req.session.user) {
            req.session.user.avatarUrl = avatarPath;
            req.session.save();
        }
        res.redirect('/profile?success_avatar=Avatar atualizado com sucesso!#avatar-content-pane');
    } catch (error: any) {
        console.error("Erro ao atualizar avatar no DB:", error);
        // Se houver um erro no banco, deleta o arquivo que acabou de ser upado para não deixar lixo.
        const tempFilePath = path.join(projectRootPath, 'public', 'assets', 'img', 'avatars', req.file.filename);
        if (fs.existsSync(tempFilePath)) {
            fs.unlink(tempFilePath, (err) => {
                if(err) console.error("Erro ao deletar arquivo de avatar temporário após falha no DB:", err);
            });
        }
        res.redirect(`/profile?error_avatar=${encodeURIComponent(error.message || 'Erro ao salvar o avatar.')}#avatar-content-pane`);
    }
};