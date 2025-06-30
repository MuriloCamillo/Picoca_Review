/**
 * @fileoverview Gerencia a interatividade do usuário na página de detalhes da série.
 *
 * Este script controla as ações de adicionar/remover uma série da 'Watchlist' ou da
 * 'Likelist'. Ele envia requisições assíncronas (fetch) para o backend, processa
 * a resposta e atualiza a interface do botão (cor, texto, estado) dinamicamente,
 * sem a necessidade de recarregar a página.
 *
 * @requires O HTML deve conter botões com a classe `.action-btn-dynamic` e os atributos
 * `data-series-id` e `data-list-type` para que a comunicação com o backend funcione.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os botões de ação.
    const actionButtons = document.querySelectorAll('.action-btn-dynamic');
    // Elemento para exibir mensagens de feedback para o usuário (sucesso ou erro).
    const feedbackSpan = document.getElementById('series-action-feedback');

    actionButtons.forEach(button => {
        button.addEventListener('click', async () => {
            // --- 1. Coleta de Dados do Botão ---
            const seriesId = button.dataset.seriesId;
            const listType = button.dataset.listType; // 'watchlist' ou 'likelist'
            const buttonTextSpan = button.querySelector('.button-text');

            // Validação para garantir que o botão está configurado corretamente no HTML.
            if (!seriesId || !listType || !buttonTextSpan) {
                console.error('Botão de ação mal configurado. Faltam atributos data-* ou o span de texto.', button);
                return;
            }

            // --- 2. Preparação da Interface (Feedback de Carregamento) ---
            if (feedbackSpan) {
                feedbackSpan.textContent = '';
                feedbackSpan.style.display = 'none'; // Limpa feedback anterior.
            }
            
            // Desabilita o botão e mostra um texto de "carregando" para evitar cliques duplos.
            const originalButtonText = buttonTextSpan.textContent;
            buttonTextSpan.textContent = 'Aguarde...';
            button.disabled = true;

            // --- 3. Requisição Assíncrona para o Servidor ---
            try {
                // Envia uma requisição POST para o endpoint apropriado no backend.
                // O `userSeriesController` no servidor irá processar esta requisição.
                const response = await fetch(`/user/series/${seriesId}/${listType}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                });

                // Reativa o botão independentemente do resultado.
                buttonTextSpan.textContent = originalButtonText;
                button.disabled = false;

                // --- 4. Tratamento da Resposta do Servidor ---
                if (!response.ok) {
                    // Caso o usuário não esteja logado (status 401 Unauthorized).
                    if (response.status === 401) {
                        // Redireciona para a página de login, passando a URL atual
                        // para que o usuário retorne após se autenticar.
                        const currentPath = window.location.pathname + window.location.search;
                        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}&error=${encodeURIComponent('Você precisa estar logado para realizar esta ação.')}`;
                        return;
                    }
                    // Para outros erros HTTP, tenta extrair a mensagem de erro do corpo da resposta.
                    const errorResult = await response.json().catch(() => null);
                    const errorMessage = errorResult?.message || `Erro na requisição: ${response.status}`;
                    throw new Error(errorMessage);
                }

                const result = await response.json();

                // --- 5. Atualização da Interface com Base no Sucesso ---
                if (result.success) {
                    // Alterna o estado visual do botão para refletir a nova condição (adicionado/removido).
                    button.classList.toggle('active', result.action === 'added');

                    // Atualiza as classes de estilo e o texto do botão.
                    if (listType === 'watchlist') {
                        button.classList.toggle('btn-info', result.action === 'added');
                        button.classList.toggle('text-white', result.action === 'added');
                        button.classList.toggle('btn-outline-info', result.action === 'removed');
                        buttonTextSpan.textContent = result.action === 'added' ? 'Na Watchlist' : 'Watchlist';
                    } else if (listType === 'likelist') {
                        button.classList.toggle('btn-danger', result.action === 'added');
                        button.classList.toggle('text-white', result.action === 'added');
                        button.classList.toggle('btn-outline-danger', result.action === 'removed');
                        buttonTextSpan.textContent = result.action === 'added' ? 'Gostei!' : 'Gostei';
                    }

                    // Exibe uma mensagem de sucesso temporária.
                    if (feedbackSpan) {
                        feedbackSpan.textContent = result.message;
                        feedbackSpan.className = 'ms-2 text-success small';
                        feedbackSpan.style.display = 'inline';
                        setTimeout(() => { feedbackSpan.style.display = 'none'; }, 3000);
                    }
                } else {
                    // Se a operação falhou no backend (success: false), exibe a mensagem de erro.
                    throw new Error(result.message || 'Ocorreu um erro no servidor.');
                }
            } catch (error) {
                // --- 6. Tratamento de Erros de Conexão ou Falhas na Requisição ---
                console.error('Erro ao interagir com a lista:', error);
                buttonTextSpan.textContent = originalButtonText; // Restaura o botão em caso de erro.
                button.disabled = false;
                if (feedbackSpan) {
                    feedbackSpan.textContent = error.message || 'Erro de conexão. Tente novamente.';
                    feedbackSpan.className = 'ms-2 text-danger small';
                    feedbackSpan.style.display = 'inline';
                }
            }
        });
    });
});