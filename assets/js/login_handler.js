// assets/js/login_handler.js

document.addEventListener('DOMContentLoaded', () => {
  // Seleciona o formulário de login
  const loginForm = document.querySelector('.formulario-login form');
  // Seleciona a div para exibir mensagens de erro
  const errorMessageDiv = document.getElementById('login-error-message');

  // Verifica se o formulário existe na página
  if (loginForm) {
      loginForm.addEventListener('submit', (event) => {
          event.preventDefault(); // Impede o comportamento padrão de envio do formulário

          // Pega os elementos de input pelos IDs
          const emailInput = document.getElementById('loginEmailInput');
          const passwordInput = document.getElementById('loginPasswordInput');

          // Limpa mensagens e classe de erro anteriores
          if (errorMessageDiv) {
               errorMessageDiv.textContent = '';
               errorMessageDiv.classList.remove('login-error-active');
          }

          // Validação básica se os campos existem
          if (!emailInput || !passwordInput) {
               console.error("Campos de email ou senha não encontrados no formulário.");
               if (errorMessageDiv){
                   errorMessageDiv.textContent = 'Erro interno no formulário. Tente novamente.';
                   errorMessageDiv.classList.add('login-error-active');
               }
               return;
          }

          const email = emailInput.value.trim();
          const password = passwordInput.value; // Não aplicar trim() em senhas

          // --- Lógica de Autenticação (Credenciais Fixas "Hardcoded") ---
          // !!! Substitua esta parte pela sua lógica de autenticação real !!!
          if (email === 'teste@teste' && password === 'teste') {
              // Login bem-sucedido
              console.log('Login bem-sucedido para:', email);

              // Armazena um identificador simples no localStorage para indicar que está logado
              // (Usando o nome 'teste' como exemplo)
              localStorage.setItem('loggedInUser', 'teste');

              // Redireciona o usuário para a página principal
              window.location.href = 'index.html';

          } else {
              // Login Falhou
              console.log('Tentativa de login falhou para:', email);
              if (errorMessageDiv) {
                  // Exibe a mensagem de erro e adiciona a classe para estilização
                  errorMessageDiv.textContent = 'Email ou senha inválidos.';
                  errorMessageDiv.classList.add('login-error-active');
              } else {
                  // Fallback caso a div de erro não seja encontrada
                  alert("Email ou senha inválidos!");
              }
          }
      });
  } else {
      // Avisa no console se o formulário não for encontrado
      console.error("Elemento form não encontrado dentro de '.formulario-login' na página login.html.");
  }
});