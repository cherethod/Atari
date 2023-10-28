import Monster from "./Monster.js";
// import CONFIGS from "./Configs.js"

class Turtle extends Monster {
  constructor(canvas, ctx, position, direction, mario, turtles) {
    super(
      canvas,
      ctx,
      position,
      direction,
      mario,
      turtles,
      '../resources/sprites/enemies/turtle.png'
    )
    // this.position = position
    // this.canvas = canvas
    // this.ctx = ctx
    // // this.id = id
    // this.mario = mario
    // this.turtles = turtles
    this.width = 32
    this.height = 32
    this.velocity = {
      x: 0.5,
      y: 1,
      flipped: 20
    }
    // this.sprite = new Image()
    // this.sprite.src = '../resources/sprites/enemies/turtle.png'
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
    const turtleLeft = this.position.x;
    const turtleRight = this.position.x + this.width;
    const turtleTop = this.position.y;
    const turtleBottom = this.position.y + this.height;
  
    const marioLeft = mario.position.x;
    const marioRight = mario.position.x + mario.width;
    const marioTop = mario.position.y;
    const marioBottom = mario.position.y + mario.height;
  
  if (this.status == 'normal') {
    if (this.direction === 0) { // Tortuga moviéndose hacia la izquierda
      // Comprueba si Mario golpea la tortuga desde la derecha
      if (
        marioRight > turtleLeft && // Colisión horizontal
        marioLeft < turtleLeft && // Mario a la izquierda de la tortuga
        marioBottom > turtleTop && // Colisión vertical desde arriba
        marioTop < turtleBottom // Colisión vertical desde abajo
      ) {
        console.log('Golpe desde la derecha');
        mario.killMario()
      }
      // Comprueba si Mario golpea la tortuga en el caparazón
      else if (
        marioRight > turtleLeft && // Colisión horizontal
        marioLeft < turtleRight && // Mario a la izquierda de la tortuga
        marioBottom > turtleTop && // Colisión vertical desde arriba
        marioTop < turtleBottom  // Colisión vertical desde abajo
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
        marioTop < turtleBottom // Colisión vertical desde abajo
      ) {
        console.log('Golpe desde la izquierda');
        mario.killMario()

      }
      // Comprueba si Mario golpea la tortuga en el caparazón
      else if (
        marioRight > turtleLeft && // Colisión horizontal
        marioLeft < turtleRight && // Mario a la izquierda de la tortuga
        marioBottom > turtleTop && // Colisión vertical desde arriba
        marioTop < turtleBottom  // Colisión vertical desde abajo
      ) {
        console.log('Golpe en el caparazón');
        if (this.statusPaused === 0 && mario.status == 'alive') this.setStatus('flipped');
      }
    }
  } else {
    if (
      marioRight > turtleLeft && // Colisión horizontal
      marioLeft < turtleLeft && // Mario a la izquierda de la tortuga
      marioBottom > turtleTop && // Colisión vertical desde arriba
      marioTop < turtleBottom // Colisión vertical desde abajo
    ) {
      console.log('tortuga golpeada desde la derecha');
      this.killTurtle()
    } else if (
      marioLeft < turtleRight && // Colisión horizontal
      marioRight > turtleRight && // Mario a la derecha de la tortuga
      marioBottom > turtleTop && // Colisión vertical desde arriba
      marioTop < turtleBottom // Colisión vertical desde abajo
    ) {
      console.log('tortuga golpeada desde la izquierda');
      this.killTurtle()
    }
  }
  }  



  setStatus(status) {
    this.status = status;
    this.statusPaused = status === 'flipped' ? 1 : 0;
    if (this.status === 'flipped') {
      this.velocity.x = 0;
      this.setAnimation(this.direction === 0 ? 'flippedLeft' : 'flippedRight');
      if (this.flipStatus) {
        clearTimeout(this.flipStatus); // Detener el temporizador anterior si existe
      }
      this.flipStatus = setTimeout(() => {
        this.setAnimation('shell');
        this.status = 'dead';
        this.velocity.x = 0; // Detener el movimiento en el eje X
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
    this.velocity.y = 0.5
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