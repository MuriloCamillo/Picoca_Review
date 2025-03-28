document.addEventListener('DOMContentLoaded', function() {
  // Pega referências aos elementos importantes
  const searchInput = document.getElementById('seriesSearchInput');
  const filterButtonsContainer = document.getElementById('myBtnContainer');
  const seriesItems = document.querySelectorAll('#seriesList .filterDiv'); // Pega todos os cards de série

  // Função principal para aplicar filtros (gênero e busca)
  function applyFilters() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const activeFilterButton = filterButtonsContainer.querySelector('.filter-btn.active');
      const selectedGenre = activeFilterButton ? activeFilterButton.dataset.filter : 'all'; // Usa 'all' como padrão

      seriesItems.forEach(item => {
          // Verifica o Gênero
          const itemGenres = item.classList;
          const genreMatch = selectedGenre === 'all' || itemGenres.contains(selectedGenre);

          // Verifica o Título (pegando do atributo 'alt' da imagem interna)
          const img = item.querySelector('img');
          const title = img ? img.getAttribute('alt').toLowerCase() : ''; // Pega o alt e converte para minúsculo
          const titleMatch = title.includes(searchTerm); // Verifica se o título contém o termo de busca

          // Decide se mostra ou esconde o item
          if (genreMatch && titleMatch) {
              item.classList.remove('hide');
              item.classList.add('show-item'); // Para animação, se houver
          } else {
              item.classList.add('hide');
              item.classList.remove('show-item');
          }
      });
  }

  // Adiciona evento de clique aos botões de filtro de gênero
  if (filterButtonsContainer) {
      filterButtonsContainer.addEventListener('click', function(event) {
          // Verifica se o clique foi em um botão de filtro
          if (event.target.classList.contains('filter-btn')) {
              // Remove a classe 'active' de todos os botões
              filterButtonsContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
              // Adiciona a classe 'active' ao botão clicado
              event.target.classList.add('active');
              // Aplica os filtros
              applyFilters();
          }
      });
  }

  // Adiciona evento 'input' à barra de busca (dispara a cada tecla digitada)
  if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
  }

  // Aplica os filtros inicialmente ao carregar a página
  // (Garante que 'Mostrar Todas' esteja ativo e a busca vazia mostre tudo)
  applyFilters();

});

// A classe 'hide' e 'show-item' devem ser definidas no CSS como antes
// .hide { display: none !important; }
// .show-item { /* Estilos para mostrar, ex: display: block; ou animação */ }
// Adicionei isso ao CSS acima também.