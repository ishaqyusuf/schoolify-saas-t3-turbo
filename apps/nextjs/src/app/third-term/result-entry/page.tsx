import { _addStudentAction } from "actions/example/add-student-action";
import { loadResultEntriesAction } from "actions/example/load-result-entries";

import { prisma } from "@acme/db";

import type { ClassCodes } from "~/lib/third-term/constants";
import ResultClassList from "~/components/result-class-list";
import { ManageClassroomSubjectFormSheet } from "~/components/sheets/manage-classroom-subject-form-sheet";
import StudentFormSheet from "~/components/sheets/student-form-sheet";
import { StudentAssessmentResultForm } from "~/components/sheets/student-result-form-sheet";
import { SubjectAssessmentFormSheet } from "~/components/sheets/subject-assessment-form-sheet";

export default async function Page({ searchParams }) {
  // const {classCodes,subjectCodes} =
  //   await prisma.exampleSubjectsOnClassRooms.deleteMany();
  const result = await loadResultEntriesAction(searchParams);
  // await _addStudentAction({
  //   classCode: "tamheedi2" as ClassCodes,
  //   classRoomId: 78,
  //   firstName: "أحمد",
  //   fathersName: "إبراهيم",
  //   otherName: "أجنجي",
  // });
  // await prisma.exampleStudents.update({
  //   where: { id: 411 },
  //   data: {
  //     classCode: "tamheedi2" as ClassCodes,
  //     exampleClassId: 78,
  //   },
  // });
  // await _addStudentAction({
  //   classCode: "tamheediC" as ClassCodes,
  //   classRoomId: 76,
  //   firstName: "سميّة",
  //   fathersName: "محمد",
  // });
  await Promise.all(
    [
      ["محمد", "يوسف"],
      ["إبراهيم", "إسحاق"],
      ["عبد الرحمان", "مصطفى"],
    ].map(async ([firstName, fathersName]) => {
      await _addStudentAction({
        classCode: "tamheediD" as ClassCodes,
        classRoomId: 77,
        firstName,
        fathersName,
      });
    }),
  );
  return (
    <>
      {result?.map((result, index) => (
        <ResultClassList key={index} data={result} />
      ))}
      <SubjectAssessmentFormSheet />
      <ManageClassroomSubjectFormSheet />
      <StudentAssessmentResultForm />
      <StudentFormSheet />
    </>
  );
}
