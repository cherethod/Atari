class Stages {
  constructor(canvas, ctx, position) {
    this.canvas = canvas
    this.ctx = ctx
    this.position = position
    this.width = 512
    this.height = 448
    this.currentStage = 1
    this.stages = {
      1: '../resources/sprites/stages/stage1.png',
      2: '../resources/sprites/stages/stage2.png',
      3: '../resources/sprites/stages/stage3.png',
    }
    this.enemiesCount = {
      1: 10,
      2: 15,
      3: 20
    }
    this.image = new Image()
    this.image.src = this.stages[this.currentStage]
  }

  draw () {
    if (!this.image) return
    this.ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
    )
  }

  update () {
    this.draw()
  }
}

export default Stages