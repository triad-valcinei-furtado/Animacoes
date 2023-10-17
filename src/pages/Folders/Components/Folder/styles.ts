import styled, { css } from "styled-components";

import { animated } from "@react-spring/web";

type IContainer = {
  open: boolean;
  paddingX?: number;
  paddingY?: number;
  marginX?: number;
  marginY?: number;
  gap?: number;
  fullWidth?: boolean;
  fullHeight?: boolean;
} & Pick<
  React.CSSProperties,
  | "flexDirection"
  | "justifyContent"
  | "alignItems"
  | "padding"
  | "paddingLeft"
  | "paddingRight"
  | "paddingTop"
  | "paddingBottom"
  | "margin"
  | "marginLeft"
  | "marginRight"
  | "marginTop"
  | "marginBottom"
>;

export const Container = styled(animated.div)<IContainer>`
  position: relative;

  display: flex;
  flex-wrap: wrap;
  gap: 25px;

  align-content: flex-start;

  padding: 25px;
  background: white;
  border-radius: 5px;
  box-shadow: 0px 10px 10px -5px rgba(0, 0, 0, 0.05);
  will-change: width, height;

  transition: filter 200ms, scale 200ms;

  ${({ open }) =>
    !open &&
    css`
      cursor: pointer;

      &:hover {
        filter: saturate(1) brightness(1.12);
        scale: 1.015;
      }
    `}
`;

export const Item = styled(animated.div)`
  width: 100px;
  height: 100px;

  background: white;
  border-radius: 5px;
  will-change: transform, opacity;

  cursor: pointer;

  display: flex;

  .item {
    flex: 1;

    padding: 6px;

    img {
      width: 100%;
      height: 100%;

      /* object-fit: center; */
    }
  }
`;

export const FolderTitle = styled(animated.span)`
  color: #2b2b2b;

  position: absolute;

  top: -10px;
  left: 10px;

  padding: 5px 10px;
  border-radius: 5px;
`;
