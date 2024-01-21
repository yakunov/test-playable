import * as Matter from 'matter-js'
import {STATIC_SHAPES_CONFIG} from './Config'

export default class CollisionHelper {
  constructor(engine) {

    this.engine = engine
    
    this.staticBodies = []
    this.createShapes()
  }

  createShapes() {

    for (let shapeConfig of STATIC_SHAPES_CONFIG) {
      const vertices = []
      for (let i = 0; i < shapeConfig.contour.length; i+=2) {
        vertices.push({x: shapeConfig.contour[i], y: shapeConfig.contour[i + 1]})
      }
      const body = Matter.Bodies.fromVertices(0, 0, vertices, { isStatic: true })
      this.staticBodies.push(body)

      Matter.Body.setPosition(body, shapeConfig.position)
    }

    Matter.Composite.add(this.engine.world, this.staticBodies)
  }

  clear() {
    while(Matter.Composite.allBodies(this.engine.world).length > 0) {
      Matter.Composite.remove(this.engine.world, Matter.Composite.allBodies(this.engine.world)[0])
    } 

    Matter.Composite.add(this.engine.world, this.staticBodies)
  }

  add(piece) {
      Matter.Composite.add(this.engine.world, [piece.body])
  }

  remove(piece) {
    Matter.Composite.remove(this.engine.world, piece.body)
  }

  collides(piece) {
    const bodiesToCheck = Matter.Composite.allBodies(this.engine.world)
    const i = bodiesToCheck.indexOf(piece.body)
    if (i >= 0) bodiesToCheck.splice(i, 1)

    let collides = false;
    for (let part of piece.body.parts) {
      if (part == piece.body && piece.body.parts.length > 1) continue
      collides = collides || Matter.Query.collides(part, bodiesToCheck).length > 0
    }
    return collides
  }

  collidesInAllPositions(piece, positions) {
    const posX = piece.body.position.x
    const posY = piece.body.position.y

    for (let pos of positions) {
      Matter.Body.setPosition(piece.body, pos)
      if (! this.collides(piece)) {
        Matter.Body.setPosition(piece.body, {x: posX, y: posY})
        return false
      }
    }
    Matter.Body.setPosition(piece.body, {x: posX, y: posY})
    return true
  }
}