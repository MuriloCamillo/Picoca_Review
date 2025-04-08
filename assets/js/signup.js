/**
 * @fileoverview Validação do formulário de cadastro de usuário, 
 * incluindo nome, sobrenome, nome de usuário, email e senha. 
 * Se o formulário for enviado com sucesso, uma mensagem de sucesso é exibida.
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.formulario-cadastro form');
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('validationEmail');
    const emailConfirmInput = document.getElementById('validationEmailConfirm');
    const passwordInput = document.getElementById('validationPassword');
    const passwordConfirmInput = document.getElementById('validationPasswordConfirm');
    const termsCheckbox = document.getElementById('invalidCheck');
    const successToastElement = document.getElementById('signup-success-toast');

    /**
     * Atualiza as classes de validação de um elemento de entrada.
     * @param {HTMLElement} inputElement - Elemento de entrada a ser validado.
     * @param {boolean|null} customValidity - Validade personalizada (opcional).
     */
    function updateValidationClass(inputElement, customValidity = null) {
        if (!inputElement) return;
        const isValid = customValidity !== null ? customValidity : inputElement.checkValidity();
        if (isValid) {
            inputElement.classList.remove('is-invalid');
            inputElement.classList.add('is-valid');
        } else {
            inputElement.classList.add('is-invalid');
            inputElement.classList.remove('is-valid');
        }
    }

    if (form) {
        // Validação em tempo real
        [firstNameInput, lastNameInput, usernameInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    if (form.classList.contains('was-validated')) {
                        updateValidationClass(input);
                    }
                });
            }
        });

        // Validação de email em tempo real
        if (emailInput && emailConfirmInput) {
            [emailInput, emailConfirmInput].forEach(input => {
                input.addEventListener('input', () => {
                    if (form.classList.contains('was-validated')) {
                        const emailsMatch = emailInput.value === emailConfirmInput.value;
                        emailConfirmInput.setCustomValidity(emailsMatch ? '' : 'Os emails não correspondem.');
                        updateValidationClass(emailConfirmInput, emailsMatch);
                    }
                });
            });
        }

        // Validação de senha em tempo real
        if (passwordInput && passwordConfirmInput) {
            [passwordInput, passwordConfirmInput].forEach(input => {
                input.addEventListener('input', () => {
                    if (form.classList.contains('was-validated')) {
                        if (passwordInput.value.length < 8) {
                            passwordInput.setCustomValidity('A senha deve ter no mínimo 8 caracteres.');
                        } else {
                            passwordInput.setCustomValidity('');
                        }

                        const passwordsMatch = passwordInput.value === passwordConfirmInput.value;
                        passwordConfirmInput.setCustomValidity(passwordsMatch ? '' : 'As senhas não correspondem.');
                        
                        updateValidationClass(passwordInput);
                        updateValidationClass(passwordConfirmInput, passwordsMatch);
                    }
                });
            });
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Validações específicas
            const emailsMatch = emailInput.value === emailConfirmInput.value;
            const passwordsMatch = passwordInput.value === passwordConfirmInput.value;
            const passwordLength = passwordInput.value.length >= 8;

            emailConfirmInput.setCustomValidity(emailsMatch ? '' : 'Os emails não correspondem.');
            passwordInput.setCustomValidity(passwordLength ? '' : 'A senha deve ter no mínimo 8 caracteres.');
            passwordConfirmInput.setCustomValidity(passwordsMatch ? '' : 'As senhas não correspondem.');

            if (!form.checkValidity() || !emailsMatch || !passwordsMatch || !passwordLength) {
                event.stopPropagation();
                
                updateValidationClass(firstNameInput);
                updateValidationClass(lastNameInput);
                updateValidationClass(usernameInput);
                updateValidationClass(emailInput);
                updateValidationClass(emailConfirmInput, emailsMatch);
                updateValidationClass(passwordInput, passwordLength);
                updateValidationClass(passwordConfirmInput, passwordsMatch);
                updateValidationClass(termsCheckbox);
            } else {
                if (successToastElement) {
                    successToastElement.classList.add('show');
                    setTimeout(() => { 
                        successToastElement.classList.remove('show');
                        window.location.href = 'login.html';
                    }, 3000);
                } else {
                    console.warn("Elemento #signup-success-toast não encontrado. Usando alert.");
                    alert('Cadastro realizado com sucesso!');
                    window.location.href = 'login.html';
                }

                form.reset();
                form.classList.remove('was-validated');

                // Limpa as classes de validação
                [firstNameInput, lastNameInput, usernameInput, emailInput, 
                 emailConfirmInput, passwordInput, passwordConfirmInput, termsCheckbox].forEach(el => {
                    if(el) {
                        el.classList.remove('is-valid', 'is-invalid');
                        el.setCustomValidity('');
                    }
                });
            }

            form.classList.add('was-validated');
        });
    }
});