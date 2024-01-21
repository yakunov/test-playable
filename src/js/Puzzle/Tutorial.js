import * as PIXI from 'pixi.js'
import gsap from 'gsap'
import {PIECES_CONFIG} from './Config'
import Scenario from '../Tools/Scenario'

export default class Tutorial extends PIXI.Sprite {
  constructor() {
    super()

    this.zIndex = 100
    this.eventMode = 'none'

    this.pieceConfig = PIECES_CONFIG[0]
    this.handTargetPos = {x: 35, y: -150}
    this.handShift = {x: 30, y: 50}

    this.mover = new PIXI.Sprite()
    this.mover.position.set(this.pieceConfig.startPos.x, this.pieceConfig.startPos.y)
    this.addChild(this.mover)

    this.piece = PIXI.Sprite.from(this.pieceConfig.image)
    this.piece.anchor.set(0.5, 0.5)
    this.piece.alpha = 0
    this.mover.addChild(this.piece)

    this.hand = PIXI.Sprite.from(window.images['hand'])
    this.hand.anchor.set(0.2, 0.1)
    this.hand.position.set(this.handTargetPos.x + this.handShift.x, this.handTargetPos.y + this.handShift.y)
    this.hand.alpha = 0
    this.mover.addChild(this.hand)

    this.stopped = false
  }

  show() {
    this.alpha = 1
    this.scenario = new Scenario([
      0.5,
      () => gsap.to(this.piece, { alpha: 0.5, duration: 0.5, ease: 'power2.out' }),
      () => gsap.to(this.hand, { alpha: 1, duration: 0.5, ease: 'power2.out' }),
      () => gsap.to(this.hand.position, { x: this.handTargetPos.x, y: this.handTargetPos.y, duration: 0.5, ease: 'power2.out' }),
      0.5,
      () => gsap.to(this.mover.position, { x: 0, y: 0, duration: 1, ease: 'sine.inOut' }),
      1,
      () => gsap.to(this.piece, { alpha: 0, duration: 0.5, ease: 'power2.out' }),
      () => gsap.to(this.hand, { alpha: 0, duration: 0.5, ease: 'power2.out' }),
      () => gsap.to(this.hand.position, { x: this.handTargetPos.x + this.handShift.x, y: this.handTargetPos.y + this.handShift.y, duration: 0.5, ease: 'power2.out' }),
      1,
      () => this.mover.position.set(this.pieceConfig.startPos.x, this.pieceConfig.startPos.y),
    ])

    this.scenario.loop = true
    this.scenario.start()
  }

  hide() {
    if (this.stopped) return
    this.stopped = true
    this.scenario.stop()
    gsap.to(this, { alpha: 0, duration: 0.2, ease: 'power2.out' })
  }
}