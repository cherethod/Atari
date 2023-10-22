import Monster from "./Monster.js";
import CONFIGS from "./Configs.js"

class Turtle extends Monster {
  constructor(canvas, ctx, position) {
    super()
    this.position = position
    this.canvas = canvas
    this.ctx = ctx
    this.width = 16
    this.height = 16
    this.velocity = {
      x: 0.8,
      y: 1,
      flipped: 20
    }
    this.sprite = new Image()
    this.sprite.src = '../resources/sprites/enemies/turtle.png'
    this.direction = 1 // 1 right  -  0 left
    this.animations = {
      idleLeft: [{x: 0, y: 0}],
      runLeft: [
        {x: 0, y:0},
        {x: this.width, y:0},
        {x: this.width * 2, y:0},
        {x: this.width * 3, y:0},
        {x: this.width * 4, y:0},
      ],
      runRight: [
        {x: this.width * 19, y:0},
        {x: this.width * 18, y:0},
        {x: this.width * 17, y:0},
        {x: this.width * 16, y:0},
        {x: this.width * 15, y:0},
      ],
      fallLeft: [{x: this.width * 5, y:0}],
      flippedLeft: [
        {x: this.width * 6, y:0},
        {x: this.width * 7 , y:0},
      ],
      shell: [
        {x: this.width * 19, y:0},
        {x: this.width * 19 + 8, y:0},

      ]
    }
    this.frameIndex = 0
    this.currentAnimation = 'idleLeft'
  }

/*

  setAnimation (animationName) {
    if (this.animations[animationName]) {
      this.currentAnimation = animationName
      this.frameIndex = 0
    }
  }

  updateFrame () {
    const animation = this.animations[this.currentAnimation]
    if (animation) {
      this.frameIndex = (this.frameIndex + 1) % animation.length
    }
  }



  draw () {
    const animation = this.animations[this.currentAnimation]
    if (animation) {
      const frame = animation[this.frameIndex]
      this.ctx.drawImage(
        this.sprite,
        frame.x,
        frame.y,
        this.width,
        this.height,
        this.position.x,
        this.position.y,
        this.width,
        this.height,
      )
    }
  }
*/

  draw () {
    this.ctx.drawImage(
      this.sprite,
      this.width * this.frameIndex,
      0,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    )
  }
  update () {
    this.draw()    
   if (this.position.x < 0) {
      this.direction = 1  
      // HERE FLIP X TRUE
   }
   if (this.position.x > this.canvas.width - this.width) {
    this.direction = 0
    //HERE FLIP X FALSE
   }

  (this.direction == 1) ? (
    this.position.x += this.velocity.x,    
    this.frameIndex = 17 // * modificacion temporal cutre para voltear la tortuga
    ) : (
      this.position.x -= this.velocity.x,
      this.frameIndex = 0
      )
    
    this.position.y += this.velocity.y
    if (
      this.position.y + this.height + this.velocity.y < this.canvas.height - CONFIGS.STAGE_FLOOR_HEIGHT
      )    this.velocity.y += CONFIGS.GRAVITY
    else this.velocity.y = 0
  }
}


export default Turtle