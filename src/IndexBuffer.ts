class IndexBuffer {
  private buffer: WebGLBuffer;
  private count: number;

  constructor(private gl: WebGL2RenderingContext, data: Uint16Array) {
    const buffer = gl.createBuffer();
    if (!buffer) {
      throw `Could not create buffer`;
    }
    this.buffer = buffer;

    this.gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    this.count = data.length;
  }

  // TODO?: delete buffer

  bind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
  }

  unbind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
  }

  getCount() {
    return this.count;
  }
}

export default IndexBuffer;
