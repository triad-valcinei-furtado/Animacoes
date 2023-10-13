import GlobalStyle from "./globalStyles";

import DraggableList from "./pages/DraggableList";
import Folders from "./pages/Folders";
import Masonry from "./pages/Masonry";

function App() {
  return (
    <div style={{ height: "100vh" }} className="App">
      <GlobalStyle />
      <Masonry />
      {/* <DraggableList items={"Cachorro Gato Peixe Pássaro Leão".split(" ")} /> */}
      {/* <Folders /> */}
    </div>
  );
}

export default App;
