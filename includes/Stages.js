import CONFIGS from "./Configs.js"
import Turtle from "./Turtle.js"
class Stages {
  constructor(canvas, ctx, position, mario, turtles, pow) {
    this.canvas = canvas
    this.ctx = ctx
    this.position = position
    this.width = CONFIGS.BOARD_WIDTH
    this.height = CONFIGS.BOARD_HEIGHT
    this.currentStage = 1
    this.stages = {
      1: '../resources/sprites/stages/stage1.png',
      2: '../resources/sprites/stages/stage2.png',
      3: '../resources/sprites/stages/stage3.png',
    }
    this.enemiesCount = 0
    this.spawnInterval = {
      1: Math.floor(Math.random() * 7 + 2),
      2: Math.floor(Math.random() * 5 + 2),
      3: Math.floor(Math.random() * 4 + 1)
    }
    this.enemiesRemain = {
      1: 10,
      2: 15,
      3: 20
    }
    this.pow = pow
    this.mario = mario
    this.turtles = turtles
    this.image = new Image()
    this.image.src = this.stages[this.currentStage]

  }

  
  generateEnemies()  {
    console.log(this.enemiesRemain[this.currentStage])
    const randomSpawn = Math.random()
    let direction = (randomSpawn >= (1 - randomSpawn)) ? 0 : 1
      const newTurtle = new Turtle(this.canvas, this.ctx, {
        x: (direction == 0) ? this.canvas.width - 96 : 64,
        y: 48
      }, direction, this.mario, this.turtles, this.pow)
      this.turtles.push(newTurtle)
      // newTurtle.update()
  }

  createEnemies() {
    const spawnDelay = 2000;
    let enemySpawner;
    const spawnInterval = Math.round(Math.random() * 15 + 5) * 1000;
    
    const spawnEnemy = () => {
        if (this.enemiesRemain[this.currentStage] > 0) {
            this.generateEnemies();
            this.enemiesRemain[this.currentStage]--;
        } else {
            clearInterval(enemySpawner); // Detener la generación cuando no quedan enemigos
        }
    };

    setTimeout(() => {
        enemySpawner = setInterval(spawnEnemy, spawnInterval);
        spawnEnemy(); // Generar el primer enemigo de inmediato
    }, spawnDelay);
}

  // createEnemies() { 
  //   const spawnDelay = 2000
  //   const spawnInterval = Math.round(Math.random() * 5 + 1) * 1000
  //   console.log(spawnInterval);
  //   const spawnEnemies = () => {
  //     console.log('enemy spawned')
  //     if (this.enemiesRemain[this.currentStage] > 0) {
  //       this.generateEnemies()
  //       console.log(this.enemiesRemain[this.currentStage]);
  //       this.enemiesRemain[this.currentStage]--
  //       setTimeout(() => {
  //         console.log('set time out 1')
  //         spawnEnemies()
  //       }, spawnInterval);
  //     }
  //   }
  //   setTimeout(() => {
  //     console.log('set time out 2')
  //     spawnEnemies()
  //   }, spawnDelay);
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