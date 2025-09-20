class FormValidator {
    constructor() {
        this.strategies = {};
        this.errorMessages = {};
    }

    addStrategy(field, validator, errorMessage) {
        this.strategies[field] = validator;
        this.errorMessages[field] = errorMessage;
        return this;
    }

    validateField(field, value) {
        const validator = this.strategies[field];
        if (validator && !validator(value)) {
            return {
                isValid: false,
                message: this.errorMessages[field]
            };
        }
        return {isValid: true};
    }

    validateAll(formData) {
        const errors = {};
        let isValid = true;

        for (const [field, value] of Object.entries(formData)) {
            const result = this.validateField(field, value);
            if (!result.isValid) {
                errors[field] = result.message;
                isValid = false;
            }
        }

        return {isValid, errors};
    }
}

class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.validator = new FormValidator();
        this.setupValidators();
        this.bindEvents();
    }

    setupValidators() {
        this.validator
            .addStrategy('nombre',
                value => value.trim().length >= 2,
                'El nombre debe tener al menos 2 caracteres')
            .addStrategy('correo',
                value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                'Ingresa un correo electrónico válido')
            .addStrategy('telefono',
                value => !value || /^[\+]?[0-9\s\-\(\)]{10,}$/.test(value),
                'Ingresa un número de teléfono válido')
            .addStrategy('mensaje',
                value => value.trim().length >= 10,
                'El mensaje debe tener al menos 110 caracteres');
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateFieldOnBlur(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = this.getFormData();
        const validation = this.validator.validateAll(formData);

        if (validation.isValid) {
            this.showSuccess();
            this.form.reset();
            this.clearAllErrors();
        } else {
            this.showErrors(validation.errors);
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }

    validateFieldOnBlur(input) {
        const result = this.validator.validateField(input.name, input.value);
        if (!result.isValid) {
            this.showFieldError(input, result.message);
        } else {
            this.clearFieldError(input);
            this.markFieldSuccess(input);
        }
    }

    showFieldError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        formGroup.classList.add('error');
        formGroup.classList.remove('success');
        errorElement.textContent = message;
    }

    clearFieldError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
    }

    markFieldSuccess(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('success');
    }

    showErrors(errors) {
        for (const [fieldName, message] of Object.entries(errors)) {
            const input = this.form.querySelector(`[name="${fieldName}"]`);
            if (input) {
                this.showFieldError(input, message);
            }
        }
    }

    clearAllErrors() {
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
        });
    }

    showSuccess() {
        const toast = document.getElementById("success-message");
        toast.classList.add("show");

        // Ocultar automáticamente después de 4 segundos
        setTimeout(() => {
            toast.classList.remove("show");
        }, 4000);
    }
}

// INICIALIZAR LA APLICACIÓN
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm('form-contacto');
});

// SMOOTH SCROLL PARA NAVEGACIÓN
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});