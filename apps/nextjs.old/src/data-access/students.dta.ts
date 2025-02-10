"use server";

import type { CreateStudentSchema } from "@acme/db/schema";
import { and, desc, eq, sql } from "@acme/db";
import { db } from "@acme/db/client";
import {
  AcademicTerm,
  Student,
  StudentSessionSheet,
  StudentTermSheet,
} from "@acme/db/schema";

import { getAuthSession } from "~/lib/auth";
import { formPayment, schoolFeePayment } from "./transactions.dta";

export type StudentsList = NonNullable<
  Awaited<ReturnType<typeof getStudentList>>
>;

export async function getStudentList() {
  const auth = await getAuthSession();

  // const s = await db.query.StudentSessionSheet.findMany({
  //   with: {
  //     terms: true,
  //   },
  // });
  // return [];
  const students = await db.query.Student.findMany({
    where: and(eq(Student.schoolId, auth.workspace.schoolId)),
    extras: {
      fullName:
        sql<string>`concat(${Student.firstName}, ' ', ${Student.surname}, ${Student.otherName})`.as(
          "full_name",
        ),
    },
    orderBy: (student, { asc }) =>
      asc(
        sql<string>`concat(${student.firstName}, ' ', ${student.surname}, ' ', ${student.otherName})`,
      ),
    with: {
      sessionSheets: {
        where: eq(
          StudentSessionSheet.sessionId,
          auth.workspace.sessionId as any,
        ),
        with: {
          terms: {
            with: {
              term: true,
              sessionClass: {
                with: {
                  classRoom: true,
                },
              },
            },
            orderBy: desc(
              sql`(SELECT DISTINCT ${AcademicTerm}."start_date" FROM ${AcademicTerm} WHERE ${AcademicTerm}."id" = ${StudentTermSheet.termId} LIMIT 1)`,
            ),
          },
        },
      },
    },
  });
  const resp = students.map((_student) => {
    const [sessionSheet] = _student.sessionSheets;
    const [lastTerm, prevTerm] = sessionSheet?.terms ?? [];
    let currentTerm = { ...(lastTerm ?? {}) };
    if (lastTerm?.term?.id != auth.workspace.termId) currentTerm = null as any;

    const _extras = {
      currentTerm,
      prevTerm: currentTerm ? prevTerm : lastTerm,
    };
    return {
      ..._student,
      ..._extras,
      classRoom:
        _extras.currentTerm?.sessionClass?.classRoom?.name ??
        _extras?.prevTerm?.sessionClass?.classRoom?.name,
      // _extras,
    };
  });
  return resp;
  // const list = await db.query.StudentTermSheet.findMany({
  //   extras: {
  //     //   fullName: sql<string>`
  //     //   concat(${Student.firstName}, ' ', ${Student.surname}, ' ', ${Student.otherName})
  //     // `.as("full_name"),
  //   },
  //   with: {
  //     // student: true,
  //     student: {
  //       columns: {
  //         firstName: true,
  //       },
  //       extras: {
  //         fullName:
  //           sql<string>`concat(${Student.firstName}, ' ', ${Student.surname}, ${Student.otherName})`.as(
  //             "full_name",
  //           ),
  //       },
  //     },
  //     SessionClass: {
  //       with: {
  //         classRoom: true,
  //       },
  //     },
  //   },
  //   orderBy: asc(
  //     sql`(SELECT DISTINCT ${Student}."first_name" FROM ${Student} WHERE ${Student}."id" = ${StudentTermSheet.studentId} LIMIT 1)`,
  //   ),
  //   // orderBy: (sheets, { asc }) => [
  //   //   asc(
  //   //     sql`concat(${sheets.studentId}, ' ', ${Student.surname}, ' ', ${Student.otherName})`,
  //   //   ),
  //   // ],
  //   // orderBy: Student.firstName,
  //   // orderBy: (sheets,{asc}) => [asc(sheets.)]
  // });
  // return list;
}

export async function getStudentNames() {
  const names = await db.query.Student.findMany({
    columns: {
      firstName: true,
      otherName: true,
      surname: true,
    },
  });
  return {
    names: Array.from(
      new Set(
        names
          .map(({ firstName, surname }) => [firstName, surname])
          .flat()
          .filter(Boolean),
      ),
    ),
    otherNames: Array.from(
      new Set(names.map(({ otherName }) => otherName).filter(Boolean)),
    ),
  };
}

export async function createStudentForm() {
  const auth = await getAuthSession();
  return {
    schoolId: auth.workspace.schoolId,
    extras: {},
  } as typeof CreateStudentSchema._type;
}
// type _type = CreateStudentSchema._type;
export async function createStudent(data: typeof CreateStudentSchema._type) {
  const auth = await getAuthSession();

  const { extras, ...rest } = data;
  rest.schoolId = auth.workspace.schoolId;
  const [student] = await db
    .insert(Student)
    .values({
      ...rest,
    })
    .onConflictDoNothing({
      target: [
        Student.firstName,
        Student.otherName,
        Student.surname,
        Student.schoolId,
      ],
    })
    .returning();
  if (!student) throw new Error("Student with name already exists");
  // console.log({ student, rest });
  const [sessionSheet] = await db
    .insert(StudentSessionSheet)
    .values({
      schoolId: rest.schoolId,
      studentId: student.id,
      sessionId: auth.workspace.sessionId,
    })
    .returning();
  if (!sessionSheet) throw new Error("Unable to create session sheet");
  const [termSheet] = await db
    .insert(StudentTermSheet)
    .values({
      termId: auth.workspace.termId,
      sessionClassId: extras.sessionClassId,
      sessionSheetId: sessionSheet.id,
      studentId: student.id,
    })
    .returning();

  if (extras.payments.form)
    await formPayment({
      studentTermId: termSheet?.id,
    });
  if (extras.payments.schoolFee)
    await schoolFeePayment({
      studentTermId: termSheet?.id,
      amount: Number(extras.payments.schoolFeeAmount),
    });
}
