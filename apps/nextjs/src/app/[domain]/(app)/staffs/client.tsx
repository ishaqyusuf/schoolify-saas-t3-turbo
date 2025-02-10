"use client";

import { use } from "react";
import Link from "next/link";

import { Button } from "@acme/ui/button";
import { Card, CardHeader, CardTitle } from "@acme/ui/card";

import { StaffList } from "~/data-access/staffs.dta";

export default function PageClient({ loader }) {
  const staffs: StaffList = use(loader);

  return (
    <div>
      <div className="fixed bottom-0 right-0 m-4 mb-12">
        <Button asChild size={"icon"}>
          <Link href="/staff/create">+</Link>
        </Button>
      </div>
      <div className="space-y-4">
        {!staffs.length && <div>No Staff</div>}
        {staffs.map((staff) => (
          <Card key={staff.id}>
            <CardHeader>
              <CardTitle>{staff.name}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
