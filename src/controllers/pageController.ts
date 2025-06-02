// src/controllers/pageController.ts
import { Request, Response } from 'express';
import seriesData from '../data/seriesData.js';
import newsData from '../data/newsData.js';
import { UserSessionData } from '../types/express.js';
import * as SeriesListModel from '../models/seriesListModel.js';

export const getHomePage = (req: Request, res: Response) => {
    const user = req.session.user;
    const newsIds = Object.keys(newsData);
    const featuredNews = newsIds.slice(0, 3).map(id => ({ id, ...newsData[id] }));
    const seriesEntries = Object.entries(seriesData);
    const trendingSeries = seriesEntries.slice(0, 6).map(([id, data]) => ({ id, ...data }));
    const rankedSeries = seriesEntries.slice(6, 12).map(([id, data]) => ({ id, ...data }));

    res.render('index', {
        title: 'Picoca Review', // Título da página inicial
        user,
        news: featuredNews,
        trendingSeries,
        rankedSeries,
        heroTitle: user ? `Bem-vindo(a) de volta, ${user.firstName || user.username}!` : 'Bem vindo ao Picoca Review!',
        heroSubtitle1: user ? 'É bom tê-lo(a) de volta!' : 'Não se perca nas séries que você já assistiu.',
        heroSubtitle2: user ? 'Acompanhe as novidades das suas séries preferidas!' : 'Salve para lembrar as que você quer ver.',
        logout_success: req.query.logout_success,
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
    const allNews = Object.keys(newsData).map(id => ({ id, ...newsData[id] }));
    res.render('journal', {
        title: 'Notícias - Picoca Review',
        user: req.session.user,
        newsItems: allNews,
        metaDescription: 'Fique por dentro das últimas notícias do mundo do entretenimento no Picoca Review. Novidades sobre suas séries e filmes favoritos, lançamentos e muito mais.'
    });
};

export const getNewsDetailPage = (req: Request, res: Response) => {
    const newsId = req.params.newsId;
    const newsItem = newsData[newsId];
    const user = req.session.user;

    if (!newsItem) {
        return res.status(404).render('error', { title: 'Erro 404', message: 'Notícia não encontrada.', user, status: 404 });
    }
    const allNewsIds = Object.keys(newsData);
    const otherNewsIds = allNewsIds.filter(id => id !== newsId);
    const shuffled = [...otherNewsIds].sort(() => 0.5 - Math.random());
    const relatedNews = shuffled.slice(0, 2).map(id => ({ id, ...newsData[id] }));

    res.render('news_default', {
        title: `${newsItem.title} - Picoca Review`,
        user,
        news: newsItem,
        newsId: newsId,
        relatedNews: relatedNews,
        metaDescription: newsItem.summary ? newsItem.summary.substring(0, 160) : newsItem.title
    });
};

export const getSeriesGalleryPage = (req: Request, res: Response) => {
    const allSeries = Object.entries(seriesData).map(([id, data])=> ({ id, ...data }));
    const searchQuery = req.query.search as string || '';
    res.render('series_gallery', {
        title: 'Séries - Picoca Review',
        user: req.session.user,
        seriesItems: allSeries,
        searchQuery: searchQuery, // Passa o termo de busca para o EJS
        metaDescription: 'Encontre todas as suas séries favoritas no Picoca Review. Explore por gênero, busque por título e descubra novas séries para assistir.'
    });
};

export const getSeriesInfoPage = async (req: Request, res: Response) => {
    const seriesId = req.params.seriesId;
    const seriesItem = seriesData[seriesId];
    const user = req.session.user;

    if (!seriesItem) {
        return res.status(404).render('error', { title: 'Erro 404', message: 'Série não encontrada.', user, status: 404 });
    }

    let userSeriesStatus = { onWatchlist: false, onLikelist: false };
    if (user) {
        try {
            userSeriesStatus.onWatchlist = await SeriesListModel.isSeriesInUserList(user.id, seriesId, 'watchlist');
            userSeriesStatus.onLikelist = await SeriesListModel.isSeriesInUserList(user.id, seriesId, 'likelist');
        } catch (error) {
            console.error("Erro ao buscar status da série para o usuário:", error);
        }
    }

    res.render('series_info_default', {
        title: `${seriesItem.title} - Picoca Review`,
        user,
        serie: seriesItem,
        seriesId: seriesId,
        userSeriesStatus,
        originalUrl: req.originalUrl, // Para o botão de login redirect
        metaDescription: seriesItem.synopsis ? seriesItem.synopsis.substring(0, 160) + '...' : seriesItem.title
    });
};

export const getProfilePage = (req: Request, res: Response) => {
    const user = req.session.user;
    if (!user) { // Redundante se isAuthenticated for usado na rota, mas bom para clareza
        return res.redirect('/login?error=Acesso negado.');
    }
    res.render('profile', {
        title: 'Meu Perfil - Picoca Review',
        user,
        login_success: req.query.login_success,
        signup_success: req.query.signup_success,
        metaDescription: `Perfil de ${user.username} no Picoca Review. Gerencie suas informações e listas.`
    });
};