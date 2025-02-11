"use server";

import { prisma } from "@acme/db";

import { Data } from "~/lib/third-term/store";

export async function loadDataAction(): Promise<{
  result: Partial<Data>;
}> {
  const questions = (
    await prisma.posts.findMany({
      where: {
        name: "question",
      },
      select: {
        id: true,
        data: true,
      },
    })
  ).map((data) => ({
    ...data,
    data: data.data as any,
  }));
  const studentData = await prisma.posts.findFirst({
    where: {
      name: "student-data",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return {
    result: {
      questions,
      dataLoaded: true,
      studentData: {
        raw: (studentData?.data as any)?.raw,
        id: studentData?.id,
      },
    },
  };
}
