import { useEvent } from "jb-core/react";
import type { JBTabChangeEvent, JBTabWebComponent } from "jb-tab";
import type { RefObject } from "react";

export type JBTabEventProps = {
  onChange?: (event: JBTabChangeEvent) => void;
};

export function useJBTabEvents(element: RefObject<JBTabWebComponent | null>, props: JBTabEventProps): void {
  useEvent(element, "change", props.onChange);
}
