import type { JBTabContentWebComponent } from "jb-tab/content";
import type React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "jb-tab-content": JBTabContentType;
    }
    interface JBTabContentType extends React.DetailedHTMLProps<React.HTMLAttributes<JBTabContentWebComponent>, JBTabContentWebComponent> {
      value?: string;
    }
  }
}
