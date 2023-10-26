import Monster from "./Monster.js";
import CONFIGS from "./Configs.js"

class Turtle extends Monster {
  constructor(canvas, ctx, position, mario) {
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
    this.direction = 1 // 1 right  -  0 left 
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
    this.currentAnimation = 'runRight'
    this.animationSpeed = 25;
    this.animationCounter = 0;
    this.status = 'normal'
    this.statusPaused = 0
  }

  // checkCollision (mario) {
  //   if (
  //     this.direction === 0) {  
  //     const turtleHitBoxStart = {
  //       x: this.position.x,
  //       y: this.position.y - (mario.height - this.height)
  //     }
  //     const turtleHitBoxEnd = {
  //       x: this.position.x + (0.4 * this.width),
  //       y: this.position.y + this.height
  //     }
  //     if (
  //       mario.position.x + mario.width > turtleHitBoxStart.x + this.width * 0.4 + 1 && 
  //       mario.position.x < this.position.x + this.width && 
  //       mario.position.y + mario.height < this.position.y + this.height * 0.8 &&
  //       mario.position.y + mario.height > this.position.y
  //      ) {
  //        console.log('golpe en caparazón');
  //        if (this.statusPaused == 0) this.setStatus('flipped');
  //      }
  //     else if (
  //       this.status == 'normal' &&
  //         (
  //           mario.position.x + mario.width > turtleHitBoxStart.x &&       
  //           mario.position.x < turtleHitBoxEnd.x
  //         ) && (
  //           (
  //             mario.position.y + mario.height > turtleHitBoxStart.y &&
  //             mario.position.y + mario.height < turtleHitBoxEnd.y
  //           ) || (
  //             mario.position.y < turtleHitBoxEnd.y &&
  //             mario.position.y >= turtleHitBoxStart.y
  //           )
  //         )
  //       ) {
  //       console.log('hit desde derecha')
  //     }       
  //   } else if (
  //     this.direction === 1) {
  //     const turtleHitBoxStart = {
  //       x: this.position.x + (0.6 * this.width),
  //       y: this.position.y - (mario.height - this.height)
  //     }
  //     const turtleHitBoxEnd = {
  //       x: this.position.x  + this.width,
  //       y: this.position.y + this.height
  //     }
  //     if (    
  //       mario.position.x > this.position.x && 
  //       mario.position.x < this.position.x + this.width * 0.6 && 
  //       mario.position.y + mario.height < this.position.y + this.height * 0.8 && 
  //       mario.position.y + mario.height > this.position.y
  //     ) {
  //       console.log('golpe en caparazón');
  //       if (this.statusPaused == 0) this.setStatus('flipped')
  //     }
  //     else if (this.status == 'normal' &&
  //       (
  //         mario.position.x + this.width > turtleHitBoxStart.x &&
  //         mario.position.x < turtleHitBoxEnd.x
  //       ) && (
  //         (
  //           mario.position.y + mario.height > turtleHitBoxStart.y &&
  //           mario.position.y + mario.height < turtleHitBoxEnd.y 
  //         ) || (          
  //           mario.position.y < turtleHitBoxEnd.y &&
  //           mario.position.y >= turtleHitBoxStart.y
  //         )
  //       ) 
  //     ) {
  //       console.log('hit desde izquierda')
  //     }    
  //   } 
  // } 
  
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
        // Realiza las acciones necesarias cuando Mario golpea a la tortuga desde la derecha.
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
        if (this.statusPaused === 0) this.setStatus('flipped');
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
        // Realiza las acciones necesarias cuando Mario golpea a la tortuga desde la izquierda.
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
        if (this.statusPaused === 0) this.setStatus('flipped');
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
      )    this.velocity.y += CONFIGS.GRAVITY
    else this.velocity.y = 0
 
  } 
  
}


export default Turtle