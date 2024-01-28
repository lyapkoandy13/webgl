import Shader from "./Shader";
import VertexArray from "./VertexArray";
import VertexBuffer from "./VertexBuffer";
import VertexBufferLayout from "./VertexBufferLayout";
import { MeshData } from "./mesh-loaders/stl/stl";

export class Mesh {
  private va: VertexArray;
  readonly count: number;

  constructor(
    gl: WebGL2RenderingContext,
    private shader: Shader,
    readonly meshData: MeshData
  ) {
    this.count = meshData.verts.length / 3;
    const vertsBuffer = new VertexBuffer(gl, meshData.verts);
    const vertsLayout = new VertexBufferLayout();
    vertsLayout.add(
      VertexBufferLayout.createElement(gl.FLOAT, 3, false, "position")
    );

    const normalsBuffer = new VertexBuffer(gl, meshData.normals);
    const normalsLayout = new VertexBufferLayout();
    normalsLayout.add(
      VertexBufferLayout.createElement(gl.FLOAT, 3, false, "normal")
    );

    this.va = new VertexArray(gl, shader);
    this.va.addBuffer(vertsBuffer, vertsLayout);
    this.va.addBuffer(normalsBuffer, normalsLayout);
  }

  bind() {
    this.shader.bind();
    this.va.bind();
  }
}
