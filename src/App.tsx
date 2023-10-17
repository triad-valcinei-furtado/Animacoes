import React from "react";

import GlobalStyle from "./globalStyles";

import DraggableList from "./pages/DraggableList";
import Folders from "./pages/Folders";
import Masonry from "./pages/Masonry";
import Blocks from "./pages/Blocks";

function App() {
  const [totalBlocks, setTotalBlocks] = React.useState(22);
  const [rowSize, setRowSize] = React.useState(3);
  const [multiWidth, setMultiWidth] = React.useState(false);
  return (
    <div style={{ height: "100vh" }} className="App">
      <GlobalStyle />
      {/* <Masonry /> */}
      {/* <DraggableList items={"Cachorro Gato Peixe Pássaro Leão".split(" ")} /> */}
      <Folders />

      {/* <Blocks
        key={`${rowSize}-${multiWidth}-${totalBlocks}`}
        rowSize={rowSize}
        multiWidth={multiWidth}
        totalBlocks={totalBlocks}
      /> */}
    </div>
  );
}

export default App;
