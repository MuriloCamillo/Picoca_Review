// assets/js/navbar_auth.js (ou o nome que você deu, ex: auth_navbar.js)

/**
 * Atualiza a aparência da Navbar baseada no status de login armazenado no localStorage.
 */
function updateNavbarBasedOnLogin() {
    const loginLink = document.getElementById('nav-login-link');
    const registerLink = document.getElementById('nav-register-link');
    const userDropdown = document.getElementById('nav-user-dropdown');
    const usernameSpan = document.getElementById('nav-username');
    const logoutBtn = document.getElementById('nav-logout-btn');

    if (!loginLink || !registerLink || !userDropdown || !usernameSpan || !logoutBtn) {
        console.error("Erro Crítico: Elementos essenciais da navbar (nav-login-link, nav-register-link, nav-user-dropdown, nav-username, nav-logout-btn) não encontrados no HTML. Verifique os IDs.");
        return;
    }

    const loggedInUser = localStorage.getItem('loggedInUser');

    if (loggedInUser) {
        // --- Estado Logado ---
        loginLink.classList.add('hidden');
        registerLink.classList.add('hidden');
        userDropdown.classList.remove('hidden');
        usernameSpan.textContent = loggedInUser;

        // Garante listener de logout correto
        logoutBtn.removeEventListener('click', handleLogout);
        logoutBtn.addEventListener('click', handleLogout);

    } else {
        // --- Estado Não Logado ---
        loginLink.classList.remove('hidden');
        registerLink.classList.remove('hidden');
        userDropdown.classList.add('hidden');
    }
}

/**
 * Função executada ao clicar no botão de Logout.
 * Remove o usuário do localStorage, atualiza a navbar e mostra o toast de logout.
 * @param {Event} event - O objeto do evento de clique.
 */
function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem('loggedInUser');
    console.log("Usuário deslogado.");
    updateNavbarBasedOnLogin(); // Atualiza a UI da navbar

    // --- Mostrar Toast de Logout ---
    const toastElement = document.getElementById('logout-toast'); // ID do toast de logout
    if (toastElement) {
        toastElement.classList.add('show');
        setTimeout(() => {
            toastElement.classList.remove('show');
        }, 3000); // 3 segundos
    } else {
         console.warn("Elemento #logout-toast não encontrado para feedback de logout.");
         // alert("Logout realizado com sucesso!"); // Fallback alert
    }
}

/**
 * Verifica se deve mostrar o toast de login bem-sucedido e o exibe.
 * Remove o sinalizador do localStorage após exibir para não mostrar novamente.
 */
function checkAndShowLoginToast() {
    const showToastFlag = localStorage.getItem('showLoginSuccessToast');

    if (showToastFlag === 'true') {
        const toastElement = document.getElementById('login-success-toast'); // ID do toast de login
        if (toastElement) {
            toastElement.classList.add('show');

            // IMPORTANTE: Remove o sinalizador para não mostrar de novo
            localStorage.removeItem('showLoginSuccessToast');

            // Esconde o toast após 3 segundos
            setTimeout(() => {
                toastElement.classList.remove('show');
            }, 3000); // 3 segundos
        } else {
            console.warn("Elemento #login-success-toast não encontrado.");
            // Se o toast HTML não existir, talvez mostrar um alert como fallback?
            // alert("Login realizado com sucesso! Bem-vindo(a)!");
        }
    }
}

// --- INICIALIZAÇÃO ---
// Quando o DOM carregar, atualiza a navbar E verifica se precisa mostrar o toast de login.
document.addEventListener('DOMContentLoaded', () => {
    updateNavbarBasedOnLogin();
    checkAndShowLoginToast();
});