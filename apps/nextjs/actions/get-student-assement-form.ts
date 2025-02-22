"use server";

import { prisma } from "@acme/db";

import type { AsyncFnType } from "~/lib/types";
import { _getClassRoomAssessmentFormAction } from "./get-classroom-assessment-form";
import { actionClient } from "./safe-action";
import { getStudentAssessmentFormSchema } from "./schema";

export type GetStudentAssessmentForm = AsyncFnType<
  typeof _getStudentAssessmentFormAction
>;

export const _getStudentAssessmentFormAction = async ({
  parsedInput: data,
}) => {
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
  const classRoomData: any = !data.classRoomId
    ? null
    : await _getClassRoomAssessmentFormAction({
        parsedInput: {
          classRoomId: data.classRoomId,
        },
      });
  return {
    ...studentAssessmentData,
    classRoomData,
  };
};
export const getStudentAssessmentFormAction = actionClient
  .schema(getStudentAssessmentFormSchema)
  .action(_getStudentAssessmentFormAction);
