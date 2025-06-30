/**
 * @fileoverview Gerencia a validação do lado do cliente para o formulário de cadastro.
 *
 * Este script é responsável por validar os campos do formulário de registro em tempo real,
 * incluindo a verificação de campos obrigatórios, o comprimento mínimo da senha e a
 * confirmação de que os campos de e-mail e senha coincidem. Ele utiliza as classes
 * de validação do Bootstrap para fornecer feedback visual imediato ao usuário.
 *
 */
document.addEventListener("DOMContentLoaded", function () {
    // --- 1. Seleção dos Elementos do DOM ---
    const form = document.querySelector(".formulario-cadastro form.needs-validation");
    if (!form) return; // Interrompe o script se o formulário não for encontrado.

    const emailInput = document.getElementById("validationEmail");
    const emailConfirmInput = document.getElementById("validationEmailConfirm");
    const passwordInput = document.getElementById("validationPassword");
    const passwordConfirmInput = document.getElementById("validationPasswordConfirm");
    // Seleciona outros campos para validação geral no submit.
    const allInputs = [
        document.getElementById("firstName"),
        document.getElementById("lastName"),
        document.getElementById("username"),
        emailInput, emailConfirmInput, passwordInput, passwordConfirmInput,
        document.getElementById("invalidCheck")
    ].filter(Boolean); // .filter(Boolean) remove quaisquer elementos nulos caso um ID não seja encontrado.

    /**
     * Atualiza as classes de validação do Bootstrap (.is-valid, .is-invalid) em um campo.
     * @param {HTMLElement} inputElement O campo do formulário a ser atualizado.
     * @param {boolean} isValid O estado de validade do campo.
     */
    function updateValidationClass(inputElement, isValid) {
        if (!inputElement) return;
        inputElement.classList.toggle('is-valid', isValid);
        inputElement.classList.toggle('is-invalid', !isValid);
    }
    
    /**
     * Valida se os campos de senha e confirmação de senha correspondem.
     * Fornece feedback em tempo real para o usuário.
     */
    function validatePasswordConfirmation() {
        if (!passwordInput || !passwordConfirmInput) return true;
        
        const passwordsMatch = passwordInput.value === passwordConfirmInput.value;
        // Apenas valida se ambos os campos estão preenchidos, para não mostrar erro cedo demais.
        if (passwordInput.value && passwordConfirmInput.value) {
            passwordConfirmInput.setCustomValidity(passwordsMatch ? "" : "As senhas não correspondem.");
            updateValidationClass(passwordConfirmInput, passwordsMatch);
        }
    }

    /**
     * Valida se os campos de e-mail e confirmação de e-mail correspondem.
     * Fornece feedback em tempo real para o usuário.
     */
    function validateEmailConfirmation() {
        if (!emailInput || !emailConfirmInput) return true;

        const emailsMatch = emailInput.value === emailConfirmInput.value;
        if (emailInput.value && emailConfirmInput.value) {
            emailConfirmInput.setCustomValidity(emailsMatch ? "" : "Os emails não correspondem.");
            updateValidationClass(emailConfirmInput, emailsMatch);
        }
    }

    // --- 2. Adição dos Listeners de Evento ---

    // Valida a confirmação sempre que o campo de confirmação ou o campo principal for alterado.
    if (passwordConfirmInput) passwordConfirmInput.addEventListener('input', validatePasswordConfirmation);
    if (emailConfirmInput) emailConfirmInput.addEventListener('input', validateEmailConfirmation);
    if (emailInput) emailInput.addEventListener('input', validateEmailConfirmation);

    // Valida o comprimento da senha e a confirmação em tempo real.
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            const meetsLength = passwordInput.value.length >= 8;
            passwordInput.setCustomValidity(meetsLength ? "" : "A senha deve ter no mínimo 8 caracteres.");
            updateValidationClass(passwordInput, meetsLength);
            // Revalida o campo de confirmação, pois a senha principal mudou.
            validatePasswordConfirmation();
        });
    }

    // --- 3. Lógica de Submissão do Formulário ---
    form.addEventListener("submit", function (event) {
        // Roda todas as validações customizadas uma última vez antes de decidir se o formulário pode ser enviado.
        validatePasswordConfirmation();
        validateEmailConfirmation();
        if (passwordInput) {
            updateValidationClass(passwordInput, passwordInput.value.length >= 8);
        }

        // `checkValidity()` verifica todas as regras de validação nativas (required, pattern, etc.)
        // e as customizadas (setCustomValidity).
        if (!form.checkValidity()) {
            event.preventDefault(); // Impede o envio do formulário se for inválido.
            event.stopPropagation();
        }
        
        // Adiciona a classe 'was-validated' para que o Bootstrap exiba todos os feedbacks de erro/sucesso.
        form.classList.add("was-validated");

        // Atualiza o estado visual de todos os campos após a tentativa de submissão.
        allInputs.forEach(input => {
            if (input) updateValidationClass(input, input.checkValidity());
        });
    });
});