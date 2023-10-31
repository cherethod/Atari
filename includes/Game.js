import CONFIGS from "./Configs.js";
import Mario from "./Mario.js";
// import Pow from "./Pow.js";
import Stages from "./Stages.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.canvas.width = CONFIGS.BOARD_WIDTH
    this.canvas.height = CONFIGS.BOARD_HEIGHT
    this.marioSprite = new Image()
    this.marioSprite.src = '../resources/sprites/mario/mario.png'
    this.marios = []
    
    this.pipes = new Image()
    this.pipes.src = '../resources/sprites/stages/pipes.png'
    this.turtles = []
    this.enemiesBeingCreated = false
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
    this.mainTheme = new Audio('../resources/sounds/main_theme.mp3')
    this.gameStartFX = new Audio('../resources/sounds/game_start.mp3')
    this.gameOverFX = new Audio('../resources/sounds/smb_gameover.wav')
    this.stageClearFX = new Audio('../resources/sounds/smb_stage_clear.wav')
    this.keyUpFX = new Audio('../resources/sounds/menu_up.mp3')
    this.keyDownFX = new Audio('../resources/sounds/menu_down.mp3')
    // ** GAME MODES **
    // *  off -> power off
    // *  loading -> brand screen
    // *  lobby -> main menu
    // *  in-stage -> in game
    // ?  start -> apply change to set lobby on

    this.gameMode = 'start' 
    this.keyboardType = 1  // 0 -> (A - D - W - S) -- 1 -> ARROWS (LEFT - RIGHT - UP - DOWN )

    this.liveImg = new Image()
    this.liveImg.src = '../resources/sprites/ui/live.png'   

    this.stages = []   


  }

  createStage() {   
    const newStage = new Stages(
    this.canvas, 
    this.ctx, {
      x: 0,
      y: 0,
    }, 
    this.marios, 
    this.turtles
  )
  this.stages = [newStage]
  newStage.enemiesRemain[newStage.currentStage] = newStage.stageTotalEnemies[newStage.currentStage];

  newStage.createPow()
}

  createMario() {
    const newMario = new Mario(
      this.canvas, 
      this.ctx, 
      this.marioSprite, 
      this.selectorIndex, 
      this.keyboardType
      );
    this.marios.push(newMario)
  }

  addEventListeners() {
    this.keyDownListener = (e) => {
      if(e.code == 'KeyS' || e.code == 'ArrowDown') {
        this.keyDownFX.load()        
        this.keyDownFX.play()        
      }
      if(e.code == 'KeyW' || e.code == 'ArrowUp') {
        this.keyUpFX.load()
        this.keyUpFX.play()
      }
      if (e.code == 'Enter') {      
       if (this.selectorIndex === 0) {
        this.mainTheme.pause()
        this.gameStartFX.play()   
        this.gameStartFX.addEventListener('ended', () => {
          this.mainTheme.currentTime = 0;
          this.mainTheme.play();
          this.marios[0].addEventListeners()
        });   
       }
       else if (this.selectorIndex === 1) {
        alert("The score isn't implemented jet")
       }
      }
    };

    window.addEventListener('keydown', this.keyDownListener);

    this.keyUpListener = (e) => {
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
        if (this.selectorIndex === 0) {
          this.removeEventListeners()
          this.createMario()
          this.createStage()
          this.gameMode = 'in-stage'
          this.mainTheme.pause()
          setInterval(() => {
            // this.marios[0].addEventListeners()
            if (this.stages[0] && this.stages[0].enemiesSpawned == 0) {
              if (!this.enemiesBeingCreated) {
                this.enemiesBeingCreated = true;
                this.stages[0].createEnemies();
              }
            } else {
              this.enemiesBeingCreated = false
            }
          }, 5000);
        }
      }
    };

    window.addEventListener('keyup', this.keyUpListener);
  }

  removeEventListeners() {
    window.removeEventListener('keydown', this.keyDownListener);
    window.removeEventListener('keyup', this.keyUpListener);
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
      this.addEventListeners()
      this.gameMode = 'lobby';
    }

    if (this.gameMode === 'lobby') {
      this.mainTheme.play()
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.drawImage(this.logoImg, (this.canvas.width / 2) - (CONFIGS.LOGO_WIDTH / 2), (this.canvas.height / 2) - (CONFIGS.LOGO_HEIGHT / 2))
      this.ctx.drawImage(this.selectorImg, this.selectorPosX, this.selectorPosY[this.selectorIndex])
      this.ctx.font = '8px Mariofont'
      this.ctx.fillStyle = '#ffa000'
      this.ctx.fillText('START NEW GAME', this.canvas.width/2 - 100, this.canvas.height / 2 + 87)
      this.ctx.fillText('SCORES', this.canvas.width/2 - 100, this.canvas.height / 2 + 119)

    }

    if (this.gameMode === 'in-stage') {

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.stages[0].update()
      this.turtles.forEach(turtle => turtle.update())
      this.ctx.drawImage(this.pipes, 0, 0)
      if (this.stages[0].pows[0] != undefined) this.stages[0].pows[0].update()
      this.marios[0].update()
      for (let i = 0; i < this.marios[0].playerLives; i++){
        this.ctx.drawImage(this.liveImg, 12 + (CONFIGS.LIVE_WIDTH * i) , 20)
      }
      if (this.marios[0].elevatorIsActive) {
        this.ctx.drawImage(
          this.marios[0].elevatorSprite,
          this.marios[0].elevatorAnimations[this.marios[0].elevatorAnimationIndex].x,
          this.marios[0].elevatorAnimations[this.marios[0].elevatorAnimationIndex].y,
          CONFIGS.ELEVATOR_WIDTH,
          CONFIGS.ELEVATOR_HEIGHT,
          ((this.canvas.width / 2) - (CONFIGS.ELEVATOR_WIDTH / 2)),
          this.marios[0].elevatorPosY,
          CONFIGS.ELEVATOR_WIDTH,
          CONFIGS.ELEVATOR_HEIGHT,
        )
      }
    }
  }

  gameLoop() {
    this.update();
    this.draw(); 
    setTimeout(() => {
      requestAnimationFrame(this.gameLoop.bind(this));
  }, 1000 / 60); 
  }

  update() {
  
    if (this.gameMode === 'in-stage') {
      this.stages[0].update();
      this.turtles.forEach(turtle => turtle.update());
      this.stages[0].pows[0].update();
      this.marios[0].update();
      // console.log(`
      // Enemies Count: ${this.marios[0].enemiesCount}\n
      // Enemies Total: ${this.stages[0].stageTotalEnemies[this.stages[0].currentStage]}\n
      // Enemies Remain: ${this.stages[0].enemiesRemain[this.stages[0].currentStage]}\n
      // Enemies Spawn: ${this.stages[0].enemiesSpawned}\n
      
      // `);
      if (this.marios[0].enemiesCount == this.stages[0].stageTotalEnemies[this.stages[0].currentStage] && this.stages[0].enemiesRemain[this.stages[0].currentStage] == 0) {
        console.log('stage clean')
        this.marios[0].position.x = this.canvas.width - (this.marios[0].width /2)
        this.marios[0].position.y = this.canvas.height - this.marios[0].height - CONFIGS.STAGE_FLOOR_HEIGHT
        this.marios[0].velocity.x = 0
        this.marios[0].velocity.y = 1
        this.marios[0].removeEventListeners()
        this.marios[0].setAnimation('idleRight')
        this.stageClearFX.play()
        this.stageClearFX.addEventListener('ended', () => {
          this.marios[0].enemiesCount = 0
          this.stages[0].updateStage()   
          this.enemiesBeingCreated = false
          this.marios[0].addEventListeners()
        })

      }
      if (this.marios[0].status === 'game-over') {
        this.mainTheme.pause()
        this.marios[0].removeEventListeners()
        this.gameOverFX.play()       
        this.gameOverFX.addEventListener('ended', () => {
          this.mainTheme.currentTime = 0;
          this.gameMode = 'start'
          this.mainTheme.play();
          this.marios.splice(0, this.marios.length)
          this.turtles.splice(0, this.turtles.length)
          this.stages.splice(0, this.stages.length)        
        })   
      }
    }
  }
  
  start () {
    if (this.gameMode === 'off') {
      this.gameMode = 'loading';
      this.loadingVideo.style.display = 'block';

      this.gameLoop();

      this.loadingVideo.addEventListener('ended', () => {
        this.gameMode = 'start';
        this.loadingVideo.style.display = 'none';
      });
    }
  }  

}
export default Game;