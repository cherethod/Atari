import Game from "./Game.js"

const powerBtn = document.querySelector('.btn__power');
const canvasContainer = document.querySelector('.canvas__container');
const canvas = document.querySelector('canvas');
const game = new Game(canvas);

powerBtn.addEventListener('click', e => {
  e.target.classList.toggle('active');
  canvasContainer.classList.toggle('active');
  if (game.gameMode === 'off') {
    game.gameMode = 'loading';
    game.loadingVideo.style.display = 'block';
    game.start();
    setInterval(() => {      
      game.mainTheme.pause()
      game.mainTheme.play()
      game.mainTheme.volume = 0.8
    }, 18000);
  }
});

// Start the game loop
game.gameLoop();