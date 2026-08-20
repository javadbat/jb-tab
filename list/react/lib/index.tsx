"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";
import "jb-tab/list";
import type { JBTabListSize, JBTabListWebComponent, JBTabOrientation } from "jb-tab/list";
import type { JBElementStandardProps } from "jb-core/react";
import "./module-declaration.js";

export type JBTabListProps = JBElementStandardProps<JBTabListWebComponent> & {
  orientation?: JBTabOrientation;
  size?: JBTabListSize;
};

export const JBTabList = React.forwardRef<JBTabListWebComponent, JBTabListProps>((props, ref) => {
  const element = useRef<JBTabListWebComponent>(null);
  useImperativeHandle(ref, () => element.current!, []);
  const { orientation, size, children, ...otherProps } = props;

  useEffect(() => {
    if (element.current && orientation !== undefined) element.current.orientation = orientation;
  }, [orientation]);
  useEffect(() => {
    if (element.current) element.current.size = size ?? null;
  }, [size]);

  return (
    <jb-tab-list ref={element} orientation={orientation} size={size} {...otherProps}>
      {children}
    </jb-tab-list>
  );
});

JBTabList.displayName = "JBTabList";
