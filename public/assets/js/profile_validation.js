/**
 * @fileoverview Gerencia a validação do lado do cliente para todos os formulários da página de perfil.
 *
 * Este script é responsável por três conjuntos de validação distintos:
 * 1. Formulário de atualização de dados do perfil (nome, username, etc.).
 * 2. Formulário de alteração de senha, com verificação de comprimento e confirmação.
 * 3. Formulário de upload de avatar, com validação de tipo de arquivo, tamanho e exibição de preview.
 *
 * Ele utiliza o sistema de validação do Bootstrap e adiciona lógica customizada para regras complexas.
 */
document.addEventListener("DOMContentLoaded", function() {
    // --- Validação: Formulário de Dados do Perfil ---
    const profileForm = document.querySelector('form.needs-validation-profile');
    if (profileForm) {
        // A validação para este formulário é simples e utiliza principalmente as
        // regras nativas do HTML5 (como 'required'), acionadas pelo Bootstrap.
        profileForm.addEventListener('submit', function(event) {
            if (!profileForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            profileForm.classList.add('was-validated');
        }, false);
    }

    // --- Validação: Formulário de Alteração de Senha ---
    const passwordForm = document.querySelector('form.needs-validation-password');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
    const newPasswordFeedback = document.getElementById('newPasswordFeedback');
    const confirmNewPasswordFeedback = document.getElementById('confirmNewPasswordFeedback');

    // Prossegue apenas se todos os elementos do formulário de senha existirem.
    if (passwordForm && newPasswordInput && confirmNewPasswordInput && newPasswordFeedback && confirmNewPasswordFeedback) {
        
        /**
         * Verifica se os campos 'nova senha' e 'confirmar nova senha' coincidem.
         * Atualiza o feedback visual e a validade customizada do campo de confirmação.
         */
        function validatePasswordMatch() {
            if (newPasswordInput.value !== confirmNewPasswordInput.value && confirmNewPasswordInput.value !== '') {
                confirmNewPasswordInput.setCustomValidity("As senhas não correspondem.");
                if (confirmNewPasswordFeedback) confirmNewPasswordFeedback.textContent = "As senhas não correspondem.";
                confirmNewPasswordInput.classList.add('is-invalid');
                confirmNewPasswordInput.classList.remove('is-valid');
            } else {
                confirmNewPasswordInput.setCustomValidity("");
                // Atualiza o estado visual apenas se o campo estiver preenchido.
                if (confirmNewPasswordInput.value !== '') {
                    confirmNewPasswordInput.classList.remove('is-invalid');
                    confirmNewPasswordInput.classList.add('is-valid');
                } else {
                    confirmNewPasswordInput.classList.remove('is-invalid', 'is-valid');
                }
            }
        }

        /**
         * Verifica se a nova senha atende ao requisito de comprimento mínimo (8 caracteres).
         * Atualiza o feedback visual e a validade customizada do campo de nova senha.
         */
        function validateNewPasswordLength() {
            const isTooShort = newPasswordInput.value.length > 0 && newPasswordInput.value.length < 8;
            if (isTooShort) {
                newPasswordInput.setCustomValidity("A senha deve ter no mínimo 8 caracteres.");
                if (newPasswordFeedback) newPasswordFeedback.textContent = "A nova senha deve ter no mínimo 8 caracteres.";
                newPasswordInput.classList.add('is-invalid');
                newPasswordInput.classList.remove('is-valid');
            } else {
                newPasswordInput.setCustomValidity("");
                if (newPasswordInput.value.length >= 8) {
                    newPasswordInput.classList.remove('is-invalid');
                    newPasswordInput.classList.add('is-valid');
                } else {
                    newPasswordInput.classList.remove('is-invalid', 'is-valid');
                }
            }
        }

        // Adiciona listeners para validar dinamicamente enquanto o usuário digita.
        newPasswordInput.addEventListener('input', () => {
            validateNewPasswordLength();
            validatePasswordMatch(); // Re-valida a confirmação sempre que a senha principal muda.
        });
        confirmNewPasswordInput.addEventListener('input', validatePasswordMatch);

        // Validação final ao tentar submeter o formulário.
        passwordForm.addEventListener('submit', function(event) {
            validateNewPasswordLength();
            validatePasswordMatch();
            
            if (!passwordForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            passwordForm.classList.add('was-validated');
        }, false);
    }

    // --- Validação: Formulário de Upload de Avatar ---
    const avatarForm = document.getElementById('avatarForm');
    const avatarFileInput = document.getElementById('avatarFile');
    const avatarPreview = document.getElementById('avatarPreview');
    const avatarFileFeedback = document.getElementById('avatarFileFeedback');

    // Salva a URL do avatar inicial para restaurá-la em caso de seleção de arquivo inválido.
    const initialAvatarSrc = avatarPreview ? avatarPreview.src : '';

    if (avatarForm && avatarFileInput && avatarPreview && avatarFileFeedback) {
        
        // Listener que é acionado quando o usuário seleciona um arquivo.
        avatarFileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            
            if (file) {
                // Validação do tipo de arquivo (MIME type).
                const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    avatarFileInput.setCustomValidity('Tipo de arquivo inválido.');
                    avatarFileFeedback.textContent = 'Tipo inválido. Use PNG, JPG, GIF ou WEBP.';
                    avatarFileInput.value = ''; // Limpa a seleção inválida.
                    avatarPreview.src = initialAvatarSrc; // Restaura a imagem original.
                    avatarFileInput.classList.add('is-invalid');
                    return;
                }

                // Validação do tamanho do arquivo (máximo de 2MB).
                const maxFileSize = 2 * 1024 * 1024;
                if (file.size > maxFileSize) {
                    avatarFileInput.setCustomValidity('Arquivo muito grande.');
                    avatarFileFeedback.textContent = 'Arquivo grande demais. Máximo 2MB.';
                    avatarFileInput.value = '';
                    avatarPreview.src = initialAvatarSrc;
                    avatarFileInput.classList.add('is-invalid');
                    return;
                }

                // Se o arquivo for válido, limpa os erros e exibe o preview.
                avatarFileInput.setCustomValidity('');
                avatarFileInput.classList.remove('is-invalid');
                avatarFileInput.classList.add('is-valid');
                
                // Usa o FileReader para ler o arquivo selecionado e gerar uma URL de dados
                // para exibir a imagem de preview instantaneamente.
                const reader = new FileReader();
                reader.onload = (e) => { avatarPreview.src = e.target.result; };
                reader.readAsDataURL(file);

            } else {
                // Se o usuário cancelar a seleção de arquivo, reverte para o estado inicial.
                avatarPreview.src = initialAvatarSrc;
                avatarFileInput.classList.remove('is-valid', 'is-invalid');
                avatarFileInput.setCustomValidity('');
            }
        });

        // Validação final ao tentar submeter o formulário de avatar.
        avatarForm.addEventListener('submit', function(event) {
            // A validação no evento 'change' já deve ter tratado a maioria dos casos,
            // mas o checkValidity() final garante que campos 'required' não passem em branco.
            if (!avatarForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            avatarForm.classList.add('was-validated');
        }, false);
    }
});