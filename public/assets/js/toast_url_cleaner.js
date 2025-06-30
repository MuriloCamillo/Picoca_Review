/**
 * @fileoverview Limpa os parâmetros de feedback da URL após o carregamento da página.
 *
 * Este script remove parâmetros de consulta (query parameters) específicos da URL, como 
 * 'login_success' ou 'error_profile'.
 * Esses parâmetros são usados pelo servidor para acionar a exibição de notificações
 * (toasts) apenas uma vez, no primeiro carregamento da página após uma ação.
 *
 * Ao removê-los da URL, o script evita que a notificação seja
 * exibida novamente caso o usuário recarregue a página ou compartilhe o link,
 * mantendo a URL "limpa".
 */
document.addEventListener('DOMContentLoaded', function () {
    // 1. Define a lista de todos os parâmetros de URL que devem ser removidos.
    // Estes parâmetros correspondem às chaves usadas pelo backend para acionar os toasts de feedback.
    const paramsToRemove = [
        'login_success', 'signup_success', 'logout_success', 'logout_error',
        'success_profile', 'success_password', 'success_avatar',
        'error_profile', 'error_password', 'error_avatar', 'error', 'success'
    ];

    const url = new URL(window.location);
    let paramsChanged = false;

    // 2. Itera sobre a lista e remove cada parâmetro, caso ele exista na URL atual.
    paramsToRemove.forEach(param => {
        if (url.searchParams.has(param)) {
            url.searchParams.delete(param);
            paramsChanged = true; // Sinaliza que a URL foi modificada.
        }
    });

    // 3. Se algum parâmetro foi de fato removido, atualiza a URL na barra de endereço do navegador.
    if (paramsChanged) {
        // A função `history.replaceState()` modifica a entrada atual no histórico do navegador.
        // Isso altera a URL visível para o usuário de forma silenciosa, SEM recarregar a página.
        window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
    }
});