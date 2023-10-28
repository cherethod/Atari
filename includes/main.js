import CONFIGS from "./Configs.js";
import Mario from "./Mario.js";
import Pow from "./Pow.js";
import Stages from "./Stages.js";
import Turtle from "./Turtle.js";
const powerBtn = document.querySelector('.btn__power');
const canvasContainer = document.querySelector('.canvas__container')

let keyboardType = 1

// * CANVAS CONFIG

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = CONFIGS.BOARD_WIDTH
canvas.height = CONFIGS.BOARD_HEIGHT

//  * SPRITES CALLS

const marioSprite = new Image()
marioSprite.src = '../resources/sprites/mario/mario.png'

const pipes = new Image()
pipes.src = '../resources/sprites/stages/pipes.png'

//  * CONSTRUCTORS 

const mario = new Mario(canvas, ctx, marioSprite);


const turtles = []

const stage = new Stages(canvas, ctx, {
  x: 0,
  y: 0,
}, mario, turtles);

const pow = new Pow(canvas, ctx, {
  x: 240,
  y: 320
}, mario, turtles);



//  * Animate loop
function animate() {
  window.requestAnimationFrame(animate)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  stage.update()

  turtles.forEach(turtle => turtle.update())

  ctx.drawImage(
    pipes,
    0,
    0,
  )

  pow.update()
  mario.update()
}

powerBtn.addEventListener('click', e => {
  e.target.classList.toggle('active')
  canvasContainer.classList.toggle('active')
})

//  * INIT FUNCTIONS CALLS

powerBtn.click()
animate()
mario.addEventListeners()
// stage.spawnEnemies()
let enemiesCount;
switch (stage.currentStage) {
  case 1:
    enemiesCount = 10
    break;
  case 2: 
    enemiesCount = 15
    break;
  case 3:
    enemiesCount = 20
    break;
  default:
    break;
}

const generateEnemies = async () => {
  const randomSpawn = Math.random()
  let direction = (randomSpawn >= (1 - randomSpawn)) ? 0 : 1
    const newTurtle = new Turtle(canvas, ctx, {
      x: (direction == 0) ? canvas.width - 96 : 64,
      y: 48
    }, direction, mario, turtles)
    turtles.push(newTurtle)
}

const spawnDelay = 2000
const spawnInterval = 5000
let enemiesRemain = stage.enemiesCount[stage.currentStage]
const spawnEnemies = () => {
  if (enemiesRemain > 0) {
    generateEnemies()
    console.log(enemiesRemain);
    enemiesRemain--
    setTimeout(() => {
      spawnEnemies()
    }, spawnInterval);
  }
}
setTimeout(() => {
  spawnEnemies()
}, spawnDelay);



