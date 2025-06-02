// public/assets/js/login_handler.js (Adaptado)
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.formulario-login form.needs-validation'); // Ajuste o seletor se necessário ao seu login.html/ejs

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            // A validação HTML5 (com 'required') e a estilização do Bootstrap
            // já fornecem feedback visual.
            // Esta verificação adicional é para garantir que o Bootstrap adicione suas classes.
            if (!loginForm.checkValidity()) {
                event.preventDefault(); // Impede o envio do formulário se a validação do HTML5/Bootstrap falhar
                event.stopPropagation();
            }
            loginForm.classList.add('was-validated');
            // NENHUMA lógica de localStorage, autenticação ou redirecionamento aqui.
            // O formulário será enviado para o backend (action="/login" method="POST").
        });

        // Limpar feedback de erro ao digitar (opcional, mas melhora UX)
        const emailInput = document.getElementById('loginEmailInput');
        const passwordInput = document.getElementById('loginPasswordInput');
        const generalErrorMessage = document.querySelector('.alert-danger'); // Se houver um local específico para erros gerais do backend

        [emailInput, passwordInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    if (loginForm.classList.contains('was-validated')) {
                        // Remove 'is-invalid' e 'is-valid' para permitir nova validação no submit
                         input.classList.remove('is-invalid', 'is-valid');
                    }
                    if (generalErrorMessage && generalErrorMessage.style.display !== 'none') {
                        // Esconde a mensagem de erro do backend ao começar a digitar
                        // generalErrorMessage.style.display = 'none'; // Ou remova o alerta se preferir
                    }
                });
            }
        });
    }
});