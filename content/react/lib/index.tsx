"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";
import "jb-tab/content";
import type { JBTabContentWebComponent } from "jb-tab/content";
import type { JBElementStandardProps } from "jb-core/react";
import "./module-declaration.js";

export type JBTabContentProps = JBElementStandardProps<JBTabContentWebComponent> & {
  value: string;
};

export const JBTabContent = React.forwardRef<JBTabContentWebComponent, JBTabContentProps>((props, ref) => {
  const element = useRef<JBTabContentWebComponent>(null);
  useImperativeHandle(ref, () => element.current!, []);
  const { value, children, ...otherProps } = props;

  useEffect(() => {
    if (element.current) element.current.value = value;
  }, [value]);

  return (
    <jb-tab-content ref={element} value={value} {...otherProps}>
      {children}
    </jb-tab-content>
  );
});

JBTabContent.displayName = "JBTabContent";
