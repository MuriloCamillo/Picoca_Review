/**
 * @fileoverview Define as interfaces e tipos de dados centrais para a aplicação.
 *
 * Este arquivo serve como uma "fonte da verdade" para a estrutura dos dados
 * de séries e notícias. Ao centralizar essas definições, garantimos que diferentes
 * partes do código (controllers, views, scripts do frontend) manipulem os dados
 * de forma consistente e segura.
 */

/**
 * Descreve a estrutura de um objeto de Série de TV.
 */
export interface Series {
    title: string;                  // Título oficial da série.
    year: number;                   // Ano de lançamento.
    creator: string;                // Nome do criador ou showrunner.
    tagline?: string;               // Slogan ou frase de efeito (opcional).
    synopsis: string;               // Sinopse da trama.
    status: string;                 // Status atual em formato de texto (ex: "Finalizada").
    statusClass: string;            // Classe CSS para estilizar o status (ex: "status-ended").
    cast: string[];                 // Array com os nomes dos atores principais.
    genres: string[];               // Array com os gêneros da série.
    seasons: string[];              // Array com a lista de temporadas.
    watchPlatforms: string[];       // Array com as plataformas de streaming disponíveis.
    posterImg: string;              // Caminho para a imagem do pôster.
    backdropImg: string;            // Caminho para a imagem de fundo (backdrop).
    trailerUrl: string;             // URL 'embed' para o trailer.
}

/**
 * Define o tipo para o objeto que armazena todos os dados das séries.
 * É um objeto que funciona como um dicionário, onde a chave (string) é o ID da série
 * e o valor é um objeto do tipo `Series`.
 * Ex: { 'demolidor-renascido': { ...dados da série... } }
 */
export interface SeriesData {
    [key: string]: Series;
}

/**
 * Descreve a estrutura de um objeto de Artigo de Notícia.
 */
export interface NewsArticle {
    title: string;                  // Título da notícia.
    author: string;                 // Nome do autor do artigo.
    date: string;                   // Data de publicação (formato textual).
    mainImageUrl: string;           // Caminho para a imagem principal da notícia.
    mainImageCaption?: string;      // Legenda para a imagem principal (opcional).
    summary: string;                // Resumo curto da notícia, usado em previews.
    articleContent: string;         // Conteúdo completo do artigo em formato HTML.
    videoUrl?: string;              // URL 'embed' de um vídeo relacionado (opcional).
    videoCaption?: string;          // Legenda para o vídeo (opcional).
    secondaryImageUrl?: string;     // Caminho para uma imagem secundária no corpo do artigo (opcional).
    secondaryImageCaption?: string; // Legenda para a imagem secundária (opcional).
}

/**
 * Define o tipo para o objeto que armazena todos os dados das notícias.
 * Funciona como um dicionário, onde a chave (string) é o ID da notícia
 * e o valor é um objeto do tipo `NewsArticle`.
 */
export interface NewsData {
    [key: string]: NewsArticle;
}