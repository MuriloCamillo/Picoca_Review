// assets/js/series_info.js

// Função auxiliar para preencher listas (cast, genres, etc.)
function populateList(listId, items) {
  const listContainer = document.getElementById(listId);
  if (!listContainer) {
      console.warn("Elemento da lista não encontrado:", listId);
      return;
  }
  listContainer.innerHTML = ''; // Limpa a lista antes de adicionar
  if (items && items.length > 0) {
      items.forEach(item => {
          const span = document.createElement('span');
          // Define a classe correta baseada no ID da lista (ex: cast-list -> cast-item)
          const itemClass = listId.replace('-list', '-item');
          span.className = itemClass; // Aplica a classe CSS para estilização
          span.textContent = item;
          listContainer.appendChild(span);
      });
  } else {
      // Opcional: Mensagem se a lista estiver vazia
      listContainer.textContent = 'Nenhuma informação disponível.';
  }
}

// Função principal para preencher os dados na página
function displaySeriesInfo() {
  // 1. Obter o ID da série da URL
  const urlParams = new URLSearchParams(window.location.search);
  const seriesId = urlParams.get('id');

  // 2. Verificar se um ID foi passado
  if (!seriesId) {
      console.error("Nenhum ID de série encontrado na URL.");
      document.querySelector('main').innerHTML = '<h1 class="text-center text-danger mt-5">Erro: ID da série não especificado.</h1>';
      return;
  }

  // 3. Encontrar os dados da série correspondente em seriesData
  //    (Certifique-se que seriesData de series_data.js está carregado antes deste script)
  const serie = seriesData[seriesId];

  // 4. Verificar se a série foi encontrada nos dados
  if (!serie) {
      console.error("Série não encontrada com ID:", seriesId);
      document.querySelector('main').innerHTML = `<h1 class="text-center text-danger mt-5">Série com ID "${seriesId}" não encontrada!</h1>`;
      return;
  }

  // 5. Atualizar os elementos HTML com os dados da série

  // Atualiza o título da aba do navegador
  document.title = `${serie.title} - Picoca Review`;

  // Atualizar Título e Ano
  const titleElement = document.getElementById('serie-title');
  const yearElement = document.getElementById('serie-year');
  if (titleElement) {
      // Limpa o conteúdo anterior antes de adicionar novo (importante se houver texto residual)
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
      // Aplica a classe de status para estilização (se definida)
      statusElement.className = 'serie-status'; // Reseta para a classe base
      if (serie.statusClass) {
          statusElement.classList.add(serie.statusClass); // Adiciona a classe específica
      }
  }

  // Atualizar Poster e Imagem de Fundo (Backdrop)
  const posterElement = document.getElementById('serie-poster');
  const backdropElement = document.getElementById('backdrop-image');
  if (posterElement && serie.posterImg) posterElement.src = serie.posterImg;
  if (backdropElement && serie.backdropImg) backdropElement.style.backgroundImage = `url('${serie.backdropImg}')`;

  // Atualizar Listas usando a função auxiliar
  populateList('cast-list', serie.cast);
  populateList('genres-list', serie.genres);
  populateList('seasons-list', serie.seasons);
  populateList('watch-list', serie.watchPlatforms);

  // Atualizar Trailer
  const trailerElement = document.getElementById('serie-trailer');
  if (trailerElement && serie.trailerUrl) trailerElement.src = serie.trailerUrl;

  // ----- Implementações futuras -----
  // Lógica para botões Like, Watchlist e rating pode ser adicionada aqui.
}

// 6. Chamar a função principal quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', displaySeriesInfo);