"use server";

import { prisma } from "@acme/db";

import type { AsyncFnType } from "~/lib/types";

export type ClassRoomSubjectManager = AsyncFnType<
  typeof getClassroomSubjectManager
>;
export async function getClassroomSubjectManager(classRoomId) {
  const classroom = await prisma.exampleClassRoom.findFirst({
    where: { id: classRoomId },
    include: {
      subjects: {
        include: {
          assessments: true,
          classRoomSubject: {
            include: {
              subject: true,
            },
          },
        },
      },
    },
  });
  const assessments = await prisma.exampleClassSubjectAssessment.findMany({
    distinct: "title",
  });
  return { classroom, assessments };
}
