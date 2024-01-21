import * as PIXI from 'pixi.js'
import Scenario from '../Tools/Scenario'
import gsap from "gsap"
import FiguresContainer from './FiguresContainer'

export default class Final extends PIXI.Sprite {
  constructor() {
    super()

    this.alpha = 0

    const bg = PIXI.Sprite.from(window.images['bg'])
    bg.anchor.set(0.5, 0.5)
    bg.scale.set(10, 5)
    this.addChild(bg)

    this.floor = PIXI.Sprite.from(window.images['floor'])
    this.floor.anchor.set(0.5, 0)
    this.floor.scale.set(1.4, 1.4)
    this.addChild(this.floor)

    this.logo = PIXI.Sprite.from(window.images['logo'])
    this.logo.anchor.set(0.5, 0.5)
    this.logo.scale.set(0.5, 0.5)
    this.logo.alpha = 0
    //logo.scale.set(0.6, 0.6)
    this.logo.position.set(0, -120)
    this.addChild(this.logo)

    this.buttonInstall = PIXI.Sprite.from(window.images['button_final'])
    this.buttonInstall.anchor.set(0.5, 0.5)
    this.buttonInstall.scale.set(0.8, 0.8)
    this.buttonInstall.alpha = 0
    //buttonInstall.scale.set(1.2, 1.2)
    this.buttonInstall.position.set(0, 80)
    this.addChild(this.buttonInstall)
    const playNow = PIXI.Sprite.from(window.images['play_now'])
    playNow.anchor.set(0.5, 0.5)
    playNow.scale.set(0.5, 0.5)
    playNow.position.set(0, -6)
    this.buttonInstall.addChild(playNow)

    this.figures = new FiguresContainer()
    this.addChild(this.figures)
  }

  show() {
    this.buttonInstall.eventMode = 'static';
    this.buttonInstall.on('pointerdown', () => window.clickInstall())

    const animTime = 2
    const scenario = new Scenario([
      () => gsap.to(this, { alpha: 1, duration: 0.5, ease: 'power2.out' }),
      () => this.figures.animate(),
      () => gsap.to(this.logo, { alpha: 1, duration: animTime / 2, ease: 'power2.out' }),
      () => gsap.to(this.logo.scale, {x: 1, y: 1, duration: animTime, ease: 'elastic.out(1,0.4)' }),
      animTime / 20,
      () => gsap.to(this.buttonInstall, { alpha: 1, duration: animTime / 2, ease: 'power2.out' }),
      () => gsap.to(this.buttonInstall.scale, {x: 1.2, y: 1.2, duration: animTime, ease: 'elastic.out(1,0.4)' }),
    ])

    scenario.start()
  }

  resize(width, height) {
    if (height / width > 1.6) {
      this.floor.position.set(0, 300)
      this.figures.scale.set(1, 1)
    }
    else if (height / width > 1.4) {
      this.floor.position.set(0, 200)
      this.figures.scale.set(1, 1)
    }
    else if (height / width > 1.2) {
      this.floor.position.set(0, 100)
      this.figures.scale.set(1, 1)
    }
    else {
      this.floor.position.set(0, 50)
      this.figures.scale.set(0.8, 0.8)
    }
  }
}