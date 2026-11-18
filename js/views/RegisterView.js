window.FENW = window.FENW || {};

FENW.RegisterView = class {
  constructor() {
    this.form = document.getElementById('registerForm');
    this.message = null;
  }

  init() {
    if (!this.form) {
      return;
    }

    this.usernameInput = this.form.querySelector('#username');
    this.emailInput = this.form.querySelector('#email');
    this.passwordInput = this.form.querySelector('#password');
    this.repeatInput = this.form.querySelector('#repeatPassword');
    this.message = this.createMessageArea();

    this.form.addEventListener('submit', (event) => this.handleSubmit(event));
  }

  createMessageArea() {
    const area = document.createElement('div');
    area.className = 'alert d-none mt-3';
    this.form.appendChild(area);
    return area;
  }

  handleSubmit(event) {
    event.preventDefault();

    const error = this.validate();

    if (error) {
      this.showMessage(error, 'danger');
      return;
    }

    this.showMessage(
      'Datos correctos. El registro se completará en la próxima práctica.',
      'success'
    );
  }

  validate() {
    const username = this.usernameInput.value.trim();
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;
    const repeat = this.repeatInput.value;

    if (!username || !email || !password || !repeat) {
      return 'Debes rellenar todos los campos';
    }

    if (username.length > 8) {
      return 'El usuario no puede superar los 8 caracteres';
    }

    if (!this.isValidEmail(email)) {
      return 'El correo electrónico no es válido';
    }

    if (password !== repeat) {
      return 'Las contraseñas no coinciden';
    }

    return null;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showMessage(text, type) {
    this.message.textContent = text;
    this.message.className = 'alert alert-' + type + ' mt-3';
  }
};
