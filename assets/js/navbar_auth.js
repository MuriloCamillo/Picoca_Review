/**
 * @fileoverview Gerencia a exibição de elementos da navbar e toasts
 * relacionados ao estado de autenticação do usuário (logado/deslogado)
 * usando localStorage.
 */

/**
 * Atualiza a visibilidade dos links 'Login', 'Registrar' e do dropdown do usuário
 * na navbar, além de definir o nome de usuário exibido e configurar o botão de logout.
 * @param {boolean} isLoggedIn - Indica se o usuário está logado (true) ou não (false).
 * @param {string|null} username - O nome do usuário logado, ou null/undefined se deslogado.
 */
function updateNavbarVisuals(isLoggedIn, username) {
  const loginLink = document.getElementById("nav-login-link");
  const registerLink = document.getElementById("nav-register-link");
  const userDropdown = document.getElementById("nav-user-dropdown");
  const usernameSpan = document.getElementById("nav-username");
  const logoutBtn = document.getElementById("nav-logout-btn");

  if (
    !loginLink ||
    !registerLink ||
    !userDropdown ||
    !usernameSpan ||
    !logoutBtn
  ) {
    console.error(
      "Erro Crítico: Elementos essenciais da navbar não encontrados. Verifique os IDs."
    );
    return;
  }

  if (isLoggedIn) {
    // Estado Logado
    loginLink.classList.add("hidden");
    registerLink.classList.add("hidden");
    userDropdown.classList.remove("hidden");
    usernameSpan.textContent = username;

    logoutBtn.removeEventListener("click", handleLogout);
    logoutBtn.addEventListener("click", handleLogout);
  } else {
    // Estado Não Logado
    loginLink.classList.remove("hidden");
    registerLink.classList.remove("hidden");
    userDropdown.classList.add("hidden");
  }
}

/**
 * Atualiza o texto principal (título e subtítulos) na seção Hero da página inicial.
 * Esta função só tem efeito se os elementos com os IDs correspondentes existirem na página.
 * @param {boolean} isLoggedIn - Indica se o usuário está logado.
 * @param {string|null} username - O nome do usuário logado.
 */
function updateHeroText(isLoggedIn, username) {
  const heroTitle = document.getElementById("hero-title");
  const heroSubtitle1 = document.getElementById("hero-subtitle1");
  const heroSubtitle2 = document.getElementById("hero-subtitle2");

  if (heroTitle && heroSubtitle1 && heroSubtitle2) {
    if (isLoggedIn) {
      // Textos para usuário logado
      heroTitle.textContent = `Bem vindo de volta, ${username}!`;
      heroSubtitle1.textContent = "É bom tê-lo de volta!";
      heroSubtitle2.textContent =
        "Não se esqueça de acompanhar as novidades das suas séries preferidas!";
    } else {
      // Textos para usuário deslogado (padrão do HTML)
      heroTitle.textContent = "Bem vindo ao Picoca Review!";
      heroSubtitle1.textContent =
        "Não se perca nas séries que você já assistiu.";
      heroSubtitle2.textContent = "Salve para lembrar as que você quer ver.";
    }
  }
}

/**
 * Função principal que verifica o status de login no localStorage
 * e chama as funções de atualização da interface (Navbar e Hero).
 */
function checkLoginStatusAndUpdateUI() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const isLoggedIn = !!loggedInUser;

  updateNavbarVisuals(isLoggedIn, loggedInUser);
  updateHeroText(isLoggedIn, loggedInUser);
}

/**
 * Função executada ao clicar no botão de Logout.
 * Limpa localStorage, atualiza UI e mostra toast de logout.
 * @param {Event} event - O objeto do evento de clique.
 */
function handleLogout(event) {
  event.preventDefault();
  localStorage.removeItem("loggedInUser");
  console.log("Usuário deslogado.");
  checkLoginStatusAndUpdateUI(); // Atualiza navbar E hero text

  // --- Mostrar Toast de Logout ---
  const toastElement = document.getElementById("logout-toast");
  if (toastElement) {
    toastElement.classList.add("show");
    setTimeout(() => {
      toastElement.classList.remove("show");
    }, 3000);
  } else {
    console.warn("Elemento #logout-toast não encontrado.");
    alert("Logout realizado com sucesso!");
  }
}

/**
 * Verifica se deve mostrar o toast de login bem-sucedido e o exibe.
 * Remove o sinalizador do localStorage após exibir.
 */
function checkAndShowLoginToast() {
  const showToastFlag = localStorage.getItem("showLoginSuccessToast");
  if (showToastFlag === "true") {
    const toastElement = document.getElementById("login-success-toast");
    if (toastElement) {
      toastElement.classList.add("show");
      localStorage.removeItem("showLoginSuccessToast");
      setTimeout(() => {
        toastElement.classList.remove("show");
      }, 3000);
    } else {
      console.warn("Elemento #login-success-toast não encontrado.");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatusAndUpdateUI();
  checkAndShowLoginToast();
});
