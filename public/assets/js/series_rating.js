/**
 * @fileoverview Gerencia o componente de avaliação por estrelas na página de detalhes da série.
 *
 * Este script controla toda a lógica do lado do cliente para o sistema de avaliação, incluindo:
 * - Efeitos visuais de hover nas estrelas para um "preview" da nota.
 * - Captura do clique do usuário para registrar uma avaliação definitiva.
 * - Envio da avaliação para o backend de forma assíncrona (usando fetch).
 * - Atualização da interface com a nova média de avaliação e contagem de votos após o sucesso.
 * - Exibição de feedback (sucesso ou erro) para o usuário.
 * - Inicialização do estado das estrelas com base na avaliação prévia do usuário (se existir).
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Seleção dos Elementos do DOM ---
    const ratingContainer = document.querySelector('.rating-container');
    if (!ratingContainer) return; // Se o componente não existir na página, encerra o script.

    const starsContainer = ratingContainer.querySelector('.stars.user-rating');
    const stars = starsContainer.querySelectorAll('i');
    const feedbackEl = document.getElementById('rating-feedback');
    const seriesId = ratingContainer.dataset.seriesId;
    const isUserLoggedIn = ratingContainer.dataset.userLoggedIn === 'true';
    
    // --- 2. Função Auxiliar de Interface (UI) ---

    /**
     * Atualiza o estado visual das estrelas (preenchidas ou vazias) com base em uma nota.
     * @param {number | string} rating A avaliação (de 1 a 5) a ser exibida visualmente.
     */
    const updateStars = (rating) => {
        const numericRating = parseInt(rating, 10);
        stars.forEach(star => {
            const starValue = parseInt(star.dataset.value, 10);
            // Preenche a estrela se o valor dela for menor ou igual à avaliação fornecida.
            if (starValue <= numericRating) {
                star.classList.remove('bi-star');
                star.classList.add('bi-star-fill');
            } else {
                star.classList.remove('bi-star-fill');
                star.classList.add('bi-star');
            }
        });
    };

    // --- 3. Listeners para Efeitos de Hover ---

    // Função para exibir mensagem de feedback
    const showFeedback = (message, type = 'danger') => {
        feedbackEl.textContent = message;
        feedbackEl.className = `d-block text-center small mt-2 text-${type}`;
        feedbackEl.style.display = 'block';
    };

    // Atualiza o comportamento do hover apenas se o usuário estiver logado
    if (isUserLoggedIn) {
        starsContainer.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'I') {
                updateStars(e.target.dataset.value);
            }
        });

        starsContainer.addEventListener('mouseout', () => {
            const currentRating = starsContainer.dataset.userRating || 0;
            updateStars(currentRating);
        });
    } else {
        // Adiciona classe para cursor não-clicável se não estiver logado
        starsContainer.classList.add('not-logged');
        // Exibe mensagem de login necessário ao passar o mouse
        starsContainer.addEventListener('mouseover', () => {
            showFeedback('Faça login para avaliar!', 'info');
        });
        starsContainer.addEventListener('mouseout', () => {
            feedbackEl.style.display = 'none';
        });
    }

    // --- 4. Listener Principal para Submissão da Avaliação ---

    starsContainer.addEventListener('click', async (e) => {
        if (!isUserLoggedIn) {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
            return;
        }
        
        const rating = parseInt(e.target.dataset.value, 10);

        try {
            // Envia a avaliação para o endpoint do backend.
            const response = await fetch(`/user/series/${seriesId}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: rating })
            });

            // Tratamento de respostas de erro do servidor.
            if (!response.ok) {
                if (response.status === 401) { // Não autenticado
                    // Redireciona para o login, mantendo a página atual como destino pós-login.
                    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                    return; // Interrompe a execução para aguardar o redirecionamento.
                }
                // Para outros erros, tenta extrair a mensagem do corpo da resposta.
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao enviar avaliação.');
            }

            const result = await response.json();
            
            // Se a operação no backend foi bem-sucedida, atualiza a UI.
            if (result.success) {
                // 1. Atualiza a avaliação do usuário no atributo data-* para referência futura.
                starsContainer.dataset.userRating = rating;
                // 2. Atualiza o visual das estrelas do usuário.
                updateStars(rating);
                // 3. Atualiza os dados da avaliação da comunidade (média e contagem de votos).
                document.getElementById('average-rating-display').textContent = result.averageRating;
                document.getElementById('vote-count-display').textContent = `${result.voteCount} ${result.voteCount === 1 ? 'voto' : 'votos'}`;
                
                // 4. Exibe uma mensagem de sucesso temporária.
                feedbackEl.textContent = 'Obrigado por avaliar!';
                feedbackEl.className = 'd-block text-center small mt-2 text-success';
                feedbackEl.style.display = 'block';
                setTimeout(() => { feedbackEl.style.display = 'none'; }, 3000);
            }

        } catch (error) {
            // Exibe uma mensagem de erro em caso de falha na requisição ou erro lançado.
            feedbackEl.textContent = error.message;
            feedbackEl.className = 'd-block text-center small mt-2 text-danger';
            feedbackEl.style.display = 'block';
        }
    });

    // --- 5. Inicialização do Componente ---
    // Define o estado inicial das estrelas com base na avaliação que o usuário já
    // pode ter feito, cujo valor é passado pelo servidor no atributo 'data-user-rating'.
    updateStars(starsContainer.dataset.userRating || 0);
});