class Monster {
  constructor(canvas, ctx, position, sprite) {
    this.canvas = canvas
    this.ctx = ctx
    this.position = position
    this.sprite = sprite
    this.direction = 1 // 1 right  -  0 left 
    this.velocity = {
      x: 10,
      y: 1,
    }   

  }



}

export default Monster