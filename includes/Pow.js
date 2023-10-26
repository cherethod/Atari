class Pow {
  constructor(canvas, ctx, position) {
    this.position = position
    this.canvas = canvas
    this.ctx = ctx
    this.width = 32
    this.height = 32
    this.sprite = new Image()
    this.sprite.src = '../resources/sprites/stages/Pow.png'
    this.uses = 3
    this.animations = {
      'full': [{x: 0 , y: 0}],
      'mid': [{x: this.width , y: 0}],
      'last': [{x: this.width * 2  , y: 0}],
    }
    this.currentAnimation = 'full'
    this.frameIndex = 0
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
    );
  }

  update () {
    this.draw()
  }
}

export default Pow;