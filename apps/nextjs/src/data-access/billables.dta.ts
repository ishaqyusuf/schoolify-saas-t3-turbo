"use server";

import { and, eq } from "@acme/db";
import { db } from "@acme/db/client";
import { BatchStaffService, StaffService } from "@acme/db/schema";

import { getAuthSession } from "~/lib/auth";
import { getBillableServices } from "./service.dta";
import { getStaffList } from "./staffs.dta";

export type BillableList = NonNullable<
  Awaited<ReturnType<typeof getBillables>>
>;
export type BillableForm = NonNullable<
  Awaited<ReturnType<typeof getBillableForm>>
>;

export async function getBillables() {
  const auth = await getAuthSession();
  const list = await db.query.BatchStaffService.findMany({
    where: and(
      eq(BatchStaffService.schoolId, auth.workspace.schoolId),
      eq(BatchStaffService.termId, auth.workspace.termId),
    ),
    with: {
      // staff: true,
      staffServices: true,
      // staffTx: true,
    },
  });
  return list;
}
export async function getBillableForm(batchId?) {
  const auth = await getAuthSession();
  const services = await getBillableServices();
  const staffs = await getStaffList();

  return {
    services,
    serviceId: null,
    staffs,
    selection: {},
  };
}
export async function createBillables(serviceId, amount, workerIds: any[]) {
  const auth = await getAuthSession();
  await db.insert(StaffService).values(
    workerIds.map((staffId) => ({
      schoolId: auth.workspace.schoolId,
      staffId,
      amount,
      serviceId,
      termId: auth.workspace.termId,
    })),
  );
}
