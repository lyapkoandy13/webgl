import Shader from "./Shader";
import VertexBuffer from "./VertexBuffer";
import VertexBufferLayout from "./VertexBufferLayout";

class VertexArray {
  private vao: WebGLVertexArrayObject;

  constructor(private gl: WebGL2RenderingContext, private shader: Shader) {
    const vao = gl.createVertexArray();
    if (vao === null) {
      throw `Could not create vertex array`;
    }
    this.vao = vao;

    gl.bindVertexArray(vao);
  }

  addBuffer(buffer: VertexBuffer, layout: VertexBufferLayout) {
    buffer.bind();

    const elements = layout.getElements();
    let offset: number = 0;

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const location = this.gl.getAttribLocation(
        this.shader.program,
        element.attributeName
      );
      this.gl.enableVertexAttribArray(location);
      this.gl.vertexAttribPointer(
        location,
        element.count,
        element.type,
        element.normilized,
        layout.getStride(),
        offset
      );
      offset += element.count * layout.getElementSizeByType(element.type);
      console.log("addingBuffer", {
        location,
        name: element.attributeName,
        buffer,
      });
    }
  }

  bind() {
    this.gl.bindVertexArray(this.vao);
  }

  unbind() {
    this.gl.bindVertexArray(null);
  }
}

export default VertexArray;
