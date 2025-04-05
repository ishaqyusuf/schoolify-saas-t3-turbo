"use server";

import type { Prisma } from "@acme/db";
import { prisma as basePrisma } from "@acme/db";
import { generateRandomString } from "@acme/utils";

import type { ClassCodes } from "~/lib/third-term/constants";
import { composeStudent } from "~/lib/third-term/compose-students";
import {
  classSubjectsByCode,
  subjectsByCode,
} from "~/lib/third-term/constants";
import { getClassRoomData } from "~/lib/third-term/student-dump-utils";
import { loadDataAction } from "./load-data";

export const truncateData = async () => {
  // return;
  // await basePrisma
  //   .$transaction(async (tx) => {
  const tx = basePrisma;
  console.log("DELETING>>>");
  await tx.exampleSubjectsOnClassRooms.deleteMany();
  console.log("DELETING>>>1");
  await tx.exampleClassRoom.deleteMany();
  console.log("DELETING>>>2");
  await tx.exampleClassSubjects.deleteMany();
  console.log("DELETING>>>3");
  await tx.exampleSubject.deleteMany();
  await tx.exampleStudents.deleteMany();
  console.log("DELETED>>>");
};
export const dumpStudentData = async (...classCodes: ClassCodes[]) => {
  const sData = await loadDataAction();
  const classRooms = composeStudent(sData.result.studentData.raw);
  // await truncate();
  const transaction = async (prisma: typeof basePrisma) => {
    const subjects = await prisma.exampleSubject.createMany({
      skipDuplicates: true,
      data: Object.entries(subjectsByCode).map(([code, title]) => ({
        title,
        code,
      })),
    });
    return await Promise.all(
      classRooms
        .filter((c) => classCodes?.includes(c.code))
        .map(async (cRoom) => {
          const classRoomData = getClassRoomData(cRoom.code);
          const createManyClassSubjectData = classSubjectsByCode[
            classRoomData.classCode
          ]?.map((code) => {
            return {
              subjectCode: code,
              classGroupCode: classRoomData.classGroupCode,
            };
          });

          await prisma.exampleClassSubjects.createManyAndReturn({
            skipDuplicates: true,
            include: {
              subject: true,
            },
            data: createManyClassSubjectData,
          });
          console.log({ createManyClassSubjectData });
          console.log({ classRoomData });

          const classRoom = await prisma.exampleClassRoom.upsert({
            where: {
              classCode_classTitle_classGroupCode: {
                classCode: classRoomData.classCode,
                classTitle: classRoomData.classTitle,
                classGroupCode: classRoomData.classGroupCode,
              },
            },
            update: {},
            create: {
              classCode: classRoomData.classCode,
              classTitle: classRoomData.classTitle,
              classGroupCode: classRoomData.classGroupCode,
            },
          });
          console.log({ classRoom });
          console.log(`CLASSROOM: ${classRoom?.id}`);

          const classSubjects = await prisma.exampleClassSubjects.findMany({
            where: {
              classGroupCode: classRoomData.classGroupCode,
            },
            include: { subject: true },
          });
          console.log({ classSubjects });

          const subjectsOnClass =
            await prisma.exampleSubjectsOnClassRooms.createManyAndReturn({
              skipDuplicates: true,
              data: classSubjects?.map((cs) => ({
                classRoomSubjectId: cs?.id,
                classRoomId: classRoom.id,
              })),
            });
          const studentsData: Prisma.ExampleStudentsCreateManyInput[] =
            cRoom.students?.map((student) => ({
              classCode: cRoom.code,
              fathersName: student.middleName,
              firstName: student.firstName,
              otherName: student.lastName,
              studentCode: generateRandomString(5),
              studentString: student.text,
              exampleClassId: classRoom.id,
            }));
          const missingName = studentsData.filter(
            (a) => !a.fathersName || !a.firstName,
          );
          if (missingName.length) {
            console.log(missingName);
            throw new Error("missing names");
          }
          const resp = await prisma.exampleStudents.createManyAndReturn({
            skipDuplicates: true,
            data: studentsData,
          });
          console.log({ students: resp.length });
          // throw new Error("BREAK");
        }),
    );
  };
  const resp = await basePrisma.$transaction(transaction, {
    timeout: 10000,
  });
  return resp;
  // return await transaction(basePrisma);
  // };

  //     }),
  //   );
  // }) as any);
};
