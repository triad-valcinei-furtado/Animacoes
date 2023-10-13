import Folder from "./Components/Folder";
import { Wrapper } from "./styles";

const Folders = () => {
  return (
    <Wrapper>
      <Folder name="Cachorros" type="dog" />
      <Folder name="Gatos" type="cat" />
      {/* <Folder name="Coelhos" />
      <Folder name="Ratos" /> */}
    </Wrapper>
  );
};

export default Folders;
