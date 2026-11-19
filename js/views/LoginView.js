window.FENW = window.FENW || {};

FENW.LoginView = class {
  constructor(apiClient, authStorage) {
    this.apiClient = apiClient;
    this.authStorage = authStorage;
    this.form = document.getElementById("loginForm");
    this.message = null;
  }

  init() {
    if (!this.form) {
      return;
    }

    this.usernameInput = this.form.querySelector("#username");
    this.passwordInput = this.form.querySelector("#password");
    this.submitButton = this.form.querySelector('button[type="submit"]');
    this.message = this.createMessageArea();
    this.logoutButton = this.createLogoutButton();

    this.form.addEventListener("submit", (event) => this.handleSubmit(event));
    this.renderSessionState();
  }

  renderSessionState() {
    if (this.authStorage.hasToken()) {
      this.showMessage("Ya has iniciado sesión.", "success");
      this.logoutButton.classList.remove("d-none");
    }
  }

  createLogoutButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline-secondary w-100 mt-2 d-none";
    button.textContent = "Cerrar sesión";
    button.addEventListener("click", () => this.handleLogout());
    this.form.appendChild(button);
    return button;
  }

  handleLogout() {
    this.authStorage.clear();
    this.form.reset();
    this.logoutButton.classList.add("d-none");
    this.showMessage("Sesión cerrada.", "secondary");
  }

  createMessageArea() {
    const area = document.createElement("div");
    area.className = "alert d-none mt-3";
    this.form.appendChild(area);
    return area;
  }

  async handleSubmit(event) {
    event.preventDefault();

    const username = this.usernameInput.value.trim();
    const password = this.passwordInput.value;

    if (!username || !password) {
      this.showMessage("Debes rellenar usuario y contraseña", "danger");
      return;
    }

    this.submitButton.disabled = true;

    try {
      const token = await this.apiClient.login(username, password);
      this.authStorage.saveToken(token);
      this.showMessage("Sesión iniciada correctamente", "success");
      this.logoutButton.classList.remove("d-none");
      this.form.reset();
    } catch (error) {
      this.showMessage(error.message, "danger");
    } finally {
      this.submitButton.disabled = false;
    }
  }

  showMessage(text, type) {
    this.message.textContent = text;
    this.message.className = "alert alert-" + type + " mt-3";
  }
};
