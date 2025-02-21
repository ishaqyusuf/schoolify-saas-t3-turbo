"use server";

import { prisma } from "@acme/db";

import { actionClient } from "./safe-action";
import { getStudentAssessmentFormSchema } from "./schema";

export const getStudentAssessmentFormAction = actionClient
  .schema(getStudentAssessmentFormSchema)
  .action(async ({ parsedInput: data }) => {
    console.log(data);

    const studentAssessmentData = await prisma.exampleStudents.findFirst({
      where: {
        id: data.studentId,
      },
      include: {
        subjectAssessments: {
          include: {
            assessments: {},
          },
        },
      },
    });
    return studentAssessmentData;
  });
