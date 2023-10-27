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
    this.marioSprite = sprite
    this.animations = {
      'idleRight': [{ x: 0, y: 0 }],
      'idleLeft': [{ x: this.width * 19, y: 0 }],
      'runRight': [
        // { x: 0, y: 0 },
        { x: this.width, y: 0 },
        { x: this.width * 2, y: 0 },
        { x: this.width * 3, y: 0 },
      ],
      'runLeft': [
        // { x: this.width * 19, y: 0 },
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
      }
    }
  }


  addEventListeners() {
    window.addEventListener('keydown', (e) => {
      if (this.status === 'alive') {
        switch (e.code) {
          case 'KeyA':
          case 'ArrowLeft':
            if (!this.pressedKeys.left.pressed) this.setAnimation('runLeft');
            this.pressedKeys.left.pressed = true;
            this.direction = 0;
            break;
          case 'KeyD':
          case 'ArrowRight':
            if (!this.pressedKeys.right.pressed) this.setAnimation('runRight');
            this.pressedKeys.right.pressed = true;
            this.direction = 1;
            break;
          case 'Space':
            if (!this.pressedKeys.space.pressed && this.direction === 0) this.setAnimation('jumpLeft');
            if (!this.pressedKeys.space.pressed && this.direction === 1) this.setAnimation('jumpRight');
            this.pressedKeys.space.pressed = true;

            if (this.isOverFloor() && this.position.y >= 0) {
              if (this.position.y - CONFIGS.MARIO_JUMP >= 0) {
                this.velocity.y = -CONFIGS.MARIO_JUMP;
              } else if (this.position.y - CONFIGS.MARIO_JUMP < 0) {
                alert('Cannot jump any higher');
              }
            }
            break;
          default: 
            break;
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.status === 'alive') {
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
          default:
            break;
        }
      }
    });
  }

  // handleMovement() {
  //   this.velocity.x = 0;

  //   if (this.pressedKeys.left) {
  //     this.velocity.x = -1;
  //   } else if (this.pressedKeys.right) {
  //     this.velocity.x = 1;
  //   }

  //   if (this.pressedKeys.left && this.position.x <= 0 - this.width / 2) {
  //     this.position.x = this.canvas.width;
  //   } else if (this.pressedKeys.right && this.position.x >= this.canvas.width) {
  //     this.position.x = 0;
  //   }

  //   if (
  //     !this.pressedKeys.left && !this.pressedKeys.right && 
  //     !this.pressedKeys.space && this.isOverFloor() && this.direction === 1 && 
  //     this.status === 'alive'
  //   ) {
  //     this.setAnimation('idleRight');
  //   } else if (
  //     !this.pressedKeys.left && !this.pressedKeys.right && 
  //     !this.pressedKeys.space && this.isOverFloor() && this.direction === 0 && 
  //     this.status === 'alive'
  //   ) {
  //     this.setAnimation('idleLeft');
  //   }
  // }

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

  draw() {
  this.ctx.drawImage(
      this.marioSprite, // This is the sprite
      this.animations[this.currentAnimation][this.frameIndex].x, // Position X in the sprite
      this.animations[this.currentAnimation][this.frameIndex].y, // Position Y in the sprite
      this.width, // Sprite width
      this.height, // Sprite height
      this.position.x, // Position X in canvas
      this.position.y, // Position Y in canvas
      this.width, // Ni puta idea por qué repetimos ancho
      this.height // Ni puta idea por qué repetimos alto
    )
  }

  update() {
    this.draw()
    // Gravity system (more or less)
    if (this.status == 'alive') {
      this.position.y += this.velocity.y
      this.position.x += this.velocity.x
    } 
    (this.isOverFloor() && this.status == 'alive') ? this.velocity.y = 0 : this.velocity.y += CONFIGS.GRAVITY
    // console.log(this.checkArrayValue((this.position.x + (this.width / 2)), (this.position.y)));
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
    this.setAnimation('fall')
    this.velocity.y = 0.5
    this.position.y -= this.height * 1.5
    const finalY = this.canvas.height + this.height
  
    const fallInterval = setInterval(() => {
      this.position.y += this.velocity.y
      if (this.position.y >= finalY) {
        clearInterval(fallInterval)
      }
    }, 1000 / 60)
  }

  checkArrayValue(posX, posY) {
    const arrayColumns = marioCollisions[0].length
    const arrayRows = marioCollisions.length
    const arraySize = 8 
    const arrayX = Math.floor(posX / arraySize)
    const arrayY = Math.floor(posY / arraySize)
    if (arrayY < arrayRows && arrayX < arrayColumns) {   
      if (marioCollisions[arrayY][arrayX] != undefined) {  
        return marioCollisions[arrayY][arrayX] 
      }
    }
  }

  isOverFloor() {
    const arrayColumns = marioCollisions[0].length
    const arrayRows = marioCollisions.length
    const arraySize = 8  
  
    const arrayX = Math.floor(this.position.x / arraySize)
    const arrayY = Math.floor((this.position.y + this.height ) / arraySize)
    // console.log(marioCollisions[arrayY][arrayX]);
    if (arrayY < arrayRows && arrayX < arrayColumns) {
      if (marioCollisions[arrayY][arrayX] === 0) {
        return false
      }
    }

    return true
  }
}

export default Mario
