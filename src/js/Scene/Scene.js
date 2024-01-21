import * as PIXI from 'pixi.js'
import Puzzle, {PUZZLE_EVENTS} from '../Puzzle/Puzzle'
import Scenario from '../Tools/Scenario'
import CTA from './CTA'
import Message from './Message'
import Final from '../Final/Final'

export default class Scene extends PIXI.Sprite {
  constructor(app, engine) {
    super()

    this.app = app
    this.engine = engine

    const bg = PIXI.Sprite.from(window.images['bg'])
    bg.anchor.set(0.5, 0.5)
    bg.scale.set(10, 5)
    this.addChild(bg)

    this.cta = new CTA()
    this.addChild(this.cta)

    this.puzzle = new Puzzle(this.engine)
    this.addChild(this.puzzle)
    this.puzzle.scale.set(0.7, 0.7)

    this.puzzle.on(PUZZLE_EVENTS.puzzleComplete, () => this.completeListener())
    this.puzzle.on(PUZZLE_EVENTS.puzzleFailed, () => this.failedListener())

    this.message = new Message()
    this.addChild(this.message)

    this.final = new Final()
    this.addChild(this.final)
  }

  completeListener() {
    const scenario = new Scenario([
      () => this.message.showWellDone(),
      2,
      () => this.final.show()
    ])

    scenario.start()
  }

  failedListener() {
    const scenario = new Scenario([
      0.5,
      () => this.puzzle.showRedGlow(),
      1,
      () => this.message.showTryAgain(),
      1.5,
      () => this.puzzle.restart()
      
    ])

    scenario.start()
  }

  resize(width, height) {
    this.cta.resize(width, height)
    this.final.resize(width, height)
  }
}