"use server";

import { prisma, Prisma } from "@acme/db";

import { actionClient } from "./safe-action";
import {
  deleteSubjectAssessmentSchema,
  saveJobAssessmentSchema,
} from "./schema";

export const deleteSubjectAssessmentAction = actionClient
  .schema(deleteSubjectAssessmentSchema)
  .action(async ({ parsedInput: data }) => {
    await prisma.exampleClassSubjectAssessment.delete({
      where: { id: data.id },
    });
  });
