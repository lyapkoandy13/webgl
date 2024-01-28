import { Matrix4, Vector3 } from "@math.gl/core";
import { logError } from "./erorr";

class Shader {
  readonly program: WebGLProgram;

  constructor(
    private gl: WebGL2RenderingContext,
    vShaderSrc: string,
    fShaderSrc: string
  ) {
    const vertexShader = this.compileShader(gl, vShaderSrc, gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(
      gl,
      fShaderSrc,
      gl.FRAGMENT_SHADER
    );

    const program = gl.createProgram();

    if (!program || !vertexShader || !fragmentShader) {
      logError("Could not create program");
      throw "Could not create program";
    }

    this.program = program;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    gl.validateProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      logError("Could not link the program: " + gl.getProgramInfoLog(program));

      throw "Could not link the program: " + gl.getProgramInfoLog(program);
    }

    gl.useProgram(program);
  }

  bind() {
    this.gl.useProgram(this.program);
  }

  unbind() {
    this.gl.useProgram(null);
  }

  compileShader(
    gl: WebGLRenderingContext,
    source: string,
    type: GLenum
  ): WebGLShader | null {
    let shader = gl.createShader(type);
    if (!shader) {
      logError("Could not create shader");
      return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      logError(
        "An error occurred compiling the shaders: " +
          gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private getLocation(name: string) {
    const location = this.gl.getUniformLocation(this.program, name);
    if (location === null) {
      const msg = `Can't find uniform: ${name}; Location: ${location}`;
      logError(msg);
      throw msg;
    }

    return location;
  }

  setUniform3fv(name: string, vec: Vector3) {
    const location = this.getLocation(name);
    this.gl.uniform3fv(location, vec);
  }

  setUniform1f(name: string, num: number) {
    const location = this.getLocation(name);
    this.gl.uniform1f(location, num);
  }

  setUinform2f(name: string, f1: number, f2: number) {
    const location = this.getLocation(name);
    this.gl.uniform2f(location, f1, f2);
  }

  setUinform4f(name: string, f1: number, f2: number, f3: number, f4: number) {
    const location = this.getLocation(name);
    this.gl.uniform4f(location, f1, f2, f3, f4);
  }

  setUniform1i(name: string, num: number) {
    const location = this.getLocation(name);
    this.gl.uniform1i(location, num);
  }

  setUniformMat4(name: string, mat: Matrix4) {
    const location = this.getLocation(name);
    this.gl.uniformMatrix4fv(location, false, mat);
  }
}

export default Shader;
