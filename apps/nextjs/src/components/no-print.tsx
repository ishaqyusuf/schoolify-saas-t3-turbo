import { cn } from "@acme/ui";

export function NoPrint({ children, className = "" }) {
  return <div className={cn("print:hidden", className)}>{children}</div>;
}
