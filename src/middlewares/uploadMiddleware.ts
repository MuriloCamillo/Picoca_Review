// src/middlewares/uploadMiddleware.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Request } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
const avatarUploadPath = path.join(projectRoot, 'public', 'assets', 'img', 'avatars');

if (!fs.existsSync(avatarUploadPath)) {
    try {
        fs.mkdirSync(avatarUploadPath, { recursive: true });
        console.log("Diretório de avatars criado em:", avatarUploadPath);
    } catch (error: any) {
        console.error("Erro ao criar diretório de avatars:", error.message);
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, avatarUploadPath);
    },
    filename: (req: Request, file, cb) => {
        const userId = req.session.user?.id;
        if (!userId) {
            return cb(new Error('Usuário não autenticado para upload de avatar.'), '');
        }
        const extension = path.extname(file.originalname);
        cb(null, `user_${userId}${extension}`);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'image/webp') {
        cb(null, true);
    } else {
        // Passa o erro para ser tratado pelo error handler do multer/express
        cb(new Error('Apenas imagens (JPEG, PNG, GIF, WEBP) são permitidas!'));
    }
};

export const uploadAvatar = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2 // 2MB
    },
    fileFilter: fileFilter
});