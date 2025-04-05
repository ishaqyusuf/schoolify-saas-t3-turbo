"use client";

import { useEffect, useState } from "react";
import {
  getResultPrintQueryData,
  ResultPrintQueryData,
} from "actions/example/get-result-print-query-data";

import { Label } from "@acme/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@acme/ui/sidebar";

import { useResultPrintQuery } from "~/hooks/use-result-print-query";
import { CheckFilter } from "./check-filter";
import SideBarSlot from "./side-bar-slot";

export function ResultPrintSideBar() {
  const ctx = useResultPrintQuery();
  const [queryData, setQueryData] = useState<ResultPrintQueryData>();
  useEffect(() => {
    getResultPrintQueryData().then((res) => setQueryData(res));
  }, []);
  return (
    <SideBarSlot>
      <Sidebar dir="rtl">
        <SidebarHeader />
        <SidebarContent className="px-4">
          <Label>Classes</Label>
          {queryData?.classRooms?.map((cl) => (
            <div dir="rtl" key={cl.classCode}>
              <CheckFilter
                ctx={ctx}
                qk="classCodes"
                label={cl.classTitle}
                value={cl.classCode}
              />
            </div>
          ))}
          <SidebarGroup>
            <SidebarGroupLabel>Paper Size</SidebarGroupLabel>
            <SidebarGroupContent>
              {["full", "half", "half-packed"].map((cl) => (
                <div dir="rtl" key={cl}>
                  <CheckFilter ctx={ctx} qk="paperSize" label={cl} value={cl} />
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Sort</SidebarGroupLabel>
            <SidebarGroupContent>
              {["grade", "name", "default"].map((cl) => (
                <div dir="rtl" key={cl}>
                  <CheckFilter ctx={ctx} qk="sort" label={cl} value={cl} />
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SideBarSlot>
  );
}
