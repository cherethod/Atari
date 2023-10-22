import CONFIGS from "./Configs.js";

class Mario {
  constructor(canvas, ctx, position, sprite) {
    this.position = position;
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = 18;
    this.height = 21;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.marioSprite = sprite;
    // this.spriteHeight = 21;
    // this.spriteWidth = 18;
    this.animations = {
      idle: [{ x: 0, y: 0 }],
      run: [
        {x: this.width, y: 0 },
        {x: this.width * 2, y: 0 },
        {x: this.width * 3, y: 0 },
      ],
      jump: [{x: this.width * 4, y: 0}],
      stop: [{x: this.width * 5, y: 0}],
      fall: [{x: this.width * 7, y: 0}],
    };
    this.frameIndex = 0;
  }

  draw() {
    this.ctx.drawImage(
      this.marioSprite, // This is the sprite
      0, // Position X in the sprite
      0, // Position Y in the sprite
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
    if (this.position.y + this.height + this.velocity.y < this.canvas.height - CONFIGS.STAGE_FLOOR_HEIGHT)
      this.velocity.y += CONFIGS.GRAVITY;
    else this.velocity.y = 0;
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
