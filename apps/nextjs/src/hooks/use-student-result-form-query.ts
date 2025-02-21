import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export const useStudentResultFormQuery = () => {
  const [params, setParams] = useQueryStates({
    // subject: parseAsBoolean,
    resultForm: parseAsBoolean,
    subjectId: parseAsString,
    studentId: parseAsString,
  });
  const isOpened = !!params.resultForm;
  return {
    isOpened,
    params,
    open(studentId, subjectId) {
      setParams({
        resultForm: true,
        studentId,
        subjectId,
      });
    },
    close() {
      setParams(null);
    },
  };
};
