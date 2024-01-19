import { renderSphere } from "./graphics";

const render = () => {
  let canvas = document.getElementById("myCanvas");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw Error("Could not find canvas element");
  }

  renderSphere(canvas);
};

document.addEventListener("DOMContentLoaded", render);
window.addEventListener("resize", render);
