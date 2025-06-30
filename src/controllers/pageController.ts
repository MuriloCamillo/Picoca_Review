/**
 * @fileoverview Controlador responsável por renderizar as principais páginas da aplicação.
 *
 * Este arquivo contém a lógica para buscar dados (de fontes estáticas e do banco de dados)
 * e renderizar as views EJS correspondentes para cada rota de página, como a página inicial,
 * galeria de séries, detalhes de uma série, perfil do usuário, etc.
 */
import { Request, Response } from 'express';
import seriesData from '../data/seriesData.js';
import newsData from '../data/newsData.js';
import * as SeriesListModel from '../models/seriesListModel.js';
import * as SeriesRatingModel from '../models/seriesRatingModel.js';

// Lista de países para o formulário de perfil
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
    { code: "OTHER", name: "Outro" }
];

/**
 * Renderiza a página inicial (Home).
 * Prepara os dados para as seções de notícias em destaque, séries em alta e séries ranqueadas.
 */
export const getHomePage = (req: Request, res: Response) => {
    const user = req.session.user;
    const newsIds = Object.keys(newsData);
    const featuredNews = newsIds.slice(0, 3).map(id => ({ id, ...newsData[id] }));
    const seriesEntries = Object.entries(seriesData);
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
        metaDescription: 'Picoca Review: Descubra e organize as suas séries favoritas, acompanhe as últimas notícias e encontre onde assistir.'
    });
};

/**
 * Renderiza a página de Contato.
 */
export const getContactPage = (req: Request, res: Response) => {
    res.render('contact', { 
        title: 'Contato - Picoca Review', 
        user: req.session.user,
        metaDescription: 'Entre em contato com a equipe do Picoca Review. Envie suas sugestões, dúvidas ou comentários através do nosso formulário de contato.'
    });
};

/**
 * Renderiza a página de Notícias (Journal), exibindo todos os artigos.
 */
export const getJournalPage = (req: Request, res: Response) => {
    const allNews = Object.keys(newsData).map(id => ({ id, ...newsData[id] }));
    res.render('journal', {
        title: 'Notícias - Picoca Review',
        user: req.session.user,
        newsItems: allNews,
        metaDescription: 'Fique por dentro das últimas notícias do mundo do entretenimento no Picoca Review. Novidades sobre suas séries e filmes favoritos, lançamentos e muito mais.'
    });
};

/**
 * Renderiza a página de detalhes de uma notícia específica.
 * Também seleciona aleatoriamente outras notícias para a seção "Veja Também".
 */
export const getNewsDetailPage = (req: Request, res: Response) => {
    const newsId = req.params.newsId;
    const newsItem = newsData[newsId];
    const user = req.session.user;

    // Se a notícia não for encontrada nos dados, renderiza uma página de erro 404.
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

/**
 * Renderiza a galeria com todas as séries disponíveis.
 */
export const getSeriesGalleryPage = (req: Request, res: Response) => {
    const allSeries = Object.entries(seriesData).map(([id, data])=> ({ id, ...data }));
    res.render('series_gallery', {
        title: 'Séries - Picoca Review',
        user: req.session.user,
        seriesItems: allSeries,
        metaDescription: 'Encontre todas as suas séries favoritas no Picoca Review. Explore por gênero, busque por título e descubra novas séries para assistir.'
    });
};

/**
 * Renderiza a página de detalhes de uma série específica.
 * Esta é uma função assíncrona, pois busca dados tanto estáticos quanto do banco de dados.
 */
export const getSeriesInfoPage = async (req: Request, res: Response) => {
    const seriesId = req.params.seriesId;
    const seriesItem = seriesData[seriesId];
    const user = req.session.user;

    if (!seriesItem) {
        return res.status(404).render('error', { title: 'Erro 404', message: 'Série não encontrada.', user, status: 404 });
    }

    try {
        let userSeriesStatus = { onWatchlist: false, onLikelist: false };
        let userRating: number | null = null;

        // Se o usuário estiver logado, busca suas informações personalizadas para esta série.
        if (user && user.id) {
            userSeriesStatus.onWatchlist = await SeriesListModel.isSeriesInUserList(user.id, seriesId, 'watchlist');
            userSeriesStatus.onLikelist = await SeriesListModel.isSeriesInUserList(user.id, seriesId, 'likelist');
            userRating = await SeriesRatingModel.getUserRatingForSeries(user.id, seriesId);
        }

        // Busca todas as avaliações da comunidade para calcular a média e a contagem de votos.
        const allRatings = await SeriesRatingModel.getRatingsForSeries(seriesId);
        const voteCount = allRatings.length;
        const averageRating = voteCount > 0
            ? allRatings.reduce((sum, r) => sum + r.rating, 0) / voteCount
            : 0;

        res.render('series_info_default', {
            title: `${seriesItem.title} - Picoca Review`,
            user,
            serie: seriesItem,
            seriesId: seriesId,
            userSeriesStatus,
            originalUrl: req.originalUrl,
            userRating,
            averageRating,
            voteCount,
            metaDescription: seriesItem.synopsis ? seriesItem.synopsis.substring(0, 160) + '...' : seriesItem.title
        });
    } catch (error) {
        console.error("Erro ao buscar dados da página da série:", error);
        res.status(500).render('error', { title: 'Erro 500', message: 'Não foi possível carregar os detalhes da série.', user, status: 500 });
    }
};

/**
 * Renderiza a página de perfil do usuário.
 * Requer que o usuário esteja autenticado (protegido pelo middleware `isAuthenticated` na rota).
 */
export const getProfilePage = (req: Request, res: Response) => {
    const user = req.session.user;
    if (!user) { 
        return res.redirect('/login?error=Acesso negado.');
    }
    res.render('profile', {
        title: 'Meu Perfil - Picoca Review',
        user,
        countriesList: countriesList,
        metaDescription: `Perfil de ${user.username} no Picoca Review. Gerencie suas informações e listas.`
    });
};

/**
 * Renderiza a página "Minha Watchlist".
 * Busca os IDs das séries na watchlist do usuário no banco e depois "hidrata" esses dados com as informações completas da série.
 */
export const getWatchlistPage = async (req: Request, res: Response) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/login');
    }

    try {
        const userListItems = await SeriesListModel.getListsForUser(user.id);
        
        const watchlistSeries = userListItems
            .filter(item => item.list_type === 'watchlist')
            .map(item => seriesData[item.series_id] ? { id: item.series_id, ...seriesData[item.series_id] } : null)
            .filter(item => item !== null);

        res.render('watchlist', {
            title: 'Minha Watchlist',
            user,
            seriesItems: watchlistSeries, 
            metaDescription: 'Séries que você salvou para assistir mais tarde.'
        });
    } catch (error) {
        console.error("Erro ao buscar a watchlist do usuário:", error);
        res.status(500).render('error', { title: 'Erro no Servidor', message: 'Não foi possível carregar sua watchlist.', user, status: 500 });
    }
};

/**
 * Renderiza a página "Séries Curtidas".
 * Segue a mesma lógica da watchlist, mas filtrando por 'likelist'.
 */
export const getLikelistPage = async (req: Request, res: Response) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/login');
    }

    try {
        const userListItems = await SeriesListModel.getListsForUser(user.id);
        
        const likelistSeries = userListItems
            .filter(item => item.list_type === 'likelist')
            .map(item => seriesData[item.series_id] ? { id: item.series_id, ...seriesData[item.series_id] } : null)
            .filter(item => item !== null);

        res.render('likelist', {
            title: 'Séries Curtidas',
            user,
            seriesItems: likelistSeries,
            metaDescription: 'Séries que você marcou como "gostei".'
        });
    } catch (error) {
        console.error("Erro ao buscar a likelist do usuário:", error);
        res.status(500).render('error', { title: 'Erro no Servidor', message: 'Não foi possível carregar suas séries curtidas.', user, status: 500 });
    }
};