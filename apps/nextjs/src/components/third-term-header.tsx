"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { Button } from "@acme/ui/button";
import { Icons } from "@acme/ui/common/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { SidebarTrigger } from "@acme/ui/sidebar";

export default function ThirdTermHeader() {
  const links = [
    "questions",
    "students",
    "results",
    "result-entry",
    "students-quran",
  ];
  //   const [current, setCurrent] = useState(null);
  const params = useParams();
  const path = usePathname();
  const current = useMemo(() => path.split("/").reverse()?.[0], [path]);
  useEffect(() => {
    // console.log(path);
  }, [path]);
  return (
    <div className="flex h-12 items-center gap-4 border-b px-4 print:hidden">
      <SidebarTrigger />
      <div className="flex-1"></div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm">
            <Icons.menu className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {links.map((lnk) => (
            <DropdownMenuItem asChild className="capitalize" key={lnk}>
              <Link href={`/third-term/${lnk}`}>{lnk}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
