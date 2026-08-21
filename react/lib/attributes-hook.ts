import type { JBTabWebComponent } from "jb-tab";
import { type RefObject, useEffect } from "react";

export type JBTabAttributes = {
  value?: string | null;
  defaultValue?: string | null;
  nullable?: boolean;
};

export function useJBTabAttributes(element: RefObject<JBTabWebComponent | null>, props: JBTabAttributes): void {
  useEffect(() => {
    if (element.current && props.defaultValue !== undefined) element.current.defaultValue = props.defaultValue;
  }, [props.defaultValue, element.current]);

  useEffect(() => {
    if (element.current && props.nullable !== undefined) element.current.nullable = props.nullable;
  }, [props.nullable, element.current]);

  useEffect(() => {
    if (element.current && props.value !== undefined) element.current.value = props.value;
  }, [props.value, element.current]);
}
