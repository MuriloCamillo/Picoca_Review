
function normalizeGenreForClass(genreName) {
  if (!genreName) return '';
  let normalized = genreName.toLowerCase();
  normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos

  // --- Mapeamento Explícito ---
  // Adicione ou modifique mapeamentos aqui para garantir a correspondência exata
  const genreMap = {
      'comédia': 'comedia',
      'drama': 'drama',
      'animação': 'animacao',
      'ação': 'acao',
      'ficção científica': 'ficcao',
      'ficcao cientifica': 'ficcao', // Sem acento
      'ficção': 'ficcao',
      'terror': 'terror',
      'mistério': 'misterio',
      'misterio': 'misterio', // Sem acento
      'crime': 'drama', // Exemplo: Agrupar crime sob drama, ou crie 'crime'/'policial'
      'policial': 'policial', // Exemplo se tiver botão 'policial'
      'aventura': 'aventura',
      'super heróis': 'acao', // Exemplo: Agrupar sob ação
      'pós-apocalíptico': 'ficcao', // Exemplo: Agrupar sob ficção
      // Adicione mais mapeamentos conforme necessário
  };

  // Tenta encontrar no mapa primeiro
  for (const key in genreMap) {
      if (normalized.includes(key)) { // Verifica se a string normalizada contém a chave do mapa
          return genreMap[key];
      }
  }

  // Se não encontrou no mapa, tenta uma simplificação (remove caracteres especiais, pega primeira palavra)
  // Cuidado: isso pode gerar classes inesperadas se não houver mapa.
  normalized = normalized.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').split('-')[0];
  return normalized; // Retorna a versão simplificada como último recurso
}


/**
* Cria o HTML para um card de série na galeria.
* @param {string} seriesId A chave/ID da série em seriesData.
* @param {object} series O objeto contendo os dados da série.
* @returns {string} A string HTML do card da série.
*/
function createSeriesCardHTML(seriesId, series) {
  // Normaliza os gêneros para usar como classes CSS
  const genreClasses = (series.genres || [])
      .map(normalizeGenreForClass)
      .filter((cls, index, self) => cls && self.indexOf(cls) === index) // Remove vazios e duplicados
      .join(' '); // Junta as classes com espaço

  const posterSrc = series.posterImg || 'assets/img/placeholder_poster.webp'; // Imagem padrão caso falhe
  const title = series.title || 'Título Indisponível';

  return `
      <div class="col-lg-2 col-md-3 col-sm-4 col-6 filterDiv ${genreClasses}">
          <a href="series_info_default.html?id=${seriesId}" class="poster-link">
              <div class="poster">
                  <img src="${posterSrc}" alt="${title}">
              </div>
              </a>
      </div>
  `;
}

/**
* Carrega os cards das séries dinamicamente na galeria.
*/
function loadSeriesGallery() {
  const container = document.getElementById('seriesList');
  if (!container) {
      console.error("Erro: Container 'seriesList' não encontrado no HTML.");
      return;
  }

  if (typeof seriesData === 'undefined' || Object.keys(seriesData).length === 0) {
      console.warn("Aviso: Objeto seriesData não encontrado ou vazio.");
      container.innerHTML = '<p class="text-light text-center col-12">Nenhuma série cadastrada.</p>';
      return;
  }

  let allCardsHTML = '';
  Object.entries(seriesData).forEach(([seriesId, series]) => {
      allCardsHTML += createSeriesCardHTML(seriesId, series);
  });

  container.innerHTML = allCardsHTML;

  // Chama a inicialização do filtro DEPOIS que os cards foram adicionados ao DOM.
  if (typeof initializeFilters === 'function') {
      initializeFilters();
  } else {
      console.warn("Aviso: Função initializeFilters() não encontrada em series_gallery_filter.js. O filtro pode não funcionar.");
  }
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', loadSeriesGallery);