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
  x: canvas.width - 130, 
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
  mario.updateAnimation()
  turtle1.update()

  mario.velocity.x = 0
  if (pressedKeys.left.pressed && mario.position.x > 0) mario.velocity.x = -1
  else if (pressedKeys.right.pressed && mario.position.x < canvas.width - mario.width) mario.velocity.x = 1

  checkCollision()
}


// TODO -> JOEL ARREGLAR ESTA
function checkCollision () {
  // console.log(`Mario X -> ${mario.position.x} - Turtle X -> ${turtle1.position.x} \n 
  // Mario Y -> ${mario.position.y} - Turtle Y -> ${turtle1.position.y} `);

  // console.log(`
  // Posicion X Mario -> ${mario.position.x}\n
  // Posicion X Tortuga -> ${turtle1.position.x}\n
  // Diferencia posiciones -> ${mario.position.x - turtle1.position.x - turtle1.width}\n
  // `)
  // if (
  //   turtle1.direction == 0 && turtle1.position.y - (mario.height - turtle1.height) == mario.position.y &&
  //   ((mario.position.x ) - (turtle1.position.x - mario.width)) >= 0 && (mario.position.x - turtle1.position.x + mario.width) <= turtle1.width / 4 
  // ) console.log('colision tortuga hacia izquierda')
  // if (
  //   turtle1.direction == 1 && turtle1.position.y - (mario.height - turtle1.height) == mario.position.y &&
  //   // ((turtle1.position.x + turtle1.width) - mario.position.x) <= 0 && (mario.position.x - turtle1.position.x + mario.width) <= turtle1.width / 4 
  //   turtle1.position.x == mario.position.x - turtle1.width /*&& (mario.position.x - turtle1.position.x + turtle1.width) >= mario.width /4 * -1*/
  // ) console.log('colision tortuga hacia derecha')
if (
  mario.position.x + mario.width >= turtle1.position.x &&
  mario.position.x <= turtle1.position.x + turtle1.width &&
  mario.position.y == turtle1.position.y
  ) console.log('collision')

  if (
    !pressedKeys.left.pressed && !pressedKeys.right.pressed 
    && !pressedKeys.space.pressed && mario.isOverFloor()) mario.setAnimation('idle')

}


//  * Pressed side keys map
const pressedKeys = {
  left: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
  space: {
    pressed: false
  }
}

//  * LISTENERS

window.addEventListener('keydown', (e) => {
  // console.log(e.code);
 switch (e.code) {
  case (keyboardType = 1) ? 'KeyA': 'ArrowLeft' :
  if (!pressedKeys.left.pressed)  mario.setAnimation('runLeft')
  pressedKeys.left.pressed = true
    
    break;
  case (keyboardType = 1) ? 'KeyD': 'ArrowRight' :
    if (!pressedKeys.right.pressed)  mario.setAnimation('runRight')    
    pressedKeys.right.pressed = true        
    break;
  case 'Space' :
    if (!pressedKeys.left.pressed)  mario.setAnimation('jump')
    pressedKeys.space.pressed = true
    if (mario.isOverFloor()) mario.velocity.y = -5     
    break;
    // * TEST STAGE UPDATE
  case 'F1':
    // console.log(stage.currentStage++);
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
    // mario.setAnimation('idle')
    break;
  case (keyboardType = 1) ? 'KeyD': 'ArrowRight' :
    pressedKeys.right.pressed = false    
    // mario.setAnimation('idle')
    break
  case 'Space': 
      pressedKeys.space.pressed = false
      // (mario.isOverFloor()) ? mario.setAnimation('idle') : null
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