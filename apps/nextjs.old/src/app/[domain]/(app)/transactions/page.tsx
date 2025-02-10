import { Metadata } from "next";

import { getTransactions } from "~/data-access/transactions.dta";
import PageClient from "./client";

export const metadata: Metadata = {
  title: "Transactions",
};
export default async function TransactionsPage() {
  const staffs = getTransactions();
  return (
    <>
      <PageClient loader={staffs} />
    </>
  );
}
