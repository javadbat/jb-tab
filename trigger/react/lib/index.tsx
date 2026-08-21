"use client";

import React, { useImperativeHandle, useRef } from "react";
import "jb-tab/trigger";
import type { JBTabTriggerWebComponent } from "jb-tab/trigger";
import type { JBElementStandardProps } from "jb-core/react";
import { type JBTabTriggerAttributes, useJBTabTriggerAttributes } from "./attributes-hook.js";
import { type JBTabTriggerEventProps, useJBTabTriggerEvents } from "./events-hook.js";
import "./module-declaration.js";

export type JBTabTriggerProps = JBElementStandardProps<JBTabTriggerWebComponent, keyof JBTabTriggerAttributes | keyof JBTabTriggerEventProps> &
  JBTabTriggerAttributes &
  JBTabTriggerEventProps;

export const JBTabTrigger = React.forwardRef<JBTabTriggerWebComponent, JBTabTriggerProps>((props, ref) => {
  const element = useRef<JBTabTriggerWebComponent>(null);
  useImperativeHandle(ref, () => element.current!, []);
  const { value, disabled, color, onSelect, children, ...otherProps } = props;

  useJBTabTriggerAttributes(element, { value, disabled, color });
  useJBTabTriggerEvents(element, { onSelect });

  return (
    <jb-tab-trigger ref={element} value={value} disabled={disabled || undefined} color={color} {...otherProps}>
      {children}
    </jb-tab-trigger>
  );
});

JBTabTrigger.displayName = "JBTabTrigger";
