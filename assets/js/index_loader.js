function createIndexNewsCardHTML(newsItem, newsId) {
    const summary = newsItem.summary || 'Leia mais...';
    const shortSummary = summary.length > 90 ? summary.substring(0, 87) + '...' : summary;

    return `
      <div class="col-md-4 mb-4">
          <div class="card bg-dark text-light h-100">
              <a href="news_default.html?id=${newsId}">
                  <img src="${newsItem.mainImageUrl || 'assets/img/placeholder_news.webp'}" class="card-img-top" alt="${newsItem.title || 'Notícia'}">
              </a>
              <div class="card-body d-flex flex-column">
                  <a href="news_default.html?id=${newsId}" class="text-decoration-none text-light">
                      <h5 class="card-title fw-bold">${newsItem.title || 'Título Indisponível'}</h5>
                  </a>
                  <p class="card-text">${shortSummary}</p>
                  <a href="news_default.html?id=${newsId}" class="btn btn-outline-light mt-auto">Ver Mais</a>
              </div>
          </div>
      </div>
  `;
}

function loadIndexNews() {
    const container = document.getElementById('index-news-row');
    if (!container) {
        console.error("Container 'index-news-row' não encontrado!");
        return;
    }

    if (typeof newsData === 'undefined' || Object.keys(newsData).length === 0) {
        console.warn("Dados de notícias (newsData) não encontrados ou vazios.");
        container.innerHTML = '<p class="text-light text-center col-12">Nenhuma notícia disponível.</p>';
        return;
    }

    container.innerHTML = ''; 

    const newsIds = Object.keys(newsData);
    const selectedIds = newsIds.slice(0, 3); // Pega as 3 primeiras notícias

    if (selectedIds.length === 0) {
        container.innerHTML = '<p class="text-light text-center col-12">Nenhuma notícia disponível.</p>';
        return;
    }

    let cardsHTML = '';
    selectedIds.forEach(id => {
        const newsItem = newsData[id];
        if (newsItem) {
            cardsHTML += createIndexNewsCardHTML(newsItem, id);
        } else {
            console.warn(`Dados não encontrados para o ID de notícia: ${id}`);
        }
    });

    container.innerHTML = cardsHTML;
}

// --- NOVAS FUNÇÕES PARA CARREGAR PÔSTERES DAS SÉRIES ---

/**
 * Cria o HTML para um único pôster de série para o index.html.
 * @param {string} seriesId A chave/ID da série.
 * @param {object} series O objeto de dados da série.
 * @returns {string} A string HTML do pôster.
 */
function createIndexSeriesPosterHTML(seriesId, series) {
    const posterSrc = series.posterImg || 'assets/img/placeholder_poster.webp';
    const title = series.title || 'Série';
    const link = `series_info_default.html?id=${seriesId}`;

    return `
        <a href="${link}" class="poster">
            <img src="${posterSrc}" alt="${title}">
        </a>
    `;
}

/**
 * Carrega os pôsteres das séries nas seções 'Trends' e 'Ranked' do index.html.
 * Pega as primeiras 12 séries de series_data.js (6 para cada seção).
 */
function loadIndexSeriesGalleries() {
    const trendsContainer = document.getElementById('trends-gallery');
    const rankedContainer = document.getElementById('ranked-gallery');

    if (!trendsContainer || !rankedContainer) {
        console.warn("Containers de galeria ('trends-gallery' ou 'ranked-gallery') não encontrados no index.html.");
        return;
    }

    // Verifica se seriesData existe e tem dados
    if (typeof seriesData === 'undefined' || Object.keys(seriesData).length === 0) {
        console.warn("Dados de séries (seriesData) não encontrados ou vazios para o index.");
        trendsContainer.innerHTML = '<p class="text-light">Erro ao carregar séries.</p>';
        rankedContainer.innerHTML = '<p class="text-light">Erro ao carregar séries.</p>';
        return;
    }

    // Pega as entradas (id + dados) das séries
    const allSeriesEntries = Object.entries(seriesData);

    // Pega as primeiras 12 (ou menos, se não houver 12)
    const seriesToShow = allSeriesEntries.slice(0, 12);

    // Divide entre as duas galerias (até 6 em cada)
    const trendsSeries = seriesToShow.slice(0, 6);
    const rankedSeries = seriesToShow.slice(6, 12); // Pega do índice 6 até o 11

    // Limpa os containers
    trendsContainer.innerHTML = '';
    rankedContainer.innerHTML = '';

    // Gera HTML para Tendências
    let trendsHTML = '';
    if (trendsSeries.length > 0) {
        trendsSeries.forEach(([id, series]) => {
            trendsHTML += createIndexSeriesPosterHTML(id, series);
        });
    } else {
        trendsHTML = '<p class="text-light">Nenhuma série em tendência no momento.</p>';
    }
    trendsContainer.innerHTML = trendsHTML;

    // Gera HTML para Ranked
    let rankedHTML = '';
    if (rankedSeries.length > 0) {
        rankedSeries.forEach(([id, series]) => {
            rankedHTML += createIndexSeriesPosterHTML(id, series);
        });
    } else {
    }
    rankedContainer.innerHTML = rankedHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    loadIndexNews(); 
    loadIndexSeriesGalleries(); 
});