import type { JBTabWebComponent } from "jb-tab";
import type React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "jb-tab": JBTabType;
    }
    interface JBTabType extends React.DetailedHTMLProps<React.HTMLAttributes<JBTabWebComponent>, JBTabWebComponent> {
      value?: string;
      "default-value"?: string;
      nullable?: boolean | string;
    }
  }
}
