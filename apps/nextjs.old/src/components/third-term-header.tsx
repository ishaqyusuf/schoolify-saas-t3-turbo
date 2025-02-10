"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { Button } from "@acme/ui/button";

export default function ThirdTermHeader() {
  const links = ["questions", "students", "results", "students-quran"];
  //   const [current, setCurrent] = useState(null);
  const params = useParams();
  const path = usePathname();
  const current = useMemo(() => path.split("/").reverse()?.[0], [path]);
  useEffect(() => {
    // console.log(path);
  }, [path]);
  return (
    <div className="flex h-12 items-center justify-end gap-4 border-b print:hidden">
      {links.map((lnk) => (
        <Button
          asChild
          size="sm"
          className="capitalize"
          key={lnk}
          variant={current == lnk ? "default" : "secondary"}
        >
          <Link href={`/third-term/${lnk}`}>{lnk}</Link>
        </Button>
      ))}
    </div>
  );
}
