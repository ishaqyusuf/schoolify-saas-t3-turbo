"use server";

import type { CreatePaymentSchema, TransactionType } from "@acme/db/schema";
import { and, eq, sql } from "@acme/db";
import { db } from "@acme/db/client";
import { StaffService, Student, Transaction } from "@acme/db/schema";

import { getAuthSession } from "~/lib/auth";

export type TransactionList = NonNullable<
  Awaited<ReturnType<typeof getTransactions>>
>;
export type TransactionForm = NonNullable<
  Awaited<ReturnType<typeof getTransactionForm>>
>;

export async function getTransactions() {
  const auth = await getAuthSession();
  const list = await db.query.Transaction.findMany({
    where: and(
      eq(Transaction.schoolId, auth.workspace.schoolId),
      eq(Transaction.termId, auth.workspace.termId),
    ),
    with: {
      // staff: true,
      // service: true,
      // staffTx: true,
      staffTermSheet: {
        with: {
          user: true,
        },
      },
      studentTermSheet: {
        with: {
          student: {
            extras: {
              fullName: sql<string>`
                    concat(${Student.firstName}, ' ', ${Student.surname}, ' ', ${Student.otherName})
                  `.as("full_name"),
            },
          },
        },
      },
    },
  });
  return list;
}
export async function getTransactionForm() {
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

export async function formPayment({ studentTermId }) {
  const auth = await getAuthSession();
  const [tx] = await db
    .insert(Transaction)
    .values({
      amount: "1000",
      studentTermId,
      paymentType: "deposit",
      schoolId: auth.workspace.schoolId,
      termId: auth.workspace.termId,
      transactionType: "entry form",
    })
    .returning();
}
export async function schoolFeePayment({ studentTermId, amount }) {
  const auth = await getAuthSession();
  const [tx] = await db
    .insert(Transaction)
    .values({
      amount,
      studentTermId,
      paymentType: "deposit",
      schoolId: auth.workspace.schoolId,
      termId: auth.workspace.termId,
      transactionType: "school fee",
    })
    .returning();
}
export async function studentPayment(data: typeof CreatePaymentSchema._type) {
  const auth = await getAuthSession();
  const [tx] = await db
    .insert(Transaction)
    .values({
      ...(data as any),
      paymentType: "deposit",
      schoolId: auth.workspace.schoolId,
      termId: auth.workspace.termId,
    })
    .returning();
}
export async function uniformPayment({ amount, studentTermId }) {
  await studentPayment({
    amount,
    studentTermId,
    transactionType: "uniform",
  });
}
