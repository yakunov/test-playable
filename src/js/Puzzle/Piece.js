import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js'

export default class Piece extends PIXI.Sprite {
  constructor(config) {
    super()

    this.enabled = true

    this.zIndex = config.zIndex
    this.defaultZIndex = config.zIndex
    this.startPos = config.startPos

    this.sprite = PIXI.Sprite.from(config.image)
    this.sprite.anchor.set(0.5, 0.5)
    this.addChild(this.sprite)

    var g = new PIXI.Graphics()
    g.beginFill(0x5d0015)
    g.drawPolygon(...config.contour)
    g.endFill()
    g.alpha = 0.5

    this.hitArea = new PIXI.Polygon(...config.contour)
    this.eventMode = 'static'

    const vertices = []
    for (let i = 0; i < config.contour.length; i+=2) {
      vertices.push({x: config.contour[i], y: config.contour[i + 1]})
    }

    this.body = Matter.Bodies.fromVertices(0, 0, vertices, { isStatic: true })
    Matter.Body.setCentre( this.body, config.centerShift, true );
    
    this.position.set(config.startPos.x, config.startPos.y)

    this.updateBodyPosition()
  }

  updateBodyPosition() {
    Matter.Body.setPosition(this.body, {x: this.x, y: this.y});
  }
}