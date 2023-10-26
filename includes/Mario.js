import CONFIGS from "./Configs.js";

class Mario {
  constructor(canvas, ctx, position, sprite) {
    this.position = position;
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = 32;
    this.height = 48;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.marioSprite = sprite;
    this.animations = {
      'idleRight': [{ x: 0, y: 0 }],
      'idleLeft': [{ x: this.width * 19, y: 0 }],
      'runRight': [
        // { x: 0, y: 0 },
        { x: this.width, y: 0 },
        { x: this.width * 2, y: 0 },
        { x: this.width * 3, y: 0 },
      ],
      'runLeft': [
        // { x: this.width * 19, y: 0 },
        { x: this.width * 18, y: 0 },
        { x: this.width * 17, y: 0 },
        { x: this.width * 16, y: 0 },
      ],
      'jumpRight': [{x: this.width * 4, y: 0}],
      'jumpLeft': [{x: this.width * 15, y: 0}],
      'stop': [{x: this.width * 5, y: 0}],
      'fall': [{x: this.width * 7, y: 0}],
    };
    this.frameIndex = 0;
    this.currentAnimation = 'idleRight'
    this.animationSpeed = 5
    this.animationCounter = 0
    this.direction = 1 // 1 right  -  0 left
    this.status = 'alive'
  }

  updateAnimation() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      this.animationCounter++;
      if (this.animationCounter >= this.animationSpeed) {
        this.animationCounter = 0;
        this.frameIndex = (this.frameIndex + 1) % animation.length;
      }
    }
  }

  setAnimation (animationName) {
    this.frameIndex = 0
    this.currentAnimation = animationName
    this.animationCounter = 0
  }

  draw() {
  this.ctx.drawImage(
      this.marioSprite, // This is the sprite
      this.animations[this.currentAnimation][this.frameIndex].x, // Position X in the sprite
      this.animations[this.currentAnimation][this.frameIndex].y, // Position Y in the sprite
      this.width, // Sprite width
      this.height, // Sprite height
      this.position.x, // Position X in canvas
      this.position.y, // Position Y in canvas
      this.width, // Ni puta idea por qué repetimos ancho
      this.height // Ni puta idea por qué repetimos alto
    );
  }

  update() {
    this.draw();
    // Gravity system (more or less)
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    // console.log(this.position.x);
    if (this.position.y + this.height + this.velocity.y < this.canvas.height - CONFIGS.STAGE_FLOOR_HEIGHT)
      this.velocity.y += CONFIGS.GRAVITY;
    else this.velocity.y = 0;
  }

  killMario() {
    if (this.status == 'alive') {
      this.velocity.x = 0
      this.velocity.y = 0
      this.status = 'dead'
      this.setAnimation('stop')  
    }
   }

  isOverFloor() {
    if (this.position.y + this.height + this.velocity.y < this.canvas.height - CONFIGS.STAGE_FLOOR_HEIGHT) {
      return false
    }
    else {            
      return true
    }
  }
}

export default Mario;
