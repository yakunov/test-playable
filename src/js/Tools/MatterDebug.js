import * as Matter from 'matter-js'

const SCALE = 0.5

export default class MatterDebug {

  constructor(app, container, engine) {

    this.app = app
    this.render = Matter.Render.create({
      element: container,
      engine: engine,
    });
    this.render.canvas.style.position = 'absolute'
    this.render.canvas.style.opacity = 0.5
    this.render.canvas.style.pointerEvents = 'none'
    Matter.Render.run(this.render);
  }

  resize() {
    const appCanvas = this.app.renderer.view;

    this.render.canvas.width = appCanvas.width;
    this.render.canvas.height = appCanvas.height;
    this.render.options.width = appCanvas.width;
    this.render.options.height = appCanvas.height;

    Matter.Render.lookAt(this.render, {
        position: { x: 0, y: 0 },
        min: { x: -appCanvas.width / 2 / SCALE, y: -appCanvas.height / 2 / SCALE },
        max: { x: appCanvas.width / 2 / SCALE, y: appCanvas.height / 2 / SCALE },
    });
  }
}