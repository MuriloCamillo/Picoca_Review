/**
 * @fileoverview Middleware do Express para o processamento de upload de arquivos (avatares).
 *
 * Este arquivo utiliza a biblioteca 'multer' para configurar um middleware completo
 * que lida com o upload de imagens de avatar dos usuários. Suas responsabilidades incluem:
 * - Definir o local de armazenamento dos arquivos no disco.
 * - Criar um nome de arquivo único e previsível para o avatar de cada usuário.
 * - Validar o tipo (MIME type) e o tamanho do arquivo enviado.
 * - Exportar a instância configurada do multer para ser usada nas rotas.
 */
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Request } from 'express';

// --- 1. Configuração de Caminhos ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
const avatarUploadPath = path.join(projectRoot, 'public', 'assets', 'img', 'avatars');

// Garante que o diretório de destino para os avatares exista.
if (!fs.existsSync(avatarUploadPath)) {
    try {
        fs.mkdirSync(avatarUploadPath, { recursive: true });
        console.log("Diretório de avatars criado em:", avatarUploadPath);
    } catch (error: any) {
        console.error("Erro ao criar diretório de avatars:", error.message);
    }
}

// --- 2. Configuração de Armazenamento (Storage) ---
// Define como os arquivos serão armazenados no disco.
const storage = multer.diskStorage({
    /**
     * Define a pasta de destino para o arquivo.
     * @param req A requisição do Express.
     * @param file O arquivo sendo enviado.
     * @param cb Callback para indicar o destino.
     */
    destination: (req, file, cb) => {
        cb(null, avatarUploadPath);
    },
    /**
     * Define o nome do arquivo a ser salvo.
     * O nome é padronizado para `user_{ID do usuário}.{extensão}`. Isso garante que cada usuário
     * tenha apenas um arquivo de avatar, que será substituído a cada novo upload.
     * @param req A requisição do Express (contém a sessão do usuário).
     * @param file O arquivo original enviado.
     * @param cb Callback para indicar o nome final do arquivo.
     */
    filename: (req: Request, file, cb) => {
        const userId = req.session.user?.id;
        // Valida se o usuário está autenticado antes de nomear o arquivo.
        if (!userId) {
            return cb(new Error('Usuário não autenticado para upload de avatar.'), '');
        }
        const extension = path.extname(file.originalname);
        cb(null, `user_${userId}${extension}`);
    }
});

// --- 3. Filtro de Validação de Arquivo ---
/**
 * Função de filtro para validar se o arquivo enviado é uma imagem permitida.
 * @param req A requisição do Express.
 * @param file O arquivo sendo validado.
 * @param cb Callback para aceitar ou rejeitar o arquivo.
 */
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Lista de tipos de imagem (MIME types) permitidos.
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        // Se o tipo do arquivo é permitido, aceita o arquivo.
        cb(null, true);
    } else {
        // Se não for um tipo permitido, rejeita o arquivo passando um erro.
        // Este erro será capturado pelo error handler global do Express.
        cb(new Error('Apenas imagens (JPEG, PNG, GIF, WEBP) são permitidas!'));
    }
};

// --- 4. Exportação do Middleware Configurado ---
/**
 * Instância do multer configurada para ser usada como middleware nas rotas.
 * Define a estratégia de armazenamento, os limites de tamanho e o filtro de validação.
 */
export const uploadAvatar = multer({
    storage: storage,
    limits: {
        // Define o limite de tamanho do arquivo em 2MB.
        fileSize: 2 * 1024 * 1024 // 2MB 
    },
    fileFilter: fileFilter
});