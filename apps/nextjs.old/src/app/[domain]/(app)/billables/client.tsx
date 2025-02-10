"use client";

import { use } from "react";
import Link from "next/link";

import { Button } from "@acme/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";

import type { BillableList } from "~/data-access/billables.dta";
import Title from "../_components/header/title";

export default function PageClient({ loader }) {
  const services: BillableList = use(loader);

  return (
    <div className="p-4">
      <Title>Billables</Title>
      <div className="fixed bottom-0 right-0 m-4 mb-12">
        <Button asChild size={"icon"}>
          <Link href="/billable/create">+</Link>
        </Button>
      </div>
      <div className="space-y-4">
        {!services.length && <div>No Service</div>}
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle>{service.staff.name}</CardTitle>
              <CardDescription>
                <div className="inline-flex space-x-2">
                  <span>{service.amount}</span>
                  <span>{service.service?.title}</span>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
