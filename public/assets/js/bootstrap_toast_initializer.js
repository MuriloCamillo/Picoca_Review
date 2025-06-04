// public/assets/js/bootstrap_toast_initializer.js
document.addEventListener('DOMContentLoaded', function () {
    // Seleciona todos os toasts que foram renderizados pelo EJS e devem ser mostrados.
    // (Estes são os que NÃO são o 'contact-success-toast', que é tratado separadamente)
    const toastsToShow = [
        document.getElementById('login-success-toast'),
        document.getElementById('signup-success-toast'),
        document.getElementById('logout-toast'),
        document.getElementById('logout-error-toast'),
        ...document.querySelectorAll('.toast.general-feedback-trigger') // Pega o toast de erro/sucesso do perfil
    ].filter(el => el != null); // Filtra os elementos nulos (se o toast não foi renderizado)

    toastsToShow.forEach(function (toastEl) {
        if (toastEl) { // Verifica se o elemento realmente existe
            if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
                // Cria ou obtém a instância do toast
                var toastInstance = bootstrap.Toast.getOrCreateInstance(toastEl, {
                    // Os atributos data-bs-delay e data-bs-autohide no HTML já cuidam disso,
                    // mas podemos ser explícitos aqui se quisermos garantir.
                    // delay: 3500,
                    // autohide: true
                });
                // Mostra o toast
                toastInstance.show(); 
            } else {
                console.warn('Bootstrap Toast component não encontrado. A exibição de toasts pode não funcionar.');
            }
        }
    });

    // O 'contact-success-toast' é tratado pelo contact_validation.js,
    // mas se ele for renderizado com a classe .show pelo EJS (o que não é o caso atual),
    // esta lógica abaixo também o pegaria.
    // A lógica atual em contact_validation.js de adicionar .show e então deixar o Bootstrap
    // com data-bs-autohide e data-bs-delay é correta.
});