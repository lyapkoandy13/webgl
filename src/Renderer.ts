import IndexBuffer from "./IndexBuffer";
import { Mesh } from "./Mesh";
import Shader from "./Shader";
import VertexArray from "./VertexArray";

class Renderer {
  constructor(private gl: WebGL2RenderingContext) {
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    // this.setClearColor(0.3, 0.4, 0.3, 1);
  }

  setClearColor(red: number, green: number, blue: number, alpha: number) {
    this.gl.clearColor(red, green, blue, alpha);
  }

  draw(va: VertexArray, ib: IndexBuffer, shader: Shader) {
    shader.bind();
    va.bind();
    ib.bind();
    this.gl.drawElements(
      this.gl.TRIANGLES,
      ib.getCount(),
      this.gl.UNSIGNED_SHORT,
      0
    );
  }

  drawMesh(mesh: Mesh) {
    mesh.bind();
    this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.count);
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}

export default Renderer;
