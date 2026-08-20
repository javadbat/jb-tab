"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";
import { useEvent } from "jb-core/react";
import "jb-tab";
import type { JBTabChangeEvent, JBTabWebComponent } from "jb-tab";
import type { JBElementStandardProps } from "jb-core/react";
import "./module-declaration.js";

export type JBTabProps = JBElementStandardProps<JBTabWebComponent, "value" | "defaultValue" | "onChange"> & {
  value?: string | null;
  defaultValue?: string | null;
  nullable?: boolean;
  onChange?: (event: JBTabChangeEvent) => void;
};

export const JBTab = React.forwardRef<JBTabWebComponent, JBTabProps>((props, ref) => {
  const element = useRef<JBTabWebComponent>(null);
  useImperativeHandle(ref, () => element.current!, []);
  const { value, defaultValue, nullable, onChange, children, ...otherProps } = props;

  useEffect(() => {
    if (element.current && defaultValue !== undefined) element.current.defaultValue = defaultValue;
  }, [defaultValue]);
  useEffect(() => {
    if (element.current && nullable !== undefined) element.current.nullable = nullable;
  }, [nullable]);
  useEffect(() => {
    if (element.current && value !== undefined) element.current.value = value;
  }, [value]);
  useEvent(element, "change", onChange);

  return (
    <jb-tab ref={element} value={value ?? undefined} default-value={defaultValue ?? undefined} nullable={nullable || undefined} {...otherProps}>
      {children}
    </jb-tab>
  );
});

JBTab.displayName = "JBTab";
