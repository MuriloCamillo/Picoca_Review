// src/data/seriesTypes.ts
export interface Series {
    title: string;
    year: number;
    creator: string;
    tagline?: string;
    synopsis: string;
    status: string;
    statusClass: string;
    cast: string[];
    genres: string[];
    seasons: string[];
    watchPlatforms: string[];
    posterImg: string;
    backdropImg: string;
    trailerUrl: string;
}

export interface SeriesData {
    [key: string]: Series;
}

export interface NewsArticle {
    title: string;
    author: string;
    date: string;
    mainImageUrl: string;
    mainImageCaption?: string;
    summary: string;
    articleContent: string;
    videoUrl?: string;
    videoCaption?: string;
    secondaryImageUrl?: string;
    secondaryImageCaption?: string;
}

export interface NewsData {
    [key: string]: NewsArticle;
}