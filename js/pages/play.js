window.FENW = window.FENW || {};

document.addEventListener("DOMContentLoaded", function () {
  const game = new FENW.Game();
  const gameView = new FENW.GameView(game);

  gameView.init();
});
