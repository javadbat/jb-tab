import type { JBTabTriggerColor, JBTabTriggerWebComponent } from "jb-tab/trigger";
import type React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "jb-tab-trigger": JBTabTriggerType;
    }
    interface JBTabTriggerType extends React.DetailedHTMLProps<React.HTMLAttributes<JBTabTriggerWebComponent>, JBTabTriggerWebComponent> {
      value?: string;
      disabled?: boolean | string;
      color?: JBTabTriggerColor;
      selected?: boolean;
    }
  }
}
