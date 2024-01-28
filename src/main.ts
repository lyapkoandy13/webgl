import { Matrix4, Vector3 } from "@math.gl/core";
import { Camera } from "./Camera";
import frameLogger from "./FrameLogger";
import IndexBuffer from "./IndexBuffer";
import { Mesh } from "./Mesh";
import Renderer from "./Renderer";
import Shader from "./Shader";
import Texture from "./Texture";
import VertexArray from "./VertexArray";
import VertexBuffer from "./VertexBuffer";
import VertexBufferLayout from "./VertexBufferLayout";
import Viewport from "./Viewport";
import { vertsAndNormals } from "./constants";
import fShader from "./glsl/triangle/frag.glsl";
import vShader from "./glsl/triangle/vert.glsl";
import {
  CameraController,
  CubeController,
  MouseController,
  processInput,
  setCubePos,
} from "./input";
import { loadSTL } from "./mesh-loaders/stl/stl";
import { globalStore } from "./ui/state";

let globCanvas: null | HTMLCanvasElement;

const getCanvas = () => {
  if (globCanvas) return globCanvas;

  const canvas = document.getElementById("badEngine");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw Error("Could not find canvas element");
  }
  globCanvas = canvas;
  canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
  });

  return globCanvas;
};

document.addEventListener("DOMContentLoaded", main);

async function main() {
  const canvas = getCanvas();
  let gl = canvas.getContext("webgl2");

  if (!gl) {
    alert("WebGL is not supported");
    return;
  }

  new Viewport(gl, canvas);

  const shader = new Shader(gl, vShader, fShader);
  const texture = new Texture(gl);

  // Attributes
  // const buffer = new VertexBuffer(gl, vertices);
  const buffer = new VertexBuffer(gl, vertsAndNormals);
  const layout = new VertexBufferLayout();
  layout.add(VertexBufferLayout.createElement(gl.FLOAT, 3, false, "position"));
  // layout.add(VertexBufferLayout.createElement(gl.FLOAT, 2, false, "texCoord"));
  // layout.add(VertexBufferLayout.createElement(gl.FLOAT, 3, true, "color"));
  layout.add(VertexBufferLayout.createElement(gl.FLOAT, 3, true, "normal"));
  const va = new VertexArray(gl, shader);
  // const ib = new IndexBuffer(gl, indices);
  const ib = new IndexBuffer(
    gl,
    new Uint16Array(
      new Array(vertsAndNormals.length / 6).fill(0).map((_, i) => i)
    )
  );
  va.addBuffer(buffer, layout);

  const mouseController = new MouseController();
  const cameraController = new CameraController();
  const cubeController = new CubeController();

  const camera = new Camera(canvas.height, canvas.width);
  const cubePos = new Vector3([0, 0, 0]);
  setCubePos(cubePos);

  const renderer = new Renderer(gl);

  let prevTime = performance.now();
  let deltaTime = 0;

  const meshData = await loadSTL("models/cube.stl");
  const mesh = new Mesh(gl, shader, meshData);

  const [store] = globalStore;

  requestAnimationFrame(function onTick(time: DOMHighResTimeStamp) {
    frameLogger.log(time);
    deltaTime = time - prevTime;
    prevTime = time;
    const moveSpeed = 10 * deltaTime * 0.001;

    // TODO: shovel this pile
    processInput(
      cameraController,
      camera,
      moveSpeed,
      cubeController,
      cubePos,
      mouseController
    );

    // console.log("light", store.light);

    shader.setUniformMat4("uViewProj", camera.getViewProjectionMatrix());
    shader.setUniform3fv("uLightPos", store.light);

    texture.bind();
    shader.setUniform1i("uTexture", texture.getSlot());

    renderer.clear();

    const meshTransform = new Matrix4()
      .identity()
      // .scale(0.1)
      .translate([-5, 0, 0]);
    // .rotateZ(Math.sin(time / 1000) * 2);
    shader.setUniformMat4("uTransform", meshTransform);
    shader.setUniform1i("uHasTexture", 0);
    renderer.drawMesh(mesh);

    const cubeTransform = new Matrix4().identity().scale(2).translate(cubePos);
    // .rotateY(Math.sin(time / 1000) * 2);
    shader.setUniform1i("uHasTexture", 1);
    shader.setUniformMat4("uTransform", cubeTransform);
    renderer.draw(va, ib, shader);

    requestAnimationFrame(onTick);
  });
}
