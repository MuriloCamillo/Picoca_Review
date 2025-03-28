// assets/js/index_loader.js

/**
 * Cria o HTML para um card de notícia (versão para index.html com col-md-4).
 * @param {object} newsItem O objeto da notícia de newsData.
 * @param {string} newsId O ID da notícia.
 * @returns {string} A string HTML do card.
 */
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

/**
* Carrega as 3 primeiras notícias (baseado na ordem das chaves em newsData)
* no container especificado.
*/
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

  container.innerHTML = ''; // Limpa o container

  // 1. Pega todas as chaves (IDs) do objeto newsData.
  // Em engines modernas, isso geralmente reflete a ordem de definição no código.
  const newsIds = Object.keys(newsData);

  // 2. Pega os 3 primeiros IDs da lista.
  const selectedIds = newsIds.slice(0, 3);

  // 3. Gera e insere o HTML dos cards
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

// --- INICIALIZAÇÃO ---
// Chama a função para carregar as notícias quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', loadIndexNews);