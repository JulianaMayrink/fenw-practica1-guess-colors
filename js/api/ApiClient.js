window.FENW = window.FENW || {};

FENW.ApiClient = class {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || 'http://fenw.etsisi.upm.es:4500';
  }

  async login(username, password) {
    const params = new URLSearchParams({ username: username, password: password });
    const response = await fetch(this.buildUrl('/users/login', params), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    return this.extractToken(response);
  }

  async getScores() {
    const response = await fetch(this.buildUrl('/scores'), { method: 'GET' });

    if (!response.ok) {
      throw new Error('No se han podido obtener los records');
    }

    return response.json();
  }

  async getColors() {
    const response = await fetch(this.buildUrl('/game/colors'), { method: 'GET' });

    if (!response.ok) {
      throw new Error('No se han podido obtener los colores');
    }

    return response.json();
  }

  buildUrl(path, params) {
    const url = this.baseUrl + path;
    return params ? url + '?' + params.toString() : url;
  }

  async extractToken(response) {
    const header = response.headers.get('Authorization');

    if (header) {
      return header;
    }

    const body = await response.json();
    return typeof body === 'string' ? body : null;
  }
};
