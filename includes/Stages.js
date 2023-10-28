class Stages {
  constructor(canvas, ctx, position, mario, turtles) {
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
      1: 1, // set to 10 when dev status has been finished
      2: 15,
      3: 20
    }
    this.spawnInterval = {
      1: Math.floor(Math.random() * 7 + 2),
      2: Math.floor(Math.random() * 5 + 2),
      3: Math.floor(Math.random() * 4 + 1)
    }
    this.enemiesRemain = this.enemiesCount[this.currentStage]
    this.mario = mario
    this.turtles = turtles
    this.image = new Image()
    this.image.src = this.stages[this.currentStage]
  }

  // generateEnemies = () => {
  //   const randomSpawn = Math.random()
  //   let direction = (randomSpawn >= (1 - randomSpawn)) ? 0 : 1
  //     const newTurtle = new Turtle(canvas, ctx, {
  //       x: (direction == 0) ? canvas.width - 96 : 64,
  //       y: 48
  //     }, direction, mario, turtles)
  //     turtles.push(newTurtle)
  // }

  // spawnEnemies () {
  //   if (this.enemiesRemain > 0) {
  //     generateEnemies()
  //     console.log(this.enemiesRemain);
  //     this.enemiesRemain--
  //     setTimeout(() => {
  //       spawnEnemies()
  //     }, this.spawnInterval[this.currentStage]);
  //   }
  // }
  
  


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