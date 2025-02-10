"use client";

import Portal from "@acme/ui/common/portal";

export default function Title({ children }) {
  return <Portal nodeId={"headerTitle"}>{children}</Portal>;
}
