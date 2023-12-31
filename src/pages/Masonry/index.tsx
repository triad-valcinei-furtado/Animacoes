import React, { useState, useEffect, useMemo, useRef } from "react";
import useMeasure from "react-use-measure";
import { useTransition, a } from "@react-spring/web";
import { shuffle } from "lodash";
import clamp from "lodash.clamp";
import { useSprings, animated } from "@react-spring/web";
//@ts-ignore
import swap from "lodash-move";

import useMedia from "./useMedia";
import data from "./data";

import { List } from "./styles";
import { useDrag } from "react-use-gesture";
import {
  shuffleArrayBasedOnOrder,
  swapFirstAndLast,
} from "../../utils/shuffle";

const fn =
  (order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
  (index: number) =>
    active && index === originalIndex
      ? {
          y: curIndex * 50 + y,
          scale: 1.1,
          zIndex: 1,
          shadow: 15,
          immediate: (key: string) => key === "y" || key === "zIndex",
        }
      : {
          y: order.indexOf(index) * 50,
          scale: 1,
          zIndex: 0,
          shadow: 1,
          immediate: false,
        };

function Masonry() {
  // Hook1: Tie media queries to the number of columns
  const columns = useMedia(
    ["(min-width: 1500px)", "(min-width: 1000px)", "(min-width: 600px)"],
    [5, 4, 3],
    2
  );
  // Hook2: Measure the width of the container element
  const [ref, { width }] = useMeasure();
  // Hook3: Hold items
  const [items, set] = useState(data);
  // Hook4: shuffle data every 2 seconds
  useEffect(() => {
    // set(shuffle);
    // const t = setInterval(() => set(shuffle), 2000);
    // return () => clearInterval(t);
  }, []);
  // Hook5: Form a grid of stacked items using width & columns we got from hooks 1 & 2
  const [heights, gridItems] = useMemo(() => {
    let heights = new Array(columns).fill(0); // Each column gets a height starting with zero
    let gridItems = items.map((child, i) => {
      const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
      const x = (width / columns) * column; // x = container width / number of columns * column index,
      const y = (heights[column] += 200 / 2) - 200 / 2; // y = it's just the height of the current column
      return {
        ...child,
        x,
        y,
        width: width / columns,
        height: 200 / 2,
      };
    });
    return [heights, gridItems];
  }, [columns, items, width]);
  // Hook6: Turn the static grid values into animated transitions, any addition, removal or change will be animated
  const transitions = useTransition(gridItems, {
    key: (item: { css: string; height: number }) => item.css,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });
  // Render the grid

  const order = useRef(gridItems.map((_, index) => index)); // Store indicies as a local ref, this represents the item order

  const [springs, api] = useSprings(gridItems.length, fn(order.current)); // Create springs, each corresponds to an item, controlling its transform, scale, etc.

  const bind = useDrag(
    ({
      args: [originalIndex],
      active,
      movement: [x, y],
      dragging,
      _dragStarted,
      down,
    }) => {
      const curIndex = order.current.indexOf(originalIndex);

      const curRow = clamp(
        Math.round((curIndex * 200 + y) / 200),
        0,
        gridItems.length - 1
      );

      const curColumn = clamp(
        Math.round((curIndex * 200 + x) / 200),
        0,
        gridItems.length - 1
      );

      const newOrder = swap(order.current, curIndex, curRow);

      // console.log(items, "items");
      // console.log(curIndex, "curIndex");
      // console.log(order.current, "order.current");
      // console.log(newOrder, "newOrder");

      const shuffledArray = shuffleArrayBasedOnOrder(
        items,
        order.current,
        newOrder
      );

      console.log(curRow);
      // console.log(curColumn);

      if (!down) {
        // console.log(shuffledArray);
        // set(shuffledArray);
      }

      if (!active) order.current = newOrder;
    }
  );

  const swapFirstAndLast = () => {
    if (items.length < 2) {
      return; // Não é possível fazer a troca em arrays com menos de 2 elementos
    }

    const newArray = [...items]; // Crie uma cópia do array para manter o estado imutável
    const firstValue = newArray[0];
    newArray[0] = newArray[newArray.length - 1];
    newArray[newArray.length - 1] = firstValue;

    set(newArray);
  };

  return (
    <List ref={ref} style={{ height: Math.max(...heights) }}>
      <button onClick={() => {}}>Swap</button>
      <button
        onClick={() => {
          set(shuffle);
        }}
      >
        Suffle
      </button>
      {transitions((style, item, _, index) => (
        <a.div {...bind(index)} style={style}>
          <div
            style={{
              // backgroundImage: `url(${item.css}?auto=compress&dpr=2&h=500&w=500)`,
              background: "red",
            }}
          >
            {item.id}
          </div>
        </a.div>
      ))}
    </List>
  );
}

export default Masonry;
