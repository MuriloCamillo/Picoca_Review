// assets/js/auth_navbar.js

/**
 * Atualiza a aparência da Navbar baseada no status de login armazenado no localStorage.
 */
function updateNavbarBasedOnLogin() {
  // Seleciona os elementos da Navbar pelos IDs
  const loginLink = document.getElementById('nav-login-link');
  const registerLink = document.getElementById('nav-register-link');
  const userDropdown = document.getElementById('nav-user-dropdown');
  const usernameSpan = document.getElementById('nav-username');
  const logoutBtn = document.getElementById('nav-logout-btn');

  // Verificação básica se os elementos existem
  if (!loginLink || !registerLink || !userDropdown || !usernameSpan || !logoutBtn) {
      console.error("Erro Crítico: Elementos essenciais da navbar não encontrados no HTML. Verifique os IDs.");
      return; // Interrompe se elementos cruciais faltarem
  }

  // Busca o usuário logado no localStorage
  const loggedInUser = localStorage.getItem('loggedInUser');

  if (loggedInUser) {
      // --- Estado Logado ---
      // Esconde os links de Login/Registro adicionando a classe 'hidden'
      loginLink.classList.add('hidden');
      registerLink.classList.add('hidden');

      // Mostra o dropdown do usuário removendo a classe 'hidden'
      userDropdown.classList.remove('hidden');
      usernameSpan.textContent = loggedInUser; // Exibe o nome do usuário

      // Adiciona o listener de evento para o botão de logout (remove antes para evitar duplicatas)
      logoutBtn.removeEventListener('click', handleLogout);
      logoutBtn.addEventListener('click', handleLogout);

  } else {
      // --- Estado Não Logado ---
      // Mostra os links de Login/Registro removendo a classe 'hidden'
      loginLink.classList.remove('hidden');
      registerLink.classList.remove('hidden');

      // Esconde o dropdown do usuário adicionando a classe 'hidden'
      userDropdown.classList.add('hidden');
      // Não precisamos mexer no listener de logout aqui, ele só é adicionado se logado.
  }
}

/**
* Função executada ao clicar no botão de Logout.
* Remove o usuário do localStorage e atualiza a navbar.
* @param {Event} event - O objeto do evento de clique.
*/
function handleLogout(event) {
  event.preventDefault();
  localStorage.removeItem('loggedInUser');
  console.log("Usuário deslogado.");
  updateNavbarBasedOnLogin(); // Atualiza a UI da navbar

  // --- Mostrar Toast Customizado ---
  const toastElement = document.getElementById('logout-toast');
  if (toastElement) {
      toastElement.classList.add('show'); // Adiciona classe para fazer aparecer

      // Define um temporizador para remover a classe 'show' 
      setTimeout(() => {
          toastElement.classList.remove('show');
      }, 2500); // 2500ms = 2.5 segundos
  } else {
       console.warn("Elemento #logout-toast não encontrado para feedback de logout.");
       alert("Logout realizado com sucesso!"); // Fallback para alert
  }
}

// --- INICIALIZAÇÃO ---
// Adiciona um listener para executar 'updateNavbarBasedOnLogin'
// assim que o conteúdo HTML da página estiver completamente carregado e parseado.
document.addEventListener('DOMContentLoaded', updateNavbarBasedOnLogin);