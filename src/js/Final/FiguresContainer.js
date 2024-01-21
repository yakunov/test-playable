import * as PIXI from 'pixi.js'
import Scenario from '../Tools/Scenario'
import gsap from "gsap"

const FIGURES_CONFIG = [
  {
    image: 'final/figure_1',
    position: {x: -290, y: -440}
  },
  {
    image: 'final/figure_4',
    position: {x: -240, y: 360}
  },
  {
    image: 'final/figure_5',
    position: {x:  230, y: 460}
  },
  {
    image: 'final/figure_2',
    position: {x:  150, y: -530}
  },
  {
    image: 'final/figure_3',
    position: {x:  300, y: -300}
  },
  {
    image: 'final/figure_1',
    position: {x: 650, y: 50}
  },
  {
    image: 'final/figure_2',
    position: {x: -650, y: 0}
  },
]

const FIGURES_MOVE_DELTA = 1.3
const FIGURES_SCALE_DELTA = 0.6

export default class FiguresContainer extends PIXI.Sprite {
  constructor() {
    super()

    this.figures = []
    this.addFigures()
  }

  addFigures() {
    for (let figConfig of FIGURES_CONFIG) {
      const figure = PIXI.Sprite.from(window.images[figConfig.image])
      figure.anchor.set(0.5, 0.5)
      figure.scale.set(1.6 * FIGURES_SCALE_DELTA, 1.6 * FIGURES_SCALE_DELTA)
      figure.position.set(figConfig.position.x * FIGURES_MOVE_DELTA, figConfig.position.y * FIGURES_MOVE_DELTA)
      figure.alpha = 0
      figure.config = figConfig
      this.addChild(figure)
      this.figures.push(figure)
    }
  }

  animate() {
    const moveTime = 2
    const scenario = new Scenario()

    for (let figure of this.figures) {
      scenario.add(() => gsap.to(figure, { alpha: 1, duration: 0.2, ease: 'power2.out'})),
      scenario.add(() => gsap.to(figure.position, { x: figure.config.position.x, y: figure.config.position.y, duration: moveTime, ease: 'elastic.out(1,0.4)' })),
      scenario.add(() => gsap.to(figure.scale, { x: 1.6, y: 1.6, duration: moveTime, ease: 'elastic.out(1,0.4)' })),
      scenario.add(moveTime / 20)
    }

    scenario.start()
  }
}