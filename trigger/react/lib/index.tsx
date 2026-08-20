"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";
import { useEvent } from "jb-core/react";
import "jb-tab/trigger";
import type { JBTabSelectEvent, JBTabTriggerColor, JBTabTriggerWebComponent } from "jb-tab/trigger";
import type { JBElementStandardProps } from "jb-core/react";
import "./module-declaration.js";

export type JBTabTriggerProps = JBElementStandardProps<JBTabTriggerWebComponent, "onSelect"> & {
  value: string;
  disabled?: boolean;
  color?: JBTabTriggerColor;
  onSelect?: (event: JBTabSelectEvent) => void;
};

export const JBTabTrigger = React.forwardRef<JBTabTriggerWebComponent, JBTabTriggerProps>((props, ref) => {
  const element = useRef<JBTabTriggerWebComponent>(null);
  useImperativeHandle(ref, () => element.current!, []);
  const { value, disabled, color, onSelect, children, ...otherProps } = props;

  useEffect(() => {
    if (element.current) element.current.value = value;
  }, [value]);
  useEffect(() => {
    if (element.current && disabled !== undefined) element.current.disabled = disabled;
  }, [disabled]);
  useEffect(() => {
    if (element.current) element.current.color = color ?? null;
  }, [color]);
  useEvent(element, "select", onSelect);

  return (
    <jb-tab-trigger ref={element} value={value} disabled={disabled || undefined} color={color} {...otherProps}>
      {children}
    </jb-tab-trigger>
  );
});

JBTabTrigger.displayName = "JBTabTrigger";
