// assets/js/login_handler.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.formulario-login form');
    const emailInput = document.getElementById('loginEmailInput');
    const passwordInput = document.getElementById('loginPasswordInput');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const generalErrorMessage = document.getElementById('login-error-message'); // Para falha de login

    // --- Função para mostrar erro de um campo específico ---
    function showError(inputElement, errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible'); // Mostra a mensagem (requer CSS)
        }
        if (inputElement) {
            inputElement.setAttribute('aria-invalid', 'true'); // Melhora acessibilidade
        }
    }

    // --- Função para limpar erro de um campo específico ---
    function clearError(inputElement, errorElement) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('visible'); // Esconde a mensagem
        }
        if (inputElement) {
            inputElement.removeAttribute('aria-invalid');
        }
    }

    // --- Validação no Submit ---
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            let isFormValid = true; // Flag para verificar validade geral

            // Limpa erros gerais e específicos antigos
            if (generalErrorMessage) {
                 generalErrorMessage.textContent = '';
                 generalErrorMessage.classList.remove('login-error-active'); // Usa a classe do CSS
            }
            clearError(emailInput, emailError);
            clearError(passwordInput, passwordError);

            // 1. Validar Email usando Constraint Validation API
            if (!emailInput || !emailInput.validity.valid) { // Verifica se existe e se é valido
                isFormValid = false;
                if (!emailInput) { // Se o elemento não existe
                     console.error("Campo de Email não encontrado");
                     // Poderia mostrar um erro geral aqui
                } else if (emailInput.validity.valueMissing) {
                    showError(emailInput, emailError, 'O campo Email é obrigatório.');
                } else if (emailInput.validity.typeMismatch) {
                    showError(emailInput, emailError, 'Por favor, insira um endereço de email válido.');
                } else {
                    showError(emailInput, emailError, 'Erro no campo Email.'); // Mensagem genérica
                }
            }

            // 2. Validar Senha (apenas se é obrigatória)
            if (!passwordInput || !passwordInput.validity.valid) { // Verifica se existe e se é valido
                isFormValid = false;
                 if (!passwordInput) {
                     console.error("Campo de Senha não encontrado");
                 } else if (passwordInput.validity.valueMissing) {
                    showError(passwordInput, passwordError, 'O campo Senha é obrigatório.');
                } else {
                     showError(passwordInput, passwordError, 'Erro no campo Senha.'); // Mensagem genérica
                     // Poderia adicionar validação de minlength aqui se o atributo estivesse no HTML
                     // Ex: else if (passwordInput.validity.tooShort) { showError(...) }
                }
            }

            // 3. Se o formulário NÃO for válido com base nas regras do HTML5, interrompe
            if (!isFormValid) {
                console.log("Formulário inválido. Verifique os campos.");
                return; // Não prossegue para a verificação de credenciais
            }

            // --- Se chegou aqui, a validação básica passou ---
            // --- Prossegue com a verificação de credenciais (fixas) ---

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            // Lógica de Autenticação Fictícia (substitua no futuro)
            if (email === 'teste@teste' && password === 'teste') {
                // Login OK
                console.log('Login bem-sucedido para:', email);
                localStorage.setItem('loggedInUser', 'teste'); // Armazena usuário logado

                // *** Define o sinalizador para mostrar o toast na próxima página ***
                localStorage.setItem('showLoginSuccessToast', 'true');

                // Redireciona para a página principal
                window.location.href = 'index.html';

            } else {
                // Login Falhou (credenciais incorretas)
                console.log('Tentativa de login falhou (credenciais inválidas) para:', email);
                if (generalErrorMessage) {
                    generalErrorMessage.textContent = 'Email ou senha inválidos.';
                    generalErrorMessage.classList.add('login-error-active'); // Mostra erro geral
                } else {
                    alert("Email ou senha inválidos!"); // Fallback
                }
                // Opcional: Marcar os campos como inválidos novamente pode ser redundante aqui
                // já que o erro não é de formato, mas sim de combinação.
                // showError(emailInput, emailError, ' '); // Marca visual sem texto
                // showError(passwordInput, passwordError, ' ');
            }
        });

        // --- Opcional: Limpar erros individuais enquanto o usuário digita ---
        [emailInput, passwordInput].forEach(input => {
             if(input){ // Verifica se o input realmente existe antes de adicionar listener
                input.addEventListener('input', () => {
                    // Encontra o elemento de erro correspondente
                    const errorElement = document.getElementById(input.id === 'loginEmailInput' ? 'email-error' : 'password-error');
                    // Se o campo se tornar válido enquanto digita, limpa o erro específico
                    if (input.validity.valid) {
                        clearError(input, errorElement);
                    }
                    // Limpa o erro geral de "credenciais inválidas" ao começar a digitar novamente
                     if (generalErrorMessage) {
                        generalErrorMessage.textContent = '';
                        generalErrorMessage.classList.remove('login-error-active');
                     }
                });
            }
        });

    } else {
        console.error("Formulário de login ('form' dentro de '.formulario-login') não encontrado na página login.html.");
    }
});