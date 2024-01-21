import * as PIXI from 'pixi.js'

const BASE_SIZE = 640

export default class ScalableContainer extends PIXI.Sprite {
  constructor(app) {
    super()

    this.app = app
    this.appCanvas = app.renderer.view
  }

  resize(width, height) {
    this.position.set(this.appCanvas.width / 2, this.appCanvas.height / 2)

    if (width < height) {
      this.scale.set(width / BASE_SIZE, width / BASE_SIZE)
    }
    else {
      this.scale.set(height / BASE_SIZE, height / BASE_SIZE)
    }

    for (let child of this.children) {
      if (child.resize) child.resize(width, height)
    }
  }
}