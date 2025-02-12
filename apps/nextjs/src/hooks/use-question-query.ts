import { parseAsString, useQueryStates } from "nuqs";

export const useQuestionQuery = () => {
  const [query, setQuery] = useQueryStates({
    questions: parseAsString,
  });
  return {
    query,
    setQuery,
  };
};
