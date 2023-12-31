import React, { useState, useEffect, useRef, ReactNode } from "react";

import {
  useTransition,
  useSpring,
  useChain,
  config,
  useSpringRef,
  useSprings,
} from "@react-spring/web";

import { Container, FolderTitle, Item } from "./styles";
import data from "../../data";
import AppBlock from "../../../Blocks/appBlock";
import {
  animate,
  getIndex,
  getPositionToIndexMapping,
} from "../../../Blocks/utils";
import { AnimatedWrapper, AppWrapper } from "../../../Blocks";
import useDraggable from "../../../../utils/useDraggable";

const Folder = ({
  name,

  type,
}: {
  name: string;
  type: string;
}) => {
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

  ////////////////////////

  const totalBlocks = 30;
  const multiWidth = false;
  const rowSize = 9;

  const getColor = (i: number) => {
    const colors = [
      "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
      "linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)",
    ];

    return colors[i % 4];
  };

  const getApps = React.useCallback(() => {
    const appsZ = new Array(totalBlocks).fill(1).map((a, i) => ({
      width: Math.random() > 0.5 ? (multiWidth ? 2 : 1) : 1,
      position: -1,
      name: i + "",
      background: getColor(i),
    }));

    return getIndex(appsZ, rowSize);
  }, [rowSize, multiWidth, totalBlocks]);

  const apps = React.useMemo(getApps, [getApps]);

  const order = React.useRef(
    apps.map((a, index) => ({ index, width: a.width, position: a.position }))
  );

  const transition = useTransition(open ? [1] : [], {
    ref: transApi,
    trail: 400 / 1,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
  });

  const [springs, setSprings] = useSprings(
    apps.length,
    animate(rowSize, order.current)
  );

  // This will orchestrate the two animations above, comment the last arg and it creates a sequence
  // useChain([springApi], [0, 0.4]);
  useChain(open ? [springApi, transApi] : [transApi, springApi], [
    0,
    open ? 0.2 : 0.5,
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

  const startPosition = React.useRef({ x: 0, y: 0 });
  const draggingIndex = React.useRef(-1);

  const onDragStart = React.useCallback((event: React.MouseEvent) => {
    startPosition.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }, []);

  const { store, handlers, clearStore } = useDraggable({
    wrapperRef,
    single: true,
    onDragStart,
  });

  const positionToIndexMap = React.useRef(
    getPositionToIndexMapping(order.current, rowSize)
  );

  React.useEffect(() => {
    if (!store?.elements?.id) {
      return;
    }
    const gap = {
      x: store.elements.translate.x,
      y: store.elements.translate.y,
    };

    // draggingIndex.current will contain the current index, where index is intial
    // render index, which might differ in order array
    // so we need position of that element in order array
    const prevIndex = order.current.findIndex(
      (a) => draggingIndex.current === a.index
    );
    const currentElement = order.current[prevIndex];
    const oldPosition = currentElement.position;

    // down-up : 3
    let y = Math.round(gap.y / 120);
    if (Math.abs(y) > 0.5) {
      y = y * rowSize;
    }

    // this might lead to problem.
    const x = Math.round(gap.x / 120) * (gap.x > 0 ? 1 : 1);

    const z = y + x + oldPosition;
    // how much block has moved
    let newPosition = Math.round(z);
    const movement = newPosition - oldPosition > 0 ? "FORWARD" : "BACKWARD";

    let newOrder = [...order.current];

    const changeOrder = (
      prev: number,
      dirtyNewIndex: number,
      newPosition: number,
      width?: number
    ) => {
      let newI = dirtyNewIndex;
      // only elements with width 1
      // are allowed to attached in empty spaces
      // reason being, allowing everything will
      // complicate the process a lot, but ROI will be very low
      if (dirtyNewIndex === -1 && width === 1) {
        // search in the order where it fits as per the new position

        let i =
          newOrder.findIndex((a) => a.position > newPosition) +
          (movement === "BACKWARD" ? 0 : -1);

        if (i < 0) {
          i = order.current.length - 1;
        }

        const newElementProps = {
          ...newOrder[prev],
          position: newPosition,
        };
        newI = i;
        // remove it from previous index and insert to new index
        newOrder.splice(prev, 1);
        newOrder.splice(newI, 0, newElementProps);
        newOrder = getIndex(newOrder, rowSize);
      } else {
        // remove it from previous index and insert to new index
        newOrder.splice(prev, 1);
        newOrder.splice(newI, 0, { ...order.current[prev] });
        // get latest positions as per there width
        newOrder = getIndex(newOrder, rowSize);
      }
    };

    // if the element has some width, this will same as prevIndex
    let newIndex = positionToIndexMap.current[newPosition];

    if (newPosition < 0) {
      // do nothing
      newIndex = prevIndex;
    } else if (prevIndex !== newIndex) {
      // these are special checks in case of different width
      // check new element width
      // newIndex can't be used directly here
      const newPositionElement =
        order.current[positionToIndexMap.current[newPosition]];
      // if element exist and it has width more than 2
      // if it doesn't "empty space"
      // them move block freely in else case
      if (newPositionElement && newPositionElement.width > 1) {
        if (Math.abs(newPosition - oldPosition) < newPositionElement.width) {
          // do nothing
        } else {
          changeOrder(prevIndex, newIndex, newPosition, currentElement.width);
        }
      } else {
        changeOrder(prevIndex, newIndex, newPosition, currentElement.width);
      }
    }

    setSprings(
      animate(
        rowSize,
        newOrder,
        order.current,
        gap.x,
        gap.y,
        draggingIndex.current,
        store.dragging
      )
    );
    if (!store.dragging) {
      clearStore();
      order.current = newOrder;
      positionToIndexMap.current = getPositionToIndexMapping(
        order.current,
        rowSize
      );
    }
  }, [store, clearStore, setSprings, rowSize]);

  return (
    <Container
      fullHeight
      flexDirection="column"
      open={open}
      style={{
        ...rest,
        width: size,
        height: size,
      }}
      onClick={() => set(true)}
    >
      <FolderTitle style={textApi}>{name}</FolderTitle>
      {transition((style) => (
        <AppWrapper ref={wrapperRef}>
          {springs.map((props, i) => {
            const dragId = String(i);
            return (
              <AnimatedWrapper
                key={apps[i].name}
                style={{ ...props, ...style }}
              >
                <AppBlock
                  {...handlers}
                  onMouseDown={(event) => {
                    draggingIndex.current = i;
                    handlers.onMouseDown(event, dragId);
                  }}
                  style={{
                    width: 128 * apps[i].width - 8,
                    height: 120,
                    background: apps[i].background,
                  }}
                  name={dragId}
                />
              </AnimatedWrapper>
            );
          })}
        </AppWrapper>
      ))}

      {/* {springs.map((props, i) => {
        const dragId = apps[i].name;
        return (
          <Item style={{ ...props }}>
            <div className="item">
              <img
                src={`https://wildcard.codestuff.io/${type}/100/100`}
                alt=""
              />
            </div>
          </Item>
        );
      })} */}
    </Container>
  );
};

export default Folder;
