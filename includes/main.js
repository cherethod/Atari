import CONFIGS from "./Configs.js";
import Mario from "./Mario.js";
import Turtle from "./Turtle.js";
const powerBtn = document.querySelector('.btn__power');
const canvasContainer = document.querySelector('.canvas__container')

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = CONFIGS.BOARD_WIDTH
canvas.height = CONFIGS.BOARD_HEIGHT

const imageSprite = new Image()
imageSprite.src = '../resources/sprite.png'

const mario = new Mario(canvas, ctx, {
  x: 50,
  y: 50
}, imageSprite);

const turtle1 = new Turtle(canvas, ctx, {
  x: 150, 
  y: 50
}, imageSprite, mario.position.x, mario.position.y)


// const mario = new Mario(canvas, ctx, {
//   x: (canvas.width - CONFIGS.CHARACTER_WIDTH) / 2,
//   y: canvas.height / 2  - CONFIGS.CHARACTER_HEIGHT
// }, imageSprite);

function animate() {
  window.requestAnimationFrame(animate)
  // * BOARD
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  mario.update()
  turtle1.update()
  checkCollision()
  imageSprite.width = 30
  imageSprite.height = 30  
}

function checkCollision () {
  console.log(`Mario X -> ${mario.position.x} - Turtle X -> ${turtle1.position.x} \n 
  Mario Y -> ${mario.position.y} - Turtle Y -> ${turtle1.position.y} `);
  if (
    turtle1.position.x - turtle1.width == mario.position.x 
    && turtle1.position.y - (mario.height / 2)== mario.position.y ||
    turtle1.position.x + turtle1.width == mario.position.x 
    && turtle1.position.y - (mario.height / 2)== mario.position.y
    ) {
    alert()
  }
}
const pressedKeys = {
  ArrowLeft : false,
  ArrowRight : false,
  ArrowDown : false,
  ArrowUp : false, 
  Space : false  
}

// ! REWORK THIS TRASH

document.addEventListener('keydown', e => {  
  console.log(e);
    pressedKeys[e.key] = true
    if (e.keyCode == 32) pressedKeys.Space  = true
    if (pressedKeys.ArrowLeft && !pressedKeys.ArrowRight && !pressedKeys.ArrowUp && !pressedKeys.ArrowDown && mario.position.x + mario.width > 0) {
      mario.position.x -= mario.velocity.x
    }
    else if (!pressedKeys.ArrowLeft && pressedKeys.ArrowRight && !pressedKeys.ArrowUp && !pressedKeys.ArrowDown && mario.position.x + mario.width < canvas.width) {
      mario.position.x += mario.velocity.x
    }
    else if (e.keyCode === 32) {
      if (mario.position.y === canvas.height - mario.height) {
        mario.position.y -= mario.height * 1.5 
      }
    }
    else if (pressedKeys.ArrowLeft || pressedKeys.ArrowRight && !pressedKeys.ArrowUp && !pressedKeys.ArrowDown && pressedKeys.Space) {
      
      if (pressedKeys.ArrowLeft && mario.position.y === canvas.height - mario.height) {
        mario.position.y -= mario.height * 1.5 
        mario.position.x -= mario.velocity.x
      }
      else if (pressedKeys.ArrowRight && mario.position.y === canvas.height - mario.height) {
        mario.position.y += mario.height * 1.5 
        mario.position.x -= mario.velocity.x
      }
    }

})
document.addEventListener('keyup', e => {
  pressedKeys[e.key]=false
  if (e.keyCode == 32) pressedKeys.Space = false
})


powerBtn.addEventListener('click', e => {
  e.target.classList.toggle('active')
  canvasContainer.classList.toggle('active')
})

powerBtn.click()
animate()