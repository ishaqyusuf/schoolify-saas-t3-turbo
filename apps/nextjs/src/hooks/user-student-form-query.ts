import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";

export const useStudentFormQuery = () => {
  const [query, setQuery] = useQueryStates({
    addStudent: parseAsBoolean,
    classRoomId: parseAsInteger,
    classCode: parseAsString,
  });
  return {
    ...query,
    setQuery,
    open(classRoomId, classCode) {
      setQuery({
        addStudent: true,
        classRoomId,
        classCode,
      });
    },
  };
};
