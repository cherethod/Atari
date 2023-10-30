import Monster from "./Monster.js";

class Turtle extends Monster {
  constructor(canvas, ctx, position, direction, mario, turtles, pow) {
    super(
      canvas,
      ctx,
      position,
      direction,
      mario,
      turtles,
      pow,
      '../resources/sprites/enemies/turtle.png'      
    )
    this.width = 32
    this.height = 32
    this.velocity = {
      x: 0.5,
      y: 1,
      flipped: 20
    }
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
        {x: this.width * 20, y: 0},
        {x: this.width * 21, y: 0},

      ]
    }
    this.frameIndex = 0
    this.currentAnimation = (this.direction == 1) ? 'runRight' : 'runLeft'
    this.animationSpeed = 15;
    this.animationCounter = 0;
    this.flipStatus = null
    this.status = 'normal'
    this.statusPaused = 0
    this.isAlive = true

  }
  
  checkCollision(mario) {
    const turtleLeft = Math.round(this.position.x);
    const turtleRight = Math.round(this.position.x + this.width);
    const turtleTop = Math.round(this.position.y);
    const turtleBottom = Math.round(this.position.y + this.height);

    const marioLeft = Math.round(mario.position.x);
    const marioRight = Math.round(mario.position.x + mario.width);
    const marioTop = Math.round(mario.position.y - 12);
    const marioBottom = Math.round(mario.position.y + mario.height);
    if (this.direction == 0 && mario.status == 'alive' && this.status == 'normal') {  
      if (
        ((turtleBottom < marioBottom) ? marioBottom - turtleBottom : turtleBottom - marioBottom) < this.height /2 &&
        ((marioRight < turtleLeft) ? turtleLeft - marioRight : marioRight - turtleLeft) < 5
      ){
        console.log('colision por derecha');
        this.marioDieFX.play()
        mario.killMario()
      }
      if (
        marioBottom < turtleBottom && // mario esta por encima 
        marioBottom > turtleTop && // los pies de mario estan por debajo de la parte superior de la tortuga
        marioRight > turtleLeft && // Mario esta a la izquierda
        marioLeft < turtleRight
        )
        { 
          this.hitFX.play()
          this.setStatus('flipped')
          // this.marios[0].enemiesCount++ 
          this.marios[0].updateScore(0)
        console.log('caparazon');
      }
    }
    else if (this.direction == 1  && mario.status == 'alive' && this.status == 'normal') {
      if (
        ((turtleBottom < marioBottom) ? marioBottom - turtleBottom : turtleBottom - marioBottom) < this.height /2 && this.direction == 1 &&
        ((marioLeft < turtleRight) ? turtleRight - marioLeft : marioLeft - turtleRight) < 5 
      ){
        console.log('colision por izquierda');
        this.marioDieFX.play()
        mario.killMario()
      }
      if (
        marioBottom < turtleBottom && // mario esta por encima 
        marioBottom > turtleTop && // los pies de mario estan por debajo de la parte superior de la tortuga
        turtleRight > marioLeft && // Mario esta a la derecha
        turtleLeft < marioRight
      ){
        this.hitFX.play()
        this.setStatus('flipped')
        // this.marios[0].enemiesCount++ 
        this.marios[0].updateScore(0)
        console.log('caparazon');
      }
    }

    if (this.status == 'flipped' && mario.status == 'alive') {
      if (mario.direction == 0 && marioRight > turtleLeft && marioLeft < turtleRight) {
        this.killTurtle()    
        this.marios[0].enemiesCount++ 
        this.marios[0].updateScore(1)
      }

      if (mario.direction == 1 && marioLeft < turtleRight && marioRight < turtleRight) {
        this.killTurtle()
        this.marios[0].enemiesCount++ 
        this.marios[0].updateScore(1)
      }
    }
  }  


/* Corregir logica de estados */
  setStatus(status) {
    this.status = status;
    this.statusPaused = (status === 'flipped') ? 1 : 0;
    if (this.status === 'flipped') {
      this.velocity.x = 0;
      this.agro = false
      this.setAnimation(this.direction === 0 ? 'flippedLeft' : 'flippedRight');
      if (this.flipStatus) {
        clearTimeout(this.flipStatus); // Detener el temporizador anterior si existe
      }
      this.flipStatus = setTimeout(() => {
        this.setAnimation((this.direction == 0) ? 'runLeft' : 'runRight')
        this.setStatus('normal')
        this.velocity.x = 0.5    
        this.agro = true    
        this.pow.isInUse = false
      }, 10000);
    }
  }

  removeTurtle() {
    const index = this.turtles.indexOf(this);
    if (index !== -1) {
      this.turtles.splice(index, 1);
    }
  }

  deadAnimation() {
    this.setAnimation('shell')
    this.velocity.y = 2
    const finalY = this.canvas.height + this.height * 5
  
    const fallInterval = setInterval(() => {
      this.position.y += this.velocity.y
      if (this.position.y >= finalY) {
        clearInterval(fallInterval)
      }
    }, 1000 / 60)
  }
  
  killTurtle () {
    this.isAlive = false
    this.statusPaused = 1
    this.velocity.x = 0
    clearTimeout(this.flipStatus)
    this.setAnimation('shell')
    this.setStatus('dead')
    this.deadAnimation()
    setTimeout(() => {
      this.removeTurtle()
    }, 10000);
  }
}


export default Turtle