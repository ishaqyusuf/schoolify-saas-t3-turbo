import { getStaffList } from "~/data-access/staffs.dta";
import PageClient from "./client";

export default async function StaffsPage() {
  const staffs = getStaffList();
  return (
    <>
      <PageClient loader={staffs} />
    </>
  );
}
