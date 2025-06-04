// public/assets/js/profile_tabs.js
document.addEventListener("DOMContentLoaded", function() {
    const hash = window.location.hash;
    if (hash) {
        // Os IDs dos botões de aba no seu profile.ejs são 'profile-tab', 'password-tab', 'avatar-tab'
        // Os IDs dos painéis de conteúdo são 'profile-content-pane', 'password-content-pane', 'avatar-content-pane'
        // O data-bs-target nos botões deve corresponder aos IDs dos painéis precedidos por #
        const tabTrigger = document.querySelector(`.nav-tabs button[data-bs-target="${hash}"]`);
        if (tabTrigger) {
            if (typeof bootstrap !== 'undefined' && bootstrap.Tab) {
                const tab = new bootstrap.Tab(tabTrigger);
                tab.show();
            } else {
                console.warn('Componente Tab do Bootstrap não encontrado.');
            }
        }
    }
});