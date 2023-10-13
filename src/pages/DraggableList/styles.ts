import styled from "styled-components";

export const Container = styled.main`
  background: #f0f0f0;
  cursor: url("https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/Ad1_-cursor.png")
      20 20,
    auto;
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: center;
`;

export const Content = styled.div`
  position: relative;
  width: 200px;
  height: 100px;

  display: flex;

  & > div {
    position: absolute;
    width: 200px;
    height: 40px;
    transform-origin: 50% 50% 0px;
    border-radius: 5px;
    color: white;
    line-height: 40px;
    padding-left: 32px;
    font-size: 14.5px;
    background: lightblue;
    text-transform: uppercase;
    letter-spacing: 2px;
    touch-action: none;
  }

  & > div:nth-child(1) {
    background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  }
  & > div:nth-child(2) {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
  & > div:nth-child(3) {
    background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
  }
  & > div:nth-child(4) {
    background: linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%);
  }
`;
