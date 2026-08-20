import type { JBTabTriggerWebComponent } from "./jb-tab-trigger.js";

export type JBTabTriggerColorVariant =
  | "primary"
  | "primary-subtle"
  | "secondary"
  | "secondary-subtle"
  | "positive"
  | "positive-subtle"
  | "danger"
  | "danger-subtle"
  | "warning"
  | "warning-subtle"
  | "light"
  | "dark";
export type JBTabTriggerColor = JBTabTriggerColorVariant | (string & Record<never, never>);

export type JBTabSelectEventDetail = {
  value: string;
  trigger: JBTabTriggerWebComponent;
};

export type JBTabSelectEvent = CustomEvent<JBTabSelectEventDetail>;
