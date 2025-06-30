/**
 * @fileoverview Arquivo de Declaração de Tipos para o Express.
 *
 * Este arquivo utiliza o "Declaration Merging"
 * para estender as interfaces nativas da biblioteca Express.
 * O objetivo é adicionar nossas próprias propriedades customizadas aos objetos
 * `Request` e `Session`, garantindo que o TypeScript as reconheça e forneça
 * autocompletar e segurança de tipo em toda a aplicação.
 */
import session from 'express-session';

/**
 * Define a estrutura do objeto 'user' que será armazenado na sessão.
 * Isso garante que, sempre que acessarmos `req.session.user`, o TypeScript
 * saiba exatamente quais propriedades estão disponíveis.
 */
export interface UserSessionData {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    country?: string;
    bio?: string;
}

// Estende a declaração do módulo 'express-session'.
declare module 'express-session' {
    // Adiciona a propriedade opcional 'user' à interface SessionData.
    interface SessionData {
        user?: UserSessionData;
    }
}

// Estende a declaração global do namespace 'Express'.
declare global {
    namespace Express {
        // Adiciona ou sobrescreve propriedades na interface Request do Express.
        interface Request {
            // Sobrescreve a tipagem padrão de 'session' para incluir nossa propriedade 'user'.
            // Isso nos permite acessar `req.session.user` de forma segura.
            session: session.Session & Partial<session.SessionData> & { user?: UserSessionData };
            
            // Adiciona a propriedade opcional 'originalUrl' para consistência.
            originalUrl?: string;
            
            // Adiciona uma propriedade customizada para carregar erros de validação de arquivo.
            fileValidationError?: string;
        }
    }
}