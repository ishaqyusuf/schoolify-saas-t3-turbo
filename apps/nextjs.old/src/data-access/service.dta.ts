"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { and, eq } from "@acme/db";
import { db } from "@acme/db/client";
import {
  BatchStaffService,
  BillableService,
  StaffService,
  StaffSessionScheet,
  StaffTermSheet,
  User,
} from "@acme/db/schema";

import { getAuthSession } from "~/lib/auth";
import { firstOrThrow } from "~/lib/helper";

export type BillableServiceList = NonNullable<
  Awaited<ReturnType<typeof getBillableServices>>
>;

export async function getBillableServices() {
  const auth = await getAuthSession();
  const staffs = await db.query.BillableService.findMany({
    where: and(eq(BillableService.schoolId, auth.workspace.schoolId)),
    with: {},
  });
  return staffs;
}
export async function saveService(data) {
  const auth = await getAuthSession();
  // return await db.transaction(async (tx) => {
  const tx = db;
  const service = firstOrThrow(
    await tx
      .insert(BillableService)
      .values({
        schoolId: auth.workspace.schoolId,
        ...data,
      })
      .returning(),
  );
  return service;
  // });
}

export async function getBatchService(id) {
  const auth = await getAuthSession();
  let batch = await db.query.BatchStaffService.findFirst({
    where: eq(BatchStaffService.id, id),
    with: {
      staffServices: {
        with: {
          costs: {
            with: {
              service: true,
            },
          },
          staff: true,
        },
      },
    },
  });
  if (!batch)
    batch = {
      staffServices: [],
    } as any;
  return batch;
}
