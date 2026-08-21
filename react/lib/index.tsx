"use client";

import React, { useImperativeHandle, useRef } from "react";
import "jb-tab";
import type { JBTabWebComponent } from "jb-tab";
import type { JBElementStandardProps } from "jb-core/react";
import { type JBTabAttributes, useJBTabAttributes } from "./attributes-hook.js";
import { type JBTabEventProps, useJBTabEvents } from "./events-hook.js";
import "./module-declaration.js";

export type JBTabProps = JBElementStandardProps<JBTabWebComponent, keyof JBTabAttributes | keyof JBTabEventProps> & JBTabAttributes & JBTabEventProps;

export const JBTab = React.forwardRef<JBTabWebComponent, JBTabProps>((props, ref) => {
  const element = useRef<JBTabWebComponent>(null);
  useImperativeHandle(ref, () => element.current!, []);
  const { value, defaultValue, nullable, onChange, children, ...otherProps } = props;

  useJBTabAttributes(element, { value, defaultValue, nullable });
  useJBTabEvents(element, { onChange });

  return (
    <jb-tab ref={element} value={value ?? undefined} default-value={defaultValue ?? undefined} nullable={nullable || undefined} {...otherProps}>
      {children}
    </jb-tab>
  );
});

JBTab.displayName = "JBTab";
