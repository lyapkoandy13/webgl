import { Vector3 } from "@math.gl/core";
import Coord from "./Coord";

interface Props {
  position: Vector3;
}
export default function Position(props: Props) {
  return (
    <>
      <Coord coord="x" value={props.position.x} />
      <Coord coord="y" value={props.position.y} />
      <Coord coord="z" value={props.position.z} />
    </>
  );
}
