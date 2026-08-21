import type { JBTabTriggerColor, JBTabTriggerWebComponent } from "jb-tab/trigger";
import { type RefObject, useEffect } from "react";

export type JBTabTriggerAttributes = {
  value: string;
  disabled?: boolean;
  color?: JBTabTriggerColor;
};

export function useJBTabTriggerAttributes(element: RefObject<JBTabTriggerWebComponent | null>, props: JBTabTriggerAttributes): void {
  useEffect(() => {
    if (element.current) element.current.value = props.value;
  }, [props.value, element.current]);

  useEffect(() => {
    if (element.current && props.disabled !== undefined) element.current.disabled = props.disabled;
  }, [props.disabled, element.current]);

  useEffect(() => {
    if (element.current) element.current.color = props.color ?? null;
  }, [props.color, element.current]);
}
