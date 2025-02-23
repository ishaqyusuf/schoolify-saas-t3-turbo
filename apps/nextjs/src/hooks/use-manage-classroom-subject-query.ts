import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export const useManageClassroomSubjectQuery = () => {
  const [params, setParams] = useQueryStates({
    manageClassRoom: parseAsBoolean,
    manageClassroomId: parseAsString,
  });
  const isOpened = !!params.manageClassRoom;
  return {
    isOpened,
    ...params,
    open(manageClassroomId) {
      setParams({
        manageClassRoom: true,
        manageClassroomId,
      });
    },
    close() {
      setParams(null);
    },
  };
};
