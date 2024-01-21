import * as PIXI from 'pixi.js'
import Scenario from '../Tools/Scenario'
import gsap from 'gsap'

export default class Message extends PIXI.Sprite {
  constructor() {
    super()

    this.bg = new PIXI.Graphics()
    this.bg.beginFill(0x000000)
    this.bg.drawRect(-1500, -1500, 3000, 3000)
    this.bg.alpha = 0
    this.addChild(this.bg)

    this.textTryAgain = PIXI.Sprite.from(window.images['try_again'])
    this.textTryAgain.anchor.set(0.5, 0.5)
    this.textTryAgain.scale.set(0.5, 0.5)
    this.textTryAgain.alpha = 0
    this.addChild(this.textTryAgain)

    this.textWellDone = PIXI.Sprite.from(window.images['well_done'])
    this.textWellDone.anchor.set(0.5, 0.5)
    this.textWellDone.scale.set(0.5, 0.5)
    this.textWellDone.alpha = 0
    this.addChild(this.textWellDone)
  }

  showTryAgain() {
    const scenario = new Scenario([
      () => gsap.to(this.bg, { alpha: 0.5, duration: 0.5, ease: 'power1.out' }),
      0.3,
      () => gsap.to(this.textTryAgain, { alpha: 1, duration: 0.5, ease: 'power1.out' }),
      () => gsap.to(this.textTryAgain.scale, { x: 1.2, y: 1.2, duration: 0.8, ease: 'back.out' }),
      1,
      () => gsap.to(this.bg, { alpha: 0, duration: 0.2, ease: 'power1.out' }),
      () => gsap.to(this.textTryAgain, { alpha: 0, duration: 0.2, ease: 'power1.out' }),
      0.2,
      () => this.textTryAgain.scale.set(0.5, 0.5)
    ])

    scenario.start()
  }

  showWellDone() {
    const scenario = new Scenario([
      () => gsap.to(this.bg, { alpha: 0.3, duration: 0.5, ease: 'power1.out' }),
      0.3,
      () => gsap.to(this.textWellDone, { alpha: 1, duration: 0.5, ease: 'power1.out' }),
      () => gsap.to(this.textWellDone.scale, { x: 1.2, y: 1.2, duration: 0.8, ease: 'back.out' }),
      3,
      () => gsap.to(this.bg, { alpha: 0, duration: 0.2, ease: 'power1.out' }),
      () => gsap.to(this.textWellDone, { alpha: 0, duration: 0.2, ease: 'power1.out' }),
      0.2,
      () => this.textWellDone.scale.set(0.5, 0.5)
    ])

    scenario.start()
  }
}