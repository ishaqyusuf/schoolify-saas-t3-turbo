"use server";

import { prisma } from "~/lib/prisma";

// import { prisma } from "@acme/db";

export async function saveStudentDataAction(id, data) {
  const res = id
    ? await prisma.posts.update({
        where: { id },
        data: {
          name: "student-data",
          data: { raw: data },
        },
      })
    : await prisma.posts.create({
        data: {
          data: { raw: data },
          name: "student-data",
        },
      });
  return res;
}
