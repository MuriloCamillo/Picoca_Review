/**
 * @fileoverview Inicializa e exibe os toasts do Bootstrap no carregamento da página.
 * Localiza elementos de toast que foram renderizados pelo servidor, e aciona sua exibição.
 */
document.addEventListener('DOMContentLoaded', function () {
    // 1. Identifica todos os elementos de toast que devem ser exibidos automaticamente.
    const toastsToShow = [
        document.getElementById('login-success-toast'),
        document.getElementById('signup-success-toast'),
        document.getElementById('logout-toast'),
        document.getElementById('logout-error-toast'),
        // Toasts de atualização de perfil usam uma classe genérica como gatilho.
        ...document.querySelectorAll('.toast.general-feedback-trigger')
    ].filter(Boolean); 

    // 2. Verifica se o componente Toast do Bootstrap está disponível antes de continuar.
    if (typeof bootstrap === 'undefined' || !bootstrap.Toast) {
        console.warn('Componente Toast do Bootstrap não encontrado. A exibição automática de toasts pode não funcionar.');
        return;
    }

    // 3. Inicializa e exibe cada toast identificado.
    toastsToShow.forEach(function (toastEl) {
        const toastInstance = bootstrap.Toast.getOrCreateInstance(toastEl);
        toastInstance.show();
    });
});