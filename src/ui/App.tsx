import Menu from "./Menu";

function App() {
  return (
    <>
      <style>
        {`
        
      #frameNum {
        position: absolute;
        top: 20px;
        right: 20px;
        color: white;
        font-family: "Courier New", Courier, monospace;
        font-size: 0.8rem;
      }

      #error {
        position: absolute;
        top: 20px;
        left: 20px;
        color: red;
      }

      `}
      </style>
      <div id="error"></div>
      <div id="frameNum"></div>

      <Menu />
    </>
  );
}

export default App;
