import Position from "./Position";
import PositionControl from "./PositionControl";
import { globalStore } from "./state";

export default function Menu() {
  const [store] = globalStore;

  return (
    <div
      id="menu"
      style={{
        position: "absolute",
        top: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        "background-color": "rgba(255, 255, 255, 0.5)",
        padding: "5px",
        "border-radius": "3px",
        // display: "flex",
        // gap: "1rem",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            padding: "5px",
            display: "flex",
            gap: ".5rem",
            "justify-content": "space-between",
          }}
        >
          <span style="width:50px;">Cube:</span>
          <Position position={store.cube} />
        </p>
        <p
          style={{
            margin: 0,
            padding: "5px",
            display: "flex",
            gap: "1rem",
            "justify-content": "space-between",
          }}
        >
          <span style="width:50px;">Camera:</span>
          <Position position={store.camera} />
        </p>
      </div>
      <PositionControl />
    </div>
  );
}
