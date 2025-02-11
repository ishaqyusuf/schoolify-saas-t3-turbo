import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

import { param } from "@acme/db";

export const useQuestionForm = () => {
  const [params, setParams] = useQueryStates({
    questionForm: parseAsBoolean,
    questionId: parseAsString,
  });
  const isOpened = !!params.questionForm;
  return {
    isOpened,
    questionId: params.questionId,
    createQuestion() {
      setParams({
        questionForm: true,
        questionId: null,
      });
    },
    editQuestion(questionId) {
      setParams({
        questionForm: true,
        questionId,
      });
    },
    close() {
      setParams(null);
    },
  };
};
