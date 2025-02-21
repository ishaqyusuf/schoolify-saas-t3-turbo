import { Suspense } from "react";

import { SidebarProvider } from "@acme/ui/sidebar";

import ThirdTermHeader from "~/components/third-term-header";
import { ThirdTermSideBar } from "~/components/third-term-side-bar";

export default async function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="" id="sideBarSlot"></div>
      <div className="flex w-full flex-col">
        <Suspense fallback={<div>Loading...</div>}>
          <ThirdTermHeader />
          {children}
        </Suspense>
      </div>
    </SidebarProvider>
  );
}
