"use server";

import { prisma } from "@acme/db";

import { AsyncFnType } from "~/lib/types";

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
        },
      },
    },
  });
  return classroom;
}
