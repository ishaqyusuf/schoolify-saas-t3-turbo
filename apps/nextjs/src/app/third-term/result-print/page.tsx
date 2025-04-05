import { loadResultEntriesAction } from "actions/example/load-result-entries";

import { prisma } from "@acme/db";

import ResultClassList from "~/components/result-class-list";
import ResultPrintClassList from "~/components/result-print-class-list";
import { ManageClassroomSubjectFormSheet } from "~/components/sheets/manage-classroom-subject-form-sheet";
import { StudentAssessmentResultForm } from "~/components/sheets/student-result-form-sheet";
import { SubjectAssessmentFormSheet } from "~/components/sheets/subject-assessment-form-sheet";

export default async function Page({ searchParams }) {
  // const {classCodes,subjectCodes} =
  //   await prisma.exampleSubjectsOnClassRooms.deleteMany();
  const result = await loadResultEntriesAction(searchParams);
  return (
    <>
      {result?.map((result, index) => (
        <ResultPrintClassList key={index} data={result} />
      ))}
      <SubjectAssessmentFormSheet />
      <ManageClassroomSubjectFormSheet />
      <StudentAssessmentResultForm />
    </>
  );
}
