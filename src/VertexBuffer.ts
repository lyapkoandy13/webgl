class VertexBuffer {
  private buffer: WebGLBuffer;

  constructor(private gl: WebGL2RenderingContext, data: BufferSource) {
    const buffer = gl.createBuffer();
    if (!buffer) {
      throw `Could not create buffer`;
    }
    this.buffer = buffer;

    this.gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  }

  // TODO?: delete buffer

  bind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
  }

  unbind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }
}

export default VertexBuffer;
