import * as React from "react";
import styled from "styled-components";
import { Stack, Text } from "../../utils/styled";

const Block = styled(Stack)`
  position: relative;
  border-radius: 4px;
  margin-right: 8px;
`;

const StyledText = styled(Text)`
  color: white;
  font-weight: 600;
  font-size: 24px;
`;

interface IProps {
  name: string;
  style: React.CSSProperties;
  onMouseDown: (event: React.MouseEvent) => void;
}

const QucikPick = ({ name, ...props }: IProps) => {
  return (
    <Block
      className="app-block"
      {...props}
      alignItems="center"
      justifyContent="center"
    >
      {/* <StyledText className="ellipsis">{name}</StyledText> */}
      <img
        style={{ pointerEvents: "none" }}
        src={`https://wildcard.codestuff.io/dog/100/100`}
        alt=""
      />
    </Block>
  );
};

export default QucikPick;
