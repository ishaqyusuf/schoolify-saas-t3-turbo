"use client";

import { Label } from "@acme/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@acme/ui/sidebar";

import { useResultEntryQuery } from "~/hooks/use-result-entry-query";
import { CheckFilter } from "./check-filter";
import SideBarSlot from "./side-bar-slot";

export async function ResultEntrySideBarClient({
  data: { classList, subjectList },
}) {
  const ctx = useResultEntryQuery();
  return (
    <SideBarSlot>
      <Sidebar dir="rtl">
        <SidebarHeader />
        <SidebarContent className="px-4">
          <Label>Classes</Label>
          {classList.map((cl) => (
            <div dir="rtl" key={cl.value}>
              <CheckFilter
                ctx={ctx}
                qk="classCodes"
                label={cl.label}
                value={cl.value}
              />
            </div>
          ))}
          <SidebarGroup>
            <SidebarGroupLabel>Subjects</SidebarGroupLabel>
            <SidebarGroupContent>
              {subjectList.map((cl) => (
                <div dir="rtl" key={cl.value}>
                  <CheckFilter
                    ctx={ctx}
                    qk="subjectCodes"
                    label={cl.label}
                    value={cl.value}
                  />
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SideBarSlot>
  );
}
