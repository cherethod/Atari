import CONFIGS from "./Configs.js"
import marioCollisions from "./MarioCollisions.js"

class Mario {
  constructor(canvas, ctx, sprite) {
    this.position = {
      x: 240,
      y: 360
    }
    this.canvas = canvas
    this.ctx = ctx
    this.width = 32
    this.height = 48
    this.velocity = {
      x: 0,
      y: 1,
    }
    this.jumpSize = CONFIGS.MARIO_JUMP
    this.marioSprite = sprite
    this.animations = {
      'idleRight': [{ x: 0, y: 0 }],
      'idleLeft': [{ x: this.width * 19, y: 0 }],
      'runRight': [
        { x: this.width, y: 0 },
        { x: this.width * 2, y: 0 },
        { x: this.width * 3, y: 0 },
      ],
      'runLeft': [
        { x: this.width * 18, y: 0 },
        { x: this.width * 17, y: 0 },
        { x: this.width * 16, y: 0 },
      ],
      'jumpRight': [{x: this.width * 4, y: 0}],
      'jumpLeft': [{x: this.width * 15, y: 0}],
      'stop': [{x: this.width * 5, y: 0}],
      'fall': [{x: this.width * 7, y: 0}],
    }
    this.frameIndex = 0
    this.currentAnimation = 'idleRight'
    this.animationSpeed = 5
    this.animationCounter = 0
    this.direction = 1 // 1 right  -  0 left
    this.status = 'alive'
    this.playerLives = CONFIGS.PLAYER_LIVES
    this.score = 0
    this.points = {
      0: 20, // Hit an enemy 
      1: 800, // Kill an enemy
      2: 400, // Get coin
      3: 500  // Stage clear
    }
    this.enemiesCount = 0

    //  * Pressed side keys map
    this.pressedKeys = {
      left: {
        pressed: false,
      },
      right: {
        pressed: false,
      },
      space: {
        pressed: false
      },
      enter: {
        pressed: false
      }
    }
    this.fxSounds =  document.querySelector('#effect-sounds')

    this.marioCollisions = marioCollisions

    this.elevatorSprite = new Image()
    this.elevatorSprite.src = '../resources/sprites/stages/elevator.png'
    this.elevatorAnimations = {
      0: {x: 0, y: 0},
      1: {x: CONFIGS.ELEVATOR_WIDTH, y: 0},
      2: {x: CONFIGS.ELEVATOR_WIDTH * 2, y: 0},
    }
    this.elevatorPosY = -50
    this.elevatorAnimationIndex = 0
    this.elevatorCounter = 0
    this.elevatorSpeed = 5
    this.elevatorIsActive = false
    this.elevatorArrayIndex = 0  

    this.jumpFX = new Audio('../resources/sounds/smb_jump-small.wav')
  }

  
  addEventListeners() {
    this.keyDownListener = (e) => {
      if (this.status === 'alive' || this.status === 'stand-by') {
        switch (e.code) {
          case 'KeyA':
          case 'ArrowLeft':
            if (!this.pressedKeys.left.pressed && this.status === 'stand-by') this.status = 'alive'
            if (!this.pressedKeys.left.pressed) this.setAnimation('runLeft');
            this.pressedKeys.left.pressed = true;
            this.direction = 0;
            break;
          case 'KeyD':
          case 'ArrowRight':
            if (!this.pressedKeys.right.pressed && this.status === 'stand-by') this.status = 'alive'
            if (!this.pressedKeys.right.pressed) this.setAnimation('runRight');
            this.pressedKeys.right.pressed = true;
            this.direction = 1;
            break;
          case 'Space':
            if (!this.pressedKeys.space.pressed && this.status === 'stand-by') this.status = 'alive'
            if (!this.pressedKeys.space.pressed && this.direction === 0) this.setAnimation('jumpLeft');
            if (!this.pressedKeys.space.pressed && this.direction === 1) this.setAnimation('jumpRight');
            this.pressedKeys.space.pressed = true;
            this.jumpSize =  (this.checkJumpCollision() < CONFIGS.MARIO_JUMP) ? this.checkJumpCollision() -1 : CONFIGS.MARIO_JUMP;
            if (this.isOverFloor() && Math.round(this.position.y) >= 0) {
              if (Math.round(this.position.y) - this.jumpSize >= 0) {
                this.velocity.y = -this.jumpSize;
                
                this.jumpFX.play()
              } else if (Math.round(Math.round(this.position.y)) - this.jumpSize < 0) {
                alert('Cannot jump any higher');
              }
            }
            break;
            case 'Enter':
              this.pressedKeys.enter.pressed = true  
              this.activeElevator()     
              // this.devMode = !this.devMode      
              break
          default: 
            break;
        }
      }
    };

    window.addEventListener('keydown', this.keyDownListener);

    this.keyUpListener = (e) => {
      if (this.status === 'alive' || this.status === 'stand-by') {
        switch (e.code) {
          case 'KeyA':
          case 'ArrowLeft':
            this.pressedKeys.left.pressed = false;
            break;
          case 'KeyD':
          case 'ArrowRight':
            this.pressedKeys.right.pressed = false;
            break;
          case 'Space':
            this.pressedKeys.space.pressed = false;
            break;
          case 'Enter':
            this.pressedKeys.enter.pressed = false
            break
          default:
            break;
        }
      }
    };

    window.addEventListener('keyup', this.keyUpListener);
  }

  removeEventListeners() {
    window.removeEventListener('keydown', this.keyDownListener);
    window.removeEventListener('keyup', this.keyUpListener);
  }

  updateScore(index) {
    this.score += this.points[index]
  }

  activeElevator() {

    if (this.status != 'game-over') {
      this.status = 'stand-by'; /* temp fix */
      this.playerLives--; /* temp fix */
      this.position.y = -105;
      this.position.x = this.canvas.width / 2 - this.height / 2 + 8;
      this.elevatorIsActive = true;
      this.elevatorArrayIndex = 0
      this.elevatorAnimationIndex = 0
      const downElevator = setInterval(() => {
        this.elevatorPosY += 1;
        this.position.y += 1;
        if (this.elevatorPosY > 0) {
          // ... Código para actualizar marioCollisions
        }
        this.elevatorArrayIndex++;
        if (this.elevatorPosY >= 80) {      
          clearInterval(downElevator);
          this.disableElevator();
        }
      }, 1000 / 60);
    }    
  }

disableElevator() {
      setInterval(() => {      
      }, 1000);
    const updateElevator = setInterval(() => {
      this.elevatorAnimationIndex++
      if (this.elevatorAnimationIndex > 2) {
        this.elevatorIsActive = false  
        this.velocity.y = 1
        this.elevatorPosY = -50
        // this.status = 'alive'  

        this.elevatorArrayIndex = 0
        clearInterval(updateElevator)
      }
    }, 4000);
}

  updateAnimation() {
    let animation = this.animations[this.currentAnimation]
    if (animation) {
      this.animationCounter++
      if (this.animationCounter >= this.animationSpeed) {
        this.animationCounter = 0
        this.frameIndex = (this.frameIndex + 1) % animation.length
      }
    }
  }

  setAnimation (animationName) {
    this.frameIndex = 0
    this.currentAnimation = animationName
    this.animationCounter = 0
  }

  fixPositions () {
    // this should fix ** que mario se meta dentro de las texturas de los suelos
    if (this.position.y >= 370 && this.status == 'alive') this.position.y = 367 // fix mario se mete en el suelo de abajo
    if (this.position.y <= 0 && this.status == 'alive') this.position.y = 0 // mario no puede saltar mas del limite superior de la pantalla
    if (this.pressedKeys.left.pressed && this.position.x <= 0 - this.width /2) this.position.x = canvas.width
    else if (this.pressedKeys.right.pressed && this.position.x >= canvas.width) this.position.x = 0
  }

  draw() {
    // if (this.status != 'game-over') {
      this.ctx.drawImage(
        this.marioSprite, // This is the sprite
        this.animations[this.currentAnimation][this.frameIndex].x, // Position X in the sprite
        this.animations[this.currentAnimation][this.frameIndex].y, // Position Y in the sprite
        this.width, // Sprite width
        this.height, // Sprite height
        this.position.x, // Position X in canvas
        Math.round(this.position.y), // Position Y in canvas
        this.width, // Ni puta idea por qué repetimos ancho
        this.height // Ni puta idea por qué repetimos alto
      )
    // }

   if (this.devMode) {
    for (let i = 0; i < this.marioCollisions.length; i++){
      for (let j = 0; j < this.marioCollisions[i].length; j++) {
        const element = this.marioCollisions[i][j]
        this.ctx.fillStyle = this.arrayColors[element]
        this.ctx.fillRect(
          8 * j,
          8 * i,
          8,
          8
        )
      }
    }
   }

  }

  update() {
    this.draw()
    if (this.status == 'alive') {
      this.position.y += this.velocity.y
      this.position.x += this.velocity.x
    } 
    (this.isOverFloor() && (this.status == 'alive' || this.status == 'stand-by') ) ? this.velocity.y = 0 : this.velocity.y += CONFIGS.GRAVITY
    this.fixPositions()
    this.updateAnimation()
    this.velocity.x = 0

    if (this.pressedKeys.left.pressed /*&& !this.sideCollisions()*/) this.velocity.x = -1
    else if (this.pressedKeys.right.pressed /*&& !this.sideCollisions()*/) this.velocity.x = 1
    if (
      !this.pressedKeys.left.pressed && !this.pressedKeys.right.pressed && 
      !this.pressedKeys.space.pressed && this.isOverFloor() && this.direction == 1 && 
      this.status == 'alive'
      ) this.setAnimation('idleRight')
      else if (
        !this.pressedKeys.left.pressed && !this.pressedKeys.right.pressed 
        && !this.pressedKeys.space.pressed && this.isOverFloor() && 
        this.direction == 0 && this.status == 'alive'
        ) this.setAnimation('idleLeft')   
  
  }

  killMario() {
    if (this.status == 'alive') {  
      this.status = 'dead'
      this.setAnimation('stop')  
      setTimeout(() => {
        this.deadAnimation()          
      }, 2000)
      
    }
   }

   deadAnimation() {
    this.setAnimation('fall');
    this.velocity.y = 0.5;
    this.position.y -= this.height * 1.5;
    if (this.playerLives == 0) {
      this.status = 'game-over';
    } 
    const finalY = this.canvas.height + this.height;
    const fallInterval = setInterval(() => {
      this.position.y += this.velocity.y;
      if (this.position.y >= finalY) {
        clearInterval(fallInterval);
        this.position.y = -105
      
        this.setAnimation(this.direction === 0 ? 'idleLeft' : 'idleRight');
        if (this.playerLives > 0 && this.status != 'game-over') {
          this.status = 'stand-by';
          this.activeElevator()
        }
      }
    }, 1000 / 60);
  }

  checkArrayValue(posX, posY) {
    const arrayColumns = this.marioCollisions[0].length
    const arrayRows = this.marioCollisions.length
    const arraySize = 8 
    const arrayX = Math.floor(posX / arraySize)
    const arrayY = Math.floor(posY / arraySize)
    if (arrayY < arrayRows && arrayX < arrayColumns) {   
      if (this.marioCollisions[arrayY][arrayX] != undefined && this.marioCollisions[arrayY]) {  
        return this.marioCollisions[arrayY][arrayX] 
      }
    }
  }

  checkJumpCollision() {
    const arrayColumns = this.marioCollisions[0].length;
    const arrayRows = this.marioCollisions.length;
    const arraySize = 8;
    const arrayX = Math.floor((this.position.x + this.width / 2) / arraySize);
    const arrayY = Math.floor(this.position.y / arraySize);
  
    if (arrayY < arrayRows && arrayX < arrayColumns && arrayX >= 0) {
      let count = 0;
      while (arrayY - count >= 0 && this.marioCollisions[arrayY - count][arrayX] == 0) {
        count++;
      }
      // Limitar el salto para evitar que Mario suba fuera de la pantalla
      if (count >= Math.floor(this.position.y / arraySize)) {
        count = Math.floor(this.position.y / arraySize);
      }
      return count;
    }
    return 0;
  }  

  isOverFloor() {
    const arrayColumns = this.marioCollisions[0].length
    const arrayRows = this.marioCollisions.length
    const arraySize = 8  
  
    const arrayX = Math.floor(this.position.x / arraySize)
    const arrayY = Math.floor((this.position.y + this.height ) / arraySize)
    if (arrayY < arrayRows && arrayX < arrayColumns && this.marioCollisions[arrayY] != undefined && this.marioCollisions[arrayY][arrayX] != undefined) {
     if (this.direction == 0) {
      if (this.marioCollisions[arrayY][arrayX] === 0 && (this.marioCollisions[arrayY][arrayX-1] === 0) /*&& (this.marioCollisions[arrayY][arrayX-2] === 0)*/) {
        return false
      }
     }
     else if (this.direction == 1) {
      if (this.marioCollisions[arrayY][arrayX] === 0 && (this.marioCollisions[arrayY][arrayX+1] === 0)/* && (this.marioCollisions[arrayY][arrayX+2] === 0)*/) {
        return false
      }
     }
    }
    if (this.status == 'game-over') return false
    return true
  }
}

export default Mario
