import CONFIGS from "./Configs.js";
import Mario from "./Mario.js";
import Pow from "./Pow.js";
import Stages from "./Stages.js";

class Game {
  constructor(canvas) {
    // this.position = position
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.canvas.width = CONFIGS.BOARD_WIDTH
    this.canvas.height = CONFIGS.BOARD_HEIGHT
    this.marioSprite = new Image()
    this.marioSprite.src = '../resources/sprites/mario/mario.png'
    this.mario = new Mario(this.canvas, this.ctx, this.marioSprite, this.selectorIndex, this.keyboardType);
    this.pipes = new Image()
    this.pipes.src = '../resources/sprites/stages/pipes.png'
    this.turtles = []
    this.loadingVideo = document.getElementById('loadingVideo')
    this.logoImg = new Image()
    this.logoImg.src = '../resources/sprites/ui/lobby_logo.png'
    this.selectorImg = new Image()
    this.selectorImg.src = '../resources/sprites/ui/selector.png'
    this.selectorPosX = this.canvas.width / 2 - 139
    this.selectorPosY =  {
      0: [this.canvas.height / 2 + 73],
      1: [this.canvas.height / 2 + 105]
    }

    this.selectorIndex = 0
    this.stage = new Stages(this.canvas, this.ctx, {
      x: 0,
      y: 0,
    }, this.mario, this.turtles);
    this.pow = new Pow(this.canvas, this.ctx, {
      x: 240,
      y: 320
    }, this.mario, this.turtles);
    
    this.gameMode = 'off'
    this.keyboardType = 1  // 0 -> (A - D - W - S) -- 1 -> ARROWS (LEFT - RIGHT - UP - DOWN )
    
  }


  addEventListeners() {
    this.keyDownListener = (e) => {
    };

    window.addEventListener('keydown', this.keyDownListener);

    this.keyUpListener = (e) => {
      console.log(e.code);
      if(e.code == 'KeyS' || e.code == 'ArrowDown') {
        switch (this.selectorIndex) {
          case 0:
            this.selectorIndex++            
            break
          case 1: 
            this.selectorIndex = 0
            break       
          default:
            break;
        }
      }
      if(e.code == 'KeyW' || e.code == 'ArrowUp') {
        switch (this.selectorIndex) {
          case 0:
            this.selectorIndex = 1           
            break
          case 1: 
            this.selectorIndex--
            break       
          default:
            break;
        }
      }
      if (e.code == 'Enter') {
        this.removeEventListeners()
        this.gameMode = 'in-stage'
        this.mario.addEventListeners()
      }
    };

    window.addEventListener('keyup', this.keyUpListener);
  }

  removeEventListeners() {
    window.removeEventListener('keydown', this.keyDownListener);
    window.removeEventListener('keyup', this.keyUpListener);
  }

  createEnemies() {
    let enemiesCount;
    switch (stage.currentStage) {
      case 1:
        enemiesCount = 10
        break;
      case 2: 
        enemiesCount = 15
        break;
      case 3:
        enemiesCount = 20
        break;
      default:
        break;
    }

    const generateEnemies = async () => {
      const randomSpawn = Math.random()
      let direction = (randomSpawn >= (1 - randomSpawn)) ? 0 : 1
        const newTurtle = new Turtle(this.canvas, this.ctx, {
          x: (direction == 0) ? this.canvas.width - 96 : 64,
          y: 48
        }, direction, this.mario, this.turtles, this.pow)
        turtles.push(newTurtle)
    }

    const spawnDelay = 2000
    const spawnInterval = 5000
    let enemiesRemain = stage.enemiesCount[stage.currentStage]
    const spawnEnemies = () => {
      if (enemiesRemain > 0) {
        generateEnemies()
        console.log(enemiesRemain);
        enemiesRemain--
        setTimeout(() => {
          spawnEnemies()
        }, spawnInterval);
      }
    }
    setTimeout(() => {
      spawnEnemies()
    }, spawnDelay);
  }



  draw () {
    if (this.gameMode === 'loading') {
      this.loadingVideo.style.display = 'block';
      this.loadingVideo.play();
    
      this.loadingVideo.addEventListener('ended', () => {
        this.gameMode = 'start';
        this.loadingVideo.style.display = 'none';
      });
    }

    if (this.gameMode === 'start') {
      // this.mario.addEventListeners();
      this.addEventListeners()
      this.gameMode = 'lobby';
    }

    if (this.gameMode === 'lobby') {
      // this.gameMode = 'in-stage';
      // if (this.selectorIndex == null) this.addEventListeners()
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.drawImage(this.logoImg, (this.canvas.width / 2) - (CONFIGS.LOGO_WIDTH / 2), (this.canvas.height / 2) - (CONFIGS.LOGO_HEIGHT / 2))
      this.ctx.drawImage(this.selectorImg, this.selectorPosX, this.selectorPosY[this.selectorIndex])
    }

    if (this.gameMode === 'in-stage') {

      // Render the game elements - //*! NEW 
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
      this.ctx.drawImage(this.pipes, 0, 0);
      this.stage.update(); // Render the stage
      this.turtles.forEach(turtle => turtle.render()); // Render turtles
      this.pow.update(); // Render POW or other elements
      this.mario.update(); // Render Mario
    }
  }

  gameLoop() {
    this.update(); // Update the game state
    this.draw(); // Render the game
    // requestAnimationFrame(this.gameLoop.bind(this)); // Continue the game loop
    setTimeout(() => {
      requestAnimationFrame(this.gameLoop.bind(this));
  }, 1000 / 60); // 30 frames per second
  }

  update() {
    if (this.gameMode === 'in-stage') {
      this.stage.update();
      this.turtles.forEach(turtle => turtle.update());
      this.pow.update();
      this.mario.update();
    }
  }
  
  start () {
    if (this.gameMode === 'off') {
      this.gameMode = 'loading';
      this.loadingVideo.style.display = 'block';

      // Start the game loop
      this.gameLoop();

      // Additional code to handle video loading and game initialization
      this.loadingVideo.addEventListener('ended', () => {
        this.gameMode = 'start';
        // this.addEventListeners()
        this.loadingVideo.style.display = 'none';
      });
      this.createEnemies(); // You may want to call this here
    }
  }  

}
export default Game;