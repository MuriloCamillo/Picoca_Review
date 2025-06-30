/**
 * @fileoverview Manipula a validação do lado do cliente para o formulário de login.
 * Este script integra-se com o sistema de validação do Bootstrap para fornecer
 * feedback visual ao usuário (ex: campos obrigatórios).
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- Seleção do Formulário ---
    const loginForm = document.querySelector('.formulario-login form.needs-validation');

    // Se o formulário de login não for encontrado na página, o script não faz nada.
    if (!loginForm) {
        return;
    }

    // --- Validação no Envio (Submit) ---
    loginForm.addEventListener('submit', (event) => {
        // Utiliza o método checkValidity() do HTML5 para verificar se todos os
        // campos com restrições (ex: 'required') estão preenchidos corretamente.
        if (!loginForm.checkValidity()) {
            // Se o formulário for inválido, previne o envio para o servidor.
            event.preventDefault();
            event.stopPropagation();
        }

        // Adiciona a classe 'was-validated' para que o Bootstrap exiba os estilos
        // de feedback nos campos do formulário.
        loginForm.classList.add('was-validated');
    });

    const emailInput = document.getElementById('loginEmailInput');
    const passwordInput = document.getElementById('loginPasswordInput');

    [emailInput, passwordInput].forEach(input => {
        if (input) {
            // Adiciona um listener para o evento 'input'.
            input.addEventListener('input', () => {
                // Se o formulário já foi submetido uma vez (e contém a classe 'was-validated'),
                // remove o feedback de erro/sucesso do campo atual.
                if (loginForm.classList.contains('was-validated')) {
                    input.classList.remove('is-invalid', 'is-valid');
                }
            });
        }
    });
});