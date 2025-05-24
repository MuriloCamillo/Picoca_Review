import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Criação do app
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Página inicial
app.get('/', (req, res) => {
  res.render('index');
});

// Outras páginas dinâmicas (ex: /login, /sign_up, etc)
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  res.render(page, {}, (err, html) => {
    if (err) {
      // Se não encontrar a view, retorna 404
      return res.status(404).send('Página não encontrada');
    }
    res.send(html);
  });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});