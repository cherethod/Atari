import CONFIGS from "./Configs.js";
import enemiesCollisions from "./EnemiesCollisions.js";

class Monster {
  constructor(canvas, ctx, position, direction, mario, turtles, spriteSrc) {
    this.canvas = canvas
    this.ctx = ctx
    this.position = position    
    this.direction = direction;
    this.mario = mario;
    this.turtles = turtles;
    this.sprite = new Image();
    this.sprite.src = spriteSrc;
    this.isAlive = true
    this.agro = false
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
  getCollisionValue (value) {
    const arrayColumns = enemiesCollisions[0].length
    const arrayRows = enemiesCollisions.length
    const arraySize = 8
    const arrayX = Math.floor(this.position.x / arraySize)
    const arrayY = Math.floor((this.position.y + this.height) / arraySize)

    if (arrayY < arrayRows && arrayX < arrayColumns) {
      if (enemiesCollisions[arrayY][arrayX] === value) {
        return false
      }
    }
    return true
  }

  checkPipeEntries () {
    /* DOWN - RIGHT PIPE */
    if (this.position.y >= 360 && this.position.y <= 367 && this.position.x >= 445 && this.position.x <= 455) {
      this.position.x = 64
      this.position.y = 48
      this.agro = true
    }

    /* DOWN - LEFT PIPE */    
    if (this.position.y >= 360 && this.position.y <= 367 && this.position.x >= 18 && this.position.x <= 20) {
      this.position.x = this.canvas.width - (64 + this.width)
      this.position.y = 48
      this.agro = true
    }
  }
  
  draw () {
    this.ctx.drawImage(
      this.sprite,
      this.animations[this.currentAnimation][this.frameIndex].x,
      this.animations[this.currentAnimation][this.frameIndex].y,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    )
  }

  update () {
    this.checkCollision(this.mario)
    this.updateAnimation()
    this.draw()    
    if (this.isAlive) {
      if (this.position.x < 0) {
        this.direction = 1;
        this.setAnimation ('runRight');
      } 
      if (this.position.x > this.canvas.width - this.width) {
        this.direction = 0;
        this.setAnimation ('runLeft');
      }

      (this.direction == 1) ? this.position.x += this.velocity.x : this.position.x -= this.velocity.x    

      this.position.y += this.velocity.y

      if (
        this.position.y + this.height + this.velocity.y < this.canvas.height - CONFIGS.STAGE_FLOOR_HEIGHT
          && !this.getCollisionValue(0)
        ) {
          this.velocity.y = this.velocity.y += CONFIGS.GRAVITY
        }
      else {
        this.velocity.y = 0
      }
      
      if (!this.getCollisionValue(3)) {
        this.position.y -= 8
        if (!this.agro) this.agro = false
      }
      this.checkPipeEntries()
    }
  } 
}


export default Monster