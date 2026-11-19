window.FENW = window.FENW || {};

FENW.GameView = class {
  constructor(game) {
    this.game = game;
    this.introPanel = document.getElementById("introPanel");
    this.gamePanel = document.getElementById("gamePanel");
    this.paletteElement = document.getElementById("palette");
    this.currentGuessElement = document.getElementById("currentGuess");
    this.messageElement = document.getElementById("message");
    this.historyElement = document.getElementById("historyContainer");
    this.attemptsLeftElement = document.getElementById("attemptsLeft");
    this.startButton = document.getElementById("startBtn");
    this.sendButton = document.getElementById("sendBtn");
    this.undoButton = document.getElementById("undoBtn");
  }

  init() {
    this.startButton.addEventListener("click", () => this.startGame());
    this.sendButton.addEventListener("click", () => this.sendGuess());
    this.undoButton.addEventListener("click", () => this.undoLastColor());
    this.renderPalette();
    this.render();
  }

  startGame() {
    this.game.start();
    this.introPanel.classList.add("d-none");
    this.gamePanel.classList.remove("d-none");
    this.clearMessage();
    this.enablePalette();
    this.render();
  }

  sendGuess() {
    if (!this.game.isGuessComplete()) {
      this.showMessage("Debes seleccionar 4 colores", "warning");
      return;
    }

    this.game.submitGuess();
    this.clearMessage();
    this.render();
    this.checkGameEnd();
  }

  checkGameEnd() {
    if (!this.game.gameFinished) {
      return;
    }

    this.sendButton.disabled = true;
    this.undoButton.disabled = true;
    this.disablePalette();

    if (this.game.isWon()) {
      this.showMessage(
        "¡Has ganado! Has acertado la combinación secreta.",
        "success",
      );
    } else {
      this.showMessage(
        "Has perdido. La combinación secreta era " +
          this.secretCodeText() +
          ".",
        "danger",
      );
    }

    this.renderEndBanner();
    this.renderSecretReveal();
    this.renderReplayButton();
  }

  renderEndBanner() {
    const won = this.game.isWon();
    const banner = document.createElement("div");
    banner.id = "endBanner";
    banner.className = "end-banner end-banner--" + (won ? "win" : "lose");

    const title = document.createElement("p");
    title.className = "end-banner__title mb-1";
    title.textContent = won ? "¡Has ganado!" : "Has perdido";

    const used = this.game.attemptHistory.length;
    const attemptWord = used === 1 ? " intento." : " intentos.";
    const detail = document.createElement("p");
    detail.className = "end-banner__detail mb-0";
    detail.textContent = won
      ? "Has acertado la combinación secreta en " + used + attemptWord
      : "Se han agotado los " + this.game.maxAttempts + " intentos.";

    banner.appendChild(title);
    banner.appendChild(detail);
    this.historyElement.appendChild(banner);
    banner.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  renderSecretReveal() {
    const reveal = document.createElement("div");
    reveal.className = "secret-reveal";

    const label = document.createElement("span");
    label.textContent = "Combinación secreta:";
    reveal.appendChild(label);

    this.game.secretCode.forEach((colorId) => {
      const dot = document.createElement("span");
      dot.className = "attempt-color";
      dot.style.background = this.colorName(colorId);
      reveal.appendChild(dot);
    });

    this.historyElement.appendChild(reveal);
  }

  secretCodeText() {
    return this.game.secretCode
      .map((colorId) => this.colorLabel(colorId))
      .join(", ");
  }

  colorLabel(colorId) {
    const labels = {
      red: "rojo",
      green: "verde",
      blue: "azul",
      yellow: "amarillo",
      white: "blanco",
    };
    const name = this.colorName(colorId);
    return labels[name] || name;
  }

  renderReplayButton() {
    if (this.historyElement.querySelector("#replayBtn")) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.id = "replayBtn";
    button.className = "btn btn-primary mt-3";
    button.textContent = "Jugar otra vez";
    button.addEventListener("click", () => this.startGame());
    this.historyElement.appendChild(button);
  }

  disablePalette() {
    this.paletteElement.querySelectorAll(".color-swatch").forEach((swatch) => {
      swatch.disabled = true;
    });
  }

  enablePalette() {
    this.paletteElement.querySelectorAll(".color-swatch").forEach((swatch) => {
      swatch.disabled = false;
    });
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
    this.paletteElement.innerHTML = "";

    this.game.colors.forEach((color) => {
      const swatch = document.createElement("button");
      swatch.type = "button";
      swatch.className = "color-swatch";
      swatch.style.background = color.name;
      swatch.addEventListener("click", () => this.pickColor(color.id));
      this.paletteElement.appendChild(swatch);
    });
  }

  renderCurrentGuess() {
    this.currentGuessElement.innerHTML = "";

    for (let i = 0; i < this.game.positions; i++) {
      const slot = document.createElement("span");
      slot.className = "guess-slot";

      if (i < this.game.currentGuess.length) {
        const colorId = this.game.currentGuess[i];
        slot.classList.add("guess-slot--filled");
        slot.style.background = this.colorName(colorId);
      }

      this.currentGuessElement.appendChild(slot);
    }

    this.sendButton.disabled =
      !this.game.isGuessComplete() || this.game.gameFinished;
    this.undoButton.disabled =
      this.game.currentGuess.length === 0 || this.game.gameFinished;
  }

  renderAttemptsLeft() {
    this.attemptsLeftElement.textContent = this.game.attemptsLeft();
  }

  renderHistory() {
    this.historyElement.innerHTML = "";

    if (this.game.attemptHistory.length === 0) {
      const empty = document.createElement("p");
      empty.className = "page-subtitle small mb-0";
      empty.textContent = "Todavía no has hecho ningún intento.";
      this.historyElement.appendChild(empty);
      return;
    }

    this.game.attemptHistory.forEach((attempt, index) => {
      const row = document.createElement("div");
      row.className = "attempt-row";

      const number = document.createElement("span");
      number.className = "attempt-number";
      number.textContent = "#" + (this.game.attemptHistory.length - index);
      row.appendChild(number);

      const colors = document.createElement("span");
      colors.className = "attempt-colors";
      attempt.guess.forEach((colorId) => {
        const dot = document.createElement("span");
        dot.className = "attempt-color";
        dot.style.background = this.colorName(colorId);
        colors.appendChild(dot);
      });
      row.appendChild(colors);

      row.appendChild(this.renderPegs(attempt.blackPegs, attempt.whitePegs));

      this.historyElement.appendChild(row);
    });
  }

  renderPegs(blackPegs, whitePegs) {
    const container = document.createElement("span");
    container.className = "attempt-pegs";

    for (let i = 0; i < this.game.positions; i++) {
      const peg = document.createElement("span");
      peg.className = "peg";

      if (i < blackPegs) {
        peg.classList.add("peg--black");
      } else if (i < blackPegs + whitePegs) {
        peg.classList.add("peg--white");
      } else {
        peg.classList.add("peg--empty");
      }

      container.appendChild(peg);
    }

    return container;
  }

  colorName(colorId) {
    const color = this.game.colors.find((item) => item.id === colorId);
    return color ? color.name : "transparent";
  }

  showMessage(text, type) {
    this.messageElement.textContent = text;
    this.messageElement.className = "alert alert-" + type + " d-block";
  }

  clearMessage() {
    this.messageElement.textContent = "";
    this.messageElement.className = "alert d-block";
  }
};
