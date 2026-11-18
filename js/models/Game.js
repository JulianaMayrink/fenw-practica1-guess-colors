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

  addColor(colorId) {
    if (this.gameFinished || this.currentGuess.length >= this.positions) {
      return false;
    }

    this.currentGuess.push(colorId);
    return true;
  }

  removeLastColor() {
    if (this.gameFinished) {
      return false;
    }

    return this.currentGuess.pop() !== undefined;
  }

  isGuessComplete() {
    return this.currentGuess.length === this.positions;
  }

  submitGuess() {
    if (!this.isGuessComplete()) {
      return null;
    }

    const result = this.evaluateGuess(this.secretCode, this.currentGuess);

    this.attemptHistory.unshift({
      guess: [...this.currentGuess],
      blackPegs: result.black,
      whitePegs: result.white
    });

    if (result.black === this.positions || this.attemptHistory.length >= this.maxAttempts) {
      this.gameFinished = true;
    }

    this.currentGuess = [];

    return result;
  }

  isWon() {
    const last = this.attemptHistory[0];
    return this.gameFinished && Boolean(last) && last.blackPegs === this.positions;
  }

  isLost() {
    return this.gameFinished && !this.isWon();
  }

  attemptsLeft() {
    return this.maxAttempts - this.attemptHistory.length;
  }
};
