"use client";

import { use } from "react";
import Link from "next/link";

import { Button } from "@acme/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";

import { BillableServiceList } from "~/data-access/service.dta";
import { StaffList } from "~/data-access/staffs.dta";

export default function PageClient({ loader }) {
  const services: BillableServiceList = use(loader);

  return (
    <div>
      <div className="fixed bottom-0 right-0 m-4 mb-12">
        <Button asChild size={"icon"}>
          <Link href="/service/create">+</Link>
        </Button>
      </div>
      <div className="space-y-4">
        {!services.length && <div>No Service</div>}
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.amount}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
