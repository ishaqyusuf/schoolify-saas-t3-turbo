import type { ClassRoomAssessmentForm } from "actions/get-classroom-assessment-form";
import type { GetStudentAssessmentForm } from "actions/get-student-assement-form";
import { useEffect, useState } from "react";
import { saveJobAssessmentAction } from "actions/save-student-assessment-action";
import { useAction } from "next-safe-action/hooks";

import { Input } from "@acme/ui/input";
import { generateRandomString, useDebounce } from "@acme/utils";

interface Props {
  studentData: GetStudentAssessmentForm;
  subjectAssessment: ClassRoomAssessmentForm["groupedAssessments"][number]["subjects"][number]["assessments"][number];
}
export function AssessmentInput({ studentData, subjectAssessment }: Props) {
  const data = studentData?.subjectAssessments
    .map((a) => a.assessments)
    .flat()
    .find((s) => s.classSubjectAssessmentId == subjectAssessment.id);
  const [value, setValue] = useState(data?.obtained);

  const [typing, setTyping] = useState(null);
  const [debounceValue] = useDebounce(typing, 300, {});

  const saveResult = useAction(saveJobAssessmentAction, {
    onSuccess(res) {
      //
      console.log("UPDATED");
      console.log(res.data);
    },
  });
  useEffect(() => {
    if (debounceValue) {
      saveResult.execute({
        obtained: value,
        studentId: studentData?.id,
        assessmentId: subjectAssessment.id,
        subjectOnClassRoomId: subjectAssessment.subjectsOnClassRoomsId,
      });
    }
  }, [debounceValue]);

  return (
    <Input
      type="number"
      max={100}
      onInput={(e) => {
        setTyping(generateRandomString(2));
      }}
      min={0}
      className=""
      value={value}
      onChange={(e) => {
        setValue(+e.target.value);
      }}
    />
  );
}
