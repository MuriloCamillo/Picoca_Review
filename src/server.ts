/**
 * @fileoverview Ponto de entrada principal da aplicação.
 *
 * Este script é responsável por:
 * 1. Importar a instância da aplicação Express configurada em 'app.ts'.
 * 2. Criar um servidor HTTP a partir da aplicação Express.
 * 3. Iniciar o servidor para escutar requisições na porta definida.
 * 4. Exibir mensagens informativas no console na inicialização.
 */
// Importa a instância configurada do Express a partir de 'app.ts'.
// A extensão '.js' é necessária aqui devido à configuração "module": "NodeNext" no tsconfig.json.
import app from './app.js';
import http from 'http';

// Define a porta do servidor, usando a variável de ambiente PORT se disponível, ou 3000 como padrão.
const PORT = process.env.PORT || 3000;
// Cria o servidor HTTP, passando a aplicação Express para lidar com as requisições.
const server = http.createServer(app);

// Inicia o servidor e o faz escutar na porta definida.
server.listen(PORT, () => {
    // Exibe mensagens no console para confirmar que o servidor está rodando e fornecer informações úteis.
    console.log(`Servidor Picoca Review rodando em TypeScript em http://localhost:${PORT}`);
    console.log(`----------------------------------------------------------------------`);
    console.log(`Para desenvolvimento, use: npm run dev`);
    console.log(`Para build de produção: npm run build -> npm start`);
    console.log(`----------------------------------------------------------------------`);
});