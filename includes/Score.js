class Score {
    constructor(canvas, ctx, marios, turtles, playerPoints, enemiesKilled) {
        this.canvas = canvas
        this.ctx = ctx
        this.mario = marios[0]
        this.turtles = turtles
        this.playerPoints = playerPoints
        this.enemiesKilled = enemiesKilled
    }
}