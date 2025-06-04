// public/assets/js/contact_validation.js
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".needs-validation"); // Seletor para o formulário de contato
  const cpfInput = document.getElementById("cpf");
  const cpfFeedback = document.getElementById("cpf-feedback");
  const phoneInput = document.getElementById("contactPhone");
  const phoneFeedback = document.getElementById("phone-feedback");
  const fullNameInput = document.getElementById("contactFullName");
  const emailInput = document.getElementById("contactEmail");
  const messageInput = document.getElementById("contactMessage");
  const successToastElement = document.getElementById("contact-success-toast"); 

  function updateValidationClass(inputElement, isValidOverride = null) {
    if (!inputElement) return;
    let isValid =
      isValidOverride !== null ? isValidOverride : inputElement.checkValidity();
    if (isValid) {
      inputElement.classList.remove("is-invalid");
      inputElement.classList.add("is-valid");
    } else {
      inputElement.classList.add("is-invalid");
      inputElement.classList.remove("is-valid");
    }
  }

  if (cpfInput) {
    cpfInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 11) value = value.substring(0, 11);
      // Formatação do CPF
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      e.target.value = value;
      cpfInput.setCustomValidity(""); // Limpa validade customizada ao digitar
    });

    cpfInput.addEventListener("blur", () => { // Valida no blur
      let isValid = validarCPF(cpfInput.value);
      updateValidationClass(cpfInput, isValid);
      cpfInput.setCustomValidity(isValid ? "" : "CPF inválido.");
      if (cpfFeedback)
        cpfFeedback.textContent = isValid
          ? ""
          : "Por favor, insira um CPF válido.";
    });
  }

  function validarCPF(cpf) {
    if (!cpf) return false;
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
  }

  function formatPhoneNumber(value) {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    const maxLength = 11;
    if (value.length > maxLength) value = value.substring(0, maxLength);

    if (value.length > 10) return value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    if (value.length > 6) return value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    if (value.length > 2) return value.replace(/^(\d{2})(\d{0,4})$/, "($1) $2");
    if (value.length > 0) return value.replace(/^(\d*)$/, "($1");
    return "";
  }

  function validatePhoneNumber(phoneInputElement) {
    if (!phoneInputElement) return true;
    const phoneValue = phoneInputElement.value.replace(/\D/g, "");
    const isRequired = phoneInputElement.hasAttribute("required");
    if (isRequired && phoneValue.length === 0) return false; // Falha se obrigatório e vazio
    if (phoneValue.length > 0 && (phoneValue.length < 10 || phoneValue.length > 11)) return false; // Falha se preenchido e formato incorreto
    return true; // Válido se não obrigatório e vazio, ou se formato correto
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      e.target.value = formatPhoneNumber(e.target.value);
      phoneInput.setCustomValidity(""); // Limpa validade customizada ao digitar
    });
    phoneInput.addEventListener("blur", () => { // Valida no blur
      let isValid = validatePhoneNumber(phoneInput);
      updateValidationClass(phoneInput, isValid);
      const phoneValue = phoneInput.value.replace(/\D/g, "");
      if (phoneValue.length > 0 && (phoneValue.length < 10 || phoneValue.length > 11)) {
        phoneInput.setCustomValidity("Telefone inválido.");
        if (phoneFeedback) phoneFeedback.textContent = "Formato inválido. Use DDD + 8 ou 9 dígitos.";
      } else {
        phoneInput.setCustomValidity("");
        if (phoneFeedback) phoneFeedback.textContent = phoneInput.hasAttribute('required') ? "Este campo é obrigatório." : "";
      }
    });
  }

  [fullNameInput, emailInput, messageInput].forEach((input) => {
    if (input) {
      input.addEventListener("blur", () => { // Validar no blur para feedback imediato
        updateValidationClass(input);
      });
       input.addEventListener("input", () => { // Limpar validade customizada ao digitar
        if (input.classList.contains('is-invalid')) { // Limpa só se estava inválido
            input.setCustomValidity("");
        }
      });
    }
  });

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Sempre previne o envio padrão para tratar com JS
      event.stopPropagation();

      let isFormValid = true;
      let firstInvalidField = null;

      // Validar CPF no submit
      if (cpfInput && (cpfInput.hasAttribute('required') || cpfInput.value)) {
        let isCpfValid = validarCPF(cpfInput.value);
        updateValidationClass(cpfInput, isCpfValid);
        cpfInput.setCustomValidity(isCpfValid ? "" : "CPF inválido.");
        if (!isCpfValid) {
            isFormValid = false;
            if(!firstInvalidField) firstInvalidField = cpfInput;
            if (cpfFeedback) cpfFeedback.textContent = "Por favor, insira um CPF válido.";
        } else if (cpfFeedback) {
            cpfFeedback.textContent = "";
        }
      }
      
      // Validar Telefone no submit
      if (phoneInput && (phoneInput.hasAttribute('required') || phoneInput.value)) {
        let isPhoneFormatCorrect = validatePhoneNumber(phoneInput);
        updateValidationClass(phoneInput, isPhoneFormatCorrect);
        phoneInput.setCustomValidity(isPhoneFormatCorrect ? "" : "Telefone inválido.");
         if (!isPhoneFormatCorrect) {
            isFormValid = false;
            if(!firstInvalidField) firstInvalidField = phoneInput;
            if (phoneFeedback) {
                if (phoneInput.value.replace(/\D/g, "").length === 0 && phoneInput.hasAttribute('required')) {
                     phoneFeedback.textContent = "Este campo é obrigatório.";
                } else {
                    phoneFeedback.textContent = "Formato inválido. Use DDD + 8 ou 9 dígitos.";
                }
            }
        } else if (phoneFeedback) {
            phoneFeedback.textContent = "";
        }
      }

      // Validar campos padrão do Bootstrap no submit
      [fullNameInput, emailInput, messageInput].forEach(input => {
        if (input) {
            updateValidationClass(input); // Atualiza classe visual
            if (!input.checkValidity()) {
                isFormValid = false;
                if(!firstInvalidField) firstInvalidField = input;
            }
        }
      });
      
      form.classList.add("was-validated"); // Adiciona para mostrar feedback do Bootstrap

      if (!isFormValid) {
        console.log("Formulário de contato inválido.");
        if (firstInvalidField) firstInvalidField.focus(); // Foca no primeiro campo inválido
        return; // Interrompe se o formulário não for válido
      }
      
      // Formulário Válido!
      console.log("Formulário de contato VÁLIDO! (Envio simulado)");

      if (successToastElement) {
        successToastElement.classList.add("show"); // Adiciona .show para o Bootstrap pegar
        // O bootstrap_toast_initializer.js vai garantir que new bootstrap.Toast() seja chamado
        // e o data-bs-autohide e data-bs-delay no HTML do toast cuidarão de escondê-lo.
        // NÃO é necessário setTimeout aqui para remover a classe .show
      } else {
        console.warn("Elemento #contact-success-toast não encontrado. Usando alert.");
        alert("Mensagem enviada com sucesso! Obrigado.");
      }

      form.reset();
      form.classList.remove("was-validated");
      [cpfInput, phoneInput, fullNameInput, emailInput, messageInput].forEach(
        (el) => {
          if (el) {
            el.classList.remove("is-valid", "is-invalid");
            el.setCustomValidity("");
          }
        }
      );
      if (cpfFeedback) cpfFeedback.textContent = cpfInput && cpfInput.hasAttribute('required') ? "Por favor, insira um CPF válido." : "";
      if (phoneFeedback) phoneFeedback.textContent = phoneInput && phoneInput.hasAttribute('required') ? "Este campo é obrigatório." : "";
    });
  }
});