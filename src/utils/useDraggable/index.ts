import * as React from "react";

import useStore from "./store";
import { isInside } from "../dom";

interface IProps {
  wrapperRef: React.RefObject<HTMLElement>;
  onDragStart?: (event: React.MouseEvent) => void;
  onDragEnd?: (event: React.MouseEvent) => void;
  single?: boolean;
}

const useDraggable = ({ wrapperRef, onDragStart, onDragEnd }: IProps) => {
  const [store, actions] = useStore();

  const dragging = React.useRef<string | null>(null);

  const stop = React.useCallback(() => {
    if (dragging.current) {
      actions.stop(dragging.current);
    }
    dragging.current = null;
  }, [actions]);

  const onMouseMove = React.useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => {
      if (
        wrapperRef.current &&
        !isInside(wrapperRef.current!, {
          left: event.clientX,
          top: event.clientY,
        })
      ) {
        // if it reaches either side of end, stop the dragging
        // put the item back
        if (onDragEnd) {
          onDragEnd(event);
        }
        stop();
        return;
      }
      if (dragging.current) {
        actions.move([dragging.current], {
          x: event.clientX,
          y: event.clientY,
        });
      }
    },
    [actions, onDragEnd, wrapperRef, stop]
  );

  const onMouseUp = React.useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => {
      if (onDragEnd) {
        onDragEnd(event);
      }
      if (dragging.current) {
        actions.stop([dragging.current]);
      }
    },
    [actions, onDragEnd]
  );

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent, id: string) => {
      const coordinates = { x: event.clientX, y: event.clientY };
      event.stopPropagation();
      if (onDragStart) {
        onDragStart(event);
      }

      dragging.current = id;
      actions.start(id, coordinates, true);
    },
    [actions, onDragStart]
  );

  const clearStore = React.useCallback(() => {
    actions.clear();
    dragging.current = null;
  }, [actions]);

  return {
    store,
    handlers: { onMouseDown, onMouseMove, onMouseUp },
    clearStore,
  };
};

export default useDraggable;
