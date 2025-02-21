import { parseAsStringEnum, useQueryStates } from "nuqs";

import { classCodes, subjectCodes } from "~/lib/third-term/constants";

export const useResultEntryQuery = () => {
  const [query, setQuery] = useQueryStates({
    classCodes: parseAsStringEnum(classCodes),
    subjectCodes: parseAsStringEnum(subjectCodes),
  });
  return {
    query,
    setQuery,
  };
};
