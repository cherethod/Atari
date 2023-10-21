import Monster from "./Monster.js";
import CONFIGS from "./Configs.js"
import Mario from "./Mario.js";

class Turtle extends Monster {
  constructor(canvas, ctx, position, sprite) {
    super()
    this.position = position
    this.canvas = canvas
    this.ctx = ctx
    this.width = 20
    this.height = 20
    this.velocity = {
      x: 1,
      y: 1,
      toggled: 20
    }
    this.sprite = sprite
    this.direction = 1 // 1 derecha 0 izquierda
  }


  }
  draw () {
    this.ctx.fillStyle = 'green'
    this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

  }
  update () {
    this.draw()    
    // if (this.position.x >= this.canvas.width - this.width) alert()
   if (this.position.x < 0) {
      this.direction = 1    
   }
   if (this.position.x > this.canvas.width) {
    this.direction = 0
   }

  (this.direction == 1) ? this.position.x += this.velocity.x : this.position.x -= this.velocity.x
    
    this.position.y += this.velocity.y
    if (
      this.position.y + this.height + this.velocity.y < this.canvas.height
      )    this.velocity.y += CONFIGS.GRAVITY
    else this.velocity.y = 0
  }
}


export default Turtle