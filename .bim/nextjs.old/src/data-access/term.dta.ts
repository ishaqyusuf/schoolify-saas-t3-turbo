"use server";

import { eq } from "@acme/db";
import { db } from "@acme/db/client";
import { AcademicTerm } from "@acme/db/schema";

import { getAuthSession } from "~/lib/auth";

export async function createNextTermDta() {
  //
}
export async function getCurrentTermDta() {
  const auth = await getAuthSession();
  const term = await db.query.AcademicTerm.findFirst({
    // orderBy: {},
    where: eq(AcademicTerm.schoolId, auth.workspace.schoolId),
  });
}
