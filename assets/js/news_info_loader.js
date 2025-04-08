/**
 * @fileoverview Carrega e exibe as informações detalhadas de uma notícia específica,
 * incluindo o artigo principal e uma seção de notícias relacionadas.
 */

/**
 * Embaralha os elementos de um array no próprio array (in-place) usando o algoritmo Fisher-Yates.
 * @param {Array} array - O array a ser embaralhado.
 * @returns {void} - Modifica o array original.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}
/**
 * Cria o HTML para um card de notícia relacionado.
 * @param {object} newsItem O objeto da notícia de newsData.
 * @param {string} newsId O ID da notícia.
 * @returns {string} A string HTML do card.
 */
function createNewsCardHTML(newsItem, newsId) {
    const summary = newsItem.summary || 'Leia mais...';
    return `
        <div class="col-md-6 mb-4">
            <div class="card bg-dark text-light h-100">
                <a href="news_default.html?id=${newsId}">
                    <img src="${newsItem.mainImageUrl || 'assets/img/placeholder_news.webp'}" class="card-img-top" alt="${newsItem.title || 'Notícia'}">
                </a>
                <div class="card-body d-flex flex-column">
                    <a href="news_default.html?id=${newsId}" class="text-decoration-none text-light">
                        <h5 class="card-title fw-bold">${newsItem.title || 'Título Indisponível'}</h5>
                    </a>
                    <p class="card-text">${summary}</p> 
                    <a href="news_default.html?id=${newsId}" class="btn btn-outline-light mt-auto">Ver Mais</a>
                </div>
            </div>
        </div>
    `;
}
/**
* Exibe até 2 notícias relacionadas (aleatórias) na seção "Veja também",
* excluindo a notícia que está sendo visualizada no momento.
* @param {string} currentNewsId - O ID da notícia atual (para não ser incluída nas relacionadas).
* @returns {void}
*/
function displayRelatedNews(currentNewsId) {
  const relatedNewsContainer = document.getElementById('related-news-row');
  if (!relatedNewsContainer) {
      console.warn("Container 'related-news-row' não encontrado.");
      return;
  }

  const allNewsIds = Object.keys(newsData);
  const otherNewsIds = allNewsIds.filter(id => id !== currentNewsId);

  relatedNewsContainer.innerHTML = ''; 

  if (otherNewsIds.length < 1) { 
      relatedNewsContainer.innerHTML = '<p class="text-light text-center col-12">Não há outras notícias disponíveis.</p>';
      return;
  }

  shuffleArray(otherNewsIds);

  const countToShow = Math.min(otherNewsIds.length, 2);
  const selectedIds = otherNewsIds.slice(0, countToShow);

  let relatedNewsHTML = '';
  selectedIds.forEach(id => {
      const newsItem = newsData[id];
      if (newsItem) {
          relatedNewsHTML += createNewsCardHTML(newsItem, id);
      }
  });

  relatedNewsContainer.innerHTML = relatedNewsHTML;
}

/**
 * Função principal que lê o ID da notícia da URL, busca os dados
 * correspondentes em `newsData` e preenche a página com essas informações.
 * Também chama a função para exibir notícias relacionadas.
 * @returns {void}
 */
function displayNewsInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');
  
    if (!newsId) {
      console.error("Nenhum ID de notícia encontrado na URL.");
      document.querySelector('main').innerHTML = '<h1 class="text-center text-danger mt-5">Erro: ID da notícia não especificado.</h1>';
      return;
    }
  
    const news = newsData[newsId];
  
    if (!news) {
      console.error("Notícia não encontrada com ID:", newsId);
      document.querySelector('main').innerHTML = `<h1 class="text-center text-danger mt-5">Notícia com ID "${newsId}" não encontrada!</h1>`;
      return;
    }
  
    // Preencher meta description
    const description = news.summary || (news.articleContent ? news.articleContent.substring(0, 160) + "..." : "");  // Adicionado verificação para news.articleContent
    document.querySelector('meta[name="description"]').setAttribute('content', description);
  
    // Preencher informações principais da notícia
    document.title = `${news.title || 'Notícia'} - Picoca Review`;
  
    const titleElement = document.getElementById('news-title');
    if (titleElement) titleElement.textContent = news.title || 'Título Indisponível';
  
    const authorDateElement = document.getElementById('news-author-date');
    if (authorDateElement) authorDateElement.textContent = `Por ${news.author || 'Autor Desconhecido'} - ${news.date || 'Data Indisponível'}`;
  
    const mainImageElement = document.getElementById('news-main-image');
    const mainCaptionElement = document.getElementById('news-main-caption');
    if (mainImageElement && news.mainImageUrl) {
      mainImageElement.src = news.mainImageUrl;
      mainImageElement.alt = news.title || 'Imagem da notícia';
    } else if (mainImageElement) {
      mainImageElement.style.display = 'none'; // Esconde se não houver imagem
    }
    if (mainCaptionElement) mainCaptionElement.textContent = news.mainImageCaption || '';
  
    const articleContentElement = document.getElementById('news-article-content');
    if (articleContentElement && news.articleContent) {
      articleContentElement.innerHTML = news.articleContent;
    }
  
    // Preencher conteúdo secundário (vídeo ou imagem)
    const secondaryContentElement = document.getElementById('news-secondary-content');
    if (secondaryContentElement) {
      secondaryContentElement.innerHTML = '';
      if (news.videoUrl) {
        secondaryContentElement.innerHTML = `
            <div class="text-center my-4">
                <div class="ratio ratio-16x9 mx-auto" style="max-width: 640px;">
                    <iframe src="${news.videoUrl}" title="Vídeo da Notícia" allowfullscreen class="rounded"></iframe>
                </div>
            </div>
            ${news.videoCaption ? `<p class="img-leg">${news.videoCaption}</p>` : ''}
        `;
      } else if (news.secondaryImageUrl) {
        secondaryContentElement.innerHTML = `
            <div class="text-center my-4">
              <img src="${news.secondaryImageUrl}" alt="Imagem secundária da notícia" class="img-fluid rounded">
            </div>
            ${news.secondaryImageCaption ? `<p class="img-leg">${news.secondaryImageCaption}</p>` : ''}
        `;
      }
    }
    displayRelatedNews(newsId);
  }
document.addEventListener('DOMContentLoaded', displayNewsInfo);