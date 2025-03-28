/**
 * Cria o HTML para um card de notícia (versão para journal.html com col-md-4).
 * @param {object} newsItem O objeto da notícia de newsData.
 * @param {string} newsId O ID da notícia.
 * @returns {string} A string HTML do card.
 */
function createJournalNewsCardHTML(newsItem, newsId) {
  // Usa o resumo definido em news_data.js ou um fallback
  const summary = newsItem.summary || 'Leia mais...';
  // Remove o limite de caracteres (ou ajuste se preferir manter um limite aqui)
  // const shortSummary = summary.length > 100 ? summary.substring(0, 97) + '...' : summary;
  const shortSummary = summary; // Usando o resumo completo

  // Usa col-md-4 como no layout original de journal.html
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
* Carrega todos os cards de notícia no container especificado.
*/
function loadJournalCards() {
  const container = document.getElementById('journal-cards-row');
  if (!container) {
      console.error("Container 'journal-cards-row' não encontrado!");
      return;
  }

  // Verifica se newsData foi carregado
  if (typeof newsData === 'undefined' || Object.keys(newsData).length === 0) {
      console.warn("Dados de notícias (newsData) não encontrados ou vazios.");
      container.innerHTML = '<p class="text-light text-center col-12">Nenhuma notícia cadastrada.</p>';
      return;
  }

  container.innerHTML = ''; // Limpa o container caso haja algo
  const newsIds = Object.keys(newsData);

  let cardsHTML = '';
  newsIds.forEach(id => {
      const newsItem = newsData[id];
      if (newsItem) {
          cardsHTML += createJournalNewsCardHTML(newsItem, id); // Usa a função adaptada
      }
  });

  container.innerHTML = cardsHTML; // Insere todos os cards gerados
}

// --- INICIALIZAÇÃO ---
// Chama a função para carregar os cards quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', loadJournalCards);