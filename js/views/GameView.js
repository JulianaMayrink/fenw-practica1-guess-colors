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
