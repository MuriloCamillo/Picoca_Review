// assets/js/contact_validation.js - Validação para Contato (CPF original + Telefone Required + Toast + Real-time Feedback)

document.addEventListener('DOMContentLoaded', function() {
  // --- Elementos do Formulário ---
  const form = document.querySelector('.needs-validation'); // Usando o seletor original do seu código CPF
  const cpfInput = document.getElementById('cpf');
  const cpfFeedback = document.getElementById('cpf-feedback'); // Adicione este ID no HTML se não tiver
  const phoneInput = document.getElementById('contactPhone');
  const phoneFeedback = document.getElementById('phone-feedback');
  const fullNameInput = document.getElementById('contactFullName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const successToastElement = document.getElementById('contact-success-toast'); // Elemento do Toast

  // --- Função Auxiliar: Atualizar Classes Bootstrap ---
  function updateValidationClass(inputElement, isValidOverride = null) {
      if (!inputElement) return;
      // Determina validade: usa override se houver, senão checkValidity()
      let isValid = (isValidOverride !== null) ? isValidOverride : inputElement.checkValidity();
      if (isValid) {
          inputElement.classList.remove('is-invalid');
          inputElement.classList.add('is-valid');
      } else {
          inputElement.classList.add('is-invalid');
          inputElement.classList.remove('is-valid');
      }
  }

  // --- Bloco CPF Original (Início) ---
  if (cpfInput) {
      // Máscara CPF (ORIGINAL)
      cpfInput.addEventListener('input', function(e) {
          let value = e.target.value.replace(/\D/g, '');
          if (value.length > 11) value = value.substring(0, 11);
           // Aplica máscara apenas se tiver 11 dígitos (conforme regex original)
          if (value.length <= 11) {
               let tempValue = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
               e.target.value = tempValue.includes('-') ? tempValue : value; // Aplica se formatou, senão mantém dígitos
           } else {
                e.target.value = value;
           }
           // Limpa validade customizada ao digitar com máscara
           cpfInput.setCustomValidity('');
      });

      // Listener CPF para feedback em tempo real (APÓS 1º submit)
       cpfInput.addEventListener('input', () => {
            // setCustomValidity já é limpo no listener acima
            if (form && form.classList.contains('was-validated')) {
                let isValid = validarCPF(cpfInput.value);
                updateValidationClass(cpfInput, isValid);
                 cpfInput.setCustomValidity(isValid ? '' : 'CPF inválido.'); // Re-define se inválido
                 if(cpfFeedback) cpfFeedback.textContent = isValid ? '' : 'Por favor, insira um CPF válido.';
            }
       });

  } else {
        if (document.body.contains(document.getElementById('contactForm'))) { // Usa ID do form para checar página
           console.warn("Campo CPF (id='cpf') não encontrado na página de contato.");
       }
  }

  // Função de validação do CPF (ORIGINAL)
  function validarCPF(cpf) {
      if (!cpf) return false;
      cpf = cpf.replace(/[^\d]/g, '');
      if (cpf.length !== 11) return false;
      if (/^(\d)\1+$/.test(cpf)) return false;
      let cpfDigitos = cpf.split('').map(Number);
      const b1Original = cpfDigitos[9];
      const b2Original = cpfDigitos[10];
      let soma1 = 0; for (let i = 0; i < 9; i++) { soma1 += cpfDigitos[i] * (i + 1); }
      let resto1 = soma1 % 11; let b1Calculado = (resto1 === 10) ? 0 : resto1;
      let soma2 = 0; for (let i = 0; i < 9; i++) { soma2 += cpfDigitos[i] * (9 - i); }
      let resto2 = soma2 % 11; let b2Calculado = (resto2 === 10) ? 0 : resto2;
      return (b1Calculado === b1Original && b2Calculado === b2Original);
  }
  // --- Bloco CPF Original (Fim) ---


  // --- Lógica do Telefone (Adicionada e Corrigida para Required) ---
  function formatPhoneNumber(value) {
      if (!value) return '';
      value = value.replace(/\D/g, '');
      const maxLength = 11;
      if (value.length > maxLength) value = value.substring(0, maxLength);
      if (value.length > 10) return value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      else if (value.length > 6) return value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      else if (value.length > 2) return value.replace(/^(\d{2})(\d{0,4})$/, '($1) $2');
      else if (value.length > 0) return value.replace(/^(\d*)$/, '($1');
      return '';
  }

  // Valida formato E se é obrigatório (se aplicável)
  function validatePhoneNumber(phoneInput) {
      if (!phoneInput) return true;
      const phoneValue = phoneInput.value.replace(/\D/g, '');
      const isRequired = phoneInput.hasAttribute('required');

      if (isRequired && phoneValue.length === 0) return false; // Falha se obrigatório e vazio
      if (phoneValue.length > 0 && (phoneValue.length < 10 || phoneValue.length > 11)) return false; // Falha no formato se preenchido
      return true; // Válido em outros casos
  }

  if (phoneInput) {
      // Máscara Telefone e Limpeza de Validade Customizada
      phoneInput.addEventListener('input', (e) => {
          e.target.value = formatPhoneNumber(e.target.value);
          phoneInput.setCustomValidity(''); // Limpa erro customizado ao digitar
      });

      // Validação Telefone em tempo real (APÓS 1º submit)
      phoneInput.addEventListener('input', () => {
          if (form && form.classList.contains('was-validated')) {
              let isValid = validatePhoneNumber(phoneInput); // Revalida (formato E required implícito)
              updateValidationClass(phoneInput, isValid); // Atualiza visual

              // Define mensagem e validade customizada para erro de FORMATO
              const phoneValue = phoneInput.value.replace(/\D/g, '');
              if (phoneValue.length > 0 && (phoneValue.length < 10 || phoneValue.length > 11)) {
                  phoneInput.setCustomValidity('Telefone inválido.');
                  if (phoneFeedback) phoneFeedback.textContent = 'Formato inválido. Use DDD + 8 ou 9 dígitos.';
              } else {
                  phoneInput.setCustomValidity(''); // Limpa erro custom de formato
                   // Limpa a mensagem se válido OU se o erro for apenas 'required' (tratado pelo navegador)
                   if(phoneFeedback) phoneFeedback.textContent = '';
              }
          }
      });
  }


  // --- Listeners para feedback em tempo real nos campos padrão (Nome, Email, Mensagem) ---
  [fullNameInput, emailInput, messageInput].forEach(input => {
      if (input) {
          input.addEventListener('input', () => {
              // Só atualiza o visual se o formulário já foi marcado como 'validado'
              if (form && form.classList.contains('was-validated')) {
                  // Reavalia a validade padrão (required, type=email) e atualiza as classes
                  updateValidationClass(input);
              }
          });
      }
  });


  // --- Validação do Formulário no Submit (Integrada) ---
  if (form) {
      form.addEventListener('submit', function(event) {
          let isCpfValidOnContact = true;
          let isPhoneFormatCorrect = true; // Validade apenas do formato do telefone

          // 1. Valida CPF e define validade customizada
          if (cpfInput && cpfInput.hasAttribute('required')) {
              isCpfValidOnContact = validarCPF(cpfInput.value);
              cpfInput.setCustomValidity(isCpfValidOnContact ? '' : 'CPF inválido');
          }

          // 2. Valida FORMATO do Telefone e define validade customizada APENAS para formato
          if (phoneInput) {
              const phoneValue = phoneInput.value.replace(/\D/g, '');
              if (phoneValue.length > 0) { // Só valida formato se não estiver vazio
                  isPhoneFormatCorrect = (phoneValue.length >= 10 && phoneValue.length <= 11);
                  phoneInput.setCustomValidity(isPhoneFormatCorrect ? '' : 'Telefone inválido.');
              } else {
                   isPhoneFormatCorrect = true; // Formato OK se vazio
                   phoneInput.setCustomValidity(''); // Limpa erro custom se vazio
              }
          }

          // 3. Verifica a validade geral com checkValidity()
          // checkValidity() vai considerar:
          // - Atributos HTML5 (required, type=email)
          // - Validade customizada do CPF (se falhar)
          // - Validade customizada do Telefone (APENAS se falhar no formato)
          if (!form.checkValidity()) {
              event.preventDefault(); // IMPEDE O ENVIO
              event.stopPropagation();

              // Atualiza feedback visual para TODOS os campos APÓS a falha geral
              updateValidationClass(cpfInput, isCpfValidOnContact); // Usa a validação específica do CPF
              updateValidationClass(phoneInput); // Deixa checkValidity definir para telefone (considera required E formato)
              updateValidationClass(fullNameInput);
              updateValidationClass(emailInput);
              updateValidationClass(messageInput);

              // Ajusta mensagens de erro específicas que precisam de lógica customizada
               if(cpfFeedback && !isCpfValidOnContact) {
                   cpfFeedback.textContent = 'Por favor, insira um CPF válido.';
               } else if (cpfFeedback) {
                    cpfFeedback.textContent = ''; // Limpa se CPF for válido
               }

               if(phoneFeedback && phoneInput) {
                  if (phoneInput.validity.valueMissing) { // Pega erro 'required' do checkValidity
                      phoneFeedback.textContent = 'Este campo é obrigatório.';
                  } else if (!isPhoneFormatCorrect && phoneInput.value.length > 0) { // Pega erro de formato
                      phoneFeedback.textContent = 'Formato inválido. Use DDD + 8 ou 9 dígitos.';
                  } else {
                      phoneFeedback.textContent = ''; // Limpa se válido
                  }
               }

              console.log("Formulário de contato inválido.");

          } else {
              // Formulário Válido!
              event.preventDefault(); // Simulação
              console.log("Formulário de contato VÁLIDO! (Envio simulado)");

              // Aciona o TOAST
              if (successToastElement) {
                  successToastElement.classList.add('show');
                  setTimeout(() => { successToastElement.classList.remove('show'); }, 3000);
              } else {
                  console.warn("Elemento #contact-success-toast não encontrado. Usando alert.");
                  alert("Mensagem enviada com sucesso! Obrigado.");
              }

              form.reset();
              form.classList.remove('was-validated');

              // Limpa classes/validade customizada/mensagens
               [cpfInput, phoneInput, fullNameInput, emailInput, messageInput].forEach(el => {
                   if(el) {
                       el.classList.remove('is-valid', 'is-invalid');
                       el.setCustomValidity('');
                   }
               });
               // Reseta mensagens de texto padrão dos feedbacks
               if(cpfFeedback) cpfFeedback.textContent = 'Por favor, insira um CPF válido.';
               if(phoneFeedback) phoneFeedback.textContent = 'Formato de telefone inválido. Use 10 ou 11 dígitos.';
          }

          // Adiciona a classe para mostrar os estilos de feedback APÓS a checagem
          // Isso garante que o usuário veja o feedback vermelho ou verde.
          form.classList.add('was-validated');

      }); // Fim do listener 'submit'

  } else {
       // Log apenas se estiver na página de contato e não achar o form
       if (document.body.contains(document.getElementById('contactForm'))) {
           console.warn("Formulário de contato (seletor '.needs-validation') não encontrado para adicionar validação JS.");
       }
  }

}); // Fim do DOMContentLoaded