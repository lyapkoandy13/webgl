interface Props {
  coord: "x" | "y" | "z";
  value: number;
}

export default function coord(props: Props) {
  const color =
    props.coord === "x" ? "red" : props.coord === "y" ? "green" : "blue";

  return (
    <span style={{ color }}>
      {props.coord}: <span>{props.value.toFixed(2)}</span>
    </span>
  );
}
