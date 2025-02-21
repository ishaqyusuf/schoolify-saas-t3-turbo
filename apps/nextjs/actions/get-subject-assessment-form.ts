"use server";

import { prisma } from "@acme/db";

import { AsyncFnType } from "~/lib/types";

export type SubjectAssessmentForm = AsyncFnType<
  typeof getSubjectAssessmentFormAction
>;
export async function getSubjectAssessmentFormAction(id) {
  const data = await prisma.exampleSubjectsOnClassRooms.findFirst({
    where: { id },
    include: {
      classRoom: true,
      classRoomSubject: {
        include: {
          subject: true,
        },
      },
      assessments: {
        include: {
          _count: {
            select: {
              assessmentResults: true,
            },
          },
        },
      },
    },
  });
  const assessmentSuggestions =
    await prisma.exampleClassSubjectAssessment.findMany({
      select: {
        title: true,
        obtainable: true,
      },
      distinct: "title",
    });
  return {
    ...data,
    assessmentSuggestions,
  };
}
