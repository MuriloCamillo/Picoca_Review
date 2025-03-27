// Inicializa mostrando todos os itens
filterSelection("all");

function filterSelection(category) {
  let items, i;
  items = document.getElementsByClassName("filterDiv"); // Pega todos os cards

  // Se a categoria for "all", remove a classe "hide" e adiciona "show-item" em todos
  if (category == "all") {
    for (i = 0; i < items.length; i++) {
      items[i].classList.remove("hide");
      items[i].classList.add("show-item");
    }
  } else {
    // Caso contrário, itera sobre todos os itens
    for (i = 0; i < items.length; i++) {
      // Primeiro, esconde o item
      items[i].classList.add("hide");
      items[i].classList.remove("show-item");
      // Verifica se o item possui a classe da categoria selecionada
      if (items[i].classList.contains(category)) {
        // Se possuir, remove a classe "hide" e adiciona "show-item"
        items[i].classList.remove("hide");
        items[i].classList.add("show-item");
      }
    }
  }

  // Atualiza o visual dos botões de filtro
  updateActiveButton(category);
}

// Adiciona/Remove a classe CSS 'hide' para controlar a visibilidade
// (Melhor que mexer diretamente no display para não conflitar com Bootstrap)
const style = document.createElement('style');
style.innerHTML = `.hide { display: none !important; }`; // Usa !important para garantir
document.head.appendChild(style);


function updateActiveButton(category) {
  // Pega o container dos botões
  var btnContainer = document.getElementById("myBtnContainer");
  // Pega todos os botões dentro do container
  var btns = btnContainer.getElementsByClassName("filter-btn");

  // Itera sobre os botões
  for (var i = 0; i < btns.length; i++) {
    // Remove a classe "active" de todos
    btns[i].classList.remove("active");
    // Verifica se o botão corresponde à categoria selecionada (comparando o onclick)
    // Uma forma mais robusta seria usar data-attributes nos botões, mas isso funciona
    if (btns[i].getAttribute('onclick') === `filterSelection('${category}')`) {
      // Adiciona a classe "active" ao botão correto
      btns[i].classList.add("active");
    }
  }
}