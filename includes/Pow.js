class Pow {
  constructor(canvas, ctx, position, mario) {
    this.position = position
    this.canvas = canvas
    this.ctx = ctx
    this.mario = mario
    this.width = 32
    this.height = 32
    this.sprite = new Image()
    this.sprite.src = '../resources/sprites/stages/Pow.png'
    this.uses = 3
    this.animations = {
      'full': [{x: 0 , y: 0}],
      'mid': [{x: this.width , y: 0}],
      'last': [{x: this.width * 2  , y: 0}],
    }
    this.currentAnimation = 'full'
    this.frameIndex = 0
    this.status = 'normal'
    // this.animationCounter = 0
    // this.animationSpeed = 3
  }

  checkColision (mario) {
    const powHitBoxStart = {
      x: this.position.x,
      y: this.position.y
    }
    const powHitBoxEnd = {
      x: this.position.x + this.width,
      y: this.position.y + this.height
    }
    
    if (
          (
            mario.position.x + mario.width > powHitBoxStart.x &&       
            mario.position.x < powHitBoxEnd.x
          ) &&
  
          (
            (
              mario.position.y + mario.height > powHitBoxStart.y &&
              mario.position.y + mario.height < powHitBoxEnd.y
            ) || (
              mario.position.y < powHitBoxEnd.y &&
              mario.position.y >= powHitBoxStart.y
            )
          )
        ) {
        console.log('HIT desde derecha')
        if (this.status == 'normal') {
          this.status = 'shacking'
          this.preShake()
          setInterval(() => {
            this.postShake()
          }, 100);
        }
      }

    // if (
    //   (mario.position.x > powHitBoxStart &&
    //     mario.position.x < powHitBoxEnd) &&
    //   (mario.position.y > powHitBoxStart &&
    //     mario.position.y < powHitBoxEnd)
    //   ) {
    //   console.log(TOCA)
    // }
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
  }

  update () {
    this.draw()
    this.checkColision(this.mario)
  }
}

export default Pow;