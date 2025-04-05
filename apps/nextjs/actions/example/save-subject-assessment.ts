"use server";

import { prisma } from "@acme/db";

import { actionClient } from "./safe-action";
import { saveJobAssessmentSchema } from "./schema";

export const saveSubjectAssessmentAction = actionClient
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
