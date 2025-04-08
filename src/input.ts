import { Vector2, Vector3 } from "@math.gl/core";
import { Camera } from "./Camera";
import { globalStore } from "./ui/state";

export const setLightPosition = (pos: Vector3) =>
  globalStore[1]({ light: pos });

export const setCameraPos = (pos: Vector3) => {
  const [, setStore] = globalStore;
  setStore({
    camera: pos,
  });
};

export const setCubePos = (pos: Vector3) => {
  const [, setStore] = globalStore;
  setStore({
    cube: pos,
  });
};

export const setMousePos = (pos: Vector3) => {
  (document.getElementById("mouse.x") as HTMLSpanElement).textContent =
    pos.x.toFixed(2);
  (document.getElementById("mouse.y") as HTMLSpanElement).textContent =
    pos.y.toFixed(2);
  (document.getElementById("mouse.z") as HTMLSpanElement).textContent =
    pos.z.toFixed(2);
};

interface KeyMap {
  forward: string;
  backward: string;
  left: string;
  right: string;
  up: string;
  down: string;
}

export class MouseController {
  protected movement: Vector2 = new Vector2(0, 0);
  private locked: boolean = false;

  constructor() {
    document.addEventListener("pointerlockchange", () => {
      this.locked = !!document.pointerLockElement;
    });

    document.addEventListener("mousemove", (e) => {
      if (!this.locked) return;

      console.log("mousemove", e.movementX, e.movementY);
      this.movement.x = e.movementX || 0;
      this.movement.y = e.movementY || 0;
      return;
    });
  }

  getMovementDelta(): Vector2 {
    return this.movement;
  }

  isLocked(): boolean {
    return this.locked;
  }

  isMoving(): boolean {
    return this.movement.x !== 0 || this.movement.y !== 0;
  }
}

class Controller {
  protected movingRight: number = 0.0;
  protected movingForward: number = 0.0;
  protected movingUp: number = 0.0;

  constructor(protected keyMap: KeyMap) {
    this.subscribe();
  }

  // TODO: remove listeners

  public getMovingDelta(): Vector3 {
    return new Vector3(this.movingRight, this.movingForward, this.movingUp);
  }

  public getMovingRight(): number {
    return this.movingRight;
  }

  public getMovingForward(): number {
    return this.movingForward;
  }

  public getMovingUp(): number {
    return this.movingUp;
  }

  public isMoving(): boolean {
    return (
      this.movingRight !== 0 || this.movingForward !== 0 || this.movingUp !== 0
    );
  }

  public subscribe() {
    this.subscribeKedown();
    this.subscribeKeyup();
  }

  public unsubscribe() {
    window.removeEventListener("keydown", this.keydownHandler);
    window.removeEventListener("keyup", this.keyupHandler);
  }

  private keydownHandler = (e: KeyboardEvent) => {
    if (Object.values(this.keyMap).includes(e.key)) {
      console.log("keydown", e.key);
    }

    switch (e.code) {
      case this.keyMap.forward: {
        this.movingForward = 1;
        break;
      }

      case this.keyMap.backward: {
        this.movingForward = -1;
        break;
      }

      case this.keyMap.left: {
        this.movingRight = -1;
        break;
      }

      case this.keyMap.right: {
        this.movingRight = 1;
        break;
      }

      case this.keyMap.up: {
        this.movingUp = 1;
        break;
      }

      case this.keyMap.down: {
        this.movingUp = -1;
        break;
      }
    }
  };

  private subscribeKedown() {
    window.addEventListener("keydown", this.keydownHandler);
  }

  private keyupHandler = (e: KeyboardEvent) => {
    if (Object.values(this.keyMap).includes(e.key)) {
      console.log("keyup", e.key);
    }

    switch (e.code) {
      case this.keyMap.forward: {
        if (this.movingForward > 0) this.movingForward = 0;
        break;
      }

      case this.keyMap.backward: {
        if (this.movingForward < 0) this.movingForward = 0;
        break;
      }

      case this.keyMap.left: {
        if (this.movingRight < 0) this.movingRight = 0;
        break;
      }

      case this.keyMap.right: {
        if (this.movingRight > 0) this.movingRight = 0;
        break;
      }

      case this.keyMap.up: {
        if (this.movingUp > 0) this.movingUp = 0;
        break;
      }

      case this.keyMap.down: {
        if (this.movingUp < 0) this.movingUp = 0;
        break;
      }
    }
  };

  private subscribeKeyup() {
    window.addEventListener("keyup", this.keyupHandler);
  }
}

export class CameraController extends Controller {
  constructor() {
    super({
      forward: "KeyW",
      backward: "KeyS",
      left: "KeyA",
      right: "KeyD",
      up: "KeyQ",
      down: "KeyZ",
    });
  }
}

export class CubeController extends Controller {
  constructor() {
    super({
      forward: "ArrowUp",
      backward: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
      up: "BracketLeft",
      down: "BracketRight",
    });
  }
}

// TODO:
export function processInput(
  cameraController: CameraController,
  camera: Camera,
  moveSpeed: number,
  cubeController: CubeController,
  cubePos: Vector3,
  mouseController: MouseController
) {
  if (cameraController.isMoving()) {
    const position = camera.getPosition();

    const movingForward = cameraController.getMovingForward();
    if (movingForward) {
      position.add(
        camera.getForward().multiplyByScalar(movingForward * moveSpeed)
      );
    }

    const movingRight = cameraController.getMovingRight();
    if (movingRight) {
      position.add(camera.getRight().multiplyByScalar(movingRight * moveSpeed));
    }

    const movingUp = cameraController.getMovingUp();
    if (movingUp) {
      position.add(camera.getUp().multiplyByScalar(movingUp * moveSpeed));
    }

    camera.setPosition(position);
  }

  if (cubeController.isMoving()) {
    cubePos = cubePos.add(
      cubeController.getMovingDelta().multiplyByScalar(moveSpeed)
    );
    setCubePos(cubePos);
  }

  const sensitivity = 0.3;
  if (mouseController.isLocked() && mouseController.isMoving()) {
    const moveDelta = mouseController.getMovementDelta();
    moveDelta.y *= -1;
    camera.rotate(new Vector3(...moveDelta.multiplyByScalar(sensitivity), 0));
  }
}
