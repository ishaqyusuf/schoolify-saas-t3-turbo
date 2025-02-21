"use server";

import { prisma } from "@acme/db";

import { AsyncFnType } from "~/lib/types";

export type ResultEntries = AsyncFnType<typeof loadResultEntriesAction>;
export async function loadResultEntriesAction(searchParams) {
  const { classCodes, subjectCodes } = searchParams;

  const list = await prisma.exampleClassRoom.findMany({
    where: {
      classCode: classCodes
        ? {
            in: classCodes?.split(","),
          }
        : undefined,
    },
    include: {
      subjects: {
        include: {
          classRoomSubject: {
            include: {
              subject: true,
            },
          },
          assessments: true,
        },
      },
      students: {
        include: {
          assessmentResults: true,
        },
      },
    },
  });
  return list;
}
