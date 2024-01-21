export default class GridHelper {
  constructor() {
    this.cellWidth = 58.5
    this.cellHeight = 61

    this.minIndexX = -5
    this.maxIndexX = 5
    this.minIndexY = -6
    this.maxIndexY = 7
  }

  findNearestPos(pos) {

    let ix = Math.round(pos.x / this.cellWidth)
    let iy = Math.round(pos.y / this.cellHeight)

    if (ix < this.minIndexX) ix = this.minIndexX
    if (ix > this.maxIndexX) ix = this.maxIndexX
    if (iy < this.minIndexY) iy = this.minIndexY
    if (iy > this.maxIndexY) iy = this.maxIndexY

    return {
      x: ix * this.cellWidth,
      y: iy * this.cellHeight
    }
  }

  getAllPositions() {
    const positions = []
    for (let i = this.minIndexX; i <= this.maxIndexX; i++) {
      for (let j = this.minIndexY; j <= this.maxIndexY; j++) {
        positions.push({x: i * this.cellWidth, y: j * this.cellHeight})
      }
    }

    return positions
  }
}