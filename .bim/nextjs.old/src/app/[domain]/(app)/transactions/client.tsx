"use client";

import { use } from "react";
import Link from "next/link";

import { Button } from "@acme/ui/button";
import { DataTable } from "@acme/ui/common/data-table/index";
import { TableCell } from "@acme/ui/common/data-table/table-cells";
import { useDataTable } from "@acme/ui/common/data-table/use-data-table-columns";
import { Icons } from "@acme/ui/common/icons";

import type { TransactionList } from "~/data-access/transactions.dta";
import Title from "../_components/header/title";

export default function PageClient({ loader }) {
  const items: TransactionList = use(loader);

  const table = useDataTable(
    items,
    {
      cellVariants: {
        size: "sm",
      },
      checkable: false,
    },
    (ctx) => [
      ctx.Column("data", ({ item }) => (
        <TableCell>
          <TableCell.Primary>
            {item.studentTermSheet?.student?.fullName}
          </TableCell.Primary>
          <div className="flex items-center">
            <TableCell.Secondary className="capitalize">
              {item.transactionType}
            </TableCell.Secondary>
            {/* <Icons.Dot className="" />
            <TableCell.Secondary className="capitalize">
              {item.paymentType}
            </TableCell.Secondary> */}
            <Icons.Dot className="" />
            <TableCell.Date format={"DD MMM YYYY"}>
              {item.createdAt}
            </TableCell.Date>
          </div>
        </TableCell>
      )),
      ctx.Column("amount", ({ item }) => (
        <TableCell align="right">
          <TableCell.Money value={item.amount} />
        </TableCell>
      )),
    ],
  );
  return (
    <div>
      <Title>Transactions</Title>
      <div className="fixed bottom-0 right-0 m-4 mb-12">
        <Button asChild size={"icon"}>
          <Link href="/transaction/create">+</Link>
        </Button>
      </div>
      <DataTable {...(table.props as any)}>
        <DataTable.Table />
      </DataTable>
    </div>
  );
}
