"use client";

import Portal from "@acme/ui/common/portal";

export default function SideBarSlot({ children }) {
  return (
    <Portal nodeId={"sideBarSlot"} waitSec={0}>
      {children}
    </Portal>
  );
}
