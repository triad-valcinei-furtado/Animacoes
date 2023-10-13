import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
   box-sizing: border-box;
  }

  body {
    background-color: rgb(200,193,187);
  }
`;

export default GlobalStyle;
