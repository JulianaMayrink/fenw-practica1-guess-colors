window.FENW = window.FENW || {};

FENW.RegisterView = class {
  constructor() {
    this.form = document.getElementById('registerForm');
  }

  init() {
    if (!this.form) {
      return;
    }

    this.fields = {
      username: this.form.querySelector('#username'),
      email: this.form.querySelector('#email'),
      password: this.form.querySelector('#password'),
      repeatPassword: this.form.querySelector('#repeatPassword')
    };
    this.validators = {
      username: () => this.validateUsername(),
      email: () => this.validateEmail(),
      password: () => this.validatePassword(),
      repeatPassword: () => this.validateRepeat()
    };

    this.form.addEventListener('submit', (event) => this.handleSubmit(event));

    Object.keys(this.fields).forEach((name) => {
      this.fields[name].addEventListener('input', () => this.clearFieldError(name));
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const results = Object.keys(this.validators).map((name) => this.validateField(name));

    if (results.includes(false)) {
      this.focusFirstInvalid();
      return;
    }

    this.showSuccess('Datos correctos. El registro se completará en la próxima práctica.');
  }

  validateField(name) {
    const message = this.validators[name]();

    if (message) {
      this.showFieldError(name, message);
      return false;
    }

    this.clearFieldError(name);
    return true;
  }

  validateUsername() {
    const value = this.fields.username.value.trim();

    if (!value) {
      return 'El usuario es obligatorio';
    }

    if (value.length > 8) {
      return 'El usuario no puede superar los 8 caracteres';
    }

    return '';
  }

  validateEmail() {
    const value = this.fields.email.value.trim();

    if (!value) {
      return 'El correo es obligatorio';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'El correo electrónico no es válido';
    }

    return '';
  }

  validatePassword() {
    if (!this.fields.password.value) {
      return 'La contraseña es obligatoria';
    }

    return '';
  }

  validateRepeat() {
    if (!this.fields.repeatPassword.value) {
      return 'Debes repetir la contraseña';
    }

    if (this.fields.password.value !== this.fields.repeatPassword.value) {
      return 'Las contraseñas no coinciden';
    }

    return '';
  }

  showFieldError(name, message) {
    this.fields[name].classList.add('is-invalid');
    this.errorElement(name).textContent = message;
  }

  clearFieldError(name) {
    this.fields[name].classList.remove('is-invalid');
    this.errorElement(name).textContent = '';
  }

  errorElement(name) {
    return this.form.querySelector('#' + name + 'Error');
  }

  focusFirstInvalid() {
    const firstInvalid = this.form.querySelector('.is-invalid');

    if (firstInvalid) {
      firstInvalid.focus();
    }
  }

  showSuccess(text) {
    const box = this.successElement();
    box.textContent = text;
    box.classList.remove('d-none');
  }

  successElement() {
    let box = this.form.querySelector('#registerSuccess');

    if (!box) {
      box = document.createElement('div');
      box.id = 'registerSuccess';
      box.className = 'alert alert-success mt-3';
      this.form.appendChild(box);
    }

    return box;
  }
};
