"use client";

import Portal from "@acme/ui/common/portal";

export default function SideBarSlot({ children }) {
  return (
    <Portal nodeId={"sideBarSlot"} waitSec={0}>
      <div className="print:hidden">{children}</div>
    </Portal>
  );
}
