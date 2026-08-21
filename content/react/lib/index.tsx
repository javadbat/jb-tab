"use client";

import React, { useImperativeHandle, useRef } from "react";
import "jb-tab/content";
import type { JBTabContentWebComponent } from "jb-tab/content";
import type { JBElementStandardProps } from "jb-core/react";
import { type JBTabContentAttributes, useJBTabContentAttributes } from "./attributes-hook.js";
import "./module-declaration.js";

export type JBTabContentProps = JBElementStandardProps<JBTabContentWebComponent, keyof JBTabContentAttributes> & JBTabContentAttributes;

export const JBTabContent = React.forwardRef<JBTabContentWebComponent, JBTabContentProps>((props, ref) => {
  const element = useRef<JBTabContentWebComponent>(null);
  useImperativeHandle(ref, () => element.current!, []);
  const { value, hidden, children, ...otherProps } = props;

  useJBTabContentAttributes(element, { value, hidden });

  return (
    <jb-tab-content ref={element} value={value} hidden={hidden} {...otherProps}>
      {children}
    </jb-tab-content>
  );
});

JBTabContent.displayName = "JBTabContent";
