class FrameLogger {
  frameCount = 0;
  lastFrameTime = 0;
  time = 0;

  lastFps = 0;
  fpsUpdateTimer = 0;

  domElement: HTMLElement | null;

  constructor(domElementId: string) {
    this.domElement = document.getElementById(domElementId);
  }

  log(time: DOMHighResTimeStamp) {
    this.frameCount++;

    this.lastFrameTime = time - this.time;
    this.lastFps = 1000 / this.lastFrameTime;
    this.fpsUpdateTimer += this.lastFrameTime;
    if (this.fpsUpdateTimer > 100) {
      this.fpsUpdateTimer = 0;
      if (this.domElement) {
        this.domElement.innerText = `${this.lastFps.toFixed(0) || 0} FPS`;
      }
    }

    this.time = time;
  }
}

export default new FrameLogger("frameNum");
