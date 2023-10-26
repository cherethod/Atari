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

const mario = new Mario(canvas, ctx, {
  x: 50,
  y: 50
}, marioSprite);

const turtle1 = new Turtle(canvas, ctx, {
  x: canvas.width - 130, 
  y: 50
}, mario);

const stage = new Stages(canvas, ctx, {
  x: 0,
  y: 0,
});

const pow = new Pow(canvas, ctx, {
  x: 240,
  y: 320
});


//  * Animate loop
function animate() {
  window.requestAnimationFrame(animate)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  stage.update()

  turtle1.update()

  ctx.drawImage(
    pipes,
    0,
    0,
  )

  pow.update()
  mario.update()
  mario.updateAnimation()
  
  mario.velocity.x = 0
  if (pressedKeys.left.pressed) mario.velocity.x = -1
  else if (pressedKeys.right.pressed) mario.velocity.x = 1
  if (pressedKeys.left.pressed && mario.position.x <= 0 - mario.width /2) mario.position.x = canvas.width
  else if (pressedKeys.right.pressed && mario.position.x >= canvas.width) mario.position.x = 0
  if (
    !pressedKeys.left.pressed && !pressedKeys.right.pressed && 
    !pressedKeys.space.pressed && mario.isOverFloor() && mario.direction == 1 && 
    mario.status == 'alive'
    ) mario.setAnimation('idleRight')
    else if (
      !pressedKeys.left.pressed && !pressedKeys.right.pressed 
      && !pressedKeys.space.pressed && mario.isOverFloor() && 
      mario.direction == 0 && mario.status == 'alive'
      ) mario.setAnimation('idleLeft')

  // turtle1.checkCollision(mario)
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
if (mario.status == 'alive') {
  switch (e.code) {
    case (keyboardType = 1) ? 'KeyA': 'ArrowLeft' :
      if (!pressedKeys.left.pressed)  mario.setAnimation('runLeft')
      pressedKeys.left.pressed = true
      mario.direction = 0    
      break;
    case (keyboardType = 1) ? 'KeyD': 'ArrowRight' :
      if (!pressedKeys.right.pressed)  mario.setAnimation('runRight')    
      pressedKeys.right.pressed = true        
      mario.direction = 1
      break;
    case 'Space' :
      if (!pressedKeys.space.pressed && mario.direction == 0)  mario.setAnimation('jumpLeft')
      if (!pressedKeys.space.pressed && mario.direction == 1)  mario.setAnimation('jumpRight')
      pressedKeys.space.pressed = true      
      if (mario.isOverFloor() && mario.position.y >= 0 ){
        if (mario.position.y - CONFIGS.MARIO_JUMP >=0){
          mario.velocity.y = -CONFIGS.MARIO_JUMP
        }
        else if (mario.position.y - CONFIGS.MARIO_JUMP < 0) {
          alert()
        }
      
      } 
        
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
}
})

window.addEventListener('keyup', (e) => {
if (mario.status == 'alive') {
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
}
})

powerBtn.addEventListener('click', e => {
  e.target.classList.toggle('active')
  canvasContainer.classList.toggle('active')
})

//  * INIT FUNCTIONS CALLS

powerBtn.click()
animate()