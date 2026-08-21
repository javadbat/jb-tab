import type { JBTabContentWebComponent } from "jb-tab/content";
import { type RefObject, useEffect } from "react";

export type JBTabContentAttributes = {
  value: string;
  hidden?: boolean;
};

export function useJBTabContentAttributes(element: RefObject<JBTabContentWebComponent | null>, props: JBTabContentAttributes): void {
  useEffect(() => {
    if (element.current) element.current.value = props.value;
  }, [props.value, element.current]);

  useEffect(() => {
    if (element.current && props.hidden !== undefined) element.current.hidden = props.hidden;
  }, [props.hidden, element.current]);
}
