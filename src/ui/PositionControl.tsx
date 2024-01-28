import { Vector3 } from "@math.gl/core";
import { globalStore } from "./state";

export default function PositionControl() {
  const [store, setStore] = globalStore;

  const changePosition = (coord: "x" | "y" | "z") => (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    const light = new Vector3(store.light);
    light[coord] = parseFloat(val);
    setStore({
      light,
    });
  };

  //   console.log("positionControl render", store.light);

  return (
    <div style="display:flex; flex-direction:column; gap: .3rem;">
      <div
        style={{ display: "flex", width: "100%", "justify-content": "center" }}
      >
        <span>Light position:</span>
      </div>
      <CoordControl
        coord="x"
        onChange={changePosition("x")}
        value={store.light.x}
      />
      <CoordControl
        coord="y"
        onChange={changePosition("y")}
        value={store.light.y}
      />
      <CoordControl
        coord="z"
        onChange={changePosition("z")}
        value={store.light.z}
      />
    </div>
  );
}

const CoordControl = (props: {
  onChange: (e: Event) => void;
  value: number;
  coord: "x" | "y" | "z";
}) => {
  const color =
    props.coord === "x" ? "red" : props.coord === "y" ? "green" : "blue";
  return (
    <div style={{ display: "flex", gap: ".5rem" }}>
      <label style={{ color }}>{props.coord}</label>
      <input
        type="number"
        style={{
          "border-radius": "5px",
          color,
          width: "100%",
        }}
        onChange={props.onChange}
        value={props.value}
      />
    </div>
  );
};
