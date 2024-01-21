
import * as PIXI from 'pixi.js';
import * as PolyDecomp from 'poly-decomp'
import * as Matter from 'matter-js'

import ScalableContainer from './Scene/ScalableContainer'
import Scene from './Scene/Scene'
//import MatterDebug from './Tools/MatterDebug'

window.initPlayble = function() {

  const app = new PIXI.Application({ transparent: true, resolution: 1})
  document.body.appendChild(app.view)
  app.view.classList.add('playbleCanvas')
  setTimeout(() => {
    app.view.classList.add('visible')
  }, 100)

  Matter.Common.setDecomp(PolyDecomp)
  const engine = Matter.Engine.create();
  const runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

  const container = new ScalableContainer(app)
  app.stage.addChild(container)
  const scene = new Scene(app, engine)
  container.addChild(scene)

  let matterDebug = null
//  matterDebug = new MatterDebug(app, document.body, engine)
//  matterDebug.resize()

  window.addEventListener('resize', resizeListener)
  window.addEventListener('orientationchange', resizeListener)
  resizeListener()

  function resizeListener(e) {
    app.renderer.resize(document.body.clientWidth, document.body.clientHeight)
    container.resize(document.body.clientWidth, document.body.clientHeight)

    setTimeout(() => {
      if (matterDebug) matterDebug.resize()
    }, 100)
  
  }
}

