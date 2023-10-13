import React, { useState, useEffect, useRef } from "react";

import {
  useTransition,
  useSpring,
  useChain,
  config,
  useSpringRef,
} from "@react-spring/web";

import { Container, FolderTitle, Item } from "./styles";
import data from "../../data";

const Folder = ({ name, type }: { name: string; type: string }) => {
  const [open, set] = useState(false);

  const springApi = useSpringRef();
  const { size, ...rest } = useSpring({
    ref: springApi,
    config: config.stiff,
    from: { size: "20%", background: "hotpink" },
    to: {
      size: open ? "70%" : "20%",
      background: open ? "white" : "hotpink",
    },
  });
  const transApi = useSpringRef();

  const textApi = useSpring({
    ref: springApi,
    from: { color: "#fff" },
    to: {
      color: open ? "#000" : "#fff",
      background: open ? "white" : "hotpink",
    },
  });

  const transition = useTransition(open ? data : [], {
    ref: transApi,
    trail: 400 / data.length,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
  });

  // This will orchestrate the two animations above, comment the last arg and it creates a sequence
  useChain(open ? [springApi, transApi] : [transApi, springApi], [
    0,
    open ? 0.1 : 0.4,
  ]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  function useOutsideAlerter(ref: React.RefObject<HTMLDivElement>) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          set(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useOutsideAlerter(wrapperRef);

  return (
    <Container
      open={open}
      ref={wrapperRef}
      style={{
        ...rest,
        width: size,
        height: size,
      }}
      onClick={() => set(true)}
    >
      <FolderTitle style={textApi}>{name}</FolderTitle>
      {transition((style, item) => (
        <Item
          // onClick={() => alert(item.name)}
          style={{ ...style, background: item.css }}
        >
          <div className="item">
            <img src={`https://wildcard.codestuff.io/${type}/100/100`} alt="" />
          </div>
        </Item>
      ))}
    </Container>
  );
};

export default Folder;
