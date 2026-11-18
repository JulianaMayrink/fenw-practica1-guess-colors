window.FENW = window.FENW || {};

FENW.LoginView = class {
  constructor(apiClient, authStorage) {
    this.apiClient = apiClient;
    this.authStorage = authStorage;
    this.form = document.getElementById('loginForm');
    this.message = null;
  }

  init() {
    if (!this.form) {
      return;
    }

    this.usernameInput = this.form.querySelector('#username');
    this.passwordInput = this.form.querySelector('#password');
    this.submitButton = this.form.querySelector('button[type="submit"]');
    this.message = this.createMessageArea();

    this.form.addEventListener('submit', (event) => this.handleSubmit(event));
  }

  createMessageArea() {
    const area = document.createElement('div');
    area.className = 'alert d-none mt-3';
    area.setAttribute('role', 'alert');
    this.form.appendChild(area);
    return area;
  }

  async handleSubmit(event) {
    event.preventDefault();

    const username = this.usernameInput.value.trim();
    const password = this.passwordInput.value;

    if (!username || !password) {
      this.showMessage('Debes rellenar usuario y contraseña', 'danger');
      return;
    }

    this.submitButton.disabled = true;

    try {
      const token = await this.apiClient.login(username, password);
      this.authStorage.saveToken(token);
      this.showMessage('Sesión iniciada correctamente', 'success');
      this.form.reset();
    } catch (error) {
      this.showMessage(error.message, 'danger');
    } finally {
      this.submitButton.disabled = false;
    }
  }

  showMessage(text, type) {
    this.message.textContent = text;
    this.message.className = 'alert alert-' + type + ' mt-3';
  }
};
