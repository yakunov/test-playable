export default class Scenario {
  constructor(tasks = []) {
    this.tasks = tasks
    this.loop = false
    this.stopped = false
  }

  start() {
    this.currentTaskIndex = 0
    this.doNext()
  }

  stop() {
    this.stopped = true
  }

  add(task) {
    this.tasks.push(task)
  }

  doNext() {
    if (this.stopped) return
    
    let currentTask = this.tasks[this.currentTaskIndex]
    if (typeof currentTask == 'function') {
      currentTask.call()
      this.currentTaskIndex ++
      if (this.loop) this.currentTaskIndex %= this.tasks.length
      this.doNext()
    }
    else if (typeof currentTask == 'number') {
      setTimeout(() => {
        this.currentTaskIndex ++
        if (this.loop) this.currentTaskIndex %= this.tasks.length
        this.doNext()
      }, currentTask * 1000)
    }
    
  }
}