/**
 * @fileoverview Validação do formulário de contato, incluindo máscaras e validações
 * específicas para CPF e Telefone, usando Bootstrap 5.
 */

document.addEventListener("DOMContentLoaded", function () {
  // --- Elementos do Formulário ---
  const form = document.querySelector(".needs-validation");
  const cpfInput = document.getElementById("cpf");
  const cpfFeedback = document.getElementById("cpf-feedback");
  const phoneInput = document.getElementById("contactPhone");
  const phoneFeedback = document.getElementById("phone-feedback");
  const fullNameInput = document.getElementById("contactFullName");
  const emailInput = document.getElementById("contactEmail");
  const messageInput = document.getElementById("contactMessage");
  const successToastElement = document.getElementById("contact-success-toast"); // Elemento do Toast

  /**
   * Atualiza as classes de validação (.is-valid, .is-invalid) de um input
   * com base na sua validade ou em um valor de validade fornecido.
   * @param {HTMLInputElement|HTMLTextAreaElement|null} inputElement - O elemento de input a ser atualizado.
   * @param {boolean|null} [isValidOverride=null] - Se fornecido, força o estado de validade (true=válido, false=inválido). Senão, usa inputElement.checkValidity().
   */
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

  // --- Bloco CPF ---
  if (cpfInput) {
    // Máscara CPF
    cpfInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 11) value = value.substring(0, 11);
      if (value.length <= 11) {
        let tempValue = value.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          "$1.$2.$3-$4"
        );
        e.target.value = tempValue.includes("-") ? tempValue : value;
      } else {
        e.target.value = value;
      }
      cpfInput.setCustomValidity("");
    });

    cpfInput.addEventListener("input", () => {
      if (form && form.classList.contains("was-validated")) {
        let isValid = validarCPF(cpfInput.value);
        updateValidationClass(cpfInput, isValid);
        cpfInput.setCustomValidity(isValid ? "" : "CPF inválido.");
        if (cpfFeedback)
          cpfFeedback.textContent = isValid
            ? ""
            : "Por favor, insira um CPF válido.";
      }
    });
  } else {
    if (document.body.contains(document.getElementById("contactForm"))) {
      console.warn("Campo CPF (id='cpf') não encontrado na página de contato.");
    }
  }

  /**
   * Valida um número de CPF brasileiro.
   * Algoritmo baseado na Receita Federal.
   * @param {string} cpf - O CPF a ser validado (pode conter máscara).
   * @returns {boolean} - True se o CPF for válido, False caso contrário.
   */
  // Função de validação do CPF
  function validarCPF(cpf) {
    if (!cpf) return false;
    cpf = cpf.replace(/[^\d]/g, "");
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    let cpfDigitos = cpf.split("").map(Number);
    const b1Original = cpfDigitos[9];
    const b2Original = cpfDigitos[10];
    let soma1 = 0;
    for (let i = 0; i < 9; i++) {
      soma1 += cpfDigitos[i] * (i + 1);
    }
    let resto1 = soma1 % 11;
    let b1Calculado = resto1 === 10 ? 0 : resto1;
    let soma2 = 0;
    for (let i = 0; i < 9; i++) {
      soma2 += cpfDigitos[i] * (9 - i);
    }
    let resto2 = soma2 % 11;
    let b2Calculado = resto2 === 10 ? 0 : resto2;
    return b1Calculado === b1Original && b2Calculado === b2Original;
  }
  // --- Bloco CPF (Fim) ---

  // --- Bloco Telefone ---
  /**
   * Formata um número de telefone para o padrão (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.
   * @param {string} value - O valor atual do input.
   * @returns {string} - O valor formatado.
   */
  function formatPhoneNumber(value) {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    const maxLength = 11;
    if (value.length > maxLength) value = value.substring(0, maxLength);
    if (value.length > 10)
      return value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    else if (value.length > 6)
      return value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    else if (value.length > 2)
      return value.replace(/^(\d{2})(\d{0,4})$/, "($1) $2");
    else if (value.length > 0) return value.replace(/^(\d*)$/, "($1");
    return "";
  }

  /**
   * Valida se o número de telefone tem 10 ou 11 dígitos.
   * @param {HTMLInputElement|null} phoneInputElement - O input de telefone.
   * @returns {boolean} - True se válido ou não obrigatório e vazio, False caso contrário.
   */
  function validatePhoneNumber(phoneInput) {
    if (!phoneInput) return true;
    const phoneValue = phoneInput.value.replace(/\D/g, "");
    const isRequired = phoneInput.hasAttribute("required");
    if (isRequired && phoneValue.length === 0) return false;
    if (
      phoneValue.length > 0 &&
      (phoneValue.length < 10 || phoneValue.length > 11)
    )
      return false;
    return true;
  }

  if (phoneInput) {
    // Máscara Telefone
    phoneInput.addEventListener("input", (e) => {
      e.target.value = formatPhoneNumber(e.target.value);
      phoneInput.setCustomValidity("");
    });
    phoneInput.addEventListener("input", () => {
      if (form && form.classList.contains("was-validated")) {
        let isValid = validatePhoneNumber(phoneInput);
        updateValidationClass(phoneInput, isValid);

        const phoneValue = phoneInput.value.replace(/\D/g, "");
        if (
          phoneValue.length > 0 &&
          (phoneValue.length < 10 || phoneValue.length > 11)
        ) {
          phoneInput.setCustomValidity("Telefone inválido.");
          if (phoneFeedback)
            phoneFeedback.textContent =
              "Formato inválido. Use DDD + 8 ou 9 dígitos.";
        } else {
          phoneInput.setCustomValidity("");
          if (phoneFeedback) phoneFeedback.textContent = "";
        }
      }
    });
  }
  // Bloco Telefone (Fim) ---

  // --- Listeners para feedback em tempo real nos campos padrão (Nome, Email, Mensagem) ---
  [fullNameInput, emailInput, messageInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", () => {
        if (form && form.classList.contains("was-validated")) {
          updateValidationClass(input);
        }
      });
    }
  });

  if (form) {
    form.addEventListener("submit", function (event) {
      let isCpfValidOnContact = true;
      let isPhoneFormatCorrect = true;
      if (cpfInput && cpfInput.hasAttribute("required")) {
        isCpfValidOnContact = validarCPF(cpfInput.value);
        cpfInput.setCustomValidity(isCpfValidOnContact ? "" : "CPF inválido");
      }
      if (phoneInput) {
        const phoneValue = phoneInput.value.replace(/\D/g, "");
        if (phoneValue.length > 0) {
          isPhoneFormatCorrect =
            phoneValue.length >= 10 && phoneValue.length <= 11;
          phoneInput.setCustomValidity(
            isPhoneFormatCorrect ? "" : "Telefone inválido."
          );
        } else {
          isPhoneFormatCorrect = true;
          phoneInput.setCustomValidity("");
        }
      }
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        updateValidationClass(cpfInput, isCpfValidOnContact);
        updateValidationClass(phoneInput);
        updateValidationClass(fullNameInput);
        updateValidationClass(emailInput);
        updateValidationClass(messageInput);

        if (cpfFeedback && !isCpfValidOnContact) {
          cpfFeedback.textContent = "Por favor, insira um CPF válido.";
        } else if (cpfFeedback) {
          cpfFeedback.textContent = "";
        }

        if (phoneFeedback && phoneInput) {
          if (phoneInput.validity.valueMissing) {
            phoneFeedback.textContent = "Este campo é obrigatório.";
          } else if (!isPhoneFormatCorrect && phoneInput.value.length > 0) {
            phoneFeedback.textContent =
              "Formato inválido. Use DDD + 8 ou 9 dígitos.";
          } else {
            phoneFeedback.textContent = "";
          }
        }

        console.log("Formulário de contato inválido.");
      } else {
        // Formulário Válido!
        event.preventDefault();
        console.log("Formulário de contato VÁLIDO! (Envio simulado)");

        // Aciona o TOAST
        if (successToastElement) {
          successToastElement.classList.add("show");
          setTimeout(() => {
            successToastElement.classList.remove("show");
          }, 3000);
        } else {
          console.warn(
            "Elemento #contact-success-toast não encontrado. Usando alert."
          );
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
        // Reseta mensagens de texto padrão dos feedbacks
        if (cpfFeedback)
          cpfFeedback.textContent = "Por favor, insira um CPF válido.";
        if (phoneFeedback)
          phoneFeedback.textContent =
            "Formato de telefone inválido. Use 10 ou 11 dígitos.";
      }

      form.classList.add("was-validated");
    });
  } else {
    if (document.body.contains(document.getElementById("contactForm"))) {
      console.warn(
        "Formulário de contato (seletor '.needs-validation') não encontrado para adicionar validação JS."
      );
    }
  }
});
