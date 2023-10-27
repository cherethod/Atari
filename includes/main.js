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
// const newTurtle = new Turtle(canvas, ctx, {
//   x: canvas.width - 130, 
//   y: 50
// }, 0, 0, mario, turtles);
// turtles.push(newTurtle)

/*
const turtle1 = new Turtle(canvas, ctx, {
  x: canvas.width - 130, 
  y: 50
}, 0, 0, mario);
*/
const stage = new Stages(canvas, ctx, {
  x: 0,
  y: 0,
});

const pow = new Pow(canvas, ctx, {
  x: 240,
  y: 320
}, mario, turtles);

const generateEnemies = async () => {
    const randomSpawn = Math.random()
    let direction = (randomSpawn >= (1 - randomSpawn)) ? 0 : 1
      const newTurtle = new Turtle(canvas, ctx, {
        x: (direction == 0) ? canvas.width - 96 : 64,
        y: 48
      }, direction, mario, turtles)
      turtles.push(newTurtle)
}

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
  mario.updateAnimation()
  
  mario.velocity.x = 0
  if (mario.pressedKeys.left.pressed) mario.velocity.x = -2
  else if (mario.pressedKeys.right.pressed) mario.velocity.x = 2
  if (mario.pressedKeys.left.pressed && mario.position.x <= 0 - mario.width /2) mario.position.x = canvas.width
  else if (mario.pressedKeys.right.pressed && mario.position.x >= canvas.width) mario.position.x = 0
  if (
    !mario.pressedKeys.left.pressed && !mario.pressedKeys.right.pressed && 
    !mario.pressedKeys.space.pressed && mario.isOverFloor() && mario.direction == 1 && 
    mario.status == 'alive'
    ) mario.setAnimation('idleRight')
    else if (
      !mario.pressedKeys.left.pressed && !mario.pressedKeys.right.pressed 
      && !mario.pressedKeys.space.pressed && mario.isOverFloor() && 
      mario.direction == 0 && mario.status == 'alive'
      ) mario.setAnimation('idleLeft')
  // turtle1.checkCollision(mario)

}




//  * LISTENERS

// window.addEventListener('keydown', (e) => {
//   // console.log(e.code);
// if (mario.status == 'alive') {
//   switch (e.code) {
//     case (keyboardType = 1) ? 'KeyA': 'ArrowLeft' :
//       if (!pressedKeys.left.pressed)  mario.setAnimation('runLeft')
//       pressedKeys.left.pressed = true
//       mario.direction = 0    
//       break;
//     case (keyboardType = 1) ? 'KeyD': 'ArrowRight' :
//       if (!pressedKeys.right.pressed)  mario.setAnimation('runRight')    
//       pressedKeys.right.pressed = true        
//       mario.direction = 1
//       break;
//     case 'Space' :
//       if (!pressedKeys.space.pressed && mario.direction == 0)  mario.setAnimation('jumpLeft')
//       if (!pressedKeys.space.pressed && mario.direction == 1)  mario.setAnimation('jumpRight')
//       pressedKeys.space.pressed = true      
//       if (mario.isOverFloor() && mario.position.y >= 0 ){
//         if (mario.position.y - CONFIGS.MARIO_JUMP >=0){
//           mario.velocity.y = -CONFIGS.MARIO_JUMP
//         }
//         else if (mario.position.y - CONFIGS.MARIO_JUMP < 0) {
//           alert()
//         }
      
//       } 
        
//       break;
//       // * TEST STAGE UPDATE
//     case 'F1':
//       // console.log(stage.currentStage++);
//       stage.currentStage = (stage.currentStage > 3) ? 1 : stage.currentStage++
//       stage.image.src = stage.stages[stage.currentStage]
//       break
//     default:
//       break;
//    }
// }
// })

// window.addEventListener('keyup', (e) => {
// if (mario.status == 'alive') {
//   switch (e.code) {
//     case (keyboardType = 1) ? 'KeyA': 'ArrowLeft' :
//       pressedKeys.left.pressed = false
//       // mario.setAnimation('idle')
//       break;
//     case (keyboardType = 1) ? 'KeyD': 'ArrowRight' :
//       pressedKeys.right.pressed = false    
//       // mario.setAnimation('idle')
//       break
//     case 'Space': 
//         pressedKeys.space.pressed = false
//         // (mario.isOverFloor()) ? mario.setAnimation('idle') : null
//     default:
//       break;
//    }
// }
// })

powerBtn.addEventListener('click', e => {
  e.target.classList.toggle('active')
  canvasContainer.classList.toggle('active')
})

//  * INIT FUNCTIONS CALLS

powerBtn.click()
animate()
mario.addEventListeners()
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

for (let i = 0; i < enemiesCount; i++) {
  console.log(enemiesCount);
  await generateEnemies()
  enemiesCount -= 1
  setInterval(() => {
    
  }, 5000);
}

