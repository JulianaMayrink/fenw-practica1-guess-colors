window.FENW = window.FENW || {};

FENW.Game = class {
  constructor(colors) {
    this.positions = 4;
    this.maxAttempts = 12;
    this.colors = colors || [
      { id: 0, name: 'red' },
      { id: 1, name: 'green' },
      { id: 2, name: 'blue' },
      { id: 3, name: 'yellow' },
      { id: 4, name: 'white' }
    ];
    this.secretCode = [];
    this.currentGuess = [];
    this.attemptHistory = [];
    this.gameFinished = false;
  }

  start() {
    this.secretCode = this.generateSecretCode();
    this.currentGuess = [];
    this.attemptHistory = [];
    this.gameFinished = false;
  }

  generateSecretCode() {
    const code = [];

    for (let i = 0; i < this.positions; i++) {
      code.push(Math.floor(Math.random() * this.colors.length));
    }

    return code;
  }
};
