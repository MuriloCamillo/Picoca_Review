/**
 * @fileoverview Adiciona máscara e validação de CPF ao campo correspondente
 * no formulário da página de cadastro (sign_up.html).
 * Integra-se com a validação do Bootstrap 5.
 */

document.addEventListener('DOMContentLoaded', function() {
    const cpfInput = document.getElementById('cpf');
    
    // Máscara para o formato do CPF
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            e.target.value = value;
        }
    });

    /**
         * Valida um número de CPF brasileiro.
         * Implementação baseada no algoritmo da Receita Federal.
         * @param {string} cpf - O CPF a ser validado (pode conter máscara).
         * @returns {boolean} True se o CPF for válido, False caso contrário.
         */
    // Função de validação do CPF
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');

        if (cpf.length !== 11) return false;

        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cpf)) return false;

        let cpfDigitos = cpf.split('').map(Number);
        const b1Original = cpfDigitos[9];
        const b2Original = cpfDigitos[10];

        // Calcula primeiro dígito
        let soma1 = 0;
        for (let i = 0; i < 9; i++) {
            soma1 += cpfDigitos[i] * (i + 1);
        }
        let resto1 = soma1 % 11;
        let b1Calculado = (resto1 === 10) ? 0 : resto1;

        // Calcula segundo dígito
        let soma2 = 0;
        for (let i = 0; i < 9; i++) {
            soma2 += cpfDigitos[i] * (9 - i);
        }
        let resto2 = soma2 % 11;
        let b2Calculado = (resto2 === 10) ? 0 : resto2;

        return (b1Calculado === b1Original && b2Calculado === b2Original);
    }

    // Validação do formulário
    const form = document.querySelector('.needs-validation');
    form.addEventListener('submit', function(event) {
        if (!form.checkValidity() || !validarCPF(cpfInput.value)) {
            event.preventDefault();
            event.stopPropagation();
            
            if (!validarCPF(cpfInput.value)) {
                cpfInput.setCustomValidity('CPF inválido');
            } else {
                cpfInput.setCustomValidity('');
            }
        }
        
        form.classList.add('was-validated');
    });
});