import * as PIXI from 'pixi.js'
import Piece from './Piece'
import GridHelper from './GridHelper'
import { PIECES_CONFIG } from './Config'
import CollisionHelper from './CollisionHelper'
import Scenario from '../Tools/Scenario'
import gsap from 'gsap'
import Tutorial from './Tutorial'

export const PUZZLE_EVENTS = {
  puzzleComplete: 'puzzleComplete',
  puzzleFailed: 'puzzleFailed'
}

export default class Puzzle extends PIXI.Sprite {
  constructor(engine) {
    super()

    this.engine = engine

    this.sortableChildren = true
    this.hitArea = new PIXI.Rectangle(-1500, -1500, 3000, 3000)
    this.eventMode = 'static'
    this.on('pointerdown', this.pointerDownListener)
    this.on('pointermove', this.pointerMoveListener)
    this.on('pointerup', this.pointerUpListener)
    this.on('pointercancel', this.pointerUpListener)
    this.on('pointerupoutside', this.pointerUpListener)
    

    this.gridHelper = new GridHelper()
    this.collisionHelper = new CollisionHelper(engine)

    this.draggingPiece = null
    this.draggingX = 0
    this.draggingY = 0
    this.draggingShift = 120

    this.enabled = true

    this.redGlow = PIXI.Sprite.from(window.images['red_glow'])
    this.redGlow.anchor.set(0.48, 0.52)
    this.redGlow.scale.set(4.4, 4.4)
    this.redGlow.alpha = 0
    this.addChild(this.redGlow)

    const cupcake = PIXI.Sprite.from(window.images['cupcake'])
    cupcake.anchor.set(0.5, 0.5)
    this.addChild(cupcake)

    this.allPieces = []
    for (let pieceConfig of PIECES_CONFIG) {
      const piece = new Piece(pieceConfig)
      this.allPieces.push(piece)
      this.addChild(piece)
    }

    this.tutorial = new Tutorial()
    this.addChild(this.tutorial)
    this.tutorial.show()
  }

  pointerDownListener(e) {
    if (! this.enabled || ! (e.target instanceof Piece) || ! e.target.enabled) return
    this.tutorial.hide()

    this.draggingPiece = e.target
    this.draggingPiece.zIndex = 100

    this.collisionHelper.remove(this.draggingPiece)

    const local = this.toLocal(e.global)
    this.draggingX = this.draggingPiece.x - local.x
    this.draggingY = this.draggingPiece.y - local.y
    this.draggingPiece.position.set(local.x + this.draggingX, local.y + this.draggingY - this.draggingShift)
  }

  pointerMoveListener(e) {
    if (! this.enabled || ! this.draggingPiece) return
    const local = this.toLocal(e.global)
    this.draggingPiece.position.set(local.x + this.draggingX, local.y + this.draggingY - this.draggingShift)

    this.draggingPiece.updateBodyPosition()
  }

  pointerUpListener() {
    if (! this.enabled || ! this.draggingPiece) return

    const unsnappedX = this.draggingPiece.x
    const unsnappedY = this.draggingPiece.y
    const snappedPos = this.gridHelper.findNearestPos(this.draggingPiece.position)
    this.draggingPiece.position.set(snappedPos.x, snappedPos.y)
    this.draggingPiece.updateBodyPosition()

    const collides = this.collisionHelper.collides(this.draggingPiece)

    if (collides) {
      this.draggingPiece.position.set(unsnappedX, unsnappedY)
      this.pieceToStartPos(this.draggingPiece)
    }
    else {
      this.collisionHelper.add(this.draggingPiece)
      this.draggingPiece.enabled = false

      if (! this.hasPossibledMoves()) 
      {
        this.enabled = false
        if (this.isComplete()) {
          this.emit(PUZZLE_EVENTS.puzzleComplete)
        }
        else {
          this.emit(PUZZLE_EVENTS.puzzleFailed)
        }
      }
    }

    this.draggingPiece.zIndex = this.draggingPiece.defaultZIndex
    this.draggingPiece = null
  }

  isComplete() {
    for (let piece of this.allPieces) {
      if (piece.enabled) return false
    }
    return true
  }

  hasPossibledMoves() {
    const allPositions = this.gridHelper.getAllPositions()
    for (let piece of this.allPieces) {
      if (! piece.enabled) continue
      let collides = this.collisionHelper.collidesInAllPositions(piece, allPositions)
      if (! collides) return true
    }
    return false
  }

  pieceToStartPos(piece) {
    const moveTime = 0.1
    const scenario = new Scenario([
      () => this.enabled = false,
      () => gsap.to(piece.position, { x: piece.startPos.x, y: piece.startPos.y, duration: moveTime, ease: 'power1.out' }),
      moveTime,
      () => this.enabled = true,
    ])

    scenario.start()
  }

  restart() {
    const moveTime = 0.2

    this.collisionHelper.clear()

    this.enabled = false
    const scenario = new Scenario()

    for (let piece of this.allPieces) {
      if (piece.enabled) continue
      piece.enabled = true

      scenario.add(() => gsap.to(piece.position, { x: piece.startPos.x, y: piece.startPos.y, duration: moveTime, ease: 'power1.out' }))
    }

    scenario.add(moveTime)
    scenario.add(() => this.enabled = true)

    scenario.start()
  }

  showRedGlow() {
    const glowTime = 0.2
    const scenario = new Scenario([
      () => gsap.to(this.redGlow, { alpha: 1, duration: glowTime, ease: 'power1.inOut' }),
      glowTime,
      () => gsap.to(this.redGlow, { alpha: 0, duration: glowTime, ease: 'power1.inOut' }),
      glowTime,
      () => gsap.to(this.redGlow, { alpha: 1, duration: glowTime, ease: 'power1.inOut' }),
      glowTime,
      () => gsap.to(this.redGlow, { alpha: 0, duration: glowTime, ease: 'power1.inOut' }),
    ])

    scenario.start()
  }
}