/**
 * @fileoverview Lida com a filtragem dinâmica (por gênero e busca textual)
 * dos cards de séries na página da galeria (series_gallery.html).
 */

/**
 * Aplica os filtros de gênero e busca textual aos cards de séries visíveis na galeria.
 * Mostra/esconde os cards com base nos filtros ativos e no termo de busca.
 * Esta função é chamada quando um botão de filtro é clicado ou o texto de busca muda.
 * @returns {void}
 */
function applyFilters() {
  const searchInput = document.getElementById("seriesSearchInput");
  const filterButtonsContainer = document.getElementById("myBtnContainer");
  // Seleciona os itens da galeria *aqui*, para pegar os adicionados dinamicamente pelo EJS
  const seriesItems = document.querySelectorAll("#seriesList .filterDiv");

  if (
    !searchInput ||
    !filterButtonsContainer ||
    !seriesItems ||
    seriesItems.length === 0
  ) {
    // console.warn("Elementos de filtro ou itens da galeria não prontos para applyFilters.");
    return;
  }

  const searchTerm = searchInput.value.toLowerCase().trim();
  const activeFilterButton =
    filterButtonsContainer.querySelector(".filter-btn.active");
  const selectedGenre = activeFilterButton
    ? activeFilterButton.dataset.filter
    : "all";

  seriesItems.forEach((item) => {
    const genreMatch =
      selectedGenre === "all" || item.classList.contains(selectedGenre);

    const img = item.querySelector("img");
    const title = img ? img.getAttribute("alt").toLowerCase() : "";
    const titleMatch = !searchTerm || title.includes(searchTerm);

    if (genreMatch && titleMatch) {
      item.classList.remove("hide"); 
      item.classList.add("show-item"); 
    } else {
      item.classList.add("hide");
      item.classList.remove("show-item");
    }
  });
}

/**
 * Configura os listeners de evento para os botões de filtro de gênero
 * e para a barra de busca textual.
 * Esta função deve ser chamada DEPOIS que os cards da galeria forem carregados no DOM.
 * @returns {void}
 */
function initializeFilters() {
  // console.log("Inicializando filtros..."); 
  const searchInput = document.getElementById("seriesSearchInput");
  const filterButtonsContainer = document.getElementById("myBtnContainer");

  if (filterButtonsContainer) {
    filterButtonsContainer.addEventListener("click", function (event) {
      const targetButton = event.target.closest(".filter-btn");
      if (targetButton) {
        // console.log("Botão de filtro clicado:", targetButton.dataset.filter);
        filterButtonsContainer
          .querySelectorAll(".filter-btn")
          .forEach((btn) => btn.classList.remove("active"));
        targetButton.classList.add("active");
        applyFilters();
      }
    });
  } else {
    console.warn(
      "Container de botões de filtro (myBtnContainer) não encontrado para series_gallery_filter.js."
    );
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      applyFilters();
    });

    // Verifica se há um termo de busca na URL (vindo da navbar, por exemplo) e aplica
    const urlParams = new URLSearchParams(window.location.search);
    const urlSearchTerm = urlParams.get('search');
    if (urlSearchTerm) {
        searchInput.value = urlSearchTerm; // Preenche o input com o termo da URL
    }
    // Não é necessário chamar applyFilters() aqui por causa do preenchimento do input,
    // mas se for necessário por outras razões, descomente.
    // A chamada final de applyFilters() após o DOMContentLoaded cuidará disso.

  } else {
    console.warn("Input de busca (seriesSearchInput) não encontrado para series_gallery_filter.js.");
  }

  // Aplica os filtros uma vez na inicialização para garantir o estado correto.
  // Isso também aplicará qualquer filtro vindo da URL através do preenchimento do searchInput.
  applyFilters(); 
  // console.log("Filtros inicializados e aplicados.");
}

// Auto-inicialização do script
// Isso garante que initializeFilters() seja chamado assim que o DOM estiver pronto.
if (document.readyState === 'loading') { // Documento ainda carregando
    document.addEventListener('DOMContentLoaded', initializeFilters);
} else { // DOMContentLoaded já foi disparado
    initializeFilters();
}
