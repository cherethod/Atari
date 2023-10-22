import CONFIGS from "./Configs.js";
import Mario from "./Mario.js";
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


// const enemiesSprite = new Image()
// enemiesSprite.src = '../resources/characters.png'

//  * CONSTRUCTORS 

const mario = new Mario(canvas, ctx, {
  x: 50,
  y: 50
}, marioSprite);

const turtle1 = new Turtle(canvas, ctx, {
  x: 150, 
  y: 50
})

const stage = new Stages(canvas, ctx, {
  x: 0,
  y: 0,
})


//  * Animate loop
function animate() {
  window.requestAnimationFrame(animate)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  stage.update()
  mario.update()
  turtle1.update()

  mario.velocity.x = 0
  if (pressedKeys.left.pressed) mario.velocity.x = -1
  else if (pressedKeys.right.pressed) mario.velocity.x = 1

  checkCollision()
}


// TODO -> JOEL ARREGLAR ESTA
function checkCollision () {
  console.log(`Mario X -> ${mario.position.x} - Turtle X -> ${turtle1.position.x} \n 
  Mario Y -> ${mario.position.y} - Turtle Y -> ${turtle1.position.y} `);
  if (
    turtle1.position.x - turtle1.width == mario.position.x 
    && turtle1.position.y - (mario.height)== mario.position.y ||
    turtle1.position.x + turtle1.width == mario.position.x 
    && turtle1.position.y - (mario.height)== mario.position.y
    ) {
    alert()
  }
}


//  * Pressed side keys map
const pressedKeys = {
  left: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
}

//  * LISTENERS

window.addEventListener('keydown', (e) => {
  // console.log(e.code);
 switch (e.code) {
  case (keyboardType = 1) ? 'KeyA': 'ArrowLeft' :
    pressedKeys.left.pressed = true
    break;
  case (keyboardType = 1) ? 'KeyD': 'ArrowRight' :
    pressedKeys.right.pressed = true    
    break;
  case 'Space' :
    (mario.isOverFloor()) ? mario.velocity.y = -5 : null
    break;
    // * TEST STAGE UPDATE
  case 'F1':
    console.log(stage.currentStage++);
    stage.currentStage = (stage.currentStage > 3) ? 1 : stage.currentStage++
    stage.image.src = stage.stages[stage.currentStage]
    break
  default:
    break;
 }
})

window.addEventListener('keyup', (e) => {
 switch (e.code) {
  case (keyboardType = 1) ? 'KeyA': 'ArrowLeft' :
    pressedKeys.left.pressed = false
    break;
  case (keyboardType = 1) ? 'KeyD': 'ArrowRight' :
    pressedKeys.right.pressed = false    
    break;
  default:
    break;
 }
})

powerBtn.addEventListener('click', e => {
  e.target.classList.toggle('active')
  canvasContainer.classList.toggle('active')
})

//  * INIT FUNCTIONS CALLS

powerBtn.click()
animate()