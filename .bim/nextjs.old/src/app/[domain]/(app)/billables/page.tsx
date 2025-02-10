import { getBillables } from "~/data-access/billables.dta";
import PageClient from "./client";

export default async function StaffsPage() {
  const staffs = getBillables();
  return (
    <>
      <PageClient loader={staffs} />
    </>
  );
}
