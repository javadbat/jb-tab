import type { JBTabTriggerWebComponent } from "jb-tab/trigger";

export type JBTabChangeEventDetail = {
  value: string;
  previousValue: string | null;
  trigger: JBTabTriggerWebComponent;
};

export type JBTabChangeEvent = CustomEvent<JBTabChangeEventDetail>;
