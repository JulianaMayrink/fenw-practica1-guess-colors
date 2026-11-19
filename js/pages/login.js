window.FENW = window.FENW || {};

document.addEventListener("DOMContentLoaded", function () {
  const apiClient = new FENW.ApiClient();
  const authStorage = new FENW.AuthStorage();
  const loginView = new FENW.LoginView(apiClient, authStorage);

  loginView.init();
});
