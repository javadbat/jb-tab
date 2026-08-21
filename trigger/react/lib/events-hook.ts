import { useEvent } from "jb-core/react";
import type { JBTabSelectEvent, JBTabTriggerWebComponent } from "jb-tab/trigger";
import type { RefObject } from "react";

export type JBTabTriggerEventProps = {
  onSelect?: (event: JBTabSelectEvent) => void;
};

export function useJBTabTriggerEvents(element: RefObject<JBTabTriggerWebComponent | null>, props: JBTabTriggerEventProps): void {
  useEvent(element, "select", props.onSelect);
}
