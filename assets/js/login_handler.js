/**
 * @fileoverview Lida com a validação e envio do formulário de login,
 * integrando com a validação do Bootstrap 5 e lógica de
 * autenticação específica (usuário/senha fixos).
 */
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(
    ".formulario-login form.needs-validation"
  ); // Seleciona o form com a classe
  const emailInput = document.getElementById("loginEmailInput");
  const passwordInput = document.getElementById("loginPasswordInput");
  // Mantém a referência ao elemento de mensagem de erro geral (para credenciais inválidas)
  const generalErrorMessage = document.getElementById("login-error-message");

  // Verifica se todos os elementos essenciais foram encontrados
  if (loginForm && emailInput && passwordInput && generalErrorMessage) {
    loginForm.addEventListener("submit", (event) => {
      // Previne o envio padrão do formulário, pois vamos tratar tudo via JS
      event.preventDefault();
      event.stopPropagation(); // Impede que o evento se propague

      // Limpa a mensagem de erro geral de credenciais inválidas a cada tentativa
      generalErrorMessage.textContent = "";
      generalErrorMessage.classList.remove("login-error-active");
      // Remove as classes 'is-invalid'/'is-valid' dos inputs para resetar o estado visual
      emailInput.classList.remove("is-invalid", "is-valid");
      passwordInput.classList.remove("is-invalid", "is-valid");

      // Verifica a validação nativa do HTML5 (required, type="email") usando checkValidity()
      if (!loginForm.checkValidity()) {
        // Se a validação básica falhar (ex: campo vazio, email inválido)
        console.log("Formulário inválido. Verifique os campos.");
        // Adiciona a classe 'was-validated' para que o Bootstrap mostre os feedbacks
        loginForm.classList.add("was-validated");
        return; // Interrompe a execução aqui
      }

      // Se checkValidity() passou, prossegue para a lógica de autenticação
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      // Lógica de Autenticação Fictícia (Verifica as credenciais)
      if (email === "teste@teste" && password === "teste") {
        // --- Login BEM-SUCEDIDO ---
        console.log("Login bem-sucedido para:", email);
        // Armazena o usuário logado no localStorage
        localStorage.setItem("loggedInUser", "teste");
        // Define um sinalizador para mostrar o toast de sucesso na próxima página
        localStorage.setItem("showLoginSuccessToast", "true");
        // Redireciona para a página principal
        window.location.href = "index.html";
      } else {
        // --- Login FALHOU (Credenciais Incorretas) ---
        console.log(
          "Tentativa de login falhou (credenciais inválidas) para:",
          email
        );
        // Exibe a mensagem de erro geral
        generalErrorMessage.textContent = "Email ou senha inválidos.";
        generalErrorMessage.classList.add("login-error-active");

        // Adiciona manualmente a classe 'is-invalid' aos campos
        // para dar feedback visual (borda vermelha) mesmo que
        // o formato estivesse correto, mas a combinação falhou.
        emailInput.classList.add("is-invalid");
        passwordInput.classList.add("is-invalid");
      }

      // Adiciona a classe 'was-validated' aqui também, caso a autenticação falhe.
      // Isso garante que, se os campos eram válidos mas a senha errada,
      // o feedback visual (borda vermelha adicionada manualmente acima) seja mantido
      // ou que os feedbacks de validação apareçam corretamente se checkValidity falhou antes.
      // loginForm.classList.add('was-validated'); // Comentado - Adicionar no final garante o trigger
    }); // Fim do event listener 'submit'

    // Listener para limpar o erro GERAL quando o usuário começar a digitar novamente
    // e remover o estado visual de inválido do campo específico
    [emailInput, passwordInput].forEach((input) => {
      input.addEventListener("input", () => {
        // Remove a classe de inválido DO CAMPO ATUAL ao digitar
        input.classList.remove("is-invalid");
        // Limpa a mensagem de erro GERAL de credenciais
        if (generalErrorMessage.textContent) {
          generalErrorMessage.textContent = "";
          generalErrorMessage.classList.remove("login-error-active");
        }
        // Opcional: Remover 'was-validated' do form para resetar visualmente todos os campos
        // loginForm.classList.remove('was-validated');
      });
    });
  } else {
    // Mensagem de erro se algum elemento essencial não for encontrado
    console.error(
      "Erro crítico: Formulário de login (.needs-validation), input de email/senha ou div de erro geral não encontrado(s) em login.html. Verifique os IDs e a estrutura HTML."
    );
  }
});
