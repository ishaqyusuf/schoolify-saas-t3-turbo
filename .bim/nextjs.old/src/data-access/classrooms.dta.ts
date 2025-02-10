"use server";

import type { TransactionType } from "@acme/db/schema";
import { and, eq } from "@acme/db";
import { db } from "@acme/db/client";
import {
  SessionClass,
  StaffService,
  StudentSessionSheet,
  StudentTermSheet,
} from "@acme/db/schema";

import { getAuthSession } from "~/lib/auth";

export type ClassroomList = NonNullable<
  Awaited<ReturnType<typeof getClassrooms>>
>;
export type TransactionForm = NonNullable<
  Awaited<ReturnType<typeof getClassroomForm>>
>;

export async function getClassrooms() {
  const auth = await getAuthSession();
  const list = await db.query.SessionClass.findMany({
    where: and(
      eq(SessionClass.academicSessionId, auth.workspace.sessionId as any),
    ),
    with: {
      classRoom: true,
    },
  });
  return list;
}
export async function getClassroomForm() {
  const auth = await getAuthSession();
  // const services = await getBillableServices();
  // const staffs = await getStaffList();
  return {
    // services,
    transactionType: null as any as TransactionType,
    // staffs,
    selection: {},
  };
}
export async function updateClassroom() {
  //
}
export async function createClassroom(serviceId, amount, workerIds: any[]) {
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

export async function setStudentClass({ sessionClassId, studentId }) {
  const auth = await getAuthSession();

  let sessionSheet = await db.query.StudentSessionSheet.findFirst({
    where: and(
      eq(StudentSessionSheet.sessionId, auth.workspace.sessionId as any),
      eq(StudentSessionSheet.studentId, studentId),
    ),
  });
  if (!sessionSheet) {
    //
    const [ss] = await db
      .insert(StudentSessionSheet)
      .values({
        sessionId: auth.workspace.sessionId,
        studentId,
        schoolId: auth.workspace.schoolId,
      })
      .returning();
    sessionSheet = ss;
  }
  if (!sessionSheet) throw new Error("Unable to find or create session sheet");
  const [termSheet] = await db
    .insert(StudentTermSheet)
    .values({
      sessionClassId,
      termId: auth.workspace.termId,
      sessionSheetId: sessionSheet.id,
      studentId,
    })
    .returning();
  return termSheet;
}
export async function updateStudentClass({ termSheetId, sessionClassId }) {
  const [termSheet] = await db
    .update(StudentTermSheet)
    .set({
      sessionClassId,
      updatedAt: new Date(),
    })
    .where(eq(StudentTermSheet.id, termSheetId))
    .returning();
}
