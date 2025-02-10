import { desc } from "@acme/db";
import { db } from "@acme/db/client";
import { AcademicTerm } from "@acme/db/schema";

export async function getAuthSession() {
  const term = await db.query.AcademicTerm.findFirst({
    orderBy: desc(AcademicTerm.startDate),
  });
  if (!term) throw Error();
  const res = {
    workspace: {
      termId: term.id,
      sessionId: term.academicSessionId,
      domain: "daarul-hadith",
      schoolId: term.schoolId,
      title: `1445/1446 2nd Term`,
    },
  };
  return res as any as NonNullable<typeof res>;
}
