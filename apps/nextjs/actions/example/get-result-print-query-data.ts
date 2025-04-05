"use server";

import { prisma } from "@acme/db";

import { AsyncFnType } from "~/lib/types";

export type ResultPrintQueryData = AsyncFnType<typeof getResultPrintQueryData>;
export async function getResultPrintQueryData() {
  const classRooms = await prisma.exampleClassRoom.findMany({
    where: {},
    select: {
      classTitle: true,
      classCode: true,
    },
  });
  return {
    classRooms,
  };
}
