document.addEventListener('DOMContentLoaded', () => {
    const ratingContainer = document.querySelector('.rating-container');
    if (!ratingContainer) return;

    const starsContainer = ratingContainer.querySelector('.stars.user-rating');
    const stars = starsContainer.querySelectorAll('i');
    const feedbackEl = document.getElementById('rating-feedback');
    const seriesId = ratingContainer.dataset.seriesId;

    const updateStars = (rating) => {
        stars.forEach(star => {
            const starValue = parseInt(star.dataset.value, 10);
            if (starValue <= rating) {
                star.classList.remove('bi-star');
                star.classList.add('bi-star-fill');
            } else {
                star.classList.remove('bi-star-fill');
                star.classList.add('bi-star');
            }
        });
    };

    starsContainer.addEventListener('mouseover', (e) => {
        if (e.target.tagName === 'I') {
            updateStars(e.target.dataset.value);
        }
    });

    starsContainer.addEventListener('mouseout', () => {
        const currentRating = starsContainer.dataset.userRating || 0;
        updateStars(currentRating);
    });

    starsContainer.addEventListener('click', async (e) => {
        if (e.target.tagName !== 'I') return;
        
        const rating = parseInt(e.target.dataset.value, 10);

        try {
            const response = await fetch(`/user/series/${seriesId}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: rating })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao enviar avaliação.');
            }

            const result = await response.json();
            
            if (result.success) {
                // Atualiza o estado visual com os novos dados
                starsContainer.dataset.userRating = rating;
                updateStars(rating);
                document.getElementById('average-rating-display').textContent = result.averageRating;
                document.getElementById('vote-count-display').textContent = `${result.voteCount} ${result.voteCount === 1 ? 'voto' : 'votos'}`;
                
                // Mostra feedback de sucesso
                feedbackEl.textContent = 'Obrigado por avaliar!';
                feedbackEl.className = 'd-block text-center small mt-2 text-success';
                feedbackEl.style.display = 'block';
                setTimeout(() => { feedbackEl.style.display = 'none'; }, 3000);
            }

        } catch (error) {
            feedbackEl.textContent = error.message;
            feedbackEl.className = 'd-block text-center small mt-2 text-danger';
            feedbackEl.style.display = 'block';
        }
    });

    // Inicializa as estrelas com a avaliação do usuário ao carregar a página
    updateStars(starsContainer.dataset.userRating || 0);
});