import CONFIGS from "./Configs.js"

class Mario {
  constructor(canvas, ctx, position, sprite) {
    this.position = position
    this.canvas = canvas
    this.ctx = ctx
    this.width = 20
    this.height = 40
    this.velocity = {
      x: 10 ,
      y: 1,
    }
    this.sprite = sprite
    this.animations = {
      idle: [{x: 300, y: 300}]
    }
    this.frameIndex = 0;
  }

  draw() {    
    this.ctx.fillStyle = 'red'
    this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

    
      // ? ctx.drawImage(
    // ?   this.sprite,
    // ?   frame.x, frame.y, this.spriteWidth, this.spriteHeight,
    // ?   this.posX, this.posY, this.spriteWidth, this.spriteHeight
    // ? )
  }

  update () {  
    this.draw()
    
    this.position.y += this.velocity.y
    if (
      this.position.y + this.height + this.velocity.y < this.canvas.height
      )    this.velocity.y += CONFIGS.GRAVITY
    else this.velocity.y = 0
  }
}

export default Mario