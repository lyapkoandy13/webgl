import compileShader from "./compileShader";
import { logError } from "./erorr";
import fShader from "./glsl/triangle/frag.glsl";
import vShader from "./glsl/triangle/vert.glsl";

export const renderSphere = async (canvas: HTMLCanvasElement) => {
  let gl = canvas.getContext("webgl2");

  if (!gl) {
    alert("WebGL is not supported");
    return;
  }

  const vertexShader = compileShader(gl, vShader, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fShader, gl.FRAGMENT_SHADER);

  const program = gl.createProgram();

  if (!program || !vertexShader || !fragmentShader) {
    logError("Could not create program");
    return;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    logError("Could not link the program: " + gl.getProgramInfoLog(program));
    return;
  }

  // TODO: check validate program

  const shapeLocationUniform = gl.getUniformLocation(program, "shapeLocation");
  const shapeSizeUniform = gl.getUniformLocation(program, "shapeSize");
  const canvasSizeUniform = gl.getUniformLocation(program, "canvasSize");
  if (
    shapeLocationUniform === null ||
    shapeSizeUniform === null ||
    canvasSizeUniform === null
  ) {
    logError(
      `Failed to get uniform locations (shapeLocation=${!!shapeLocationUniform}` +
        `, shapeSize=${!!shapeSizeUniform}` +
        `, canvasSize=${!!canvasSizeUniform})`
    );
    return;
  }

  // Create buffer
  const triangleVerts = new Float32Array([
    0.0,
    1, //
    -1,
    -1, //
    1,
    -1, //
  ]);
  const triangleVertsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangleVerts, gl.STATIC_DRAW);
  const attribPosition = gl.getAttribLocation(program, "vertPosition");
  gl.vertexAttribPointer(attribPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribPosition);

  const triangleColors = new Uint8Array([
    255,
    0,
    0, //
    0,
    255,
    0, //
    0,
    0,
    255,
  ]);
  const triangleColorsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangleColors, gl.STATIC_DRAW);
  const attribColor = gl.getAttribLocation(program, "vertColor");
  gl.vertexAttribPointer(attribColor, 3, gl.UNSIGNED_BYTE, true, 0, 0);
  gl.enableVertexAttribArray(attribColor);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);

  gl.uniform2f(canvasSizeUniform, canvas.width, canvas.height);
  gl.uniform1f(shapeSizeUniform, 100);
  gl.uniform2f(shapeLocationUniform, 200, 200);

  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.uniform1f(shapeSizeUniform, 100);
  gl.uniform2f(shapeLocationUniform, 500, 500);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
