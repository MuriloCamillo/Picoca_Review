// src/types/express.d.ts
import session from 'express-session';

export interface UserSessionData {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    country?: string; // Adicionado
    bio?: string;     // Adicionado
}

declare module 'express-session' {
    interface SessionData {
        user?: UserSessionData;
    }
}

declare global {
    namespace Express {
        interface Request {
            session: session.Session & Partial<session.SessionData> & { user?: UserSessionData };
            originalUrl?: string;
            fileValidationError?: string;
        }
    }
}