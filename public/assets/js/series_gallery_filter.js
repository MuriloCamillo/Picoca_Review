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
  // Seleciona os itens da galeria *aqui*, para pegar os adicionados dinamicamente
  const seriesItems = document.querySelectorAll("#seriesList .filterDiv");

  // Verifica se os elementos necessários existem
  if (
    !searchInput ||
    !filterButtonsContainer ||
    !seriesItems ||
    seriesItems.length === 0
  ) {
    // Pode acontecer brevemente durante o carregamento ou se não houver séries
    // console.warn("Elementos de filtro ou itens da galeria não prontos para applyFilters.");
    return;
  }

  const searchTerm = searchInput.value.toLowerCase().trim();
  const activeFilterButton =
    filterButtonsContainer.querySelector(".filter-btn.active");
  // Se nenhum botão estiver ativo (improvável, mas seguro), considera 'all'
  const selectedGenre = activeFilterButton
    ? activeFilterButton.dataset.filter
    : "all";

  // Itera sobre cada card de série
  seriesItems.forEach((item) => {
    // Verifica se o gênero do card corresponde ao filtro selecionado
    // A classe 'all' corresponde a todos os itens
    const genreMatch =
      selectedGenre === "all" || item.classList.contains(selectedGenre);

    // Verifica se o título do card (do atributo 'alt' da imagem) contém o termo de busca
    const img = item.querySelector("img");
    const title = img ? img.getAttribute("alt").toLowerCase() : "";
    // O item corresponde se a busca estiver vazia OU se o título incluir o termo
    const titleMatch = !searchTerm || title.includes(searchTerm);

    // Mostra ou esconde o item com base nas correspondências
    if (genreMatch && titleMatch) {
      item.classList.remove("hide"); // Certifique-se que 'hide' está definido no CSS
      item.classList.add("show-item"); // Opcional para animação
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
  console.log("Inicializando filtros..."); // Log para depuração
  const searchInput = document.getElementById("seriesSearchInput");
  const filterButtonsContainer = document.getElementById("myBtnContainer");

  // Adiciona listener ao container dos botões (delegação de eventos)
  if (filterButtonsContainer) {
    filterButtonsContainer.addEventListener("click", function (event) {
      // Verifica se o elemento clicado é um botão de filtro
      const targetButton = event.target.closest(".filter-btn");
      if (targetButton) {
        console.log("Botão de filtro clicado:", targetButton.dataset.filter); // Log
        // Remove a classe 'active' de todos os botões
        filterButtonsContainer
          .querySelectorAll(".filter-btn")
          .forEach((btn) => btn.classList.remove("active"));
        // Adiciona a classe 'active' ao botão clicado
        targetButton.classList.add("active");
        // Aplica os filtros com base no botão clicado
        applyFilters();
      }
    });
  } else {
    console.warn(
      "Container de botões de filtro (myBtnContainer) não encontrado."
    );
  }

  // Adiciona listener 'input' à barra de busca (dispara a cada caractere)
  if (searchInput) {
    searchInput.addEventListener("input", () => {
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
