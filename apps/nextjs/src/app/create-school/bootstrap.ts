"use server";

import { db } from "@acme/db/client";
import {
  AcademicClass,
  AcademicSession,
  AcademicTerm,
  ClassSubject,
  School,
  SessionClass,
  Student,
  StudentSessionSheet,
  StudentTermSheet,
  Subjects,
  User,
} from "@acme/db/schema";

import type useDataTransform from "../exam-result/use-data-transform";
import { configs } from "../exam-result/data";

type Data = ReturnType<typeof useDataTransform>["data"];
export async function bootstrapSchool(data: Data) {
  const school = await createSchool();
  // BillableService
  //   return school;
  const startDate = new Date("2024-04-20");
  const endDate = new Date("2024-07-28");
  const session = await createSession(`1445/1446`, school, startDate);
  //   return session;

  const firstTerm = await createSessionTerm(
    `First Term`,
    session,
    startDate,
    endDate,
  );
  const secondTerm = await createSessionTerm(
    `Second Term`,
    session,
    new Date("2024-08-10"),
  );

  // create academic class
  const classes = await Promise.all(
    data.map(async (classData) => {
      // classData.className
      const academicClass = await createAcademicClass(
        classData.className,
        school,
      );
      //create sesson class
      const sessionClass = await createSessionClass(academicClass, session);
      // create Subjects
      const subjects = await createSubjects(classData.Subjects, {
        schoolId: school.id,
        academicSubClassId: academicClass.id,
        academicSessionId: session.id,
        sessionClassId: sessionClass.id,
      });
      // create students
      const students = await Promise.all(
        classData.results
          .filter((r) => r.firstName)
          .map(async (res) => {
            return await createStudentSessionData({
              firstName: res.firstName,
              otherName: res.otherName,
              schoolId: school.id,
              surname: res.surname,
              sessionClassId: sessionClass.id,
              academicTermId: firstTerm.id,
              sessionId: session.id,
            });
          }),
      );
      return { academicClass, subjects, students };
    }),
  );

  return {
    school,
    firstTerm,
    session,
    classes,
    studentList,
  };
}
const studentList = {};
function checkStudent(data, index = 0) {
  const { firstName, otherName, surname } = data;
  const std = [firstName, surname, otherName].filter(Boolean).join(" ");
  const _ind = studentList[std];
  if (_ind) {
    index++;
    data.otherName = index;
    return checkStudent(data, index);
  }
  studentList[std] = (_ind || 0) + 1;
  return data;
}
async function createStudentSessionData({
  firstName,
  otherName,
  surname,
  schoolId,
  sessionClassId,
  academicTermId,
  sessionId,
}) {
  const form = checkStudent({ firstName, otherName, surname });
  //   return;
  const student = __firstOrThrow(
    await db
      .insert(Student)
      .values({
        firstName,
        otherName: form.otherName,
        surname,
        schoolId,
      })
      .onConflictDoUpdate({
        set: { updatedAt: new Date() },
        target: [
          Student.firstName,
          Student.schoolId,
          Student.otherName,
          Student.surname,
        ],
      })
      .returning(),
  );
  const sessionSheet = __firstOrThrow(
    await db
      .insert(StudentSessionSheet)
      .values({
        schoolId,
        // SessionClassId,
        sessionId,
        studentId: student.id,
      })
      .returning()
      .onConflictDoUpdate({
        set: {
          updatedAt: new Date(),
        },
        target: [
          StudentSessionSheet.studentId,
          // StudentSessionSheet.SessionClassId,
          StudentSessionSheet.schoolId,
        ],
      }),
  );
  const termSheet = __firstOrThrow(
    await db
      .insert(StudentTermSheet)
      .values({
        sessionSheetId: sessionSheet.id,
        sessionClassId,
        studentId: student.id,

        termId: academicTermId,
      })
      .returning()
      .onConflictDoUpdate({
        set: {
          updatedAt: new Date(),
        },
        target: [
          StudentTermSheet.studentId,
          StudentTermSheet.sessionSheetId,
          StudentTermSheet.sessionClassId,
          StudentTermSheet.termId,
        ],
      }),
  );
  return { student, termSheet, sessionSheet };
}

async function createSubjects(
  subjects,
  { schoolId, academicSubClassId, academicSessionId, sessionClassId },
) {
  const _Subjects = await db
    .insert(Subjects)
    .values(
      subjects.map((name) => ({
        name,
        schoolId,
      })),
    )
    .onConflictDoUpdate({
      target: [Subjects.name, Subjects.schoolId],
      set: {
        updatedAt: new Date(),
      },
    })
    .returning();
  const ls = await db.query.ClassSubject.findMany();
  const ClassSubjects = ls.length
    ? ls
    : await db
        .insert(ClassSubject)
        .values(
          _Subjects.map((s) => ({
            schoolId,
            subjectId: s.id,
            sessionClassId,
            academicSubClassId,
            academicSessionId,
          })),
        )
        // .onConflictDoUpdate({
        //   target: [ClassSubject.AcademicSessionId, ClassSubject.subjectId],
        //   set: {
        //     updatedAt: new Date(),
        //   },
        // })
        .returning();
  return {
    ClassSubjects,
    _Subjects,
  };
}
async function createSessionClass(_class, acadSession) {
  return __firstOrThrow(
    await db
      .insert(SessionClass)
      .values({
        academicSubClassId: _class.id,
        schoolId: _class.schoolId,
        academicSessionId: acadSession.id,
      })
      .onConflictDoUpdate({
        target: [
          SessionClass.schoolId,
          SessionClass.academicSubClassId,
          SessionClass.academicSessionId,
        ],
        set: {
          updatedAt: new Date(),
        },
      })
      .returning(),
  );
}
async function createAcademicClass(name, school) {
  const [res] = await db
    .insert(AcademicClass)
    .values({
      name,
      schoolId: school.id,
    })
    .onConflictDoUpdate({
      target: [AcademicClass.schoolId, AcademicClass.name],
      set: {
        updatedAt: new Date(),
      },
    })
    .returning();
  if (!res) throw new Error("Invalid");
  return res;
}
function __firstOrThrow<T>(data: T[], error = "Not found") {
  const [f] = data;
  if (!f) throw new Error(error);
  return f;
}
async function createSessionTerm(name, session, startDate, endDate?) {
  return __firstOrThrow(
    await db
      .insert(AcademicTerm)
      .values({
        name,
        academicSessionId: session.id,
        schoolId: session.schoolId,
        startDate,
        endDate,
      })
      .onConflictDoUpdate({
        target: [
          AcademicTerm.schoolId,
          AcademicTerm.academicSessionId,
          AcademicTerm.name,
        ],
        set: {
          updatedAt: new Date(),
        },
      })
      .returning(),
  );
}
async function createSession(name, school, startDate, endDate?) {
  return __firstOrThrow(
    await db
      .insert(AcademicSession)
      .values({
        name,
        schoolId: school.id,
        startDate,
        endDate,
      })
      .onConflictDoUpdate({
        target: [AcademicSession.schoolId, AcademicSession.name],
        set: {
          updatedAt: new Date(),
        },
      })
      .returning(),
  );
}
async function createSchool() {
  const school = __firstOrThrow(
    await db
      .insert(School)
      .values({
        name: configs.schoolName,
        subDomain: `daarul-hadith`,
        meta: {},
      })
      .onConflictDoUpdate({
        target: [School.name, School.subDomain],
        set: {
          updatedAt: new Date(),
        },
      })
      .returning(),
    "Unable to create school",
  );
  const user = __firstOrThrow(
    await db
      .insert(User)
      .values({
        email: `ishaqyusuf024@gmail.com`,
        name: `Ishaq Yusuf`,
        role: "admin",
        schoolId: school.id,
      })
      .onConflictDoUpdate({
        target: [User.email, User.schoolId],
        set: {
          updatedAt: new Date(),
        },
      })
      .returning(),
  );
  return school;
}

export async function createSecondTerm() {
  //
  const startDate = new Date("10/08/2024");
}
