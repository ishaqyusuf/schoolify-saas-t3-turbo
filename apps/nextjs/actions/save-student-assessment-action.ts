"use server";

import { prisma, Prisma } from "@acme/db";

import { actionClient } from "./safe-action";
import { saveStudentAssessmentSchema } from "./schema";

export const saveSubjectAssessmentAction = actionClient
  .schema(saveStudentAssessmentSchema)
  .action(async ({ parsedInput: data }) => {
    return;
    data.obtained = data.obtained || null;

    return prisma.$transaction((async (tx: typeof prisma) => {
      const studentSubjectAssessment =
        await tx.exampleStudentSubjectAssessment.upsert({
          where: {
            studentId_subjectsOnClassRoomsId: {
              studentId: data.studentId,
              subjectsOnClassRoomsId: data.subjectOnClassRoomId,
            },
          },
          create: {
            studentId: data.studentId,
            subjectsOnClassRoomsId: data.subjectOnClassRoomId,
          },
          update: {},
        });

      const assessment = await tx.exampleStudentAssessment.upsert({
        where: {
          studentId_studentSubjectAssessmentId_classSubjectAssessmentId: {
            studentId: data.studentId,
            studentSubjectAssessmentId: studentSubjectAssessment.id,
            classSubjectAssessmentId: data.assessmentId,
          },
        },
        update: {
          obtained: data.obtained,
        },
        create: {
          studentId: data.studentId,
          studentSubjectAssessmentId: studentSubjectAssessment.id,
          classSubjectAssessmentId: data.assessmentId,
          obtained: data.obtained,
        },
      });
      return {
        success: true,
        studentAssessmentId: assessment.id,
      };
    }) as any);
  });
