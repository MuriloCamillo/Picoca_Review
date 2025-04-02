document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('navbarSearchInput');
  const searchResultsContainer = document.getElementById('navbarSearchResults');
  const searchForm = document.getElementById('navbarSearchForm');

  // 1. Verifica se os dados das séries e os elementos HTML existem
  if (typeof seriesData === 'undefined') {
      console.error('Erro Crítico: objeto seriesData não encontrado. Verifique se assets/js/series_data.js foi carregado ANTES de navbar_search.js.');
      if (searchInput) searchInput.placeholder = 'Erro ao carregar dados';
      return; 
  }

  if (!searchInput || !searchResultsContainer || !searchForm) {
      console.warn('Aviso: Elementos da busca na navbar (input, results container ou form) não encontrados nesta página.');
      return; 
  }

  // 2. Event Listener para o Input de Busca
  searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase().trim();
      searchResultsContainer.innerHTML = ''; 

      // Só mostra sugestões se tiver pelo menos 2 caracteres
      if (searchTerm.length < 2) {
          searchResultsContainer.style.display = 'none';
          return;
      }

      // Filtra as séries que contêm o termo de busca no título
      const matches = Object.entries(seriesData)
          .filter(([id, serie]) => serie.title.toLowerCase().includes(searchTerm))
          .slice(0, 7); // Limita a 7 sugestões

      // 3. Exibe as Sugestões
      if (matches.length > 0) {
          matches.forEach(([id, serie]) => {
              const link = document.createElement('a');
              link.classList.add('dropdown-item'); 
              link.href = `series_info_default.html?id=${id}`; 
              const title = serie.title;
   const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
   const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
   const highlightedTitle = title.replace(regex, '<strong>$1</strong>');
   link.innerHTML = highlightedTitle; 

              link.addEventListener('mousedown', (e) => {
                  e.preventDefault(); 
                  window.location.href = link.href; 
              });

              searchResultsContainer.appendChild(link);
          });
          searchResultsContainer.style.display = 'block';
      } else {
           const noResult = document.createElement('span');
           noResult.classList.add('dropdown-item', 'disabled'); 
           noResult.textContent = 'Nenhuma série encontrada.';
           searchResultsContainer.appendChild(noResult);
           searchResultsContainer.style.display = 'block';
      }
  });

  // 4. Esconder Sugestões ao Clicar Fora ou Pressionar Esc
  document.addEventListener('click', (event) => {
      if (!searchInput.contains(event.target) && !searchResultsContainer.contains(event.target)) {
          searchResultsContainer.style.display = 'none';
      }
  });

  searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
          searchResultsContainer.style.display = 'none';
      }
  });

  // 5. Redirecionar para a Galeria 
  searchForm.addEventListener('submit', (event) => {
      event.preventDefault(); 
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
          window.location.href = `series_gallery.html?search=${encodeURIComponent(searchTerm)}`;
      }
       searchResultsContainer.style.display = 'none'; 
  });
});