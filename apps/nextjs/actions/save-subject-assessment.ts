"use server";

import { prisma, Prisma } from "@acme/db";

import { actionClient } from "./safe-action";
import { saveJobAssessmentSchema } from "./schema";

export const saveJobAssessmentAction = actionClient
  .schema(saveJobAssessmentSchema)
  .action(async ({ parsedInput: data }) => {
    console.log(data);

    return await prisma.exampleClassSubjectAssessment.create({
      data: {
        obtainable: +data.obtainable,
        title: data.title,
        subjectsOnClassRoomsId: data.subjectsOnClassRoomsId,
      },
    });
  });
