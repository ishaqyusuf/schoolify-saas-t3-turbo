import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { classCodes, subjectCodes } from "~/lib/third-term/constants";

export const useResultPrintQuery = () => {
  const [query, setQuery] = useQueryStates(
    {
      classCodes: parseAsStringEnum(classCodes),
      paperSize: parseAsString,
      sort: parseAsString,
    },
    {
      shallow: false,
    },
  );
  return {
    ...query,
    query,
    setQuery,
  };
};
