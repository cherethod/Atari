class Pow {
  constructor(canvas, ctx, position, marios, turtles) {
    this.position = position
    this.canvas = canvas
    this.ctx = ctx
    this.marios = marios
    this.turtles = turtles
    this.width = 32
    this.height = 32
    this.sprite = new Image()
    this.sprite.src = '../resources/sprites/stages/Pow.png'
    this.uses = 3
    this.animations = {
      3: [{x: 0 , y: 0}],
      2: [{x: this.width , y: 0}],
      1: [{x: this.width * 2  , y: 0}],
      0: [{x: this.width * 3, y: 0}]
    }
    this.currentAnimation = 3
    this.frameIndex = 0
    this.status = 'normal'
    this.uses = 3
    this.isInUse = false
  }

  checkColision (mario) {
    const powLeft = this.position.x
    const powRight = this.position.x + this.width
    const powBottom = this.position.y + this.height // height must be decreased when lost uses

    const marioLeft = mario.position.x;
    const marioRight = mario.position.x + mario.width;
    const marioTop = mario.position.y;

    if (
      mario.status == 'alive' && mario.pressedKeys.space.pressed == true  && this.uses > 0 &&
      marioTop < powBottom && marioTop > powBottom - 10 && 
      marioRight - mario.width / 3 > powLeft && marioLeft + mario.width / 3 < powRight && !this.isInUse
      ) {
      // alert(this.uses)
      this.isInUse = true
      this.uses--
      this.currentAnimation--
      this.updateAnimation()
      this.turtles.forEach((turtle) => {
        turtle.setStatus('flipped')
        turtle.agro = false
        // alert()
      });
      if (this.uses === 0) {
        for (let i = 0; i < mario.marioCollisions.length; i++) {
          for (let j = 0; j < mario.marioCollisions[i].length; j++) {
            if (mario.marioCollisions[i][j] === 4) mario.marioCollisions[i][j] = 0
          }          
        }
      } 
      if (this.uses > 0 && this.isInUse) {
        setInterval(() => {
          this.isInUse = false
        }, 2500);
      }

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
    );
  }

   preShake() {
    this.ctx.save()
    let dx = Math.random()*4
    let dy = Math.random()*4
    this.ctx.translate(dx, dy);
  }
  
   postShake() {
    this.ctx.restore()
    this.status = 'normal'
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

  update () {
    this.draw()
    this.checkColision(this.marios[0])
  }
}

export default Pow;