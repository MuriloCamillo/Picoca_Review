// assets/js/navbar_search.js

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('navbarSearchInput');
  const searchResultsContainer = document.getElementById('navbarSearchResults');
  const searchForm = document.getElementById('navbarSearchForm');

  // 1. Verifica se os dados das séries e os elementos HTML existem
  if (typeof seriesData === 'undefined') {
      console.error('Erro Crítico: objeto seriesData não encontrado. Verifique se assets/js/series_data.js foi carregado ANTES de navbar_search.js.');
      if (searchInput) searchInput.placeholder = 'Erro ao carregar dados';
      return; // Interrompe a execução se os dados não existirem
  }

  if (!searchInput || !searchResultsContainer || !searchForm) {
      console.warn('Aviso: Elementos da busca na navbar (input, results container ou form) não encontrados nesta página.');
      return; // Interrompe se os elementos não existirem na página atual
  }

  // 2. Event Listener para o Input de Busca
  searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase().trim();
      searchResultsContainer.innerHTML = ''; // Limpa resultados anteriores

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
              link.classList.add('dropdown-item'); // Estilo Bootstrap
              link.href = `series_info_default.html?id=${id}`; // Link para a página da série
              const title = serie.title;
   // Cria um regex case-insensitive para o termo de busca
   // Escapa caracteres especiais do regex no termo de busca
   const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
   const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
   // Substitui o termo encontrado por ele mesmo envolto em <strong>
   const highlightedTitle = title.replace(regex, '<strong>$1</strong>');
   link.innerHTML = highlightedTitle; // Usa innerHTML para renderizar a tag <strong>

              // Adiciona um listener para garantir a navegação antes que o menu se esconda
              link.addEventListener('mousedown', (e) => {
                  e.preventDefault(); // Impede que o input perca o foco imediatamente
                  window.location.href = link.href; // Navega para a página da série
              });

              searchResultsContainer.appendChild(link);
          });
          searchResultsContainer.style.display = 'block'; // Mostra o container
      } else {
           // Opcional: Mostrar mensagem de "Nenhum resultado"
           const noResult = document.createElement('span');
           noResult.classList.add('dropdown-item', 'disabled'); // Estilo Bootstrap para item desabilitado
           noResult.textContent = 'Nenhuma série encontrada.';
           searchResultsContainer.appendChild(noResult);
           searchResultsContainer.style.display = 'block';
           // Ou simplesmente esconda: searchResultsContainer.style.display = 'none';
      }
  });

  // 4. Esconder Sugestões ao Clicar Fora ou Pressionar Esc
  document.addEventListener('click', (event) => {
      // Esconde se o clique NÃO for dentro do input OU do container de resultados
      if (!searchInput.contains(event.target) && !searchResultsContainer.contains(event.target)) {
          searchResultsContainer.style.display = 'none';
      }
  });

  searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
          searchResultsContainer.style.display = 'none';
      }
  });

  // 5. Opcional: Redirecionar para a Galeria ao Submeter o Formulário
  searchForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Impede o envio padrão do formulário
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
          // Redireciona para a página da galeria, passando o termo como parâmetro
          // A página series_gallery.js precisaria ser adaptada para ler este parâmetro
          window.location.href = `series_gallery.html?search=${encodeURIComponent(searchTerm)}`;
      }
       searchResultsContainer.style.display = 'none'; // Esconde sugestões após submeter
  });
});