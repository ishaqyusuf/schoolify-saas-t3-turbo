"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { and, eq } from "@acme/db";
import { db } from "@acme/db/client";
import { StaffSessionScheet, StaffTermSheet, User } from "@acme/db/schema";

import { getAuthSession } from "~/lib/auth";
import { firstOrThrow } from "~/lib/helper";

export type StaffList = NonNullable<Awaited<ReturnType<typeof getStaffList>>>;

export async function getStaffList() {
  const auth = await getAuthSession();

  const staffs = await db.query.User.findMany({
    where: and(
      eq(User.schoolId, auth.workspace.schoolId),
      eq(User.role, "teacher"),
    ),
    with: {},
  });

  return staffs;
}
export async function saveStaff(data) {
  const auth = await getAuthSession();
  // return await db.transaction(async (tx) => {
  const tx = db;
  const staff = firstOrThrow(
    await tx
      .insert(User)
      .values({
        schoolId: auth.workspace.schoolId,
        role: "teacher",
        ...data,
      })
      .returning(),
  );
  // console.log("staff created", staff);
  const sessionSheet = firstOrThrow(
    await tx
      .insert(StaffSessionScheet)
      .values({
        sessionId: auth.workspace.sessionId,
        schoolId: auth.workspace.schoolId,
        staffId: staff?.id,
      })
      .returning(),
  );
  // console.log({ sessionSheet });
  const staffTermSheet = firstOrThrow(
    await tx
      .insert(StaffTermSheet)
      .values({
        schoolId: auth.workspace.schoolId,
        sessionSheetId: sessionSheet?.id,
        termId: auth.workspace.termId,
        staffId: staff?.id,
      })
      .returning(),
  );
  // console.log({ staffTermSheet });
  // redirect("/staffs");
  revalidatePath("/staff/create");
  return staff;
  // });
}
