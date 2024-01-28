import { Vector3 } from "@math.gl/core";
import { createStore } from "solid-js/store";

const DEFAULT_POSITION = new Vector3(0, 0, 0);

export const globalStore = createStore({
  cube: new Vector3(DEFAULT_POSITION),
  camera: new Vector3(DEFAULT_POSITION),
  light: new Vector3(DEFAULT_POSITION),
});
