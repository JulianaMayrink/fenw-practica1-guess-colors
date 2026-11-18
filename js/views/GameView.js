window.FENW = window.FENW || {};

FENW.GameView = class {
  constructor(game) {
    this.game = game;
    this.introPanel = document.getElementById('introPanel');
    this.gamePanel = document.getElementById('gamePanel');
    this.paletteElement = document.getElementById('palette');
    this.currentGuessElement = document.getElementById('currentGuess');
    this.messageElement = document.getElementById('message');
    this.historyElement = document.getElementById('historyContainer');
    this.attemptsLeftElement = document.getElementById('attemptsLeft');
    this.startButton = document.getElementById('startBtn');
    this.sendButton = document.getElementById('sendBtn');
    this.undoButton = document.getElementById('undoBtn');
  }

  init() {
    this.startButton.addEventListener('click', () => this.startGame());
    this.sendButton.addEventListener('click', () => this.sendGuess());
    this.undoButton.addEventListener('click', () => this.undoLastColor());
    this.renderPalette();
    this.render();
  }

  startGame() {
    this.game.start();
    this.introPanel.classList.add('d-none');
    this.gamePanel.classList.remove('d-none');
    this.render();
  }

  sendGuess() {
    if (!this.game.isGuessComplete()) {
      this.showMessage('Debes seleccionar 4 colores', 'warning');
      return;
    }

    this.game.submitGuess();
    this.render();
  }

  undoLastColor() {
    this.game.removeLastColor();
    this.render();
  }

  pickColor(colorId) {
    if (!this.game.addColor(colorId)) {
      return;
    }

    this.clearMessage();
    this.render();
  }

  render() {
    this.renderCurrentGuess();
    this.renderHistory();
    this.renderAttemptsLeft();
  }

  renderPalette() {
    this.paletteElement.innerHTML = '';

    this.game.colors.forEach((color) => {
      const swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className = 'color-swatch';
      swatch.style.background = color.name;
      swatch.setAttribute('aria-label', color.name);
      swatch.addEventListener('click', () => this.pickColor(color.id));
      this.paletteElement.appendChild(swatch);
    });
  }

  renderCurrentGuess() {
    this.currentGuessElement.innerHTML = '';

    for (let i = 0; i < this.game.positions; i++) {
      const slot = document.createElement('span');
      slot.className = 'guess-slot';

      if (i < this.game.currentGuess.length) {
        const colorId = this.game.currentGuess[i];
        slot.classList.add('guess-slot--filled');
        slot.style.background = this.colorName(colorId);
      }

      this.currentGuessElement.appendChild(slot);
    }

    this.sendButton.disabled = !this.game.isGuessComplete() || this.game.gameFinished;
    this.undoButton.disabled = this.game.currentGuess.length === 0 || this.game.gameFinished;
  }

  renderAttemptsLeft() {
    this.attemptsLeftElement.textContent = this.game.attemptsLeft();
  }

  renderHistory() {
    this.historyElement.innerHTML = '';

    if (this.game.attemptHistory.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'page-subtitle small mb-0';
      empty.textContent = 'Todavía no has hecho ningún intento.';
      this.historyElement.appendChild(empty);
      return;
    }

    this.game.attemptHistory.forEach((attempt, index) => {
      const row = document.createElement('div');
      row.className = 'attempt-row';

      const number = document.createElement('span');
      number.className = 'attempt-number';
      number.textContent = '#' + (this.game.attemptHistory.length - index);
      row.appendChild(number);

      const colors = document.createElement('span');
      colors.className = 'attempt-colors';
      attempt.guess.forEach((colorId) => {
        const dot = document.createElement('span');
        dot.className = 'attempt-color';
        dot.style.background = this.colorName(colorId);
        colors.appendChild(dot);
      });
      row.appendChild(colors);

      row.appendChild(this.renderPegs(attempt.blackPegs, attempt.whitePegs));

      this.historyElement.appendChild(row);
    });
  }

  renderPegs(blackPegs, whitePegs) {
    const container = document.createElement('span');
    container.className = 'attempt-pegs';

    for (let i = 0; i < this.game.positions; i++) {
      const peg = document.createElement('span');
      peg.className = 'peg';

      if (i < blackPegs) {
        peg.classList.add('peg--black');
      } else if (i < blackPegs + whitePegs) {
        peg.classList.add('peg--white');
      } else {
        peg.classList.add('peg--empty');
      }

      container.appendChild(peg);
    }

    return container;
  }

  colorName(colorId) {
    const color = this.game.colors.find((item) => item.id === colorId);
    return color ? color.name : 'transparent';
  }

  showMessage(text, type) {
    this.messageElement.textContent = text;
    this.messageElement.className = 'alert alert-' + type + ' d-block';
  }

  clearMessage() {
    this.messageElement.textContent = '';
    this.messageElement.className = 'alert d-block';
  }
};
