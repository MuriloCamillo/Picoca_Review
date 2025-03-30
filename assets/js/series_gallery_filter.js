// assets/js/series_gallery_filter.js

/**
 * Aplica os filtros de gênero e busca aos cards da galeria.
 * Esta função é chamada quando um botão de filtro é clicado ou
 * quando o texto na barra de busca muda.
 */
function applyFilters() {
    const searchInput = document.getElementById('seriesSearchInput');
    const filterButtonsContainer = document.getElementById('myBtnContainer');
    // Seleciona os itens da galeria *aqui*, para pegar os adicionados dinamicamente
    const seriesItems = document.querySelectorAll('#seriesList .filterDiv');

    // Verifica se os elementos necessários existem
    if (!searchInput || !filterButtonsContainer || !seriesItems || seriesItems.length === 0) {
        // Pode acontecer brevemente durante o carregamento ou se não houver séries
        // console.warn("Elementos de filtro ou itens da galeria não prontos para applyFilters.");
        return;
    }

    const searchTerm = searchInput.value.toLowerCase().trim();
    const activeFilterButton = filterButtonsContainer.querySelector('.filter-btn.active');
    // Se nenhum botão estiver ativo (improvável, mas seguro), considera 'all'
    const selectedGenre = activeFilterButton ? activeFilterButton.dataset.filter : 'all';

    // Itera sobre cada card de série
    seriesItems.forEach(item => {
        // Verifica se o gênero do card corresponde ao filtro selecionado
        // A classe 'all' corresponde a todos os itens
        const genreMatch = selectedGenre === 'all' || item.classList.contains(selectedGenre);

        // Verifica se o título do card (do atributo 'alt' da imagem) contém o termo de busca
        const img = item.querySelector('img');
        const title = img ? img.getAttribute('alt').toLowerCase() : '';
        // O item corresponde se a busca estiver vazia OU se o título incluir o termo
        const titleMatch = !searchTerm || title.includes(searchTerm);

        // Mostra ou esconde o item com base nas correspondências
        if (genreMatch && titleMatch) {
            item.classList.remove('hide'); // Certifique-se que 'hide' está definido no CSS
            item.classList.add('show-item'); // Opcional para animação
        } else {
            item.classList.add('hide');
            item.classList.remove('show-item');
        }
    });
}

/**
 * Configura os event listeners para os botões de filtro e a barra de busca.
 * Esta função é chamada pelo 'series_gallery_loader.js' DEPOIS que os cards
 * foram carregados dinamicamente.
 */
function initializeFilters() {
    console.log("Inicializando filtros..."); // Log para depuração
    const searchInput = document.getElementById('seriesSearchInput');
    const filterButtonsContainer = document.getElementById('myBtnContainer');

    // Adiciona listener ao container dos botões (delegação de eventos)
    if (filterButtonsContainer) {
        filterButtonsContainer.addEventListener('click', function(event) {
            // Verifica se o elemento clicado é um botão de filtro
            const targetButton = event.target.closest('.filter-btn');
            if (targetButton) {
                console.log("Botão de filtro clicado:", targetButton.dataset.filter); // Log
                // Remove a classe 'active' de todos os botões
                filterButtonsContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                // Adiciona a classe 'active' ao botão clicado
                targetButton.classList.add('active');
                // Aplica os filtros com base no botão clicado
                applyFilters();
            }
        });
    } else {
        console.warn("Container de botões de filtro (myBtnContainer) não encontrado.");
    }

    // Adiciona listener 'input' à barra de busca (dispara a cada caractere)
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            // console.log("Busca alterada:", searchInput.value); // Log opcional
            applyFilters(); // Aplica filtros a cada mudança na busca
        });
    } else {
        console.warn("Input de busca (seriesSearchInput) não encontrado.");
    }

    // Aplica os filtros uma vez na inicialização para garantir o estado correto
    // (considera o botão 'all' ativo e a busca vazia).
    applyFilters();
     console.log("Filtros inicializados e aplicados."); // Log
}

// IMPORTANTE: Remova ou comente qualquer chamada 'DOMContentLoaded' que
// você tinha neste arquivo anteriormente para inicializar os filtros.
// A inicialização agora é feita pela chamada de 'initializeFilters()'
// a partir do 'series_gallery_loader.js'.
// Ex: // document.addEventListener('DOMContentLoaded', initializeFilters);
// Ex: // document.addEventListener('DOMContentLoaded', function() { /* código antigo aqui */ });

// Adicione esta classe ao seu CSS se ainda não tiver:
/*
.hide {
  display: none !important;
}
.show-item {
 animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from {opacity: 0;}
  to {opacity: 1;}
}
*/