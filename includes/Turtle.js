import Monster from "./Monster.js";
import CONFIGS from "./Configs.js"
import enemiesCollisions from "./EnemiesCollisions.js";



class Turtle extends Monster {
  constructor(canvas, ctx, position, direction, mario) {
    super()
    this.position = position
    this.canvas = canvas
    this.ctx = ctx
    this.mario = mario
    this.width = 32
    this.height = 32
    this.velocity = {
      x: 1,
      y: 1,
      flipped: 20
    }
    this.sprite = new Image()
    this.sprite.src = '../resources/sprites/enemies/turtle.png'
    this.direction = direction // 1 right  -  0 left 
    this.animations = {
      'idleLeft': [{x: 0, y: 0}],
      'runLeft': [
        {x: 0, y: 0},
        {x: this.width, y: 0},
        {x: this.width * 2, y: 0},
      ],
      'turnRight': [        
        {x: this.width * 3, y: 0},
        {x: this.width * 4, y: 0},
      ],
      'runRight': [
        {x: this.width * 19, y: 0},
        {x: this.width * 18, y: 0},
        {x: this.width * 17, y: 0},
      ],
      'turnLeft': [        
        {x: this.width * 16, y: 0},
        {x: this.width * 15, y: 0},
      ],
      'fallLeft': [{x: this.width * 5, y: 0}],
      'flippedLeft': [
        {x: this.width * 6, y: 0},
        {x: this.width * 7, y: 0},
      ],
      'flippedRight': [
        {x: this.width * 12, y: 0},
        {x: this.width * 13, y: 0},
      ],
      'shell': [
        {x: this.width * 19, y: 0},
        {x: this.width * 19 + 8, y: 0},

      ]
    }
    this.frameIndex = 0
    this.currentAnimation = (this.direction == 1) ? 'runRight' : 'runLeft'
    this.animationSpeed = 15;
    this.animationCounter = 0;
    this.status = 'normal'
    this.statusPaused = 0
  }
  
  checkCollision(mario) {
    const turtleLeft = this.position.x;
    const turtleRight = this.position.x + this.width;
    const turtleTop = this.position.y;
    const turtleBottom = this.position.y + this.height;
  
    const marioLeft = mario.position.x;
    const marioRight = mario.position.x + mario.width;
    const marioTop = mario.position.y;
    const marioBottom = mario.position.y + mario.height;
  
    if (this.direction === 0) { // Tortuga moviéndose hacia la izquierda
      // Comprueba si Mario golpea la tortuga desde la derecha
      if (
        marioRight > turtleLeft && // Colisión horizontal
        marioLeft < turtleLeft && // Mario a la izquierda de la tortuga
        marioBottom > turtleTop && // Colisión vertical desde arriba
        marioTop < turtleBottom && // Colisión vertical desde abajo
        this.status === 'normal'
      ) {
        console.log('Golpe desde la derecha');
        mario.killMario()
      }
      // Comprueba si Mario golpea la tortuga en el caparazón
      else if (
        marioRight > turtleLeft && // Colisión horizontal
        marioLeft < turtleRight && // Mario a la izquierda de la tortuga
        marioBottom > turtleTop && // Colisión vertical desde arriba
        marioTop < turtleBottom && // Colisión vertical desde abajo
        this.status === 'normal'
      ) {
        console.log('Golpe en el caparazón');
        if (this.statusPaused === 0 && mario.status == 'alive') this.setStatus('flipped');
      }
    } else if (this.direction === 1) { // Tortuga moviéndose hacia la derecha
      // Comprueba si Mario golpea la tortuga desde la izquierda
      if (
        marioLeft < turtleRight && // Colisión horizontal
        marioRight > turtleRight && // Mario a la derecha de la tortuga
        marioBottom > turtleTop && // Colisión vertical desde arriba
        marioTop < turtleBottom && // Colisión vertical desde abajo
        this.status === 'normal'
      ) {
        console.log('Golpe desde la izquierda');
        mario.killMario()

      }
      // Comprueba si Mario golpea la tortuga en el caparazón
      else if (
        marioRight > turtleLeft && // Colisión horizontal
        marioLeft < turtleRight && // Mario a la izquierda de la tortuga
        marioBottom > turtleTop && // Colisión vertical desde arriba
        marioTop < turtleBottom && // Colisión vertical desde abajo
        this.status === 'normal'
      ) {
        console.log('Golpe en el caparazón');
        if (this.statusPaused === 0 && mario.status == 'alive') this.setStatus('flipped');
      }
    }
  }  

  updateAnimation() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      this.animationCounter++;
      if (this.animationCounter >= this.animationSpeed) {
        this.animationCounter = 0;
        this.frameIndex = (this.frameIndex + 1) % animation.length;
      }
    }
    // console.log(animation);
  }

  setAnimation (animationName) {
    this.frameIndex = 0
    this.currentAnimation = animationName
    this.animationCounter = 0
  }

  setStatus (status) {
    this.status = status
    this.statusPaused = (this.status == 'flipped') ?  1 : 0
    if (this.status == 'flipped') {
      this.velocity.x = 0
      this.setAnimation ((this.direction == 0) ? 'flippedLeft' : 'flippedRight')
      setTimeout(() => {
        this.status = 'normal';
        this.statusPaused = 0
        this.setAnimation ((this.direction == 0) ? 'runLeft' : 'runRight')
        this.velocity.x = 1
      }, 10000);
    }
  }  

  getCollisionValue (value) {
    const arrayColumns = enemiesCollisions[0].length
    const arrayRows = enemiesCollisions.length
    const arraySize = 8

    const arrayX = Math.floor(this.position.x / arraySize)
    const arrayY = Math.floor((this.position.y + this.height) / arraySize)

    if (arrayY < arrayRows && arrayX < arrayColumns) {
      if (enemiesCollisions[arrayY][arrayX] === value) {
        return false
      }
    }
    return true
  }

  checkStairs () {

    // console.log(`
    //   Turtle Y -> ${this.position.y}\n
    //   Turtle X -> ${this.position.x}
    // `);

    /* DOWN - RIGHT PIPE */
    if (this.position.y >= 360 && this.position.y <= 367 && this.position.x >= 445 && this.position.x <= 455) {
      this.position.x = 64
      this.position.y = 48
    }

    /* DOWN - LEFT PIPE */    
    if (this.position.y >= 360 && this.position.y <= 367 && this.position.x >= 11 && this.position.x <= 20) {
      this.position.x = this.canvas.width - (64 + this.width)
      this.position.y = 48
    }
  }

  draw () {
    this.ctx.drawImage(
      this.sprite,
      this.animations[this.currentAnimation][this.frameIndex].x,
      this.animations[this.currentAnimation][this.frameIndex].y,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    )
  }

  update () {
    this.checkCollision(this.mario)
    this.updateAnimation()
    this.draw()    
    if (this.position.x < 0) {
      this.direction = 1;
      this.setAnimation ('runRight');
    } 
    if (this.position.x > this.canvas.width - this.width) {
      this.direction = 0;
      this.setAnimation ('runLeft');
    }

  (this.direction == 1) ? this.position.x += this.velocity.x : this.position.x -= this.velocity.x    
    this.position.y += this.velocity.y
    if (
      this.position.y + this.height + this.velocity.y < this.canvas.height - CONFIGS.STAGE_FLOOR_HEIGHT
      )    (this.getCollisionValue(0)) ? this.velocity.y = 0 : this.velocity.y += CONFIGS.GRAVITY
            // (this.getCollisionValue(3)) ? this.position.y - 8 : null           
    else this.velocity.y = 0
    if (!this.getCollisionValue(3)) this.position.y -= 8
    // console.log(!this.getCollisionValue(3));
    // console.log(`
    // Turtle Y -> ${this.position.y}\n
    // Turtle X -> ${this.position.x}
    // `);
    this.checkStairs()
  } 
  
}


export default Turtle