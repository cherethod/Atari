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
        {x: 0, y:0},
        {x: this.width, y:0},
        {x: this.width * 2, y:0},
      ],
      'turnRight': [        
        {x: this.width * 3, y:0},
        {x: this.width * 4, y:0},
      ],
      'runRight': [
        {x: this.width * 19, y:0},
        {x: this.width * 18, y:0},
        {x: this.width * 17, y:0},
      ],
      'turnLeft': [        
        {x: this.width * 16, y:0},
        {x: this.width * 15, y:0},
      ],
      'fallLeft': [{x: this.width * 5, y:0}],
      'flippedLeft': [
        {x: this.width * 6, y:0},
        {x: this.width * 7 , y:0},
      ],
      'shell': [
        {x: this.width * 19, y:0},
        {x: this.width * 19 + 8, y:0},

      ]
    }
    this.frameIndex = 0
    this.currentAnimation = 'runRight'
    this.animationSpeed = 25;
    this.animationCounter = 0;
  }

  checkCollision (mario) {
    if (this.direction === 0) {  
      const turtleHitBoxStart = {
        x: this.position.x,
        y: this.position.y - (mario.height - this.height)
      }
      const turtleHitBoxEnd = {
        x: this.position.x + (0.4 * this.width),
        y: this.position.y + this.height
      }
      if (
          (
            mario.position.x + mario.width > turtleHitBoxStart.x &&       
            mario.position.x < turtleHitBoxEnd.x
          ) &&
  
          (
            (
              mario.position.y + mario.height > turtleHitBoxStart.y &&
              mario.position.y + mario.height < turtleHitBoxEnd.y
            ) || (
              mario.position.y < turtleHitBoxEnd.y &&
              mario.position.y >= turtleHitBoxStart.y
            )
          )
        ) {
        console.log('hit desde derecha')
      }
    } else if (this.direction === 1) {
      const turtleHitBoxStart = {
        x: this.position.x + (0.6 * this.width),
        y: this.position.y - (mario.height - this.height)
      }
      const turtleHitBoxEnd = {
        x: this.position.x  + this.width,
        y: this.position.y + this.height
      }
  
      if (
        (
          mario.position.x + this.width > turtleHitBoxStart.x &&
          mario.position.x < turtleHitBoxEnd.x
        ) &&
  
        (
          (
            mario.position.y + mario.height > turtleHitBoxStart.y &&
            mario.position.y + mario.height < turtleHitBoxEnd.y 
          ) || (          
            mario.position.y < turtleHitBoxEnd.y &&
            mario.position.y >= turtleHitBoxStart.y
          )
        ) 
      ) {
        console.log('hit desde izquierda')
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
      this.currentAnimation = 'runRight';
    } 
    if (this.position.x > this.canvas.width - this.width) {
      this.direction = 0;
      this.currentAnimation = 'runLeft';
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