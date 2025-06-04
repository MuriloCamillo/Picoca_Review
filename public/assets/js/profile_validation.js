// public/assets/js/profile_validation.js
document.addEventListener("DOMContentLoaded", function() {
    // Validação para formulário de atualização de perfil
    const profileForm = document.querySelector('form.needs-validation-profile'); // Usando classe específica
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            if (!profileForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            profileForm.classList.add('was-validated');
        }, false);
    }

    // Validação para formulário de alteração de senha
    const passwordForm = document.querySelector('form.needs-validation-password'); // Usando classe específica
    const newPasswordInput = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
    const newPasswordFeedback = document.getElementById('newPasswordFeedback');
    const confirmNewPasswordFeedback = document.getElementById('confirmNewPasswordFeedback');

    if (passwordForm && newPasswordInput && confirmNewPasswordInput && newPasswordFeedback && confirmNewPasswordFeedback) {
        function validatePasswordMatch() {
            if (newPasswordInput.value !== confirmNewPasswordInput.value && confirmNewPasswordInput.value !== '') {
                confirmNewPasswordInput.setCustomValidity("As senhas não correspondem.");
                confirmNewPasswordFeedback.textContent = "As senhas não correspondem.";
                confirmNewPasswordInput.classList.add('is-invalid');
                confirmNewPasswordInput.classList.remove('is-valid');
            } else {
                confirmNewPasswordInput.setCustomValidity("");
                if (confirmNewPasswordInput.value !== '') {
                    confirmNewPasswordInput.classList.remove('is-invalid');
                    confirmNewPasswordInput.classList.add('is-valid');
                } else {
                     confirmNewPasswordInput.classList.remove('is-invalid', 'is-valid');
                }
            }
        }

        function validateNewPasswordLength() {
            if (newPasswordInput.value.length > 0 && newPasswordInput.value.length < 8) {
                newPasswordInput.setCustomValidity("A senha deve ter no mínimo 8 caracteres.");
                newPasswordFeedback.textContent = "A nova senha deve ter no mínimo 8 caracteres.";
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

        newPasswordInput.addEventListener('input', () => {
            validateNewPasswordLength();
            validatePasswordMatch();
        });
        confirmNewPasswordInput.addEventListener('input', validatePasswordMatch);

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

    // Validação para formulário de avatar e preview
    const avatarForm = document.getElementById('avatarForm'); // Usando ID específico
    const avatarFileInput = document.getElementById('avatarFile');
    const avatarPreview = document.getElementById('avatarPreview'); // ID para a imagem de preview
    const avatarFileFeedback = document.getElementById('avatarFileFeedback');

    let initialAvatarSrc = avatarPreview ? avatarPreview.src : '';

    if (avatarForm && avatarFileInput && avatarPreview && avatarFileFeedback) {
        avatarFileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    avatarFileInput.setCustomValidity('Tipo inválido. Use PNG, JPG, GIF ou WEBP.');
                    avatarFileFeedback.textContent = 'Tipo inválido. Use PNG, JPG, GIF ou WEBP.';
                    avatarFileInput.value = ''; 
                    avatarPreview.src = initialAvatarSrc;
                    avatarFileInput.classList.add('is-invalid');
                    avatarFileInput.classList.remove('is-valid');
                    return;
                }
                if (file.size > 2 * 1024 * 1024) { // 2MB
                    avatarFileInput.setCustomValidity('Arquivo grande demais. Máximo 2MB.');
                    avatarFileFeedback.textContent = 'Arquivo grande demais. Máximo 2MB.';
                    avatarFileInput.value = ''; 
                    avatarPreview.src = initialAvatarSrc;
                    avatarFileInput.classList.add('is-invalid');
                    avatarFileInput.classList.remove('is-valid');
                    return;
                }
                avatarFileInput.setCustomValidity('');
                avatarFileFeedback.textContent = 'Por favor, selecione uma imagem (png, jpg, gif, webp).';
                avatarFileInput.classList.remove('is-invalid');
                avatarFileInput.classList.add('is-valid');
                const reader = new FileReader();
                reader.onload = (e) => { avatarPreview.src = e.target.result; }
                reader.readAsDataURL(file);
            } else {
                 avatarPreview.src = initialAvatarSrc;
                 avatarFileInput.classList.remove('is-valid', 'is-invalid');
                 avatarFileInput.setCustomValidity('');
                 avatarFileFeedback.textContent = 'Por favor, selecione uma imagem (png, jpg, gif, webp).';
            }
        });

        avatarForm.addEventListener('submit', function(event) {
            // O input de arquivo tem 'required', então o navegador já fará uma validação básica.
            // Se um arquivo for selecionado, as validações de tipo e tamanho no 'change' já terão ocorrido.
            // Podemos re-validar aqui para garantir, especialmente se o usuário conseguir burlar o 'change'.
            if (avatarFileInput.files && avatarFileInput.files.length > 0) {
                const file = avatarFileInput.files[0];
                const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
                 if (!allowedTypes.includes(file.type)) {
                    avatarFileInput.setCustomValidity('Tipo inválido.');
                    avatarFileFeedback.textContent = 'Tipo inválido. Use PNG, JPG, GIF ou WEBP.';
                } else if (file.size > 2 * 1024 * 1024) {
                    avatarFileInput.setCustomValidity('Arquivo grande.');
                    avatarFileFeedback.textContent = 'Arquivo grande demais. Máximo 2MB.';
                } else {
                    avatarFileInput.setCustomValidity(''); // Válido
                }
            } else if (avatarFileInput.required) {
                 avatarFileInput.setCustomValidity('Por favor, selecione um arquivo.');
                 avatarFileFeedback.textContent = 'Por favor, selecione um arquivo.';
            }

            if (!avatarForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            avatarForm.classList.add('was-validated');
        }, false);
    }
});