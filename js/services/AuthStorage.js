window.FENW = window.FENW || {};

FENW.AuthStorage = class {
  constructor(storageKey) {
    this.storageKey = storageKey || "fenw.auth.token";
  }

  saveToken(token) {
    localStorage.setItem(this.storageKey, token);
  }

  getToken() {
    const token = localStorage.getItem(this.storageKey);

    if (!token) {
      return null;
    }

    if (this.isExpired(token)) {
      this.clear();
      return null;
    }

    return token;
  }

  hasToken() {
    return Boolean(this.getToken());
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }

  isExpired(token) {
    const payload = this.decodePayload(token);

    if (!payload) {
      return true;
    }

    if (!payload.exp) {
      return false;
    }

    return payload.exp * 1000 <= Date.now();
  }

  decodePayload(token) {
    const base64 = token.replace("Bearer ", "").split(".")[1];

    if (!base64) {
      return null;
    }

    try {
      const normalizado = base64.replaceAll("-", "+").replaceAll("_", "/");
      const relleno = normalizado.padEnd(
        normalizado.length + ((4 - (normalizado.length % 4)) % 4),
        "=",
      );
      return JSON.parse(atob(relleno));
    } catch (error) {
      return null;
    }
  }
};
