import { desc } from "@acme/db";
import { db } from "@acme/db/client";
import { AcademicTerm } from "@acme/db/schema";
import { Badge } from "@acme/ui/badge";

import { getStudentList } from "~/data-access/students.dta";
import { getAuthSession } from "~/lib/auth";
import Client from "./client";

export default async function ListstudentsPage({ params }) {
  const domain = params.domain?.split(".")[0];
  const studentList = getStudentList();

  const auth = await getAuthSession();
  // const currentTerm = await db.query.AcademicTerm.findFirst({
  //   with: {},
  // });
  //   const studentByClass = await db.query.AcademicTerm
  return (
    <div className="container mx-auto p-4">
      {/* {JSON.stringify(terms)} */}

      <Client resp={studentList} />
    </div>
  );
}
