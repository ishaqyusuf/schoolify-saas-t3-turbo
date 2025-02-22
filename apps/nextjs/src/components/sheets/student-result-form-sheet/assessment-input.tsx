import type { ClassRoomAssessmentForm } from "actions/get-classroom-assessment-form";
import type { GetStudentAssessmentForm } from "actions/get-student-assement-form";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (debounceValue) {
      //
      console.log({ value });
    }
  }, [debounceValue]);

  return (
    <Input
      type="number"
      max={100}
      onInput={(e) => {
        console.log("INPUT");
        setTyping(generateRandomString(2));
      }}
      min={0}
      className=""
      defaultValue={value}
      onChange={(e) => {
        setValue(+e.target.value);
      }}
    />
  );
}
