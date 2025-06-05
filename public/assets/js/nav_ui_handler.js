document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar[data-user-is-present]');
    if (!navbar) {
        // Se a navbar não tiver o atributo, não faz nada.
        // Isso pode acontecer se o partial não for incluído ou se a variável 'user' não for passada.
        return;
    }

    const userIsPresent = navbar.dataset.userIsPresent === 'true';

    const userDropdownLi = document.getElementById('nav-user-dropdown-li');
    const loginLinkLi = document.getElementById('nav-login-link-li');
    const registerLinkLi = document.getElementById('nav-register-link-li');

    if (userIsPresent) {
        if (userDropdownLi) userDropdownLi.classList.remove('d-none');
        if (loginLinkLi) loginLinkLi.classList.add('d-none');
        if (registerLinkLi) registerLinkLi.classList.add('d-none');
    } else {
        if (userDropdownLi) userDropdownLi.classList.add('d-none');
        if (loginLinkLi) loginLinkLi.classList.remove('d-none');
        if (registerLinkLi) registerLinkLi.classList.remove('d-none');
    }
});