import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export const useManageClassroomSubjectQuery = () => {
  const [params, setParams] = useQueryStates({
    subjectAssessmentForm: parseAsBoolean,
    subjectId: parseAsString,
  });
  const isOpened = !!params.subjectAssessmentForm;
  return {
    isOpened,
    params,
    open(subjectId) {
      setParams({
        subjectAssessmentForm: true,
        subjectId,
      });
    },
    close() {
      setParams(null);
    },
  };
};
