import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export const useStudentResultFormQuery = () => {
  const [params, setParams] = useQueryStates({
    // subject: parseAsBoolean,
    resultForm: parseAsBoolean,
    subjectId: parseAsString,
    studentId: parseAsString,
    classroomId: parseAsString,
  });
  const isOpened = !!params.resultForm;
  return {
    isOpened,
    ...params,
    setParams,
    open(studentId, subjectId, classroomId) {
      setParams({
        resultForm: true,
        studentId,
        subjectId,
        classroomId,
      });
    },
    close() {
      setParams(null);
    },
  };
};
