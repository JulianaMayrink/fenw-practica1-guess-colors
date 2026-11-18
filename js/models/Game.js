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

  evaluateGuess(secret, guess) {
    const used = new Array(secret.length).fill(false);
    let black = 0;
    let white = 0;

    for (let i = 0; i < secret.length; i++) {
      if (guess[i] === secret[i]) {
        black++;
        used[i] = true;
      }
    }

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === secret[i]) {
        continue;
      }

      for (let j = 0; j < secret.length; j++) {
        if (!used[j] && guess[i] === secret[j]) {
          white++;
          used[j] = true;
          break;
        }
      }
    }

    return { black: black, white: white };
  }
};
