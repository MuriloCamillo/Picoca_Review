/**
 * @fileoverview Gerencia a visibilidade dos elementos da interface do usuário na barra de navegação (navbar).
 *
 * Este script ajusta dinamicamente a navbar para exibir os links de "Login" e "Registrar"
 * para usuários deslogados, ou o menu dropdown do usuário para usuários autenticados.
 */
document.addEventListener('DOMContentLoaded', function () {
    // --- 1. Seleção dos Elementos Principais ---

    // A navbar contém o estado do usuário (logado ou não) em um atributo data-*.
    const navbar = document.querySelector('.navbar[data-user-is-present]');

    // Se a navbar ou o atributo de estado não existirem na página, o script não prossegue.
    if (!navbar) {
        return;
    }

    // Seleciona os itens de navegação (elementos <li>) que terão sua visibilidade alternada.
    const userDropdownLi = document.getElementById('nav-user-dropdown-li');
    const loginLinkLi = document.getElementById('nav-login-link-li');
    const registerLinkLi = document.getElementById('nav-register-link-li');

    // --- 2. Verificação do Estado de Autenticação ---

    // Lê o valor do atributo 'data-user-is-present' e o converte para um booleano.
    const userIsPresent = navbar.dataset.userIsPresent === 'true';

    // --- 3. Atualização da Interface com Base no Estado ---

    if (userIsPresent) {
        // Estado: Usuário Logado
        // Mostra o menu dropdown do usuário e esconde os links de login/registro.
        // A classe 'd-none' é uma classe de utilidade do Bootstrap para 'display: none'.
        if (userDropdownLi) userDropdownLi.classList.remove('d-none');
        if (loginLinkLi) loginLinkLi.classList.add('d-none');
        if (registerLinkLi) registerLinkLi.classList.add('d-none');
    } else {
        // Estado: Usuário Deslogado
        // Esconde o menu dropdown e mostra os links de login/registro.
        if (userDropdownLi) userDropdownLi.classList.add('d-none');
        if (loginLinkLi) loginLinkLi.classList.remove('d-none');
        if (registerLinkLi) registerLinkLi.classList.remove('d-none');
    }
});