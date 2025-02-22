import { loadResultEntriesAction } from "actions/load-result-entries";

import { prisma } from "@acme/db";

import ResultClassList from "~/components/result-class-list";
import { ResultEntrySideBar } from "~/components/result-entry-side-bar";
import { StudentAssessmentResultForm } from "~/components/sheets/student-result-form-sheet";
import { SubjectAssessmentFormSheet } from "~/components/sheets/subject-assessment-form-sheet";

export default async function Page({ searchParams }) {
  // const {classCodes,subjectCodes} =
  //   await prisma.exampleSubjectsOnClassRooms.deleteMany();
  const result = await loadResultEntriesAction(searchParams);
  return (
    <>
      {result?.map((result, index) => (
        <ResultClassList key={index} data={result} />
      ))}
      <SubjectAssessmentFormSheet />
      <StudentAssessmentResultForm />
    </>
  );
}
