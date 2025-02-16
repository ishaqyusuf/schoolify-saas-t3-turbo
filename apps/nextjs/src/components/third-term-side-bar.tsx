import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@acme/ui/sidebar";

export function ThirdTermSideBar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent id="sideBarContent">
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
