// public/assets/js/signup_client_validation.js (Adaptado do seu signup.js original)
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".formulario-cadastro form.needs-validation"); // Ajuste o seletor se necessário

    if (!form) return;

    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("validationEmail");
    const emailConfirmInput = document.getElementById("validationEmailConfirm");
    const passwordInput = document.getElementById("validationPassword");
    const passwordConfirmInput = document.getElementById("validationPasswordConfirm");
    const termsCheckbox = document.getElementById("invalidCheck");
    // const successToastElement = document.getElementById("signup-success-toast"); // Removido, toast é backend/navbar

    function updateValidationClass(inputElement, isValid) {
        if (!inputElement) return;
        if (isValid) {
            inputElement.classList.remove("is-invalid");
            inputElement.classList.add("is-valid");
        } else {
            inputElement.classList.add("is-invalid");
            inputElement.classList.remove("is-valid");
        }
    }
    
    // Função para validar se as senhas coincidem
    function validatePasswordConfirmation() {
        if (passwordInput && passwordConfirmInput) {
            const passwordsMatch = passwordInput.value === passwordConfirmInput.value;
            if (passwordInput.value && passwordConfirmInput.value) { // Só valida se ambos os campos têm algo
                 if (passwordsMatch) {
                    passwordConfirmInput.setCustomValidity("");
                    updateValidationClass(passwordConfirmInput, true);
                } else {
                    passwordConfirmInput.setCustomValidity("As senhas não correspondem.");
                    updateValidationClass(passwordConfirmInput, false);
                }
            } else if (form.classList.contains("was-validated")) { // Se o form já foi validado e um campo está vazio
                 passwordConfirmInput.setCustomValidity(passwordConfirmInput.value ? "" : "Confirme sua senha.");
                 updateValidationClass(passwordConfirmInput, !!passwordConfirmInput.value);
            }
             return passwordsMatch;
        }
        return true; // Se os campos não existem, não há o que validar aqui
    }

    // Função para validar se os emails coincidem
    function validateEmailConfirmation() {
        if (emailInput && emailConfirmInput) {
            const emailsMatch = emailInput.value === emailConfirmInput.value;
             if (emailInput.value && emailConfirmInput.value) {
                if (emailsMatch) {
                    emailConfirmInput.setCustomValidity("");
                    updateValidationClass(emailConfirmInput, true);
                } else {
                    emailConfirmInput.setCustomValidity("Os emails não correspondem.");
                    updateValidationClass(emailConfirmInput, false);
                }
            } else if (form.classList.contains("was-validated")) {
                 emailConfirmInput.setCustomValidity(emailConfirmInput.value ? "" : "Confirme seu email.");
                 updateValidationClass(emailConfirmInput, !!emailConfirmInput.value);
            }
            return emailsMatch;
        }
        return true;
    }

    if (passwordConfirmInput) {
        passwordConfirmInput.addEventListener('input', validatePasswordConfirmation);
    }
    if (passwordInput) { // Revalida confirmação quando senha principal muda
        passwordInput.addEventListener('input', () => {
            if (passwordInput.value.length >= 8) {
                passwordInput.setCustomValidity("");
                updateValidationClass(passwordInput, true);
            } else if (form.classList.contains('was-validated')) {
                passwordInput.setCustomValidity("A senha deve ter no mínimo 8 caracteres.");
                updateValidationClass(passwordInput, false);
            }
            validatePasswordConfirmation(); // Revalida a confirmação
        });
    }
    if (emailConfirmInput) {
        emailConfirmInput.addEventListener('input', validateEmailConfirmation);
    }
     if (emailInput) { // Revalida confirmação quando email principal muda
        emailInput.addEventListener('input', validateEmailConfirmation);
    }


    form.addEventListener("submit", function (event) {
        const isPasswordConfirmed = validatePasswordConfirmation();
        const isEmailConfirmed = validateEmailConfirmation();

        // A validação do Bootstrap (form.checkValidity()) cuida dos 'required', 'minlength', 'pattern', etc.
        if (!form.checkValidity() || !isPasswordConfirmed || !isEmailConfirmed) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        // Atualiza classes visuais para todos os campos após tentativa de submit
        // O Bootstrap faz isso automaticamente se 'novalidate' está no form e 'was-validated' é adicionado
        [firstNameInput, lastNameInput, usernameInput, emailInput, passwordInput, termsCheckbox].forEach(input => {
            if(input) updateValidationClass(input, input.checkValidity());
        });
        validateEmailConfirmation(); // Força atualização visual da confirmação de email
        validatePasswordConfirmation(); // Força atualização visual da confirmação de senha

        form.classList.add("was-validated");
        // NENHUMA lógica de localStorage, autenticação ou redirecionamento aqui.
        // O formulário será enviado para o backend (action="/signup" method="POST").
        // O toast de sucesso será exibido pela navbar/EJS com base em query param do backend.
    });
});