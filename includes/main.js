import CONFIGS from "./Configs.js";

const powerBtn = document.querySelector('.btn__power');
const canvasContainer = document.querySelector('.canvas__container')

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = CONFIGS.BOARD_WIDTH
canvas.height = CONFIGS.BOARD_HEIGHT

ctx.fillStyle = 'white'
ctx.fillRect((CONFIGS.BOARD_WIDTH - 50) / 2, CONFIGS.BOARD_HEIGHT - 50, 50, 50)



powerBtn.addEventListener('click', e => {
  e.target.classList.toggle('active')
  canvasContainer.classList.toggle('active')
})