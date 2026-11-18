window.FENW = window.FENW || {};

FENW.AuthStorage = class {
  constructor(storageKey) {
    this.storageKey = storageKey || 'fenw.auth.token';
  }

  saveToken(token) {
    localStorage.setItem(this.storageKey, token);
  }

  getToken() {
    return localStorage.getItem(this.storageKey);
  }

  hasToken() {
    return Boolean(this.getToken());
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }
};
