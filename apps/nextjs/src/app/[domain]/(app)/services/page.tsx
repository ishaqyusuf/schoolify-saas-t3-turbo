import { getBillableServices } from "~/data-access/service.dta";
import { getStaffList } from "~/data-access/staffs.dta";
import PageClient from "./client";

export default async function StaffsPage() {
  const staffs = getBillableServices();
  return (
    <>
      <PageClient loader={staffs} />
    </>
  );
}
