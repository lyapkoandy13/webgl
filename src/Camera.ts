import { Matrix4, Vector3, toRadians } from "@math.gl/core";
import { setCameraPos } from "./input";

export class Camera {
  private projectionMatrix: Matrix4;
  private viewMatrix: Matrix4;
  private viewProjectionMatrix: Matrix4;

  private position: Vector3 = new Vector3(0, 0, 10);
  private forward: Vector3 = new Vector3(0, 0, -1);
  private up: Vector3 = new Vector3(0, 1, 0);

  private pitch: number = 0;
  private yaw: number = -90;

  constructor(height: number, width: number) {
    setCameraPos(this.position);

    this.projectionMatrix = new Matrix4().perspective({
      fovy: toRadians(45),
      aspect: width / height,
    });

    this.viewMatrix = new Matrix4().lookAt({
      eye: this.position,
      center: new Vector3().addVectors(this.position, this.forward),
      up: this.up,
    });

    this.viewProjectionMatrix = new Matrix4()
      .identity()
      .multiplyRight(this.projectionMatrix)
      .multiplyRight(this.viewMatrix);
  }

  private recalculateForward() {
    const direction = new Vector3();
    direction.x =
      Math.cos(toRadians(this.yaw)) * Math.cos(toRadians(this.pitch));
    direction.y = Math.sin(toRadians(this.pitch));
    direction.z =
      Math.sin(toRadians(this.yaw)) * Math.cos(toRadians(this.pitch));
    this.forward = direction.normalize();
  }

  private recalculateViewMatrix() {
    this.recalculateForward();

    this.viewMatrix = new Matrix4().lookAt({
      eye: this.position,
      center: new Vector3().addVectors(this.position, this.forward),
    });
    this.viewProjectionMatrix = new Matrix4()
      .identity()
      .multiplyRight(this.projectionMatrix)
      .multiplyRight(this.viewMatrix);
  }

  getPosition() {
    return new Vector3(this.position);
  }

  setPosition(position: Vector3) {
    this.position = position;
    setCameraPos(position);
    this.recalculateViewMatrix();
  }

  getForward() {
    return new Vector3(this.forward);
  }

  getUp() {
    return new Vector3(this.up);
  }

  getRight() {
    return this.getForward().cross(this.getUp()).normalize();
  }

  rotate(rotation: Vector3) {
    if (rotation.y > 89) rotation.y = 89;
    if (rotation.y < -89) rotation.y = -89;

    this.pitch += rotation.y;
    this.yaw += rotation.x;

    this.recalculateViewMatrix();
  }

  getViewProjectionMatrix() {
    return new Matrix4(this.viewProjectionMatrix);
  }
}
