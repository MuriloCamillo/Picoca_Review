# 🍿 **Picoca Review**

Uma plataforma web para **descobrir, acompanhar e avaliar séries de TV**.  
Fique por dentro de notícias, informações detalhadas e reviews.

---

## 🌟 **Funcionalidades**

### 🎬 Catálogo de Séries  
Explore uma coleção selecionada com carinho — pesquise e navegue por séries.

### 🔍 Busca Inteligente 
Pesquise séries diretamente na barra de navegação com sugestões em tempo real.

### 📄 Páginas Detalhadas  
Cada série com informações completas:
- 👥 Elenco  
- 📅 Temporadas  
- 🎭 Gêneros  
- 📺 Plataformas de streaming  
- 🚦 Status
- 🎞️ Trailers

### 📰 Seção de Notícias  
As últimas novidades do mundo do entretenimento!

### 🙋‍♂️ Recursos do Usuário (Requer Autenticação)
- 🔐 Autenticação Completa: Sistema seguro de cadastro, login e logout com gerenciamento de sessão persistente.
- 👤 Perfil de Usuário: Página de perfil onde os usuários podem atualizar suas informações pessoais, biografia e alterar a senha.
- 🖼️ Upload de Avatar: Funcionalidade para upload e atualização da imagem de perfil. 
- ⭐ Sistema de Avaliações: Usuários podem avaliar suas séries favoritas com notas de 1 a 5 estrelas.   
- 📌 Listas Pessoais:
  - * **Watchlist:** Salve séries que você pretende assistir no futuro.
    * **Likelist:** Marque as séries que você já assistiu e gostou.

### ✉️ Formulário de Contato  
Recebemos feedbacks, sugestões ou um simples "Oi!" com muito carinho 💌

---

## 🛠️ **Tecnologias Utilizadas**
A aplicação foi construída com tecnologias modernas, seguindo o padrão MVC (Model-View-Controller).

### Backend 🧱
* **Motor:** Node.js
* **Framework:** Express.js
* **Linguagem:** TypeScript
* **Banco de Dados:** SQLite3
* **Template Engine:** EJS (Embedded JavaScript)
* **Autenticação:** Gerenciamento de sessão com `express-session` e senhas com hash usando `bcrypt`.

### Frontend 🎨
* **Estrutura:** HTML5 e EJS
* **Estilização:** CSS3 e Bootstrap 5.3
* **Interatividade:** JavaScript (Vanilla)
* **Ícones:** Font Awesome
---

## 🧩 **Estrutura do Projeto**

```text
/Picoca_Review
├── data/
│   └── picocareview.sqlite   # Banco de dados
├── public/
│   ├── assets/               # Arquivos estáticos (CSS, JS, imagens)
│   └── ...
├── src/
│   ├── config/               # Configuração do banco de dados
│   ├── controllers/          # Lógica de controle (liga Model e View)
│   ├── data/                 # Dados estáticos (séries, notícias)
│   ├── middlewares/          # Middlewares customizados (auth, upload)
│   ├── models/               # Interação com o banco de dados
│   ├── routes/               # Definição das rotas da API
│   ├── services/             # Lógica de negócios (ex: hash de senha)
│   ├── types/                # Definições de tipos TypeScript
│   ├── app.ts                # Configuração principal do Express
│   └── server.ts             # Ponto de entrada para iniciar o servidor
├── views/
│   ├── partials/             # Componentes reutilizáveis (header, footer)
│   └── *.ejs                 # Arquivos de template das páginas
├── package.json
├── tsconfig.json
└── README.md
```

### 🚀 Como Executar o Projeto

Para executar o projeto localmente, siga os passos abaixo. Você precisa ter o [Node.js](https://nodejs.org/) (versão 14 ou superior) e o npm instalados.

**1. Clone o repositório:**
```bash
git clone https://github.com/MuriloCamillo/Picoca_Review.git
```

**2. Instale as Dependências:**
```bash
npm install
```

**3. Execute em Modo de Desenvolvimento:**
O servidor irá iniciar com nodemon, reiniciando automaticamente a cada alteração nos arquivos .ts ou .ejs.
```bash
npm run dev
```

**4. Acessando a Aplicação:**
Abra seu navegador e acesse http://localhost:3000.

**⚠️ Importante:**
Não se preocupe em rodar o ```npm run db:init```, pois a aplicação já irá criar o arquivo de Banco de Dados para você, caso ainda não tenha.

---

## 👨‍💻 **Autores**

- [Letícia Leme](https://github.com/leticiaaleme)
- [Murilo Camillo](https://github.com/MuriloCamillo)

---

## ⚖️ **Licença**

© 2025 **Picoca Review** - Todos os direitos reservados.
