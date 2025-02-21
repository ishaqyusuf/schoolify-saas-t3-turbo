"use action";

import { actionClient } from "./safe-action";
import { getStudentAssessmentFormSchema } from "./schema";

export const getStudentAssessmentFormAction = actionClient
  .schema(getStudentAssessmentFormSchema)
  .action(async ({ parsedInput: data }) => {});
