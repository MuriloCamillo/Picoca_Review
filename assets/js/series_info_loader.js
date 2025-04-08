/**
 * @fileoverview Carrega e exibe as informações detalhadas de uma série específica
 * na página de detalhes da série (series_info_default.html).
 */

/**
 * Preenche um container HTML (geralmente um <div> ou <ul>) com uma lista de itens.
 * Cada item é envolvido por um <span> com uma classe CSS baseada no ID do container.
 * Ex: Se listId for 'cast-list', os spans terão a classe 'cast-item'.
 * @param {string} listId - O ID do elemento HTML container da lista.
 * @param {string[]} items - Um array de strings a serem exibidos como itens da lista.
 * @returns {void}
 */
function populateList(listId, items) {
  const listContainer = document.getElementById(listId);
  if (!listContainer) {
      console.warn("Elemento da lista não encontrado:", listId);
      return;
  }
  listContainer.innerHTML = ''; 
  if (items && items.length > 0) {
      items.forEach(item => {
          const span = document.createElement('span');
          // Define a classe correta baseada no ID da lista (ex: cast-list -> cast-item)
          const itemClass = listId.replace('-list', '-item');
          span.className = itemClass; 
          span.textContent = item;
          listContainer.appendChild(span);
      });
  } else {
      listContainer.textContent = 'Nenhuma informação disponível.';
  }
}

/**
 * Função principal que lê o ID da série da URL, busca os dados
 * correspondentes em `seriesData` e preenche a página com essas informações.
 * @returns {void}
 */
function displaySeriesInfo() {
    //  Obtem o ID da série da URL
    const urlParams = new URLSearchParams(window.location.search);
    const seriesId = urlParams.get('id');
  
    if (!seriesId) {
      console.error("Nenhum ID de série encontrado na URL.");
      document.querySelector('main').innerHTML = '<h1 class="text-center text-danger mt-5">Erro: ID da série não especificado.</h1>';
      return;
    }
    //  Encontra os dados da série correspondente em seriesData
    const serie = seriesData[seriesId];
  
    // Verifica se a série foi encontrada nos dados
    if (!serie) {
      console.error("Série não encontrada com ID:", seriesId);
      document.querySelector('main').innerHTML = `<h1 class="text-center text-danger mt-5">Série com ID "${seriesId}" não encontrada!</h1>`;
      return;
    }
  
    // Preencher meta description
    const description = `${serie.title}: ${serie.synopsis ? serie.synopsis.substring(0, 160) + "..." : ""}`;  // Adicionado verificação para serie.synopsis
    document.querySelector('meta[name="description"]').setAttribute('content', description);
  
    // Atualiza os elementos HTML com os dados da série
  
    // Atualiza o título da aba do navegador
    document.title = `${serie.title} - Picoca Review`;
  
    // Atualizar Título e Ano
    const titleElement = document.getElementById('serie-title');
    const yearElement = document.getElementById('serie-year');
    if (titleElement) {
      titleElement.textContent = '';
      titleElement.appendChild(document.createTextNode(serie.title + ' ')); // Adiciona o título como texto
      if (yearElement) {
        yearElement.textContent = `(${serie.year})`; // Adiciona o ano no span
        titleElement.appendChild(yearElement); // Reanexa o span do ano
      }
    }
  
    // Atualizar Criador, Tagline, Sinopse, Status
    const creatorElement = document.getElementById('serie-creator');
    const taglineElement = document.getElementById('serie-tagline');
    const synopsisElement = document.getElementById('serie-synopsis')?.querySelector('p'); // Pega o <p> dentro da div
    const statusElement = document.getElementById('serie-status');
  
    if (creatorElement) creatorElement.textContent = `Criado por ${serie.creator}`;
    if (taglineElement) taglineElement.textContent = serie.tagline;
    if (synopsisElement) synopsisElement.textContent = serie.synopsis;
    if (statusElement) {
      statusElement.textContent = serie.status;
      statusElement.className = 'serie-status';
      if (serie.statusClass) {
        statusElement.classList.add(serie.statusClass);
      }
    }
  
    // Atualizar Poster e Imagem de Fundo (Backdrop)
    const posterElement = document.getElementById('serie-poster');
    const backdropElement = document.getElementById('backdrop-image');
    if (posterElement && serie.posterImg) posterElement.src = serie.posterImg;
    if (backdropElement && serie.backdropImg) backdropElement.style.backgroundImage = `url('${serie.backdropImg}')`;
  
    // Atualizar Listas
    populateList('cast-list', serie.cast);
    populateList('genres-list', serie.genres);
    populateList('seasons-list', serie.seasons);
    populateList('watch-list', serie.watchPlatforms);
  
    // Atualizar Trailer
    const trailerElement = document.getElementById('serie-trailer');
    if (trailerElement && serie.trailerUrl) trailerElement.src = serie.trailerUrl;
  
    // ----- Implementações futuras -----
    // Lógica para botões Like, Watchlist e rating
  }
document.addEventListener('DOMContentLoaded', displaySeriesInfo);