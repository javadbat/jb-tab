import type { JBTabListSize, JBTabListWebComponent, JBTabOrientation } from "jb-tab/list";
import { type RefObject, useEffect } from "react";

export type JBTabListAttributes = {
  orientation?: JBTabOrientation;
  size?: JBTabListSize;
};

export function useJBTabListAttributes(element: RefObject<JBTabListWebComponent | null>, props: JBTabListAttributes): void {
  useEffect(() => {
    if (element.current && props.orientation !== undefined) element.current.orientation = props.orientation;
  }, [props.orientation, element.current]);

  useEffect(() => {
    if (element.current) element.current.size = props.size ?? null;
  }, [props.size, element.current]);
}
