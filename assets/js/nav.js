// Função para verificar se o usuário está logado (simulação)
function isUserLoggedIn() {
  //  Colocar a lógica para verificar se o usuário está logado
  return true; // Simula usuário logado
  // return false; // Simula usuário não logado
}

// Função para obter o nome do usuário (simulação)
function getUserName() {
  // Colocar a lógica para obter o nome do usuário
  return "Usuário"; // Simula o nome do usuário
}

// Função para atualizar a navbar com base no estado do login
function updateNavbar() {
  const loginSignup = document.getElementById('login-signup');
  const registerSignup = document.getElementById('register-signup');
  const userDropdown = document.getElementById('user-dropdown');
  const userName = document.getElementById('user-name');
  const minhasListas = document.getElementById('minhas-listas');
  const logoutBtn = document.getElementById('logout-btn');

  if (isUserLoggedIn()) {
      // Usuário logado
      loginSignup.style.display = 'none';
      registerSignup.style.display = 'none';
      userDropdown.style.display = 'block';
      minhasListas.style.display = 'block';
      userName.textContent = getUserName();

      // Adiciona um event listener para o botão de logout (simulação)
      logoutBtn.addEventListener('click', function(event) {
          event.preventDefault();
          // Colocar a lógica para fazer o logout do usuário
          alert('Usuário deslogado!');
          // Redireciona para a página inicial ou de login
          window.location.href = 'index.html';
      });
  } else {
      // Usuário não logado
      loginSignup.style.display = 'block';
      registerSignup.style.display = 'block';
      userDropdown.style.display = 'none';
      minhasListas.style.display = 'none';
  }
}

// Chama a função para atualizar a navbar quando a página carregar
window.onload = updateNavbar;