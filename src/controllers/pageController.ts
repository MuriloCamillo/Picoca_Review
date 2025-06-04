// src/controllers/pageController.ts
import { Request, Response } from 'express';
import seriesData from '../data/seriesData.js'; //
import newsData from '../data/newsData.js'; //
// UserSessionData é importado implicitamente pelos outros módulos ou via types/express.js
import * as SeriesListModel from '../models/seriesListModel.js'; //

// Defina sua lista de países aqui ou importe de outro lugar
const countriesList = [
    { code: "", name: "Selecione um país..." }, // Opção padrão
    { code: "AF", name: "Afeganistão" },
    { code: "ZA", name: "África do Sul" },
    { code: "AL", name: "Albânia" },
    { code: "DE", name: "Alemanha" },
    { code: "AD", name: "Andorra" },
    { code: "AO", name: "Angola" },
    { code: "AR", name: "Argentina" },
    { code: "AU", name: "Austrália" },
    { code: "AT", name: "Áustria" },
    { code: "BD", name: "Bangladesh" },
    { code: "BE", name: "Bélgica" },
    { code: "BO", name: "Bolívia" },
    { code: "BR", name: "Brasil" },
    { code: "CA", name: "Canadá" },
    { code: "CL", name: "Chile" },
    { code: "CN", name: "China" },
    { code: "CO", name: "Colômbia" },
    { code: "KR", name: "Coreia do Sul" },
    { code: "ES", name: "Espanha" },
    { code: "US", name: "Estados Unidos" },
    { code: "FR", name: "França" },
    { code: "IN", name: "Índia" },
    { code: "IE", name: "Irlanda" },
    { code: "IT", name: "Itália" },
    { code: "JP", name: "Japão" },
    { code: "MX", name: "México" },
    { code: "NZ", name: "Nova Zelândia" },
    { code: "PT", name: "Portugal" },
    { code: "GB", name: "Reino Unido" },
    { code: "RU", name: "Rússia" },
    { code: "SE", name: "Suécia" },
    { code: "CH", name: "Suíça" },
    // Adicione mais países conforme necessário. Usar códigos ISO pode ser útil para o 'value'.
    { code: "OTHER", name: "Outro" }
];

export const getHomePage = (req: Request, res: Response) => {
    const user = req.session.user;
    const newsIds = Object.keys(newsData); //
    const featuredNews = newsIds.slice(0, 3).map(id => ({ id, ...newsData[id] })); //
    const seriesEntries = Object.entries(seriesData); //
    const trendingSeries = seriesEntries.slice(0, 6).map(([id, data]) => ({ id, ...data }));
    const rankedSeries = seriesEntries.slice(6, 12).map(([id, data]) => ({ id, ...data }));

    res.render('index', {
        title: 'Picoca Review',
        user,
        news: featuredNews,
        trendingSeries,
        rankedSeries,
        heroTitle: user ? `Bem-vindo(a) de volta, ${user.firstName || user.username}!` : 'Bem vindo ao Picoca Review!',
        heroSubtitle1: user ? 'É bom tê-lo(a) de volta!' : 'Não se perca nas séries que você já assistiu.',
        heroSubtitle2: user ? 'Acompanhe as novidades das suas séries preferidas!' : 'Salve para lembrar as que você quer ver.',
        // logout_success é passado via res.locals em app.ts
        metaDescription: 'Picoca Review: Descubra e organize as suas séries favoritas, acompanhe as últimas notícias e encontre onde assistir.'
    });
};

export const getContactPage = (req: Request, res: Response) => {
    res.render('contact', { 
        title: 'Contato - Picoca Review', 
        user: req.session.user,
        metaDescription: 'Entre em contato com a equipe do Picoca Review. Envie suas sugestões, dúvidas ou comentários através do nosso formulário de contato.'
    });
};

export const getJournalPage = (req: Request, res: Response) => {
    const allNews = Object.keys(newsData).map(id => ({ id, ...newsData[id] })); //
    res.render('journal', {
        title: 'Notícias - Picoca Review',
        user: req.session.user,
        newsItems: allNews,
        metaDescription: 'Fique por dentro das últimas notícias do mundo do entretenimento no Picoca Review. Novidades sobre suas séries e filmes favoritos, lançamentos e muito mais.'
    });
};

export const getNewsDetailPage = (req: Request, res: Response) => {
    const newsId = req.params.newsId;
    const newsItem = newsData[newsId]; //
    const user = req.session.user;

    if (!newsItem) {
        return res.status(404).render('error', { title: 'Erro 404', message: 'Notícia não encontrada.', user, status: 404 });
    }
    const allNewsIds = Object.keys(newsData); //
    const otherNewsIds = allNewsIds.filter(id => id !== newsId);
    const shuffled = [...otherNewsIds].sort(() => 0.5 - Math.random());
    const relatedNews = shuffled.slice(0, 2).map(id => ({ id, ...newsData[id] })); //

    res.render('news_default', {
        title: `${newsItem.title} - Picoca Review`,
        user,
        news: newsItem,
        newsId: newsId, // Passado para partials/header via res.locals em app.ts
        relatedNews: relatedNews,
        metaDescription: newsItem.summary ? newsItem.summary.substring(0, 160) : newsItem.title
    });
};

export const getSeriesGalleryPage = (req: Request, res: Response) => {
    const allSeries = Object.entries(seriesData).map(([id, data])=> ({ id, ...data })); //
    // searchQuery é passado via res.locals em app.ts
    res.render('series_gallery', {
        title: 'Séries - Picoca Review',
        user: req.session.user,
        seriesItems: allSeries,
        // searchQuery: searchQuery, // Passado via res.locals
        metaDescription: 'Encontre todas as suas séries favoritas no Picoca Review. Explore por gênero, busque por título e descubra novas séries para assistir.'
    });
};

export const getSeriesInfoPage = async (req: Request, res: Response) => {
    const seriesId = req.params.seriesId;
    const seriesItem = seriesData[seriesId]; //
    const user = req.session.user;

    if (!seriesItem) {
        return res.status(404).render('error', { title: 'Erro 404', message: 'Série não encontrada.', user, status: 404 });
    }

    let userSeriesStatus = { onWatchlist: false, onLikelist: false };
    if (user && user.id) { // Adicionado user.id para segurança
        try {
            userSeriesStatus.onWatchlist = await SeriesListModel.isSeriesInUserList(user.id, seriesId, 'watchlist'); //
            userSeriesStatus.onLikelist = await SeriesListModel.isSeriesInUserList(user.id, seriesId, 'likelist'); //
        } catch (error) {
            console.error("Erro ao buscar status da série para o usuário:", error);
        }
    }

    res.render('series_info_default', {
        title: `${seriesItem.title} - Picoca Review`,
        user,
        serie: seriesItem,
        seriesId: seriesId, // Passado para partials/header via res.locals em app.ts
        userSeriesStatus,
        // originalUrl é passado via res.locals em app.ts
        metaDescription: seriesItem.synopsis ? seriesItem.synopsis.substring(0, 160) + '...' : seriesItem.title
    });
};

export const getProfilePage = (req: Request, res: Response) => {
    const user = req.session.user;
    if (!user) { 
        return res.redirect('/login?error=Acesso negado.');
    }
    res.render('profile', {
        title: 'Meu Perfil - Picoca Review',
        user,
        countriesList: countriesList, // <<<--- PASSA A LISTA DE PAÍSES PARA O TEMPLATE
        // login_success e signup_success são passados via res.locals em app.ts
        metaDescription: `Perfil de ${user.username} no Picoca Review. Gerencie suas informações e listas.`
    });
};