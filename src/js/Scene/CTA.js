import * as PIXI from 'pixi.js'

export default class CTA extends PIXI.Sprite {
  constructor() {
    super()

    const bg = PIXI.Sprite.from(window.images['text_bg'])
    bg.anchor.set(0.5, 0.5)
    this.addChild(bg)

    const text = PIXI.Sprite.from(window.images['cta'])
    text.anchor.set(0.5, 0.5)
    this.addChild(text)

    this.scale.set(0.7, 0.7)
    this.position.set(0, -250)
  }

  resize(width, height) {
    if (height / width > 1.4) {
      this.position.set(0, -330)
      this.scale.set(0.8, 0.8)
    }
    else if (height / width > 1.2) {
      this.position.set(0, -290)
      this.scale.set(0.8, 0.8)
    }
    else {
      this.scale.set(0.6, 0.6)
      this.position.set(0, -250)
    }
  }
}
