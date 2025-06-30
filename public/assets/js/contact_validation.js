/**
 * @fileoverview Gerencia a validação do lado do cliente para o formulário de contato.
 * Inclui:
 * - Validação em tempo real.
 * - Formatação e validação de máscara para campos de CPF e Telefone.
 * - Validação de campos obrigatórios e de formato (e-mail).
 * - Feedback visual para o usuário usando as classes do Bootstrap.
 * - Simulação do envio e exibição de uma notificação de sucesso.
 */
document.addEventListener("DOMContentLoaded", function () {
    // --- Seleção dos Elementos do DOM ---
    const form = document.querySelector(".needs-validation");
    const cpfInput = document.getElementById("cpf");
    const cpfFeedback = document.getElementById("cpf-feedback");
    const phoneInput = document.getElementById("contactPhone");
    const phoneFeedback = document.getElementById("phone-feedback");
    const fullNameInput = document.getElementById("contactFullName");
    const emailInput = document.getElementById("contactEmail");
    const messageInput = document.getElementById("contactMessage");
    const successToastElement = document.getElementById("contact-success-toast");

    if (!form) {
        // Se o formulário não estiver na página, interrompe a execução do script.
        return;
    }

    /**
     * Atualiza as classes de validação do Bootstrap (.is-valid, .is-invalid) em um elemento de input.
     * @param {HTMLElement} inputElement O campo do formulário a ser atualizado.
     * @param {boolean|null} isValidOverride Permite forçar um estado de validação (true ou false). Se nulo, usa a validação padrão do navegador.
     */
    function updateValidationClass(inputElement, isValidOverride = null) {
        if (!inputElement) return;

        const isValid = isValidOverride !== null ? isValidOverride : inputElement.checkValidity();
        
        if (isValid) {
            inputElement.classList.remove("is-invalid");
            inputElement.classList.add("is-valid");
        } else {
            inputElement.classList.add("is-invalid");
            inputElement.classList.remove("is-valid");
        }
    }

    // --- Validação e Formatação do CPF ---
    if (cpfInput) {
        // Aplica a máscara de CPF (###.###.###-##) enquanto o usuário digita.
        cpfInput.addEventListener("input", function (e) {
            let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
            if (value.length > 11) value = value.substring(0, 11);

            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
            
            // Limpa qualquer erro de validação customizado anterior ao digitar.
            cpfInput.setCustomValidity("");
        });

        // Valida o CPF quando o usuário sai do campo.
        cpfInput.addEventListener("blur", () => {
            const isValid = validarCPF(cpfInput.value);
            updateValidationClass(cpfInput, isValid);
            cpfInput.setCustomValidity(isValid ? "" : "CPF inválido.");
            if (cpfFeedback) {
                cpfFeedback.textContent = isValid ? "" : "Por favor, insira um CPF válido.";
            }
        });
    }

    /**
     * Valida um número de CPF com base no algoritmo de verificação.
     * @param {string} cpf O CPF a ser validado (pode conter máscara).
     * @returns {boolean} Retorna true se o CPF for válido, caso contrário, false.
     */
    function validarCPF(cpf) {
        if (!cpf) return false;
        cpf = cpf.replace(/[^\d]+/g, ''); // Remove máscara
        
        // Verifica o tamanho e se todos os dígitos são iguais (ex: 111.111.111-11)
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        
        let soma = 0, resto;
        
        // Validação do primeiro dígito verificador
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        
        soma = 0;
        // Validação do segundo dígito verificador
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
        
        return true;
    }

    // --- Validação e Formatação do Telefone ---
    if (phoneInput) {
        // Aplica a máscara de telefone (XX) XXXXX-XXXX enquanto o usuário digita.
        phoneInput.addEventListener("input", (e) => {
            e.target.value = formatPhoneNumber(e.target.value);
            phoneInput.setCustomValidity("");
        });

        // Valida o telefone quando o usuário sai do campo.
        phoneInput.addEventListener("blur", () => {
            const isValid = validatePhoneNumber(phoneInput);
            updateValidationClass(phoneInput, isValid);
            if (!isValid) {
                phoneInput.setCustomValidity("Telefone inválido.");
                if (phoneFeedback) {
                    const phoneValue = phoneInput.value.replace(/\D/g, "");
                    phoneFeedback.textContent = (phoneValue.length === 0 && phoneInput.hasAttribute('required'))
                        ? "Este campo é obrigatório."
                        : "Formato inválido. Use DDD + 8 ou 9 dígitos.";
                }
            } else {
                phoneInput.setCustomValidity("");
            }
        });
    }

    /**
     * Formata um número de telefone com a máscara padrão brasileira.
     * @param {string} value O número de telefone a ser formatado.
     * @returns {string} O número de telefone formatado.
     */
    function formatPhoneNumber(value) {
        if (!value) return "";
        value = value.replace(/\D/g, "").substring(0, 11); // Remove não-dígitos e limita o tamanho

        if (value.length > 10) return value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3"); // Celular com 9 dígitos
        if (value.length > 6) return value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3"); // Fixo
        if (value.length > 2) return value.replace(/^(\d{2})(\d*)$/, "($1) $2");
        return value.replace(/^(\d*)$/, "($1");
    }

    /**
     * Verifica se um número de telefone é válido (comprimento de 10 ou 11 dígitos).
     * @param {HTMLInputElement} phoneInputElement O elemento de input do telefone.
     * @returns {boolean} True se o telefone for válido, senão false.
     */
    function validatePhoneNumber(phoneInputElement) {
        if (!phoneInputElement) return true;
        const phoneValue = phoneInputElement.value.replace(/\D/g, "");
        
        // Se não for obrigatório e estiver vazio, é válido.
        if (!phoneInputElement.hasAttribute("required") && phoneValue.length === 0) return true;
        
        // Se for obrigatório e estiver vazio, é inválido.
        if (phoneInputElement.hasAttribute("required") && phoneValue.length === 0) return false;

        // Se estiver preenchido, deve ter 10 ou 11 dígitos.
        return phoneValue.length >= 10 && phoneValue.length <= 11;
    }

    // --- Validação para Campos de Texto Padrão ---
    [fullNameInput, emailInput, messageInput].forEach((input) => {
        if (input) {
            // Valida o campo quando o usuário tira o foco, para feedback imediato.
            input.addEventListener("blur", () => updateValidationClass(input));
            // Limpa o estado de erro ao digitar novamente.
            input.addEventListener("input", () => {
                if (input.classList.contains('is-invalid')) {
                    input.setCustomValidity("");
                }
            });
        }
    });

    // --- Lógica de Submissão do Formulário ---
    form.addEventListener("submit", function (event) {
        // Previne o envio padrão do formulário para realizar a validação completa via JS.
        event.preventDefault();
        event.stopPropagation();

        let isFormValid = true;
        let firstInvalidField = null;

        // Executa todas as validações novamente no momento do envio.
        const allInputs = [fullNameInput, emailInput, messageInput, cpfInput, phoneInput];
        allInputs.forEach(input => {
            if (input) {
                let isInputValid = true;
                if (input === cpfInput) {
                    isInputValid = validarCPF(input.value);
                } else if (input === phoneInput) {
                    isInputValid = validatePhoneNumber(input);
                } else {
                    isInputValid = input.checkValidity();
                }

                updateValidationClass(input, isInputValid);
                if (!isInputValid) {
                    isFormValid = false;
                    if (!firstInvalidField) firstInvalidField = input;
                }
            }
        });
        
        // Adiciona a classe do Bootstrap para exibir os feedbacks de validação.
        form.classList.add("was-validated");

        if (!isFormValid) {
            console.log("Formulário de contato contém erros.");
            // Foca no primeiro campo inválido para melhorar a acessibilidade.
            if (firstInvalidField) firstInvalidField.focus();
            return;
        }
        
        // --- Ações Pós-Validação Bem-Sucedida ---
        console.log("Formulário de contato VÁLIDO! (Envio simulado)");

        // Exibe a notificação de sucesso.
        if (successToastElement) {
            const toast = new bootstrap.Toast(successToastElement);
            toast.show();
        } else {
            console.warn("Elemento #contact-success-toast não encontrado. Usando alert().");
            alert("Mensagem enviada com sucesso! Obrigado.");
        }

        // Limpa o formulário e remove as classes de validação para um novo preenchimento.
        form.reset();
        form.classList.remove("was-validated");
        allInputs.forEach((el) => {
            if (el) {
                el.classList.remove("is-valid", "is-invalid");
                el.setCustomValidity("");
            }
        });
        // Reseta as mensagens de feedback customizadas.
        if (cpfFeedback) cpfFeedback.textContent = "";
        if (phoneFeedback) phoneFeedback.textContent = "";
    });
});