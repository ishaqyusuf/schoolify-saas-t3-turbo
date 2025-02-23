"use server";

import { prisma } from "@acme/db";

import type { AsyncFnType } from "~/lib/types";
import { groupClassAssessment } from "~/lib/third-term/group-class-assessment";
import { actionClient } from "./safe-action";
import { getClassRoomAssessmentFormSchema } from "./schema";

export type ClassRoomAssessmentForm = AsyncFnType<
  typeof _getClassRoomAssessmentFormAction
>;
export const _getClassRoomAssessmentFormAction = async ({
  parsedInput: data,
}) => {
  const _data = await prisma.exampleClassRoom.findFirst({
    where: {
      id: data.classRoomId,
    },
    include: {
      students: {
        select: {
          id: true,
          firstName: true,
          otherName: true,
          fathersName: true,
        },
      },
      subjects: {
        include: {
          classRoomSubject: {
            select: {
              subject: {
                select: {
                  code: true,
                  title: true,
                },
              },
            },
          },
          assessments: {
            include: {},
          },
        },
      },
    },
  });

  const classList = await prisma.exampleClassRoom.findMany({
    where: {},
    select: {
      classCode: true,
      id: true,
      classTitle: true,
      students: {
        take: 1,
        select: {
          id: true,
        },
      },
    },
  });

  return {
    classRoom: _data,
    classList,
    groupedAssessments: groupClassAssessment(_data.subjects as any),
  };
};
export const getClassRoomAssessmentFormAction = actionClient
  .schema(getClassRoomAssessmentFormSchema)
  .action(_getClassRoomAssessmentFormAction);
