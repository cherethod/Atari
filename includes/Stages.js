import CONFIGS from "./Configs.js"
import Turtle from "./Turtle.js"
class Stages {
  constructor(canvas, ctx, position, marios, turtles, pow) {
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
    this.enemiesSpawned = 0
    this.spawnInterval = {
      1: Math.floor(Math.random() * 7 + 2),
      2: Math.floor(Math.random() * 5 + 2),
      3: Math.floor(Math.random() * 4 + 1)
    }
    this.stageTotalEnemies = {
      1: 10,
      2: 15,
      3: 20
    }
    this.enemiesRemain = {
      1: 10,
      2: 15,
      3: 20
    }
    this.pow = pow
    this.marios = marios
    this.turtles = turtles
    this.enemiesCount = this.marios[0].enemiesCount
    this.image = new Image()
    this.image.src = this.stages[this.currentStage]
  }

  updateStage() {
    this.image.src = this.stages[(this.currentStage == 3) ? 1 : this.currentStage + 1]
  }
  
  generateEnemies()  {
    // console.log(this.enemiesRemain[this.currentStage])
    const randomSpawn = Math.random()
    let direction = (randomSpawn >= (1 - randomSpawn)) ? 0 : 1
      const newTurtle = new Turtle(this.canvas, this.ctx, {
        x: (direction == 0) ? this.canvas.width - 96 : 64,
        y: 48
      }, direction, this.marios, this.turtles, this.pow)
      this.turtles.push(newTurtle)
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

  draw () {
    if (!this.image) return
    this.ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
    )   
    
    this.ctx.font = "6px Mariofont"
    this.ctx.fillStyle = '#fff'
    this.ctx.fillText(`SCORE: ${this.marios[0].score}`, (this.canvas.width / 2) - 8 * 10, 32) 
    this.ctx.fillText(`ENEMIES: ${this.enemiesRemain[this.currentStage]}`, this.canvas.width - 160, 32) 
  }

  update () {
    this.draw()
  }
}

export default Stages