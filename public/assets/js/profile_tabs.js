/**
 * @fileoverview Ativa a aba correta na página de perfil com base no hash da URL.
 *
 * Este script permite o "deep linking" para abas específicas (ex: /profile#password-content-pane). 
 * Redireciona o usuário à aba correta após uma submissão de formulário
 * que recarrega a página (como ao alterar a senha ou o avatar).
 *
 * @requires A estrutura HTML da página de perfil deve seguir o padrão do Bootstrap para abas:
 * - Os botões que acionam as abas devem ter um atributo `data-bs-target`.
 * - O valor de `data-bs-target` deve ser o ID do painel da aba, prefixado com '#'.
 * - Este mesmo ID (sem o '#') deve ser usado como o hash na URL.
 * - Exemplo: URL `/profile#avatar-content-pane` ativa o botão com `data-bs-target="#avatar-content-pane"`.
 */
document.addEventListener("DOMContentLoaded", function() {
    // 1. Obtém o fragmento (hash) da URL atual. Ex: '#password-content-pane'.
    const hash = window.location.hash;

    // 2. Prossegue apenas se um hash (#) estiver presente na URL.
    if (hash) {
        // 3. Tenta encontrar o elemento <button> que controla a aba correspondente ao hash.
        // A seleção é feita de forma segura pelo atributo `data-bs-target`, que deve
        // corresponder exatamente ao hash lido da URL.
        const tabTrigger = document.querySelector(`.nav-tabs button[data-bs-target="${hash}"]`);

        // 4. Se um botão correspondente for encontrado, ativa sua respectiva aba.
        if (tabTrigger) {
            // Verifica se o componente Tab do Bootstrap está carregado no objeto global.
            if (typeof bootstrap !== 'undefined' && bootstrap.Tab) {
                // Cria uma instância do componente Tab do Bootstrap para o botão encontrado.
                const tab = new bootstrap.Tab(tabTrigger);
                // Exibe a aba programaticamente.
                tab.show();
            } else {
                console.warn('Componente Tab do Bootstrap não encontrado. A aba não pôde ser ativada via URL.');
            }
        }
    }
});