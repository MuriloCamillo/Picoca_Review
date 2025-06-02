// src/server.ts
import app from './app.js'; // Note o .js aqui também
import http from 'http';

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Servidor Picoca Review rodando em TypeScript em http://localhost:${PORT}`);
    console.log(`----------------------------------------------------------------------`);
    console.log(`Para desenvolvimento, use: npm run dev`);
    console.log(`Para build de produção: npm run build -> npm start`);
    console.log(`----------------------------------------------------------------------`);
});