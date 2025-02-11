"use server";

import { prisma } from "@acme/db";

export async function saveQuestionAction(id, data) {
  const res = id
    ? await prisma.posts.update({
        where: { id },
        data: {
          data,
        },
      })
    : await prisma.posts.create({
        data: {
          data,
          name: "question",
        },
      });
  return res;
}
