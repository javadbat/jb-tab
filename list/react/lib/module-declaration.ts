import type { JBTabListWebComponent } from "jb-tab/list";
import type React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "jb-tab-list": JBTabListType;
    }
    interface JBTabListType extends React.DetailedHTMLProps<React.HTMLAttributes<JBTabListWebComponent>, JBTabListWebComponent> {
      orientation?: "horizontal" | "vertical";
      size?: "xs" | "sm" | "md" | "lg" | "xl";
    }
  }
}
