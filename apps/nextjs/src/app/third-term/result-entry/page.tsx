import { loadResultEntriesAction } from "actions/load-result-entries";

import { prisma } from "@acme/db";

import ResultClassList from "~/components/result-class-list";
import { ResultEntrySideBar } from "~/components/result-entry-side-bar";
import { SubjectAssessmentFormSheet } from "~/components/sheets/subject-assessment-form-sheet";

export default async function Page({ searchParams }) {
  // const {classCodes,subjectCodes} =
  //   await prisma.exampleSubjectsOnClassRooms.deleteMany();
  const result = await loadResultEntriesAction(searchParams);
  return (
    <>
      {result?.map((result) => (
        <ResultClassList key={result.id} data={result} />
      ))}
      <SubjectAssessmentFormSheet />
    </>
  );
}
