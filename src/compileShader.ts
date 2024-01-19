import { logError } from "./erorr";

export default function compileShader(
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
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
