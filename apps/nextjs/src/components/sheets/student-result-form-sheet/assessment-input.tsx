import type { ClassRoomAssessmentForm } from "actions/get-classroom-assessment-form";
import type { GetStudentAssessmentForm } from "actions/get-student-assement-form";
import { useEffect, useState } from "react";
import { saveSubjectAssessmentAction } from "actions/save-student-assessment-action";
import { motion } from "framer-motion";
import { useAction } from "next-safe-action/hooks";

import { Icons } from "@acme/ui/common/icons";
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
  const [focus, setFocus] = useState(false);
  const saveResult = useAction(saveSubjectAssessmentAction, {
    onSuccess(res) {
      console.log(res.data);
    },
  });
  useEffect(() => {
    if (focus) saveResult.reset();
  }, [focus]);
  useEffect(() => {
    if (debounceValue) {
      saveResult.execute({
        obtained: value || 0,
        studentId: studentData?.id,
        assessmentId: subjectAssessment.id,
        subjectOnClassRoomId: subjectAssessment.subjectsOnClassRoomsId,
      });
    }
  }, [debounceValue]);
  const borderColor =
    saveResult.hasSucceeded && focus
      ? "#16a34a" // Green (Success)
      : saveResult.hasErrored
        ? "#dc2626" // Red (Error)
        : focus
          ? "#2563eb" // Blue (Focus)
          : "#e5e7eb"; // Gray (Default)

  return (
    <motion.div
      className="relative w-24 rounded-lg p-0.5"
      // animate={{ borderColor }}
      transition={{ duration: 0.3 }}
      // style={{ borderWidth: 2 }}
    >
      <motion.input
        type="number"
        max={100}
        min={0}
        className="[&::-webkit-outer-spin-button]:appearance-non h-8 w-20 appearance-none rounded-md bg-white px-2 outline-none [&::-webkit-inner-spin-button]:appearance-none"
        value={value}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onInput={() => setTyping(generateRandomString(2))}
        onChange={(e) => setValue(e.target.value === "" ? "" : +e.target.value)}
        animate={{ borderColor }}
        transition={{ duration: 0.3 }}
        style={{ borderWidth: 2 }}
      />
    </motion.div>
  );
  return (
    <motion.div
      className="relative w-24 rounded-lg p-0.5"
      animate={{
        borderColor: saveResult.hasSucceeded
          ? "#16a34a" // Green (Success)
          : saveResult.hasErrored
            ? "#dc2626" // Red (Error)
            : focus
              ? "#2563eb" // Blue (Focus)
              : "#e5e7eb", // Default (Gray)
      }}
      transition={{ duration: 0.3 }}
      style={{ borderWidth: 2 }}
    >
      <Input
        type="number"
        max={100}
        onInput={(e) => {
          setTyping(generateRandomString(2));
        }}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={(e) => {
          setFocus(false);
        }}
        min={0}
        className="h-8 w-20"
        value={value}
        onChange={(e) => {
          setValue(+e.target.value || ("" as any));
        }}
      />
    </motion.div>
  );
}
