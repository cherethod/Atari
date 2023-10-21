class Monster {
  constructor(canvas, ctx, position, sprite, player) {
    this.canvas = canvas
    this.ctx = ctx
    this.position = position
    this.sprite = sprite
    this.velocity = {
      x: 10,
      y: 1,
    }
    this.player = player

  }
}

export default Monster