"use server";

import type { z } from "zod";

import { prisma } from "@acme/db";
import { generateRandomString } from "@acme/utils";

import type { addStudentSchema } from "./schema";
import { actionClient } from "./safe-action";
import { addSubjecSchema } from "./schema";

export const _addStudentAction = async ({
  firstName,
  fathersName,
  otherName,
  classCode,
  classRoomId,
}: z.infer<typeof addStudentSchema>) => {
  const student = await prisma.exampleStudents.upsert({
    where: {
      firstName_fathersName_otherName_classCode: {
        firstName,
        fathersName,
        otherName: otherName || "",
        classCode,
      },
    },
    update: {},
    create: {
      firstName,
      fathersName,
      otherName,
      classCode,
      studentCode: generateRandomString(5),
      studentString: ``,
      classRoom: {
        connect: {
          id: classRoomId,
        },
      },
    },
  });
  // const s = await prisma.
  return student;
};
export const addStudentAction = actionClient
  .schema(addSubjecSchema)
  .action(async ({ parsedInput: data }) => await _addStudentAction(data));
