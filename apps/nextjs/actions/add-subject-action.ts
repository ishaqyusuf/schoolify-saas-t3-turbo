"use server";

import type { z } from "zod";

import { prisma } from "@acme/db";

import { actionClient } from "./safe-action";
import { addSubjecSchema } from "./schema";

export const _addSubjectAction = async (
  data: z.infer<typeof addSubjecSchema>,
) => {
  const subject = await prisma.exampleSubject.upsert({
    where: {
      title: data.title,
    },
    update: {},

    create: {
      title: data.title,
      code: data.code,
    },
  });
  console.log({ data, subject });

  const classSubject = await prisma.exampleClassSubjects.upsert({
    where: {
      classGroupCode_subjectCode: {
        classGroupCode: data.classGroupCode,
        subjectCode: subject.code,
      },
    },
    create: {
      classGroupCode: data.classGroupCode,
      // subjectCode: subject.code,
      subject: {
        connect: {
          id: subject.id,
        },
      },
      classRooms: {
        create: {
          classRoomId: data.classRoomId,
        },
        // connectOrCreate: {
        //   where: {
        //     classRoomSubjectId_classRoomId: {
        //       classRoomSubjectId: classSubject.id,
        //     },
        //   },
        // },
        // connect: {
        //   id: data.classRoomId,
        // },
      },
    },
    update: {
      classRooms: {
        connect: {
          id: data.classRoomId,
        },
      },
    },
  });
  console.log(data);
  console.log(">>>>>");
  console.log(classSubject);

  const subjectOnClassRoom = await prisma.exampleSubjectsOnClassRooms.upsert({
    where: {
      classRoomSubjectId_classRoomId: {
        classRoomSubjectId: classSubject.id,
        classRoomId: data.classRoomId,
      },
    },
    update: {},
    create: {
      classRoomSubjectId: classSubject.id,
      classRoomId: data.classRoomId,
    },
    include: {
      assessments: true,
      classRoomSubject: {
        include: {
          subject: true,
        },
      },
    },
  });
  return subjectOnClassRoom;
};
export const addSubjectAction = actionClient
  .schema(addSubjecSchema)
  .action(async ({ parsedInput: data }) => await _addSubjectAction(data));
