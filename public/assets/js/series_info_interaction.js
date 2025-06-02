// public/assets/js/series_info_interaction.js
document.addEventListener('DOMContentLoaded', () => {
    const actionButtons = document.querySelectorAll('.action-btn-dynamic');
    const feedbackSpan = document.getElementById('series-action-feedback');

    actionButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const seriesId = button.dataset.seriesId;
            const listType = button.dataset.listType;
            const buttonTextSpan = button.querySelector('.button-text');

            if (!seriesId || !listType || !buttonTextSpan) {
                console.error('Botão de ação mal configurado:', button);
                return;
            }

            if (feedbackSpan) { // Limpa feedback anterior e esconde
                feedbackSpan.textContent = '';
                feedbackSpan.style.display = 'none';
            }
            
            // Adiciona um feedback visual de "carregando"
            const originalButtonText = buttonTextSpan.textContent;
            buttonTextSpan.textContent = 'Aguarde...';
            button.disabled = true;

            try {
                const response = await fetch(`/user/series/${seriesId}/${listType}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Futuramente, adicionar CSRF token aqui se implementado
                    },
                });

                buttonTextSpan.textContent = originalButtonText; // Restaura texto original
                button.disabled = false; // Reabilita botão

                if (!response.ok) {
                    if (response.status === 401) { // Não autenticado
                        // Tenta pegar a URL da página atual para redirecionamento pós-login
                        const currentPath = window.location.pathname + window.location.search;
                        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}&error=${encodeURIComponent('Você precisa estar logado para adicionar à lista.')}`;
                        return;
                    }
                    // Tenta pegar uma mensagem de erro do backend
                    const errorResult = await response.json().catch(() => null);
                    const errorMessage = errorResult?.message || `Erro na requisição: ${response.status}`;
                    throw new Error(errorMessage);
                }

                const result = await response.json();

                if (result.success) {
                    button.classList.toggle('active'); // Adiciona/remove classe 'active'
                    // Atualiza classes de cor e texto do botão
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

                    if (feedbackSpan) {
                        feedbackSpan.textContent = result.message;
                        feedbackSpan.className = 'ms-2 text-success small'; // Usando 'small' para feedback discreto
                        feedbackSpan.style.display = 'inline';
                        setTimeout(() => { feedbackSpan.style.display = 'none'; }, 3000); // Esconde após 3s
                    }
                } else {
                     if (feedbackSpan) {
                        feedbackSpan.textContent = result.message || 'Ocorreu um erro.';
                        feedbackSpan.className = 'ms-2 text-danger small';
                        feedbackSpan.style.display = 'inline';
                    }
                }
            } catch (error) {
                console.error('Erro ao interagir com a lista:', error);
                buttonTextSpan.textContent = originalButtonText; // Restaura em caso de erro
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