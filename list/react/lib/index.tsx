"use client";

import React, { useImperativeHandle, useRef } from "react";
import "jb-tab/list";
import type { JBTabListWebComponent } from "jb-tab/list";
import type { JBElementStandardProps } from "jb-core/react";
import { type JBTabListAttributes, useJBTabListAttributes } from "./attributes-hook.js";
import "./module-declaration.js";

export type JBTabListProps = JBElementStandardProps<JBTabListWebComponent, keyof JBTabListAttributes> & JBTabListAttributes;

export const JBTabList = React.forwardRef<JBTabListWebComponent, JBTabListProps>((props, ref) => {
  const element = useRef<JBTabListWebComponent>(null);
  useImperativeHandle(ref, () => element.current!, []);
  const { orientation, size, children, ...otherProps } = props;

  useJBTabListAttributes(element, { orientation, size });

  return (
    <jb-tab-list ref={element} orientation={orientation} size={size} {...otherProps}>
      {children}
    </jb-tab-list>
  );
});

JBTabList.displayName = "JBTabList";
