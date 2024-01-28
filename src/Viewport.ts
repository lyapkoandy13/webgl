class Viewport {
  constructor(
    private gl: WebGL2RenderingContext,
    private canvas: HTMLCanvasElement
  ) {
    this.reset();

    window.addEventListener("resize", () => this.reset());
  }

  reset() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  }
}

export default Viewport;
